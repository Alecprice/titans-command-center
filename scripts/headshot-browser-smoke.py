import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT=Path('/tmp/headshot-browser-smoke.json')
MIN_CURRENT_ROSTER_CARDS=50
MIN_CURRENT_ROSTER_HEADSHOT_COVERAGE=.85


def wait_for(driver,script,timeout=12):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script(f'return Boolean({script})'))


def loaded_images(driver,selector):
    return driver.execute_script("""return [...document.querySelectorAll(arguments[0])].filter(img=>img.complete&&img.naturalWidth>20&&img.naturalHeight>20).length""",selector)


def wait_for_loaded_images(driver,selector,minimum=1,timeout=12):
    def ready(d):
        count=loaded_images(d,selector)
        return count if count>=minimum else False
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(ready)


def current_roster_headshot_state(driver):
    return driver.execute_script("""
      const cards=document.querySelectorAll('.player-card').length;
      const decorated=document.querySelectorAll('.player-card .jersey.has-headshot img').length;
      return {cards,decorated,coverage:cards?decorated/cards:0};
    """)


def wait_for_current_roster_headshots(driver,timeout=12,stable_seconds=.5):
    last_key=None
    stable_since=None

    def ready(d):
        nonlocal last_key,stable_since
        state=current_roster_headshot_state(d)
        key=(state['cards'],state['decorated'])
        enough_cards=state['cards']>=MIN_CURRENT_ROSTER_CARDS
        enough_coverage=state['coverage']>=MIN_CURRENT_ROSTER_HEADSHOT_COVERAGE
        if not enough_cards or not enough_coverage:
            last_key=None
            stable_since=None
            return False
        now=time.monotonic()
        if key!=last_key:
            last_key=key
            stable_since=now
            return False
        return state if stable_since is not None and now-stable_since>=stable_seconds else False

    return WebDriverWait(driver,timeout,poll_frequency=.1).until(ready)


def overflow(driver):
    return driver.execute_script("return document.documentElement.scrollWidth > document.documentElement.clientWidth + 3")


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
try:
    driver=webdriver.Chrome(options=options)
    driver.set_page_load_timeout(20)
    driver.set_script_timeout(5)
    prepare_returning_user(driver)

    stage='roster-load'
    driver.get(f'{BASE}/#roster')
    roster_state=wait_for_current_roster_headshots(driver)
    driver.execute_script("document.querySelector('.player-card .jersey.has-headshot img')?.scrollIntoView({block:'center'})")
    roster_photos=wait_for_loaded_images(driver,'.player-card .jersey.has-headshot img')
    roster_total=roster_state['cards']
    roster_decorated=roster_state['decorated']
    roster_coverage=roster_state['coverage']
    if roster_total < MIN_CURRENT_ROSTER_CARDS: raise RuntimeError(f'Current roster surface is unexpectedly small: {roster_total}')
    if roster_coverage < MIN_CURRENT_ROSTER_HEADSHOT_COVERAGE: raise RuntimeError(f'Current roster headshot coverage too low: {roster_decorated}/{roster_total}')
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
    driver.get(f'{BASE}/#stats')
    wait_for(driver,"document.querySelector('.preseason-stats-hub')",timeout=15)
    wait_for(driver,"document.querySelectorAll('.ps-player').length >= 90",timeout=15)
    wait_for(driver,"document.querySelectorAll('.ps-player .ps-number.has-headshot img').length >= 50",timeout=15)
    driver.execute_script("document.querySelector('.ps-player .ps-number.has-headshot img')?.scrollIntoView({block:'center'})")
    stats_photos=wait_for_loaded_images(driver,'.ps-player .ps-number.has-headshot img',timeout=15)
    stats_total=driver.execute_script("return document.querySelectorAll('.ps-player').length")
    stats_decorated=driver.execute_script("return document.querySelectorAll('.ps-player .ps-number.has-headshot img').length")
    if stats_photos < 1: raise RuntimeError('No visible Stats Lab headshot loaded successfully')
    if overflow(driver): raise RuntimeError('Stats headshots introduced desktop horizontal overflow')

    stage='stats-mobile'
    driver.set_window_size(390,844)
    time.sleep(.3)
    driver.execute_script("document.querySelector('.ps-player .ps-number.has-headshot img')?.scrollIntoView({block:'center'})")
    mobile_photos=wait_for_loaded_images(driver,'.ps-player .ps-number.has-headshot img')
    if overflow(driver): raise RuntimeError('Stats headshots introduced mobile horizontal overflow')

    stage='console'
    warnings=[]
    try: warnings=[entry for entry in driver.get_log('browser') if entry.get('level') in ('SEVERE','WARNING')]
    except Exception: pass
    severe=[entry for entry in warnings if entry.get('level')=='SEVERE']
    if severe: raise RuntimeError(f'Headshot browser regression has severe console errors: {severe[:3]}')

    result={'ok':True,'base':BASE,'rosterCards':roster_total,'rosterDecoratedHeadshots':roster_decorated,'rosterHeadshotCoveragePct':round(roster_coverage*100,1),'rosterLoadedHeadshots':roster_photos,'statsPlayerRows':stats_total,'statsDecoratedHeadshots':stats_decorated,'statsLoadedHeadshots':stats_photos,'mobileLoadedHeadshots':mobile_photos,'richPlayer':rich_name,'richPlayerHeadshotLoaded':rich_photo>=1,'browserWarnings':warnings[:20],'durationSeconds':round(time.time()-started,2),'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result,indent=2))
except Exception as exc:
    state=None
    if driver:
        try: state=driver.execute_script("return {hash:location.hash,title:document.querySelector('.page-head h1')?.textContent||document.title,onboarding:Boolean(document.querySelector('#v10-onboarding')),rosterCards:document.querySelectorAll('.player-card').length,rosterPhotos:document.querySelectorAll('.player-card .has-headshot img').length,rosterLoaded:[...document.querySelectorAll('.player-card .has-headshot img')].filter(img=>img.complete&&img.naturalWidth>20).length,statsRows:document.querySelectorAll('.ps-player').length,statsPhotos:document.querySelectorAll('.ps-player .has-headshot img').length,statsLoaded:[...document.querySelectorAll('.ps-player .has-headshot img')].filter(img=>img.complete&&img.naturalWidth>20).length,firstSrc:document.querySelector('.has-headshot img')?.currentSrc||'',appText:(document.querySelector('#app')?.innerText||'').slice(0,350)}")
        except Exception: pass
    result={'ok':False,'base':BASE,'stage':stage,'error':f'{type(exc).__name__}: {exc}','state':state,'durationSeconds':round(time.time()-started,2),'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result,indent=2))
    raise
finally:
    if driver: driver.quit()
