(()=>{
  'use strict';
  const SHORTLIST_KEY='titans:tickets-shortlist-v123';
  const SHORTLIST_CHANGE='titans:ticket-shortlist-change';
  const MARKER='__TitansTicketCompareCacheBridgeV141';
  const existing=window[MARKER];
  if(existing?.loaded)return;

  const runtime={loaded:true,version:'v141',semanticDispatches:0,legacyWakeups:0};
  window[MARKER]=runtime;
  const app=document.querySelector('#app');
  if(!app)return;

  function saved(){
    try{
      const value=JSON.parse(localStorage.getItem(SHORTLIST_KEY)||'[]');
      return Array.isArray(value)?value.filter(item=>item&&typeof item.key==='string').slice(0,3):[];
    }catch{return [];}
  }

  function settled(center,items){
    const panel=center.querySelector('[data-ticket-compare-v125]');
    if(!items.length)return !panel;
    if(!panel)return false;
    return panel.querySelectorAll('.tickets-compare-v125-card').length===items.length;
  }

  function reconcile(){
    const center=document.querySelector('[data-ticket-center]');
    if(!center)return;
    const items=saved();
    const keys=items.map(item=>item.key);
    runtime.semanticDispatches+=1;
    center.dispatchEvent(new CustomEvent(SHORTLIST_CHANGE,{bubbles:true,detail:{count:items.length,keys:[...keys]}}));
    requestAnimationFrame(()=>{
      const liveCenter=document.querySelector('[data-ticket-center]');
      if(!liveCenter)return;
      const liveItems=saved();
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
    queueMicrotask(reconcile);
  },true);
})();
