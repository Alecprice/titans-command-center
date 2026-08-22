import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
OUT=Path('/tmp/mobile-navigation-browser-smoke.json')

def driver_for(width,height):
    options=Options();options.add_argument('--headless=new');options.add_argument('--no-sandbox');options.add_argument('--disable-dev-shm-usage');options.add_argument(f'--window-size={width},{height}');options.set_capability('goog:loggingPrefs',{'browser':'ALL'});return webdriver.Chrome(options=options)

def prepare_returning_user(driver):
    driver.execute_script("""
      localStorage.setItem('titans:v10Onboarded','1');
      document.querySelector('#v10-onboarding [data-v10-close]')?.click();
    """)
    WebDriverWait(driver,5,poll_frequency=.1).until(lambda d:not d.find_elements(By.CSS_SELECTOR,'#v10-onboarding'))

def stabilize_mobile_sheet(driver):
    driver.execute_script("""
      if(!document.querySelector('style[data-mobile-nav-smoke-stable-sheet]')){
        const style=document.createElement('style');style.dataset.mobileNavSmokeStableSheet='';
        style.textContent='@media(max-width:760px){#sidebar{transition:none!important}}';document.head.appendChild(style);
      }
    """)

def wait(driver,script,timeout=15):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script(script))

def wait_sheet_settled(driver,timeout=10):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script("""
      const s=document.querySelector('#sidebar'),m=document.querySelector('#mobile-more-button'),dock=document.querySelector('.mobile-nav');
      const r=s?.getBoundingClientRect(),dr=dock?.getBoundingClientRect();
      if(!s?.classList.contains('open')||m?.getAttribute('aria-expanded')!=='true'||!r||!dr||r.width<=0||r.height<=0)return null;
      if(r.bottom>dr.top+2)return null;
      return {top:r.top,bottom:r.bottom,height:r.height,links:[...s.querySelectorAll('.nav a')].length,dockTop:dr.top,transform:getComputedStyle(s).transform};
    """))

def severe(driver):
    return [r.get('message','') for r in driver.get_log('browser') if r.get('level')=='SEVERE' and 'favicon' not in r.get('message','').lower()]

result={'ok':False,'base':BASE,'devices':{},'browserWarnings':[]};start=time.time()
try:
    for width,height in [(390,844),(360,800)]:
        d=driver_for(width,height)
        try:
            d.get(f'{BASE}/#home');prepare_returning_user(d);stabilize_mobile_sheet(d)
            state=wait(d,"""const menu=document.querySelector('#menu-button'),dock=document.querySelector('.mobile-nav'),more=document.querySelector('#mobile-more-button'),game=document.querySelector('.mobile-game-action'),search=document.querySelector('#mobile-search-button');if(!menu||!dock||!more||!game||!search)return null;const mr=menu.getBoundingClientRect(),dr=dock.getBoundingClientRect(),gr=game.querySelector('span').getBoundingClientRect();return {vw:innerWidth,vh:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth+1,menu:{x:mr.x,y:mr.y,w:mr.width,h:mr.height,display:getComputedStyle(menu).display},dock:{x:dr.x,y:dr.y,w:dr.width,h:dr.height,display:getComputedStyle(dock).display},gameIcon:{y:gr.y,h:gr.height},targets:[...dock.querySelectorAll('a,button')].map(x=>({h:x.getBoundingClientRect().height,w:x.getBoundingClientRect().width,label:x.textContent.trim()})),active:[...dock.querySelectorAll('.active')].map(x=>x.textContent.trim())};""")
            if state['overflow']: raise RuntimeError(f'horizontal overflow at {width}: {state}')
            if state['menu']['w']<44 or state['menu']['h']<44 or state['menu']['x']<0 or state['menu']['y']<0: raise RuntimeError(f'menu unreachable at {width}: {state}')
            if state['dock']['x']<0 or state['dock']['x']+state['dock']['w']>state['vw']+1 or state['dock']['h']<64: raise RuntimeError(f'dock geometry invalid at {width}: {state}')
            if len(state['targets'])!=5: raise RuntimeError(f'expected five dock actions at {width}: {state}')
            if any(x['h']<44 or x['w']<44 for x in state['targets']): raise RuntimeError(f'dock target too small at {width}: {state}')
            if not any(x['label']=='Game' for x in state['targets']) or not any(x['label']=='Search' for x in state['targets']): raise RuntimeError(f'primary dock actions missing at {width}: {state}')
            d.find_element(By.ID,'mobile-search-button').click()
            search=wait(d,"""const i=document.querySelector('#global-search'),p=document.querySelector('#v111-search-panel'),dock=document.querySelector('.mobile-nav');const r=dock?.getBoundingClientRect();return document.activeElement===i&&i?.getAttribute('aria-expanded')==='true'&&!p?.hidden&&document.body.classList.contains('pwa-search-open')?{dockOpacity:getComputedStyle(dock).opacity,dockTop:r?.top||0,panel:!!p}:null""")
            d.find_element(By.ID,'global-search').send_keys('Cam Ward');wait(d,"return [...document.querySelectorAll('#v111-search-panel [role=option]')].some(x=>x.textContent.includes('Cam Ward'))")
            d.find_element(By.ID,'global-search').send_keys('\ue00c');wait(d,"return !document.body.classList.contains('pwa-search-open')")
            d.find_element(By.ID,'mobile-more-button').click();opened=wait_sheet_settled(d)
            d.execute_script("document.querySelector('#app').click()");wait(d,"return !document.querySelector('#sidebar').classList.contains('open')")
            d.execute_script("location.hash='#stats'");active=wait(d,"return document.querySelector('#mobile-more-button')?.classList.contains('active') ? 'More' : ''")
            result['devices'][str(width)]={'geometry':state,'search':search,'sheet':opened,'activeAfterSecondaryRoute':active};result['browserWarnings']+=severe(d)
        finally:d.quit()
    if result['browserWarnings']: raise RuntimeError(f'Browser console errors: {result["browserWarnings"][:5]}')
    result['ok']=True
except Exception as exc:result['error']=f'{type(exc).__name__}: {exc}'
finally:
    result['durationSeconds']=round(time.time()-start,2);OUT.write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
if not result['ok']: raise SystemExit(1)