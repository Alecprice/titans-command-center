import './runtime-v19.js';
import './mode-365-v19.js';
import './mobile-navigation-v112.js?v=2';
import('./freshness-truth-v20.js').catch(()=>{});

const app=document.querySelector('#app');
const sidebar=document.querySelector('#sidebar');
const menuButton=document.querySelector('#menu-button');
const mobileMore=document.querySelector('#mobile-more-button');
const refreshButton=document.querySelector('#refresh-button');
const toast=document.querySelector('#toast');
const globalSearch=document.querySelector('#global-search');
const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
const queryParams=()=>new URLSearchParams(location.hash.split('?')[1]||'');
const expectedTitles={games:'Games & Schedule',roster:'Roster',transactions:'Transactions',stats:'Stats Lab',markets:'Odds & Props',feed:'Intel Feed',sources:'Sources',live:'Game Day Center',legacy:'Legacy',player:'Player profile',search:null};
const mobilePrimary=new Set(['home','live','roster']);
const sectionTargets=[
  {hash:'#live',label:'Game Day',terms:'game live scoreboard kickoff score'},
  {hash:'#games',label:'Schedule',terms:'schedule games calendar opponent week'},
  {hash:'#roster',label:'Roster',terms:'roster players depth chart personnel'},
  {hash:'#transactions',label:'Transactions',terms:'transactions moves signings releases waivers roster moves'},
  {hash:'#stats',label:'Stats Lab',terms:'stats statistics preseason leaders analytics numbers'},
  {hash:'#markets',label:'Market Pulse',terms:'market odds lines props spread moneyline total'},
  {hash:'#feed',label:'Intel Feed',terms:'news intel updates reports stories'},
  {hash:'#legacy',label:'Legacy',terms:'legacy history oilers logos throwback retro'},
  {hash:'#sources',label:'Sources',terms:'sources data provenance audit'}
];
let navWatch=0;
let toastTimer=0;
let hadController=Boolean(navigator.serviceWorker?.controller);

function showToast(message,ms=2600){
  if(!toast)return;
  toast.textContent=message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('show'),ms);
}

function syncNav(){
  const current=route();
  document.querySelectorAll('[data-route]').forEach(link=>{
    const active=link.dataset.route===current;
    link.classList.toggle('active',active);
    if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
  });
  if(mobileMore){
    const moreActive=!mobilePrimary.has(current);
    mobileMore.classList.toggle('active',moreActive);
    mobileMore.setAttribute('aria-pressed',String(moreActive&&sidebar?.classList.contains('open')));
  }
}

function syncSidebar(){
  const open=Boolean(sidebar?.classList.contains('open'));
  const hidden=matchMedia('(max-width:760px)').matches&&!open;
  menuButton?.setAttribute('aria-expanded',String(open));
  mobileMore?.setAttribute('aria-expanded',String(open));
  document.body.classList.toggle('nav-open',open);
  if(sidebar){sidebar.setAttribute('aria-hidden',String(hidden));sidebar.inert=hidden;}
}

function closeSidebar(){
  sidebar?.classList.remove('open');
  syncSidebar();
}

function routeLooksRendered(current){
  if(!app)return true;
  if(current==='home')return Boolean(app.querySelector('.fan-hero'));
  if(current==='search')return Boolean(app.querySelector('.page-head h1'));
  if(current==='player')return Boolean(app.querySelector('.page-head h1'));
  const expected=expectedTitles[current];
  if(!expected)return Boolean(app.firstElementChild);
  return app.querySelector('.page-head h1')?.textContent?.trim()===expected;
}

function renderRecovery(current){
  if(!app||route()!==current||routeLooksRendered(current))return;
  app.removeAttribute('aria-busy');
  app.innerHTML=`<section class="route-recovery" role="alert"><div class="eyebrow">Navigation recovery</div><h1>This page did not finish loading.</h1><p>The rest of Titans Command Center is still available. Retry this page or return home.</p><div class="route-recovery-actions"><button class="button primary" type="button" data-route-retry>Retry page</button><a class="button" href="#home">Go home</a></div></section>`;
  showToast('Page recovery mode opened.');
}

function enhanceSearchPage(){
  if(route()!=='search'||!app||app.querySelector('.search-route-shortcuts'))return;
  const head=app.querySelector('.page-head');
  if(!head)return;
  const query=(queryParams().get('q')||'').trim().toLowerCase();
  if(!query)return;
  const matches=sectionTargets.filter(item=>`${item.label} ${item.terms}`.toLowerCase().includes(query)||query.split(/\s+/).some(word=>word.length>2&&`${item.label} ${item.terms}`.toLowerCase().includes(word))).slice(0,5);
  if(!matches.length)return;
  const section=document.createElement('section');
  section.className='search-route-shortcuts';
  section.innerHTML=`<div><small>Quick jump</small><strong>Go straight to a section</strong></div><div class="search-route-links">${matches.map(item=>`<a href="${item.hash}">${item.label}<span aria-hidden="true">→</span></a>`).join('')}</div>`;
  head.insertAdjacentElement('afterend',section);
}

function settleRoute({focus=true}={}){
  const current=route();
  clearTimeout(navWatch);
  closeSidebar();
  syncNav();
  if(refreshButton){
    const show=current==='home'||current==='live'||current==='games';
    refreshButton.hidden=!show;
    refreshButton.title='Refresh scoreboard';
    refreshButton.setAttribute('aria-label','Refresh scoreboard');
  }
  if(app)app.setAttribute('aria-busy','true');
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if(route()!==current)return;
    app?.removeAttribute('aria-busy');
    enhanceSearchPage();
    if(focus){
      try{window.scrollTo({top:0,left:0,behavior:'instant'});}catch{window.scrollTo(0,0)}
      app?.focus({preventScroll:true});
    }
    syncNav();
  }));
  navWatch=setTimeout(()=>{renderRecovery(current);enhanceSearchPage();},1200);
}

function showUpdateReady(){
  if(document.querySelector('.app-update-banner'))return;
  const banner=document.createElement('div');
  banner.className='app-update-banner';
  banner.setAttribute('role','status');
  banner.innerHTML='<span><strong>Update ready</strong><small>A newer, more reliable version is available.</small></span><button class="button primary" type="button" data-update-reload>Reload</button><button class="update-dismiss" type="button" aria-label="Dismiss update notice">×</button>';
  document.body.appendChild(banner);
}

function trapMobileDrawerFocus(event){
  if(event.key!=='Tab'||!sidebar?.classList.contains('open')||!matchMedia('(max-width:760px)').matches)return;
  const focusable=[...sidebar.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>!el.hidden&&el.getClientRects().length);
  if(!focusable.length)return;
  const first=focusable[0],last=focusable.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
}

document.addEventListener('click',event=>{
  const target=event.target;
  if(!(target instanceof Element))return;
  if(target.closest('[data-route-retry]')){location.reload();return;}
  if(target.closest('[data-update-reload]')){location.reload();return;}
  if(target.closest('.update-dismiss')){target.closest('.app-update-banner')?.remove();return;}
  if(target.closest('#mobile-more-button')){
    sidebar?.classList.toggle('open');
    syncSidebar();
    if(sidebar?.classList.contains('open'))requestAnimationFrame(()=>sidebar.querySelector('a[href]')?.focus());
    return;
  }
  if(sidebar?.classList.contains('open')&&matchMedia('(max-width:760px)').matches&&!target.closest('#sidebar')&&!target.closest('#menu-button'))closeSidebar();
});

document.addEventListener('keydown',event=>{
  trapMobileDrawerFocus(event);
  if(event.key==='Escape'&&sidebar?.classList.contains('open')){closeSidebar();(mobileMore||menuButton)?.focus();return;}
  if(event.key==='/'&&!event.metaKey&&!event.ctrlKey&&!event.altKey&&document.activeElement?.tagName!=='INPUT'&&document.activeElement?.tagName!=='TEXTAREA'){event.preventDefault();globalSearch?.focus();}
});
window.addEventListener('hashchange',()=>settleRoute({focus:true}));
window.addEventListener('resize',syncSidebar,{passive:true});
window.addEventListener('online',()=>showToast('Back online. Live data can refresh again.'));
window.addEventListener('offline',()=>showToast('You are offline. Showing cached Titans content.',3600));
window.addEventListener('error',()=>setTimeout(()=>renderRecovery(route()),0));
window.addEventListener('unhandledrejection',()=>setTimeout(()=>renderRecovery(route()),0));
if(app)new MutationObserver(()=>queueMicrotask(enhanceSearchPage)).observe(app,{childList:true});
if(sidebar)new MutationObserver(syncSidebar).observe(sidebar,{attributes:true,attributeFilter:['class']});
if('serviceWorker'in navigator){
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
    if(hadController)showUpdateReady();
    hadController=true;
  });
}

syncSidebar();
syncNav();
settleRoute({focus:false});