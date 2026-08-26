import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT=Path('/tmp/readability-browser-smoke.json')
VIEWPORTS=[('phone',390,844),('tablet',768,1024),('desktop',1440,1000)]
ROUTES=[
    ('home','home'),('game-day','live'),('schedule','games'),('roster','roster'),
    ('depth-chart','roster?view=depth'),('staff','roster?view=staff'),('cutdown','roster?view=cutdown'),
    ('transactions','transactions'),('stats','stats'),('fantasy','fantasy'),('markets','markets'),
    ('intel','feed'),('legacy','legacy'),('sources','sources'),('fan-hub','fan'),
    ('listen-watch','media'),('command-intel','command'),
]


def wait_ready(driver,timeout=12):
    WebDriverWait(driver,timeout,poll_frequency=.1).until(
        lambda d:d.execute_script("return document.readyState==='complete' && Boolean(document.querySelector('#app'))")
    )
    WebDriverWait(driver,timeout,poll_frequency=.1).until(
        lambda d:d.execute_script("return Boolean(document.querySelector('.page-head h1') || document.querySelector('.fan-hero'))")
    )
    time.sleep(.25)


def audit_page(driver):
    return driver.execute_script(r"""
      const parseRgb=value=>{
        const m=String(value||'').match(/rgba?\((\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)(?:[, /]+([\d.]+))?\)/i);
        return m?{r:+m[1],g:+m[2],b:+m[3],a:m[4]===undefined?1:+m[4]}:null;
      };
      const channel=v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)};
      const luminance=rgb=>.2126*channel(rgb.r)+.7152*channel(rgb.g)+.0722*channel(rgb.b);
      const ratio=(a,b)=>{const l1=luminance(a),l2=luminance(b);return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)};
      const visible=el=>{
        const s=getComputedStyle(el),r=el.getBoundingClientRect();
        return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>1&&r.height>1;
      };
      const effectiveBackground=el=>{
        let node=el;
        while(node&&node.nodeType===1){
          const s=getComputedStyle(node);
          if(s.backgroundImage&&s.backgroundImage!=='none') return null;
          const bg=parseRgb(s.backgroundColor);
          if(bg&&bg.a>=.98) return bg;
          node=node.parentElement;
        }
        return {r:255,g:255,b:255,a:1};
      };
      const candidates=[...document.querySelectorAll('#app h1,#app h2,#app h3,#app h4,#app p,#app li,#app small,#app span,#app a,#app button,#app label,#app strong,#app em')]
        .filter(visible)
        .filter(el=>(el.textContent||'').trim().length>0)
        .filter(el=>![...el.children].some(child=>(child.textContent||'').trim()===(el.textContent||'').trim()));
      const issues=[];
      let audited=0,skippedComplexBackground=0;
      for(const el of candidates){
        const s=getComputedStyle(el),fg=parseRgb(s.color),bg=effectiveBackground(el);
        if(!fg||fg.a<.98){continue;}
        if(!bg){skippedComplexBackground++;continue;}
        const cr=ratio(fg,bg),size=parseFloat(s.fontSize)||16,weight=parseInt(s.fontWeight,10)||400;
        const large=size>=24||(size>=18.66&&weight>=700);
        const required=large?3:4.5;
        audited++;
        if(cr+0.01<required){
          issues.push({
            text:(el.textContent||'').replace(/\s+/g,' ').trim().slice(0,100),
            tag:el.tagName.toLowerCase(),className:String(el.className||'').slice(0,100),
            ratio:Number(cr.toFixed(2)),required,size:Number(size.toFixed(1)),weight,
            color:s.color,background:`rgb(${bg.r}, ${bg.g}, ${bg.b})`
          });
        }
      }
      issues.sort((a,b)=>a.ratio-b.ratio);
      return {audited,skippedComplexBackground,lowContrast:issues.length,issues:issues.slice(0,24)};
    """)


options=webdriver.ChromeOptions()
options.add_argument('--headless=new')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-gpu')
options.set_capability('goog:loggingPrefs',{'browser':'ALL'})

driver=None
rows=[]
started=time.time()
try:
    driver=webdriver.Chrome(options=options)
    driver.set_page_load_timeout(25)
    for viewport,width,height in VIEWPORTS:
        driver.set_window_size(width,height)
        for route,route_hash in ROUTES:
            driver.get(f'{BASE}/#{route_hash}')
            wait_ready(driver)
            audit=audit_page(driver)
            rows.append({'viewport':viewport,'route':route,**audit})
    severe=[row for row in driver.get_log('browser') if row.get('level')=='SEVERE' and 'favicon' not in row.get('message','').lower()]
    if severe:
        raise RuntimeError(f'Browser severe warnings: {severe[:8]}')
    affected=[row for row in rows if row['lowContrast']]
    payload={
        'ok':True,'base':BASE,'viewports':len(VIEWPORTS),'routes':len(ROUTES),'checks':len(rows),
        'auditedTextElements':sum(row['audited'] for row in rows),
        'lowContrastSurfaces':len(affected),
        'lowContrastOccurrences':sum(row['lowContrast'] for row in rows),
        'samples':[{'viewport':row['viewport'],'route':row['route'],'issues':row['issues'][:8]} for row in affected[:18]],
        'rows':rows,'durationSeconds':round(time.time()-started,2),
    }
    REPORT.write_text(json.dumps(payload,indent=2),encoding='utf-8')
    print(json.dumps({k:v for k,v in payload.items() if k not in ('rows','samples')},indent=2))
except Exception as exc:
    payload={'ok':False,'base':BASE,'error':f'{type(exc).__name__}: {exc}','rows':rows,'durationSeconds':round(time.time()-started,2)}
    REPORT.write_text(json.dumps(payload,indent=2),encoding='utf-8')
    print(json.dumps(payload,indent=2))
    raise
finally:
    if driver:
        driver.quit()
