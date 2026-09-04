import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans.alecjprice.com').rstrip('/')
OUT=Path('/tmp/home-browser-smoke-v181.json')

options=webdriver.ChromeOptions()
options.add_argument('--headless=new')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=390,844')
options.set_capability('goog:loggingPrefs',{'browser':'ALL'})

result={'ok':False,'base':BASE}
driver=None
started=time.time()
try:
    driver=webdriver.Chrome(options=options)
    driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':False})
    viewport=driver.execute_script("return {width:innerWidth,height:innerHeight,phone:matchMedia('(max-width:760px)').matches}")
    if viewport!={'width':390,'height':844,'phone':True}:
        raise RuntimeError(f'Home viewport override failed: {viewport}')

    driver.get(f'{BASE}/#home')
    WebDriverWait(driver,15,poll_frequency=.1).until(lambda d:d.execute_script("return document.readyState==='complete'&&Boolean(window.TitansRuntime)&&Boolean(document.querySelector('.home-command-v123'))"))
    WebDriverWait(driver,15,poll_frequency=.1).until(lambda d:d.execute_script("return document.querySelector('.home-command-v123-focus h3')?.textContent?.trim().startsWith('Titans ')") )

    state=driver.execute_script("""
      const root=document.querySelector('.home-command-v123');
      const focus=root?.querySelector('.home-command-v123-focus');
      const actions=[...root?.querySelectorAll('.home-command-v123-action')||[]].map(a=>({
        label:a.textContent.trim(),
        href:a.getAttribute('href'),
        height:a.getBoundingClientRect().height,
        width:a.getBoundingClientRect().width
      }));
      const source=root?.querySelector('a[href="https://www.tennesseetitans.com/schedule/"]');
      return {
        kicker:root?.querySelector('.home-command-v123-kicker')?.textContent?.trim()||'',
        matchup:focus?.querySelector('h3')?.textContent?.trim()||'',
        meta:[...root?.querySelectorAll('.home-command-v123-meta span')||[]].map(x=>x.textContent.trim()),
        actions,
        officialSchedule:Boolean(source),
        officialTarget:source?.getAttribute('target')||null,
        officialRel:source?.getAttribute('rel')||null,
        overflow:document.documentElement.scrollWidth>innerWidth+1,
        viewport:{width:innerWidth,height:innerHeight,phone:matchMedia('(max-width:760px)').matches}
      };
    """)

    schedule=driver.execute_async_script("""
      const done=arguments[arguments.length-1];
      window.TitansRuntime.apiJson('/api/data',{ttl:0,force:true}).then(data=>{
        const focus=window.TitansRuntime.scheduleFocus(data?.games||[])||{};
        const game=focus.game||null;
        done({state:focus.state||'none',week:String(game?.week??''),status:String(game?.status||''),opponent:String(game?.opponent||''),homeAway:String(game?.homeAway||'')});
      }).catch(error=>done({error:String(error)}));
    """)

    if state['overflow']:
        raise RuntimeError(f'Home overflows 390px viewport: {state}')
    if not state['officialSchedule'] or state['officialTarget']!='_blank' or 'noopener' not in (state['officialRel'] or ''):
        raise RuntimeError(f'Official schedule action is not safely reachable: {state}')
    if len(state['actions'])<3 or any(item['height']<44 for item in state['actions']):
        raise RuntimeError(f'Home actions miss the 44px interaction floor: {state["actions"]}')
    if schedule.get('error'):
        raise RuntimeError(f'Could not resolve authoritative Home schedule focus: {schedule}')

    opener=schedule['week']=='1' and schedule['status']!='final'
    if opener:
        if state['kicker']!='SEASON OPENER' or 'Regular-season opener' not in state['meta']:
            raise RuntimeError(f'Week 1 is current but Home opener context is missing: schedule={schedule} state={state}')
    elif state['kicker']=='SEASON OPENER' or 'Regular-season opener' in state['meta']:
        raise RuntimeError(f'Home claims season opener outside unresolved Week 1: schedule={schedule} state={state}')

    severe=[row.get('message','') for row in driver.get_log('browser') if row.get('level')=='SEVERE' and 'favicon' not in row.get('message','').lower()]
    if severe:
        raise RuntimeError(f'Home browser console errors: {severe[:5]}')

    result.update({'ok':True,'viewport':viewport,'scheduleFocus':schedule,'home':state})
except Exception as exc:
    result['error']=f'{type(exc).__name__}: {exc}'
finally:
    if driver:
        driver.quit()
    result['durationSeconds']=round(time.time()-started,2)
    OUT.write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result,indent=2))

if not result['ok']:
    raise SystemExit(1)
