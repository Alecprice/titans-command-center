import './tickets-tenx-v123.js';
import './tickets-trend-v124.js';

(() => {
  'use strict';
  if(window.__TitansTicketPriceFallbackV58)return;
  window.__TitansTicketPriceFallbackV58=true;

  const app=document.querySelector('#app');
  if(!app)return;
  let queued=false;

  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const replacement='Check live price';

  function apply(){
    queued=false;
    if(route()!=='tickets')return;
    const center=app.querySelector('[data-ticket-center]');
    if(!center)return;
    center.querySelectorAll('.tickets-price-block strong,.tickets-offer-price b,.tickets-hero-price-rule strong').forEach(node=>{
      if(node.textContent.trim()==='Price unavailable')node.textContent=replacement;
    });
    center.querySelectorAll('.tickets-price-block em').forEach(node=>{
      if(node.textContent.trim()==='Single-source price')node.textContent='Live price pending · open marketplace';
    });
  }

  function schedule(){
    if(queued)return;
    queued=true;
    queueMicrotask(apply);
  }

  new MutationObserver(schedule).observe(app,{childList:true,subtree:false});
  addEventListener('hashchange',schedule);
  schedule();
})();
