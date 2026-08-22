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

def wait_refresh(driver,previous_epoch,timeout=15):
    def read_refresh(d):
        return d.execute_script("""
          const runtime=window.TitansRuntime;
          if(!runtime)return null;
          const info=runtime.refreshInfo?.();
          const cache=runtime.apiCacheInfo?.()||[];
          const urls=new Set(cache.filter(x=>x.hasValue).map(x=>x.url));
          const panel=document.querySelector('.v19-365');
          if(!info||info.epoch<=arguments[0]||info.last?.reason!=='scoreboard-control'||!panel||!panel.isConnected)return null;
          if(!urls.has('/api/data')||!urls.has('/api/fan-intel'))return null;
          return {epoch:info.epoch,last:info.last,cache};
        """,previous_epoch)
    return WebDriverWait(driver,timeout,poll_frequency=0.1).until(read_refresh)

def dismiss_transient_modal(driver):
    driver.execute_script("""
      const close=document.querySelector('[data-v10-close]');
      if(close)close.click();
    """)
    WebDriverWait(driver,5,poll_frequency=.1).until(lambda d:d.execute_script("return !document.querySelector('.v10-modal-backdrop')"))

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
        runtime=d.execute_script("return window.TitansRuntime ? {version:window.TitansRuntime.version,route:window.TitansRuntime.route(),cache:window.TitansRuntime.apiCacheInfo(),refresh:window.TitansRuntime.refreshInfo()} : null")
        phase=d.execute_script("return document.body.dataset.v19Phase || ''")
        cards=d.find_elements(By.CSS_SELECTOR,'.v19-365-grid > a')
        if not runtime or runtime.get('version')!='1.10.0': raise RuntimeError(f'Runtime missing or wrong version: {runtime}')
        if runtime.get('route')!='home': raise RuntimeError(f'Runtime route mismatch: {runtime}')
        if not phase or len(cards)!=4: raise RuntimeError(f'365 panel contract failed: phase={phase} cards={len(cards)} state={panel_state}')
        urls={row.get('url') for row in runtime.get('cache',[])}
        if '/api/data' not in urls or '/api/fan-intel' not in urls: raise RuntimeError(f'Shared API cache missing core rows: {runtime}')

        previous_epoch=(runtime.get('refresh') or {}).get('epoch',0)
        dismiss_transient_modal(d)
        refresh_button=wait_css(d,'#refresh-button')
        refresh_button.click()
        refresh_state=wait_refresh(d,previous_epoch)
        refreshed_panel=wait_365_panel(d)
        if refresh_state['epoch']!=previous_epoch+1: raise RuntimeError(f'Unexpected refresh epoch: before={previous_epoch} after={refresh_state}')

        d.execute_script("location.hash='#command'")
        wait_css(d,'.v15-command')
        d.execute_script("location.hash='#home'")
        return_state=wait_365_panel(d)
        count=d.execute_script("return document.querySelectorAll('.v19-365').length")
        if count!=1: raise RuntimeError(f'365 panel duplicated after route cycle: {count}')
        result['desktop']={'phase':phase,'cards':len(cards),'runtimeVersion':runtime['version'],'routeCycle':True,'singlePanel':True,'cacheUrls':sorted(urls),'panel':panel_state,'refresh':refresh_state,'refreshedPanel':refreshed_panel,'returnPanel':return_state}
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
          const menu=document.querySelector('#menu-button'),dock=document.querySelector('.mobile-nav');
          const mr=menu?.getBoundingClientRect(),dr=dock?.getBoundingClientRect();
          const dockTargets=[...(dock?.querySelectorAll('a,button')||[])];
          return {
            viewport:innerWidth,
            overflow:document.documentElement.scrollWidth>innerWidth+1,
            panelWidth:panel?.getBoundingClientRect().width||0,
            panelHeight:panel?.getBoundingClientRect().height||0,
            targets:links.map(x=>({h:x.getBoundingClientRect().height,w:x.getBoundingClientRect().width,label:x.querySelector('small')?.textContent||''})),
            reviewHeight:document.querySelector('.v19-365>header>a')?.getBoundingClientRect().height||0,
            menu:mr?{x:mr.x,y:mr.y,w:mr.width,h:mr.height,display:getComputedStyle(menu).display}:null,
            dock:dr?{x:dr.x,y:dr.y,w:dr.width,h:dr.height,display:getComputedStyle(dock).display}:null,
            dockTargets:dockTargets.map(x=>({h:x.getBoundingClientRect().height,w:x.getBoundingClientRect().width,label:(x.textContent||'').trim()}))
          }
        """)
        if mobile['overflow']: raise RuntimeError(f'Mobile horizontal overflow: {mobile}')
        if mobile['reviewHeight']<44: raise RuntimeError(f'Mobile review target too small: {mobile}')
        if any(x['h']<44 for x in mobile['targets']): raise RuntimeError(f'Mobile 365 card target too small: {mobile}')
        if not mobile['menu'] or mobile['menu']['display']=='none' or mobile['menu']['w']<44 or mobile['menu']['h']<44 or mobile['menu']['x']<0 or mobile['menu']['y']<0: raise RuntimeError(f'Mobile menu unreachable: {mobile}')
        if not mobile['dock'] or mobile['dock']['display']=='none' or mobile['dock']['h']<60 or mobile['dock']['x']<0 or mobile['dock']['x']+mobile['dock']['w']>mobile['viewport']+1: raise RuntimeError(f'Mobile dock invalid: {mobile}')
        if len(mobile['dockTargets'])!=5 or any(x['h']<44 or x['w']<44 for x in mobile['dockTargets']): raise RuntimeError(f'Mobile dock targets invalid: {mobile}')

        m.find_element(By.ID,'mobile-more-button').click()
        sheet=WebDriverWait(m,10,poll_frequency=.1).until(lambda driver:driver.execute_script("""
          const s=document.querySelector('#sidebar'),more=document.querySelector('#mobile-more-button');
          const r=s?.getBoundingClientRect();
          if(!s?.classList.contains('open')||more?.getAttribute('aria-expanded')!=='true'||!r||r.width<=0||r.height<=0)return null;
          return {top:r.top,bottom:r.bottom,height:r.height,links:[...s.querySelectorAll('.nav a')].length};
        """))
        if sheet['bottom']>mobile['dock']['y']+2: raise RuntimeError(f'Mobile sheet overlaps dock: sheet={sheet} mobile={mobile}')
        m.execute_script("document.querySelector('#app').click()")
        WebDriverWait(m,5).until(lambda driver:not driver.find_element(By.ID,'sidebar').get_attribute('class').split().__contains__('open'))

        search=m.find_element(By.ID,'global-search')
        search.click();search.send_keys('roster')
        search_state=WebDriverWait(m,10,poll_frequency=.1).until(lambda driver:driver.execute_script("""
          const p=document.querySelector('.v111-search-panel');if(!p||p.hidden)return null;
          const r=p.getBoundingClientRect(),rows=[...p.querySelectorAll('[data-v111-index]')];
          return rows.length?{left:r.left,right:r.right,width:r.width,height:r.height,rows:rows.length,targets:rows.map(x=>x.getBoundingClientRect().height)}:null;
        """))
        if search_state['left']<0 or search_state['right']>mobile['viewport']+1 or any(h<44 for h in search_state['targets']): raise RuntimeError(f'Mobile Smart Search invalid: {search_state}')

        mobile['panelState']=mobile_panel
        mobile['sheet']=sheet
        mobile['smartSearch']=search_state
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
