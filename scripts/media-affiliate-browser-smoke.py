import json
import os
import sys
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

BASE = os.environ.get('WORKER_URL', 'https://titans.alecjprice.com').rstrip('/')
REPORT = Path('/tmp/media-affiliate-browser-smoke.json')
FAVORITE_KEY = 'titans:favoriteRadioAffiliate'


def wait_for(driver, predicate, timeout=14):
    return WebDriverWait(driver, timeout, poll_frequency=0.1).until(
        lambda d: d.execute_script(f'return Boolean({predicate})')
    )


def finder_state(driver):
    return driver.execute_script("""
      const root=document.querySelector('.media-affiliate-finder');
      const visible=[...root?.querySelectorAll('[data-affiliate-station]:not([hidden])')||[]];
      const favoriteButton=root?.querySelector('[data-affiliate-station]:not([hidden]) [data-affiliate-favorite]');
      return {
        present:Boolean(root),
        open:Boolean(root?.open),
        total:root?.querySelectorAll('[data-affiliate-station]').length||0,
        visible:visible.length,
        calls:visible.map(x=>x.querySelector('strong')?.textContent?.trim()||''),
        cities:visible.map(x=>x.querySelector('small')?.textContent?.trim()||''),
        frequencies:visible.map(x=>x.querySelector('span')?.textContent?.trim()||''),
        count:root?.querySelector('[data-affiliate-count]')?.textContent?.trim()||'',
        summary:root?.querySelector('[data-affiliate-summary]')?.textContent?.trim()||'',
        savedText:root?.querySelector('[data-affiliate-saved]')?.textContent?.replace(/\s+/g,' ')?.trim()||'',
        favoritePressed:root?.querySelectorAll('[data-affiliate-favorite][aria-pressed="true"]').length||0,
        source:root?.querySelector('.media-affiliate-source a')?.href||'',
        inputHeight:root?.querySelector('[data-affiliate-search-input]')?.getBoundingClientRect().height||0,
        clearHeight:root?.querySelector('[data-affiliate-clear]')?.getBoundingClientRect().height||0,
        favoriteHeight:favoriteButton?.getBoundingClientRect().height||0
      };
    """)


def search(driver, value):
    driver.execute_script("""
      const input=document.querySelector('[data-affiliate-search-input]');
      input.value=arguments[0];
      input.dispatchEvent(new Event('input',{bubbles:true}));
    """, value)
    time.sleep(0.08)
    return finder_state(driver)


def no_overflow(driver, label):
    state=driver.execute_script("return {client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}")
    if state['scroll'] > state['client'] + 3:
        raise RuntimeError(f'Horizontal overflow on {label}: {state}')


options=webdriver.ChromeOptions()
options.add_argument('--headless=new')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1440,1000')
options.set_capability('goog:loggingPrefs', {'browser':'ALL'})

driver=None
stage='starting'
started=time.time()
try:
    driver=webdriver.Chrome(options=options)
    driver.set_page_load_timeout(25)

    stage='desktop:load'
    driver.get(f'{BASE}/#media')
    wait_for(driver, "document.querySelector('.media-page') && document.querySelector('.media-affiliate-finder')")
    driver.execute_script("localStorage.removeItem(arguments[0])", FAVORITE_KEY)
    driver.refresh()
    wait_for(driver, "document.querySelector('.media-page') && document.querySelector('.media-affiliate-finder')")
    driver.execute_script("document.querySelector('.media-affiliate-finder').open=true")
    wait_for(driver, "document.querySelectorAll('[data-affiliate-station]').length===39")
    initial=finder_state(driver)
    if initial['total'] != 39 or initial['visible'] != 39:
        raise RuntimeError(f'Expected 39 official 2026 stations: {initial}')
    if 'tennesseetitans.com/broadcast/titans-radio/titans-radio-affiliates' not in initial['source']:
        raise RuntimeError(f'Official affiliate source link missing: {initial}')
    if initial['favoritePressed'] != 0:
        raise RuntimeError(f'Favorite state was not clean at test start: {initial}')
    no_overflow(driver,'desktop affiliate finder')

    stage='desktop:greeneville'
    greeneville=search(driver,'Greeneville')
    if greeneville['visible'] != 1 or greeneville['calls'] != ['WIKQ'] or greeneville['frequencies'] != ['103.1 FM']:
        raise RuntimeError(f'Greeneville search mismatch: {greeneville}')

    stage='desktop:favorite-save'
    driver.execute_script("document.querySelector('[data-affiliate-station]:not([hidden]) [data-affiliate-favorite]').click()")
    wait_for(driver, "document.querySelector('[data-affiliate-summary]')?.textContent?.includes('Saved WIKQ') && document.querySelectorAll('[data-affiliate-favorite][aria-pressed=\"true\"]').length===1")
    favoriteSaved=finder_state(driver)
    stored=driver.execute_script("return localStorage.getItem(arguments[0])", FAVORITE_KEY) or ''
    if 'WIKQ' not in favoriteSaved['summary'] or 'WIKQ' not in favoriteSaved['savedText'] or 'WIKQ' not in stored:
        raise RuntimeError(f'WIKQ favorite did not persist to device storage: state={favoriteSaved}, storage={stored}')

    stage='desktop:favorite-reload'
    driver.refresh()
    wait_for(driver, "document.querySelector('.media-affiliate-finder') && document.querySelector('[data-affiliate-summary]')?.textContent?.includes('Saved WIKQ')")
    driver.execute_script("document.querySelector('.media-affiliate-finder').open=true")
    wait_for(driver, "document.querySelectorAll('[data-affiliate-station]').length===39")
    favoriteReloaded=finder_state(driver)
    if favoriteReloaded['favoritePressed'] != 1 or 'WIKQ' not in favoriteReloaded['savedText']:
        raise RuntimeError(f'Favorite did not survive reload: {favoriteReloaded}')

    stage='desktop:favorite-remove'
    driver.execute_script("document.querySelector('[data-affiliate-unfavorite]').click()")
    wait_for(driver, "document.querySelectorAll('[data-affiliate-favorite][aria-pressed=\"true\"]').length===0 && document.querySelector('[data-affiliate-summary]')?.textContent?.includes('39 stations')")
    favoriteRemoved=finder_state(driver)
    if favoriteRemoved['favoritePressed'] != 0 or 'No station saved yet' not in favoriteRemoved['savedText']:
        raise RuntimeError(f'Favorite removal mismatch: {favoriteRemoved}')
    if driver.execute_script("return localStorage.getItem(arguments[0])", FAVORITE_KEY) is not None:
        raise RuntimeError('Favorite storage key remained after removal')

    stage='desktop:columbia'
    columbia=search(driver,'Columbia')
    if columbia['visible'] != 3 or sorted(columbia['calls']) != ['WAIN','WAIN','WKOM']:
        raise RuntimeError(f'Cross-state Columbia search mismatch: {columbia}')

    stage='desktop:frequency'
    frequency=search(driver,'102.3')
    if frequency['visible'] != 2 or sorted(frequency['calls']) != ['WGOW','WZDQ']:
        raise RuntimeError(f'102.3 frequency search mismatch: {frequency}')

    stage='desktop:no-results'
    missing=search(driver,'not-a-real-station')
    if missing['visible'] != 0 or 'No 2026 Titans Radio affiliates match' not in missing['count']:
        raise RuntimeError(f'No-results state mismatch: {missing}')

    stage='desktop:clear'
    driver.execute_script("document.querySelector('[data-affiliate-clear]').click()")
    wait_for(driver, "document.querySelectorAll('[data-affiliate-station]:not([hidden])').length===39")
    cleared=finder_state(driver)
    if cleared['visible'] != 39:
        raise RuntimeError(f'Clear search did not restore network: {cleared}')

    stage='mobile:layout'
    driver.set_window_size(390,844)
    time.sleep(0.12)
    driver.execute_script("document.querySelector('.media-affiliate-finder').open=true")
    mobile=finder_state(driver)
    no_overflow(driver,'390px affiliate finder')
    if mobile['inputHeight'] < 44 or mobile['clearHeight'] < 44:
        raise RuntimeError(f'Mobile search controls are too small: {mobile}')

    stage='mobile:greeneville'
    mobile_greeneville=search(driver,'WIKQ')
    if mobile_greeneville['visible'] != 1 or mobile_greeneville['cities'] != ['Greeneville']:
        raise RuntimeError(f'Mobile station search mismatch: {mobile_greeneville}')
    if mobile_greeneville['favoriteHeight'] < 44:
        raise RuntimeError(f'Mobile favorite control is too small: {mobile_greeneville}')
    no_overflow(driver,'390px filtered affiliate finder')

    stage='console'
    warnings=[]
    try:
        warnings=driver.get_log('browser')
    except Exception:
        pass
    severe=[entry for entry in warnings if entry.get('level')=='SEVERE']
    if severe:
        raise RuntimeError(f'Affiliate finder has severe browser errors: {severe[:4]}')

    result={
        'ok':True,
        'base':BASE,
        'stations':initial['total'],
        'greeneville':greeneville['calls'],
        'favoriteSaved':favoriteSaved['summary'],
        'favoriteReloaded':favoriteReloaded['summary'],
        'favoriteRemoved':favoriteRemoved['summary'],
        'columbia':columbia['calls'],
        'frequency1023':frequency['calls'],
        'mobileTargets':{'input':mobile['inputHeight'],'clear':mobile['clearHeight'],'favorite':mobile_greeneville['favoriteHeight']},
        'officialSource':initial['source'],
        'durationSeconds':round(time.time()-started,2),
        'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
    }
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result,indent=2))
except Exception as exc:
    result={
        'ok':False,
        'base':BASE,
        'stage':stage,
        'error':f'{type(exc).__name__}: {exc}',
        'durationSeconds':round(time.time()-started,2),
        'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
    }
    try:
        if driver is not None:
            result['hash']=driver.execute_script('return location.hash')
            result['pageText']=driver.execute_script("return (document.querySelector('#app')?.innerText||'').slice(0,1400)")
    except Exception:
        pass
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result,indent=2),file=sys.stderr)
    sys.exit(1)
finally:
    if driver is not None:
        try:
            driver.quit()
        except Exception:
            pass
