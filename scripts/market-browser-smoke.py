import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT=Path('/tmp/market-browser-smoke.json')

def wait_for(driver,script,timeout=15):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script(f'return Boolean({script})'))

def prepare_returning_user(driver):
    driver.execute_script("""
      localStorage.setItem('titans:v10Onboarded','1');
      document.querySelector('#v10-onboarding [data-v10-close]')?.click();
    """)
    WebDriverWait(driver,5,poll_frequency=.1).until(lambda d:not d.find_elements(By.CSS_SELECTOR,'#v10-onboarding'))

def count(driver,selector): return driver.execute_script('return document.querySelectorAll(arguments[0]).length',selector)
def overflow(driver): return driver.execute_script('return document.documentElement.scrollWidth > document.documentElement.clientWidth + 3')
def api_market(driver):
    return driver.execute_async_script("""const done=arguments[0];fetch('/api/market-data',{headers:{Accept:'application/json'}}).then(async r=>done({status:r.status,body:await r.json()})).catch(error=>done({status:0,error:String(error)}));""")
def select_first_real_option(driver,selector):
    return driver.execute_script("""const el=document.querySelector(arguments[0]);if(!el||el.options.length<2)return false;el.selectedIndex=1;el.dispatchEvent(new Event('change',{bubbles:true}));return true;""",selector)

options=webdriver.ChromeOptions();options.add_argument('--headless=new');options.add_argument('--no-sandbox');options.add_argument('--disable-dev-shm-usage');options.add_argument('--disable-gpu');options.add_argument('--window-size=1440,1000');options.set_capability('goog:loggingPrefs',{'browser':'ALL'})
driver=None;started=time.time();stage='starting'
try:
    driver=webdriver.Chrome(options=options);driver.set_page_load_timeout(25);driver.set_script_timeout(10)
    stage='market-load';driver.get(f'{BASE}/#markets');prepare_returning_user(driver)
    wait_for(driver,"document.querySelector('.market-hub')");wait_for(driver,"document.querySelector('#mh-refresh')")
    api=api_market(driver)
    if api.get('status')!=200 or not api.get('body',{}).get('ok'): raise RuntimeError(f"Market API unhealthy: {api}")
    market=api['body'];initial_rows=count(driver,'.mh-row');empty_visible=count(driver,'.mh-empty')>0
    if initial_rows<1 and not empty_visible: raise RuntimeError('Market board rendered neither rows nor a clear empty state')
    if market.get('quality')=='live-provider':
        validation=market.get('providerValidation') or {}
        if validation.get('acceptedRows',0)<1: raise RuntimeError('Live provider mode has no validated rows')
        if initial_rows<1: raise RuntimeError('Validated live market rows did not render')
    stage='filters';event_options=driver.execute_script("return document.querySelector('#mh-event-filter')?.options.length||0");book_options=driver.execute_script("return document.querySelector('#mh-book-filter')?.options.length||0");category_options=driver.execute_script("return document.querySelector('#mh-category-filter')?.options.length||0")
    event_filtered=None
    if select_first_real_option(driver,'#mh-event-filter'):
        wait_for(driver,"document.querySelector('.mh-results')");event_filtered=count(driver,'.mh-row')
        if initial_rows>0 and event_filtered<1: raise RuntimeError('Selecting a real Titans game produced an empty board')
        driver.execute_script("const el=document.querySelector('#mh-event-filter');if(el){el.value='all';el.dispatchEvent(new Event('change',{bubbles:true}))}")
    book_filtered=None
    if select_first_real_option(driver,'#mh-book-filter'):
        wait_for(driver,"document.querySelector('.mh-results')");book_filtered=count(driver,'.mh-row')
        if initial_rows>0 and book_filtered<1: raise RuntimeError('Selecting a listed sportsbook produced an empty board')
        driver.execute_script("const el=document.querySelector('#mh-book-filter');if(el){el.value='all';el.dispatchEvent(new Event('change',{bubbles:true}))}")
    stage='alternates';alt_button=driver.find_elements(By.CSS_SELECTOR,'#mh-alt-toggle');alt_before=count(driver,'.mh-row');alt_after=alt_before;alt_enabled=False
    if alt_button and alt_button[0].is_enabled():
        alt_enabled=True;alt_button[0].click();wait_for(driver,"document.querySelector('#mh-alt-toggle')?.getAttribute('aria-pressed')==='true'");alt_after=count(driver,'.mh-row')
        if alt_after<alt_before: raise RuntimeError('Showing alternate lines reduced visible market rows')
    stage='mobile';driver.set_window_size(390,844);time.sleep(.25)
    if overflow(driver): raise RuntimeError('Market board introduced mobile horizontal overflow')
    targets=driver.execute_script("""return [...document.querySelectorAll('.mh-controls select,.mh-controls button,#mh-refresh')].filter(el=>el.offsetParent!==null).map(el=>({label:(el.labels?.[0]?.innerText||el.innerText||el.id).trim(),h:el.getBoundingClientRect().height,w:el.getBoundingClientRect().width}));""")
    too_small=[target for target in targets if target.get('h',0)<44]
    if too_small: raise RuntimeError(f'Market controls below 44px mobile target: {too_small}')
    stage='console';warnings=[]
    try:warnings=[entry for entry in driver.get_log('browser') if entry.get('level') in ('SEVERE','WARNING')]
    except Exception:pass
    severe=[entry for entry in warnings if entry.get('level')=='SEVERE']
    if severe: raise RuntimeError(f'Market browser regression has severe console errors: {severe[:3]}')
    result={'ok':True,'base':BASE,'quality':market.get('quality'),'sourceMode':market.get('sourceMode'),'provider':market.get('provider'),'apiRows':len(market.get('odds') or []),'providerValidation':market.get('providerValidation'),'initialRenderedRows':initial_rows,'eventOptions':event_options,'bookOptions':book_options,'categoryOptions':category_options,'eventFilteredRows':event_filtered,'bookFilteredRows':book_filtered,'alternateToggleEnabled':alt_enabled,'rowsBeforeAlternates':alt_before,'rowsAfterAlternates':alt_after,'mobileTargets':targets,'browserWarnings':warnings[:20],'durationSeconds':round(time.time()-started,2),'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())};REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8');print(json.dumps(result,indent=2))
except Exception as exc:
    state=None
    if driver:
        try:state=driver.execute_script("return {hash:location.hash,title:document.querySelector('.page-head h1')?.textContent||document.title,rows:document.querySelectorAll('.mh-row').length,filters:document.querySelectorAll('.mh-controls select').length,altPressed:document.querySelector('#mh-alt-toggle')?.getAttribute('aria-pressed')||null,appText:(document.querySelector('#app')?.innerText||'').slice(0,500)}")
        except Exception:pass
    result={'ok':False,'base':BASE,'stage':stage,'error':f'{type(exc).__name__}: {exc}','state':state,'durationSeconds':round(time.time()-started,2),'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())};REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8');print(json.dumps(result,indent=2));raise
finally:
    if driver:driver.quit()