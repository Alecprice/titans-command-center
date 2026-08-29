import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT=Path('/tmp/responsive-matrix-smoke.json')
VIEWPORTS=[
    ('small-phone',360,780,'mobile'),
    ('phone',390,844,'mobile'),
    ('large-phone',430,932,'mobile'),
    ('tablet-portrait',768,1024,'desktop-shell'),
    ('small-laptop',1024,768,'desktop-shell'),
    ('desktop',1440,1000,'desktop-shell'),
    ('wide-desktop',1920,1080,'desktop-shell'),
]
ROUTES=[
    ('home','home'),
    ('game-day','live'),
    ('schedule','games'),
    ('tickets','tickets'),
    ('roster','roster'),
    ('depth-chart','roster?view=depth'),
    ('staff','roster?view=staff'),
    ('cutdown','roster?view=cutdown'),
    ('transactions','transactions'),
    ('stats','stats'),
    ('fantasy','fantasy'),
    ('markets','markets'),
    ('intel','feed'),
    ('legacy','legacy'),
    ('sources','sources'),
    ('fan-hub','fan'),
    ('listen-watch','media'),
    ('command-intel','command'),
]
ROUTE_READY_SELECTORS={
    'fantasy':'#app[data-fantasy-command="ready"]',
}

def wait(driver,expression,timeout=10):
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(lambda d:d.execute_script(f'return Boolean({expression})'))

def wait_route_ready(driver,route_name,route_hash,timeout=12):
    expected=f'#{route_hash}'
    selector=ROUTE_READY_SELECTORS.get(route_name,'')
    def ready(d):
        return d.execute_script("""
          const expected=arguments[0],selector=arguments[1];
          if(document.readyState!=='complete'||!document.querySelector('#app')||location.hash!==expected)return false;
          if(selector)return Boolean(document.querySelector(selector));
          return Boolean(document.querySelector('.page-head h1')||document.querySelector('.fan-hero')||document.querySelector('[data-ticket-center]'));
        """,expected,selector)
    return WebDriverWait(driver,timeout,poll_frequency=.1).until(ready)

def settle(driver,timeout=4):
    deadline=time.time()+timeout
    stable=0
    previous=None
    while time.time()<deadline:
        current=driver.execute_script("""
          const app=document.querySelector('#app');
          return {
            hash:location.hash,
            html:app?.innerHTML.length||0,
            text:app?.innerText.length||0,
            width:document.documentElement.scrollWidth,
            busy:app?.getAttribute('aria-busy')||''
          };
        """)
        key=(current['hash'],current['html'],current['text'],current['width'],current['busy'])
        stable=stable+1 if key==previous else 0
        previous=key
        if stable>=2 and current['busy']!='true': return current
        time.sleep(.12)
    return previous

def dimensions(driver):
    return driver.execute_script(r"""
      const de=document.documentElement;
      const nav=document.querySelector('.mobile-nav');
      const side=document.querySelector('#sidebar');
      const visible=el=>{
        const s=getComputedStyle(el),r=el.getBoundingClientRect();
        return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0;
      };
      const suspiciousTiny=[...document.querySelectorAll('#app small,#app p,#app li,#app span')]
        .filter(visible)
        .map(el=>({text:(el.textContent||'').trim().slice(0,80),font:parseFloat(getComputedStyle(el).fontSize)}))
        .filter(x=>x.text&&x.font<9.5)
        .slice(0,12);
      const smallControls=[...document.querySelectorAll('#app button,#app select,#app input:not([type="hidden"]),#app [role="button"]')]
        .filter(visible)
        .map(el=>{
          const type=(el.getAttribute('type')||'').toLowerCase();
          const hitTarget=(type==='checkbox'||type==='radio')?(el.closest('label')||el):el;
          const r=hitTarget.getBoundingClientRect();
          return {tag:el.tagName,type,label:(el.getAttribute('aria-label')||el.textContent||el.getAttribute('placeholder')||el.id||'').trim().replace(/\s+/g,' ').slice(0,80),w:Math.round(r.width*10)/10,h:Math.round(r.height*10)/10};
        })
        .filter(x=>x.w<44||x.h<44)
        .slice(0,16);
      return {
        innerWidth:innerWidth, innerHeight:innerHeight,
        clientWidth:de.clientWidth, scrollWidth:de.scrollWidth,
        bodyScrollWidth:document.body?.scrollWidth||0,
        mobileNav:nav?getComputedStyle(nav).display:null,
        sidebar:side?getComputedStyle(side).display:null,
        sidebarPosition:side?getComputedStyle(side).position:null,
        appWidth:document.querySelector('#app')?.getBoundingClientRect().width||0,
        appTextLength:(document.querySelector('#app')?.innerText||'').trim().length,
        topbarWidth:document.querySelector('.topbar')?.getBoundingClientRect().width||0,
        touchTargets:[...document.querySelectorAll('.mobile-nav a,.mobile-nav button')].map(el=>({label:el.textContent.trim(),w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height})),
        suspiciousTiny,
        smallControls,
      };
    """)

def assert_layout(state,label,mode):
    widest=max(state['scrollWidth'],state['bodyScrollWidth'])
    if widest>state['innerWidth']+3:
        raise RuntimeError(f'{label}: horizontal overflow by {widest-state["innerWidth"]:.1f}px {state}')
    if state['appWidth']<=0 or state['topbarWidth']<=0 or state['appTextLength']<=0:
        raise RuntimeError(f'{label}: primary shell/content is empty {state}')
    if mode=='mobile':
        if state['mobileNav']=='none': raise RuntimeError(f'{label}: mobile dock hidden')
        if len(state['touchTargets'])!=5: raise RuntimeError(f'{label}: expected five mobile actions {state["touchTargets"]}')
        if any(x['w']<44 or x['h']<44 for x in state['touchTargets']): raise RuntimeError(f'{label}: undersized mobile dock target {state["touchTargets"]}')
        if state['smallControls']: raise RuntimeError(f'{label}: undersized app controls {state["smallControls"]}')
        if state['suspiciousTiny']: raise RuntimeError(f'{label}: text below 9.5px {state["suspiciousTiny"]}')
    else:
        if state['mobileNav']!='none': raise RuntimeError(f'{label}: mobile dock visible on desktop/tablet shell')

options=webdriver.ChromeOptions()
options.add_argument('--headless=new')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-gpu')
options.set_capability('goog:loggingPrefs',{'browser':'ALL'})
driver=None
started=time.time()
rows=[]
current={'viewport':None,'route':None,'hash':None}
try:
    driver=webdriver.Chrome(options=options)
    driver.set_page_load_timeout(25)
    for name,width,height,mode in VIEWPORTS:
        driver.set_window_size(width,height)
        for route_name,route_hash in ROUTES:
            current={'viewport':name,'route':route_name,'hash':route_hash}
            driver.get(f'{BASE}/#{route_hash}')
            wait_route_ready(driver,route_name,route_hash)
            settle(driver)
            state=dimensions(driver)
            label=f'{name}:{route_name}'
            assert_layout(state,label,mode)
            rows.append({
                'viewport':name,'width':width,'height':height,'mode':mode,'route':route_name,'hash':route_hash,
                'innerWidth':state['innerWidth'],'scrollWidth':state['scrollWidth'],'bodyScrollWidth':state['bodyScrollWidth'],'clientWidth':state['clientWidth'],'mobileNav':state['mobileNav'],
                'suspiciousTiny':state['suspiciousTiny'],
                'smallControls':state['smallControls'] if mode=='mobile' else [],
            })
    warnings=[x for x in driver.get_log('browser') if x.get('level')=='SEVERE']
    if warnings: raise RuntimeError(f'Browser severe warnings: {warnings[:8]}')
    tiny_samples=[{'viewport':r['viewport'],'route':r['route'],'items':r['suspiciousTiny']} for r in rows if r['suspiciousTiny']]
    control_samples=[{'viewport':r['viewport'],'route':r['route'],'items':r['smallControls']} for r in rows if r['smallControls']]
    payload={
        'ok':True,'base':BASE,'viewports':len(VIEWPORTS),'routes':len(ROUTES),'checks':len(rows),
        'tinyTextSurfaces':len(tiny_samples),'tinyTextSamples':tiny_samples[:12],
        'undersizedControlSurfaces':len(control_samples),'undersizedControlSamples':control_samples[:18],
        'rows':rows,'durationSeconds':round(time.time()-started,2)
    }
    REPORT.write_text(json.dumps(payload,indent=2),encoding='utf-8')
    print(json.dumps({k:v for k,v in payload.items() if k not in ('rows','tinyTextSamples','undersizedControlSamples')},indent=2))
except Exception as exc:
    payload={'ok':False,'base':BASE,'stage':current,'error':f'{type(exc).__name__}: {exc}','rows':rows,'durationSeconds':round(time.time()-started,2)}
    REPORT.write_text(json.dumps(payload,indent=2),encoding='utf-8')
    print(json.dumps(payload,indent=2))
    raise
finally:
    if driver: driver.quit()