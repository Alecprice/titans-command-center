import json
import os
import sys
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
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


def install_longtask_observer(driver):
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


def assert_no_horizontal_overflow(driver, label):
    state = driver.execute_script("return {width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body?.scrollWidth||0}")
    if state['scrollWidth'] > state['width'] + 3:
        raise RuntimeError(f'Horizontal overflow on {label}: {state}')


def browser_state(driver):
    try:
        return driver.execute_script("""
          const app=document.querySelector('#app');
          const grid=document.querySelector('#rg');
          const rosterButton=document.querySelector('.team-room-switcher [data-team-room-view="roster"]');
          const depthButton=document.querySelector('.team-room-switcher [data-team-room-view="depth"]');
          const staffButton=document.querySelector('.team-room-switcher [data-team-room-view="staff"]');
          return {
            href:location.href,
            hash:location.hash,
            title:document.querySelector('.page-head h1')?.textContent?.trim()||document.title,
            rows:document.querySelectorAll('.transaction-row').length,
            transactionTools:Boolean(document.querySelector('.transaction-tools')),
            marketLoading:app?.dataset?.marketHub||null,
            statsLoading:app?.dataset?.preseasonHub||null,
            teamRoomView:app?.dataset?.teamRoomView||null,
            teamRoomSwitcher:Boolean(document.querySelector('.team-room-switcher')),
            rosterGridExists:Boolean(grid),
            rosterGridHidden:grid?.hidden??null,
            rosterGridDisplay:grid?getComputedStyle(grid).display:null,
            rosterGridChildren:grid?.children?.length??null,
            rosterCardCount:document.querySelectorAll('#rg .player-card').length,
            rosterVisibleCardCount:[...document.querySelectorAll('#rg .player-card')].filter(el=>!el.hidden).length,
            rosterGridPreview:(grid?.innerText||'').slice(0,240),
            rosterPressed:rosterButton?.getAttribute('aria-pressed')||null,
            depthPressed:depthButton?.getAttribute('aria-pressed')||null,
            staffPressed:staffButton?.getAttribute('aria-pressed')||null,
            rosterSearchValue:document.querySelector('#rs')?.value||null,
            rosterUnitValue:document.querySelector('#ru')?.value||null,
            rosterFilterCount:document.querySelector('.roster-status-filters .ux-filter-count')?.textContent?.trim()||null,
            appChildren:app?.children?.length||0,
            appText:(app?.innerText||'').slice(0,500),
            viewport:window.innerWidth,
            scrollWidth:document.documentElement.scrollWidth,
            sidebarOpen:document.querySelector('#sidebar')?.classList.contains('open')||false,
            sidebarInert:Boolean(document.querySelector('#sidebar')?.inert),
            moreExpanded:document.querySelector('#mobile-more-button')?.getAttribute('aria-expanded')||null
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

    stage = 'desktop:load-home'
    driver.get(f'{BASE}/#home')
    stage = 'desktop:wait-home-ready'
    wait_for(driver, "document.readyState === 'complete' && document.querySelector('#app')")
    wait_for(driver, "document.querySelector('.page-head h1') || document.querySelector('.fan-hero')", timeout=10)
    install_longtask_observer(driver)

    sequence = ['#stats', '#transactions', '#markets', '#transactions', '#sources', '#transactions', '#roster', '#transactions']
    transaction_checks = 0
    rounds = 3

    for round_index in range(1, rounds + 1):
        for route in sequence:
            stage = f'desktop:round-{round_index}:navigate:{route}'
            set_route(driver, route)
            if route == '#transactions':
                stage = f'desktop:round-{round_index}:transactions:wait-hash'
                wait_for(driver, "location.hash === '#transactions'")
                stage = f'desktop:round-{round_index}:transactions:wait-heading'
                wait_for(driver, "document.querySelector('.page-head h1')?.textContent.trim() === 'Transactions'")
                stage = f'desktop:round-{round_index}:transactions:wait-content'
                wait_for(driver, "document.querySelector('.transaction-list') || document.querySelector('.panel-body .empty')")
                stage = f'desktop:round-{round_index}:transactions:heartbeat'
                heartbeat = browser_state(driver)
                if heartbeat.get('hash') != '#transactions' or heartbeat.get('title') != 'Transactions':
                    raise RuntimeError(f'Transactions route was overwritten: {heartbeat}')
                if heartbeat.get('rows', 0) < 1:
                    stage = f'desktop:round-{round_index}:transactions:wait-hydration'
                    wait_for(driver, "document.querySelectorAll('.transaction-row').length > 0", timeout=8)
                assert_no_horizontal_overflow(driver, 'desktop Transactions')
                transaction_checks += 1
            else:
                stage = f'desktop:round-{round_index}:leave-fast:{route}'
                time.sleep(0.12)

    desktop_long_tasks = driver.execute_script('return window.__titansLongTasks || []') or []

    stage = 'mobile:resize'
    driver.set_window_size(390, 844)
    driver.get(f'{BASE}/#home')
    stage = 'mobile:wait-home'
    wait_for(driver, "document.readyState === 'complete' && document.querySelector('.fan-hero')")
    wait_for(driver, "getComputedStyle(document.querySelector('.mobile-nav')).display !== 'none'")
    wait_for(driver, "document.querySelector('#sidebar')?.inert === true")
    install_longtask_observer(driver)
    assert_no_horizontal_overflow(driver, 'mobile Home')

    stage = 'mobile:touch-targets'
    mobile_targets = driver.execute_script("""
      return [...document.querySelectorAll('.mobile-nav a,.mobile-nav button')].map(el=>({label:el.textContent.trim(),height:el.getBoundingClientRect().height,width:el.getBoundingClientRect().width}));
    """)
    expected_labels={'Home','Roster','Game','Search','More'}
    if len(mobile_targets) != 5 or {item['label'] for item in mobile_targets} != expected_labels or any(item['height'] < 44 or item['width'] < 44 for item in mobile_targets):
        raise RuntimeError(f'Mobile nav touch targets invalid: {mobile_targets}')

    stage = 'mobile:transactions-from-more'
    driver.execute_script("document.querySelector('#mobile-more-button')?.click()")
    wait_for(driver, "document.querySelector('#sidebar')?.classList.contains('open')")
    driver.execute_script("document.querySelector('#primary-nav a[href=\"#transactions\"]')?.click()")
    wait_for(driver, "location.hash === '#transactions'")
    wait_for(driver, "document.querySelector('.page-head h1')?.textContent.trim() === 'Transactions'")
    wait_for(driver, "document.querySelectorAll('.transaction-row').length > 0", timeout=10)
    wait_for(driver, "document.querySelector('#mobile-more-button')?.classList.contains('active')")
    assert_no_horizontal_overflow(driver, 'mobile Transactions')

    stage = 'mobile:more-open'
    driver.execute_script("document.querySelector('#mobile-more-button')?.click()")
    wait_for(driver, "document.querySelector('#sidebar')?.classList.contains('open')")
    wait_for(driver, "document.querySelector('#sidebar')?.inert === false")
    wait_for(driver, "document.querySelector('#mobile-more-button')?.getAttribute('aria-expanded') === 'true'")

    stage = 'mobile:schedule-from-more'
    driver.execute_script("document.querySelector('#primary-nav a[href=\"#games\"]')?.click()")
    wait_for(driver, "location.hash === '#games'")
    wait_for(driver, "document.querySelector('.page-head h1')?.textContent.trim() === 'Games & Schedule'")
    wait_for(driver, "!document.querySelector('#sidebar')?.classList.contains('open') && document.querySelector('#sidebar')?.inert === true")
    assert_no_horizontal_overflow(driver, 'mobile Schedule')

    stage = 'mobile:more-escape'
    driver.execute_script("document.querySelector('#mobile-more-button')?.click()")
    wait_for(driver, "document.querySelector('#sidebar')?.classList.contains('open')")
    driver.find_element('tag name', 'body').send_keys(Keys.ESCAPE)
    wait_for(driver, "!document.querySelector('#sidebar')?.classList.contains('open') && document.querySelector('#sidebar')?.inert === true")

    stage = 'mobile:stats-then-transactions'
    driver.execute_script("document.querySelector('#mobile-more-button')?.click()")
    wait_for(driver, "document.querySelector('#sidebar')?.classList.contains('open')")
    driver.execute_script("document.querySelector('#primary-nav a[href=\"#stats\"]')?.click()")
    wait_for(driver, "location.hash === '#stats'")
    time.sleep(0.12)
    driver.execute_script("document.querySelector('#mobile-more-button')?.click()")
    wait_for(driver, "document.querySelector('#sidebar')?.classList.contains('open')")
    driver.execute_script("document.querySelector('#primary-nav a[href=\"#transactions\"]')?.click()")
    wait_for(driver, "document.querySelector('.page-head h1')?.textContent.trim() === 'Transactions'")
    wait_for(driver, "document.querySelectorAll('.transaction-row').length > 0", timeout=10)
    assert_no_horizontal_overflow(driver, 'mobile Transactions after Stats')

    stage = 'mobile:search-quick-jump'
    driver.find_element('id', 'mobile-search-button').click()
    search = driver.find_element('id', 'global-search')
    search.clear()
    search.send_keys('transactions')
    wait_for(driver, "document.querySelector('.v111-search-panel') && !document.querySelector('.v111-search-panel').hidden")
    search.send_keys(Keys.ARROW_DOWN)
    search.send_keys(Keys.ENTER)
    wait_for(driver, "location.hash === '#transactions'")
    wait_for(driver, "document.querySelectorAll('.transaction-row').length > 0", timeout=10)
    assert_no_horizontal_overflow(driver, 'mobile Smart Search')

    stage = 'mobile:roster-route'
    driver.execute_script("document.querySelector('.mobile-nav a[href=\"#roster\"]')?.click()")
    wait_for(driver, "location.hash === '#roster'")
    stage = 'mobile:roster-switcher'
    wait_for(driver, "document.querySelector('.team-room-switcher')", timeout=10)
    stage = 'mobile:roster-cards'
    wait_for(driver, "document.querySelectorAll('#rg .player-card').length > 0", timeout=10)
    roster_total = int(driver.execute_script("return document.querySelectorAll('#rg .player-card').length"))
    if roster_total < 1:
        raise RuntimeError('Roster did not load any player cards')
    stage = 'mobile:roster-pressed'
    wait_for(driver, "document.querySelector('.team-room-switcher [data-team-room-view=\"roster\"]')?.getAttribute('aria-pressed') === 'true'")
    assert_no_horizontal_overflow(driver, 'mobile Roster')

    stage = 'mobile:depth-route-state'
    driver.execute_script("document.querySelector('.team-room-switcher [data-team-room-view=\"depth\"]')?.click()")
    wait_for(driver, "document.querySelector('#app')?.dataset.teamRoomView === 'depth'")
    stage = 'mobile:depth-pressed'
    wait_for(driver, "document.querySelector('.team-room-switcher [data-team-room-view=\"depth\"]')?.getAttribute('aria-pressed') === 'true'")
    stage = 'mobile:depth-panel'
    wait_for(driver, "document.querySelector('.team-room-panel[data-panel=\"depth\"]')?.hidden === false")
    stage = 'mobile:depth-grid-hidden'
    wait_for(driver, "document.querySelector('#rg')?.hidden === true && getComputedStyle(document.querySelector('#rg')).display === 'none'")
    assert_no_horizontal_overflow(driver, 'mobile Depth Chart')

    stage = 'mobile:staff-arrow-key'
    depth_button = driver.find_element('css selector', '.team-room-switcher [data-team-room-view="depth"]')
    depth_button.send_keys(Keys.ARROW_RIGHT)
    wait_for(driver, "document.querySelector('#app')?.dataset.teamRoomView === 'staff'")
    wait_for(driver, "document.querySelector('.team-room-switcher [data-team-room-view=\"staff\"]')?.getAttribute('aria-pressed') === 'true'")
    wait_for(driver, "document.querySelector('.team-room-panel[data-panel=\"staff\"]')?.hidden === false")
    assert_no_horizontal_overflow(driver, 'mobile Staff')

    stage = 'mobile:return-roster'
    driver.execute_script("document.querySelector('.team-room-switcher [data-team-room-view=\"roster\"]')?.click()")
    wait_for(driver, "document.querySelector('#app')?.dataset.teamRoomView === 'roster'")
    wait_for(driver, "document.querySelector('#rg')?.hidden === false && getComputedStyle(document.querySelector('#rg')).display !== 'none' && document.querySelectorAll('#rg .player-card').length > 0")
    assert_no_horizontal_overflow(driver, 'mobile Roster restored')

    stage = 'mobile:roster-filter-defense'
    driver.execute_script("""
      const unit=document.querySelector('#ru');
      unit.value='Defense';
      unit.dispatchEvent(new Event('input',{bubbles:true}));
      unit.dispatchEvent(new Event('change',{bubbles:true}));
    """)
    wait_for(driver, f"document.querySelector('#ru')?.value === 'Defense' && document.querySelectorAll('#rg .player-card').length > 0 && document.querySelectorAll('#rg .player-card').length < {roster_total}")
    wait_for(driver, "document.querySelector('[data-roster-clear]')?.disabled === false")

    stage = 'mobile:roster-clear-filters'
    driver.execute_script("document.querySelector('[data-roster-clear]')?.click()")
    wait_for(driver, "document.querySelector('#ru')?.value === 'all'")
    wait_for(driver, f"document.querySelectorAll('#rg .player-card').length === {roster_total}", timeout=10)
    wait_for(driver, "document.querySelector('[data-roster-status=\"all\"]')?.getAttribute('aria-pressed') === 'true'")
    wait_for(driver, f"document.querySelector('.roster-status-filters .ux-filter-count')?.textContent.includes('{roster_total} of {roster_total}')")
    assert_no_horizontal_overflow(driver, 'mobile Roster filters cleared')

    stage = 'small-phone:320'
    driver.set_window_size(320, 760)
    driver.get(f'{BASE}/#home')
    wait_for(driver, "document.readyState === 'complete' && document.querySelector('.fan-hero')")
    assert_no_horizontal_overflow(driver, '320px Home')
    driver.execute_script("document.querySelector('#mobile-more-button')?.click()")
    wait_for(driver, "document.querySelector('#sidebar')?.classList.contains('open')")
    driver.execute_script("document.querySelector('#primary-nav a[href=\"#transactions\"]')?.click()")
    wait_for(driver, "document.querySelectorAll('.transaction-row').length > 0", timeout=10)
    assert_no_horizontal_overflow(driver, '320px Transactions')

    mobile_long_tasks = driver.execute_script('return window.__titansLongTasks || []') or []
    all_long_tasks = desktop_long_tasks + mobile_long_tasks
    max_long_task = max(all_long_tasks) if all_long_tasks else 0
    severe_long_tasks = [x for x in all_long_tasks if x >= 1500]
    if severe_long_tasks:
        raise RuntimeError(f'Severe browser long task detected: max={max_long_task:.1f}ms')

    stage = 'read-console'
    console = []
    try:
        console = [entry for entry in driver.get_log('browser') if entry.get('level') in ('SEVERE', 'WARNING')]
    except Exception:
        pass
    severe_console = [entry for entry in console if entry.get('level') == 'SEVERE']
    if severe_console:
        raise RuntimeError(f'Browser console has severe errors: {severe_console[:3]}')

    result = {
        'ok': True,
        'base': BASE,
        'desktopRounds': rounds,
        'transactionChecks': transaction_checks,
        'mobileChecks': 14,
        'smallPhoneChecks': 2,
        'smartSearchQuickJump': True,
        'mobileDrawerInert': True,
        'fiveActionDock': True,
        'teamRoomChecks': 4,
        'rosterFilterReset': True,
        'rosterTotal': roster_total,
        'mobileTargets': mobile_targets,
        'maxLongTaskMs': round(max_long_task, 1),
        'longTasksOver250ms': len([x for x in all_long_tasks if x >= 250]),
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