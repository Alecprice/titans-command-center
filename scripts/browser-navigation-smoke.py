import json
import os
import sys
import time
from pathlib import Path

from selenium import webdriver
from selenium.common.exceptions import TimeoutException, WebDriverException
from selenium.webdriver.support.ui import WebDriverWait

BASE = os.environ.get('WORKER_URL', 'https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT = Path('/tmp/browser-nav-smoke.json')


def write_report(payload):
    REPORT.write_text(json.dumps(payload, indent=2), encoding='utf-8')


def wait_for(driver, predicate, timeout=8):
    return WebDriverWait(driver, timeout, poll_frequency=0.1).until(lambda d: d.execute_script(f'return Boolean({predicate})'))


def set_route(driver, route, settle=0.08):
    driver.execute_script('location.hash = arguments[0]', route)
    time.sleep(settle)


def browser_state(driver):
    try:
        return driver.execute_script("""
          const app=document.querySelector('#app');
          return {
            href:location.href,
            hash:location.hash,
            title:document.querySelector('.page-head h1')?.textContent?.trim()||document.title,
            rows:document.querySelectorAll('.transaction-row').length,
            transactionTools:Boolean(document.querySelector('.transaction-tools')),
            marketLoading:app?.dataset?.marketHub||null,
            statsLoading:app?.dataset?.preseasonHub||null,
            appChildren:app?.children?.length||0,
            appText:(app?.innerText||'').slice(0,500)
          };
        """)
    except Exception as exc:
        return {'stateReadError': f'{type(exc).__name__}: {exc}'}


options = webdriver.ChromeOptions()
options.add_argument('--headless=new')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1440,1000')
options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})

driver = None
started = time.time()
stage = 'starting'
try:
    stage = 'launch-chrome'
    driver = webdriver.Chrome(options=options)
    driver.set_page_load_timeout(20)
    driver.set_script_timeout(4)

    stage = 'load-home'
    driver.get(f'{BASE}/#home')
    stage = 'wait-home-ready'
    wait_for(driver, "document.readyState === 'complete' && document.querySelector('#app')")
    wait_for(driver, "document.querySelector('.page-head h1') || document.querySelector('.fan-hero')", timeout=10)

    stage = 'install-longtask-observer'
    driver.execute_script("""
      window.__titansLongTasks = [];
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver(list => {
            for (const entry of list.getEntries()) window.__titansLongTasks.push(entry.duration);
          });
          observer.observe({entryTypes:['longtask']});
          window.__titansLongTaskObserver = observer;
        } catch {}
      }
    """)

    sequence = ['#stats', '#transactions', '#markets', '#transactions', '#sources', '#transactions', '#roster', '#transactions']
    transaction_checks = 0
    rounds = 3

    for round_index in range(1, rounds + 1):
        for route in sequence:
            stage = f'round-{round_index}:navigate:{route}'
            set_route(driver, route)
            if route == '#transactions':
                stage = f'round-{round_index}:transactions:wait-hash'
                wait_for(driver, "location.hash === '#transactions'")
                stage = f'round-{round_index}:transactions:wait-heading'
                wait_for(driver, "document.querySelector('.page-head h1')?.textContent.trim() === 'Transactions'")
                stage = f'round-{round_index}:transactions:wait-content'
                wait_for(driver, "document.querySelector('.transaction-list') || document.querySelector('.panel-body .empty')")
                stage = f'round-{round_index}:transactions:heartbeat'
                heartbeat = browser_state(driver)
                if heartbeat.get('hash') != '#transactions' or heartbeat.get('title') != 'Transactions':
                    raise RuntimeError(f'Transactions route was overwritten: {heartbeat}')
                if heartbeat.get('rows', 0) < 1:
                    stage = f'round-{round_index}:transactions:wait-hydration'
                    wait_for(driver, "document.querySelectorAll('.transaction-row').length > 0", timeout=8)
                transaction_checks += 1
            else:
                stage = f'round-{round_index}:leave-fast:{route}'
                time.sleep(0.12)

    stage = 'read-longtasks'
    long_tasks = driver.execute_script('return window.__titansLongTasks || []') or []
    max_long_task = max(long_tasks) if long_tasks else 0
    severe_long_tasks = [x for x in long_tasks if x >= 1500]
    if severe_long_tasks:
        raise RuntimeError(f'Severe browser long task detected: max={max_long_task:.1f}ms')

    stage = 'read-console'
    console = []
    try:
        console = [entry for entry in driver.get_log('browser') if entry.get('level') in ('SEVERE', 'WARNING')]
    except Exception:
        pass

    result = {
        'ok': True,
        'base': BASE,
        'rounds': rounds,
        'transactionChecks': transaction_checks,
        'maxLongTaskMs': round(max_long_task, 1),
        'longTasksOver250ms': len([x for x in long_tasks if x >= 250]),
        'browserWarnings': console[:20],
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
        'state': browser_state(driver) if driver is not None else None,
        'durationSeconds': round(time.time() - started, 2),
        'testedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
    }
    try:
        if driver is not None:
            result['browserWarnings'] = [entry for entry in driver.get_log('browser') if entry.get('level') in ('SEVERE', 'WARNING')][:20]
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
