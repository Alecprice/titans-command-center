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

def stabilize_mobile_sheet(driver):
    driver.execute_script("""
      if(!document.querySelector('style[data-account-smoke-stable-sheet]')){
        const style=document.createElement('style');
        style.dataset.accountSmokeStableSheet='';
        style.textContent='@media(max-width:760px){#sidebar{transition:none!important}}';
        document.head.appendChild(style);
      }
    """)

def wait_sheet_settled(driver,timeout=10):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script("""
      const s=document.querySelector('#sidebar'),m=document.querySelector('#mobile-more-button'),dock=document.querySelector('.mobile-nav');
      const r=s?.getBoundingClientRect(),dr=dock?.getBoundingClientRect();
      if(!s?.classList.contains('open')||m?.getAttribute('aria-expanded')!=='true'||!r||!dr||r.width<=0||r.height<=0)return null;
      return r.bottom<=dr.top+2?{top:r.top,bottom:r.bottom,dockTop:dr.top,transform:getComputedStyle(s).transform}:null;
    """))

def wait_account_panel(driver,timeout=10):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script("""
      const p=document.querySelector('.account-panel');if(!p)return null;
      const r=p.getBoundingClientRect(),style=getComputedStyle(p);
      if(style.visibility==='hidden'||style.display==='none'||r.width<300||r.height<=0||r.bottom>innerHeight+1)return null;
      return {text:p.textContent.trim(),w:r.width,h:r.height,bottom:r.bottom,vh:innerHeight};
    """))

def browser_state(driver):
    return driver.execute_script("""
      const sidebar=document.querySelector('#sidebar'),dock=document.querySelector('.mobile-nav'),panel=document.querySelector('.account-panel'),modal=document.querySelector('.account-modal');
      const sr=sidebar?.getBoundingClientRect(),dr=dock?.getBoundingClientRect(),pr=panel?.getBoundingClientRect();
      return {hash:location.hash,onboarding:Boolean(document.querySelector('#v10-onboarding')),guest:Boolean(window.TitansAccount?.guest),accountCard:Boolean(document.querySelector('.account-sheet-card')),sidebar:{open:Boolean(sidebar?.classList.contains('open')),top:sr?.top??null,bottom:sr?.bottom??null,transform:sidebar?getComputedStyle(sidebar).transform:null},dock:{top:dr?.top??null,bottom:dr?.bottom??null},accountModal:Boolean(modal),accountPanel:pr?{top:pr.top,bottom:pr.bottom,width:pr.width,height:pr.height}:null};
    """)

def severe(driver):
    return [r.get('message','') for r in driver.get_log('browser') if r.get('level')=='SEVERE' and 'favicon' not in r.get('message','').lower()]

result={'ok':False,'base':BASE,'browserWarnings':[],'stage':'starting'};start=time.time();d=driver_for()
try:
    result['stage']='load-home';d.get(f'{BASE}/#home')
    result['stage']='prepare-returning-user';prepare_returning_user(d);stabilize_mobile_sheet(d)
    result['stage']='wait-guest-card';guest=wait(d,"""const card=document.querySelector('.account-sheet-card'),app=document.querySelector('#app');if(!card||!app?.firstElementChild)return null;return {text:card.textContent.trim(),route:location.hash,accountGuest:Boolean(window.TitansAccount?.guest)};""")
    if 'GUEST' not in guest['text'].upper() or not guest['accountGuest']: raise RuntimeError(f'guest state missing: {guest}')
    result['stage']='open-more';d.find_element(By.ID,'mobile-more-button').click()
    result['stage']='wait-more-sheet';sheet=wait_sheet_settled(d)
    result['stage']='open-account';d.find_element(By.CSS_SELECTOR,'[data-account-open]').click()
    result['stage']='wait-account-panel';panel=wait_account_panel(d)
    if 'Continue as guest' not in panel['text']: raise RuntimeError(f'account panel unusable: {panel}')
    result['stage']='close-account';d.find_element(By.CSS_SELECTOR,'[data-account-close]').click()
    result['stage']='simulate-auth-outage';outage=d.execute_async_script("""
      const done=arguments[arguments.length-1],real=window.fetch;
      window.fetch=(input,init)=>String(input).includes('/api/account/auth/')?Promise.reject(new TypeError('simulated auth outage')):real(input,init);
      window.TitansAccount.refresh().then(()=>{const card=document.querySelector('.account-sheet-card');const out={guest:Boolean(window.TitansAccount.guest),text:card?.textContent?.trim()||''};window.fetch=real;done(out);}).catch(error=>{window.fetch=real;done({error:String(error)})});
    """)
    if outage.get('error') or not outage.get('guest') or 'GUEST' not in outage.get('text','').upper(): raise RuntimeError(f'auth outage did not preserve guest mode: {outage}')
    result['stage']='navigate-roster';d.execute_script("location.hash='#roster'")
    result['stage']='wait-roster';roster=wait(d,"return location.hash==='#roster'&&document.querySelector('#app')?.firstElementChild?{route:location.hash,text:document.querySelector('#app').textContent.slice(0,120)}:null")
    if roster['route']!='#roster': raise RuntimeError(f'guest navigation blocked: {roster}')
    result.update({'guest':guest,'sheet':sheet,'panel':panel,'authOutage':outage,'roster':roster,'browserWarnings':severe(d),'ok':True,'stage':'complete'})
    if result['browserWarnings']: raise RuntimeError(f'Browser console errors: {result["browserWarnings"][:5]}')
except Exception as exc:
    result['error']=f'{type(exc).__name__}: {exc}'
    try:result['failureState']=browser_state(d)
    except Exception:pass
finally:
    d.quit();result['durationSeconds']=round(time.time()-start,2);result['testedAt']=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime());OUT.write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
if not result['ok']: raise SystemExit(1)