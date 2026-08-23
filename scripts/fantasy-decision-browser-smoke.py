import json
import os
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
OUT=Path('/tmp/fantasy-decision-browser-smoke.json')

def driver_for(width=1280,height=900):
    options=Options();options.add_argument('--headless=new');options.add_argument('--no-sandbox');options.add_argument('--disable-dev-shm-usage');options.add_argument(f'--window-size={width},{height}');options.set_capability('goog:loggingPrefs',{'browser':'ALL'});return webdriver.Chrome(options=options)

def wait_for(driver,script,timeout=15):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script(script))

def prepare_returning_user(driver):
    driver.execute_script("""
      localStorage.setItem('titans:v10Onboarded','1');
      localStorage.setItem('titans-fantasy-v1',JSON.stringify({
        manual:[
          {name:'Decision Smoke A',position:'WR',team:'TEN',slot:'starter'},
          {name:'Decision Smoke B',position:'RB',team:'IND',slot:'bench'}
        ]
      }));
      document.querySelector('#v10-onboarding [data-v10-close]')?.click();
    """)

def severe_logs(driver):
    return [r.get('message','') for r in driver.get_log('browser') if r.get('level')=='SEVERE' and 'favicon' not in r.get('message','').lower()]

def decision_state(driver):
    return driver.execute_script("""
      const root=document.querySelector('[data-fantasy-decision]');
      if(!root)return null;
      const sels=[...root.querySelectorAll('select')],cards=[...root.querySelectorAll('.fdc-player')],verdict=root.querySelector('.fdc-verdict');
      const rr=root.getBoundingClientRect();
      return {
        ready:root.dataset.fantasyDecision,
        title:root.querySelector('h2')?.textContent||'',
        selects:sels.map(s=>({height:s.getBoundingClientRect().height,options:s.options.length,value:s.value})),
        cards:cards.map(c=>c.textContent.trim()),
        verdict:verdict?.textContent?.trim()||'',
        overflow:document.documentElement.scrollWidth>innerWidth+1,
        left:rr.left,right:rr.right,viewport:innerWidth
      };
    """)

def run(width,height):
    d=driver_for(width,height)
    try:
        d.get(f'{BASE}/#home');prepare_returning_user(d);d.get(f'{BASE}/#fantasy')
        state=wait_for(d,"return document.querySelector('[data-fantasy-decision]')?true:false") and decision_state(d)
        if not state or state['ready']!='ready': raise RuntimeError(f'Decision Center not ready: {state}')
        if state['title']!='Start / Sit Compare': raise RuntimeError(f'Decision title mismatch: {state}')
        if len(state['selects'])!=2 or any(s['options']<2 for s in state['selects']): raise RuntimeError(f'Decision controls incomplete: {state}')
        if any(s['height']<44 for s in state['selects']): raise RuntimeError(f'Decision controls below 44px: {state}')
        if len(state['cards'])!=2: raise RuntimeError(f'Decision cards missing: {state}')
        if 'Decision Smoke A' not in ' '.join(state['cards']) or 'Decision Smoke B' not in ' '.join(state['cards']): raise RuntimeError(f'Manual candidates not rendered: {state}')
        if not state['verdict'] or ('Evidence leans' not in state['verdict'] and 'Too close to call' not in state['verdict']): raise RuntimeError(f'Decision verdict missing or misleading: {state}')
        if state['overflow'] or state['left']<-1 or state['right']>state['viewport']+1: raise RuntimeError(f'Decision Center overflow: {state}')
        warnings=severe_logs(d)
        if warnings: raise RuntimeError(f'Browser console errors: {warnings[:5]}')
        state['browserWarnings']=warnings
        return state
    finally:
        d.quit()

result={'ok':False,'base':BASE,'desktop':{},'mobile':{}}
try:
    result['desktop']=run(1280,900)
    result['mobile']=run(390,844)
    result['ok']=True
except Exception as exc:
    result['error']=f'{type(exc).__name__}: {exc}'
finally:
    OUT.write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
if not result['ok']: raise SystemExit(1)
