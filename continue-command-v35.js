(() => {
  'use strict';
  if(window.__TitansContinueCommandV35)return;
  window.__TitansContinueCommandV35=true;

  const STORE='titans:v35ContinueCommand';
  const MAX_HREF=180;
  const MAX_AGE_MS=14*24*60*60*1000;
  const FUTURE_SKEW_MS=5*60*1000;
  const app=document.querySelector('#app');
  const runtime=window.TitansRuntime;
  const labels={live:'Game Day',games:'Schedule',roster:'Team Room',transactions:'Transactions',stats:'Stats Lab',fantasy:'Fantasy Command',markets:'Market Pulse',feed:'Intel Feed',legacy:'Legacy',sources:'Sources',fan:'Fan Hub',media:'Listen / Watch',command:'Command Intel',player:'Player Intelligence'};
  const details={
    live:'Return to the game-day view you opened',
    games:'Return to the schedule you were viewing',
    roster:'Return to Team Room',
    transactions:'Return to the roster-move feed',
    stats:'Return to Stats Lab',
    fantasy:'Return to Fantasy Command',
    markets:'Return to Market Pulse',
    feed:'Return to Titans intel',
    legacy:'Return to the Titans museum',
    sources:'Return to source details',
    fan:'Return to Fan Hub',
    media:'Return to Listen / Watch',
    command:'Return to Command Intelligence',
    player:'Return to Player Intelligence'
  };

  const routeOf=value=>String(value||'#home').replace(/^#/,'').split('?')[0]||'home';
  const route=()=>runtime?.route?.()||routeOf(location.hash);
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeHref=value=>{
    const href=String(value||'').slice(0,MAX_HREF);
    if(!href.startsWith('#')||href.includes('\n')||href.includes('\r'))return '';
    const current=routeOf(href);
    return current!=='home'&&labels[current]?href:'';
  };
  const storageGet=()=>{
    if(runtime?.storage?.getJSON)return runtime.storage.getJSON(STORE,null);
    try{return JSON.parse(localStorage.getItem(STORE)||'null')}catch{return null}
  };
  const storageSet=value=>{
    if(runtime?.storage?.setJSON)return runtime.storage.setJSON(STORE,value);
    try{localStorage.setItem(STORE,JSON.stringify(value));return true}catch{return false}
  };
  const clear=()=>{
    if(runtime?.storage?.remove)return runtime.storage.remove(STORE);
    try{localStorage.removeItem(STORE);return true}catch{return false}
  };

  function read(){
    const value=storageGet();
    if(!value||typeof value!=='object'||Array.isArray(value))return null;
    const href=safeHref(value.href);
    const savedAt=Date.parse(String(value.savedAt||''));
    const age=Date.now()-savedAt;
    if(!href||!Number.isFinite(savedAt)||age>MAX_AGE_MS||age< -FUTURE_SKEW_MS){
      clear();
      return null;
    }
    return {href,savedAt:new Date(savedAt).toISOString()};
  }

  function remember(){
    const current=route();
    if(current==='home'||!labels[current])return;
    const href=safeHref(location.hash||`#${current}`);
    if(!href)return;
    storageSet({href,savedAt:new Date().toISOString()});
  }

  function placement(){
    const deck=app?.querySelector('[data-v10-home]');
    if(deck)return {anchor:deck,state:'after-deck'};
    const launchpad=app?.querySelector('.home-command-v123');
    if(launchpad)return {anchor:launchpad,state:'after-launchpad'};
    const hero=app?.querySelector('.fan-hero');
    return hero?{anchor:hero,state:'after-hero'}:null;
  }

  function injectStyle(){
    if(document.querySelector('#continue-command-v35-style'))return;
    const style=document.createElement('style');
    style.id='continue-command-v35-style';
    style.textContent='.continue-command-v35{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:0 0 12px;padding:10px 12px;border:1px solid rgba(134,210,255,.2);border-radius:13px;background:rgba(8,25,43,.7);box-shadow:0 8px 20px rgba(0,0,0,.1)}.continue-command-v35-copy{display:flex;align-items:baseline;gap:8px;min-width:0;flex-wrap:wrap}.continue-command-v35 small{color:#8ad8f8;font-size:.68rem;font-weight:950;letter-spacing:.11em}.continue-command-v35 strong{color:#fff;font-size:.9rem}.continue-command-v35 span{color:#bfd2e1;font-size:.74rem;line-height:1.4}.continue-command-v35-actions{display:flex;gap:7px;align-items:center;flex:0 0 auto}.continue-command-v35 a,.continue-command-v35 button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;border-radius:10px;font:inherit;font-size:.76rem;font-weight:900;cursor:pointer}.continue-command-v35 a{padding:0 12px;border:1px solid rgba(138,216,248,.38);background:rgba(75,146,219,.16);color:#f7fbff;text-decoration:none}.continue-command-v35 button{width:44px;border:1px solid rgba(255,255,255,.16);background:transparent;color:#d8e7f2}.continue-command-v35 :focus-visible{outline:3px solid #fff;outline-offset:2px}@media(max-width:620px){.continue-command-v35{align-items:stretch;flex-direction:column;gap:9px;padding:11px}.continue-command-v35-copy{display:grid;gap:2px}.continue-command-v35-actions{width:100%}.continue-command-v35 a{flex:1;min-height:48px}.continue-command-v35 button{width:48px;height:48px}}@media(prefers-reduced-motion:reduce){.continue-command-v35 *{scroll-behavior:auto!important}}';
    document.head.appendChild(style);
  }

  function mount(){
    if(!app||route()!=='home')return;
    const saved=read();
    let card=app.querySelector('.continue-command-v35');
    if(!saved){card?.remove();return;}
    const place=placement();
    if(!place){card?.remove();return;}
    if(!card){
      card=document.createElement('section');
      card.className='continue-command-v35';
      card.setAttribute('aria-label','Continue where you left off');
    }
    if(card.previousElementSibling!==place.anchor)place.anchor.insertAdjacentElement('afterend',card);
    card.dataset.placement=place.state;
    const current=routeOf(saved.href);
    const label=labels[current];
    const detail=details[current]||'Pick up where you left off';
    const signature=JSON.stringify([saved.href,current,place.state]);
    if(card.dataset.signature===signature)return;
    card.dataset.signature=signature;
    card.innerHTML=`<div class="continue-command-v35-copy"><small>RESUME</small><strong>${esc(label)}</strong><span>${esc(detail)} · saved on this device for up to 14 days</span></div><div class="continue-command-v35-actions"><a href="${esc(saved.href)}" aria-label="Continue to ${esc(label)}">Continue →</a><button type="button" data-clear-continue aria-label="Clear continue shortcut">×</button></div>`;
  }

  function sync(current=route()){
    if(current!=='home')remember();
    queueMicrotask(mount);
  }

  app?.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target.closest('[data-clear-continue]'):null;
    if(!target)return;
    clear();
    target.closest('.continue-command-v35')?.remove();
  });

  if(runtime){
    runtime.onRoute(sync,{immediate:true});
    runtime.onAppRender(()=>queueMicrotask(mount),{immediate:true});
  }else{
    addEventListener('hashchange',()=>sync(route()));
    queueMicrotask(()=>sync(route()));
  }
  injectStyle();
})();
