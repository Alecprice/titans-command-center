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
const mobileMore=document.querySelector('#mobile-more-button');
const sidebar=document.querySelector('#sidebar');
const app=document.querySelector('#app');
const mobileTypeFloor=matchMedia('(max-width:760px)');
const TEAM_VIEWS=new Set(['roster','depth','staff','cutdown']);
const TEAM_ROOM_VIEW_REQUEST='titans:team-room-view-request';
let teamRoomQueued=false;

function installMobileReadabilityFloor(){
  if(document.querySelector('#tcc-mobile-type-floor-v46'))return;
  const style=document.createElement('style');
  style.id='tcc-mobile-type-floor-v46';
  style.textContent=`
    @media (max-width:760px){
      #app{font-size:16px;line-height:1.5}
      #app p,#app li{line-height:1.5}
      #app small{font-size:12px!important;line-height:1.45!important}
      #app .tcc-mobile-readable-micro{font-size:12px!important;line-height:1.45!important}
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
        font-size:12px!important;
        line-height:1.45!important;
      }
      #app button,
      #app select,
      #app input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]),
      #app [role="button"],
      #app a.button,
      #app a[role="button"]{
        min-width:44px!important;
        min-height:44px!important;
      }
      #app button,#app .button,#app [role="button"]{
        font-size:14px!important;
        line-height:1.25!important;
        white-space:normal;
        overflow-wrap:anywhere;
      }
      #app a:not(.button):not([role="button"]){text-underline-offset:3px}
      #app :is(a,button,input,select,textarea,[role="button"]):focus-visible{
        outline:3px solid currentColor!important;
        outline-offset:3px!important;
      }
      #app input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]),
      #app select,
      #app textarea,
      .search-wrap input{
        font-size:16px!important;
        max-width:100%!important;
        box-sizing:border-box!important;
      }
      #app label:has(input[type="checkbox"]),
      #app label:has(input[type="radio"]){
        min-height:44px;
        display:inline-flex;
        align-items:center;
        gap:8px;
      }
      #app table{
        display:block;
        max-width:100%;
        overflow-x:auto;
        overscroll-behavior-inline:contain;
        -webkit-overflow-scrolling:touch;
      }
      #app img,#app video,#app iframe,#app svg{max-width:100%}
      .menu-button{display:none!important}
      .topbar{padding-left:12px!important}
      .mobile-nav a,.mobile-nav button{
        font-size:12px!important;
        line-height:1.2!important;
        min-height:52px!important;
        min-width:0!important;
        padding-left:4px!important;
        padding-right:4px!important;
        white-space:normal!important;
      }
      .sidebar .nav{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      .sidebar .nav a{font-size:14px!important;line-height:1.25!important;min-height:48px!important;overflow-wrap:anywhere}
      .content{padding-left:14px!important;padding-right:14px!important}
      .panel-body{padding-left:14px!important;padding-right:14px!important}
    }
    @media (max-width:390px){
      .content{padding-left:12px!important;padding-right:12px!important}
      .panel-body{padding-left:12px!important;padding-right:12px!important}
      #app h1{font-size:clamp(24px,8vw,32px)!important;line-height:1.12!important;overflow-wrap:anywhere}
      #app h2{font-size:clamp(20px,6.8vw,28px)!important;line-height:1.16!important;overflow-wrap:anywhere}
      #app h3{overflow-wrap:anywhere}
    }
    @media (max-width:340px){
      .content,.panel-body{padding-left:10px!important;padding-right:10px!important}
      .mobile-nav a,.mobile-nav button{font-size:12px!important;padding-left:2px!important;padding-right:2px!important}
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

function dedupeHomeEnhancements(){
  if(!app)return;
  for(const selector of ['.fan-today[data-fan-v09="today"]','.v10-home[data-v10-home]']){
    const matches=[...app.querySelectorAll(selector)];
    matches.slice(1).forEach(node=>node.remove());
  }
}

function enforceMobileComputedTextFloor(){
  if(!app)return;
  const candidates=[...app.querySelectorAll('small,p,li,span,a,label,time')];
  if(!mobileTypeFloor.matches){
    candidates.forEach(element=>element.classList.remove('tcc-mobile-readable-micro'));
    return;
  }
  candidates.forEach(element=>{
    if(element.classList.contains('tcc-mobile-readable-micro'))return;
    if(!String(element.textContent||'').trim())return;
    const size=Number.parseFloat(getComputedStyle(element).fontSize);
    if(Number.isFinite(size)&&size<12)element.classList.add('tcc-mobile-readable-micro');
  });
}

function syncAsyncRegions(){
  document.querySelectorAll('.legacy-page[data-polished]').forEach(page=>page.setAttribute('aria-busy','false'));
  dedupeHomeEnhancements();
  enforceMobileComputedTextFloor();
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
function requestTeamRoomView(view){
  if(!app||!TEAM_VIEWS.has(view))return;
  app.dispatchEvent(new CustomEvent(TEAM_ROOM_VIEW_REQUEST,{detail:{view,persist:false,reason:'accessibility-reconcile'}}));
}
function reconcileTeamRoom(){
  if(!app||teamRoomRoute()!=='roster')return;
  const switcher=app.querySelector('.team-room-switcher');
  if(!switcher)return;
  const stored=TEAM_VIEWS.has(app.dataset.teamRoomActiveView)?app.dataset.teamRoomActiveView:null;
  const pressed=[...switcher.querySelectorAll('[data-team-room-view]')].find(button=>button.getAttribute('aria-pressed')==='true')?.dataset.teamRoomView;
  const next=requestedTeamView()||stored||(TEAM_VIEWS.has(pressed)?pressed:'roster');
  const button=switcher.querySelector(`[data-team-room-view="${next}"]`);
  if(button&&teamRoomMismatch(next))requestTeamRoomView(next);
}
function scheduleTeamRoomReconcile(){
  if(teamRoomQueued)return;
  teamRoomQueued=true;
  queueMicrotask(()=>{teamRoomQueued=false;reconcileTeamRoom();});
}
function watchTeamRoomMutations(records){
  const relevant=records.some(record=>record.type==='childList'||(record.type==='attributes'&&record.target instanceof Element&&record.target.matches('.team-room-switcher [data-team-room-view]')));
  if(relevant)scheduleTeamRoomReconcile();
}

if(menu&&sidebar){
  syncMenuState();
  new MutationObserver(syncMenuState).observe(sidebar,{attributes:true,attributeFilter:['class']});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&sidebar.classList.contains('open')){
      sidebar.classList.remove('open');
      (mobileTypeFloor.matches?mobileMore:menu)?.focus();
    }
  });
}

if(app){
  new MutationObserver(syncAsyncRegions).observe(app,{subtree:true,childList:true,attributes:true,attributeFilter:['data-polished']});
  new MutationObserver(watchTeamRoomMutations).observe(app,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-pressed']});
}
mobileTypeFloor.addEventListener?.('change',syncAsyncRegions);
addEventListener('hashchange',scheduleTeamRoomReconcile);
syncAsyncRegions();
scheduleTeamRoomReconcile();