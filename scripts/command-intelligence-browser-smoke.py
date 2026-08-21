import json
import os
import sys
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

BASE = os.environ.get('WORKER_URL', 'https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT = Path('/tmp/command-intelligence-browser-smoke.json')


def wait_for(driver, predicate, timeout=12):
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
    driver.set_script_timeout(6)

    stage = 'desktop:command'
    driver.get(f'{BASE}/#command')
    wait_for(driver, "document.querySelector('.v15-command') && document.querySelectorAll('[data-v15-tab]').length === 7")
    no_overflow(driver, 'desktop command')

    tab_expectations = {
        'changes': 'Titans Change Engine',
        'press': 'Press Room',
        'scheme': 'Scheme Lab',
        'global': 'Be a Titans fan anywhere',
        'stadium': 'Stadium Transition Center',
        'gm': 'Fan GM',
        'history': 'Your franchise timeline',
    }
    addon_expectations = {
        'changes': 'ONE-MINUTE TITANS',
        'scheme': 'Play Explainer',
        'global': 'SMART ALERTS',
        'gm': 'FRONT OFFICE SANDBOX',
    }
    visited = []
    addons_verified = []
    for tab, expected in tab_expectations.items():
        stage = f'desktop:tab:{tab}'
        driver.execute_script("document.querySelector(`[data-v15-tab=\"${arguments[0]}\"]`)?.click()", tab)
        wait_for(driver, f"document.querySelector('[data-v15-tab=\"{tab}\"]')?.getAttribute('aria-selected') === 'true'")
        wait_for(driver, f"(document.querySelector('.v15-pane')?.innerText || '').includes({json.dumps(expected)})")
        addon = addon_expectations.get(tab)
        if addon:
            wait_for(driver, f"(document.querySelector('.v15-addon-root')?.innerText || '').includes({json.dumps(addon)})")
            addons_verified.append(tab)
        if driver.execute_script("return location.hash") != '#command':
            raise RuntimeError(f'Command tab changed route unexpectedly: {tab}')
        no_overflow(driver, f'desktop {tab}')
        visited.append(tab)

    stage = 'desktop:spoiler'
    driver.execute_script("document.querySelector('[data-v15-tab=\"global\"]')?.click()")
    wait_for(driver, "document.querySelector('[data-v15-spoiler]')")
    prior = driver.execute_script("return document.body.classList.contains('v15-spoiler-free')")
    driver.execute_script("document.querySelector('[data-v15-spoiler]')?.click()")
    wait_for(driver, f"document.body.classList.contains('v15-spoiler-free') === {str(not prior).lower()}")
    spoiler_toggled = True

    stage = 'desktop:media-lifecycle'
    driver.execute_script("history.pushState(null,'','#media'); window.dispatchEvent(new PopStateEvent('popstate'))")
    wait_for(driver, "document.querySelector('.media-page') && document.querySelector('.media-tune-guide')", timeout=14)
    media_guide_after_pushstate = True

    stage = 'mobile:command'
    driver.set_window_size(390, 844)
    driver.get(f'{BASE}/#command')
    wait_for(driver, "document.querySelector('.v15-command') && document.querySelectorAll('[data-v15-tab]').length === 7", timeout=14)
    wait_for(driver, "(document.querySelector('.v15-addon-root')?.innerText || '').includes('ONE-MINUTE TITANS')", timeout=14)
    no_overflow(driver, '390px command')
    mobile = driver.execute_script("""
      return {
        tabTargets:[...document.querySelectorAll('[data-v15-tab]')].map(x=>({label:x.textContent.trim(),h:x.getBoundingClientRect().height})),
        command:Boolean(document.querySelector('.v15-command')),
        hero:Boolean(document.querySelector('.v15-hero')),
        nav:Boolean(document.querySelector('a[data-route="command"]')),
        addons:Boolean(document.querySelector('.v15-addon-root')),
        gridWidth:document.querySelector('.v15-command')?.getBoundingClientRect().width || 0,
        viewport:document.documentElement.clientWidth
      }
    """)
    if len(mobile['tabTargets']) != 7 or any(x['h'] < 44 for x in mobile['tabTargets']):
        raise RuntimeError(f'Mobile Command tabs invalid: {mobile}')
    if not mobile['command'] or not mobile['hero'] or not mobile['nav'] or not mobile['addons']:
        raise RuntimeError(f'Mobile Command shell incomplete: {mobile}')

    stage = 'console'
    warnings = []
    try:
        warnings = [x for x in driver.get_log('browser') if x.get('level') in ('SEVERE', 'WARNING')]
    except Exception:
        pass
    severe = [x for x in warnings if x.get('level') == 'SEVERE']
    if severe:
        raise RuntimeError(f'Command Intelligence browser console has severe errors: {severe[:4]}')

    result = {
        'ok': True,
        'base': BASE,
        'tabsVisited': visited,
        'addonsVerified': addons_verified,
        'spoilerToggle': spoiler_toggled,
        'mediaTuneGuideAfterPushState': media_guide_after_pushstate,
        'mobileTabTargets': mobile['tabTargets'],
        'mobileViewport': mobile['viewport'],
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
            result['pageText'] = driver.execute_script("return (document.querySelector('#app')?.innerText||'').slice(0,1600)")
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
