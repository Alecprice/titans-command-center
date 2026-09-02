(() => {
  'use strict';
  if(window.__TitansTeamRoomStateRepairV54)return;
  window.__TitansTeamRoomStateRepairV54=true;

  const VIEWS=new Set(['roster','depth','staff','cutdown']);
  const TEAM_ROOM_VIEW_REQUEST='titans:team-room-view-request';
  const app=document.querySelector('#app');
  if(!app)return;
  let queued=false;

  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const requested=()=>{
    const view=new URLSearchParams(location.hash.split('?')[1]||'').get('view');
    return VIEWS.has(view)?view:null;
  };
  const selected=()=>{
    const view=app.dataset.teamRoomActiveView;
    if(VIEWS.has(view))return view;
    const pressed=app.querySelector('.team-room-switcher [data-team-room-view][aria-pressed="true"]')?.dataset.teamRoomView;
    return VIEWS.has(pressed)?pressed:'roster';
  };
  const targetView=()=>requested()||selected();

  function ensureRosterDiscoveryStyles(){
    if(document.querySelector('#tenx-roster-mobile-discovery-v132'))return;
    const style=document.createElement('style');
    style.id='tenx-roster-mobile-discovery-v132';
    style.textContent=`
      .roster-unit-quickrail{flex:1 0 100%;display:flex;align-items:center;gap:7px;min-width:0;overflow-x:auto;overscroll-behavior-inline:contain;scroll-snap-type:x proximity;padding:2px 0 1px;scrollbar-width:none}
      .roster-unit-quickrail::-webkit-scrollbar{display:none}
      .roster-unit-quickrail>span{flex:0 0 auto;color:var(--tcc-dark-muted,var(--muted));font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
      .roster-unit-quickrail button{flex:0 0 auto;min-height:40px;padding:8px 12px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.045);color:var(--text);font:inherit;font-size:12px;font-weight:850;cursor:pointer;scroll-snap-align:start}
      .roster-unit-quickrail button[aria-pressed="true"]{background:var(--blue);border-color:var(--blue-2);color:#03111e}
      .roster-unit-quickrail button:focus-visible{outline:3px solid #9edcff;outline-offset:3px}
      @media(max-width:640px){
        body[data-route="roster"] .filterbar{display:grid;grid-template-columns:minmax(0,1fr);gap:10px}
        body[data-route="roster"] .filterbar>input,body[data-route="roster"] .filterbar>select{width:100%;min-width:0;min-height:48px;font-size:16px}
        .roster-unit-quickrail{width:100%;margin:0;padding-bottom:5px}
        .roster-unit-quickrail>span{font-size:12px}
        .roster-unit-quickrail button{min-height:48px;font-size:13px;padding-inline:14px}
      }
      @media(max-width:430px){
        body[data-route="roster"] .roster-grid .player-card{grid-template-columns:52px minmax(0,1fr);align-items:start;min-height:96px;padding:14px;gap:10px 12px}
        body[data-route="roster"] .roster-grid .player-card>div:nth-child(2){min-width:0;padding-top:3px}
        body[data-route="roster"] .roster-grid .player-card h3{font-size:16px;line-height:1.25;overflow-wrap:anywhere}
        body[data-route="roster"] .roster-grid .player-card p{line-height:1.45}
        body[data-route="roster"] .roster-grid .player-tag{grid-column:2;justify-self:start;max-width:100%;margin-top:-2px;text-align:left;white-space:normal;overflow-wrap:anywhere}
      }
      @media(max-width:360px){
        body[data-route="roster"] .roster-grid .player-card{grid-template-columns:46px minmax(0,1fr);padding:12px}
        body[data-route="roster"] .roster-grid .jersey{width:46px;height:46px;border-radius:13px;font-size:19px}
      }
      @media(prefers-reduced-motion:reduce){.roster-unit-quickrail{scroll-behavior:auto}}
    `;
    document.head.append(style);
  }

  function syncRosterUnitRail(){
    const bar=app.querySelector('.filterbar');
    const unit=bar?.querySelector('#ru');
    const rail=bar?.querySelector('.roster-unit-quickrail');
    if(!unit||!rail)return;
    const selectedUnit=String(unit.value||'all').toLowerCase();
    rail.querySelectorAll('[data-roster-unit-quick]').forEach(control=>{
      const active=String(control.dataset.rosterUnitQuick||'all').toLowerCase()===selectedUnit;
      control.setAttribute('aria-pressed',String(active));
    });
  }

  function enhanceRosterDiscovery(){
    if(route()!=='roster')return;
    const bar=app.querySelector('.filterbar');
    const unit=bar?.querySelector('#ru');
    if(!bar||!unit)return;
    ensureRosterDiscoveryStyles();
    let rail=bar.querySelector('.roster-unit-quickrail');
    if(!rail){
      rail=document.createElement('div');
      rail.className='roster-unit-quickrail';
      rail.setAttribute('role','group');
      rail.setAttribute('aria-label','Quick roster unit filters');
      rail.innerHTML='<span aria-hidden="true">Unit</span><button type="button" data-roster-unit-quick="all" aria-pressed="true">All</button><button type="button" data-roster-unit-quick="Offense" aria-pressed="false">Offense</button><button type="button" data-roster-unit-quick="Defense" aria-pressed="false">Defense</button><button type="button" data-roster-unit-quick="Special Teams" aria-pressed="false">Special Teams</button>';
      bar.append(rail);
    }
    syncRosterUnitRail();
  }

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

  function requestRepair(view){
    app.dispatchEvent(new CustomEvent(TEAM_ROOM_VIEW_REQUEST,{detail:{view,persist:false,reason:'semantic-repair'}}));
  }
  function repair(){
    queued=false;
    if(route()!=='roster')return;
    enhanceRosterDiscovery();
    const view=targetView();
    if(hasMismatch(view))requestRepair(view);
  }
  function schedule(){
    if(queued)return;
    queued=true;
    queueMicrotask(repair);
  }

  app.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    const button=target?.closest('[data-roster-unit-quick]');
    if(button&&route()==='roster'){
      const unit=app.querySelector('.filterbar #ru');
      if(unit){
        const next=button.dataset.rosterUnitQuick||'all';
        if([...unit.options].some(option=>option.value===next))unit.value=next;
        else unit.value='all';
        unit.dispatchEvent(new Event('input',{bubbles:true}));
        unit.dispatchEvent(new Event('change',{bubbles:true}));
        syncRosterUnitRail();
      }
    }
    if(target?.closest('[data-roster-clear]'))queueMicrotask(syncRosterUnitRail);
  });
  app.addEventListener('input',event=>{if(event.target instanceof Element&&event.target.matches('#ru'))queueMicrotask(syncRosterUnitRail);});
  app.addEventListener('change',event=>{if(event.target instanceof Element&&event.target.matches('#ru'))queueMicrotask(syncRosterUnitRail);});

  const observer=new MutationObserver(records=>{
    if(route()!=='roster')return;
    const relevant=records.some(record=>
      record.type==='childList'||
      (record.type==='attributes'&&record.target instanceof Element&&(
        record.target.matches('.team-room-switcher [data-team-room-view]')||
        record.target.matches('.team-room-panel')
      ))
    );
    if(relevant)schedule();
  });
  observer.observe(app,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-pressed','class','hidden']});
  addEventListener('hashchange',schedule);
  schedule();
})();