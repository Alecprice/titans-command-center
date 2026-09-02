import json
import os
import time
from pathlib import Path
from urllib.request import Request, urlopen

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans.alecjprice.com').rstrip('/')
EXPECTED_SHA=os.environ.get('EXPECTED_SHA','').strip()
REPORT=Path('/tmp/ticket-compare-diagnostic-v157.json')
SHORTLIST_KEY='titans:tickets-shortlist-v123'
MEMORY_KEY='titans:tickets-price-memory-v124'


def read_json(path):
    request=Request(f'{BASE}{path}',headers={'Accept':'application/json','Cache-Control':'no-cache','User-Agent':'TitansCommandCenter-TicketCompareDiagnostic/1.0'})
    with urlopen(request,timeout=12) as response:
        return json.loads(response.read().decode('utf-8'))


def driver_for():
    options=webdriver.ChromeOptions()
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1280,900')
    options.set_capability('goog:loggingPrefs',{'browser':'ALL'})
    driver=webdriver.Chrome(options=options)
    driver.set_page_load_timeout(25)
    driver.set_script_timeout(10)
    return driver


def severe_logs(driver):
    rows=[]
    for entry in driver.get_log('browser'):
        message=entry.get('message','')
        if entry.get('level')=='SEVERE' and 'favicon' not in message.lower():
            rows.append({'message':message,'source':entry.get('source',''),'timestamp':entry.get('timestamp')})
    return rows


def diagnostic_snapshot(driver):
    return driver.execute_script(r"""
      const center=document.querySelector('[data-ticket-center]');
      const safeParse=value=>{try{return JSON.parse(value)}catch{return null}};
      const rawShortlist=(()=>{try{return localStorage.getItem(arguments[0])}catch{return null}})();
      const rawMemory=(()=>{try{return localStorage.getItem(arguments[1])}catch{return null}})();
      const parsed=safeParse(rawShortlist||'[]');
      const runtime=window.TitansRuntime;
      let runtimeSaved=null;
      try{runtimeSaved=runtime?.storage?.getJSON?.(arguments[0],null)??null}catch{}
      const globals={
        tenx:Boolean(window.__TitansTicketTenxV123),
        compare:Boolean(window.__TitansTicketCompareV125),
        settle149:window.__TitansTicketDecisionSettleV149||null,
        rehydrate155:window.__TitansTicketDecisionRehydrateV155||null,
        cacheBridge141:Boolean(window.__TitansTicketCompareCacheBridgeV141)
      };
      const currentCards=center?[...center.querySelectorAll('.tickets-compare-card[data-ticket-tenx-key]')].map(card=>({
        key:card.dataset.ticketTenxKey||'',
        hidden:Boolean(card.hidden),
        saved:card.querySelector('[data-ticket-tenx-save]')?.getAttribute('aria-pressed')||'',
        button:card.querySelector('[data-ticket-tenx-save]')?.textContent?.trim()||''
      })):[];
      const compareCards=center?[...center.querySelectorAll('[data-ticket-compare-v125] .tickets-compare-v125-card')].map(card=>card.dataset.ticketCompareKey||''):[];
      const resources=performance.getEntriesByType('resource')
        .map(entry=>String(entry.name||''))
        .filter(name=>/tickets-(?:price-fallback|tenx|trend|compare|finalists|signal|decision|actual)/.test(name))
        .map(name=>{try{return new URL(name).pathname}catch{return name}});
      return {
        hash:location.hash,
        readyState:document.readyState,
        app:Boolean(document.querySelector('#app')),
        center:Boolean(center),
        command:Boolean(center?.querySelector('[data-ticket-tenx-command]')),
        tray:Boolean(center?.querySelector('[data-ticket-tenx-shortlist]')),
        trayText:(center?.querySelector('[data-ticket-tenx-shortlist]')?.textContent||'').replace(/\s+/g,' ').trim(),
        shortlistRaw:rawShortlist,
        shortlistParsed:Array.isArray(parsed)?parsed.map(item=>({key:item?.key||'',title:item?.title||''})):parsed,
        shortlistCount:Array.isArray(parsed)?parsed.length:null,
        memoryPresent:Boolean(rawMemory),
        runtime:{present:Boolean(runtime),storageGetJSON:typeof runtime?.storage?.getJSON==='function',saved:runtimeSaved},
        globals,
        centerDataset:center?{
          tenxSaved:center.dataset.ticketTenxSaved||'',
          compareAuthorityV156:center.dataset.ticketCompareAuthorityV156||'',
          compareSavedV156:center.dataset.ticketCompareSavedV156||'',
          compareFocusComplete:center.dataset.ticketCompareFocusComplete||''
        }:null,
        panel:Boolean(center?.querySelector('[data-ticket-compare-v125]')),
        compareCardCount:compareCards.length,
        compareKeys:compareCards,
        finalists:Boolean(center?.querySelector('[data-ticket-finalists-v127]')),
        signal:Boolean(center?.querySelector('[data-ticket-signal-lens-v128]')),
        currentCards,
        resources:[...new Set(resources)],
        activeElement:{
          tag:document.activeElement?.tagName||'',
          text:(document.activeElement?.textContent||'').replace(/\s+/g,' ').trim().slice(0,120),
          ticketKey:document.activeElement?.closest?.('[data-ticket-tenx-key]')?.dataset?.ticketTenxKey||''
        }
      };
    """,SHORTLIST_KEY,MEMORY_KEY)


def prepare(driver):
    try:driver.get(f'{BASE}/')
    except TimeoutException:
        try:driver.execute_script('window.stop()')
        except Exception:pass
    driver.execute_script("""
      localStorage.setItem('titans:v10Onboarded','1');
      localStorage.removeItem(arguments[0]);
      localStorage.removeItem(arguments[1]);
      document.querySelector('#v10-onboarding [data-v10-close]')?.click();
      location.hash='tickets';
    """,SHORTLIST_KEY,MEMORY_KEY)
    WebDriverWait(driver,20,poll_frequency=.1).until(lambda d:d.execute_script("""
      const center=document.querySelector('[data-ticket-center]');
      return Boolean(center?.querySelector('[data-ticket-tenx-command]')&&center.querySelectorAll('.tickets-compare-card[data-ticket-tenx-key]').length>=2);
    """))


def save_first_two(driver):
    keys=driver.execute_script("""
      return [...document.querySelectorAll('[data-ticket-center] .tickets-compare-card[data-ticket-tenx-key]')]
        .slice(0,2).map(card=>card.dataset.ticketTenxKey).filter(Boolean);
    """)
    if len(keys)!=2 or len(set(keys))!=2:raise RuntimeError(f'need two distinct live Ticket keys, got {keys}')
    for expected,key in enumerate(keys,start=1):
        clicked=driver.execute_script("""
          const center=document.querySelector('[data-ticket-center]');
          const card=[...center.querySelectorAll('.tickets-compare-card[data-ticket-tenx-key]')].find(node=>node.dataset.ticketTenxKey===arguments[0]);
          const button=card?.querySelector('[data-ticket-tenx-save]');
          if(!button)return false;
          button.click();
          return true;
        """,key)
        if not clicked:raise RuntimeError(f'save control missing for {key}')
        WebDriverWait(driver,8,poll_frequency=.1).until(lambda d:d.execute_script("""
          try{const value=JSON.parse(localStorage.getItem(arguments[0])||'[]');return Array.isArray(value)&&value.length===arguments[1]}catch{return false}
        """,SHORTLIST_KEY,expected))
    return keys


result={'ok':False,'base':BASE,'expectedSha':EXPECTED_SHA}
started=time.time();driver=None
try:
    meta=read_json('/build-meta.json')
    result['buildMeta']=meta
    deployed=str(meta.get('commit') or '')
    if EXPECTED_SHA and deployed!=EXPECTED_SHA:
        result['skipped']=f'production moved: expected {EXPECTED_SHA}, found {deployed or "unknown"}'
    else:
        driver=driver_for();prepare(driver);result['savedKeys']=save_first_two(driver)
        try:
            WebDriverWait(driver,8,poll_frequency=.1).until(lambda d:d.execute_script("return document.querySelectorAll('[data-ticket-compare-v125] .tickets-compare-v125-card').length>=2"))
        except TimeoutException:
            pass
        result['diagnostic']=diagnostic_snapshot(driver)
        result['browserErrors']=severe_logs(driver)
        result['ok']=result['diagnostic']['compareCardCount']>=2 and not result['browserErrors']
        if not result['ok']:
            result['error']='Saved Compare did not converge after two persisted saves'
except Exception as exc:
    result['error']=f'{type(exc).__name__}: {exc}'
    if driver is not None:
        try:result['diagnostic']=diagnostic_snapshot(driver)
        except Exception as diag_exc:result['diagnosticError']=f'{type(diag_exc).__name__}: {diag_exc}'
        try:result['browserErrors']=severe_logs(driver)
        except Exception:pass
finally:
    if driver is not None:
        try:driver.quit()
        except Exception:pass
    result['durationSeconds']=round(time.time()-started,2)
    result['testedAt']=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result,indent=2))

if result.get('skipped'):
    raise SystemExit(0)
if not result['ok']:
    raise SystemExit(1)
