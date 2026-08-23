import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT=Path('/tmp/fantasy-browser-smoke.json')


def driver_for(width=1280,height=900):
    options=webdriver.ChromeOptions()
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument(f'--window-size={width},{height}')
    options.set_capability('goog:loggingPrefs',{'browser':'ALL'})
    return webdriver.Chrome(options=options)


def prepare(driver):
    driver.get(f'{BASE}/')
    driver.execute_script("localStorage.setItem('titans:v10Onboarded','1');localStorage.removeItem('titans-fantasy-v1')")
    driver.get(f'{BASE}/#fantasy')


def wait_ready(driver,timeout=18):
    WebDriverWait(driver,timeout,poll_frequency=.1).until(
        lambda d:d.execute_script("return document.querySelector('#app')?.dataset?.fantasyCommand==='ready' && !!document.querySelector('.fantasy-head')")
    )


def summary(driver):
    return driver.execute_script(r"""
      const app=document.querySelector('#app'),head=document.querySelector('.fantasy-head');
      const rect=head?.getBoundingClientRect();
      return {
        ready:app?.dataset?.fantasyCommand||'',
        title:head?.querySelector('h1')?.textContent?.trim()||'',
        tabs:[...document.querySelectorAll('[data-ftab]')].map(x=>({label:x.textContent.trim(),active:x.classList.contains('active'),height:x.getBoundingClientRect().height})),
        scoring:[...document.querySelectorAll('[data-scoring]')].map(x=>({label:x.textContent.trim(),active:x.classList.contains('active'),height:x.getBoundingClientRect().height})),
        playerCards:document.querySelectorAll('.fantasy-player').length,
        overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2,
        width:innerWidth,
        headWidth:rect?.width||0,
        severeText:(document.body.textContent||'').replace(/\s+/g,' ').slice(0,240)
      };
    """)


def click(driver,selector):
    el=WebDriverWait(driver,10,poll_frequency=.1).until(lambda d:d.find_element(By.CSS_SELECTOR,selector))
    driver.execute_script("arguments[0].click()",el)
    return el


def calc_check(driver):
    click(driver,"[data-scoring='ppr']")
    form=driver.find_element(By.CSS_SELECTOR,'#fantasy-calc')
    for name,value in {'passYds':'250','passTd':'2','int':'1','rushYds':'20','rushTd':'1','rec':'3','recYds':'40','recTd':'1'}.items():
        field=form.find_element(By.NAME,name);field.clear();field.send_keys(value)
    driver.execute_script("arguments[0].dispatchEvent(new Event('input',{bubbles:true}))",form)
    points=driver.find_element(By.CSS_SELECTOR,'#fantasy-points').text.strip()
    # 250/25 + 2*4 -2 + 20/10 +6 +3 +40/10 +6 = 37
    if points!='37.0 pts':raise RuntimeError(f'Fantasy PPR calculator returned {points!r}, expected 37.0 pts')
    return points


def local_lineup_check(driver):
    click(driver,"[data-ftab='my']")
    WebDriverWait(driver,10).until(lambda d:d.find_element(By.CSS_SELECTOR,'#fantasy-add'))
    form=driver.find_element(By.CSS_SELECTOR,'#fantasy-add')
    values={'name':'Smoke Test Player','position':'WR','team':'TEN'}
    for name,value in values.items():
        field=form.find_element(By.NAME,name);field.clear();field.send_keys(value)
    driver.execute_script("arguments[0].dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))",form)
    WebDriverWait(driver,10).until(lambda d:'Smoke Test Player' in d.find_element(By.CSS_SELECTOR,'.fantasy-lineup').text)
    saved=driver.execute_script("return JSON.parse(localStorage.getItem('titans-fantasy-v1')||'{}').manual||[]")
    if len(saved)!=1 or saved[0].get('name')!='Smoke Test Player':raise RuntimeError(f'My Fantasy did not persist bounded local player state: {saved}')
    click(driver,'[data-remove-player]')
    WebDriverWait(driver,10).until(lambda d:'Smoke Test Player' not in d.find_element(By.CSS_SELECTOR,'.fantasy-lineup').text)
    remaining=driver.execute_script("return JSON.parse(localStorage.getItem('titans-fantasy-v1')||'{}').manual||[]")
    if remaining:raise RuntimeError(f'My Fantasy remove did not clear local state: {remaining}')
    return {'savedCount':len(saved),'remainingCount':len(remaining)}


def empty_provider_check(driver):
    click(driver,"[data-ftab='sleeper']")
    WebDriverWait(driver,10).until(lambda d:d.find_element(By.CSS_SELECTOR,'#sleeper-connect'))
    sleeper_text=driver.find_element(By.CSS_SELECTOR,'.fantasy-content').text
    if 'SLEEPER CONNECT' not in sleeper_text or 'read-only' not in sleeper_text.lower():raise RuntimeError('Sleeper empty state is missing read-only connection context')
    click(driver,"[data-ftab='draft']")
    WebDriverWait(driver,10).until(lambda d:'Connect a Sleeper league first' in d.find_element(By.CSS_SELECTOR,'.fantasy-content').text)
    return {'sleeperEmpty':True,'draftEmpty':True}


def touch_floor(driver):
    heights=driver.execute_script("return [...document.querySelectorAll('[data-ftab],[data-scoring],.fantasy-action')].map(x=>x.getBoundingClientRect().height)")
    if not heights or min(heights)<43.5:raise RuntimeError(f'Fantasy touch target below 44px: {heights}')
    return round(min(heights),2)


def severe_logs(driver):
    return [row for row in driver.get_log('browser') if row.get('level')=='SEVERE' and 'favicon' not in row.get('message','').lower()]


started=time.time();driver=None;stage='starting'
try:
    stage='desktop-launch';driver=driver_for();prepare(driver);wait_ready(driver)
    stage='desktop-summary';desktop=summary(driver)
    if desktop['title']!='Fantasy football, with Titans context.':raise RuntimeError(f'Fantasy heading missing: {desktop}')
    if desktop['playerCards']<1:raise RuntimeError(f'Fantasy Titans player board did not hydrate: {desktop}')
    if desktop['overflow']:raise RuntimeError(f'Fantasy desktop horizontal overflow: {desktop}')
    stage='desktop-calculator';points=calc_check(driver)
    stage='desktop-local-lineup';lineup=local_lineup_check(driver)
    stage='desktop-provider-empty';provider=empty_provider_check(driver)

    stage='mobile-launch';driver.set_window_size(390,844);driver.get(f'{BASE}/#fantasy');wait_ready(driver)
    stage='mobile-summary';mobile=summary(driver)
    if mobile['overflow']:raise RuntimeError(f'Fantasy mobile horizontal overflow: {mobile}')
    stage='mobile-touch';minimum_touch=touch_floor(driver)

    stage='console';warnings=severe_logs(driver)
    if warnings:raise RuntimeError(f'Fantasy browser regression has severe console errors: {warnings[:3]}')

    result={'ok':True,'base':BASE,'desktop':desktop,'calculator':points,'localLineup':lineup,'providerEmptyStates':provider,'mobile':mobile,'minimumTouchHeight':minimum_touch,'browserWarnings':warnings,'durationSeconds':round(time.time()-started,2),'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8');print(json.dumps(result,indent=2))
except Exception as exc:
    state=None
    if driver:
        try:state={'hash':driver.execute_script('return location.hash'),'summary':summary(driver)}
        except Exception:pass
    result={'ok':False,'base':BASE,'stage':stage,'error':f'{type(exc).__name__}: {exc}','state':state,'durationSeconds':round(time.time()-started,2),'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8');print(json.dumps(result,indent=2));raise
finally:
    if driver:driver.quit()
