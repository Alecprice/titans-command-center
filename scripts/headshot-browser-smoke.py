import json
import math
import os
import time
from pathlib import Path
from urllib.request import Request, urlopen

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT=Path('/tmp/headshot-browser-smoke.json')
MIN_HEADSHOT_COVERAGE=0.85

def wait_for(driver,script,timeout=12):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script(f'return Boolean({script})'))

def loaded_images(driver,selector):
    return driver.execute_script("""return [...document.querySelectorAll(arguments[0])].filter(img=>img.complete&&img.naturalWidth>20&&img.naturalHeight>20).length""",selector)

def wait_for_loaded_images(driver,selector,minimum=1,timeout=12):
    def ready(d):
        count=loaded_images(d,selector)
        return count if count>=minimum else False
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(ready)

def overflow(driver):
    return driver.execute_script("return document.documentElement.scrollWidth > document.documentElement.clientWidth + 3")

def api_json(path):
    request=Request(
        f'{BASE}{path}',
        headers={
            'Accept':'application/json',
            'Cache-Control':'no-cache, no-store',
            'Pragma':'no-cache',
            'User-Agent':'TitansCommandCenter-HeadshotBrowserAudit/1.0',
        },
    )
    with urlopen(request,timeout=15) as response:
        if response.status != 200:
            raise RuntimeError(f'{path} returned HTTP {response.status}')
        return json.load(response)

def prepare_returning_user(driver):
    driver.get(f'{BASE}/')
    driver.execute_script("""
      localStorage.setItem('titans:v10Onboarded','1');
      document.querySelector('#v10-onboarding [data-v10-close]')?.click();
    """)
    WebDriverWait(driver,5,poll_frequency=.1).until(lambda d:not d.find_elements(By.CSS_SELECTOR,'#v10-onboarding'))

options=webdriver.ChromeOptions()
options.add_argument('--headless=new')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1440,1000')
options.set_capability('goog:loggingPrefs',{'browser':'ALL'})
driver=None
started=time.time();stage='starting'
expected_roster=0
minimum_headshots=1
try:
    stage='current-roster-contract'
    data_api=api_json(f'/api/data?audit=headshot-{int(time.time())}')
    current_roster=data_api.get('roster')
    if not data_api.get('ok') or not isinstance(current_roster,list) or len(current_roster)<53:
        raise RuntimeError(f'Current Data API roster is invalid: {len(current_roster) if isinstance(current_roster,list) else 0} rows')
    expected_roster=len(current_roster)
    minimum_headshots=max(1,math.ceil(expected_roster*MIN_HEADSHOT_COVERAGE))

    stats_api=api_json('/api/preseason-stats')
    stats_roster_count=int(stats_api.get('rosterCount') or 0)
    if not stats_api.get('ok') or stats_roster_count != expected_roster:
        raise RuntimeError(f'Stats Lab roster count {stats_roster_count} does not match Data API current roster {expected_roster}')

    driver=webdriver.Chrome(options=options)
    driver.set_page_load_timeout(20)
    driver.set_script_timeout(5)
    prepare_returning_user(driver)

    stage='roster-load'
    driver.get(f'{BASE}/#roster')
    wait_for(driver,f"document.querySelectorAll('.player-card').length >= {expected_roster}")
    wait_for(driver,f"document.querySelectorAll('.player-card .jersey.has-headshot img').length >= {minimum_headshots}")
    driver.execute_script("document.querySelector('.player-card .jersey.has-headshot img')?.scrollIntoView({block:'center'})")
    roster_photos=wait_for_loaded_images(driver,'.player-card .jersey.has-headshot img')
    roster_total=driver.execute_script("return document.querySelectorAll('.player-card').length")
    roster_decorated=driver.execute_script("return document.querySelectorAll('.player-card .jersey.has-headshot img').length")
    if roster_total != expected_roster: raise RuntimeError(f'Roster browser rendered {roster_total} cards; Data API current roster has {expected_roster}')
    if roster_decorated < minimum_headshots: raise RuntimeError(f'Roster headshot coverage is {roster_decorated}/{expected_roster}; minimum is {minimum_headshots}')
    if roster_photos < 1: raise RuntimeError('No visible roster headshot loaded successfully')
    if overflow(driver): raise RuntimeError('Roster headshots introduced horizontal overflow')

    stage='rich-player'
    player_link=driver.find_element(By.CSS_SELECTOR,'.player-card:has(.jersey.has-headshot img)')
    driver.execute_script("arguments[0].scrollIntoView({block:'center'})",player_link)
    player_link.click()
    wait_for(driver,"location.hash.startsWith('#player')",timeout=6)
    wait_for(driver,"document.querySelector('.player-profile-rich')")
    rich_photo=wait_for_loaded_images(driver,'.player-rich-number.has-headshot img')
    rich_name=driver.execute_script("return document.querySelector('.player-rich-copy h1')?.textContent?.trim()||''")

    stage='stats-load'
    stats_player_selector='#ps-roster-wrap .ps-player'
    stats_headshot_selector='#ps-roster-wrap .ps-player .ps-number.has-headshot img'
    driver.get(f'{BASE}/#stats')
    wait_for(driver,"document.querySelector('.preseason-stats-hub')",timeout=15)
    wait_for(driver,f"document.querySelectorAll('{stats_player_selector}').length >= {expected_roster}",timeout=15)
    wait_for(driver,f"document.querySelectorAll('{stats_headshot_selector}').length >= {minimum_headshots}",timeout=15)
    driver.execute_script("document.querySelector(arguments[0])?.scrollIntoView({block:'center'})",stats_headshot_selector)
    stats_photos=wait_for_loaded_images(driver,stats_headshot_selector,timeout=15)
    stats_total=driver.execute_script("return document.querySelectorAll(arguments[0]).length",stats_player_selector)
    stats_decorated=driver.execute_script("return document.querySelectorAll(arguments[0]).length",stats_headshot_selector)
    former_participants=driver.execute_script("return document.querySelectorAll('.ps-former .ps-player').length")
    if stats_total != expected_roster: raise RuntimeError(f'Stats Lab rendered {stats_total} current roster rows; API contract expects {expected_roster}')
    if stats_decorated < minimum_headshots: raise RuntimeError(f'Stats Lab current-roster headshot coverage is {stats_decorated}/{expected_roster}; minimum is {minimum_headshots}')
    if stats_photos < 1: raise RuntimeError('No visible Stats Lab headshot loaded successfully')
    if overflow(driver): raise RuntimeError('Stats headshots introduced desktop horizontal overflow')

    stage='stats-mobile'
    driver.set_window_size(390,844)
    time.sleep(.3)
    driver.execute_script("document.querySelector(arguments[0])?.scrollIntoView({block:'center'})",stats_headshot_selector)
    mobile_photos=wait_for_loaded_images(driver,stats_headshot_selector)
    if overflow(driver): raise RuntimeError('Stats headshots introduced mobile horizontal overflow')

    stage='console'
    warnings=[]
    try: warnings=[entry for entry in driver.get_log('browser') if entry.get('level') in ('SEVERE','WARNING')]
    except Exception: pass
    severe=[entry for entry in warnings if entry.get('level')=='SEVERE']
    if severe: raise RuntimeError(f'Headshot browser regression has severe console errors: {severe[:3]}')

    result={'ok':True,'base':BASE,'expectedCurrentRoster':expected_roster,'minimumCurrentRosterHeadshots':minimum_headshots,'minimumHeadshotCoveragePct':round(MIN_HEADSHOT_COVERAGE*100,1),'rosterCards':roster_total,'rosterDecoratedHeadshots':roster_decorated,'rosterHeadshotCoveragePct':round(roster_decorated/expected_roster*100,1),'rosterLoadedHeadshots':roster_photos,'statsPlayerRows':stats_total,'statsDecoratedHeadshots':stats_decorated,'statsHeadshotCoveragePct':round(stats_decorated/expected_roster*100,1),'statsLoadedHeadshots':stats_photos,'formerPreseasonParticipantRows':former_participants,'mobileLoadedHeadshots':mobile_photos,'richPlayer':rich_name,'richPlayerHeadshotLoaded':rich_photo>=1,'browserWarnings':warnings[:20],'durationSeconds':round(time.time()-started,2),'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result,indent=2))
except Exception as exc:
    state=None
    if driver:
        try: state=driver.execute_script("""return {hash:location.hash,title:document.querySelector('.page-head h1')?.textContent||document.title,onboarding:Boolean(document.querySelector('#v10-onboarding')),rosterCards:document.querySelectorAll('.player-card').length,rosterPhotos:document.querySelectorAll('.player-card .has-headshot img').length,rosterLoaded:[...document.querySelectorAll('.player-card .has-headshot img')].filter(img=>img.complete&&img.naturalWidth>20).length,statsCurrentRows:document.querySelectorAll('#ps-roster-wrap .ps-player').length,statsFormerRows:document.querySelectorAll('.ps-former .ps-player').length,statsPhotos:document.querySelectorAll('#ps-roster-wrap .ps-player .has-headshot img').length,statsLoaded:[...document.querySelectorAll('#ps-roster-wrap .ps-player .has-headshot img')].filter(img=>img.complete&&img.naturalWidth>20).length,firstSrc:document.querySelector('.has-headshot img')?.currentSrc||'',appText:(document.querySelector('#app')?.innerText||'').slice(0,350)}""")
        except Exception: pass
    result={'ok':False,'base':BASE,'stage':stage,'expectedCurrentRoster':expected_roster,'minimumCurrentRosterHeadshots':minimum_headshots,'error':f'{type(exc).__name__}: {exc}','state':state,'durationSeconds':round(time.time()-started,2),'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result,indent=2))
    raise
finally:
    if driver: driver.quit()
