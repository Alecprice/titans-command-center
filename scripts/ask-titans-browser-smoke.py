import json
import os
import sys
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT=Path('/tmp/ask-titans-browser-smoke.json')

def wait_for(driver,expression,timeout=16):
    return WebDriverWait(driver,timeout,poll_frequency=0.1).until(lambda d:d.execute_script(f'return Boolean({expression})'))

def no_overflow(driver,label):
    state=driver.execute_script("return {w:document.documentElement.clientWidth,s:document.documentElement.scrollWidth}")
    if state['s']>state['w']+3: raise RuntimeError(f'Horizontal overflow on {label}: {state}')

def write(payload):
    REPORT.write_text(json.dumps(payload,indent=2),encoding='utf-8')

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
    driver=webdriver.Chrome(options=options)
    driver.set_page_load_timeout(20)
    driver.set_script_timeout(8)

    stage='fan:load'
    driver.get(f'{BASE}/#fan')
    wait_for(driver,"document.querySelector('.v17-ask') && document.querySelectorAll('[data-v17-q]').length >= 5")
    no_overflow(driver,'Ask Titans desktop')

    answers=[]
    for question in ['Who is next?','Cam Ward','What is EPA?','How do I watch?']:
        stage=f'ask:{question}'
        driver.execute_script("const i=document.querySelector('#v17-ask-input');i.value=arguments[0];document.querySelector('[data-v17-ask]').click()",question)
        wait_for(driver,"document.querySelector('.v17-ask-answer h4') && document.querySelector('.v17-ask-sources')")
        payload=driver.execute_script("""
          const root=document.querySelector('.v17-ask-answer');
          return {
            answer:root?.querySelector('h4')?.textContent?.trim()||'',
            why:root?.querySelector('.v17-why p')?.textContent?.trim()||'',
            sources:root?.querySelectorAll('.v17-ask-sources>div').length||0,
            facts:root?.querySelectorAll('.v17-ask-facts>div').length||0,
            action:root?.querySelector('.v17-answer-action')?.getAttribute('href')||''
          }
        """)
        if not payload['answer'] or not payload['why'] or payload['sources']<1:
            raise RuntimeError(f'Incomplete structured answer for {question}: {payload}')
        answers.append({'question':question,**payload})

    stage='kickoff-timezone'
    team_time_verified=[]
    for row in [x for x in answers if x['question'] in ('Who is next?','How do I watch?')]:
        answer=row['answer']
        if 'not available' in answer.lower() or 'not loaded' in answer.lower():
            continue
        if 'Nashville time' not in answer or ' UTC' in answer or not ('CDT' in answer or 'CST' in answer):
            raise RuntimeError(f'Ask Titans kickoff is not rendered in Nashville time: {row}')
        team_time_verified.append(row['question'])

    stage='unsupported'
    driver.execute_script("const i=document.querySelector('#v17-ask-input');i.value='Tell me the secret play call for Sunday';document.querySelector('[data-v17-ask]').click()")
    wait_for(driver,"document.querySelector('.v17-ask-answer h4')?.textContent?.includes('could not map')")

    stage='mobile'
    driver.set_window_size(390,844)
    no_overflow(driver,'Ask Titans 390px')
    mobile=driver.execute_script("""
      return {
        quick:[...document.querySelectorAll('[data-v17-q]')].map(x=>({label:x.textContent.trim(),h:x.getBoundingClientRect().height})),
        askButton:document.querySelector('[data-v17-ask]')?.getBoundingClientRect().height||0,
        input:document.querySelector('#v17-ask-input')?.getBoundingClientRect().height||0,
        width:document.querySelector('.v17-ask')?.getBoundingClientRect().width||0,
        viewport:document.documentElement.clientWidth
      }
    """)
    if any(x['h']<44 for x in mobile['quick']) or mobile['askButton']<44 or mobile['input']<44:
        raise RuntimeError(f'Ask Titans mobile targets invalid: {mobile}')

    stage='console'
    warnings=[]
    try: warnings=[x for x in driver.get_log('browser') if x.get('level') in ('SEVERE','WARNING')]
    except Exception: pass
    severe=[x for x in warnings if x.get('level')=='SEVERE']
    if severe: raise RuntimeError(f'Ask Titans console has severe errors: {severe[:4]}')

    result={'ok':True,'base':BASE,'answers':answers,'teamTimeVerified':team_time_verified,'unsupportedRefused':True,'mobileTargets':mobile,'browserWarnings':warnings[:20],'durationSeconds':round(time.time()-started,2),'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
    write(result);print(json.dumps(result,indent=2))
except Exception as exc:
    result={'ok':False,'base':BASE,'stage':stage,'error':f'{type(exc).__name__}: {exc}','durationSeconds':round(time.time()-started,2),'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
    try:
        if driver is not None:
            result['hash']=driver.execute_script('return location.hash')
            result['pageText']=driver.execute_script("return (document.querySelector('#app')?.innerText||'').slice(0,2200)")
            result['browserWarnings']=[x for x in driver.get_log('browser') if x.get('level') in ('SEVERE','WARNING')][:20]
    except Exception: pass
    write(result);print(json.dumps(result,indent=2),file=sys.stderr);sys.exit(1)
finally:
    if driver is not None:
        try: driver.quit()
        except Exception: pass
