import './team-room-aria-diagnostic-v55.js';

(() => {
  'use strict';
  if(window.__TitansTeamRoomStateRepairV54)return;
  window.__TitansTeamRoomStateRepairV54=true;

  const VIEWS=new Set(['roster','depth','staff','cutdown']);
  const app=document.querySelector('#app');
  if(!app)return;
  let queued=false;

  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const requested=()=>{
    const view=new URLSearchParams(location.hash.split('?')[1]||'').get('view');
    return VIEWS.has(view)?view:null;
  };
  const selected=()=>{
    const view=app.dataset.teamRoomView;
    if(VIEWS.has(view))return view;
    const pressed=app.querySelector('.team-room-switcher [data-team-room-view][aria-pressed="true"]')?.dataset.teamRoomView;
    return VIEWS.has(pressed)?pressed:'roster';
  };
  const targetView=()=>requested()||selected();

  function hasMismatch(view){
    if(route()!=='roster'||!VIEWS.has(view))return false;
    const switcher=app.querySelector('.team-room-switcher');
    if(!switcher)return false;
    const button=switcher.querySelector(`[data-team-room-view="${view}"]`);
    if(!button)return false;
    const panel=view==='roster'?null:app.querySelector(`.team-room-panel[data-panel="${view}"]`);
    const baseShouldHide=view!=='roster';
    const baseMismatch=[...app.querySelectorAll('.roster-summary-strip,.filterbar,.roster-status-filters,#rg')].some(element=>element.hidden!==baseShouldHide);
    return button.getAttribute('aria-pressed')!=='true'||!button.classList.contains('active')||(panel&&panel.hidden)||baseMismatch;
  }

  function repair(){
    queued=false;
    if(route()!=='roster')return;
    const view=targetView();
    if(!hasMismatch(view))return;
    const switcher=app.querySelector('.team-room-switcher');
    if(!switcher)return;

    app.dataset.teamRoomView=view;
    switcher.querySelectorAll('[data-team-room-view]').forEach(button=>{
      const active=button.dataset.teamRoomView===view;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    app.querySelectorAll('.team-room-panel').forEach(panel=>{panel.hidden=panel.dataset.panel!==view;});
    const hideBase=view!=='roster';
    app.querySelectorAll('.roster-summary-strip,.filterbar,.roster-status-filters,#rg').forEach(element=>{element.hidden=hideBase;});
  }

  function schedule(){
    if(queued)return;
    queued=true;
    queueMicrotask(repair);
  }

  const observer=new MutationObserver(records=>{
    if(route()!=='roster')return;
    const relevant=records.some(record=>
      record.type==='childList'||
      (record.type==='attributes'&&record.target instanceof Element&&(
        record.target.matches('[data-team-room-view]')||
        record.target.matches('.team-room-panel')
      ))
    );
    if(relevant)schedule();
  });
  observer.observe(app,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-pressed','class','hidden']});
  addEventListener('hashchange',schedule);
  schedule();
})();
