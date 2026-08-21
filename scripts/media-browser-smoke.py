import json
import os
import sys
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

BASE = os.environ.get('WORKER_URL', 'https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT = Path('/tmp/media-browser-smoke.json')


def wait_for(driver, predicate, timeout=10):
    return WebDriverWait(driver, timeout, poll_frequency=0.1).until(
        lambda d: d.execute_script(f'return Boolean({predicate})')
    )


def write_report(payload):
    REPORT.write_text(json.dumps(payload, indent=2), encoding='utf-8')


def no_overflow(driver, label):
    state = driver.execute_script("return {w:document.documentElement.clientWidth,s:document.documentElement.scrollWidth}")
    if state['s'] > state['w'] + 3:
        raise RuntimeError(f'Horizontal overflow on {label}: {state}')


options = webdriver.ChromeOptions()
options.add_argument('--headless=new')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1440,1000')
options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})

driver = None
stage = 'starting'
started = time.time()
try:
    driver = webdriver.Chrome(options=options)
    driver.set_page_load_timeout(20)
    driver.set_script_timeout(5)

    stage = 'desktop:home'
    driver.get(f'{BASE}/#home')
    wait_for(driver, "document.readyState === 'complete' && document.querySelector('.fan-hero')")

    stage = 'desktop:click-media-link'
    wait_for(driver, "document.querySelector('a[href=\"#media\"]')")
    driver.execute_script("document.querySelector('a[href=\"#media\"]')?.click()")
    wait_for(driver, "location.hash === '#media'")
    wait_for(driver, "document.querySelector('.media-page') && document.querySelector('.media-tune-guide')")
    time.sleep(0.25)
    if not driver.execute_script("return Boolean(document.querySelector('.media-page'))"):
        raise RuntimeError('Media route was overwritten after interaction')
    no_overflow(driver, 'desktop media')

    stage = 'desktop:radio-safety'
    radio = driver.execute_script("""
      return {
        audioCount: document.querySelectorAll('#media-zone-audio,audio[src*="streamtheworld"]').length,
        titansAudio: document.querySelector('.media-radio-launch-main')?.href || '',
        zonePlayer: document.querySelector('.media-radio-launch-alt')?.href || '',
        launchCards: document.querySelectorAll('.media-radio-launch a').length,
        mediaSelected: document.querySelector('[data-media-area="nashville"]')?.getAttribute('aria-pressed')
      }
    """)
    if radio['audioCount'] != 0:
        raise RuntimeError(f'Raw embedded station audio is still present: {radio}')
    if '/broadcast/titans-radio/live-game-day-audio' not in radio['titansAudio']:
        raise RuntimeError(f'Official Titans audio URL missing: {radio}')
    if '1045thezone.com/player/?playerID=3234' not in radio['zonePlayer']:
        raise RuntimeError(f'Current 104.5 player URL missing: {radio}')
    if radio['launchCards'] != 2 or radio['mediaSelected'] != 'true':
        raise RuntimeError(f'Nashville radio launch UI invalid: {radio}')

    territory_checks = []
    for area, text in [('us', 'Elsewhere in U.S.'), ('international', 'International'), ('nashville', 'Nashville / Middle Tennessee')]:
        stage = f'desktop:territory:{area}'
        driver.execute_script("document.querySelector(`[data-media-area=\"${arguments[0]}\"]`)?.click()", area)
        wait_for(driver, f"document.querySelector('[data-media-area=\"{area}\"]')?.getAttribute('aria-pressed') === 'true'")
        wait_for(driver, "document.querySelector('.media-page') && location.hash === '#media'")
        time.sleep(0.08)
        state = driver.execute_script("""
          const selected=document.querySelector('[data-media-area][aria-pressed="true"]');
          return {hash:location.hash,selected:selected?.textContent?.trim()||'',page:Boolean(document.querySelector('.media-page')),guide:Boolean(document.querySelector('.media-tune-guide')),watch:(document.querySelector('.media-watch')?.innerText||'').slice(0,500)};
        """)
        if state['hash'] != '#media' or not state['page'] or not state['guide'] or text not in state['selected']:
            raise RuntimeError(f'Territory switch failed for {area}: {state}')
        territory_checks.append(state['selected'])

    stage = 'mobile:media'
    driver.set_window_size(390, 844)
    driver.get(f'{BASE}/#media')
    wait_for(driver, "document.querySelector('.media-page') && document.querySelector('.media-tune-guide')", timeout=12)
    no_overflow(driver, '390px media')
    mobile = driver.execute_script("""
      return {
        areaButtons:[...document.querySelectorAll('[data-media-area]')].map(x=>({label:x.textContent.trim(),h:x.getBoundingClientRect().height})),
        launchCards:document.querySelectorAll('.media-radio-launch a').length,
        timeRows:document.querySelectorAll('.media-time-row').length,
        page:Boolean(document.querySelector('.media-page'))
      }
    """)
    if len(mobile['areaButtons']) != 3 or any(x['h'] < 44 for x in mobile['areaButtons']):
        raise RuntimeError(f'Mobile territory controls invalid: {mobile}')
    if mobile['launchCards'] != 2 or mobile['timeRows'] != 4 or not mobile['page']:
        raise RuntimeError(f'Mobile media layout incomplete: {mobile}')

    stage = 'console'
    warnings = []
    try:
        warnings = [x for x in driver.get_log('browser') if x.get('level') in ('SEVERE', 'WARNING')]
    except Exception:
        pass
    severe = [x for x in warnings if x.get('level') == 'SEVERE']
    if severe:
        raise RuntimeError(f'Media browser console has severe errors: {severe[:4]}')

    result = {
        'ok': True,
        'base': BASE,
        'territoryChecks': territory_checks,
        'officialTitansAudio': True,
        'official1045Player': True,
        'rawEmbeddedAudio': False,
        'mobileAreaTargets': mobile['areaButtons'],
        'mobileTimeRows': mobile['timeRows'],
        'browserWarnings': warnings[:20],
        'durationSeconds': round(time.time() - started, 2),
        'testedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
    }
    write_report(result)
    print(json.dumps(result, indent=2))
except Exception as exc:
    result = {
        'ok': False,
        'base': BASE,
        'stage': stage,
        'error': f'{type(exc).__name__}: {exc}',
        'durationSeconds': round(time.time() - started, 2),
        'testedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
    }
    try:
        if driver is not None:
            result['hash'] = driver.execute_script('return location.hash')
            result['pageText'] = driver.execute_script("return (document.querySelector('#app')?.innerText||'').slice(0,800)")
            result['browserWarnings'] = [x for x in driver.get_log('browser') if x.get('level') in ('SEVERE', 'WARNING')][:20]
    except Exception:
        pass
    write_report(result)
    print(json.dumps(result, indent=2), file=sys.stderr)
    sys.exit(1)
finally:
    if driver is not None:
        try:
            driver.quit()
        except Exception:
            pass
