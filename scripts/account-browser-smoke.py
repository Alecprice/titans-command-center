import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
OUT=Path('/tmp/account-browser-smoke.json')

def driver_for(width=390,height=844):
    options=Options();options.add_argument('--headless=new');options.add_argument('--no-sandbox');options.add_argument('--disable-dev-shm-usage');options.add_argument(f'--window-size={width},{height}');options.set_capability('goog:loggingPrefs',{'browser':'ALL'});return webdriver.Chrome(options=options)

def wait(driver,script,timeout=15):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script(script))

def prepare_returning_user(driver):
    driver.execute_script("""
      localStorage.setItem('titans:v10Onboarded','1');
      document.querySelector('#v10-onboarding [data-v10-close]')?.click();
    """)
    WebDriverWait(driver,5,poll_frequency=.1).until(lambda d:not d.find_elements(By.CSS_SELECTOR,'#v10-onboarding'))

def severe(driver):
    return [r.get('message','') for r in driver.get_log('browser') if r.get('level')=='SEVERE' and 'favicon' not in r.get('message','').lower()]

result={'ok':False,'base':BASE,'browserWarnings':[]};start=time.time();d=driver_for()
try:
    d.get(f'{BASE}/#home')
    prepare_returning_user(d)
    guest=wait(d,"""
      const card=document.querySelector('.account-sheet-card'),app=document.querySelector('#app');
      if(!card||!app?.firstElementChild)return null;
      return {text:card.textContent.trim(),route:location.hash,accountGuest:Boolean(window.TitansAccount?.guest)};
    """)
    if 'GUEST' not in guest['text'].upper() or not guest['accountGuest']: raise RuntimeError(f'guest state missing: {guest}')

    d.find_element(By.ID,'mobile-more-button').click()
    wait(d,"return document.querySelector('#sidebar')?.classList.contains('open')")
    d.find_element(By.CSS_SELECTOR,'[data-account-open]').click()
    panel=wait(d,"""const p=document.querySelector('.account-panel');if(!p)return null;const r=p.getBoundingClientRect();return {text:p.textContent.trim(),w:r.width,h:r.height,bottom:r.bottom,vh:innerHeight};""")
    if 'Continue as guest' not in panel['text'] or panel['w']<300 or panel['bottom']>panel['vh']+1: raise RuntimeError(f'account panel unusable: {panel}')
    d.find_element(By.CSS_SELECTOR,'[data-account-close]').click()

    outage=d.execute_async_script("""
      const done=arguments[arguments.length-1],real=window.fetch;
      window.fetch=(input,init)=>String(input).includes('/api/account/auth/')?Promise.reject(new TypeError('simulated auth outage')):real(input,init);
      window.TitansAccount.refresh().then(()=>{
        const card=document.querySelector('.account-sheet-card');
        const out={guest:Boolean(window.TitansAccount.guest),text:card?.textContent?.trim()||''};
        window.fetch=real;done(out);
      }).catch(error=>{window.fetch=real;done({error:String(error)})});
    """)
    if outage.get('error') or not outage.get('guest') or 'GUEST' not in outage.get('text','').upper(): raise RuntimeError(f'auth outage did not preserve guest mode: {outage}')

    d.execute_script("location.hash='#roster'")
    roster=wait(d,"return location.hash==='#roster'&&document.querySelector('#app')?.firstElementChild?{route:location.hash,text:document.querySelector('#app').textContent.slice(0,120)}:null")
    if roster['route']!='#roster': raise RuntimeError(f'guest navigation blocked: {roster}')
    result['guest']=guest;result['panel']=panel;result['authOutage']=outage;result['roster']=roster;result['browserWarnings']=severe(d)
    if result['browserWarnings']: raise RuntimeError(f'Browser console errors: {result["browserWarnings"][:5]}')
    result['ok']=True
except Exception as exc:result['error']=f'{type(exc).__name__}: {exc}'
finally:
    d.quit();result['durationSeconds']=round(time.time()-start,2);OUT.write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
if not result['ok']: raise SystemExit(1)
