import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans.alecjprice.com').rstrip('/')
REPORT=Path('/tmp/ticket-budget-browser-smoke.json')
SHORTLIST_KEY='titans:tickets-shortlist-v123'
BUDGET_KEY='titans:tickets-outing-budget-v134'
FIXTURES=[
    {'key':'tenx-budget-a','title':'Titans budget audit A','date':'Production browser fixture A'},
    {'key':'tenx-budget-b','title':'Titans budget audit B','date':'Production browser fixture B'},
]


def driver_for(width=1280,height=1000):
    options=webdriver.ChromeOptions()
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument(f'--window-size={width},{height}')
    options.set_capability('goog:loggingPrefs',{'browser':'ALL'})
    driver=webdriver.Chrome(options=options)
    driver.set_page_load_timeout(25)
    driver.set_script_timeout(10)
    return driver


def set_css_viewport(driver,width,height):
    driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{
        'width':width,
        'height':height,
        'deviceScaleFactor':1,
        'mobile':False,
    })
    metrics=driver.execute_script("""
      return {
        innerWidth:window.innerWidth,
        innerHeight:window.innerHeight,
        clientWidth:document.documentElement.clientWidth,
        phoneMedia:matchMedia('(max-width:620px)').matches
      };
    """)
    should_match=width<=620
    if metrics['innerWidth']!=width or metrics['innerHeight']!=height or metrics['phoneMedia']!=should_match:
        raise RuntimeError(f'CSS viewport override failed: requested {width}x{height}, got {metrics}')
    return metrics


def load(driver,url):
    try:
        driver.get(url)
    except TimeoutException:
        try:driver.execute_script('window.stop()')
        except Exception:pass


def prepare(driver):
    load(driver,f'{BASE}/')
    driver.execute_script("""
      localStorage.setItem('titans:v10Onboarded','1');
      localStorage.removeItem(arguments[0]);
      localStorage.removeItem(arguments[1]);
      document.querySelector('#v10-onboarding [data-v10-close]')?.click();
    """,SHORTLIST_KEY,BUDGET_KEY)
    load(driver,f'{BASE}/#tickets')
    WebDriverWait(driver,22,poll_frequency=.1).until(lambda d:d.execute_script("""
      return Boolean(
        document.querySelector('[data-ticket-center]')
        && window.__TitansTicketOutingBudgetV134
        && window.__TitansTicketActualCostCompareV135
      );
    """))


def seed_shortlist(driver):
    driver.execute_script("""
      localStorage.setItem(arguments[0],JSON.stringify(arguments[1]));
      const app=document.querySelector('#app');
      app?.dispatchEvent(new CustomEvent('titans:ticket-shortlist-change',{bubbles:true,detail:{source:'production-budget-gate'}}));
    """,SHORTLIST_KEY,FIXTURES)
    WebDriverWait(driver,8,poll_frequency=.1).until(lambda d:d.execute_script("""
      return Boolean(
        document.querySelector('[data-ticket-outing-v134]')
        && document.querySelector('[data-ticket-cost-compare-v135]')
        && document.querySelectorAll('[data-ticket-cost-key]').length===2
      );
    """))


def select_game(driver,key):
    changed=driver.execute_script("""
      const picker=document.querySelector('[data-ticket-outing-game]');
      if(!picker)return false;
      picker.value=arguments[0];
      picker.dispatchEvent(new Event('change',{bubbles:true}));
      return true;
    """,key)
    if not changed:raise RuntimeError(f'budget picker missing while selecting {key}')
    WebDriverWait(driver,5,poll_frequency=.05).until(lambda d:d.execute_script("""
      return document.querySelector('[data-ticket-outing-game]')?.value===arguments[0];
    """,key))


def set_amount(driver,key,field,value):
    select_game(driver,key)
    changed=driver.execute_script("""
      const input=document.querySelector(`[data-ticket-outing-field="${arguments[0]}"]`);
      if(!input)return false;
      input.value=String(arguments[1]);
      input.dispatchEvent(new Event('change',{bubbles:true}));
      return true;
    """,field,value)
    if not changed:raise RuntimeError(f'{key}: missing {field} input')
    WebDriverWait(driver,5,poll_frequency=.05).until(lambda d:d.execute_script("""
      try{
        const store=JSON.parse(localStorage.getItem(arguments[0])||'{}');
        return Number(store?.plans?.[arguments[1]]?.[arguments[2]])===Number(arguments[3]);
      }catch{return false;}
    """,BUDGET_KEY,key,field,value))


def snapshot(driver):
    return driver.execute_script(r"""
      const center=document.querySelector('[data-ticket-center]');
      const budget=center?.querySelector('[data-ticket-outing-v134]');
      const cost=center?.querySelector('[data-ticket-cost-compare-v135]');
      const viewport=document.documentElement.clientWidth;
      const rect=node=>node?node.getBoundingClientRect():null;
      const costCards=cost?[...cost.querySelectorAll('[data-ticket-cost-key]')]:[];
      return {
        viewport,
        innerWidth:window.innerWidth,
        phoneMedia:matchMedia('(max-width:620px)').matches,
        overflow:document.documentElement.scrollWidth>viewport+3,
        shortlistCount:(()=>{try{return JSON.parse(localStorage.getItem(arguments[0])||'[]').length}catch{return -1}})(),
        budget:Boolean(budget),
        budgetText:(budget?.textContent||'').replace(/\s+/g,' ').trim(),
        picker:budget?.querySelector('[data-ticket-outing-game]')?{
          value:budget.querySelector('[data-ticket-outing-game]').value,
          height:rect(budget.querySelector('[data-ticket-outing-game]')).height,
          left:rect(budget.querySelector('[data-ticket-outing-game]')).left,
          right:rect(budget.querySelector('[data-ticket-outing-game]')).right
        }:null,
        inputs:budget?[...budget.querySelectorAll('[data-ticket-outing-field]')].map(input=>({
          field:input.dataset.ticketOutingField||'',
          value:input.value,
          height:rect(input).height,
          left:rect(input).left,
          right:rect(input).right,
          fontSize:parseFloat(getComputedStyle(input).fontSize)||0
        })):[],
        clear:budget?.querySelector('[data-ticket-outing-clear]')?{
          disabled:Boolean(budget.querySelector('[data-ticket-outing-clear]').disabled),
          height:rect(budget.querySelector('[data-ticket-outing-clear]')).height,
          left:rect(budget.querySelector('[data-ticket-outing-clear]')).left,
          right:rect(budget.querySelector('[data-ticket-outing-clear]')).right
        }:null,
        cost:Boolean(cost),
        costText:(cost?.textContent||'').replace(/\s+/g,' ').trim(),
        costCards:costCards.map(card=>({
          key:card.dataset.ticketCostKey||'',
          ready:card.dataset.ticketCostReady||'',
          text:(card.textContent||'').replace(/\s+/g,' ').trim(),
          left:rect(card).left,
          right:rect(card).right,
          action:card.querySelector('[data-ticket-cost-edit]')?{
            height:rect(card.querySelector('[data-ticket-cost-edit]')).height,
            label:card.querySelector('[data-ticket-cost-edit]').getAttribute('aria-label')||''
          }:null
        }))
      };
    """,SHORTLIST_KEY)


def assert_truth(state,label,require_incomplete=False):
    if not state['budget'] or not state['cost']:
        raise RuntimeError(f'{label}: budget or actual-cost surface missing: {state}')
    budget=state['budgetText']
    cost=state['costText']
    for phrase in (
        'Enter the actual ticket checkout total you see.',
        'Ticket Center never guesses fees.',
        'This reference is not used as your checkout total.',
        'No fee, parking, food, or merch estimate is generated.'
    ):
        if phrase not in budget:raise RuntimeError(f'{label}: Game Night Budget lost truth copy {phrase!r}')
    if 'Starting prices, unentered fees, seat quality, and projected spending are excluded.' not in cost:
        raise RuntimeError(f'{label}: Actual Cost Compare lost final-cost truth boundary')
    if require_incomplete and 'Starting prices are not substituted for checkout.' not in cost:
        raise RuntimeError(f'{label}: incomplete saved games lost no-substitution disclosure')
    lowered=f'{budget} {cost}'.lower()
    for phrase in ('estimated fee','estimated parking','deal score','buy now','wait to buy','guaranteed deal'):
        if phrase in lowered:raise RuntimeError(f'{label}: unsupported estimate/recommendation copy leaked: {phrase}')


def exercise_budget(driver):
    initial=snapshot(driver)
    assert_truth(initial,'initial',require_incomplete=True)
    if initial['shortlistCount']!=2:raise RuntimeError(f'fixture shortlist was not preserved: {initial}')
    if len(initial['costCards'])!=2 or any(card['ready']!='false' for card in initial['costCards']):
        raise RuntimeError(f'initial actual-cost comparison should keep both games incomplete: {initial}')

    for field,value in [('checkout',480.25),('parking',30),('food',42.5),('other',20)]:
        set_amount(driver,'tenx-budget-a',field,value)
    for field,value in [('checkout',450),('parking',25),('food',30),('other',0)]:
        set_amount(driver,'tenx-budget-b',field,value)

    WebDriverWait(driver,8,poll_frequency=.1).until(lambda d:d.execute_script("""
      const cards=[...document.querySelectorAll('[data-ticket-cost-key]')];
      return cards.length===2&&cards.every(card=>card.dataset.ticketCostReady==='true');
    """))
    ready=snapshot(driver)
    assert_truth(ready,'ready')
    if ready['shortlistCount']!=2:raise RuntimeError(f'budget edits mutated shortlist: {ready}')
    if len(ready['costCards'])!=2:raise RuntimeError(f'actual cost cards disappeared: {ready}')
    if ready['costCards'][0]['key']!='tenx-budget-b':
        raise RuntimeError(f'lower entered outing total did not sort first: {ready["costCards"]}')
    if 'LOWEST ENTERED OUTING' not in ready['costCards'][0]['text'] or '$505' not in ready['costCards'][0]['text']:
        raise RuntimeError(f'lowest entered outing truth is wrong: {ready["costCards"][0]}')
    first_a=next((card for card in ready['costCards'] if card['key']=='tenx-budget-a'),None)
    if not first_a or '$572.75' not in first_a['text']:
        raise RuntimeError(f'first fixture outing total is wrong: {first_a}')

    clicked=driver.execute_script("""
      const card=[...document.querySelectorAll('[data-ticket-cost-key]')].find(node=>node.dataset.ticketCostKey===arguments[0]);
      const button=card?.querySelector('[data-ticket-cost-edit]');
      if(!button)return false;
      button.click();
      return true;
    """,'tenx-budget-a')
    if not clicked:raise RuntimeError('Edit budget action missing for first fixture')
    WebDriverWait(driver,5,poll_frequency=.05).until(lambda d:d.execute_script("""
      const picker=document.querySelector('[data-ticket-outing-game]');
      const input=document.querySelector('[data-ticket-outing-field="checkout"]');
      return picker?.value===arguments[0]&&input===document.activeElement;
    """,'tenx-budget-a'))

    mobile_metrics=set_css_viewport(driver,390,844)
    WebDriverWait(driver,5,poll_frequency=.1).until(lambda d:d.execute_script("""
      return window.innerWidth===390
        && window.innerHeight===844
        && matchMedia('(max-width:620px)').matches;
    """))
    mobile=snapshot(driver)
    assert_truth(mobile,'mobile')
    if mobile['innerWidth']!=390 or not mobile['phoneMedia']:
        raise RuntimeError(f'mobile CSS viewport contract did not hold: {mobile}')
    if mobile['overflow']:raise RuntimeError(f'mobile budget flow creates root overflow: {mobile}')
    if not mobile['picker'] or mobile['picker']['height']<48:
        raise RuntimeError(f'mobile budget picker below 48px: {mobile}')
    bad_inputs=[item for item in mobile['inputs'] if item['height']<48 or item['fontSize']<16 or item['left']<-1 or item['right']>mobile['viewport']+1]
    if bad_inputs:raise RuntimeError(f'mobile budget inputs violate touch/viewport contract: {bad_inputs}')
    bad_cards=[card for card in mobile['costCards'] if card['left']<-1 or card['right']>mobile['viewport']+1 or not card['action'] or card['action']['height']<48]
    if bad_cards:raise RuntimeError(f'mobile actual-cost cards/actions violate touch/viewport contract: {bad_cards}')
    if not mobile['clear'] or mobile['clear']['height']<48 or mobile['clear']['left']<-1 or mobile['clear']['right']>mobile['viewport']+1:
        raise RuntimeError(f'mobile clear action violates touch/viewport contract: {mobile}')

    cleared=driver.execute_script("""
      const button=document.querySelector('[data-ticket-outing-clear]');
      if(!button||button.disabled)return false;
      button.click();
      return true;
    """)
    if not cleared:raise RuntimeError('Clear this plan unavailable for populated fixture')
    WebDriverWait(driver,5,poll_frequency=.05).until(lambda d:d.execute_script("""
      try{
        const store=JSON.parse(localStorage.getItem(arguments[0])||'{}');
        return !store?.plans?.[arguments[1]];
      }catch{return false;}
    """,BUDGET_KEY,'tenx-budget-a'))
    WebDriverWait(driver,5,poll_frequency=.05).until(lambda d:d.execute_script("""
      const card=[...document.querySelectorAll('[data-ticket-cost-key]')].find(node=>node.dataset.ticketCostKey===arguments[0]);
      return card?.dataset.ticketCostReady==='false'&&(card.textContent||'').includes('NEEDS CHECKOUT');
    """,'tenx-budget-a'))
    final=snapshot(driver)
    assert_truth(final,'cleared',require_incomplete=True)
    if final['shortlistCount']!=2:raise RuntimeError(f'clearing one budget plan mutated shortlist: {final}')
    if '1/2 actual totals ready' not in final['costText']:
        raise RuntimeError(f'Actual Cost Compare did not reconcile cleared plan: {final}')
    return {
        'fixtureCount':2,
        'totalsVerified':['$572.75','$505'],
        'lowestEnteredOuting':'tenx-budget-b',
        'editFocusVerified':True,
        'clearLifecycleVerified':True,
        'mobileViewport':mobile_metrics,
        'mobileTouchFloor':48,
        'truthCopyVerified':True
    }


def severe_logs(driver):
    rows=[]
    for entry in driver.get_log('browser'):
        message=entry.get('message','')
        if entry.get('level')=='SEVERE' and 'favicon' not in message.lower():rows.append(message)
    return rows


result={'ok':False,'base':BASE,'checks':{},'browserWarnings':[]}
started=time.time();driver=None;stage='starting'
try:
    stage='launch';driver=driver_for()
    stage='prepare';prepare(driver)
    stage='seed';seed_shortlist(driver)
    stage='budget-flow';result['checks']=exercise_budget(driver)
    stage='console';result['browserWarnings']=severe_logs(driver)
    if result['browserWarnings']:raise RuntimeError(f'Ticket budget browser console errors: {result["browserWarnings"][:5]}')
    result['ok']=True;stage='complete'
except Exception as exc:
    result['stage']=stage
    result['error']=f'{type(exc).__name__}: {exc}'
    if driver is not None:
        try:result['state']=snapshot(driver)
        except Exception:pass
finally:
    if driver is not None:
        try:
            driver.execute_script("localStorage.removeItem(arguments[0]);localStorage.removeItem(arguments[1]);",SHORTLIST_KEY,BUDGET_KEY)
        except Exception:pass
        try:driver.quit()
        except Exception:pass
    result['durationSeconds']=round(time.time()-started,2)
    result['testedAt']=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result,indent=2))

if not result['ok']:raise SystemExit(1)
