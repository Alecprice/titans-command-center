(() => {
  'use strict';
  const V10_PREF_KEY='titans:v10Prefs';
  const KEYS=['titans:v15MyTitans','titans:v15SmartAlerts','titans:v14CustomMediaLinks',V10_PREF_KEY];
  let syncing=false,timer=0,lastUser='';
  const parse=key=>{try{const raw=localStorage.getItem(key);return raw==null?undefined:JSON.parse(raw)}catch{return undefined}};
  const snapshot=()=>Object.fromEntries(KEYS.map(key=>[key,parse(key)]).filter(([,value])=>value!==undefined));
  const apply=values=>{if(!values||typeof values!=='object')return;for(const key of KEYS){if(!(key in values))continue;try{localStorage.setItem(key,JSON.stringify(values[key]))}catch{}}};
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
      const refreshV10=V10_PREF_KEY in remotePreferences&&!same(local[V10_PREF_KEY],merged[V10_PREF_KEY]);
      apply(merged);
      await request('PUT',merged);
      lastUser=id;
      status('synced','Your Titans settings are synced.');
      window.dispatchEvent(new CustomEvent('titans:preferences-synced',{detail:{keys:Object.keys(merged)}}));
      if(refreshV10)setTimeout(()=>location.reload(),120);
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
  function schedule(){clearTimeout(timer);timer=setTimeout(push,500);}
  addEventListener('titans:account',event=>{const user=event.detail?.user;if(user)initialSync(user);else{lastUser='';status('guest','Guest settings stay on this device.')}});
  addEventListener('storage',event=>{if(KEYS.includes(event.key))schedule();});
  document.addEventListener('click',event=>{const el=event.target instanceof Element?event.target:null;if(!el)return;if(el.closest('[data-v15-profile-save],[data-v15-alert-save],[data-v16-favorite],[data-custom-remove],[data-save-settings]'))setTimeout(schedule,0);});
  document.addEventListener('submit',event=>{const form=event.target;if(form instanceof Element&&form.matches('[data-custom-form]'))setTimeout(schedule,0);});
  window.TitansAccountSync={sync:push,keys:[...KEYS]};
})();
