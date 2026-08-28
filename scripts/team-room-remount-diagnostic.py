#!/usr/bin/env python3
import json
import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

BASE=os.environ.get('TCC_BASE_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')

options=Options()
options.add_argument('--headless=new')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--window-size=1440,1200')
options.set_capability('goog:loggingPrefs',{'browser':'ALL'})

driver=None
result={'ok':False,'base':BASE,'stage':'start'}
try:
    driver=webdriver.Chrome(options=options)
    wait=WebDriverWait(driver,25)
    result['stage']='open-roster'
    driver.get(f'{BASE}/#roster')
    wait.until(lambda d: len(d.find_elements(By.CSS_SELECTOR,'.player-card[href*="#player?id="]'))>20)
    wait.until(lambda d: d.find_elements(By.CSS_SELECTOR,'.team-room-switcher [data-team-room-view="cutdown"]'))

    result['stage']='install-trace'
    driver.execute_script(r"""
      window.__teamRoomRemountTrace=[];
      const MAX=80;
      const push=(entry)=>{
        if(window.__teamRoomRemountTrace.length>=MAX)return;
        window.__teamRoomRemountTrace.push({at:performance.now(),hash:location.hash,...entry});
      };
      const relevant=el=>{
        if(!(el instanceof Element))return false;
        if(el.id==='app'||el.matches?.('.team-room-switcher,.team-room-panel'))return true;
        return Boolean(el.querySelector?.('.team-room-switcher,[data-team-room-view]'));
      };
      const stack=()=>String(new Error('team-room-remount').stack||'').split('\n').slice(1,9).join('\n');

      const inner=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');
      if(inner?.set&&inner?.get){
        Object.defineProperty(Element.prototype,'innerHTML',{
          configurable:inner.configurable,
          enumerable:inner.enumerable,
          get:inner.get,
          set(value){
            if(relevant(this))push({kind:'innerHTML',target:this.id||this.className||this.tagName,stack:stack()});
            return inner.set.call(this,value);
          }
        });
      }

      for(const method of ['replaceChildren','insertAdjacentHTML','replaceWith','remove']){
        const original=Element.prototype[method];
        if(typeof original!=='function')continue;
        Element.prototype[method]=function(...args){
          if(relevant(this)||method==='remove'&&this.matches?.('.team-room-switcher,[data-team-room-view]')){
            push({kind:method,target:this.id||this.className||this.tagName,stack:stack()});
          }
          return original.apply(this,args);
        };
      }

      const app=document.querySelector('#app');
      const initial=document.querySelector('[data-team-room-view="cutdown"]');
      window.__teamRoomInitialButton=initial;
      new MutationObserver(()=>{
        const current=document.querySelector('[data-team-room-view="cutdown"]');
        if(current&&current!==window.__teamRoomInitialButton){
          push({kind:'button-replaced',selected:current.getAttribute('aria-pressed'),connected:current.isConnected});
          window.__teamRoomInitialButton=current;
        }
      }).observe(app,{subtree:true,childList:true});
    """)

    result['stage']='activate-cutdown'
    driver.execute_script("document.querySelector('[data-team-room-view=\"cutdown\"]')?.click()")
    time.sleep(2.5)

    result['stage']='collect'
    state=driver.execute_script(r"""
      const button=document.querySelector('[data-team-room-view="cutdown"]');
      const panel=document.querySelector('.team-room-panel[data-panel="cutdown"]');
      return {
        hash:location.hash,
        selected:button?.getAttribute('aria-pressed')||null,
        active:Boolean(button?.classList.contains('active')),
        panelVisible:Boolean(panel&&!panel.hidden),
        appView:document.querySelector('#app')?.dataset?.teamRoomView||null,
        trace:window.__teamRoomRemountTrace||[]
      };
    """)
    result.update({'ok':True,'state':state})
    try:
        result['browserWarnings']=[x for x in driver.get_log('browser') if x.get('level') in ('SEVERE','WARNING')][:20]
    except Exception:
        result['browserWarnings']=[]
    print(json.dumps(result,indent=2))
except Exception as exc:
    result['error']=f'{type(exc).__name__}: {exc}'
    try:
        if driver is not None:
            result['hash']=driver.execute_script('return location.hash')
            result['trace']=driver.execute_script('return window.__teamRoomRemountTrace||[]')
    except Exception:
        pass
    print(json.dumps(result,indent=2))
    raise
finally:
    if driver is not None:
        driver.quit()
