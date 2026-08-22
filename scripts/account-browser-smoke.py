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

def disable_sidebar_motion(driver):
    driver.execute_script("""
      if(document.querySelector('style[data-account-smoke]'))return;
      const style=document.createElement('style');
      style.dataset.accountSmoke='true';
      style.textContent='#sidebar{transition:none!important;animation:none!important}';
      document.head.appendChild(style);
    """)

def wait_sheet_settled(driver,timeout=8):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script("""
      const s=document.querySelector('#sidebar'),m=document.querySelector('#mobile-more-button'),dock=document.querySelector('.mobile-nav');
      const r=s?.getBoundingClientRect(),dr=dock?.getBoundingClientRect();
      if(!s?.classList.contains('open')||m?.getAttribute('aria-expanded')!=='true'||!r||!dr||r.width<=0||r.height<=0)return null;
      return r.top<innerHeight&&r.bottom<=dr.top+2?{top:r.top,bottom:r.bottom,dockTop:dr.top}:null;
    """))

def wait_account_panel(driver,timeout=8):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script("""
      const p=document.querySelector('.account-panel');if(!p)return null;
      const r=p.getBoundingClientRect(),style=getComputedStyle(p);
      if(style.visibility==='hidden'||style.display==='none'||r.width<300||r.height<=0||r.bottom>innerHeight+1)return null;
      return {text:p.textContent.trim(),w:r.width,h:r.height,bottom:r.bottom,vh:innerHeight};
    """))

def state(driver):
    try:
        return driver.execute_script("""
          const sidebar=document.querySelector('#sidebar'),dock=document.querySelector('.mobile-nav'),account=document.querySelector('.account-panel'),card=document.querySelector('.account-sheet-card');
          const sr=sidebar?.getBoundingClientRect(),dr=dock?.getBoundingClientRect(),ar=account?.getBoundingClientRect();
          return {
            hash:location.hash,
            viewport:{w:innerWidth,h:innerHeight},
            ready:document.readyState,
            onboarding:Boolean(document.querySelector('#v10-onboarding')),
            accountApi:Boolean(window.TitansAccount),
            accountGuest:window.TitansAccount?.guest??null,
            accountCard:card?.textContent?.trim()||'',
            accountPanel:ar?{top:ar.top,bottom:ar.bottom,width:ar.width,height:ar.height,text:(account?.textContent||'').slice(0,180)}:null,
            sidebar:{open:Boolean(sidebar?.classList.contains('open')),inert:Boolean(sidebar?.inert),rect:sr?{top:sr.top,bottom:sr.bottom,width:sr.width,height:sr.height}:null},
            moreExpanded:document.querySelector('#mobile-more-button')?.getAttribute('aria-expanded')||null,
            dock:dr?{top:dr.top,bottom:dr.bottom,width:dr.width,height:dr.height}:null,
            appText:(document.querySelector('#app')?.innerText||'').slice(0,300)
          };
        """)
    except Exception as exc:return {'stateReadError':f'{type(exc).__name__}: {exc}'}

def severe(driver):
    return [r.get('message','') for r in driver.get_log('browser') if r.get('level')=='SEVERE' and 'favicon' not in r.get('message','').lower()]

result={'ok':False,'base':BASE,'browserWarnings':[]};start=time.time();d=None;stage='starting'
try:
    stage='launch';d=driver_for()
    stage='load-home';d.get(f'{BASE}/#home')
    stage='prepare-returning-user';prepare_returning_user(d)
    stage='disable-sidebar-motion';disable_sidebar_motion(d)
    stage='wait-guest'
    guest=wait(d,"""const card=document.querySelector('.account-sheet-card'),app=document.querySelector('#app');if(!card||!app?.firstElementChild||!window.TitansAccount)return null;return {text:card.textContent.trim(),route:location.hash,accountGuest:Boolean(window.TitansAccount.guest)};""")
    if 'GUEST' not in guest['text'].upper() or not guest['accountGuest']: raise RuntimeError(f'guest state missing: {guest}')

    stage='open-more';d.find_element(By.ID,'mobile-more-button').click()
    stage='wait-more';sheet=wait_sheet_settled(d)
    stage='open-account';d.find_element(By.CSS_SELECTOR,'.account-sheet-card [data-account-open]').click()
    stage='wait-account-panel';panel=wait_account_panel(d)
    if 'Continue as guest' not in panel['text']: raise RuntimeError(f'account panel unusable: {panel}')
    stage='close-account';d.find_element(By.CSS_SELECTOR,'.account-panel [data-account-close]').click()
    wait(d,"return !document.querySelector('.account-modal')",5)

    stage='simulate-auth-outage'
    d.set_script_timeout(10)
    outage=d.execute_async_script("""
      const done=arguments[arguments.length-1],real=window.fetch;
      window.fetch=(input,init)=>String(input).includes('/api/account/auth/')?Promise.reject(new TypeError('simulated auth outage')):real(input,init);
      window.TitansAccount.refresh().then(()=>{const card=document.querySelector('.account-sheet-card');const out={guest:Boolean(window.TitansAccount.guest),text:card?.textContent?.trim()||''};window.fetch=real;done(out);}).catch(error=>{window.fetch=real;done({error:String(error)})});
    """)
    if outage.get('error') or not outage.get('guest') or 'GUEST' not in outage.get('text','').upper(): raise RuntimeError(f'auth outage did not preserve guest mode: {outage}')

    stage='navigate-roster';d.execute_script("location.hash='#roster'")
    stage='wait-roster';roster=wait(d,"return location.hash==='#roster'&&document.querySelector('#app')?.firstElementChild?{route:location.hash,text:document.querySelector('#app').textContent.slice(0,120)}:null",10)
    if roster['route']!='#roster': raise RuntimeError(f'guest navigation blocked: {roster}')
    stage='console';result['browserWarnings']=severe(d)
    if result['browserWarnings']: raise RuntimeError(f'Browser console errors: {result["browserWarnings"][:5]}')
    result.update({'ok':True,'guest':guest,'sheet':sheet,'panel':panel,'authOutage':outage,'roster':roster});stage='complete'
except Exception as exc:
    result['stage']=stage;result['error']=f'{type(exc).__name__}: {exc}'
    if d is not None:result['state']=state(d)
finally:
    if d is not None:
        try:d.quit()
        except Exception:pass
    result['durationSeconds']=round(time.time()-start,2);OUT.write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
if not result['ok']: raise SystemExit(1)
