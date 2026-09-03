import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

BASE = os.environ.get('WORKER_URL', 'https://titans.alecjprice.com').rstrip('/')
REPORT = Path('/tmp/media-radio-search-browser-smoke.json')


def wait_for(driver, predicate, timeout=12):
    return WebDriverWait(driver, timeout, poll_frequency=0.1).until(
        lambda d: d.execute_script(f'return Boolean({predicate})')
    )


def load_search(driver, query):
    driver.get(f'{BASE}/#search?q={query}')
    wait_for(
        driver,
        "location.hash.startsWith('#search?q=') && document.querySelector('.search-route-links')",
    )


options = webdriver.ChromeOptions()
options.add_argument('--headless=new')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=390,844')

driver = None
stage = 'starting'
started = time.time()
try:
    driver = webdriver.Chrome(options=options)
    driver.set_page_load_timeout(20)

    stage = 'false-positive:week-1'
    load_search(driver, 'week%201')
    time.sleep(0.35)
    if driver.execute_script("return Boolean(document.querySelector('[data-media-search-link]'))"):
        raise RuntimeError('Normal schedule query "week 1" incorrectly surfaced the radio/media search bridge')

    stage = 'lowercase-callsign:search'
    load_search(driver, 'wikq')
    wait_for(driver, "document.querySelector('[data-media-search-link]')")
    link = driver.execute_script("""
      const a=document.querySelector('[data-media-search-link]');
      return {raw:a?.getAttribute('href')||'',text:(a?.innerText||'').trim()};
    """)
    if link['raw'] != '#media?affiliate=WIKQ':
        raise RuntimeError(f'Lowercase WIKQ search did not normalize to the expected Media handoff: {link}')

    stage = 'lowercase-callsign:handoff'
    driver.execute_script("document.querySelector('[data-media-search-link]')?.click()")
    wait_for(driver, "document.querySelector('.media-affiliate-finder[data-affiliate-finder=\"2026\"]')")
    wait_for(driver, "document.querySelector('[data-affiliate-search-input]')?.value === 'WIKQ'")
    wait_for(driver, "location.hash === '#media'")
    wait_for(
        driver,
        "document.activeElement === document.querySelector('.media-affiliate-finder > summary')",
        timeout=6,
    )
    wait_for(driver, "document.querySelector('.media-affiliate-finder')?.getBoundingClientRect().top < innerHeight")

    stage = 'lowercase-callsign:result'
    state = driver.execute_script("""
      const details=document.querySelector('.media-affiliate-finder');
      const input=details?.querySelector('[data-affiliate-search-input]');
      const summary=details?.querySelector('summary');
      const visible=[...details?.querySelectorAll('[data-affiliate-station]:not([hidden])')||[]];
      const rect=details?.getBoundingClientRect();
      return {
        hash:location.hash,
        open:Boolean(details?.open),
        inputValue:input?.value||'',
        inputFocused:document.activeElement===input,
        summaryFocused:document.activeElement===summary,
        searchHandoff:details?.dataset.searchHandoff||'',
        visibleStations:visible.length,
        visibleText:visible.map(card=>(card.innerText||'').replace(/\s+/g,' ').trim()),
        inViewport:Boolean(rect && rect.top < innerHeight && rect.bottom > 0),
        clientWidth:document.documentElement.clientWidth,
        scrollWidth:document.documentElement.scrollWidth,
      };
    """)
    if state['hash'] != '#media' or not state['open'] or state['inputValue'] != 'WIKQ':
        raise RuntimeError(f'Affiliate handoff was not applied and consumed correctly: {state}')
    if state['inputFocused'] or not state['summaryFocused'] or not state['inViewport']:
        raise RuntimeError(f'Affiliate destination focus/scroll behavior is invalid: {state}')
    if state['searchHandoff'] != 'WIKQ' or state['visibleStations'] != 1 or 'WIKQ' not in ' '.join(state['visibleText']):
        raise RuntimeError(f'Filtered WIKQ affiliate result is not uniquely visible: {state}')
    if state['scrollWidth'] > state['clientWidth'] + 3:
        raise RuntimeError(f'Mobile radio-search handoff introduced horizontal overflow: {state}')

    result = {
        'ok': True,
        'base': BASE,
        'falsePositiveWeekOne': False,
        'searchLink': link,
        'handoff': state,
        'durationSeconds': round(time.time() - started, 2),
        'testedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
    }
    REPORT.write_text(json.dumps(result, indent=2), encoding='utf-8')
    print(json.dumps(result, indent=2))
except Exception as exc:
    payload = {
        'ok': False,
        'stage': stage,
        'error': str(exc),
        'base': BASE,
        'durationSeconds': round(time.time() - started, 2),
    }
    REPORT.write_text(json.dumps(payload, indent=2), encoding='utf-8')
    print(json.dumps(payload, indent=2))
    raise
finally:
    if driver is not None:
        driver.quit()
