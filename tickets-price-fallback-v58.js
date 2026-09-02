import './tickets-tenx-v123.js';
import './tickets-trend-v124.js';
import './tickets-compare-v125.js';
import './tickets-finalists-v127.js';
import './tickets-signal-lens-v128.js';
import './tickets-decision-settle-v149.js';
import './tickets-decision-rehydrate-v151.js';
import './tickets-target-price-watch-v143.js';
import './tickets-outing-budget-v134.js';
import './tickets-actual-cost-compare-v135.js';

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