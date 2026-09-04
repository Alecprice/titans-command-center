import json
import os
import sys
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT=Path('/tmp/change-intelligence-browser-smoke.json')

def wait_for(driver,expression,timeout=16):
    return WebDriverWait(driver,timeout,poll_frequency=0.1).until(lambda d:d.execute_script(f'return Boolean({expression})'))

def no_overflow(driver,label):
    state=driver.execute_script("return {w:document.documentElement.clientWidth,s:document.documentElement.scrollWidth}")
    if state['s']>state['w']+3: raise RuntimeError(f'Horizontal overflow on {label}: {state}')

def set_mobile_viewport(driver,width=390,height=844):
    driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{
        'width':width,
        'height':height,
        'deviceScaleFactor':1,
        'mobile':True,
    })
    state=driver.execute_script("return {innerWidth:innerWidth,innerHeight:innerHeight,clientWidth:document.documentElement.clientWidth,mobile:matchMedia('(max-width:759px)').matches}")
    if state['innerWidth']!=width or state['innerHeight']!=height or state['clientWidth']!=width or not state['mobile']:
        raise RuntimeError(f'Change Intelligence mobile viewport override did not take effect: {state}')
    return state

def write(payload): REPORT.write_text(json.dumps(payload,indent=2),encoding='utf-8')

options=webdriver.ChromeOptions()
options.add_argument('--headless=new');options.add_argument('--no-sandbox');options.add_argument('--disable-dev-shm-usage');options.add_argument('--disable-gpu');options.add_argument('--window-size=1440,1000')
options.set_capability('goog:loggingPrefs',{'browser':'ALL'})
driver=None;stage='starting';started=time.time()
try:
    driver=webdriver.Chrome(options=options);driver.set_page_load_timeout(20);driver.set_script_timeout(8)
    stage='load'
    driver.get(f'{BASE}/#command')
    wait_for(driver,"document.querySelector('.v18-change-intel')")
    no_overflow(driver,'Change Intelligence desktop')

    stage='seed-reviewed-state'
    driver.execute_script("""
      localStorage.setItem('titans:v18ReviewedSnapshot',JSON.stringify({at:'2026-01-01T00:00:00Z',roster:[],transactions:[],injuries:[],depth:[],games:[]}));
      localStorage.setItem('titans:v15MyTitans',JSON.stringify({favorite:'Cam Ward'}));
    """)
    driver.refresh()
    wait_for(driver,"document.querySelectorAll('.v18-change-card').length > 10",timeout=18)
    wait_for(driver,"document.querySelector('.v18-change-card.favorite')")
    before=driver.execute_script("""
      return {
        count:document.querySelectorAll('.v18-change-card').length,
        favorite:document.querySelector('.v18-change-card.favorite h4')?.textContent?.trim()||'',
        categories:[...new Set([...document.querySelectorAll('.v18-change-card')].map(x=>x.dataset.v18Kind))],
        reviewLabel:document.querySelector('[data-v18-review]')?.textContent?.trim()||''
      }
    """)
    if 'Roster' not in before['categories']: raise RuntimeError(f'Roster changes missing: {before}')

    stage='filter'
    driver.execute_script("[...document.querySelectorAll('[data-v18-filter]')].find(x=>x.dataset.v18Filter==='Roster')?.click()")
    wait_for(driver,"[...document.querySelectorAll('.v18-change-card:not([hidden])')].every(x=>x.dataset.v18Kind==='Roster')")
    visible_roster=driver.execute_script("return document.querySelectorAll('.v18-change-card:not([hidden])').length")
    if visible_roster<1: raise RuntimeError('Roster filter returned no visible changes')

    stage='mobile'
    mobile_viewport=set_mobile_viewport(driver,390,844);no_overflow(driver,'Change Intelligence 390px')
    mobile=driver.execute_script("""
      return {
        filters:[...document.querySelectorAll('[data-v18-filter]')].map(x=>({label:x.textContent.trim(),h:x.getBoundingClientRect().height})),
        review:document.querySelector('[data-v18-review]')?.getBoundingClientRect().height||0,
        width:document.querySelector('.v18-change-intel')?.getBoundingClientRect().width||0,
        viewport:document.documentElement.clientWidth
      }
    """)
    if mobile['viewport']!=390 or any(x['h']<44 for x in mobile['filters']) or mobile['review']<44: raise RuntimeError(f'Mobile targets invalid: {mobile}')

    stage='mark-reviewed'
    driver.execute_script("document.querySelector('[data-v18-filter=\"All\"]')?.click();document.querySelector('[data-v18-review]')?.click()")
    wait_for(driver,"document.querySelector('.v18-empty')?.textContent?.includes('No detected changes since your review point')")
    remaining=driver.execute_script("return document.querySelectorAll('.v18-change-card').length")
    if remaining!=0: raise RuntimeError(f'Changes remained after review: {remaining}')

    stage='console'
    warnings=[]
    try: warnings=[x for x in driver.get_log('browser') if x.get('level') in ('SEVERE','WARNING')]
    except Exception: pass
    severe=[x for x in warnings if x.get('level')=='SEVERE']
    if severe: raise RuntimeError(f'Change Intelligence console has severe errors: {severe[:4]}')

    result={'ok':True,'base':BASE,'detectedBeforeReview':before['count'],'categories':before['categories'],'favoritePriority':before['favorite'],'rosterFilterVisible':visible_roster,'clearedAfterReview':remaining==0,'mobileViewport':mobile_viewport,'mobileTargets':mobile,'browserWarnings':warnings[:20],'durationSeconds':round(time.time()-started,2),'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
    write(result);print(json.dumps(result,indent=2))
except Exception as exc:
    result={'ok':False,'base':BASE,'stage':stage,'error':f'{type(exc).__name__}: {exc}','durationSeconds':round(time.time()-started,2),'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
    try:
        if driver is not None:
            result['hash']=driver.execute_script('return location.hash');result['pageText']=driver.execute_script("return (document.querySelector('#app')?.innerText||'').slice(0,2200)");result['browserWarnings']=[x for x in driver.get_log('browser') if x.get('level') in ('SEVERE','WARNING')][:20]
    except Exception: pass
    write(result);print(json.dumps(result,indent=2),file=sys.stderr);sys.exit(1)
finally:
    if driver is not None:
        try: driver.quit()
        except Exception: pass
