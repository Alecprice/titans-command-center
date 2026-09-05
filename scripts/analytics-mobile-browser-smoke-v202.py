import json
import os
import time
from pathlib import Path
from urllib.request import Request, urlopen

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

BASE = os.environ.get('WORKER_URL', 'https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT = Path('/tmp/analytics-mobile-browser-smoke-v202.json')


def read_analytics():
    req = Request(
        f'{BASE}/api/advanced-analytics?season=2026&team=TEN&audit={int(time.time() * 1000)}',
        headers={
            'User-Agent': 'TitansCommandCenter-AnalyticsMobileAudit/2.0.2',
            'Cache-Control': 'no-cache, no-store',
            'Accept': 'application/json',
        },
    )
    with urlopen(req, timeout=10) as response:
        if response.status != 200:
            raise RuntimeError(f'Advanced analytics API returned {response.status}')
        return json.loads(response.read().decode('utf-8'))


def wait_for(driver, predicate, timeout=18):
    return WebDriverWait(driver, timeout, poll_frequency=0.1).until(
        lambda d: d.execute_script(f'return Boolean({predicate})')
    )


def set_mobile_viewport(driver, width=390, height=844):
    driver.execute_cdp_cmd(
        'Emulation.setDeviceMetricsOverride',
        {
            'width': width,
            'height': height,
            'deviceScaleFactor': 1,
            'mobile': True,
        },
    )
    state = driver.execute_script(
        "return {innerWidth,innerHeight,clientWidth:document.documentElement.clientWidth,mobile:matchMedia('(max-width:759px)').matches}"
    )
    if (
        state['innerWidth'] != width
        or state['innerHeight'] != height
        or state['clientWidth'] != width
        or not state['mobile']
    ):
        raise RuntimeError(f'Analytics mobile viewport override did not take effect: {state}')
    return state


def assert_no_overflow(driver):
    state = driver.execute_script(
        "return {clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth}"
    )
    if state['scrollWidth'] > state['clientWidth'] + 3:
        raise RuntimeError(f'Mobile Advanced Stats Lab overflowed horizontally: {state}')


def severe_logs(driver):
    return [
        entry
        for entry in driver.get_log('browser')
        if entry.get('level') == 'SEVERE' and '500' not in entry.get('message', '')
    ]


started = time.time()
driver = None
stage = 'starting'
try:
    stage = 'analytics-api'
    analytics = read_analytics()
    available = analytics.get('ok') is True and analytics.get('status') == 'available'
    unavailable = (
        analytics.get('ok') is False
        and analytics.get('available') is False
        and analytics.get('status') == 'database-unavailable'
        and analytics.get('summary') is None
    )
    if not available and not unavailable:
        raise RuntimeError(f'Analytics API returned an unsupported truth state: {analytics}')
    if available and analytics.get('storage') != 'cloudflare-d1':
        raise RuntimeError(f'Available analytics is not D1-backed: {analytics.get("storage") or "missing"}')

    stage = 'launch-chrome'
    options = webdriver.ChromeOptions()
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1440,1100')
    options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})
    driver = webdriver.Chrome(options=options)
    driver.set_page_load_timeout(25)
    driver.set_script_timeout(5)

    stage = 'mobile-viewport'
    viewport = set_mobile_viewport(driver, 390, 844)
    driver.get(f'{BASE}/#stats')
    wait_for(driver, "document.readyState === 'complete' && location.hash === '#stats'")
    wait_for(driver, "document.querySelector('.preseason-stats-hub')", timeout=15)

    if available:
        stage = 'mobile-available'
        wait_for(driver, "document.querySelector('.advanced-analytics-hub .ah-metrics')")
        wait_for(driver, "document.querySelectorAll('.advanced-analytics-hub .ah-metric').length === 4")
        wait_for(driver, "document.querySelectorAll('.advanced-analytics-hub .ah-play').length > 0")
        state = driver.execute_script(r"""
          const root=document.querySelector('.advanced-analytics-hub');
          const banner=root?.querySelector('.ah-season-context');
          return {
            mode:'available',
            viewport:{width:innerWidth,height:innerHeight,clientWidth:document.documentElement.clientWidth},
            metricCount:root?.querySelectorAll('.ah-metric').length||0,
            playCount:root?.querySelectorAll('.ah-play').length||0,
            requestedSeason:root?.dataset?.requestedSeason||'',
            dataSeason:root?.dataset?.dataSeason||'',
            seasonFallback:root?.dataset?.seasonFallback||'',
            bannerVisible:Boolean(banner&&banner.getBoundingClientRect().width>0&&banner.getBoundingClientRect().height>0),
            bannerText:(banner?.textContent||'').replace(/\s+/g,' ').trim()
          };
        """)
        if state['metricCount'] != 4 or state['playCount'] < 1:
            raise RuntimeError(f'Mobile Advanced Stats Lab did not render required analytics: {state}')
        if state['seasonFallback'] == 'true' and (
            not state['bannerVisible'] or not state['dataSeason'] or state['dataSeason'] not in state['bannerText']
        ):
            raise RuntimeError(f'Mobile analytics fallback context is missing: {state}')
    else:
        stage = 'mobile-unavailable'
        wait_for(driver, "document.querySelector('.advanced-analytics-hub .ah-error')")
        state = driver.execute_script(r"""
          const root=document.querySelector('.advanced-analytics-hub');
          const retry=root?.querySelector('#ah-retry');
          return {
            mode:'database-unavailable',
            viewport:{width:innerWidth,height:innerHeight,clientWidth:document.documentElement.clientWidth},
            text:(root?.querySelector('.ah-error')?.textContent||'').replace(/\s+/g,' ').trim(),
            retryHeight:retry?.getBoundingClientRect().height||0,
            metricCount:root?.querySelectorAll('.ah-metric').length||0,
            coreStats:Boolean(document.querySelector('.preseason-stats-hub .ps-summary'))
          };
        """)
        if 'Advanced analytics could not load.' not in state['text'] or 'Advanced analytics query failed' not in state['text']:
            raise RuntimeError(f'Mobile degraded analytics state is not explicit: {state}')
        if state['retryHeight'] < 44 or state['metricCount'] != 0 or not state['coreStats']:
            raise RuntimeError(f'Mobile degraded analytics is not usable: {state}')

    if state['viewport']['width'] != 390 or state['viewport']['height'] != 844 or state['viewport']['clientWidth'] != 390:
        raise RuntimeError(f'Advanced Stats Lab did not render at the pinned mobile viewport: {state}')
    assert_no_overflow(driver)

    stage = 'console'
    warnings = severe_logs(driver)
    if warnings:
        raise RuntimeError(f'Advanced Stats Lab mobile browser has severe errors: {warnings[:3]}')

    result = {
        'ok': True,
        'base': BASE,
        'apiMode': 'cloudflare-d1' if available else 'database-unavailable',
        'viewport': viewport,
        'state': state,
        'browserWarnings': warnings,
        'durationSeconds': round(time.time() - started, 2),
        'testedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
    }
    REPORT.write_text(json.dumps(result, indent=2), encoding='utf-8')
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
    REPORT.write_text(json.dumps(result, indent=2), encoding='utf-8')
    print(json.dumps(result, indent=2))
    raise
finally:
    if driver is not None:
        driver.quit()
