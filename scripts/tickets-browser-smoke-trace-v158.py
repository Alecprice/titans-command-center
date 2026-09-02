import inspect
import json
import linecache
import os
import runpy
import time
from pathlib import Path

from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait

TARGET=Path(__file__).with_name('tickets-browser-smoke.py').resolve()
REPORT=Path('/tmp/tickets-browser-smoke-trace-v158.json')
SHORTLIST_KEY='titans:tickets-shortlist-v123'
MEMORY_KEY='titans:tickets-price-memory-v124'
ORIGINAL_UNTIL=WebDriverWait.until
wait_index=0
history=[]


def callsite():
    for frame in inspect.stack()[2:]:
        try:
            path=Path(frame.filename).resolve()
        except Exception:
            continue
        if path==TARGET:
            return {
                'file':TARGET.name,
                'line':frame.lineno,
                'function':frame.function,
                'source':linecache.getline(str(TARGET),frame.lineno).strip()
            }
    return {'file':TARGET.name,'line':None,'function':'unknown','source':''}


def browser_snapshot(driver):
    try:
        return driver.execute_script(r"""
          const center=document.querySelector('[data-ticket-center]');
          const parse=value=>{try{return JSON.parse(value)}catch{return null}};
          let rawShortlist=null;
          let rawMemory=null;
          let runtimeSaved=null;
          try{rawShortlist=localStorage.getItem(arguments[0])}catch{}
          try{rawMemory=localStorage.getItem(arguments[1])}catch{}
          try{runtimeSaved=window.TitansRuntime?.storage?.getJSON?.(arguments[0],null)??null}catch{}
          const active=document.activeElement;
          const activeCard=active?.closest?.('.tickets-compare-card[data-ticket-tenx-key]');
          const comparePanel=center?.querySelector('[data-ticket-compare-v125]');
          const finalists=center?.querySelector('[data-ticket-finalists-v127]');
          const signal=center?.querySelector('[data-ticket-signal-lens-v128]');
          return {
            hash:location.hash,
            readyState:document.readyState,
            center:Boolean(center),
            shortlistRaw:rawShortlist,
            shortlistParsed:parse(rawShortlist||'[]'),
            memoryRaw:rawMemory,
            runtimeSaved,
            command:{
              present:Boolean(center?.querySelector('[data-ticket-tenx-command]')),
              savedCount:center?.querySelector('[data-ticket-tenx-command]')?.getAttribute('data-ticket-tenx-saved-count')||center?.dataset?.ticketTenxSavedCount||null
            },
            compare:{
              present:Boolean(comparePanel),
              owner:comparePanel?.getAttribute('data-ticket-compare-owner')||null,
              count:comparePanel?.querySelectorAll('.tickets-compare-v125-card').length||0,
              keys:comparePanel?[...comparePanel.querySelectorAll('.tickets-compare-v125-card')].map(card=>card.dataset.ticketCompareKey||''):[],
              party:[...center?.querySelectorAll('[data-ticket-tenx-party]')||[]].map(button=>({value:button.dataset.ticketTenxParty||'',pressed:button.getAttribute('aria-pressed')})),
              share:Boolean(comparePanel?.querySelector('[data-ticket-compare-share]'))
            },
            finalists:{
              present:Boolean(finalists),
              views:[...finalists?.querySelectorAll('[data-ticket-finalists-view]')||[]].map(button=>({value:button.dataset.ticketFinalistsView||'',pressed:button.getAttribute('aria-pressed'),disabled:Boolean(button.disabled)})),
              budgets:[...finalists?.querySelectorAll('[data-ticket-finalists-budget]')||[]].map(button=>({value:button.dataset.ticketFinalistsBudget||'',pressed:button.getAttribute('aria-pressed'),disabled:Boolean(button.disabled)})),
              summary:(finalists?.querySelector('[data-ticket-finalists-summary]')?.textContent||'').trim()
            },
            signal:{
              present:Boolean(signal),
              focusKeys:[...signal?.querySelectorAll('[data-ticket-signal-focus]')||[]].map(button=>button.dataset.ticketSignalFocus||'').filter(Boolean)
            },
            filters:{
              location:[...center?.querySelectorAll('[data-ticket-filter]')||[]].map(button=>({value:button.dataset.ticketFilter||'',pressed:button.getAttribute('aria-pressed')})),
              budget:[...center?.querySelectorAll('[data-ticket-tenx-budget]')||[]].map(button=>({value:button.dataset.ticketTenxBudget||'',pressed:button.getAttribute('aria-pressed')}))
            },
            cards:[...center?.querySelectorAll('.tickets-compare-card[data-ticket-tenx-key]')||[]].slice(0,4).map(card=>({
              key:card.dataset.ticketTenxKey||'',
              hidden:Boolean(card.hidden),
              saved:card.querySelector('[data-ticket-tenx-save]')?.getAttribute('aria-pressed')||'',
              saveText:card.querySelector('[data-ticket-tenx-save]')?.textContent?.trim()||''
            })),
            active:{
              tag:active?.tagName||null,
              text:(active?.textContent||'').replace(/\s+/g,' ').trim().slice(0,160),
              ticketKey:activeCard?.dataset.ticketTenxKey||null
            },
            globals:{
              compareV125:Boolean(window.__TitansTicketCompareV125),
              compareConvergenceV156:window.__TitansTicketCompareConvergenceV156||null,
              settle149:window.__TitansTicketDecisionSettleV149||null,
              rehydrate155:window.__TitansTicketDecisionRehydrateV155||null,
              compareAuthorityV156:center?.dataset?.ticketTenxCompareAuthorityV156||null,
              compareSavedV156:center?.dataset?.ticketTenxCompareSavedV156||null
            }
          };
        """,SHORTLIST_KEY,MEMORY_KEY)
    except Exception as exc:
        return {'snapshotError':f'{type(exc).__name__}: {exc}'}


def severe_logs(driver):
    try:
        return [entry for entry in driver.get_log('browser') if entry.get('level')=='SEVERE' and 'favicon' not in str(entry.get('message','')).lower()]
    except Exception as exc:
        return [{'logError':f'{type(exc).__name__}: {exc}'}]


def traced_until(self,method,message=''):
    global wait_index
    wait_index+=1
    index=wait_index
    site=callsite()
    timeout=float(getattr(self,'_timeout',0) or 0)
    started=time.time()
    try:
        value=ORIGINAL_UNTIL(self,method,message)
        history.append({'index':index,'status':'passed','timeout':timeout,'elapsed':round(time.time()-started,3),'callsite':site})
        return value
    except TimeoutException:
        failure={
            'index':index,
            'status':'timeout',
            'timeout':timeout,
            'elapsed':round(time.time()-started,3),
            'callsite':site,
            'browser':browser_snapshot(self._driver),
            'severeLogs':severe_logs(self._driver),
            'history':history[-12:]
        }
        REPORT.write_text(json.dumps(failure,indent=2),encoding='utf-8')
        print('TICKET_SMOKE_WAIT_TIMEOUT_V158')
        print(json.dumps(failure,indent=2))
        raise


WebDriverWait.until=traced_until
exit_code=0
try:
    runpy.run_path(str(TARGET),run_name='__main__')
except SystemExit as exc:
    value=exc.code
    exit_code=value if isinstance(value,int) else (0 if value is None else 1)
finally:
    WebDriverWait.until=ORIGINAL_UNTIL

if exit_code:
    raise SystemExit(exit_code)
