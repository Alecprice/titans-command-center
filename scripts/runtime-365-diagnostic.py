import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
OUT=Path('/tmp/runtime-365-diagnostic.json')


def driver_for(width=390,height=844):
    options=Options();options.add_argument('--headless=new');options.add_argument('--no-sandbox');options.add_argument('--disable-dev-shm-usage');options.add_argument(f'--window-size={width},{height}');options.set_capability('goog:loggingPrefs',{'browser':'ALL'});return webdriver.Chrome(options=options)

def wait(driver,script,timeout=15):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script(script))

def snapshot(driver):
    return driver.execute_script("""
      const sidebar=document.querySelector('#sidebar'),dock=document.querySelector('.mobile-nav'),panel=document.querySelector('.v19-365'),search=document.querySelector('#global-search'),results=document.querySelector('.v111-search-panel');
      const sr=sidebar?.getBoundingClientRect(),dr=dock?.getBoundingClientRect();
      return {hash:location.hash,innerWidth,innerHeight,onboarding:Boolean(document.querySelector('#v10-onboarding')),panel:Boolean(panel),sidebar:{open:Boolean(sidebar?.classList.contains('open')),top:sr?.top??null,bottom:sr?.bottom??null,transform:sidebar?getComputedStyle(sidebar).transform:null},dock:{top:dr?.top??null,bottom:dr?.bottom??null},search:{focused:document.activeElement===search,expanded:search?.getAttribute('aria-expanded')||null,value:search?.value||'',panelHidden:results?.hidden??null,resultCount:results?.querySelectorAll('[data-v111-index]').length||0}};
    """)

result={'ok':False,'base':BASE,'stage':'starting','states':[]};started=time.time();d=driver_for()
try:
    result['stage']='load-home';d.get(f'{BASE}/#home')
    result['stage']='prepare-returning-user';d.execute_script("localStorage.setItem('titans:v10Onboarded','1');document.querySelector('#v10-onboarding [data-v10-close]')?.click()")
    wait(d,"return !document.querySelector('#v10-onboarding')",5);result['states'].append({'stage':result['stage'],'state':snapshot(d)})
    result['stage']='wait-365';wait(d,"return Boolean(document.querySelector('.v19-365')&&document.querySelectorAll('.v19-365-grid>a').length===4)");result['states'].append({'stage':result['stage'],'state':snapshot(d)})
    result['stage']='open-more';d.find_element(By.ID,'mobile-more-button').click()
    result['stage']='wait-sheet-settled';sheet=wait(d,"""const s=document.querySelector('#sidebar'),dock=document.querySelector('.mobile-nav'),r=s?.getBoundingClientRect(),dr=dock?.getBoundingClientRect();return s?.classList.contains('open')&&r&&dr&&r.bottom<=dr.top+2?{top:r.top,bottom:r.bottom,dockTop:dr.top,transform:getComputedStyle(s).transform}:null""",15);result['states'].append({'stage':result['stage'],'state':snapshot(d)})
    result['stage']='close-more';d.execute_script("document.querySelector('#app').click()")
    result['stage']='wait-sheet-closed';wait(d,"return !document.querySelector('#sidebar')?.classList.contains('open')",10);result['states'].append({'stage':result['stage'],'state':snapshot(d)})
    result['stage']='focus-search';search=d.find_element(By.ID,'global-search');search.click();search.send_keys('roster')
    result['stage']='wait-search-results';search_state=wait(d,"""const p=document.querySelector('.v111-search-panel'),rows=[...p?.querySelectorAll('[data-v111-index]')||[]];return p&&!p.hidden&&rows.length?{rows:rows.length,labels:rows.map(x=>x.textContent.trim()).slice(0,4)}:null""",15);result['states'].append({'stage':result['stage'],'state':snapshot(d)})
    result['sheet']=sheet;result['search']=search_state;result['ok']=True
except Exception as exc:
    result['error']=f'{type(exc).__name__}: {exc}'
    try: result['failureState']=snapshot(d)
    except Exception: pass
finally:
    try: result['browserWarnings']=[r for r in d.get_log('browser') if r.get('level') in ('SEVERE','WARNING')][:20]
    except Exception: result['browserWarnings']=[]
    d.quit();result['durationSeconds']=round(time.time()-started,2);result['testedAt']=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime());OUT.write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
if not result['ok']: raise SystemExit(1)