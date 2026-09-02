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


def prepare_returning_user(driver):
    driver.execute_script("""
      localStorage.setItem('titans:v10Onboarded','1');
      document.querySelector('#v10-onboarding [data-v10-close]')?.click();
    """)
    WebDriverWait(driver,5,poll_frequency=.1).until(
        lambda d:not d.find_elements(By.CSS_SELECTOR,'#v10-onboarding')
    )


def disable_sidebar_motion(driver):
    driver.execute_script("""
      if(document.querySelector('style[data-runtime-smoke]'))return;
      const style=document.createElement('style');
      style.dataset.runtimeSmoke='true';
      style.textContent='#sidebar{transition:none!important;animation:none!important}';
      document.head.appendChild(style);
    """)


def wait_365_panel(driver,timeout=15):
    def read_state(d):
        return d.execute_script(r"""
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


def read_regular_readiness(driver):
    return driver.execute_script("""
      const cards=[...document.querySelectorAll('.v19-365-grid>a')];
      const row=label=>{
        const card=cards.find(x=>(x.querySelector('small')?.textContent||'').trim()===label);
        return card?{title:(card.querySelector('strong')?.textContent||'').trim(),copy:(card.querySelector('span')?.textContent||'').trim()}:null;
      };
      return {availability:row('AVAILABILITY'),standings:row('AFC SOUTH')};
    """)


def assert_regular_readiness(phase,panel_state,readiness):
    if phase!='regular': return
    text=panel_state.get('text','')
    if 'Weekly report not loaded' in text or 'Standings not loaded' in text:
        raise RuntimeError(f'Regular-season 365 Mode exposes stale broken-state copy: {readiness}')
    availability=(readiness or {}).get('availability') or {}
    standings=(readiness or {}).get('standings') or {}
    if not availability.get('title') or not availability.get('copy'):
        raise RuntimeError(f'Regular-season availability readiness is incomplete: {readiness}')
    if not standings.get('title') or not standings.get('copy'):
        raise RuntimeError(f'Regular-season standings readiness is incomplete: {readiness}')
    if 'all-clear' in availability.get('copy','').lower() and 'not treated' not in availability.get('copy','').lower():
        raise RuntimeError(f'Availability fallback overclaims certainty: {readiness}')


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


def severe_logs(driver):
    rows=[]
    for row in driver.get_log('browser'):
        if row.get('level')=='SEVERE' and 'favicon' not in row.get('message','').lower():
            rows.append(row.get('message',''))
    return rows


def mobile_state(driver):
    try:
        return driver.execute_script("""
          const sidebar=document.querySelector('#sidebar'),dock=document.querySelector('.mobile-nav'),panel=document.querySelector('.v19-365'),search=document.querySelector('.v111-search-panel');
          const sr=sidebar?.getBoundingClientRect(),dr=dock?.getBoundingClientRect(),pr=panel?.getBoundingClientRect(),qr=search?.getBoundingClientRect();
          return {
            hash:location.hash,
            viewport:{w:innerWidth,h:innerHeight},
            onboarding:Boolean(document.querySelector('#v10-onboarding')),
            panel:{count:document.querySelectorAll('.v19-365').length,rect:pr?{top:pr.top,bottom:pr.bottom,width:pr.width,height:pr.height}:null},
            sidebar:{className:sidebar?.className||'',open:Boolean(sidebar?.classList.contains('open')),inert:Boolean(sidebar?.inert),rect:sr?{top:sr.top,bottom:sr.bottom,width:sr.width,height:sr.height}:null},
            moreExpanded:document.querySelector('#mobile-more-button')?.getAttribute('aria-expanded')||null,
            dock:{rect:dr?{top:dr.top,bottom:dr.bottom,width:dr.width,height:dr.height}:null,targets:document.querySelectorAll('.mobile-nav a,.mobile-nav button').length},
            search:{exists:Boolean(search),hidden:search?.hidden??null,rect:qr?{left:qr.left,right:qr.right,width:qr.width,height:qr.height}:null,rows:search?.querySelectorAll('[data-v111-index]').length||0},
            appText:(document.querySelector('#app')?.innerText||'').slice(0,360)
          };
        """)
    except Exception as exc:
        return {'stateReadError':f'{type(exc).__name__}: {exc}'}


result={'ok':False,'base':BASE,'desktop':{},'mobile':{},'browserWarnings':[]}
start=time.time();stage='starting';d=None;m=None
try:
    stage='desktop:launch'
    d=driver_for()
    try:
        stage='desktop:load-home';d.get(f'{BASE}/#home')
        stage='desktop:prepare-returning-user';prepare_returning_user(d)
        stage='desktop:wait-365-panel';panel_state=wait_365_panel(d)
        stage='desktop:read-runtime'
        runtime=d.execute_script("return window.TitansRuntime ? {version:window.TitansRuntime.version,route:window.TitansRuntime.route(),teamTimeZone:window.TitansRuntime.teamTimeZone,teamTimeLabel:window.TitansRuntime.teamTimeLabel,cache:window.TitansRuntime.apiCacheInfo(),refresh:window.TitansRuntime.refreshInfo()} : null")
        phase=d.execute_script("return document.body.dataset.v19Phase || ''")
        cards=d.find_elements(By.CSS_SELECTOR,'.v19-365-grid > a')
        readiness=read_regular_readiness(d)
        if not runtime or runtime.get('version')!='1.10.0': raise RuntimeError(f'Runtime missing or wrong version: {runtime}')
        if runtime.get('route')!='home': raise RuntimeError(f'Runtime route mismatch: {runtime}')
        if runtime.get('teamTimeZone')!='America/Chicago' or runtime.get('teamTimeLabel')!='Nashville time': raise RuntimeError(f'Team-time runtime contract missing: {runtime}')
        if not phase or len(cards)!=4: raise RuntimeError(f'365 panel contract failed: phase={phase} cards={len(cards)} state={panel_state}')
        assert_regular_readiness(phase,panel_state,readiness)
        if 'NEXT GAME' in panel_state['text'] and 'Next game TBD' not in panel_state['text']:
            if ' UTC' in panel_state['text'] or not ('CDT' in panel_state['text'] or 'CST' in panel_state['text']):
                raise RuntimeError(f'365 Mode kickoff is not rendered in Nashville time: {panel_state}')
        urls={row.get('url') for row in runtime.get('cache',[])}
        if '/api/data' not in urls or '/api/fan-intel' not in urls: raise RuntimeError(f'Shared API cache missing core rows: {runtime}')

        stage='desktop:refresh-control'
        previous_epoch=(runtime.get('refresh') or {}).get('epoch',0)
        refresh_button=wait_css(d,'#refresh-button')
        WebDriverWait(d,5,poll_frequency=.1).until(lambda driver:not driver.find_elements(By.CSS_SELECTOR,'.v10-modal'))
        refresh_button.click()
        stage='desktop:wait-refresh';refresh_state=wait_refresh(d,previous_epoch)
        stage='desktop:wait-refreshed-panel';refreshed_panel=wait_365_panel(d)
        refreshed_readiness=read_regular_readiness(d)
        assert_regular_readiness(phase,refreshed_panel,refreshed_readiness)
        if refresh_state['epoch']!=previous_epoch+1: raise RuntimeError(f'Unexpected refresh epoch: before={previous_epoch} after={refresh_state}')

        stage='desktop:command-route';d.execute_script("location.hash='#command'");wait_css(d,'.v15-command')
        stage='desktop:return-home';d.execute_script("location.hash='#home'");return_state=wait_365_panel(d)
        return_readiness=read_regular_readiness(d)
        assert_regular_readiness(phase,return_state,return_readiness)
        count=d.execute_script("return document.querySelectorAll('.v19-365').length")
        if count!=1: raise RuntimeError(f'365 panel duplicated after route cycle: {count}')
        result['desktop']={'phase':phase,'cards':len(cards),'runtimeVersion':runtime['version'],'teamTimeZone':runtime['teamTimeZone'],'teamTimeLabel':runtime['teamTimeLabel'],'routeCycle':True,'singlePanel':True,'cacheUrls':sorted(urls),'readiness':readiness,'panel':panel_state,'refresh':refresh_state,'refreshedReadiness':refreshed_readiness,'refreshedPanel':refreshed_panel,'returnReadiness':return_readiness,'returnPanel':return_state}
        result['browserWarnings'].extend(severe_logs(d))
    finally:
        d.quit();d=None

    stage='mobile:launch';m=driver_for(390,844)
    stage='mobile:load-home';m.get(f'{BASE}/#home')
    stage='mobile:prepare-returning-user';prepare_returning_user(m)
    stage='mobile:disable-sidebar-motion';disable_sidebar_motion(m)
    stage='mobile:wait-365-panel';mobile_panel=wait_365_panel(m)
    stage='mobile:read-readiness';mobile_readiness=read_regular_readiness(m)
    assert_regular_readiness(phase,mobile_panel,mobile_readiness)
    stage='mobile:read-layout'
    mobile=m.execute_script("""
      const panel=document.querySelector('.v19-365');
      const links=[...document.querySelectorAll('.v19-365-grid>a')];
      const dock=document.querySelector('.mobile-nav');
      const dr=dock?.getBoundingClientRect();
      const dockTargets=[...(dock?.querySelectorAll('a,button')||[])];
      return {
        viewport:innerWidth,
        overflow:document.documentElement.scrollWidth>innerWidth+1,
        panelWidth:panel?.getBoundingClientRect().width||0,
        panelHeight:panel?.getBoundingClientRect().height||0,
        targets:links.map(x=>({h:x.getBoundingClientRect().height,w:x.getBoundingClientRect().width,label:x.querySelector('small')?.textContent||''})),
        reviewHeight:document.querySelector('.v19-365>header>a')?.getBoundingClientRect().height||0,
        dock:dr?{x:dr.x,y:dr.y,w:dr.width,h:dr.height,display:getComputedStyle(dock).display}:null,
        dockTargets:dockTargets.map(x=>({h:x.getBoundingClientRect().height,w:x.getBoundingClientRect().width,label:(x.textContent||'').trim()}))
      }
    """)
    if mobile['overflow']: raise RuntimeError(f'Mobile horizontal overflow: {mobile}')
    if mobile['reviewHeight']<44: raise RuntimeError(f'Mobile review target too small: {mobile}')
    if any(x['h']<44 for x in mobile['targets']): raise RuntimeError(f'Mobile 365 card target too small: {mobile}')
    if not mobile['dock'] or mobile['dock']['display']=='none' or mobile['dock']['h']<60 or mobile['dock']['x']<0 or mobile['dock']['x']+mobile['dock']['w']>mobile['viewport']+1: raise RuntimeError(f'Mobile dock invalid: {mobile}')
    if len(mobile['dockTargets'])!=5 or any(x['h']<44 or x['w']<44 for x in mobile['dockTargets']): raise RuntimeError(f'Mobile five-action dock targets invalid: {mobile}')
    dock_labels={x['label'] for x in mobile['dockTargets']}
    if not {'Home','Roster','Game','Search','More'}.issubset(dock_labels): raise RuntimeError(f'Mobile five-action dock labels invalid: {mobile}')
    result['mobile']['layout']=mobile
    result['mobile']['readiness']=mobile_readiness
    result['mobile']['panelState']=mobile_panel

    stage='mobile:more-click';m.find_element(By.ID,'mobile-more-button').click()
    stage='mobile:more-settle'
    sheet=WebDriverWait(m,6,poll_frequency=.1).until(lambda driver:driver.execute_script("""
      const s=document.querySelector('#sidebar'),more=document.querySelector('#mobile-more-button'),dock=document.querySelector('.mobile-nav');
      const r=s?.getBoundingClientRect(),dr=dock?.getBoundingClientRect();
      if(!s?.classList.contains('open')||more?.getAttribute('aria-expanded')!=='true'||!r||!dr||r.width<=0||r.height<=0)return null;
      if(r.top>=innerHeight||r.bottom>dr.top+2)return null;
      return {top:r.top,bottom:r.bottom,height:r.height,links:[...s.querySelectorAll('.nav a')].length,dockTop:dr.top};
    """))
    if sheet['bottom']>sheet['dockTop']+2: raise RuntimeError(f'Mobile sheet overlaps dock after settle: sheet={sheet} mobile={mobile}')
    result['mobile']['sheet']=sheet

    stage='mobile:close-more';m.execute_script("document.querySelector('#app').click()")
    WebDriverWait(m,5,poll_frequency=.1).until(lambda driver:driver.execute_script("return !document.querySelector('#sidebar')?.classList.contains('open')"))

    stage='mobile:search-input';search=m.find_element(By.ID,'global-search');search.click();search.send_keys('roster')
    stage='mobile:search-panel'
    search_state=WebDriverWait(m,8,poll_frequency=.1).until(lambda driver:driver.execute_script("""
      const p=document.querySelector('.v111-search-panel');if(!p||p.hidden)return null;
      const r=p.getBoundingClientRect(),rows=[...p.querySelectorAll('[data-v111-index]')];
      return rows.length?{left:r.left,right:r.right,width:r.width,height:r.height,rows:rows.length,targets:rows.map(x=>x.getBoundingClientRect().height)}:null;
    """))
    if search_state['left']<0 or search_state['right']>mobile['viewport']+1 or any(h<44 for h in search_state['targets']): raise RuntimeError(f'Mobile Smart Search invalid: {search_state}')
    result['mobile']['smartSearch']=search_state

    stage='mobile:console';result['browserWarnings'].extend(severe_logs(m))
    if result['browserWarnings']: raise RuntimeError(f'Browser console errors: {result["browserWarnings"][:5]}')
    result['ok']=True;stage='complete'
except Exception as exc:
    result['stage']=stage
    result['error']=f'{type(exc).__name__}: {exc}'
    if m is not None: result['mobileState']=mobile_state(m)
finally:
    if m is not None:
        try:m.quit()
        except Exception:pass
    if d is not None:
        try:d.quit()
        except Exception:pass
    result['durationSeconds']=round(time.time()-start,2)
    OUT.write_text(json.dumps(result,indent=2))
    print(json.dumps(result,indent=2))

if not result['ok']:
    raise SystemExit(1)