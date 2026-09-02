(() => {
  'use strict';

  if(window.__TitansTicketDecisionSettleV149)return;

  const app=document.querySelector('#app');
  const runtime=window.TitansRuntime;
  if(!app)return;

  const SHORTLIST_KEY='titans:tickets-shortlist-v123';
  const SHORTLIST_CHANGE='titans:ticket-shortlist-change';
  const state=window.__TitansTicketDecisionSettleV149={checks:0,repairs:0,last:null};
  let frameQueued=false;

  function route(){
    return runtime?.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';
  }

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

  function expectsSignal(center){
    return [...center.querySelectorAll('.tickets-compare-card[data-ticket-tenx-key]')].some(card=>{
      const price=Number(card.dataset.ticketTenxPrice);
      const sources=Number(card.dataset.ticketTenxSources);
      return (Number.isFinite(price)&&price>0)||(Number.isFinite(sources)&&sources>0);
    });
  }

  function snapshot(center,items){
    const compare=compareMatches(center,items);
    const finalists=items.length===0||Boolean(center.querySelector('[data-ticket-finalists-v127]'));
    const signalRequired=items.length>0&&expectsSignal(center);
    const signal=!signalRequired||Boolean(center.querySelector('[data-ticket-signal-lens-v128]'));
    return {
      savedCount:items.length,
      compare,
      finalists,
      signal,
      signalRequired,
      settled:compare&&finalists&&signal
    };
  }

  function reconcile(){
    frameQueued=false;
    if(route()!=='tickets')return;
    const center=app.querySelector('[data-ticket-center]');
    if(!center)return;
    const items=saved();
    const report=snapshot(center,items);
    state.checks+=1;
    state.last=report;
    if(report.settled)return;

    state.repairs+=1;
    window.dispatchEvent(new StorageEvent('storage',{
      key:SHORTLIST_KEY,
      newValue:JSON.stringify(items)
    }));
  }

  function scheduleReconcile(){
    if(frameQueued)return;
    frameQueued=true;
    requestAnimationFrame(reconcile);
  }

  app.addEventListener(SHORTLIST_CHANGE,scheduleReconcile);
})();
