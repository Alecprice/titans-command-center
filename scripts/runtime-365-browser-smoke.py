import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
OUT=Path('/tmp/runtime-365-browser-smoke.json')

def driver_for(width=1280,height=900):
    options=Options()
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument(f'--window-size={width},{height}')
    options.set_capability('goog:loggingPrefs',{'browser':'ALL'})
    return webdriver.Chrome(options=options)

def wait_css(driver,selector,timeout=15):
    return WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.CSS_SELECTOR,selector)))

def wait_365_panel(driver,timeout=15):
    def read_state(d):
        return d.execute_script("""
          const panel=document.querySelector('.v19-365');
          if(!panel||!panel.isConnected)return null;
          const style=getComputedStyle(panel),rect=panel.getBoundingClientRect();
          const cards=[...panel.querySelectorAll('.v19-365-grid>a')];
          const text=(panel.textContent||'').replace(/\s+/g,' ').trim();
          const visible=style.display!=='none'&&style.visibility!=='hidden'&&Number(style.opacity||1)>0&&rect.width>0&&rect.height>0&&panel.getClientRects().length>0;
          if(!visible||!text.includes('365 MODE')||cards.length!==4)return null;
          return {text,visible,display:style.display,visibility:style.visibility,opacity:style.opacity,width:rect.width,height:rect.height,cards:cards.length};
        """)
    return WebDriverWait(driver,timeout,poll_frequency=0.1).until(read_state)

def severe_logs(driver):
    rows=[]
    for row in driver.get_log('browser'):
        if row.get('level')=='SEVERE' and 'favicon' not in row.get('message','').lower():
            rows.append(row.get('message',''))
    return rows

result={'ok':False,'base':BASE,'desktop':{},'mobile':{},'browserWarnings':[]}
start=time.time()
try:
    d=driver_for()
    try:
        d.get(f'{BASE}/#home')
        panel_state=wait_365_panel(d)
        runtime=d.execute_script("return window.TitansRuntime ? {version:window.TitansRuntime.version,route:window.TitansRuntime.route(),cache:window.TitansRuntime.apiCacheInfo()} : null")
        phase=d.execute_script("return document.body.dataset.v19Phase || ''")
        cards=d.find_elements(By.CSS_SELECTOR,'.v19-365-grid > a')
        if not runtime or runtime.get('version')!='1.9.0': raise RuntimeError(f'Runtime missing or wrong version: {runtime}')
        if runtime.get('route')!='home': raise RuntimeError(f'Runtime route mismatch: {runtime}')
        if not phase or len(cards)!=4: raise RuntimeError(f'365 panel contract failed: phase={phase} cards={len(cards)} state={panel_state}')
        urls={row.get('url') for row in runtime.get('cache',[])}
        if '/api/data' not in urls or '/api/fan-intel' not in urls: raise RuntimeError(f'Shared API cache missing core rows: {runtime}')
        d.execute_script("location.hash='#command'")
        wait_css(d,'.v15-command')
        d.execute_script("location.hash='#home'")
        return_state=wait_365_panel(d)
        count=d.execute_script("return document.querySelectorAll('.v19-365').length")
        if count!=1: raise RuntimeError(f'365 panel duplicated after route cycle: {count}')
        result['desktop']={'phase':phase,'cards':len(cards),'runtimeVersion':runtime['version'],'routeCycle':True,'singlePanel':True,'cacheUrls':sorted(urls),'panel':panel_state,'returnPanel':return_state}
        result['browserWarnings'].extend(severe_logs(d))
    finally:
        d.quit()

    m=driver_for(390,844)
    try:
        m.get(f'{BASE}/#home')
        mobile_panel=wait_365_panel(m)
        mobile=m.execute_script("""
          const panel=document.querySelector('.v19-365');
          const links=[...document.querySelectorAll('.v19-365-grid>a')];
          return {
            viewport:innerWidth,
            overflow:document.documentElement.scrollWidth>innerWidth+1,
            panelWidth:panel?.getBoundingClientRect().width||0,
            panelHeight:panel?.getBoundingClientRect().height||0,
            targets:links.map(x=>({h:x.getBoundingClientRect().height,w:x.getBoundingClientRect().width,label:x.querySelector('small')?.textContent||''})),
            reviewHeight:document.querySelector('.v19-365>header>a')?.getBoundingClientRect().height||0
          }
        """)
        if mobile['overflow']: raise RuntimeError(f'Mobile horizontal overflow: {mobile}')
        if mobile['reviewHeight']<44: raise RuntimeError(f'Mobile review target too small: {mobile}')
        if any(x['h']<44 for x in mobile['targets']): raise RuntimeError(f'Mobile 365 card target too small: {mobile}')
        mobile['panelState']=mobile_panel
        result['mobile']=mobile
        result['browserWarnings'].extend(severe_logs(m))
    finally:
        m.quit()

    if result['browserWarnings']: raise RuntimeError(f'Browser console errors: {result["browserWarnings"][:5]}')
    result['ok']=True
except Exception as exc:
    result['error']=f'{type(exc).__name__}: {exc}'
finally:
    result['durationSeconds']=round(time.time()-start,2)
    OUT.write_text(json.dumps(result,indent=2))
    print(json.dumps(result,indent=2))

if not result['ok']:
    raise SystemExit(1)
