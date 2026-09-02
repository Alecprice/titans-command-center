(() => {
  'use strict';

  if(window.__TitansTicketDecisionRehydrateV155)return;

  const app=document.querySelector('#app');
  const runtime=window.TitansRuntime;
  if(!app)return;

  const SHORTLIST_KEY='titans:tickets-shortlist-v123';
  const MEMORY_KEY='titans:tickets-price-memory-v124';
  const SHORTLIST_CHANGE='titans:ticket-shortlist-change';
  const MAX_SETTLE_FRAMES=5;
  const MAX_WAKE_PASSES=2;
  const state=window.__TitansTicketDecisionRehydrateV155={checks:0,repairs:0,last:null};
  let frameQueued=false;

  const route=()=>runtime?.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';

  function saved(){
    const value=runtime?.storage?.getJSON?.(SHORTLIST_KEY,[]);
    return Array.isArray(value)?value.filter(item=>item&&typeof item.key==='string').slice(0,3):[];
  }

  function compareMatches(center,items){
    const panel=center.querySelector('[data-ticket-compare-v125]');
    if(!items.length)return !panel;
    if(!panel)return false;
    const expected=items.map(item=>item.key);
    const actual=[...panel.querySelectorAll('.tickets-compare-v125-card')]
      .map(card=>card.dataset.ticketCompareKey||'')
      .filter(Boolean);
    return expected.length===actual.length&&expected.every((key,index)=>key===actual[index]);
  }

  function snapshot(center,items,frame,wakes){
    const boardReady=Boolean(center.querySelector('.tickets-compare-card[data-ticket-tenx-key]'));
    const commandReady=Boolean(center.querySelector('[data-ticket-tenx-command]'));
    const compare=compareMatches(center,items);
    const finalists=!boardReady||Boolean(center.querySelector('[data-ticket-finalists-v127]'));
    const signal=!boardReady||Boolean(center.querySelector('[data-ticket-signal-lens-v128]'));
    return {
      savedCount:items.length,
      frame,
      wakes,
      boardReady,
      commandReady,
      compare,
      finalists,
      signal,
      settled:commandReady&&compare&&finalists&&signal
    };
  }

  function wakeDecisionOwners(center,items){
    const keys=items.map(item=>item.key);
    center.dispatchEvent(new CustomEvent(SHORTLIST_CHANGE,{bubbles:true,detail:{count:items.length,keys:[...keys],reason:'rehydrate-v155'}}));
    let memoryValue=null;
    try{memoryValue=localStorage.getItem(MEMORY_KEY);}catch{}
    window.dispatchEvent(new StorageEvent('storage',{key:MEMORY_KEY,newValue:memoryValue}));
  }

  function queueReconcile(frame=0,wakes=0){
    if(frameQueued)return;
    frameQueued=true;
    requestAnimationFrame(()=>{
      frameQueued=false;
      reconcile(frame,wakes);
    });
  }

  function reconcile(frame=0,wakes=0){
    if(route()!=='tickets')return;
    const center=app.querySelector('[data-ticket-center]');
    if(!center)return;
    const items=saved();
    const report=snapshot(center,items,frame,wakes);
    state.checks+=1;
    state.last=report;
    if(report.settled)return;
    if(frame>=MAX_SETTLE_FRAMES-1)return;

    if(!report.commandReady){
      queueReconcile(frame+1,wakes);
      return;
    }

    if(wakes<MAX_WAKE_PASSES){
      state.repairs+=1;
      wakeDecisionOwners(center,items);
      queueReconcile(frame+1,wakes+1);
      return;
    }

    queueReconcile(frame+1,wakes);
  }

  function schedule(){
    queueReconcile(0,0);
  }

  app.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    if(target?.closest('[data-ticket-tenx-save],[data-ticket-tenx-clear]'))schedule();
  },true);
  new MutationObserver(schedule).observe(app,{childList:true,subtree:false});
  runtime?.onRoute?.(schedule,{immediate:true});
  runtime?.onAppRender?.(schedule,{immediate:true});
  addEventListener('hashchange',schedule);
  schedule();
})();