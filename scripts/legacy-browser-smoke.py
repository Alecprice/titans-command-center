import json
import os
import time
from pathlib import Path
from urllib.parse import parse_qs

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans.alecjprice.com').rstrip('/')
OUT=Path('/tmp/legacy-browser-smoke.json')


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


def hash_params(driver):
    raw=driver.execute_script('return location.hash') or ''
    query=raw.split('?',1)[1] if '?' in raw else ''
    return raw,parse_qs(query)


def legacy_ready(driver):
    return wait_for(driver,"""const p=document.querySelector('.legacy-page[data-legacy-finder-ready="true"][data-legacy-trails-ready="true"]');return p&&document.querySelector('[data-legacy-trails]')&&document.querySelector('#legacy-finder-input');""",20)


def geometry(driver):
    return driver.execute_script("""
      const root=document.documentElement;
      const trail=document.querySelector('[data-legacy-trails]');
      const cards=[...document.querySelectorAll('[data-legacy-trail]')];
      const actions=[...document.querySelectorAll('[data-legacy-trail-player] button:not(:disabled)')];
      const r=trail?.getBoundingClientRect();
      return {
        viewport:innerWidth,
        scrollWidth:root.scrollWidth,
        overflow:root.scrollWidth>innerWidth+1,
        trailRect:r?{left:r.left,right:r.right,width:r.width}:null,
        cards:cards.map(x=>{const b=x.getBoundingClientRect();return {w:b.width,h:b.height}}),
        actions:actions.map(x=>{const b=x.getBoundingClientRect();return {w:b.width,h:b.height,text:x.textContent.trim()}}),
      };
    """)


result={'ok':False,'base':BASE,'stage':'starting','desktop':{},'mobile':{},'browserWarnings':[]};start=time.time();d=None;m=None
try:
    result['stage']='desktop:launch'
    d=driver_for()
    d.get(f'{BASE}/#legacy');prepare_returning_user(d);legacy_ready(d)

    result['stage']='desktop:inventory'
    inventory=d.execute_script("""return {trails:document.querySelectorAll('[data-legacy-trail]').length,indexed:document.querySelectorAll('[data-legacy-finder-item="true"]').length,heritage:document.querySelectorAll('.legacy-venue-card,.legacy-honor-card').length};""")
    if inventory['trails']<5 or inventory['indexed']<20 or inventory['heritage']<20: raise RuntimeError(f'Legacy inventory incomplete: {inventory}')

    result['stage']='desktop:trail-start'
    d.find_element(By.CSS_SELECTOR,'[data-legacy-trail="1999-run"]').click()
    wait_for(d,"return location.hash.includes('trail=1999-run')&&document.querySelector('[data-legacy-trail-player]:not([hidden])')&&document.querySelectorAll('.legacy-finder-match').length>0")
    raw,params=hash_params(d)
    if params.get('trail',[''])[0]!='1999-run' or params.get('step',[''])[0]!='0':raise RuntimeError(f'Trail state incorrect after start: {raw}')
    if params.get('scope',[''])[0]!='story':raise RuntimeError(f'Finder scope not coordinated with trail: {raw}')

    result['stage']='desktop:trail-next'
    d.find_element(By.CSS_SELECTOR,'[data-legacy-trail-next]').click()
    wait_for(d,"return location.hash.includes('step=1')&&location.hash.includes('scope=moments')&&document.querySelector('.legacy-moment-card.legacy-finder-match')")
    raw2,params2=hash_params(d)
    if 'Music City Miracle' not in params2.get('q',[''])[0]:raise RuntimeError(f'Trail did not advance to miracle stop: {raw2}')

    result['stage']='desktop:manual-finder'
    d.find_element(By.CSS_SELECTOR,'[data-legacy-trail-exit]').click()
    wait_for(d,"return !location.hash.includes('trail=')&&!document.querySelector('[data-legacy-trail-player]:not([hidden])')")
    input_el=d.find_element(By.ID,'legacy-finder-input');input_el.clear();input_el.send_keys('Mike Keith')
    d.find_element(By.CSS_SELECTOR,'[data-legacy-finder-scope="heritage"]').click()
    matched=wait_for(d,"return [...document.querySelectorAll('.legacy-honor-card.legacy-finder-match')].map(x=>x.textContent.trim())")
    if not any('Mike Keith' in text for text in matched):raise RuntimeError(f'Finder did not isolate Mike Keith: {matched}')
    raw3,params3=hash_params(d)
    if 'trail' in params3 or params3.get('scope',[''])[0]!='heritage':raise RuntimeError(f'Manual Finder did not own route state: {raw3}')

    result['desktop']={'inventory':inventory,'trailStart':raw,'trailNext':raw2,'finder':raw3,'matched':matched[:3]}
    result['browserWarnings']+=severe_logs(d);d.quit();d=None

    result['stage']='mobile:launch'
    m=driver_for(390,844)
    m.get(f'{BASE}/#legacy?trail=1999-run&step=2');prepare_returning_user(m);legacy_ready(m)
    wait_for(m,"return document.querySelector('[data-legacy-trail-player]:not([hidden])')&&document.querySelectorAll('.legacy-finder-match').length>0")
    mobile=geometry(m)
    if mobile['overflow']:raise RuntimeError(f'Legacy mobile root overflow: {mobile}')
    if not mobile['trailRect'] or mobile['trailRect']['left']<-1 or mobile['trailRect']['right']>mobile['viewport']+1:raise RuntimeError(f'Legacy Trails outside mobile viewport: {mobile}')
    if any(a['h']<44 or a['w']<44 for a in mobile['actions']):raise RuntimeError(f'Legacy mobile trail action too small: {mobile}')
    active=m.execute_script("""const p=document.querySelector('[data-legacy-trail-player]');return {text:p?.innerText||'',matches:document.querySelectorAll('.legacy-finder-match').length,hash:location.hash};""")
    if 'Steve McNair' not in active['text'] or active['matches']<1:raise RuntimeError(f'Deep-linked mobile trail did not hydrate: {active}')
    m.find_element(By.CSS_SELECTOR,'[data-legacy-trail-next]').click()
    wait_for(m,"return location.hash.includes('step=3')&&document.querySelector('[data-legacy-trail-player]')?.innerText.includes('Eddie George')")
    result['mobile']={'geometry':mobile,'active':active,'afterNext':m.execute_script('return location.hash')}
    result['browserWarnings']+=severe_logs(m);m.quit();m=None

    result['stage']='console'
    if result['browserWarnings']:raise RuntimeError(f'Browser console errors: {result["browserWarnings"][:5]}')
    result['ok']=True;result['stage']='complete'
except Exception as exc:
    result['error']=f'{type(exc).__name__}: {exc}'
    active=d or m
    try:
        if active is not None:
            result['hash']=active.execute_script('return location.hash')
            result['pageText']=active.execute_script("return (document.querySelector('#app')?.innerText||'').slice(0,2800)")
    except Exception:pass
finally:
    for driver in [d,m]:
        if driver is not None:
            try:driver.quit()
            except Exception:pass
    result['durationSeconds']=round(time.time()-start,2);OUT.write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
if not result['ok']:raise SystemExit(1)
