import json
import os
import sys
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT=Path('/tmp/player-gameday-browser-smoke.json')

def wait_for(driver,predicate,timeout=14):
    return WebDriverWait(driver,timeout,poll_frequency=0.1).until(lambda d:d.execute_script(f'return Boolean({predicate})'))

def write_report(payload):
    REPORT.write_text(json.dumps(payload,indent=2),encoding='utf-8')

def no_overflow(driver,label):
    state=driver.execute_script("return {w:document.documentElement.clientWidth,s:document.documentElement.scrollWidth}")
    if state['s']>state['w']+3: raise RuntimeError(f'Horizontal overflow on {label}: {state}')

def activate_player_tab(driver,tab,timeout=8):
    deadline=time.time()+timeout
    stable=0
    last=None
    while time.time()<deadline:
        last=driver.execute_script("""
          const tab=document.querySelector(`[data-v16-player-tab="${arguments[0]}"]`),pane=document.querySelector(`[data-v16-pane="${arguments[0]}"]`);
          if(!tab||!pane)return {exists:false,selected:false,visible:false};
          const selected=tab.getAttribute('aria-selected')==='true',visible=!pane.hidden;
          if(!selected||!visible)tab.click();
          return {exists:true,selected,visible,tabConnected:tab.isConnected,paneConnected:pane.isConnected};
        """,tab)
        if last.get('exists') and last.get('selected') and last.get('visible') and last.get('tabConnected') and last.get('paneConnected'):
            stable+=1
            if stable>=3:return last
        else:
            stable=0
        time.sleep(.1)
    raise TimeoutError(f'Player tab did not settle after DOM refresh: {tab} {last}')

options=webdriver.ChromeOptions()
options.add_argument('--headless=new')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1440,1000')
options.set_capability('goog:loggingPrefs',{'browser':'ALL'})

driver=None
stage='starting'
started=time.time()
try:
    driver=webdriver.Chrome(options=options)
    driver.set_page_load_timeout(20)
    driver.set_script_timeout(8)

    stage='player:find'
    driver.get(f'{BASE}/#roster')
    wait_for(driver,"document.querySelectorAll('.player-card').length > 20")
    # The first paint can be the audited fallback roster. Those cards intentionally
    # do not have database UUIDs, so wait for /api/data hydration before resolving
    # a real player route instead of mistaking #roster for the final state.
    wait_for(driver,"document.querySelector('.player-card[href*=\"#player?id=\"]')",timeout=18)
    player_href=driver.execute_script("""
      const cards=[...document.querySelectorAll('.player-card[href*="#player?id="]')];
      return cards.find(x=>x.querySelector('h3')?.textContent?.includes('Cam Ward'))?.getAttribute('href')
        || cards[0]?.getAttribute('href')
        || '';
    """)
    if not player_href or '#player?id=' not in player_href: raise RuntimeError(f'Could not resolve hydrated player route: {player_href}')

    stage='player:desktop'
    driver.get(f'{BASE}/{player_href}')
    wait_for(driver,"document.querySelector('.player-profile-rich') && document.querySelector('.v16-player-intel')",timeout=16)
    wait_for(driver,"document.querySelectorAll('[data-v16-player-tab]').length === 5")
    no_overflow(driver,'player desktop')
    tabs=[]
    for tab in ['overview','games','trends','career','timeline']:
        stage=f'player:tab:{tab}'
        activate_player_tab(driver,tab)
        tabs.append(tab)

    stage='player:favorite'
    before=driver.execute_script("return document.querySelector('[data-v16-favorite]')?.getAttribute('aria-pressed')")
    driver.execute_script("document.querySelector('[data-v16-favorite]')?.click()")
    after=driver.execute_script("return document.querySelector('[data-v16-favorite]')?.getAttribute('aria-pressed')")
    if before==after: raise RuntimeError(f'Favorite did not toggle: {before} -> {after}')
    driver.execute_script("document.querySelector('[data-v16-favorite]')?.click()")
    restored=driver.execute_script("return document.querySelector('[data-v16-favorite]')?.getAttribute('aria-pressed')")
    if restored!=before: raise RuntimeError(f'Favorite did not toggle back: {before} -> {after} -> {restored}')

    stage='player:mobile'
    driver.set_window_size(390,844)
    no_overflow(driver,'player 390px')
    mobile_player=driver.execute_script("""
      return {
        tabs:[...document.querySelectorAll('[data-v16-player-tab]')].map(x=>({label:x.textContent.trim(),h:x.getBoundingClientRect().height})),
        favorite:document.querySelector('[data-v16-favorite]')?.getBoundingClientRect().height||0,
        root:Boolean(document.querySelector('.v16-player-intel')),
        headshot:Boolean(document.querySelector('.player-rich-hero .has-headshot img'))
      }
    """)
    if len(mobile_player['tabs'])!=5 or any(x['h']<44 for x in mobile_player['tabs']): raise RuntimeError(f'Player mobile tab targets invalid: {mobile_player}')
    if mobile_player['favorite']<44 or not mobile_player['root']: raise RuntimeError(f'Player mobile shell invalid: {mobile_player}')

    stage='gameday:desktop'
    driver.set_window_size(1440,1000)
    driver.get(f'{BASE}/#live')
    wait_for(driver,"document.querySelector('.v16-gameday') && ['pregame','live','postgame'].includes(document.querySelector('.v16-gameday')?.dataset.phase)",timeout=18)
    no_overflow(driver,'gameday desktop')
    game=driver.execute_script("""
      const root=document.querySelector('.v16-gameday');
      return {
        phase:root?.dataset.phase||'',
        tune:Boolean(root?.querySelector('a[href="#media"]')),
        text:(root?.innerText||'').slice(0,1800),
        fakeLive:Boolean(root?.querySelector('[data-fake-live]'))
      }
    """)
    if not game['tune'] or game['fakeLive']: raise RuntimeError(f'Game Day source/tune contract failed: {game}')

    stage='gameday:mobile'
    driver.set_window_size(390,844)
    no_overflow(driver,'gameday 390px')
    mobile_game=driver.execute_script("""
      const root=document.querySelector('.v16-gameday');
      const links=[...root.querySelectorAll('a')].map(x=>({label:x.textContent.trim(),h:x.getBoundingClientRect().height}));
      return {phase:root.dataset.phase,links,rootWidth:root.getBoundingClientRect().width,viewport:document.documentElement.clientWidth};
    """)
    media_links=[x for x in mobile_game['links'] if 'watch' in x['label'].lower() or 'tune' in x['label'].lower()]
    if media_links and any(x['h']<44 for x in media_links): raise RuntimeError(f'Game Day mobile media target too small: {mobile_game}')

    stage='console'
    warnings=[]
    try: warnings=[x for x in driver.get_log('browser') if x.get('level') in ('SEVERE','WARNING')]
    except Exception: pass
    severe=[x for x in warnings if x.get('level')=='SEVERE']
    if severe: raise RuntimeError(f'v1.6 browser console has severe errors: {severe[:4]}')

    result={
      'ok':True,'base':BASE,'playerRoute':player_href,'playerRouteHydrated':True,'playerTabs':tabs,'favoriteToggle':[before,after,restored],
      'playerMobileTargets':mobile_player['tabs'],'playerHeadshotLoaded':mobile_player['headshot'],
      'gameDayPhase':game['phase'],'gameDayTuneLink':game['tune'],'gameDayMobileViewport':mobile_game['viewport'],
      'browserWarnings':warnings[:20],'durationSeconds':round(time.time()-started,2),
      'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
    }
    write_report(result);print(json.dumps(result,indent=2))
except Exception as exc:
    result={'ok':False,'base':BASE,'stage':stage,'error':f'{type(exc).__name__}: {exc}','durationSeconds':round(time.time()-started,2),'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
    try:
      if driver is not None:
        result['hash']=driver.execute_script('return location.hash')
        result['pageText']=driver.execute_script("return (document.querySelector('#app')?.innerText||'').slice(0,1800)")
        result['browserWarnings']=[x for x in driver.get_log('browser') if x.get('level') in ('SEVERE','WARNING')][:20]
    except Exception: pass
    write_report(result);print(json.dumps(result,indent=2),file=sys.stderr);sys.exit(1)
finally:
    if driver is not None:
      try: driver.quit()
      except Exception: pass
