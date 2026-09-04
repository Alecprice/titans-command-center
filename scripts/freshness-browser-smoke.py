import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT=Path('/tmp/freshness-browser-smoke.json')


def driver_for(width=1280,height=900):
    options=webdriver.ChromeOptions()
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument(f'--window-size={width},{height}')
    options.set_capability('goog:loggingPrefs',{'browser':'ALL'})
    return webdriver.Chrome(options=options)


def set_mobile_viewport(driver,width=390,height=844):
    driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{
        'width':width,
        'height':height,
        'deviceScaleFactor':1,
        'mobile':True,
    })
    state=driver.execute_script("return {innerWidth:innerWidth,innerHeight:innerHeight,clientWidth:document.documentElement.clientWidth,mobile:matchMedia('(max-width:759px)').matches}")
    if state['innerWidth']!=width or state['innerHeight']!=height or state['clientWidth']!=width or not state['mobile']:
        raise RuntimeError(f'Freshness mobile viewport override did not take effect: {state}')
    return state


def prepare_returning_user(driver):
    driver.get(f'{BASE}/')
    driver.execute_script("localStorage.setItem('titans:v10Onboarded','1')")
    driver.get(f'{BASE}/#home')


def read_card(driver):
    return driver.execute_script(r"""
      const card=[...document.querySelectorAll('.v10-command-card')]
        .find(x=>x.querySelector('small')?.textContent?.trim()==='DATA FRESHNESS');
      if(!card)return null;
      const strong=card.querySelector('strong')?.textContent?.trim()||'';
      const detail=card.querySelector('p')?.textContent?.trim()||'';
      const rect=card.getBoundingClientRect();
      return {
        state:card.dataset.freshnessState||'',
        strong,
        detail,
        title:card.title||'',
        text:(card.textContent||'').replace(/\s+/g,' ').trim(),
        rect:{top:rect.top,bottom:rect.bottom,left:rect.left,right:rect.right,width:rect.width,height:rect.height},
        viewport:{width:innerWidth,height:innerHeight},
        overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2
      };
    """)


def wait_card(driver,timeout=15):
    def ready(d):
        card=read_card(d)
        if not card:return False
        if card['strong'] in ('Live source check','Checking snapshot age…'):return False
        if card['state'] not in ('recent','stale','unknown','fallback'):return False
        return card
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(ready)


def assert_card(card,label):
    if 'Live source check' in card['text']:
        raise RuntimeError(f'{label}: transport reachability is still presented as data freshness: {card}')
    if card['state']=='recent':
        if card['strong']!='Recent server snapshot' or 'within the last 48 hours' not in card['title']:
            raise RuntimeError(f'{label}: recent freshness metadata inconsistent: {card}')
    elif card['state']=='stale':
        if card['strong']!='Roster snapshot needs review' or 'more than 48 hours old' not in card['title']:
            raise RuntimeError(f'{label}: stale freshness metadata inconsistent: {card}')
    elif card['state']=='fallback':
        if not card['strong'].startswith('Verified backup · ') or 'unknown date' in card['strong']:
            raise RuntimeError(f'{label}: fallback audit label is missing or unknown: {card}')
        if not card['detail'].startswith('Roster verified '):
            raise RuntimeError(f'{label}: fallback roster detail is not audit-date based: {card}')
        if 'verified roster backup audited' not in card['title'].lower():
            raise RuntimeError(f'{label}: fallback title does not explain the verified backup: {card}')
        if any(term in card['text'].lower() for term in ('neon','database degraded','database unavailable')):
            raise RuntimeError(f'{label}: backend jargon leaked into fan freshness UI: {card}')
    elif card['state']=='unknown':
        if card['strong'] not in ('Freshness unknown','Snapshot age unavailable'):
            raise RuntimeError(f'{label}: unknown freshness metadata inconsistent: {card}')
    if 'Roster ' not in card['detail'] or 'Moves ' not in card['detail'] or 'Intel ' not in card['detail']:
        raise RuntimeError(f'{label}: freshness detail is incomplete: {card}')
    if '20,695 days ago' in card['detail'] or '20,696 days ago' in card['detail']:
        raise RuntimeError(f'{label}: null roster timestamp was coerced to epoch time: {card}')
    if card['rect']['width']<=0 or card['rect']['height']<=0:
        raise RuntimeError(f'{label}: freshness card is not rendered: {card}')
    if card['overflow']:
        raise RuntimeError(f'{label}: freshness card introduced horizontal overflow: {card}')


def severe_logs(driver):
    return [row for row in driver.get_log('browser') if row.get('level')=='SEVERE' and 'favicon' not in row.get('message','').lower()]


started=time.time();driver=None;stage='starting'
try:
    stage='desktop-launch';driver=driver_for()
    stage='desktop-home';prepare_returning_user(driver)
    stage='desktop-freshness';desktop=wait_card(driver);assert_card(desktop,'desktop')

    stage='mobile-viewport';mobile_viewport=set_mobile_viewport(driver,390,844);prepare_returning_user(driver)
    stage='mobile-freshness';mobile=wait_card(driver);assert_card(mobile,'mobile')
    if mobile['viewport']['width']!=390 or mobile['viewport']['height']!=844:
        raise RuntimeError(f'Mobile freshness card did not render at the pinned viewport: {mobile}')

    stage='console';warnings=severe_logs(driver)
    if warnings:raise RuntimeError(f'Freshness regression has severe browser errors: {warnings[:3]}')

    result={
      'ok':True,'base':BASE,'desktop':desktop,'mobile':mobile,'mobileViewportState':mobile_viewport,
      'browserWarnings':warnings,'durationSeconds':round(time.time()-started,2),
      'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
    }
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result,indent=2))
except Exception as exc:
    state=None
    if driver:
        try:state={'hash':driver.execute_script('return location.hash'),'card':read_card(driver)}
        except Exception:pass
    result={'ok':False,'base':BASE,'stage':stage,'error':f'{type(exc).__name__}: {exc}','state':state,'durationSeconds':round(time.time()-started,2),'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result,indent=2))
    raise
finally:
    if driver:driver.quit()
