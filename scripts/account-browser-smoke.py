import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.common.exceptions import ElementClickInterceptedException, ElementNotInteractableException, StaleElementReferenceException, TimeoutException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
OUT=Path('/tmp/account-browser-smoke.json')
IMPORT_FILE=Path('/tmp/titans-account-import-smoke.json')

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

def wait_mobile_shell_ready(driver,timeout=8):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script("""
      const sidebar=document.querySelector('#sidebar'),more=document.querySelector('#mobile-more-button'),dock=document.querySelector('.mobile-nav');
      if(document.readyState!=='complete'||!window.TitansRuntime||!sidebar||!more||!dock)return null;
      const mr=more.getBoundingClientRect(),dr=dock.getBoundingClientRect(),style=getComputedStyle(more);
      if(sidebar.getAttribute('aria-hidden')!=='true'||!sidebar.inert||sidebar.classList.contains('open'))return null;
      if(more.getAttribute('aria-expanded')!=='false'||style.display==='none'||style.visibility==='hidden'||style.pointerEvents==='none'||mr.width<44||mr.height<44)return null;
      if(dr.width<=0||dr.height<60||mr.bottom>innerHeight+1)return null;
      return {runtime:window.TitansRuntime.version,more:{w:mr.width,h:mr.height,top:mr.top,bottom:mr.bottom},dock:{w:dr.width,h:dr.height,top:dr.top},sidebarHidden:sidebar.getAttribute('aria-hidden'),sidebarInert:Boolean(sidebar.inert)};
    """))

def wait_sheet_settled(driver,timeout=8):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script("""
      const s=document.querySelector('#sidebar'),m=document.querySelector('#mobile-more-button'),dock=document.querySelector('.mobile-nav');
      const r=s?.getBoundingClientRect(),dr=dock?.getBoundingClientRect();
      if(!s?.classList.contains('open')||s.inert||m?.getAttribute('aria-expanded')!=='true'||!r||!dr||r.width<=0||r.height<=0)return null;
      return r.top<innerHeight&&r.bottom<=dr.top+2?{top:r.top,bottom:r.bottom,dockTop:dr.top}:null;
    """))

def open_more_sheet(driver,attempts=3):
    last_error=None
    for _ in range(attempts):
        try:
            opened=driver.execute_script("return document.querySelector('#sidebar')?.classList.contains('open')&&!document.querySelector('#sidebar')?.inert")
            if not opened:
                driver.find_element(By.ID,'mobile-more-button').click()
            return wait_sheet_settled(driver,timeout=2)
        except (ElementClickInterceptedException,ElementNotInteractableException,StaleElementReferenceException,TimeoutException) as exc:
            last_error=exc
            time.sleep(.12)
    if last_error:raise last_error
    raise RuntimeError('More button did not open settled sidebar')

def wait_account_entry(driver,timeout=5):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script("""
      const b=document.querySelector('#sidebar > .account-sheet-card [data-account-open]'),s=document.querySelector('#sidebar'),dock=document.querySelector('.mobile-nav');
      if(!b||!s?.classList.contains('open')||s.inert)return null;
      const r=b.getBoundingClientRect(),sr=s.getBoundingClientRect(),dr=dock?.getBoundingClientRect(),style=getComputedStyle(b);
      const visibleTop=Math.max(0,sr.top),visibleBottom=Math.min(innerHeight,sr.bottom,dr?.top??innerHeight);
      if(style.visibility==='hidden'||style.display==='none'||r.width<44||r.height<44||r.top<visibleTop-1||r.bottom>visibleBottom+1)return null;
      return {top:r.top,bottom:r.bottom,w:r.width,h:r.height,visibleTop,visibleBottom,parent:document.querySelector('#sidebar > .account-sheet-card')?'sidebar':'other'};
    """))

def open_account_from_sheet(driver,attempts=3):
    last_error=None
    for _ in range(attempts):
        opened=driver.execute_script("return document.querySelector('#sidebar')?.classList.contains('open')&&!document.querySelector('#sidebar')?.inert")
        if not opened:
            open_more_sheet(driver)
        try:
            geometry=wait_account_entry(driver)
            button=driver.find_element(By.CSS_SELECTOR,'#sidebar > .account-sheet-card [data-account-open]')
            button.click()
            WebDriverWait(driver,2,poll_frequency=.1).until(lambda d:d.find_elements(By.CSS_SELECTOR,'.account-panel'))
            return geometry
        except (ElementClickInterceptedException,ElementNotInteractableException,StaleElementReferenceException,TimeoutException) as exc:
            last_error=exc
            time.sleep(.12)
    if last_error:raise last_error
    raise RuntimeError('account entry did not open account panel')

def wait_account_panel(driver,timeout=8):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script("""
      const p=document.querySelector('.account-panel');if(!p)return null;
      const r=p.getBoundingClientRect(),style=getComputedStyle(p);
      if(style.visibility==='hidden'||style.display==='none'||r.width<300||r.height<=0||r.bottom>innerHeight+1)return null;
      return {text:p.textContent.trim(),w:r.width,h:r.height,bottom:r.bottom,vh:innerHeight};
    """))

def wait_guest_tools(driver,timeout=8):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script("""
      const panel=document.querySelector('.account-panel'),exp=panel?.querySelector('[data-account-export]'),reset=panel?.querySelector('[data-account-reset]'),imp=panel?.querySelector('[data-account-import]');
      if(!panel||!exp||!reset||!imp)return null;
      const er=exp.getBoundingClientRect(),rr=reset.getBoundingClientRect(),ir=imp.getBoundingClientRect();
      if(er.height<44||rr.height<44||ir.height<44||er.width<44||rr.width<44||ir.width<44)return null;
      return {exportLabel:exp.textContent.trim(),importLabel:imp.textContent.trim(),resetLabel:reset.textContent.trim(),exportHeight:er.height,importHeight:ir.height,resetHeight:rr.height,guest:Boolean(window.TitansAccount?.guest)};
    """))

def state(driver):
    try:
        return driver.execute_script("""
          const sidebar=document.querySelector('#sidebar'),dock=document.querySelector('.mobile-nav'),account=document.querySelector('.account-panel'),card=document.querySelector('.account-sheet-card'),entry=card?.querySelector('[data-account-open]');
          const sr=sidebar?.getBoundingClientRect(),dr=dock?.getBoundingClientRect(),ar=account?.getBoundingClientRect(),er=entry?.getBoundingClientRect();
          return {
            hash:location.hash,
            viewport:{w:innerWidth,h:innerHeight},
            ready:document.readyState,
            onboarding:Boolean(document.querySelector('#v10-onboarding')),
            runtimeVersion:window.TitansRuntime?.version||null,
            accountApi:Boolean(window.TitansAccount),
            accountGuest:window.TitansAccount?.guest??null,
            accountImport:Boolean(window.TitansAccountImport),
            accountCard:card?.textContent?.trim()||'',
            accountCardAtSidebarTop:Boolean(document.querySelector('#sidebar > .account-sheet-card')),
            accountEntry:er?{top:er.top,bottom:er.bottom,width:er.width,height:er.height}:null,
            accountPanel:ar?{top:ar.top,bottom:ar.bottom,width:ar.width,height:ar.height,text:(account?.textContent||'').slice(0,260)}:null,
            importPreview:document.querySelector('.account-import-preview')?.textContent?.trim()||'',
            sidebar:{open:Boolean(sidebar?.classList.contains('open')),inert:Boolean(sidebar?.inert),ariaHidden:sidebar?.getAttribute('aria-hidden')||null,rect:sr?{top:sr.top,bottom:sr.bottom,width:sr.width,height:sr.height}:null},
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
    IMPORT_FILE.write_text(json.dumps({'format':'titans-command-center-settings','version':1,'exportedAt':'2026-08-22T12:00:00Z','scope':'guest-device','account':None,'preferences':{'titans:v15MyTitans':{'favorite':'Browser Smoke'}}}),encoding='utf-8')
    stage='launch';d=driver_for()
    stage='load-home';d.get(f'{BASE}/#home')
    stage='prepare-returning-user';prepare_returning_user(d)
    stage='disable-sidebar-motion';disable_sidebar_motion(d)
    stage='wait-guest'
    guest=wait(d,"""const card=document.querySelector('.account-sheet-card'),app=document.querySelector('#app');if(!card||!app?.firstElementChild||!window.TitansAccount)return null;return {text:card.textContent.trim(),route:location.hash,accountGuest:Boolean(window.TitansAccount.guest)};""")
    if 'GUEST' not in guest['text'].upper() or not guest['accountGuest']: raise RuntimeError(f'guest state missing: {guest}')
    stage='wait-mobile-shell';shell=wait_mobile_shell_ready(d)

    stage='open-more';stage='wait-more';sheet=open_more_sheet(d)
    stage='open-account';entry=open_account_from_sheet(d)
    stage='wait-account-panel';panel=wait_account_panel(d)
    if 'Continue as guest' not in panel['text']: raise RuntimeError(f'account panel unusable: {panel}')

    stage='guest-portability-tools';tools=wait_guest_tools(d)
    if tools['exportLabel']!='Export this device' or tools['importLabel']!='Import backup' or tools['resetLabel']!='Reset this device' or not tools['guest']: raise RuntimeError(f'guest portability tools invalid: {tools}')

    stage='import-preview';d.find_element(By.CSS_SELECTOR,'[data-account-import-file]').send_keys(str(IMPORT_FILE))
    import_preview=wait(d,"""const p=document.querySelector('.account-import-preview'),a=p?.querySelector('[data-account-import-apply]');if(!p||p.hidden||!a)return null;const r=a.getBoundingClientRect();return {text:p.textContent.trim(),applyHeight:r.height,pending:window.TitansAccountImport?.pending||null,favorite:JSON.parse(localStorage.getItem('titans:v15MyTitans')||'null')?.favorite||null};""",8)
    if 'READY TO RESTORE' not in import_preview['text'] or 'Nothing has changed yet' not in import_preview['text'] or import_preview['applyHeight']<44 or import_preview['favorite']=='Browser Smoke': raise RuntimeError(f'import did not remain preview-only: {import_preview}')
    stage='cancel-import';d.find_element(By.CSS_SELECTOR,'[data-account-import-cancel]').click()
    wait(d,"return document.querySelector('.account-import-preview')?.hidden===true && !window.TitansAccountImport?.pending",5)

    stage='arm-reset';d.find_element(By.CSS_SELECTOR,'.account-panel [data-account-reset]').click()
    armed=wait(d,"""const b=document.querySelector('.account-panel [data-account-reset]'),h=document.querySelector('.account-reset-hint');return b?.dataset.armed==='true'&&b.textContent.trim()==='Confirm reset'?{label:b.textContent.trim(),hint:h?.textContent.trim()||'',guest:Boolean(window.TitansAccount?.guest),hash:location.hash}:null;""",5)
    if 'within 6 seconds' not in armed['hint'] or not armed['guest'] or armed['hash']!='#home': raise RuntimeError(f'reset confirmation invalid: {armed}')

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
    result.update({'ok':True,'guest':guest,'mobileShell':shell,'sheet':sheet,'accountEntry':entry,'panel':panel,'portabilityTools':tools,'importPreview':import_preview,'resetArmed':armed,'authOutage':outage,'roster':roster});stage='complete'
except Exception as exc:
    result['stage']=stage;result['error']=f'{type(exc).__name__}: {exc}'
    if d is not None:result['state']=state(d)
finally:
    if d is not None:
        try:d.quit()
        except Exception:pass
    try:IMPORT_FILE.unlink(missing_ok=True)
    except Exception:pass
    result['durationSeconds']=round(time.time()-start,2);OUT.write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
if not result['ok']: raise SystemExit(1)
