import json
import os
import time
from pathlib import Path
from urllib.parse import parse_qs

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans.alecjprice.com').rstrip('/')
OUT=Path('/tmp/legacy-browser-smoke.json')
PASSPORT_KEY='titans:legacy-passport-v1'
MY_MUSEUM_KEY='titans:legacy-my-museum-v1'


def driver_for(width=1280,height=900):
    options=Options();options.add_argument('--headless=new');options.add_argument('--no-sandbox');options.add_argument('--disable-dev-shm-usage');options.add_argument(f'--window-size={width},{height}');options.set_capability('goog:loggingPrefs',{'browser':'ALL'})
    driver=webdriver.Chrome(options=options)
    driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':False})
    actual=driver.execute_script('return [innerWidth,innerHeight]')
    if actual[0]!=width or actual[1]!=height:
        driver.quit();raise RuntimeError(f'Legacy smoke viewport mismatch: requested={width}x{height} actual={actual}')
    return driver


def prepare_returning_user(driver,clear_passport=False,clear_museum=False):
    driver.execute_script("""
      localStorage.setItem('titans:v10Onboarded','1');
      document.querySelector('#v10-onboarding [data-v10-close]')?.click();
    """)
    if clear_passport: driver.execute_script("localStorage.removeItem(arguments[0])",PASSPORT_KEY)
    if clear_museum: driver.execute_script("localStorage.removeItem(arguments[0])",MY_MUSEUM_KEY)
    WebDriverWait(driver,5,poll_frequency=.1).until(lambda d:not d.find_elements(By.CSS_SELECTOR,'#v10-onboarding'))


def severe_logs(driver):
    return [r.get('message','') for r in driver.get_log('browser') if r.get('level')=='SEVERE' and 'favicon' not in r.get('message','').lower()]


def wait_for(driver,script,timeout=15):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script(script))


def hash_params(driver):
    raw=driver.execute_script('return location.hash') or ''
    query=raw.split('?',1)[1] if '?' in raw else ''
    return raw,parse_qs(query)


def passport_state(driver):
    raw=driver.execute_script("return localStorage.getItem(arguments[0])",PASSPORT_KEY)
    return json.loads(raw) if raw else {'visited':[],'last':None}


def museum_state(driver):
    raw=driver.execute_script("return localStorage.getItem(arguments[0])",MY_MUSEUM_KEY)
    return json.loads(raw) if raw else {'version':1,'keys':[]}


def legacy_ready(driver):
    return wait_for(driver,"""const p=document.querySelector('.legacy-page[data-legacy-finder-ready="true"][data-legacy-trails-ready="true"][data-legacy-passport-ready="true"][data-legacy-exhibit-links-ready="true"][data-legacy-my-museum-ready="true"]');return p&&document.querySelector('[data-legacy-trails]')&&document.querySelector('[data-legacy-passport]')&&document.querySelector('[data-legacy-my-museum]')&&document.querySelector('#legacy-finder-input');""",20)


def geometry(driver):
    return driver.execute_script("""
      const root=document.documentElement;
      const trail=document.querySelector('[data-legacy-trails]');
      const cards=[...document.querySelectorAll('[data-legacy-trail]')];
      const actions=[...document.querySelectorAll('[data-legacy-trail-player] button:not(:disabled),.legacy-passport-actions button,.legacy-exhibit-focus [data-legacy-exhibit-share],.legacy-exhibit-focus [data-legacy-exhibit-save],.legacy-exhibit-clear:not([hidden]),.legacy-my-museum button')];
      const r=trail?.getBoundingClientRect();
      return {
        viewport:innerWidth,
        viewportHeight:innerHeight,
        scrollWidth:root.scrollWidth,
        overflow:root.scrollWidth>innerWidth+1,
        trailRect:r?{left:r.left,right:r.right,width:r.width}:null,
        cards:cards.map(x=>{const b=x.getBoundingClientRect();return {w:b.width,h:b.height}}),
        actions:actions.map(x=>{const b=x.getBoundingClientRect();return {w:b.width,h:b.height,text:x.textContent.trim()}}),
      };
    """)


result={'ok':False,'base':BASE,'stage':'starting','desktop':{},'mobile':{},'browserWarnings':[]};start=time.time();d=None;m=None
try:
    result['stage']='desktop:launch'
    d=driver_for()
    d.get(f'{BASE}/#legacy');prepare_returning_user(d,clear_passport=True,clear_museum=True);legacy_ready(d)

    result['stage']='desktop:inventory'
    inventory=d.execute_script("""return {trails:document.querySelectorAll('[data-legacy-trail]').length,indexed:document.querySelectorAll('[data-legacy-finder-item="true"]').length,heritage:document.querySelectorAll('.legacy-venue-card,.legacy-honor-card').length,exhibits:document.querySelectorAll('[data-legacy-exhibit-key]').length,passport:(document.querySelector('[data-legacy-passport]')?.innerText||''),museum:(document.querySelector('[data-legacy-my-museum]')?.innerText||'')};""")
    if inventory['trails']<5 or inventory['indexed']<20 or inventory['heritage']<20 or inventory['exhibits']<40: raise RuntimeError(f'Legacy inventory incomplete: {inventory}')
    if '0 / 19 stamps' not in inventory['passport'].casefold(): raise RuntimeError(f'Fresh Passport count incorrect: {inventory}')
    museum_text=inventory['museum'].casefold()
    if '0 / 12 saved' not in museum_text or 'start your shelf' not in museum_text: raise RuntimeError(f'Fresh My Museum state incorrect: {inventory}')

    result['stage']='desktop:trail-start'
    d.find_element(By.CSS_SELECTOR,'[data-legacy-trail="1999-run"]').click()
    wait_for(d,"return location.hash.includes('trail=1999-run')&&document.querySelector('[data-legacy-trail-player]:not([hidden])')&&document.querySelectorAll('.legacy-finder-match').length>0")
    raw,params=hash_params(d)
    if params.get('trail',[''])[0]!='1999-run' or params.get('step',[''])[0]!='0':raise RuntimeError(f'Trail state incorrect after start: {raw}')
    if params.get('scope',[''])[0]!='story':raise RuntimeError(f'Finder scope not coordinated with trail: {raw}')

    result['stage']='desktop:trail-next'
    d.find_element(By.CSS_SELECTOR,'[data-legacy-trail-next]').click()
    wait_for(d,"return location.hash.includes('step=1')&&location.hash.includes('scope=moments')&&document.querySelector('.legacy-moment-card.legacy-finder-match')")
    raw2,params2=hash_params(d)
    if 'Music City Miracle' not in params2.get('q',[''])[0]:raise RuntimeError(f'Trail did not advance to miracle stop: {raw2}')
    passport_after_two=passport_state(d)
    if passport_after_two.get('visited')!=['1999-run:0','1999-run:1'] or passport_after_two.get('last')!={'trail':'1999-run','step':1}:raise RuntimeError(f'Passport did not record guided stops exactly: {passport_after_two}')

    result['stage']='desktop:passport-return'
    d.find_element(By.CSS_SELECTOR,'[data-legacy-trail-exit]').click()
    wait_for(d,"return !location.hash.includes('trail=')&&!document.querySelector('[data-legacy-trail-player]:not([hidden])')")
    d.get(f'{BASE}/#legacy');prepare_returning_user(d);legacy_ready(d)
    passport_text=wait_for(d,"return document.querySelector('[data-legacy-passport]')?.innerText||''")
    passport_folded=passport_text.casefold()
    if '2 / 19 stamps' not in passport_folded or 'continue the super bowl run' not in passport_folded:raise RuntimeError(f'Passport return state missing: {passport_text}')
    d.find_element(By.CSS_SELECTOR,'[data-legacy-passport-continue]').click()
    resume=wait_for(d,"""if(!location.hash.includes('trail=1999-run')||!location.hash.includes('step=2')||!document.querySelector('[data-legacy-trail-player]:not([hidden])'))return null;const match=[...document.querySelectorAll('.legacy-finder-match')].find(x=>x.textContent.includes('Steve McNair'));return match?{text:match.textContent.trim(),hash:location.hash}:null""")
    if 'Steve McNair' not in resume.get('text',''):raise RuntimeError(f'Passport resume did not surface Steve McNair: {resume}')
    resume_hash=d.execute_script('return location.hash')
    passport_after_resume=passport_state(d)
    if passport_after_resume.get('visited')!=['1999-run:0','1999-run:1','1999-run:2']:raise RuntimeError(f'Passport resume stamped wrong stop set: {passport_after_resume}')

    result['stage']='desktop:manual-finder'
    d.find_element(By.CSS_SELECTOR,'[data-legacy-trail-exit]').click()
    wait_for(d,"return !location.hash.includes('trail=')&&!document.querySelector('[data-legacy-trail-player]:not([hidden])')")
    before_manual=passport_state(d)
    input_el=d.find_element(By.ID,'legacy-finder-input');input_el.clear();input_el.send_keys('Mike Keith')
    d.find_element(By.CSS_SELECTOR,'[data-legacy-finder-scope="heritage"]').click()
    matched=wait_for(d,"return [...document.querySelectorAll('.legacy-honor-card.legacy-finder-match')].map(x=>x.textContent.trim())")
    if not any('Mike Keith' in text for text in matched):raise RuntimeError(f'Finder did not isolate Mike Keith: {matched}')
    raw3,params3=hash_params(d)
    if 'trail' in params3 or 'exhibit' in params3 or params3.get('scope',[''])[0]!='heritage':raise RuntimeError(f'Manual Finder did not own route state: {raw3}')
    after_manual=passport_state(d)
    if after_manual!=before_manual:raise RuntimeError(f'Manual Finder changed Passport progress: before={before_manual} after={after_manual}')

    result['stage']='desktop:my-museum-save'
    save_button=d.find_element(By.CSS_SELECTOR,'.legacy-honor-card.legacy-finder-match [data-legacy-exhibit-save="honor-mike-keith"]')
    if not save_button.is_displayed():raise RuntimeError('Mike Keith save action is not visible for the Finder match')
    save_button.click()
    saved_card=wait_for(d,"""const card=document.querySelector('[data-legacy-my-museum-item="honor-mike-keith"]');const save=document.querySelector('[data-legacy-exhibit-save="honor-mike-keith"]');return card?{text:card.innerText,pressed:save?.getAttribute('aria-pressed'),count:document.querySelector('[data-legacy-my-museum-count]')?.textContent||''}:null;""")
    saved_state=museum_state(d)
    if saved_state.get('version')!=1 or saved_state.get('keys')!=['honor-mike-keith']:raise RuntimeError(f'My Museum stored wrong bounded identity: {saved_state}')
    if saved_card.get('pressed')!='true' or 'mike keith' not in saved_card.get('text','').casefold() or '1 / 12 saved' not in saved_card.get('count','').casefold():raise RuntimeError(f'My Museum UI did not reflect save: {saved_card}')
    if passport_state(d)!=before_manual:raise RuntimeError('Saving an exhibit changed Museum Passport progress')
    if d.execute_script('return location.hash')!=raw3:raise RuntimeError('Saving an exhibit mutated the active Finder URL')

    result['stage']='desktop:exhibit-share'
    d.execute_script("""Object.defineProperty(navigator,'share',{configurable:true,value:async payload=>{window.__legacySharePayload=payload;}});""")
    share_button=d.find_element(By.CSS_SELECTOR,'.legacy-honor-card.legacy-finder-match [data-legacy-exhibit-share="honor-mike-keith"]')
    if not share_button.is_displayed():raise RuntimeError('Mike Keith exact-share action is not visible for the Finder match')
    share_button.click()
    share_payload=wait_for(d,"return window.__legacySharePayload||null")
    if 'Mike Keith' not in share_payload.get('title','') or 'exhibit=honor-mike-keith' not in share_payload.get('url',''):raise RuntimeError(f'Exact exhibit share payload incorrect: {share_payload}')
    if passport_state(d)!=before_manual:raise RuntimeError('Sharing an exhibit changed Museum Passport progress')
    if museum_state(d)!=saved_state:raise RuntimeError('Sharing an exhibit changed My Museum state')
    if d.execute_script('return location.hash')!=raw3:raise RuntimeError('Sharing an exhibit mutated the active Finder URL')

    result['stage']='desktop:exhibit-deeplink'
    d.get(share_payload['url']);prepare_returning_user(d);legacy_ready(d)
    exact=wait_for(d,"""const x=document.querySelector('.legacy-exhibit-focus');const saved=document.querySelector('[data-legacy-my-museum-item="honor-mike-keith"]');return x?{key:x.dataset.legacyExhibitKey,label:x.dataset.legacyExhibitLabel,text:x.innerText,count:document.querySelectorAll('.legacy-exhibit-focus').length,filtered:document.querySelectorAll('.legacy-finder-filtered').length,sections:document.querySelectorAll('.legacy-finder-section-hidden').length,active:document.activeElement===x,clearVisible:!!document.querySelector('[data-legacy-exhibit-clear]:not([hidden])'),saved:!!saved}:null;""")
    exact_hash,exact_params=hash_params(d)
    if exact.get('key')!='honor-mike-keith' or 'Mike Keith' not in exact.get('text','') or exact.get('count')!=1:raise RuntimeError(f'Exact exhibit spotlight incorrect: {exact}')
    if exact.get('filtered') or exact.get('sections') or not exact.get('clearVisible') or not exact.get('saved'):raise RuntimeError(f'Exact exhibit or saved shelf incorrectly restored: {exact}')
    if exact_params.get('exhibit',[''])[0]!='honor-mike-keith' or any(key in exact_params for key in ['q','scope','trail','step']):raise RuntimeError(f'Exact exhibit URL contains mixed modes: {exact_hash}')
    if passport_state(d)!=before_manual:raise RuntimeError('Opening an exact exhibit link changed Museum Passport progress')
    if museum_state(d)!=saved_state:raise RuntimeError('Opening an exact exhibit link changed My Museum state')
    d.find_element(By.CSS_SELECTOR,'[data-legacy-exhibit-clear]').click()
    wait_for(d,"return !location.hash.includes('exhibit=')&&!document.querySelector('.legacy-exhibit-focus')")

    result['stage']='desktop:my-museum-open-remove'
    d.find_element(By.CSS_SELECTOR,'[data-legacy-my-museum-open="honor-mike-keith"]').click()
    wait_for(d,"return location.hash.includes('exhibit=honor-mike-keith')&&document.querySelector('.legacy-exhibit-focus')?.dataset.legacyExhibitKey==='honor-mike-keith'")
    if passport_state(d)!=before_manual:raise RuntimeError('Opening a saved My Museum exhibit changed Passport progress')
    d.find_element(By.CSS_SELECTOR,'[data-legacy-my-museum-remove="honor-mike-keith"]').click()
    empty_museum=wait_for(d,"""const root=document.querySelector('[data-legacy-my-museum]');return !document.querySelector('[data-legacy-my-museum-item]')?{text:root?.innerText||'',count:document.querySelector('[data-legacy-my-museum-count]')?.textContent||''}:null;""")
    removed_state=museum_state(d)
    empty_count=empty_museum.get('count','').casefold();empty_text=empty_museum.get('text','').casefold()
    if removed_state.get('keys')!=[] or '0 / 12 saved' not in empty_count or 'start your shelf' not in empty_text:raise RuntimeError(f'My Museum remove did not restore empty state: state={removed_state} ui={empty_museum}')
    if passport_state(d)!=before_manual:raise RuntimeError('Removing a saved exhibit changed Passport progress')

    result['desktop']={'inventory':inventory,'trailStart':raw,'trailNext':raw2,'passportAfterTwo':passport_after_two,'passportReturn':passport_text,'resumeHash':resume_hash,'passportAfterResume':passport_after_resume,'finder':raw3,'matched':matched[:3],'saved':saved_state,'savedCard':saved_card,'exhibitShare':share_payload,'exactHash':exact_hash,'exact':exact,'removed':removed_state}
    result['browserWarnings']+=severe_logs(d);d.quit();d=None

    result['stage']='mobile:launch'
    m=driver_for(390,844)
    m.get(f'{BASE}/#legacy?trail=1999-run&step=2');prepare_returning_user(m,clear_passport=True,clear_museum=True);legacy_ready(m)
    wait_for(m,"return document.querySelector('[data-legacy-trail-player]:not([hidden])')&&document.querySelectorAll('.legacy-finder-match').length>0")
    mobile=geometry(m)
    if mobile['viewport']!=390 or mobile['viewportHeight']!=844:raise RuntimeError(f'Legacy mobile viewport not exact: {mobile}')
    if mobile['overflow']:raise RuntimeError(f'Legacy mobile root overflow: {mobile}')
    if not mobile['trailRect'] or mobile['trailRect']['left']<-1 or mobile['trailRect']['right']>mobile['viewport']+1:raise RuntimeError(f'Legacy Trails outside mobile viewport: {mobile}')
    if any(a['h']<44 or a['w']<44 for a in mobile['actions']):raise RuntimeError(f'Legacy mobile action too small: {mobile}')
    active=m.execute_script("""const p=document.querySelector('[data-legacy-trail-player]');return {text:p?.innerText||'',passport:document.querySelector('[data-legacy-passport]')?.innerText||'',museum:document.querySelector('[data-legacy-my-museum]')?.innerText||'',matches:document.querySelectorAll('.legacy-finder-match').length,hash:location.hash};""")
    if 'steve mcnair' not in active['text'].casefold() or active['matches']<1 or '1 / 19 stamps' not in active['passport'].casefold() or '0 / 12 saved' not in active['museum'].casefold():raise RuntimeError(f'Deep-linked mobile trail did not hydrate isolated state: {active}')
    m.find_element(By.CSS_SELECTOR,'[data-legacy-trail-next]').click()
    wait_for(m,"return location.hash.includes('step=3')&&document.querySelector('[data-legacy-trail-player]')?.innerText.includes('Eddie George')")
    mobile_passport=passport_state(m)
    if mobile_passport.get('visited')!=['1999-run:2','1999-run:3']:raise RuntimeError(f'Mobile Passport progress wrong: {mobile_passport}')

    result['stage']='mobile:exact-exhibit'
    m.get(f'{BASE}/#legacy?exhibit=moment-music-city-miracle');prepare_returning_user(m);legacy_ready(m)
    mobile_exact=wait_for(m,"""const x=document.querySelector('.legacy-exhibit-focus');const share=x?.querySelector('[data-legacy-exhibit-share]');const save=x?.querySelector('[data-legacy-exhibit-save]');const sr=share?.getBoundingClientRect(),vr=save?.getBoundingClientRect();return x&&share&&save?{key:x.dataset.legacyExhibitKey,text:x.innerText,share:{w:sr.width,h:sr.height},save:{w:vr.width,h:vr.height},hash:location.hash}:null;""")
    exact_mobile_geometry=geometry(m)
    if mobile_exact.get('key')!='moment-music-city-miracle' or 'Music City Miracle' not in mobile_exact.get('text',''):raise RuntimeError(f'Mobile exact exhibit did not hydrate: {mobile_exact}')
    for target in [mobile_exact['share'],mobile_exact['save']]:
        if target['w']<44 or target['h']<44:raise RuntimeError(f'Mobile exact exhibit action too small: {mobile_exact}')
    if exact_mobile_geometry['overflow']:raise RuntimeError(f'Exact exhibit caused mobile overflow: {exact_mobile_geometry}')
    if passport_state(m)!=mobile_passport:raise RuntimeError('Mobile exact exhibit changed Passport progress')

    result['stage']='mobile:my-museum-save'
    m.find_element(By.CSS_SELECTOR,'[data-legacy-exhibit-save="moment-music-city-miracle"]').click()
    mobile_saved=wait_for(m,"""const card=document.querySelector('[data-legacy-my-museum-item="moment-music-city-miracle"]');const b=card?.querySelector('[data-legacy-my-museum-open]');const r=b?.getBoundingClientRect();return card&&b?{text:card.innerText,button:{w:r.width,h:r.height},count:document.querySelector('[data-legacy-my-museum-count]')?.textContent||''}:null;""")
    mobile_saved_geometry=geometry(m)
    if 'Music City Miracle' not in mobile_saved.get('text','') or '1 / 12 saved' not in mobile_saved.get('count','').casefold():raise RuntimeError(f'Mobile My Museum did not render saved exhibit: {mobile_saved}')
    if mobile_saved['button']['w']<44 or mobile_saved['button']['h']<44:raise RuntimeError(f'Mobile My Museum action too small: {mobile_saved}')
    if mobile_saved_geometry['overflow']:raise RuntimeError(f'My Museum caused mobile overflow: {mobile_saved_geometry}')
    if museum_state(m).get('keys')!=['moment-music-city-miracle']:raise RuntimeError(f'Mobile My Museum persisted wrong key: {museum_state(m)}')
    if passport_state(m)!=mobile_passport:raise RuntimeError('Mobile My Museum save changed Passport progress')

    result['mobile']={'geometry':mobile,'active':active,'afterNext':'#legacy?trail=1999-run&step=3','passport':mobile_passport,'exact':mobile_exact,'exactGeometry':exact_mobile_geometry,'saved':mobile_saved,'savedGeometry':mobile_saved_geometry,'museum':museum_state(m)}
    result['browserWarnings']+=severe_logs(m);m.quit();m=None

    result['stage']='console'
    if result['browserWarnings']:raise RuntimeError(f'Browser console errors: {result["browserWarnings"][:5]}')
    result['ok']=True;result['stage']='complete'
except Exception as exc:
    result['error']=f'{type(exc).__name__}: {exc}'
    active=d or m
    try:
        if active is not None:
            result['hash']=active.execute_script('return location.hash')
            result['passport']=active.execute_script("return localStorage.getItem(arguments[0])",PASSPORT_KEY)
            result['museum']=active.execute_script("return localStorage.getItem(arguments[0])",MY_MUSEUM_KEY)
            result['pageText']=active.execute_script("return (document.querySelector('#app')?.innerText||'').slice(0,4200)")
    except Exception:pass
finally:
    for driver in [d,m]:
        if driver is not None:
            try:driver.quit()
            except Exception:pass
    result['durationSeconds']=round(time.time()-start,2);OUT.write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
if not result['ok']:raise SystemExit(1)
