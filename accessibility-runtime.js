import './blank-state-runtime.js';
import './continue-command-v35.js';
import './my-titans-home-v35.js';
import './my-player-watch-v36.js';
import './gameday-personal-v37.js';
import './my-player-impact-v38.js';
import './schedule-calendar-v39.js';
import './roster-filter-guard-v40.js';
import './fantasy-weekly-command-v42.js';

const menu=document.querySelector('#menu-button');
const sidebar=document.querySelector('#sidebar');
const app=document.querySelector('#app');
const TEAM_VIEWS=new Set(['roster','depth','staff','cutdown']);
let teamRoomQueued=false;

function installMobileReadabilityFloor(){
  if(document.querySelector('#tcc-mobile-type-floor-v44'))return;
  const style=document.createElement('style');
  style.id='tcc-mobile-type-floor-v44';
  style.textContent=`
    @media (max-width:760px){
      #app small{font-size:10px!important;line-height:1.35!important}
      #app .pulse-item small,
      #app .fan-tile .tile-label,
      #app .fan-hero-brand .era-chip,
      #app .legacy-peek span,
      #app .legal-mark-note,
      #app .home-quality-strip span,
      #app .roster-summary-strip span,
      #app .transaction-source-link,
      #app .game-day-brief-head a,
      #app .fan-health-item small,
      #app .warehouse-health-head>span,
      #app .warehouse-health-card span,
      #app .source-quality-meta span{
        font-size:10px!important;
        line-height:1.35!important;
      }
    }
  `;
  document.head.appendChild(style);
}

installMobileReadabilityFloor();
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
function reconcileTeamRoom(){
  if(!app||teamRoomRoute()!=='roster')return;
  const switcher=app.querySelector('.team-room-switcher');
  if(!switcher)return;
  const stored=TEAM_VIEWS.has(app.dataset.teamRoomView)?app.dataset.teamRoomView:null;
  const pressed=[...switcher.querySelectorAll('[data-team-room-view]')].find(button=>button.getAttribute('aria-pressed')==='true')?.dataset.teamRoomView;
  const next=requestedTeamView()||stored||(TEAM_VIEWS.has(pressed)?pressed:'roster');
  const button=switcher.querySelector(`[data-team-room-view="${next}"]`);
  if(button&&teamRoomMismatch(next))button.click();
}
function scheduleTeamRoomReconcile(){
  if(teamRoomQueued)return;
  teamRoomQueued=true;
  queueMicrotask(()=>{teamRoomQueued=false;reconcileTeamRoom();});
}
function watchTeamRoomMutations(records){
  const relevant=records.some(record=>record.type==='childList'||(record.type==='attributes'&&record.target instanceof Element&&record.target.matches('[data-team-room-view]')));
  if(relevant)scheduleTeamRoomReconcile();
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
  new MutationObserver(watchTeamRoomMutations).observe(app,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-pressed']});
}
addEventListener('hashchange',scheduleTeamRoomReconcile);
syncAsyncRegions();
scheduleTeamRoomReconcile();
