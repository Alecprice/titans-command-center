(() => {
  'use strict';

  if(window.TitansRuntime)return;
  const app=document.querySelector('#app');
  const routeListeners=new Set();
  const renderListeners=new Set();
  const apiCache=new Map();

  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const safeCall=(fn,...args)=>{try{return fn(...args)}catch(error){console.warn('[titans-runtime]',error);return undefined}};
  const storage={
    get(key,fallback=null){try{const value=localStorage.getItem(key);return value==null?fallback:value}catch{return fallback}},
    set(key,value){try{localStorage.setItem(key,String(value));return true}catch{return false}},
    getJSON(key,fallback=null){try{const raw=localStorage.getItem(key);return raw==null?fallback:(JSON.parse(raw)??fallback)}catch{return fallback}},
    setJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}},
    remove(key){try{localStorage.removeItem(key);return true}catch{return false}}
  };

  async function apiJson(url,{ttl=30000,force=false}={}){
    const key=String(url||'');
    if(!key.startsWith('/api/'))throw new Error('TitansRuntime apiJson only accepts same-origin /api/ routes');
    const now=Date.now(),entry=apiCache.get(key);
    if(!force&&entry?.value&&now<entry.expiresAt)return entry.value;
    if(entry?.inflight)return entry.inflight;
    let pending;
    pending=fetch(key,{cache:'no-store'}).then(async response=>{
      if(!response.ok)throw new Error(`${key} returned ${response.status}`);
      const value=await response.json();
      apiCache.set(key,{value,expiresAt:Date.now()+Math.max(0,Number(ttl)||0),inflight:null,updatedAt:Date.now()});
      return value;
    }).catch(error=>{
      const current=apiCache.get(key);
      if(current?.value)return current.value;
      console.warn('[titans-runtime-api]',key,error);
      return null;
    }).finally(()=>{
      const current=apiCache.get(key);
      if(current?.inflight===pending)apiCache.set(key,{...current,inflight:null});
    });
    apiCache.set(key,{value:entry?.value||null,expiresAt:entry?.expiresAt||0,updatedAt:entry?.updatedAt||0,inflight:pending});
    return pending;
  }

  function invalidateApi(url){
    if(url)apiCache.delete(String(url));
    else apiCache.clear();
  }
  function onRoute(listener,{immediate=false}={}){
    routeListeners.add(listener);
    if(immediate)queueMicrotask(()=>safeCall(listener,route()));
    return()=>routeListeners.delete(listener);
  }
  function onAppRender(listener,{immediate=false}={}){
    renderListeners.add(listener);
    if(immediate)queueMicrotask(()=>safeCall(listener,app));
    return()=>renderListeners.delete(listener);
  }
  function emitRoute(){const current=route();for(const listener of [...routeListeners])safeCall(listener,current)}
  function emitRender(){for(const listener of [...renderListeners])safeCall(listener,app)}

  addEventListener('hashchange',emitRoute);
  if(app)new MutationObserver(()=>queueMicrotask(emitRender)).observe(app,{childList:true,subtree:false});

  window.TitansRuntime={
    version:'1.9.0',
    route,
    storage,
    apiJson,
    invalidateApi,
    onRoute,
    onAppRender,
    apiCacheInfo:()=>[...apiCache.entries()].map(([url,x])=>({url,hasValue:Boolean(x.value),expiresAt:x.expiresAt,updatedAt:x.updatedAt}))
  };
})();
