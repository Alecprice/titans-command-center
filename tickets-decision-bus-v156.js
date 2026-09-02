(() => {
  'use strict';

  if(window.TitansTicketDecisionBus?.version==='156')return;

  const app=document.querySelector('#app');
  if(!app)return;

  const SHORTLIST_KEY='titans:tickets-shortlist-v123';
  const SHORTLIST_CHANGE='titans:ticket-shortlist-change';
  const MAX_SAVED=3;
  const listeners=new Set();
  const state=window.__TitansTicketDecisionBusV156={publishes:0,replays:0,subscribers:0,last:null,lastError:''};

  function storageSnapshot(){
    try{
      const value=JSON.parse(localStorage.getItem(SHORTLIST_KEY)||'[]');
      const items=Array.isArray(value)?value.filter(item=>item&&typeof item.key==='string').slice(0,MAX_SAVED):[];
      return {count:items.length,keys:items.map(item=>item.key)};
    }catch{
      return {count:0,keys:[]};
    }
  }

  function normalize(value,reason='unknown'){
    const source=value&&typeof value==='object'?value:{};
    const keys=[...new Set((Array.isArray(source.keys)?source.keys:[]).filter(key=>typeof key==='string'&&key).slice(0,MAX_SAVED))];
    const count=Math.min(MAX_SAVED,Math.max(0,Number(source.count)||keys.length));
    return Object.freeze({count:Math.min(count,keys.length||count),keys:Object.freeze([...keys]),reason:String(reason||'unknown')});
  }

  function safeCall(listener,snapshot){
    try{listener(snapshot);}catch(error){state.lastError=String(error?.message||error||'decision subscriber failed').slice(0,160);}
  }

  function publish(value,reason='manual'){
    const fallback=storageSnapshot();
    const source=value&&typeof value==='object'?value:fallback;
    const snapshot=normalize({count:source.count??fallback.count,keys:Array.isArray(source.keys)?source.keys:fallback.keys},reason);
    state.last=snapshot;
    state.publishes+=1;
    for(const listener of [...listeners])safeCall(listener,snapshot);
    return snapshot;
  }

  function subscribe(listener,{replay=true}={}){
    if(typeof listener!=='function')return()=>{};
    listeners.add(listener);
    state.subscribers=listeners.size;
    if(replay){
      queueMicrotask(()=>{
        if(!listeners.has(listener))return;
        state.replays+=1;
        safeCall(listener,state.last||publish(storageSnapshot(),'bootstrap-replay'));
      });
    }
    return()=>{
      listeners.delete(listener);
      state.subscribers=listeners.size;
    };
  }

  state.last=normalize(storageSnapshot(),'bootstrap');

  app.addEventListener(SHORTLIST_CHANGE,event=>{
    publish(event?.detail||storageSnapshot(),String(event?.detail?.reason||'shortlist-event'));
  });
  addEventListener('storage',event=>{
    if(event.key===SHORTLIST_KEY)publish(storageSnapshot(),'cross-tab-storage');
  });

  window.TitansTicketDecisionBus={
    version:'156',
    publish,
    subscribe,
    snapshot:()=>state.last,
    diagnostics:()=>({publishes:state.publishes,replays:state.replays,subscribers:state.subscribers,last:state.last,lastError:state.lastError})
  };
})();
