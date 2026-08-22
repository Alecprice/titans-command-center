(() => {
  'use strict';
  const KEYS=['titans:v15MyTitans','titans:v15SmartAlerts','titans:v14CustomMediaLinks'];
  let syncing=false,timer=0,lastUser='';
  const parse=key=>{try{const raw=localStorage.getItem(key);return raw==null?undefined:JSON.parse(raw)}catch{return undefined}};
  const snapshot=()=>Object.fromEntries(KEYS.map(key=>[key,parse(key)]).filter(([,value])=>value!==undefined));
  const apply=values=>{if(!values||typeof values!=='object')return;for(const key of KEYS){if(!(key in values))continue;try{localStorage.setItem(key,JSON.stringify(values[key]))}catch{}}};
  async function request(method='GET',preferences){
    const res=await fetch('/api/account/preferences',{method,credentials:'same-origin',cache:'no-store',headers:method==='PUT'?{'Content-Type':'application/json'}:undefined,body:method==='PUT'?JSON.stringify({preferences}):undefined});
    if(!res.ok)throw new Error(`Preference sync ${res.status}`);
    return res.json();
  }
  async function initialSync(user){
    const id=String(user?.id||'');if(!id||syncing||id===lastUser)return;
    syncing=true;
    try{
      const remote=await request('GET');
      const merged={...snapshot(),...(remote?.preferences||{})};
      apply(merged);
      await request('PUT',merged);
      lastUser=id;
      window.dispatchEvent(new CustomEvent('titans:preferences-synced',{detail:{keys:Object.keys(merged)}}));
    }catch(err){console.warn('[account-sync]',err instanceof Error?err.message:'sync unavailable');}
    finally{syncing=false;}
  }
  async function push(){
    if(syncing||!window.TitansAccount?.user)return;
    syncing=true;try{await request('PUT',snapshot());}catch(err){console.warn('[account-sync]',err instanceof Error?err.message:'sync unavailable');}finally{syncing=false;}
  }
  function schedule(){clearTimeout(timer);timer=setTimeout(push,500);}
  addEventListener('titans:account',event=>{const user=event.detail?.user;if(user)initialSync(user);else lastUser='';});
  addEventListener('storage',event=>{if(KEYS.includes(event.key))schedule();});
  document.addEventListener('click',event=>{const el=event.target instanceof Element?event.target:null;if(!el)return;if(el.closest('[data-v15-profile-save],[data-v15-alert-save],[data-v16-favorite],[data-custom-remove]'))setTimeout(schedule,0);});
  document.addEventListener('submit',event=>{const form=event.target;if(form instanceof Element&&form.matches('[data-custom-form]'))setTimeout(schedule,0);});
  window.TitansAccountSync={sync:push,keys:[...KEYS]};
})();
