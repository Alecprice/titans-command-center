(()=>{
  'use strict';
  const SHORTLIST_KEY='titans:tickets-shortlist-v123';
  const SHORTLIST_CHANGE='titans:ticket-shortlist-change';
  const MARKER='__TitansTicketCompareCacheBridgeV141';
  const existing=window[MARKER];
  if(existing?.loaded)return;

  const OWNER_MODULES=[
    {name:'compare',guard:'__TitansTicketCompareV125',path:'./tickets-compare-v125.js'},
    {name:'finalists',guard:'__TitansTicketFinalistsV127',path:'./tickets-finalists-v127.js'},
    {name:'signal',guard:'__TitansTicketSignalLensV128',path:'./tickets-signal-lens-v128.js'}
  ];
  const runtime={loaded:true,version:'v141.1',semanticDispatches:0,legacyWakeups:0,ownerChecks:0,ownerLoads:0,ownerFailures:0,owners:{compare:false,finalists:false,signal:false}};
  window[MARKER]=runtime;
  const app=document.querySelector('#app');
  if(!app)return;
  let ownerPromise=null;

  function saved(){
    try{
      const value=JSON.parse(localStorage.getItem(SHORTLIST_KEY)||'[]');
      return Array.isArray(value)?value.filter(item=>item&&typeof item.key==='string').slice(0,3):[];
    }catch{return [];}
  }

  function ownerState(){
    return Object.fromEntries(OWNER_MODULES.map(owner=>[owner.name,Boolean(window[owner.guard])]));
  }

  function ensureOwners(){
    if(ownerPromise)return ownerPromise;
    ownerPromise=(async()=>{
      runtime.ownerChecks+=1;
      const before=ownerState();
      const results=await Promise.allSettled(OWNER_MODULES.map(owner=>import(owner.path)));
      runtime.ownerLoads+=OWNER_MODULES.filter(owner=>!before[owner.name]).length;
      runtime.ownerFailures+=results.filter(result=>result.status==='rejected').length;
      runtime.owners=ownerState();
      return runtime.owners;
    })().finally(()=>{ownerPromise=null;});
    return ownerPromise;
  }

  function settled(center,items){
    const panel=center.querySelector('[data-ticket-compare-v125]');
    if(!items.length)return !panel;
    if(!panel)return false;
    const expected=items.map(item=>item.key);
    const actual=[...panel.querySelectorAll('.tickets-compare-v125-card')].map(card=>card.dataset.ticketCompareKey||'').filter(Boolean);
    return expected.length===actual.length&&expected.every((key,index)=>key===actual[index]);
  }

  async function reconcile(){
    await ensureOwners();
    const center=document.querySelector('[data-ticket-center]');
    if(!center)return;
    const items=saved();
    const keys=items.map(item=>item.key);
    runtime.semanticDispatches+=1;
    center.dispatchEvent(new CustomEvent(SHORTLIST_CHANGE,{bubbles:true,detail:{count:items.length,keys:[...keys],source:'cache-bridge-v141.1'}}));
    requestAnimationFrame(()=>{
      const liveCenter=document.querySelector('[data-ticket-center]');
      if(!liveCenter)return;
      const liveItems=saved();
      runtime.owners=ownerState();
      if(settled(liveCenter,liveItems))return;
      runtime.legacyWakeups+=1;
      window.dispatchEvent(new StorageEvent('storage',{
        key:SHORTLIST_KEY,
        newValue:JSON.stringify(liveItems)
      }));
    });
  }

  app.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    if(!target?.closest('[data-ticket-tenx-save],[data-ticket-tenx-clear]'))return;
    queueMicrotask(()=>{void reconcile();});
  },true);

  void ensureOwners();
})();
