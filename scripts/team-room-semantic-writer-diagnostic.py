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
    before=driver.execute_script(r"""
      window.__teamRoomSemanticTrace=[];
      const MAX=120;
      const push=(entry)=>{
        if(window.__teamRoomSemanticTrace.length>=MAX)return;
        window.__teamRoomSemanticTrace.push({at:performance.now(),hash:location.hash,...entry});
      };
      const isTeamButton=el=>el instanceof Element&&el.matches?.('[data-team-room-view]');
      const stack=()=>String(new Error('team-room-semantic').stack||'').split('\n').slice(1,10).join('\n');
      const describe=el=>({view:el?.dataset?.teamRoomView||null,aria:el?.getAttribute?.('aria-pressed')??null,cls:el?.getAttribute?.('class')??null,connected:Boolean(el?.isConnected)});

      const originalSet=Element.prototype.setAttribute;
      Element.prototype.setAttribute=function(name,value){
        if(isTeamButton(this)&&(name==='aria-pressed'||name==='class'))push({kind:'setAttribute',name,value:String(value),target:describe(this),stack:stack()});
        return originalSet.call(this,name,value);
      };
      const originalRemove=Element.prototype.removeAttribute;
      Element.prototype.removeAttribute=function(name){
        if(isTeamButton(this)&&(name==='aria-pressed'||name==='class'))push({kind:'removeAttribute',name,target:describe(this),stack:stack()});
        return originalRemove.call(this,name);
      };
      const originalToggle=Element.prototype.toggleAttribute;
      Element.prototype.toggleAttribute=function(name,force){
        if(isTeamButton(this)&&(name==='aria-pressed'||name==='class'))push({kind:'toggleAttribute',name,force,target:describe(this),stack:stack()});
        return originalToggle.call(this,name,force);
      };

      for(const proto of [Element.prototype,HTMLElement.prototype]){
        const desc=Object.getOwnPropertyDescriptor(proto,'ariaPressed');
        if(desc?.set&&desc?.get){
          Object.defineProperty(proto,'ariaPressed',{
            configurable:desc.configurable,
            enumerable:desc.enumerable,
            get:desc.get,
            set(value){
              if(isTeamButton(this))push({kind:'ariaPressed-setter',value:String(value),target:describe(this),stack:stack()});
              return desc.set.call(this,value);
            }
          });
          break;
        }
      }

      const app=document.querySelector('#app');
      const initial=document.querySelector('[data-team-room-view="cutdown"]');
      window.__teamRoomSemanticInitial=initial;
      new MutationObserver(records=>{
        for(const record of records){
          const target=record.target;
          if(!(target instanceof Element)||!isTeamButton(target))continue;
          push({kind:'mutation',name:record.attributeName,oldValue:record.oldValue,target:describe(target),sameButton:target===window.__teamRoomSemanticInitial});
        }
      }).observe(app,{subtree:true,attributes:true,attributeOldValue:true,attributeFilter:['aria-pressed','class']});

      return {initial:describe(initial),hash:location.hash,appView:app.dataset.teamRoomView||null};
    """)

    result['stage']='activate-cutdown'
    immediate=driver.execute_script(r"""
      const button=document.querySelector('[data-team-room-view="cutdown"]');
      button?.click();
      return {
        sameButton:button===window.__teamRoomSemanticInitial,
        aria:button?.getAttribute('aria-pressed')??null,
        cls:button?.getAttribute('class')??null,
        hash:location.hash,
        appView:document.querySelector('#app')?.dataset?.teamRoomView||null
      };
    """)
    time.sleep(1.5)

    result['stage']='collect'
    final=driver.execute_script(r"""
      const button=document.querySelector('[data-team-room-view="cutdown"]');
      const panel=document.querySelector('.team-room-panel[data-panel="cutdown"]');
      return {
        sameButton:button===window.__teamRoomSemanticInitial,
        aria:button?.getAttribute('aria-pressed')??null,
        cls:button?.getAttribute('class')??null,
        active:Boolean(button?.classList.contains('active')),
        panelVisible:Boolean(panel&&!panel.hidden),
        hash:location.hash,
        appView:document.querySelector('#app')?.dataset?.teamRoomView||null,
        trace:window.__teamRoomSemanticTrace||[]
      };
    """)
    result.update({'ok':True,'before':before,'immediate':immediate,'final':final})
    print(json.dumps(result,indent=2))
except Exception as exc:
    result['error']=f'{type(exc).__name__}: {exc}'
    try:
        if driver is not None:
            result['trace']=driver.execute_script('return window.__teamRoomSemanticTrace||[]')
    except Exception:
        pass
    print(json.dumps(result,indent=2))
    raise
finally:
    if driver is not None:
        driver.quit()
