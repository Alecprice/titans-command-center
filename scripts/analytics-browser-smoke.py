import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

BASE = os.environ.get('WORKER_URL', 'https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT = Path('/tmp/analytics-browser-smoke.json')


def write_report(payload):
    REPORT.write_text(json.dumps(payload, indent=2), encoding='utf-8')


def wait_for(driver, predicate, timeout=12):
    return WebDriverWait(driver, timeout, poll_frequency=0.1).until(lambda d: d.execute_script(f'return Boolean({predicate})'))


def assert_no_horizontal_overflow(driver, label):
    state = driver.execute_script("return {width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth}")
    if state['scrollWidth'] > state['width'] + 3:
        raise RuntimeError(f'Horizontal overflow on {label}: {state}')


options = webdriver.ChromeOptions()
options.add_argument('--headless=new')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1440,1100')
options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})

driver = None
started = time.time()
stage = 'starting'
try:
    stage = 'launch-chrome'
    driver = webdriver.Chrome(options=options)
    driver.set_page_load_timeout(25)
    driver.set_script_timeout(5)

    stage = 'desktop:load-stats'
    driver.get(f'{BASE}/#stats')
    wait_for(driver, "document.readyState === 'complete' && location.hash === '#stats'")
    wait_for(driver, "document.querySelector('.preseason-stats-hub')", timeout=15)

    stage = 'desktop:advanced-panel'
    wait_for(driver, "document.querySelector('.advanced-analytics-hub .ah-metrics')", timeout=15)
    wait_for(driver, "document.querySelectorAll('.advanced-analytics-hub .ah-metric').length === 4")
    wait_for(driver, "document.querySelectorAll('.advanced-analytics-hub .ah-week-row').length > 0")
    wait_for(driver, "document.querySelectorAll('.advanced-analytics-hub .ah-play').length > 0")
    wait_for(driver, "document.querySelectorAll('.advanced-analytics-hub .ah-personnel-grid section').length === 2")
    assert_no_horizontal_overflow(driver, 'desktop advanced Stats Lab')

    stage = 'desktop:season-context'
    season_context = driver.execute_script("""
      const root=document.querySelector('.advanced-analytics-hub');
      const banner=root?.querySelector('.ah-season-context');
      return {
        requestedSeason:root?.dataset?.requestedSeason||'',
        dataSeason:root?.dataset?.dataSeason||'',
        seasonFallback:root?.dataset?.seasonFallback||'',
        heading:root?.querySelector('.ah-head h2')?.textContent?.trim()||'',
        bannerText:(banner?.textContent||'').replace(/\s+/g,' ').trim(),
        bannerRole:banner?.getAttribute('role')||'',
        bannerVisible:Boolean(banner&&banner.getBoundingClientRect().width>0&&banner.getBoundingClientRect().height>0)
      };
    """)
    if season_context['seasonFallback'] == 'true':
        if not season_context['dataSeason'] or not season_context['requestedSeason'] or season_context['dataSeason'] == season_context['requestedSeason']:
            raise RuntimeError(f'Analytics fallback metadata is inconsistent: {season_context}')
        expected_baseline = f"{season_context['dataSeason']} regular-season baseline"
        expected_not_current = f"Not {season_context['requestedSeason']} performance"
        if not season_context['bannerVisible'] or season_context['bannerRole'] != 'note' or expected_baseline not in season_context['bannerText'] or expected_not_current not in season_context['bannerText']:
            raise RuntimeError(f'Analytics fallback is not unmistakably labeled: {season_context}')
        if season_context['dataSeason'] not in season_context['heading'] or 'baseline' not in season_context['heading'].lower():
            raise RuntimeError(f'Analytics fallback heading is ambiguous: {season_context}')
    elif season_context['bannerVisible']:
        raise RuntimeError(f'Historical fallback banner shown for current-season analytics: {season_context}')

    stage = 'desktop:metric-values'
    metrics = driver.execute_script("""
      return [...document.querySelectorAll('.advanced-analytics-hub .ah-metric')].map(card=>({
        label:card.querySelector('small')?.textContent?.trim()||'',
        value:card.querySelector('strong')?.textContent?.trim()||'',
        detail:card.querySelector('span')?.textContent?.trim()||''
      }));
    """)
    expected_labels = {'Offensive EPA / play', 'Defensive EPA / play allowed', 'Pace', 'Rest days'}
    if {item['label'] for item in metrics} != expected_labels:
        raise RuntimeError(f'Advanced metric labels are incomplete: {metrics}')
    if any(item['value'] in ('', '—') for item in metrics):
        raise RuntimeError(f'Advanced metric value missing: {metrics}')

    stage = 'desktop:situation-fields'
    situation = driver.execute_script("""
      const play=document.querySelector('.advanced-analytics-hub .ah-play');
      return play ? [...play.querySelectorAll('.ah-situation span')].map(x=>({
        label:x.querySelector('small')?.textContent?.trim()||'',
        value:x.querySelector('b')?.textContent?.trim()||''
      })) : [];
    """)
    labels = {item['label'] for item in situation}
    required = {'Down & distance', 'Field position', 'Score diff', 'Time remaining', 'Personnel', 'Formation', 'TEN EPA'}
    if not required.issubset(labels):
        raise RuntimeError(f'Situation explorer is missing fields: {sorted(required-labels)}')

    stage = 'desktop:offense-filter'
    initial_count = driver.execute_script("return document.querySelectorAll('.advanced-analytics-hub .ah-play').length")
    driver.execute_script("""
      const side=document.querySelector('#ah-side');
      side.value='offense';
      side.dispatchEvent(new Event('change',{bubbles:true}));
    """)
    wait_for(driver, "document.querySelector('#ah-side')?.value === 'offense'")
    wait_for(driver, "document.querySelectorAll('.advanced-analytics-hub .ah-play.defense').length === 0")
    filtered_count = driver.execute_script("return document.querySelectorAll('.advanced-analytics-hub .ah-play').length")
    if filtered_count < 1 or filtered_count > initial_count:
        raise RuntimeError(f'Offense play filter returned an invalid count: {filtered_count} from {initial_count}')

    stage = 'mobile:resize'
    driver.set_window_size(390, 844)
    driver.get(f'{BASE}/#stats')
    wait_for(driver, "document.readyState === 'complete' && document.querySelector('.advanced-analytics-hub .ah-metrics')", timeout=18)
    wait_for(driver, "document.querySelectorAll('.advanced-analytics-hub .ah-play').length > 0")
    assert_no_horizontal_overflow(driver, 'mobile advanced Stats Lab')
    mobile_metric_count = driver.execute_script("return document.querySelectorAll('.advanced-analytics-hub .ah-metric').length")
    if mobile_metric_count != 4:
        raise RuntimeError(f'Mobile advanced metric count was {mobile_metric_count}')
    mobile_season_banner = driver.execute_script("""
      const root=document.querySelector('.advanced-analytics-hub'),banner=root?.querySelector('.ah-season-context');
      return {fallback:root?.dataset?.seasonFallback||'',visible:Boolean(banner&&banner.getBoundingClientRect().width>0&&banner.getBoundingClientRect().height>0),text:(banner?.textContent||'').replace(/\s+/g,' ').trim()};
    """)
    if season_context['seasonFallback'] == 'true' and (not mobile_season_banner['visible'] or season_context['dataSeason'] not in mobile_season_banner['text']):
        raise RuntimeError(f'Mobile analytics fallback context is missing: {mobile_season_banner}')

    stage = 'console'
    console = []
    try:
        console = [entry for entry in driver.get_log('browser') if entry.get('level') in ('SEVERE', 'WARNING')]
    except Exception:
        pass
    severe = [entry for entry in console if entry.get('level') == 'SEVERE']
    if severe:
        raise RuntimeError(f'Advanced Stats Lab browser console has severe errors: {severe[:3]}')

    result = {
        'ok': True,
        'base': BASE,
        'seasonContext': season_context,
        'mobileSeasonContext': mobile_season_banner,
        'metricCount': len(metrics),
        'metricValues': metrics,
        'situationFields': sorted(labels),
        'initialPlayCards': initial_count,
        'offenseFilteredPlayCards': filtered_count,
        'mobileMetricCount': mobile_metric_count,
        'browserWarnings': console[:20],
        'durationSeconds': round(time.time() - started, 2),
        'testedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
    }
    write_report(result)
    print(json.dumps(result, indent=2))
except Exception as exc:
    state = None
    if driver is not None:
        try:
            state = driver.execute_script("""
              return {
                hash:location.hash,
                heading:document.querySelector('.page-head h1')?.textContent?.trim()||'',
                advanced:Boolean(document.querySelector('.advanced-analytics-hub')),
                loading:document.querySelector('.advanced-analytics-hub')?.dataset?.loading||null,
                metricCount:document.querySelectorAll('.advanced-analytics-hub .ah-metric').length,
                playCount:document.querySelectorAll('.advanced-analytics-hub .ah-play').length,
                text:(document.querySelector('.advanced-analytics-hub')?.innerText||'').slice(0,700),
                width:document.documentElement.clientWidth,
                scrollWidth:document.documentElement.scrollWidth
              };
            """)
        except Exception:
            state = None
    result = {
        'ok': False,
        'base': BASE,
        'stage': stage,
        'error': f'{type(exc).__name__}: {exc}',
        'state': state,
        'durationSeconds': round(time.time() - started, 2),
        'testedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
    }
    write_report(result)
    print(json.dumps(result, indent=2))
    raise
finally:
    if driver is not None:
        driver.quit()
