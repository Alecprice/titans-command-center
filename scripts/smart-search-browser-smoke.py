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

def severe_logs(driver):
    return [r.get('message','') for r in driver.get_log('browser') if r.get('level')=='SEVERE' and 'favicon' not in r.get('message','').lower()]

def wait_for(driver,script,timeout=15):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script(script))

result={'ok':False,'base':BASE,'desktop':{},'mobile':{},'browserWarnings':[]};start=time.time()
try:
    d=driver_for()
    try:
        d.get(f'{BASE}/#home')
        search=WebDriverWait(d,15).until(lambda x:x.find_element(By.ID,'global-search'))
        search.click();search.send_keys('Cam Ward')
        rows=wait_for(d,"return [...document.querySelectorAll('.v111-search-panel [data-v111-index]')].map(x=>({kind:x.querySelector('small')?.textContent||'',label:x.querySelector('strong')?.textContent||'',href:x.getAttribute('href')}))")
        players=[r for r in rows if r['kind']=='PLAYER']
        if not players or 'Cam Ward' not in players[0]['label']: raise RuntimeError(f'Player result missing: {rows}')
        search.send_keys(Keys.ARROW_DOWN);search.send_keys(Keys.ENTER)
        wait_for(d,"return location.hash.startsWith('#player?id=')")
        player_route=d.execute_script('return location.hash')
        d.execute_script("location.hash='#home'");wait_for(d,"return location.hash==='#home'")
        d.find_element(By.ID,'global-search').click();
        quick=wait_for(d,"return [...document.querySelectorAll('.v111-search-panel [data-v111-index]')].slice(0,6).map(x=>x.querySelector('strong')?.textContent||'')")
        result['desktop']={'playerResult':players[0]['label'],'playerRoute':player_route,'quickJump':quick}
        result['browserWarnings']+=severe_logs(d)
    finally:d.quit()

    m=driver_for(390,844)
    try:
        m.get(f'{BASE}/#home');search=WebDriverWait(m,15).until(lambda x:x.find_element(By.ID,'global-search'));search.click();search.send_keys('roster')
        mobile=wait_for(m,"""
          const p=document.querySelector('.v111-search-panel');const rows=[...p.querySelectorAll('[data-v111-index]')];const r=p.getBoundingClientRect();return p&&!p.hidden&&rows.length?{viewport:innerWidth,left:r.left,right:r.right,width:r.width,height:r.height,overflow:document.documentElement.scrollWidth>innerWidth+1,targets:rows.map(x=>x.getBoundingClientRect().height),labels:rows.map(x=>x.querySelector('strong')?.textContent||'')}:null;
        """)
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
