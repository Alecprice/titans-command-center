import './blank-state-runtime.js';
import './continue-command-v35.js';
import './my-titans-home-v35.js';
import './my-player-watch-v36.js';
import './gameday-personal-v37.js';
import './my-player-impact-v38.js';
import './my-player-compare-v39.js';

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
function teamRoomMismatch(next){
  if(!app||teamRoomRoute()!=='roster')return false;
  const switcher=app.querySelector('.team-room-switcher');
  const button=switcher?.querySelector(`[data-team-room-view="${next}"]`);
  const panel=app.querySelector(`.team-room-panel[data-panel="${next}"]`);
  const baseVisible=next==='roster';
  const baseMismatch=[...app.querySelectorAll('.roster-summary-strip,.filterbar,.roster-status-filters,#rg')].some(element=>element.hidden===baseVisible);
  return Boolean(button&&(button.getAttribute('aria-pressed')!=='true'||button.classList.contains('active')===false||(panel&&panel.hidden)||baseMismatch));
}
function applyTeamRoomFallback(next){
  if(!app||teamRoomRoute()!=='roster'||!TEAM_VIEWS.has(next))return;
  const switcher=app.querySelector('.team-room-switcher');
  if(!switcher)return;
  app.dataset.teamRoomView=next;
  switcher.querySelectorAll('[data-team-room-view]').forEach(button=>{
    const selected=button.dataset.teamRoomView===next;
    button.classList.toggle('active',selected);
    button.setAttribute('aria-pressed',String(selected));
  });
  app.querySelectorAll('.team-room-panel').forEach(panel=>{panel.hidden=panel.dataset.panel!==next;});
  const hideRoster=next!=='roster';
  app.querySelectorAll('.roster-summary-strip,.filterbar,.roster-status-filters,#rg').forEach(element=>{element.hidden=hideRoster;});
}
function reconcileTeamRoom(){
  if(!app||teamRoomRoute()!=='roster')return;
  const switcher=app.querySelector('.team-room-switcher');
  if(!switcher)return;
  const stored=TEAM_VIEWS.has(app.dataset.teamRoomView)?app.dataset.teamRoomView:null;
  const pressed=[...switcher.querySelectorAll('[data-team-room-view]')].find(button=>button.getAttribute('aria-pressed')==='true')?.dataset.teamRoomView;
  const next=requestedTeamView()||stored||(TEAM_VIEWS.has(pressed)?pressed:'roster');
  const button=switcher.querySelector(`[data-team-room-view="${next}"]`);
  if(!button||!teamRoomMismatch(next))return;
  button.click();
  queueMicrotask(()=>{if(teamRoomMismatch(next))applyTeamRoomFallback(next);});
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
  new MutationObserver(scheduleTeamRoomReconcile).observe(app,{subtree:true,childList:true});
  app.addEventListener('click',event=>{
    const button=event.target instanceof Element?event.target.closest('[data-team-room-view]'):null;
    if(button&&app.contains(button))scheduleTeamRoomReconcile();
  },true);
}
addEventListener('hashchange',scheduleTeamRoomReconcile);
syncAsyncRegions();
scheduleTeamRoomReconcile();
