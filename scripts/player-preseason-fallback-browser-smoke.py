import json
import os
import sys
import time
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT=Path('/tmp/player-preseason-fallback-browser-smoke.json')


def wait_for(driver,predicate,timeout=16):
    return WebDriverWait(driver,timeout,poll_frequency=0.1).until(lambda d:d.execute_script(f'return Boolean({predicate})'))


def write_report(payload):
    REPORT.write_text(json.dumps(payload,indent=2),encoding='utf-8')


def no_overflow(driver,label):
    state=driver.execute_script("return {w:document.documentElement.clientWidth,s:document.documentElement.scrollWidth}")
    if state['s']>state['w']+3:
        raise RuntimeError(f'Horizontal overflow on {label}: {state}')


def fetch_player_context(driver,player_id):
    return driver.execute_async_script("""
      const id=arguments[0],done=arguments[arguments.length-1];
      Promise.all([
        fetch(`/api/player?id=${encodeURIComponent(id)}`,{cache:'no-store'}).then(async r=>({status:r.status,body:await r.json().catch(()=>null)})),
        fetch('/api/preseason-stats',{cache:'no-store'}).then(async r=>({status:r.status,body:await r.json().catch(()=>null)}))
      ]).then(([profile,preseason])=>{
        const slug=value=>String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
        const player=profile.body?.player||{};
        const candidates=[...(Array.isArray(preseason.body?.players)?preseason.body.players:[]),...(Array.isArray(preseason.body?.otherParticipants)?preseason.body.otherParticipants:[])];
        const matched=candidates.find(item=>String(item?.id||'')&&String(item.id)===String(player.id||''))||candidates.find(item=>slug(item?.name)===slug(player.name));
        done({
          profileStatus:profile.status,
          profileOk:Boolean(profile.body?.ok),
          playerName:player.name||'',
          warehouseRows:Array.isArray(profile.body?.stats)?profile.body.stats.length:-1,
          preseasonStatus:preseason.status,
          preseasonOk:Boolean(preseason.body?.ok),
          preseasonRows:Array.isArray(matched?.stats)?matched.stats.length:0,
          preseasonSource:preseason.body?.statsSource||'',
          completedGames:Number(preseason.body?.coverage?.completedGames||0),
          completedGamesWithPlayerStats:Number(preseason.body?.coverage?.completedGamesWithPlayerStats||0),
          completedGamesMissingPlayerStats:Number(preseason.body?.coverage?.completedGamesMissingPlayerStats||0)
        });
      }).catch(error=>done({error:String(error)}));
    """,player_id)


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
    stage='launch'
    driver=webdriver.Chrome(options=options)
    driver.set_page_load_timeout(20)
    driver.set_script_timeout(12)

    stage='resolve-cam-ward'
    driver.get(f'{BASE}/#roster')
    wait_for(driver,"document.querySelectorAll('.player-card').length > 20")
    wait_for(driver,"document.querySelector('.player-card[href*=\"#player?id=\"]')",timeout=18)
    player_href=driver.execute_script("""
      const cards=[...document.querySelectorAll('.player-card[href*="#player?id="]')];
      return cards.find(x=>x.querySelector('h3')?.textContent?.trim()==='Cam Ward')?.getAttribute('href')||'';
    """)
    if not player_href or '#player?id=' not in player_href:
        raise RuntimeError(f'Could not resolve hydrated Cam Ward route: {player_href}')
    player_id=parse_qs(urlparse(player_href.replace('#','?',1)).query).get('id',[''])[0]
    if len(player_id)!=36:
        raise RuntimeError(f'Cam Ward route did not contain a UUID: {player_href}')

    stage='read-live-api-context'
    api_context=fetch_player_context(driver,player_id)
    if api_context.get('error'):
        raise RuntimeError(f'Could not read player/preseason APIs: {api_context}')
    if not api_context.get('profileOk') or api_context.get('profileStatus')!=200:
        raise RuntimeError(f'Cam Ward player API unavailable: {api_context}')
    if not api_context.get('preseasonOk') or api_context.get('preseasonStatus')!=200 or api_context.get('preseasonRows',0)<1:
        raise RuntimeError(f'Official preseason rows unavailable for Cam Ward: {api_context}')
    if api_context.get('completedGames',0)<2 or api_context.get('completedGamesWithPlayerStats',0)<2 or api_context.get('completedGamesMissingPlayerStats',1)!=0:
        raise RuntimeError(f'Preseason coverage regressed before Player Intelligence fallback check: {api_context}')

    fallback_required=api_context.get('warehouseRows',-1)==0

    stage='render-player'
    driver.get(f'{BASE}/{player_href}')
    wait_for(driver,"document.querySelector('.player-profile-rich') && document.querySelector('.v16-player-intel')",timeout=18)
    wait_for(driver,"document.querySelectorAll('[data-v16-player-tab]').length===5")
    no_overflow(driver,'Player preseason fallback desktop')
    state=driver.execute_script("""
      const root=document.querySelector('.v16-player-intel');
      const text=root?.innerText||'';
      const metrics=[...root.querySelectorAll('.v16-snapshot strong')].map(x=>x.textContent.trim()).filter(Boolean);
      const logRows=root?.querySelectorAll('.v16-game-log article').length||0;
      const fallbackRows=[...root.querySelectorAll('.v16-game-log article')].filter(x=>x.innerText.includes('Official fallback')).length;
      return {
        text:text.slice(0,6000),
        fallbackLabel:text.includes('2026 Preseason · official fallback'),
        regularSeasonDisclaimer:text.includes('They are not regular-season totals.'),
        awaitingIngest:text.includes('Season production is awaiting ingest.'),
        officialFallbackText:text.includes('Official fallback'),
        metrics,
        logRows,
        fallbackRows,
        tabs:[...root.querySelectorAll('[data-v16-player-tab]')].map(x=>({label:x.textContent.trim(),h:x.getBoundingClientRect().height}))
      };
    """)

    if fallback_required:
        numeric_metrics=[value for value in state['metrics'] if any(ch.isdigit() for ch in value)]
        if not state['fallbackLabel'] or not state['regularSeasonDisclaimer'] or state['awaitingIngest']:
            raise RuntimeError(f'Player Intelligence did not disclose the required official preseason fallback: {state}')
        if state['logRows']<1 or state['fallbackRows']<1 or not state['officialFallbackText'] or not numeric_metrics:
            raise RuntimeError(f'Player Intelligence fallback did not render official game rows/metrics: {state}')
    else:
        if not state['metrics'] and state['logRows']<1:
            raise RuntimeError(f'Warehouse-backed Player Intelligence has no usable production rows: {state}')

    stage='mobile'
    driver.set_window_size(390,844)
    no_overflow(driver,'Player preseason fallback 390px')
    mobile=driver.execute_script("""
      const root=document.querySelector('.v16-player-intel');
      return {
        root:Boolean(root),
        width:root?.getBoundingClientRect().width||0,
        viewport:document.documentElement.clientWidth,
        tabs:[...root.querySelectorAll('[data-v16-player-tab]')].map(x=>({label:x.textContent.trim(),h:x.getBoundingClientRect().height})),
        favorite:root.querySelector('[data-v16-favorite]')?.getBoundingClientRect().height||0
      };
    """)
    if not mobile['root'] or mobile['width']>mobile['viewport']+3 or len(mobile['tabs'])!=5 or any(x['h']<44 for x in mobile['tabs']) or mobile['favorite']<44:
        raise RuntimeError(f'Player preseason fallback mobile contract failed: {mobile}')

    stage='console'
    warnings=[]
    try:
        warnings=[x for x in driver.get_log('browser') if x.get('level') in ('SEVERE','WARNING')]
    except Exception:
        pass
    severe=[x for x in warnings if x.get('level')=='SEVERE']
    if severe:
        raise RuntimeError(f'Player preseason fallback browser console has severe errors: {severe[:4]}')

    result={
      'ok':True,
      'base':BASE,
      'player':'Cam Ward',
      'playerRoute':player_href,
      'fallbackRequired':fallback_required,
      'apiContext':api_context,
      'rendered':{
        'fallbackLabel':state['fallbackLabel'],
        'regularSeasonDisclaimer':state['regularSeasonDisclaimer'],
        'awaitingIngest':state['awaitingIngest'],
        'metrics':state['metrics'],
        'gameLogRows':state['logRows'],
        'fallbackGameRows':state['fallbackRows']
      },
      'mobile':mobile,
      'browserWarnings':warnings[:20],
      'durationSeconds':round(time.time()-started,2),
      'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
    }
    write_report(result)
    print(json.dumps(result,indent=2))
except Exception as exc:
    result={
      'ok':False,'base':BASE,'stage':stage,'error':f'{type(exc).__name__}: {exc}',
      'durationSeconds':round(time.time()-started,2),'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
    }
    try:
        if driver is not None:
            result['hash']=driver.execute_script('return location.hash')
            result['pageText']=driver.execute_script("return (document.querySelector('#app')?.innerText||'').slice(0,3500)")
            result['browserWarnings']=[x for x in driver.get_log('browser') if x.get('level') in ('SEVERE','WARNING')][:20]
    except Exception:
        pass
    write_report(result)
    print(json.dumps(result,indent=2),file=sys.stderr)
    sys.exit(1)
finally:
    if driver is not None:
        try: driver.quit()
        except Exception: pass
