import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT=Path('/tmp/tickets-browser-smoke.json')
SAFE_ROOTS=('seatgeek.com','ticketmaster.com','stubhub.com','tennesseetitans.com')


def driver_for(width=1280,height=900):
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


def read_json(path,label):
    request=Request(f'{BASE}{path}',headers={'Accept':'application/json','Cache-Control':'no-cache','User-Agent':'TitansCommandCenter-TicketBrowserAudit/1.0'})
    with urlopen(request,timeout=12) as response:
        if response.status!=200:raise RuntimeError(f'{label} returned HTTP {response.status}')
        return json.loads(response.read().decode('utf-8'))


def parse_time(value):
    if not value:return None
    try:return datetime.fromisoformat(str(value).replace('Z','+00:00')).astimezone(timezone.utc).timestamp()
    except Exception:return None


def expected_fallback_games(payload,now=None):
    now=time.time() if now is None else now
    rows=[]
    for game in payload.get('games') or []:
        status=str(game.get('status') or '').lower()
        if status in ('final','bye'):continue
        if game.get('dateTbd') is True:
            rows.append(game);continue
        kickoff=parse_time(game.get('date'))
        if kickoff is not None and kickoff>now:rows.append(game)
    return rows


def load_route(driver,route,attempts=2):
    last=None
    for attempt in range(attempts):
        try:
            driver.get(f'{BASE}/#{route}')
            return
        except TimeoutException as exc:
            last=exc
            try:driver.execute_script('window.stop()')
            except Exception:pass
            if driver.execute_script("return location.hash===arguments[0]&&Boolean(document.querySelector('#app'))",f'#{route}'):
                return
            if attempt+1<attempts:time.sleep(.4)
    raise last


def prepare_returning_user(driver):
    try:driver.get(f'{BASE}/')
    except TimeoutException:
        try:driver.execute_script('window.stop()')
        except Exception:pass
    driver.execute_script("""
      localStorage.setItem('titans:v10Onboarded','1');
      document.querySelector('#v10-onboarding [data-v10-close]')?.click();
    """)
    load_route(driver,'tickets')


def wait_ticket_center(driver,expected_fallback_count,timeout=20):
    def settled(d):
        return d.execute_script("""
          const center=document.querySelector('[data-ticket-center]');
          if(!center)return null;
          const comparison=center.querySelector('.tickets-comparison-board');
          if(comparison)return 'comparison';
          const offline=center.querySelector('.tickets-offline-state');
          if(!offline)return null;
          const expected=Number(arguments[0])||0;
          const cards=center.querySelectorAll('.tickets-upcoming-list a').length;
          if(expected>0&&cards<1)return null;
          return 'fallback';
        """,expected_fallback_count)
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(settled)


def summary(driver):
    return driver.execute_script(r"""
      const center=document.querySelector('[data-ticket-center]');
      if(!center)return null;
      const fallback=[...center.querySelectorAll('.tickets-upcoming-list a')].map(card=>({
        opponent:card.querySelector('strong')?.textContent?.trim()||'',
        side:card.querySelector('b')?.textContent?.trim()||'',
        date:card.querySelector('em')?.textContent?.trim()||'',
        action:card.querySelector('i')?.textContent?.trim()||'',
        href:card.href||'',
        official:card.dataset.officialTicketLink||'',
        marketplace:card.dataset.ticketMarketplace||'',
        hidden:Boolean(card.hidden),
        height:card.getBoundingClientRect().height,
        left:card.getBoundingClientRect().left,
        right:card.getBoundingClientRect().right
      }));
      const comparison=[...center.querySelectorAll('.tickets-compare-card')].map(card=>({
        text:(card.textContent||'').replace(/\s+/g,' ').trim(),
        offers:[...card.querySelectorAll('.tickets-offer-row a')].map(a=>a.href),
        left:card.getBoundingClientRect().left,
        right:card.getBoundingClientRect().right
      }));
      const filters=[...center.querySelectorAll('[data-ticket-filter]')].map(button=>({
        value:button.dataset.ticketFilter||'',pressed:button.getAttribute('aria-pressed'),
        height:button.getBoundingClientRect().height,width:button.getBoundingClientRect().width
      }));
      const refresh=center.querySelector('[data-ticket-refresh]');
      return {
        mode:center.querySelector('.tickets-comparison-board')?'comparison':'fallback',
        heading:center.querySelector('.tickets-hero h1')?.textContent?.trim()||'',
        fallback,comparison,filters,
        refreshHeight:refresh?.getBoundingClientRect().height||0,
        offline:Boolean(center.querySelector('.tickets-offline-state')),
        upcoming:Boolean(center.querySelector('.tickets-upcoming')),
        overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+3,
        viewport:document.documentElement.clientWidth,
        scrollWidth:document.documentElement.scrollWidth
      };
    """)


def host_allowed(host,root):
    return host==root or host.endswith(f'.{root}')


def safe_ticket_url(value):
    parsed=urlparse(value)
    host=(parsed.hostname or '').lower()
    return parsed.scheme=='https' and any(host_allowed(host,root) for root in SAFE_ROOTS)


def assert_base_state(state,label,expected_fallback):
    if not state:raise RuntimeError(f'{label}: Ticket Center did not render')
    if state['overflow']:raise RuntimeError(f'{label}: horizontal overflow: {state}')
    if state['refreshHeight']<44:raise RuntimeError(f'{label}: ticket refresh target below 44px: {state}')
    if len(state['filters'])!=3:raise RuntimeError(f'{label}: expected All/Home/Away filters: {state}')
    if state['mode']=='comparison':
        if not state['comparison']:raise RuntimeError(f'{label}: comparison mode has no game cards: {state}')
        urls=[url for card in state['comparison'] for url in card['offers']]
        if not urls or any(not safe_ticket_url(url) for url in urls):raise RuntimeError(f'{label}: comparison contains unsafe or missing checkout URL: {urls[:8]}')
        ancillary=[card['text'] for card in state['comparison'] if any(term in card['text'].lower() for term in ('official hotel package','travel package','parking'))]
        if ancillary:raise RuntimeError(f'{label}: ancillary Ticketmaster products entered game comparison: {ancillary[:4]}')
    else:
        if not state['offline']:raise RuntimeError(f'{label}: fallback mode lacks explicit price-feed state: {state}')
        if expected_fallback and not state['fallback']:raise RuntimeError(f'{label}: fallback schedule did not hydrate: {state}')
        allowed={str(game.get('opponent') or game.get('opponentAbbr') or 'Opponent TBD') for game in expected_fallback}
        rendered={card['opponent'] for card in state['fallback']}
        unexpected=sorted(rendered-allowed)
        if unexpected:raise RuntimeError(f'{label}: fallback rendered non-upcoming games: {unexpected}')
        if any(not safe_ticket_url(card['href']) for card in state['fallback']):raise RuntimeError(f'{label}: fallback contains unsafe ticket URL: {state["fallback"][:4]}')
        for card in state['fallback']:
            if card['date']!='Date TBD' and card['official']!='1':raise RuntimeError(f'{label}: fixed-date fallback card missed its game-specific official link: {card}')
    return {'mode':state['mode'],'fallbackCards':len(state['fallback']),'comparisonCards':len(state['comparison'])}


def click_filter(driver,value):
    button=WebDriverWait(driver,8,poll_frequency=.1).until(lambda d:d.find_element(By.CSS_SELECTOR,f'[data-ticket-filter="{value}"]'))
    driver.execute_script('arguments[0].click()',button)
    WebDriverWait(driver,8,poll_frequency=.1).until(lambda d:d.execute_script("return document.querySelector(arguments[0])?.getAttribute('aria-pressed')==='true'",f'[data-ticket-filter="{value}"]'))
    return summary(driver)


def exercise_fallback_filters(driver,initial):
    result={}
    for value,side in [('home','VS'),('away','AT')]:
        state=click_filter(driver,value)
        visible=[card for card in state['fallback'] if not card['hidden']]
        if any(card['side']!=side for card in visible):raise RuntimeError(f'{value} filter leaked opposite-side fallback cards: {visible}')
        result[value]=len(visible)
    reset=click_filter(driver,'all')
    if len([card for card in reset['fallback'] if not card['hidden']])!=len(initial['fallback']):
        raise RuntimeError(f'All filter did not restore fallback cards: before={len(initial["fallback"])} after={reset}')
    return result


def severe_logs(driver):
    rows=[]
    for entry in driver.get_log('browser'):
        message=entry.get('message','')
        if entry.get('level')=='SEVERE' and 'favicon' not in message.lower():rows.append(message)
    return rows


result={'ok':False,'base':BASE,'desktop':{},'mobile':{},'browserWarnings':[]}
started=time.time();driver=None;stage='starting'
try:
    stage='schedule-api';data=read_json('/api/data','Data API');expected=expected_fallback_games(data)
    stage='desktop:launch';driver=driver_for();prepare_returning_user(driver)
    stage='desktop:wait';mode=wait_ticket_center(driver,len(expected));state=summary(driver)
    stage='desktop:truth';desktop_state=assert_base_state(state,'desktop',expected)
    result['desktop']={'state':desktop_state,'summary':state}
    if mode=='fallback' and state['fallback']:
        stage='desktop:filters';result['desktop']['filters']=exercise_fallback_filters(driver,state)

    stage='mobile:reload';driver.set_window_size(390,844);load_route(driver,'tickets');wait_ticket_center(driver,len(expected),timeout=22);mobile=summary(driver)
    stage='mobile:truth';mobile_state=assert_base_state(mobile,'mobile',expected)
    short=[control for control in mobile['filters'] if control['height']<44]
    if short:raise RuntimeError(f'mobile ticket filters below 44px: {short}')
    visible_cards=[card for card in mobile['fallback'] if not card['hidden']]
    if any(card['left']<-1 or card['right']>391 for card in visible_cards):raise RuntimeError(f'mobile fallback card escapes viewport: {visible_cards[:4]}')
    if any(card['left']<-1 or card['right']>391 for card in mobile['comparison']):raise RuntimeError(f'mobile comparison card escapes viewport: {mobile["comparison"][:4]}')
    result['mobile']={'state':mobile_state,'summary':mobile}

    stage='console';result['browserWarnings']=severe_logs(driver)
    if result['browserWarnings']:raise RuntimeError(f'Ticket Center browser console errors: {result["browserWarnings"][:5]}')
    result['eligibleFallbackGames']=len(expected);result['ok']=True;stage='complete'
except Exception as exc:
    result['stage']=stage;result['error']=f'{type(exc).__name__}: {exc}'
    if driver is not None:
        try:result['state']=summary(driver)
        except Exception:pass
finally:
    if driver is not None:
        try:driver.quit()
        except Exception:pass
    result['durationSeconds']=round(time.time()-started,2);result['testedAt']=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
    REPORT.write_text(json.dumps(result,indent=2),encoding='utf-8');print(json.dumps(result,indent=2))

if not result['ok']:raise SystemExit(1)
