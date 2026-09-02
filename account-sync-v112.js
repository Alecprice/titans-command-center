(() => {
  'use strict';
  const V10_PREF_KEY='titans:v10Prefs';
  const FANTASY_PREF_KEY='titans-fantasy-v1';
  const PROP_WATCHLIST_KEY='titans-fantasy-prop-watchlist-v1';
  const KEYS=['titans:v15MyTitans','titans:v15SmartAlerts','titans:v14CustomMediaLinks',V10_PREF_KEY,FANTASY_PREF_KEY,PROP_WATCHLIST_KEY];
  const MAX_IMPORT_BYTES=32000,MAX_PROP_WATCHLIST=32;
  let syncing=false,timer=0,lastUser='';
  const clean=value=>String(value??'').trim();
  const slug=value=>clean(value).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const propKey=(player,market)=>`${slug(player)}|${slug(market)}`;
  const normalizePropWatchlist=value=>{
    if(!Array.isArray(value))return [];
    return value.filter(item=>item&&typeof item==='object'&&clean(item.player)&&clean(item.market))
      .map(item=>{const player=clean(item.player).slice(0,80),market=clean(item.market).slice(0,80),savedAt=Number(item.savedAt);return {key:propKey(player,market),player,market,savedAt:Number.isFinite(savedAt)&&savedAt>0?Math.floor(savedAt):0}})
      .filter(item=>item.key!=='|')
      .sort((a,b)=>b.savedAt-a.savedAt)
      .filter((item,index,list)=>list.findIndex(candidate=>candidate.key===item.key)===index)
      .slice(0,MAX_PROP_WATCHLIST);
  };
  const mergePropWatchlists=(local,remote)=>normalizePropWatchlist([...normalizePropWatchlist(local),...normalizePropWatchlist(remote)]);
  const parse=key=>{try{const raw=localStorage.getItem(key);return raw==null?undefined:JSON.parse(raw)}catch{return undefined}};
  const snapshot=()=>Object.fromEntries(KEYS.map(key=>{const value=parse(key);return [key,key===PROP_WATCHLIST_KEY&&value!==undefined?normalizePropWatchlist(value):value]}).filter(([,value])=>value!==undefined));
  const apply=values=>{if(!values||typeof values!=='object')return;for(const key of KEYS){if(!(key in values))continue;try{const value=key===PROP_WATCHLIST_KEY?normalizePropWatchlist(values[key]):values[key];localStorage.setItem(key,JSON.stringify(value))}catch{}}};
  const clearLocal=()=>{for(const key of KEYS){try{localStorage.removeItem(key)}catch{}}};
  const same=(a,b)=>{try{return JSON.stringify(a)===JSON.stringify(b)}catch{return false}};
  const status=(state,message)=>window.dispatchEvent(new CustomEvent('titans:sync-status',{detail:{state,message,at:new Date().toISOString()}}));
  const failureStatus=error=>error?.code==='PREFERENCE_STORAGE_NOT_READY'?{state:'local',message:'Account sync isn’t enabled yet. Your settings are saved on this device.'}:{state:'error',message:'Couldn’t sync right now. Your settings are still saved on this device.'};
  function reportFailure(error){const detail=failureStatus(error);console.warn('[account-sync]',error instanceof Error?error.message:'sync unavailable');status(detail.state,detail.message);}
  async function request(method='GET',preferences){
    const res=await fetch('/api/account/preferences',{method,credentials:'same-origin',cache:'no-store',headers:method==='PUT'?{'Content-Type':'application/json'}:undefined,body:method==='PUT'?JSON.stringify({preferences}):undefined});
    const data=await res.json().catch(()=>({}));
    if(!res.ok){const error=new Error(data?.error||`Preference sync ${res.status}`);error.code=String(data?.code||'');error.localOnly=Boolean(data?.localOnly);throw error;}
    return data;
  }
  async function initialSync(user){
    const id=String(user?.id||'');if(!id||syncing||id===lastUser)return;
    syncing=true;status('syncing','Syncing your Titans settings…');
    try{
      const local=snapshot();
      const remote=await request('GET');
      const remotePreferences=remote?.preferences&&typeof remote.preferences==='object'?remote.preferences:{};
      const merged={...local,...remotePreferences};
      if(PROP_WATCHLIST_KEY in local||PROP_WATCHLIST_KEY in remotePreferences)merged[PROP_WATCHLIST_KEY]=mergePropWatchlists(local[PROP_WATCHLIST_KEY],remotePreferences[PROP_WATCHLIST_KEY]);
      const refreshV10=V10_PREF_KEY in remotePreferences&&!same(local[V10_PREF_KEY],merged[V10_PREF_KEY]);
      const refreshFantasy=FANTASY_PREF_KEY in remotePreferences&&!same(local[FANTASY_PREF_KEY],merged[FANTASY_PREF_KEY]);
      const refreshPropWatchlist=PROP_WATCHLIST_KEY in merged&&!same(normalizePropWatchlist(local[PROP_WATCHLIST_KEY]),merged[PROP_WATCHLIST_KEY]);
      apply(merged);
      await request('PUT',merged);
      lastUser=id;
      status('synced','Your Titans settings are synced.');
      window.dispatchEvent(new CustomEvent('titans:preferences-synced',{detail:{keys:Object.keys(merged)}}));
      if(refreshV10||refreshFantasy||refreshPropWatchlist)setTimeout(()=>location.reload(),120);
    }catch(err){reportFailure(err);}
    finally{syncing=false;}
  }
  async function push(){
    if(syncing||!window.TitansAccount?.user)return false;
    syncing=true;status('syncing','Syncing your Titans settings…');
    try{await request('PUT',snapshot());status('synced','Your Titans settings are synced.');return true;}
    catch(err){reportFailure(err);return false;}
    finally{syncing=false;}
  }
  function exportPayload(){
    const user=window.TitansAccount?.user||null;
    return {format:'titans-command-center-settings',version:1,exportedAt:new Date().toISOString(),scope:user?'signed-in-device':'guest-device',account:user?{name:user.name||null,email:user.email||null}:null,preferences:snapshot()};
  }
  function exportSettings(){
    const payload=exportPayload();
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download=`titans-command-center-settings-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    status(window.TitansAccount?.user?'synced':'guest','Settings export created from this device.');
    return payload;
  }
  function prepareImport(payload){
    if(!payload||typeof payload!=='object'||Array.isArray(payload))throw new Error('This is not a Titans Command Center settings backup.');
    if(payload.format!=='titans-command-center-settings'||payload.version!==1)throw new Error('This backup format or version is not supported.');
    const preferences=payload.preferences;
    if(!preferences||typeof preferences!=='object'||Array.isArray(preferences))throw new Error('This backup does not contain valid settings.');
    const keys=Object.keys(preferences);
    const unknown=keys.filter(key=>!KEYS.includes(key));
    if(unknown.length)throw new Error('This backup contains settings this version does not recognize.');
    const encoded=JSON.stringify(preferences);
    if(encoded.length>MAX_IMPORT_BYTES)throw new Error('This settings backup is too large to import safely.');
    for(const [key,value] of Object.entries(preferences)){
      if(value===undefined||typeof value==='function'||typeof value==='symbol')throw new Error(`Invalid setting value: ${key}`);
      JSON.stringify(value);
    }
    const normalized=Object.fromEntries(keys.map(key=>[key,key===PROP_WATCHLIST_KEY?normalizePropWatchlist(preferences[key]):preferences[key]]));
    return {preferences:normalized,keys,exportedAt:String(payload.exportedAt||''),scope:String(payload.scope||'unknown'),accountEmail:String(payload.account?.email||'')};
  }
  async function importSettings(payload){
    const prepared=prepareImport(payload);
    apply(prepared.preferences);
    window.dispatchEvent(new CustomEvent('titans:preferences-imported',{detail:{keys:[...prepared.keys],scope:prepared.scope}}));
    if(!window.TitansAccount?.user){status('guest',`Imported ${prepared.keys.length} setting group${prepared.keys.length===1?'':'s'} on this device.`);setTimeout(()=>location.reload(),160);return {ok:true,synced:false,...prepared};}
    status('syncing','Imported on this device. Syncing your Titans settings…');
    try{await request('PUT',snapshot());status('synced','Imported settings are synced to your account.');setTimeout(()=>location.reload(),160);return {ok:true,synced:true,...prepared};}
    catch(err){
      const localOnly=err?.code==='PREFERENCE_STORAGE_NOT_READY'&&err?.localOnly;
      status(localOnly?'local':'error',localOnly?'Imported on this device. Account sync is not enabled yet.':'Imported on this device, but cloud sync did not complete yet.');
      console.warn('[account-import]',err instanceof Error?err.message:'sync unavailable');setTimeout(()=>location.reload(),220);return {ok:true,synced:false,...prepared};
    }
  }
  async function resetSettings(){
    if(syncing)return false;
    const signedIn=Boolean(window.TitansAccount?.user);
    if(!signedIn){clearLocal();status('guest','Guest settings reset. This device will use defaults.');window.dispatchEvent(new CustomEvent('titans:preferences-reset',{detail:{scope:'guest'}}));setTimeout(()=>location.reload(),120);return true;}
    syncing=true;status('syncing','Resetting your synced Titans settings…');
    try{
      await request('PUT',{});
      clearLocal();lastUser=String(window.TitansAccount?.user?.id||'');
      status('synced','Synced settings reset. This device will use defaults.');
      window.dispatchEvent(new CustomEvent('titans:preferences-reset',{detail:{scope:'account'}}));
      setTimeout(()=>location.reload(),120);return true;
    }catch(err){
      if(err?.code==='PREFERENCE_STORAGE_NOT_READY'&&err?.localOnly){clearLocal();status('local','Device settings reset. Account sync is not enabled yet.');window.dispatchEvent(new CustomEvent('titans:preferences-reset',{detail:{scope:'local'}}));setTimeout(()=>location.reload(),120);return true;}
      console.warn('[account-reset]',err instanceof Error?err.message:'reset unavailable');status('error','Couldn’t reset synced settings. Nothing was changed.');return false;
    }finally{syncing=false;}
  }
  function schedule(){clearTimeout(timer);timer=setTimeout(push,500);}
  addEventListener('titans:account',event=>{const user=event.detail?.user;if(user)initialSync(user);else{lastUser='';status('guest','Guest settings stay on this device.')}});
  addEventListener('storage',event=>{if(KEYS.includes(event.key))schedule();});
  document.addEventListener('click',event=>{const el=event.target instanceof Element?event.target:null;if(!el)return;if(el.closest('[data-v15-profile-save],[data-v15-alert-save],[data-v16-favorite],[data-custom-remove],[data-save-settings],[data-scoring],[data-ftab],[data-remove-player],.fpw-watch-button'))setTimeout(schedule,0);});
  document.addEventListener('submit',event=>{const form=event.target;if(form instanceof Element&&form.matches('[data-custom-form],.fantasy-add,.fantasy-connect'))setTimeout(schedule,0);});
  document.addEventListener('change',event=>{const el=event.target instanceof Element?event.target:null;if(el?.matches('#sleeper-league,#sleeper-week'))setTimeout(schedule,0);});
  window.TitansAccountSync={sync:push,exportSettings,resetSettings,exportPayload,prepareImport,importSettings,keys:[...KEYS]};
})();