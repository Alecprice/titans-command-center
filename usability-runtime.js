const app=document.querySelector('#app');
const sidebar=document.querySelector('#sidebar');
const menuButton=document.querySelector('#menu-button');
const mobileMore=document.querySelector('#mobile-more-button');
const refreshButton=document.querySelector('#refresh-button');
const toast=document.querySelector('#toast');
const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
const expectedTitles={games:'Games & Schedule',roster:'Roster',transactions:'Transactions',stats:'Stats Lab',markets:'Odds & Props',feed:'Intel Feed',sources:'Sources',live:'Game Day Center',legacy:'Legacy',player:'Player profile',search:null};
const mobilePrimary=new Set(['home','live','roster','transactions','stats']);
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
  menuButton?.setAttribute('aria-expanded',String(open));
  mobileMore?.setAttribute('aria-expanded',String(open));
  document.body.classList.toggle('nav-open',open);
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
    if(focus){
      try{window.scrollTo({top:0,left:0,behavior:'instant'});}catch{window.scrollTo(0,0)}
      app?.focus({preventScroll:true});
    }
    syncNav();
  }));
  navWatch=setTimeout(()=>renderRecovery(current),1200);
}

function showUpdateReady(){
  if(document.querySelector('.app-update-banner'))return;
  const banner=document.createElement('div');
  banner.className='app-update-banner';
  banner.setAttribute('role','status');
  banner.innerHTML='<span><strong>Update ready</strong><small>A newer, more reliable version is available.</small></span><button class="button primary" type="button" data-update-reload>Reload</button><button class="update-dismiss" type="button" aria-label="Dismiss update notice">×</button>';
  document.body.appendChild(banner);
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
    return;
  }
  if(sidebar?.classList.contains('open')&&matchMedia('(max-width:760px)').matches&&!target.closest('#sidebar')&&!target.closest('#menu-button'))closeSidebar();
});

document.addEventListener('keydown',event=>{if(event.key==='Escape'&&sidebar?.classList.contains('open')){closeSidebar();menuButton?.focus();}});
window.addEventListener('hashchange',()=>settleRoute({focus:true}));
window.addEventListener('online',()=>showToast('Back online. Live data can refresh again.'));
window.addEventListener('offline',()=>showToast('You are offline. Showing cached Titans content.',3600));
window.addEventListener('error',()=>setTimeout(()=>renderRecovery(route()),0));
window.addEventListener('unhandledrejection',()=>setTimeout(()=>renderRecovery(route()),0));
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
