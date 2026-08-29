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


def media_video_context(driver):
    return driver.execute_async_script("""
      const done=arguments[arguments.length-1];
      fetch('/api/media-videos',{cache:'no-store'}).then(async response=>{
        const body=await response.json().catch(()=>null);
        done({status:response.status,body});
      }).catch(error=>done({status:0,error:String(error),body:null}));
    """)


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
    driver.set_script_timeout(8)

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

    stage = 'desktop:official-video-api'
    youtube = media_video_context(driver)
    body = youtube.get('body') or {}
    if youtube.get('status') != 200 or not body.get('ok'):
        raise RuntimeError(f'Official media API unavailable: {youtube}')
    if body.get('provider') != 'YouTube Data API v3' or body.get('scope') != 'official-embeddable-vod-only' or body.get('liveRightsExcluded') is not True:
        raise RuntimeError(f'Official media API rights contract invalid: {body}')
    videos = body.get('videos') if isinstance(body.get('videos'), list) else []
    playback = {
        'attempted': False,
        'iframeApiScript': False,
        'iframe': False,
        'videoId': '',
        'iframeSrc': '',
    }
    if body.get('configured'):
        if any(not item.get('official') or not item.get('embeddable') or item.get('live') for item in videos):
            raise RuntimeError(f'Official media API returned a non-embeddable/non-official/live row: {videos[:3]}')
        if videos:
            wait_for(driver, "document.querySelector('[data-youtube-official-shelf]')", timeout=12)
            shelf = driver.execute_script("""
              const root=document.querySelector('[data-youtube-official-shelf]');
              return {
                cards:root?.querySelectorAll('[data-youtube-video]').length||0,
                playButtons:[...root?.querySelectorAll('[data-youtube-play]')||[]].map(x=>x.getBoundingClientRect().height),
                iframeCount:root?.querySelectorAll('iframe').length||0,
                iframeApiScripts:document.querySelectorAll('script[data-titans-youtube-iframe-api]').length,
                text:(root?.innerText||'').slice(0,800)
              };
            """)
            if shelf['cards'] < 1 or shelf['iframeCount'] != 0 or shelf['iframeApiScripts'] != 0 or any(height < 44 for height in shelf['playButtons']):
                raise RuntimeError(f'Official video shelf is not lazy/safe before interaction: {shelf}')

            stage = 'desktop:official-video-playback'
            selected_id = driver.execute_script("return document.querySelector('[data-youtube-video]')?.dataset.youtubeVideo || ''")
            if len(selected_id) != 11:
                raise RuntimeError(f'Official video card has invalid YouTube id: {selected_id!r}')
            driver.execute_script("document.querySelector('[data-youtube-play]')?.click()")
            wait_for(driver, "document.querySelector('script[data-titans-youtube-iframe-api]')", timeout=4)
            wait_for(
                driver,
                "document.querySelector('[data-youtube-video] iframe') || document.querySelector('[data-youtube-video] .media-youtube-unavailable')",
                timeout=14,
            )
            playback = driver.execute_script("""
              const card=document.querySelector('[data-youtube-video]');
              const iframe=card?.querySelector('iframe');
              const fallback=card?.querySelector('.media-youtube-unavailable');
              return {
                attempted:true,
                iframeApiScript:Boolean(document.querySelector('script[data-titans-youtube-iframe-api]')),
                iframe:Boolean(iframe),
                videoId:card?.dataset.youtubeVideo||'',
                iframeSrc:iframe?.src||'',
                fallback:Boolean(fallback),
                fallbackText:(fallback?.innerText||'').slice(0,300)
              };
            """)
            if playback.get('fallback'):
                raise RuntimeError(f'Official video fell back instead of creating an IFrame player: {playback}')
            if not playback.get('iframeApiScript') or not playback.get('iframe'):
                raise RuntimeError(f'Official video did not instantiate the YouTube IFrame player after Play: {playback}')
            if playback.get('videoId') != selected_id or f'/embed/{selected_id}' not in playback.get('iframeSrc', ''):
                raise RuntimeError(f'YouTube IFrame does not match the selected official video: {playback}')
            if not playback.get('iframeSrc', '').startswith('https://www.youtube.com/embed/'):
                raise RuntimeError(f'YouTube IFrame used an unexpected origin: {playback}')
    elif driver.execute_script("return Boolean(document.querySelector('[data-youtube-official-shelf]'))"):
        raise RuntimeError('Official video shelf rendered even though YouTube Data API is unconfigured')

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
    if body.get('configured') and videos:
        wait_for(driver, "document.querySelector('[data-youtube-official-shelf]')", timeout=12)
    no_overflow(driver, '390px media')
    mobile = driver.execute_script("""
      return {
        areaButtons:[...document.querySelectorAll('[data-media-area]')].map(x=>({label:x.textContent.trim(),h:x.getBoundingClientRect().height})),
        launchCards:document.querySelectorAll('.media-radio-launch a').length,
        timeRows:document.querySelectorAll('.media-time-row').length,
        page:Boolean(document.querySelector('.media-page')),
        youtubeCards:document.querySelectorAll('[data-youtube-video]').length,
        youtubePlayTargets:[...document.querySelectorAll('[data-youtube-play]')].map(x=>x.getBoundingClientRect().height)
      }
    """)
    if len(mobile['areaButtons']) != 3 or any(x['h'] < 44 for x in mobile['areaButtons']):
        raise RuntimeError(f'Mobile territory controls invalid: {mobile}')
    if mobile['launchCards'] != 2 or mobile['timeRows'] != 4 or not mobile['page']:
        raise RuntimeError(f'Mobile media layout incomplete: {mobile}')
    if body.get('configured') and videos and (mobile['youtubeCards'] < 1 or any(height < 44 for height in mobile['youtubePlayTargets'])):
        raise RuntimeError(f'Mobile official video shelf controls invalid: {mobile}')

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
        'youtube': {
            'configured': bool(body.get('configured')),
            'available': bool(body.get('available')),
            'videos': len(videos),
            'liveRightsExcluded': body.get('liveRightsExcluded') is True,
            'lazyBeforePlay': True,
            'iframeAfterPlay': playback,
        },
        'mobileAreaTargets': mobile['areaButtons'],
        'mobileTimeRows': mobile['timeRows'],
        'mobileYoutubeCards': mobile['youtubeCards'],
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
            result['pageText'] = driver.execute_script("return (document.querySelector('#app')?.innerText||'').slice(0,1200)")
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
