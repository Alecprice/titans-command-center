import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT=Path('/tmp/market-browser-smoke.json')


def driver_for(width=1280,height=900):
    options=webdriver.ChromeOptions()
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument(f'--window-size={width},{height}')
    options.set_capability('goog:loggingPrefs',{'browser':'ALL'})
    return webdriver.Chrome(options=options)


def prepare_returning_user(driver):
    driver.get(f'{BASE}/')
    driver.execute_script("""
      localStorage.setItem('titans:v10Onboarded','1');
      document.querySelector('#v10-onboarding [data-v10-close]')?.click();
    """)
    WebDriverWait(driver,5,poll_frequency=.1).until(lambda d:not d.find_elements(By.CSS_SELECTOR,'#v10-onboarding'))
    driver.get(f'{BASE}/#markets')


def wait_settled(driver,timeout=18):
    def ready(d):
        return d.execute_script("""
          const app=document.querySelector('#app'),hub=document.querySelector('.market-hub');
          if(!hub||app?.dataset.marketHub==='loading'||app?.getAttribute('aria-busy')==='true')return null;
          const status=[...hub.querySelectorAll('.mh-status span')];
          if(status.length<5||!hub.querySelector('#mh-refresh')||!hub.querySelector('.mh-head h2'))return null;
          return true;
        """)
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(ready)


def read_summary(driver):
    return driver.execute_script(r"""
      const hub=document.querySelector('.market-hub');if(!hub)return null;
      const status=[...hub.querySelectorAll('.mh-status span')].map(x=>({text:(x.textContent||'').replace(/\s+/g,' ').trim(),value:x.querySelector('b')?.textContent?.trim()||'',className:x.className||''}));
      const marketStatus=status.find(x=>x.text.toLowerCase().includes('market rows'));
      const freshness=status.find(x=>x.text.toLowerCase().includes('freshness'));
      const result=(hub.querySelector('.mh-results')?.textContent||'').replace(/\s+/g,' ').trim();
      const resultNumbers=[...hub.querySelectorAll('.mh-results b')].map(x=>Number(x.textContent));
      const rowNodes=[...hub.querySelectorAll('.mh-row')];
      const rowCount=rowNodes.length;
      const rowSample=rowNodes.slice(0,3).map(x=>(x.textContent||'').replace(/\s+/g,' ').trim());
      const controls=[...hub.querySelectorAll('.mh-controls select,.mh-controls button')].filter(x=>x.offsetParent!==null).map(x=>({id:x.id,tag:x.tagName,disabled:Boolean(x.disabled),height:x.getBoundingClientRect().height,width:x.getBoundingClientRect().width,value:x.value||'',pressed:x.getAttribute('aria-pressed')}));
      return {
        title:hub.querySelector('.mh-head h2')?.textContent?.trim()||'',
        provider:status[0]?.value||'',quality:freshness?.value||'',total:Number(marketStatus?.value),
        shown:Number.isFinite(resultNumbers[0])?resultNumbers[0]:null,resultTotal:Number.isFinite(resultNumbers[1])?resultNumbers[1]:null,
        result,rowCount,rowSample,controls,
        referenceNotice:(hub.querySelector('.mh-reference-notice')?.textContent||'').replace(/\s+/g,' ').trim(),
        empty:(hub.querySelector('.mh-empty')?.textContent||'').replace(/\s+/g,' ').trim(),
        refreshHeight:hub.querySelector('#mh-refresh')?.getBoundingClientRect().height||0,
        errorVisible:Boolean(hub.querySelector('.mh-error')),
        overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+3,
        viewport:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth
      };
    """)


def assert_truthful_state(summary,label):
    if not summary:raise RuntimeError(f'{label}: Market Pulse did not render')
    if summary['overflow']:raise RuntimeError(f'{label}: horizontal overflow: {summary}')
    if summary['refreshHeight']<44:raise RuntimeError(f'{label}: refresh target below 44px: {summary}')
    if summary['errorVisible']:raise RuntimeError(f'{label}: market error panel is visible: {summary}')
    total=summary['total'];quality=summary['quality'];row_count=summary['rowCount']
    if total is None or total<0:raise RuntimeError(f'{label}: market row total missing: {summary}')
    if summary['shown'] is not None and summary['resultTotal'] is not None:
        if summary['shown']>summary['resultTotal'] or summary['resultTotal']!=total:
            raise RuntimeError(f'{label}: rendered result counts disagree with status total: {summary}')
    if quality=='Live':
        if total<1 or row_count<1:raise RuntimeError(f'{label}: live market mode has no rendered rows: {summary}')
        if summary['referenceNotice']:raise RuntimeError(f'{label}: live mode shows a published-reference warning: {summary}')
    elif quality=='Published reference':
        if total<1 or row_count<1 or 'not live odds' not in summary['referenceNotice'].lower():
            raise RuntimeError(f'{label}: published reference is not clearly labeled: {summary}')
    elif quality=='Unavailable':
        if total!=0 or row_count!=0 or summary['title']!='Titans market status' or not summary['empty'] or summary['referenceNotice']:
            raise RuntimeError(f'{label}: unavailable market state is ambiguous: {summary}')
    else:raise RuntimeError(f'{label}: unknown market freshness label {quality!r}: {summary}')
    return {'quality':quality,'provider':summary['provider'],'shown':summary['shown'],'total':total,'renderedRows':row_count}


def exercise_select(driver,selector):
    element=driver.find_element(By.CSS_SELECTOR,selector);select=Select(element);option_count=len(select.options)
    if option_count<2:return {'available':False,'options':option_count}
    chosen=select.options[1].get_attribute('value');before=read_summary(driver)
    select.select_by_index(1)
    WebDriverWait(driver,6,poll_frequency=.1).until(lambda d:d.execute_script("return document.querySelector(arguments[0])?.value===arguments[1]",selector,chosen))
    wait_settled(driver);after=read_summary(driver)
    if after['shown'] is not None and after['shown']<0:raise RuntimeError(f'{selector}: invalid filtered count: {after}')
    if after['rowCount']<1 and not after['empty']:raise RuntimeError(f'{selector}: filter rendered neither rows nor a clear empty state: {after}')
    reset=Select(driver.find_element(By.CSS_SELECTOR,selector));reset.select_by_value('all')
    WebDriverWait(driver,6,poll_frequency=.1).until(lambda d:d.execute_script("return document.querySelector(arguments[0])?.value==='all'",selector));wait_settled(driver)
    return {'available':True,'options':option_count,'selectedValue':chosen,'before':before['result'],'after':after['result']}


def severe_logs(driver):
    return [row.get('message','') for row in driver.get_log('browser') if row.get('level')=='SEVERE' and 'favicon' not in row.get('message','').lower()]


result={'ok':False,'base':BASE,'desktop':{},'mobile':{},'browserWarnings':[]}
started=time.time();driver=None;stage='starting'
try:
    stage='desktop:launch';driver=driver_for();driver.set_script_timeout(10)
    stage='desktop:load';prepare_returning_user(driver);wait_settled(driver)
    stage='desktop:truth';summary=read_summary(driver);state=assert_truthful_state(summary,'desktop')
    result['desktop']['initial']={'state':state,'summary':summary}

    if state['total']>0:
        stage='desktop:filters';filters={}
        for key,selector in [('event','#mh-event-filter'),('book','#mh-book-filter'),('category','#mh-category-filter')]:
            if driver.find_elements(By.CSS_SELECTOR,selector):filters[key]=exercise_select(driver,selector)
        result['desktop']['filters']=filters

        stage='desktop:alternates';toggle=driver.find_elements(By.ID,'mh-alt-toggle')
        if toggle and toggle[0].is_enabled():
            before=read_summary(driver);before_rows=before['rowCount'];toggle[0].click()
            WebDriverWait(driver,6,poll_frequency=.1).until(lambda d:d.find_element(By.ID,'mh-alt-toggle').get_attribute('aria-pressed')=='true');wait_settled(driver)
            after=read_summary(driver);after_rows=after['rowCount']
            if after_rows<before_rows:raise RuntimeError(f'Alternate-line toggle reduced visible rows: before={before_rows} after={after_rows}')
            result['desktop']['alternateLines']={'available':True,'beforeRows':before_rows,'afterRows':after_rows}
        else:result['desktop']['alternateLines']={'available':False}

    stage='desktop:refresh';old_hub=driver.find_element(By.CSS_SELECTOR,'.market-hub');driver.find_element(By.ID,'mh-refresh').click()
    try:WebDriverWait(driver,18,poll_frequency=.1).until(EC.staleness_of(old_hub))
    except Exception:
        if driver.find_elements(By.CSS_SELECTOR,'.mh-error'):raise RuntimeError(f'Market refresh failed: {read_summary(driver)}')
    wait_settled(driver);refreshed=read_summary(driver);refresh_state=assert_truthful_state(refreshed,'desktop refresh')
    result['desktop']['refresh']={'state':refresh_state,'summary':refreshed}

    stage='mobile:reload';driver.set_window_size(390,844);driver.get(f'{BASE}/#markets');wait_settled(driver)
    stage='mobile:layout';mobile=read_summary(driver);mobile_state=assert_truthful_state(mobile,'mobile')
    too_small=[control for control in mobile['controls'] if control['height']<44]
    if too_small:raise RuntimeError(f'Mobile market controls below 44px: {too_small}')
    row_geometry=driver.execute_script("return [...document.querySelectorAll('.mh-row')].slice(0,4).map(x=>{const r=x.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,height:r.height}})")
    if any(row['left']<-1 or row['right']>391 for row in row_geometry):raise RuntimeError(f'Mobile market row escapes viewport: {row_geometry}')
    result['mobile']={'state':mobile_state,'summary':mobile,'rowGeometry':row_geometry}

    stage='console';result['browserWarnings']=severe_logs(driver)
    if result['browserWarnings']:raise RuntimeError(f'Market browser console errors: {result["browserWarnings"][:5]}')
    result['ok']=True;stage='complete'
except Exception as exc:
    result['stage']=stage;result['error']=f'{type(exc).__name__}: {exc}'
    if driver is not None:
        try:result['state']=read_summary(driver)
        except Exception:pass
finally:
    if driver is not None:
        try:driver.quit()
        except Exception:pass
    result['durationSeconds']=round(time.time()-started,2);result['testedAt']=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8');print(json.dumps(result,indent=2))

if not result['ok']:raise SystemExit(1)
