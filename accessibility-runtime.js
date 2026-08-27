import './blank-state-runtime.js';

const menu=document.querySelector('#menu-button');
const sidebar=document.querySelector('#sidebar');
const app=document.querySelector('#app');
const TEAM_VIEWS=new Set(['roster','depth','staff','cutdown']);
let teamRoomQueued=false;

if(app&&!app.hasAttribute('tabindex'))app.setAttribute('tabindex','-1');

function syncMenuState(){
  if(!menu||!sidebar)return;
  const open=sidebar.classList.contains('open');
  menu.setAttribute('aria-controls','sidebar');
  menu.setAttribute('aria-expanded',String(open));
  menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');
}

function syncAsyncRegions(){
  document.querySelectorAll('.legacy-page[data-polished]').forEach(page=>page.setAttribute('aria-busy','false'));
}

function teamRoomRoute(){return location.hash.replace(/^#/,'').split('?')[0]||'home';}
function requestedTeamView(){
  const value=new URLSearchParams(location.hash.split('?')[1]||'').get('view');
  return TEAM_VIEWS.has(value)?value:null;
}
function syncTeamViewUrl(view){
  if(teamRoomRoute()!=='roster')return;
  const params=new URLSearchParams(location.hash.split('?')[1]||'');
  if(view==='roster')params.delete('view');else params.set('view',view);
  const query=params.toString(),next=`#roster${query?`?${query}`:''}`;
  if(location.hash!==next)history.replaceState(history.state,'',next);
}
function reconcileTeamRoom(explicitView=null,{syncUrl=false}={}){
  if(!app||teamRoomRoute()!=='roster')return;
  const switcher=app.querySelector('.team-room-switcher');
  if(!switcher)return;
  const stored=TEAM_VIEWS.has(app.dataset.teamRoomView)?app.dataset.teamRoomView:null;
  const pressed=[...switcher.querySelectorAll('[data-team-room-view]')].find(button=>button.getAttribute('aria-pressed')==='true')?.dataset.teamRoomView;
  const next=TEAM_VIEWS.has(explicitView)?explicitView:(requestedTeamView()||stored||(TEAM_VIEWS.has(pressed)?pressed:'roster'));
  app.dataset.teamRoomView=next;
  switcher.querySelectorAll('[data-team-room-view]').forEach(button=>{
    const selected=button.dataset.teamRoomView===next;
    button.classList.toggle('active',selected);
    button.setAttribute('aria-pressed',String(selected));
  });
  app.querySelectorAll('.team-room-panel').forEach(panel=>{panel.hidden=panel.dataset.panel!==next;});
  const hideRoster=next!=='roster';
  app.querySelectorAll('.roster-summary-strip,.filterbar,.roster-status-filters,#rg').forEach(element=>{element.hidden=hideRoster;});
  if(syncUrl)syncTeamViewUrl(next);
}
function scheduleTeamRoomReconcile(){
  if(teamRoomQueued)return;
  teamRoomQueued=true;
  queueMicrotask(()=>{teamRoomQueued=false;reconcileTeamRoom();});
}

if(menu&&sidebar){
  syncMenuState();
  new MutationObserver(syncMenuState).observe(sidebar,{attributes:true,attributeFilter:['class']});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&sidebar.classList.contains('open')){
      sidebar.classList.remove('open');
      menu.focus();
    }
  });
}

if(app){
  new MutationObserver(syncAsyncRegions).observe(app,{subtree:true,childList:true,attributes:true,attributeFilter:['data-polished']});
  new MutationObserver(scheduleTeamRoomReconcile).observe(app,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','aria-pressed','data-team-room-view']});
  app.addEventListener('click',event=>{
    const button=event.target instanceof Element?event.target.closest('[data-team-room-view]'):null;
    if(button&&app.contains(button))reconcileTeamRoom(button.dataset.teamRoomView,{syncUrl:true});
  },true);
}
addEventListener('hashchange',scheduleTeamRoomReconcile);
syncAsyncRegions();
scheduleTeamRoomReconcile();
