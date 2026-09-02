import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans.alecjprice.com').rstrip('/')
REPORT=Path('/tmp/ticket-observed-drops-browser-smoke-v141.json')
MEMORY_KEY='titans:tickets-price-memory-v124'
SHORTLIST_KEY='titans:tickets-shortlist-v123'
BUDGET_KEY='titans:tickets-outing-budget-v134'


def driver_for():
    options=webdriver.ChromeOptions()
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1280,900')
    driver=webdriver.Chrome(options=options)
    driver.set_page_load_timeout(25)
    driver.set_script_timeout(10)
    return driver


def exact_viewport(driver,width,height):
    driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{
        'width':width,
        'height':height,
        'deviceScaleFactor':1,
        'mobile':False
    })
    WebDriverWait(driver,5,poll_frequency=.05).until(
        lambda d:d.execute_script('return [window.innerWidth,window.innerHeight]')==[width,height]
    )


def load_tickets(driver):
    try:
        driver.get(f'{BASE}/#tickets')
    except TimeoutException:
        try:driver.execute_script('window.stop()')
        except Exception:pass
    WebDriverWait(driver,20,poll_frequency=.1).until(lambda d:d.execute_script("""
      return Boolean(
        location.hash.startsWith('#tickets')&&
        document.querySelector('#app [data-ticket-center]')&&
        window.__TitansTicketTenxV123&&
        window.__TitansTicketTrendV124
      );
    """))


def prepare_fixture(driver):
    return driver.execute_script("""
      const center=document.querySelector('#app [data-ticket-center]');
      if(!center)return {ok:false,reason:'Ticket Center missing'};
      localStorage.removeItem(arguments[0]);
      localStorage.removeItem(arguments[1]);
      localStorage.removeItem(arguments[2]);
      center.innerHTML=`
        <section class="tickets-comparison-board">
          <header><strong>TENX production fixture</strong><span>3 games</span></header>
          <div class="tickets-compare-list">
            <article class="tickets-compare-card" data-smoke-fixture="alpha">
              <div class="tickets-event-copy"><h3>Fixture Alpha</h3><p>Sep 20 · 1:00 PM</p><p>Nissan Stadium</p></div>
              <div class="tickets-event-tags"><span>home</span><b>3 sources</b></div>
              <div class="tickets-price-block"><strong>$100</strong><em>3 sources</em></div>
            </article>
            <article class="tickets-compare-card" data-smoke-fixture="bravo">
              <div class="tickets-event-copy"><h3>Fixture Bravo</h3><p>Oct 4 · 1:00 PM</p><p>Nissan Stadium</p></div>
              <div class="tickets-event-tags"><span>home</span><b>2 sources</b></div>
              <div class="tickets-price-block"><strong>$120</strong><em>2 sources</em></div>
            </article>
            <article class="tickets-compare-card" data-smoke-fixture="charlie">
              <div class="tickets-event-copy"><h3>Fixture Charlie</h3><p>Oct 18 · 1:00 PM</p><p>Fixture Stadium</p></div>
              <div class="tickets-event-tags"><span>away</span><b>1 source</b></div>
              <div class="tickets-price-block"><strong>$90</strong><em>Single source</em></div>
            </article>
          </div>
        </section>`;
      window.dispatchEvent(new Event('hashchange'));
      return {ok:true};
    """,MEMORY_KEY,SHORTLIST_KEY,BUDGET_KEY)


def wait_fixture_enhanced(driver):
    WebDriverWait(driver,8,poll_frequency=.05).until(lambda d:d.execute_script("""
      const cards=[...document.querySelectorAll('[data-smoke-fixture]')];
      return cards.length===3&&cards.every(card=>Boolean(card.dataset.ticketTenxKey))&&
        Boolean(document.querySelector('[data-ticket-tenx-command]'))&&
        Boolean(document.querySelector('[data-ticket-trend-v124]'));
    """))


def seed_drops(driver):
    result=driver.execute_script("""
      const cards=[...document.querySelectorAll('[data-smoke-fixture]')];
      const byName=Object.fromEntries(cards.map(card=>[card.dataset.smokeFixture,{
        key:card.dataset.ticketTenxKey,
        price:Number(card.dataset.ticketTenxPrice)
      }]));
      if(!byName.alpha?.key||!byName.bravo?.key||!byName.charlie?.key)return {ok:false,byName};
      if(byName.alpha.price!==100||byName.bravo.price!==120||byName.charlie.price!==90)return {ok:false,byName};
      const now=Date.now();
      const memory={events:{},updatedAt:now};
      memory.events[byName.alpha.key]={title:'Fixture Alpha',date:'Sep 20 · 1:00 PM',updatedAt:now,points:[{price:160,at:now-60000},{price:100,at:now}]};
      memory.events[byName.bravo.key]={title:'Fixture Bravo',date:'Oct 4 · 1:00 PM',updatedAt:now,points:[{price:140,at:now-60000},{price:120,at:now}]};
      memory.events[byName.charlie.key]={title:'Fixture Charlie',date:'Oct 18 · 1:00 PM',updatedAt:now,points:[{price:90,at:now-60000},{price:90,at:now}]};
      localStorage.setItem(arguments[0],JSON.stringify(memory));
      window.dispatchEvent(new StorageEvent('storage',{key:arguments[0],newValue:JSON.stringify(memory),storageArea:localStorage}));
      return {ok:true,byName};
    """,MEMORY_KEY)
    if not result.get('ok'):
        raise RuntimeError(f'could not seed deterministic observed drops: {result}')
    return result['byName']


def snapshot(driver):
    return driver.execute_script("""
      const center=document.querySelector('[data-ticket-center]');
      const button=center?.querySelector('[data-ticket-tenx-sort="drops"]');
      const cheapest=center?.querySelector('[data-ticket-tenx-sort="price"]');
      const sortField=button?.closest('fieldset');
      const cards=[...center?.querySelectorAll('.tickets-compare-list [data-smoke-fixture]')||[]];
      const viewport=document.documentElement.clientWidth;
      return {
        viewport,
        innerWidth:window.innerWidth,
        overflow:document.documentElement.scrollWidth>viewport+3,
        dropButton:button?{
          disabled:Boolean(button.disabled),
          text:button.textContent.trim(),
          label:button.getAttribute('aria-label')||'',
          pressed:button.getAttribute('aria-pressed'),
          height:button.getBoundingClientRect().height,
          left:button.getBoundingClientRect().left,
          right:button.getBoundingClientRect().right
        }:null,
        cheapestPressed:cheapest?.getAttribute('aria-pressed')||'',
        status:(center?.querySelector('[data-ticket-tenx-status]')?.textContent||'').trim(),
        cards:cards.map(card=>({
          name:card.dataset.smokeFixture||'',
          key:card.dataset.ticketTenxKey||'',
          price:Number(card.dataset.ticketTenxPrice)||0,
          drop:card.dataset.ticketObservedDrop||'',
          pct:card.dataset.ticketObservedDropPct||'',
          hidden:Boolean(card.hidden),
          left:card.getBoundingClientRect().left,
          right:card.getBoundingClientRect().right
        })),
        sortButtons:sortField?[...sortField.querySelectorAll('button')].map(node=>({
          text:node.textContent.trim(),
          height:node.getBoundingClientRect().height,
          top:node.getBoundingClientRect().top,
          width:node.getBoundingClientRect().width,
          left:node.getBoundingClientRect().left,
          right:node.getBoundingClientRect().right
        })):[]
      };
    """)


def verify_seeded_state(driver,keys):
    WebDriverWait(driver,8,poll_frequency=.05).until(lambda d:d.execute_script("""
      const button=document.querySelector('[data-ticket-tenx-sort="drops"]');
      const alpha=document.querySelector('[data-smoke-fixture="alpha"]');
      const bravo=document.querySelector('[data-smoke-fixture="bravo"]');
      return Boolean(button&&!button.disabled&&button.textContent.trim()==='Observed drops (2)'&&
        alpha?.dataset.ticketObservedDrop==='60'&&bravo?.dataset.ticketObservedDrop==='20');
    """))
    state=snapshot(driver)
    if state['dropButton']['label']!='Sort with 2 browser-observed price drops first':
        raise RuntimeError(f'observed-drop accessible label is not factual: {state}')
    alpha=next(card for card in state['cards'] if card['name']=='alpha')
    bravo=next(card for card in state['cards'] if card['name']=='bravo')
    charlie=next(card for card in state['cards'] if card['name']=='charlie')
    if alpha['key']!=keys['alpha']['key'] or bravo['key']!=keys['bravo']['key'] or charlie['key']!=keys['charlie']['key']:
        raise RuntimeError(f'fixture keys changed after memory update: {state}')
    if any(card['hidden'] for card in state['cards']):
        raise RuntimeError(f'observed-drop availability unexpectedly hid games: {state}')
    return state


def click_drop_sort(driver):
    clicked=driver.execute_script("""
      const button=document.querySelector('[data-ticket-tenx-sort="drops"]');
      if(!button||button.disabled)return false;
      button.click();
      return true;
    """)
    if not clicked:raise RuntimeError('Observed drops control was not actionable')
    WebDriverWait(driver,5,poll_frequency=.05).until(lambda d:d.execute_script("""
      const order=[...document.querySelectorAll('.tickets-compare-list [data-smoke-fixture]')].map(card=>card.dataset.smokeFixture);
      return document.querySelector('[data-ticket-tenx-sort="drops"]')?.getAttribute('aria-pressed')==='true'&&order.join('|')==='alpha|bravo|charlie';
    """))
    state=snapshot(driver)
    expected='Sorted with the largest price drops observed in this browser first, then current starting price. This is local history, not marketplace-wide.'
    if state['status']!=expected:raise RuntimeError(f'Observed drops status lost local-history truth: {state}')
    if [card['name'] for card in state['cards']]!=['alpha','bravo','charlie']:
        raise RuntimeError(f'Observed drops did not rank largest dollar drop first: {state}')
    return state


def verify_mobile(driver):
    exact_viewport(driver,390,844)
    state=snapshot(driver)
    if state['viewport']!=390 or state['innerWidth']!=390:
        raise RuntimeError(f'Chrome did not honor exact 390px viewport: {state}')
    if state['overflow']:raise RuntimeError(f'Observed drops created mobile root overflow: {state}')
    if not state['dropButton'] or state['dropButton']['height']<44:
        raise RuntimeError(f'Observed drops control below 44px mobile touch floor: {state}')
    if state['dropButton']['left']<-1 or state['dropButton']['right']>391:
        raise RuntimeError(f'Observed drops control escapes mobile viewport: {state}')
    if len(state['sortButtons'])!=3 or any(button['height']<44 for button in state['sortButtons']):
        raise RuntimeError(f'Sort controls are not touch safe at 390px: {state}')
    tops=[round(button['top']) for button in state['sortButtons']]
    if len(set(tops))!=3:
        raise RuntimeError(f'390px sort controls should stack into one column: {state}')
    if any(card['left']<-1 or card['right']>391 for card in state['cards']):
        raise RuntimeError(f'fixture card escapes mobile viewport: {state}')
    return state


def reset_memory_and_verify_fallback(driver):
    driver.execute_script("""
      const empty=JSON.stringify({events:{},updatedAt:Date.now()});
      localStorage.setItem(arguments[0],empty);
      window.dispatchEvent(new StorageEvent('storage',{key:arguments[0],newValue:empty,storageArea:localStorage}));
    """,MEMORY_KEY)
    WebDriverWait(driver,8,poll_frequency=.05).until(lambda d:d.execute_script("""
      const button=document.querySelector('[data-ticket-tenx-sort="drops"]');
      const cheapest=document.querySelector('[data-ticket-tenx-sort="price"]');
      const cards=[...document.querySelectorAll('[data-smoke-fixture]')];
      const order=[...document.querySelectorAll('.tickets-compare-list [data-smoke-fixture]')].map(card=>card.dataset.smokeFixture).join('|');
      return Boolean(button?.disabled&&button.textContent.trim()==='Observed drops'&&
        cheapest?.getAttribute('aria-pressed')==='true'&&
        cards.every(card=>!card.dataset.ticketObservedDrop&&!card.dataset.ticketObservedDropPct)&&
        order==='charlie|alpha|bravo');
    """))
    state=snapshot(driver)
    if state['dropButton']['pressed']!='false' or state['cheapestPressed']!='true':
        raise RuntimeError(f'Observed drops did not fall back to Cheapest after memory reset: {state}')
    if any(card['hidden'] for card in state['cards']):
        raise RuntimeError(f'memory reset unexpectedly hid games: {state}')
    return state


def cleanup(driver):
    try:
        driver.execute_script("""
          localStorage.removeItem(arguments[0]);
          localStorage.removeItem(arguments[1]);
          localStorage.removeItem(arguments[2]);
        """,MEMORY_KEY,SHORTLIST_KEY,BUDGET_KEY)
    except Exception:
        pass


result={'ok':False,'base':BASE,'version':'v141'}
driver=None
started=time.time()
stage='starting'
try:
    stage='launch';driver=driver_for();load_tickets(driver)
    stage='fixture';prepared=prepare_fixture(driver)
    if not prepared.get('ok'):raise RuntimeError(prepared.get('reason') or 'fixture injection failed')
    wait_fixture_enhanced(driver)
    stage='seed';keys=seed_drops(driver);seeded=verify_seeded_state(driver,keys)
    stage='sort';sorted_state=click_drop_sort(driver)
    stage='mobile';mobile=verify_mobile(driver)
    stage='reset';reset=reset_memory_and_verify_fallback(driver)
    result.update({
        'ok':True,
        'dropCount':2,
        'largestDrop':'Fixture Alpha · $60',
        'secondDrop':'Fixture Bravo · $20',
        'sortOrder':['alpha','bravo','charlie'],
        'mobileViewport':mobile['viewport'],
        'mobileSortStacked':True,
        'resetFallback':'Cheapest',
        'seededLabel':seeded['dropButton']['label'],
        'localHistoryStatus':sorted_state['status'],
        'finalDropDisabled':reset['dropButton']['disabled']
    })
    stage='complete'
except Exception as exc:
    result['stage']=stage
    result['error']=f'{type(exc).__name__}: {exc}'
finally:
    if driver is not None:
        cleanup(driver)
        try:driver.quit()
        except Exception:pass
    result['durationSeconds']=round(time.time()-started,2)
    result['testedAt']=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result,indent=2))

if not result['ok']:raise SystemExit(1)
