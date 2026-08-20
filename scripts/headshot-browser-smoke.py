import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT=Path('/tmp/headshot-browser-smoke.json')

def wait_for(driver,script,timeout=12):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script(f'return Boolean({script})'))

def loaded_images(driver,selector):
    return driver.execute_script("""return [...document.querySelectorAll(arguments[0])].filter(img=>img.complete&&img.naturalWidth>20&&img.naturalHeight>20).length""",selector)

def overflow(driver):
    return driver.execute_script("return document.documentElement.scrollWidth > document.documentElement.clientWidth + 3")

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

    stage='roster-load'
    driver.get(f'{BASE}/#roster')
    wait_for(driver,"document.querySelectorAll('.player-card').length >= 90")
    wait_for(driver,"document.querySelectorAll('.player-card .jersey.has-headshot img').length >= 55")
    wait_for(driver,"[...document.querySelectorAll('.player-card .jersey.has-headshot img')].filter(img=>img.complete&&img.naturalWidth>20).length >= 55")
    roster_total=driver.execute_script("return document.querySelectorAll('.player-card').length")
    roster_photos=loaded_images(driver,'.player-card .jersey.has-headshot img')
    if overflow(driver): raise RuntimeError('Roster headshots introduced horizontal overflow')

    stage='rich-player'
    href=driver.execute_script("return document.querySelector('.player-card:has(.jersey.has-headshot img)')?.getAttribute('href')||''")
    if not href: raise RuntimeError('No photo-backed roster player link found')
    driver.execute_script("location.hash=arguments[0].replace(/^#/,'')",href)
    wait_for(driver,"document.querySelector('.player-profile-rich')")
    wait_for(driver,"document.querySelector('.player-rich-number.has-headshot img')?.complete && document.querySelector('.player-rich-number.has-headshot img')?.naturalWidth > 20")
    rich_name=driver.execute_script("return document.querySelector('.player-rich-copy h1')?.textContent?.trim()||''")
    rich_photo=loaded_images(driver,'.player-rich-number.has-headshot img')

    stage='stats-load'
    driver.get(f'{BASE}/#stats')
    wait_for(driver,"document.querySelector('.preseason-stats-hub')",timeout=15)
    wait_for(driver,"document.querySelectorAll('.ps-player').length >= 90",timeout=15)
    wait_for(driver,"document.querySelectorAll('.ps-player .ps-number.has-headshot img').length >= 50",timeout=15)
    wait_for(driver,"[...document.querySelectorAll('.ps-player .ps-number.has-headshot img')].filter(img=>img.complete&&img.naturalWidth>20).length >= 50",timeout=15)
    stats_total=driver.execute_script("return document.querySelectorAll('.ps-player').length")
    stats_photos=loaded_images(driver,'.ps-player .ps-number.has-headshot img')
    if overflow(driver): raise RuntimeError('Stats headshots introduced desktop horizontal overflow')

    stage='stats-mobile'
    driver.set_window_size(390,844)
    time.sleep(.3)
    if overflow(driver): raise RuntimeError('Stats headshots introduced mobile horizontal overflow')
    mobile_photos=loaded_images(driver,'.ps-player .ps-number.has-headshot img')

    stage='console'
    warnings=[]
    try: warnings=[entry for entry in driver.get_log('browser') if entry.get('level') in ('SEVERE','WARNING')]
    except Exception: pass
    severe=[entry for entry in warnings if entry.get('level')=='SEVERE']
    if severe: raise RuntimeError(f'Headshot browser regression has severe console errors: {severe[:3]}')

    result={'ok':True,'base':BASE,'rosterCards':roster_total,'rosterLoadedHeadshots':roster_photos,'statsPlayerRows':stats_total,'statsLoadedHeadshots':stats_photos,'mobileLoadedHeadshots':mobile_photos,'richPlayer':rich_name,'richPlayerHeadshotLoaded':rich_photo==1,'browserWarnings':warnings[:20],'durationSeconds':round(time.time()-started,2),'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result,indent=2))
except Exception as exc:
    state=None
    if driver:
        try: state=driver.execute_script("return {hash:location.hash,title:document.querySelector('.page-head h1')?.textContent||document.title,rosterCards:document.querySelectorAll('.player-card').length,rosterPhotos:document.querySelectorAll('.player-card .has-headshot img').length,statsRows:document.querySelectorAll('.ps-player').length,statsPhotos:document.querySelectorAll('.ps-player .has-headshot img').length,appText:(document.querySelector('#app')?.innerText||'').slice(0,350)}")
        except Exception: pass
    result={'ok':False,'base':BASE,'stage':stage,'error':f'{type(exc).__name__}: {exc}','state':state,'durationSeconds':round(time.time()-started,2),'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result,indent=2))
    raise
finally:
    if driver: driver.quit()
