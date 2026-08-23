import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
OUT=Path('/tmp/smart-search-browser-smoke.json')

def driver_for(width=1280,height=900):
    options=Options();options.add_argument('--headless=new');options.add_argument('--no-sandbox');options.add_argument('--disable-dev-shm-usage');options.add_argument(f'--window-size={width},{height}');options.set_capability('goog:loggingPrefs',{'browser':'ALL'});return webdriver.Chrome(options=options)

def prepare_returning_user(driver):
    driver.execute_script("""
      localStorage.setItem('titans:v10Onboarded','1');
      document.querySelector('#v10-onboarding [data-v10-close]')?.click();
    """)
    WebDriverWait(driver,5,poll_frequency=.1).until(lambda d:not d.find_elements(By.CSS_SELECTOR,'#v10-onboarding'))

def severe_logs(driver):
    return [r.get('message','') for r in driver.get_log('browser') if r.get('level')=='SEVERE' and 'favicon' not in r.get('message','').lower()]

def wait_for(driver,script,timeout=15):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script(script))

def desktop_hit_areas(driver):
    return driver.execute_script("""
      const input=document.querySelector('#global-search'),shortcut=document.querySelector('.search-wrap kbd');
      if(!input||!shortcut)return null;
      const i=input.getBoundingClientRect(),k=shortcut.getBoundingClientRect();
      const x=i.left+i.width/2,y=i.top+i.height/2,owner=document.elementFromPoint(x,y);
      return {
        input:{left:i.left,right:i.right,top:i.top,bottom:i.bottom,width:i.width,height:i.height},
        shortcut:{left:k.left,right:k.right,top:k.top,bottom:k.bottom,width:k.width,height:k.height,enhanced:shortcut.dataset.fanCommand==='1'},
        overlap:Math.max(0,Math.min(i.right,k.right)-Math.max(i.left,k.left))*Math.max(0,Math.min(i.bottom,k.bottom)-Math.max(i.top,k.top)),
        inputCenterOwner:owner?.id||owner?.getAttribute?.('data-fan-command')||owner?.tagName||''
      };
    """)

def settled_hit_areas(driver):
    previous=None;stable=0
    def ready(d):
        nonlocal previous,stable
        hit=desktop_hit_areas(d)
        if not hit or not hit['shortcut']['enhanced']:return False
        sig=(round(hit['input']['left'],1),round(hit['input']['right'],1),round(hit['shortcut']['left'],1),round(hit['shortcut']['right'],1),hit['inputCenterOwner'])
        stable=stable+1 if sig==previous else 0;previous=sig
        return hit if stable>=2 else False
    return WebDriverWait(driver,10,poll_frequency=.1).until(ready)

result={'ok':False,'base':BASE,'desktop':{},'mobile':{},'browserWarnings':[]};start=time.time()
try:
    d=driver_for()
    try:
        d.get(f'{BASE}/#home');prepare_returning_user(d)
        search=WebDriverWait(d,15).until(lambda x:x.find_element(By.ID,'global-search'))
        hit=settled_hit_areas(d)
        if not hit or hit['input']['width']<120 or hit['input']['height']<32: raise RuntimeError(f'Desktop search input geometry invalid: {hit}')
        if hit['shortcut']['width']<32 or hit['shortcut']['height']<32: raise RuntimeError(f'Desktop command shortcut geometry invalid: {hit}')
        if hit['overlap']>0.5: raise RuntimeError(f'Desktop search input overlaps command shortcut: {hit}')
        if hit['inputCenterOwner']!='global-search': raise RuntimeError(f'Desktop search center click is owned by another element: {hit}')
        search.click();search.send_keys('Cam Ward')
        rows=wait_for(d,"return [...document.querySelectorAll('.v111-search-panel [data-v111-index]')].map(x=>({kind:x.querySelector('small')?.textContent||'',label:x.querySelector('strong')?.textContent||'',href:x.getAttribute('href')}))")
        players=[r for r in rows if r['kind']=='PLAYER']
        if not players or 'Cam Ward' not in players[0]['label']: raise RuntimeError(f'Player result missing: {rows}')
        search.send_keys(Keys.ARROW_DOWN);search.send_keys(Keys.ENTER)
        wait_for(d,"return location.hash.startsWith('#player?id=')")
        player_route=d.execute_script('return location.hash')
        d.execute_script("location.hash='#home'");wait_for(d,"return location.hash==='#home'")
        search=d.find_element(By.ID,'global-search');hit_after=settled_hit_areas(d)
        if hit_after['inputCenterOwner']!='global-search':raise RuntimeError(f'Desktop quick-jump click target intercepted after route return: {hit_after}')
        search.click()
        quick=wait_for(d,"return [...document.querySelectorAll('.v111-search-panel [data-v111-index]')].slice(0,6).map(x=>x.querySelector('strong')?.textContent||'')")
        result['desktop']={'playerResult':players[0]['label'],'playerRoute':player_route,'quickJump':quick,'hitAreas':hit,'hitAreasAfterRoute':hit_after};result['browserWarnings']+=severe_logs(d)
    finally:d.quit()
    m=driver_for(390,844)
    try:
        m.get(f'{BASE}/#home');prepare_returning_user(m)
        search=WebDriverWait(m,15).until(lambda x:x.find_element(By.ID,'global-search'));search.click();search.send_keys('roster')
        mobile=wait_for(m,"""const p=document.querySelector('.v111-search-panel');const rows=[...p.querySelectorAll('[data-v111-index]')];const r=p.getBoundingClientRect();return p&&!p.hidden&&rows.length?{viewport:innerWidth,left:r.left,right:r.right,width:r.width,height:r.height,overflow:document.documentElement.scrollWidth>innerWidth+1,targets:rows.map(x=>x.getBoundingClientRect().height),labels:rows.map(x=>x.querySelector('strong')?.textContent||'')}:null;""")
        if mobile['overflow'] or mobile['left']<0 or mobile['right']>mobile['viewport']+1: raise RuntimeError(f'Mobile search overflow: {mobile}')
        if any(h<44 for h in mobile['targets']): raise RuntimeError(f'Mobile search target too small: {mobile}')
        result['mobile']=mobile;result['browserWarnings']+=severe_logs(m)
    finally:m.quit()
    if result['browserWarnings']: raise RuntimeError(f'Browser console errors: {result["browserWarnings"][:5]}')
    result['ok']=True
except Exception as exc:result['error']=f'{type(exc).__name__}: {exc}'
finally:
    result['durationSeconds']=round(time.time()-start,2);OUT.write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
if not result['ok']: raise SystemExit(1)