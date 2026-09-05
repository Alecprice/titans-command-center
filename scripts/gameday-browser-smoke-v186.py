import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans.alecjprice.com').rstrip('/')
OUT=Path('/tmp/gameday-browser-smoke-v186.json')

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
    viewport=driver.execute_script("return {width:innerWidth,height:innerHeight,phone:matchMedia('(max-width:759px)').matches}")
    if viewport!={'width':390,'height':844,'phone':True}:
        raise RuntimeError(f'Game Day viewport override failed: {viewport}')

    driver.get(f'{BASE}/#live')
    WebDriverWait(driver,15,poll_frequency=.1).until(lambda d:d.execute_script("return document.readyState==='complete'&&Boolean(window.TitansRuntime)&&Boolean(document.querySelector('#app'))"))
    WebDriverWait(driver,15,poll_frequency=.1).until(lambda d:d.execute_script("return Boolean(document.querySelector('.gameday-v16,.v22-home-guide'))"))
    if driver.execute_script("return Boolean(document.querySelector('.v22-home-guide'))"):
        WebDriverWait(driver,15,poll_frequency=.1).until(lambda d:d.execute_script("const guide=document.querySelector('.v22-home-guide');const entry=guide?.querySelector('.v185-entry-ready');return Boolean(entry&&entry.querySelectorAll('a').length>=3)"))

    state=driver.execute_script(r"""
      const guide=document.querySelector('.v22-home-guide');
      const entry=document.querySelector('.v185-entry-ready');
      const links=[...entry?.querySelectorAll('a')||[]].map(a=>({
        label:a.textContent.trim(),href:a.href,target:a.getAttribute('target'),rel:a.getAttribute('rel'),height:a.getBoundingClientRect().height
      }));
      return {
        homeGuide:Boolean(guide),entryReady:Boolean(entry),
        entryText:entry?.textContent?.replace(/\s+/g,' ').trim()||'',links,
        overflow:document.documentElement.scrollWidth>innerWidth+1,
        viewport:{width:innerWidth,height:innerHeight,phone:matchMedia('(max-width:759px)').matches}
      };
    """)

    if state['overflow']:
        raise RuntimeError(f'Game Day overflows 390px viewport: {state}')
    if state['homeGuide']:
        if not state['entryReady']:
            raise RuntimeError(f'Home Game Day guide is missing entry readiness: {state}')
        text=state['entryText'].lower()
        if 'two hours before kickoff' not in text or 'screenshots and pdf printouts are not accepted' not in text:
            raise RuntimeError(f'Entry readiness truth is incomplete: {state}')
        if len(state['links'])<3 or any(item['height']<48 for item in state['links']):
            raise RuntimeError(f'Entry actions miss the 48px phone floor: {state["links"]}')
        for item in state['links']:
            if item['target']!='_blank' or 'noopener' not in (item['rel'] or ''):
                raise RuntimeError(f'Unsafe Game Day external action: {item}')
        hrefs=' '.join(item['href'] for item in state['links'])
        for expected in ('/tickets/mobile-tickets/','/fans/mobile-app/','/stadium/policies'):
            if expected not in hrefs:
                raise RuntimeError(f'Missing official Game Day destination {expected}: {state["links"]}')
    elif state['entryReady']:
        raise RuntimeError(f'Entry readiness rendered without the home-game guide: {state}')

    severe=[row.get('message','') for row in driver.get_log('browser') if row.get('level')=='SEVERE' and 'favicon' not in row.get('message','').lower()]
    if severe:
        raise RuntimeError(f'Game Day browser console errors: {severe[:5]}')

    result.update({'ok':True,'viewport':viewport,'gameday':state})
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
