(() => {
  'use strict';
  const app=document.querySelector('#app');
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const CACHE_KEY='titans:v10Data';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const parse=v=>{try{return JSON.parse(v)}catch{return null}};
  function rowsFrom(data){const rows=data?.markets?.rows||data?.markets||[];return Array.isArray(rows)?rows:[]}
  function fmtPrice(v){const n=Number(v);if(!Number.isFinite(n))return'—';return n>0?`+${Math.round(n)}`:`${Math.round(n)}`}
  function snapshot(data){const rows=rowsFrom(data).slice(0,8);if(!rows.length)return null;const el=document.createElement('section');el.className='v14-market-fast';el.innerHTML=`<header><div><small>FAST SNAPSHOT</small><strong>Market Pulse is loading the full live board</strong><span>Showing the most recent lines already known to this device/app first.</span></div><div class="v14-market-spinner" aria-hidden="true"></div></header><div>${rows.map(r=>`<article><div><small>${esc(r.marketName||r.category||'Market')}</small><strong>${esc(r.entityName||r.eventName||r.side||'Titans')}</strong></div><span>${esc(r.side||'—')}</span><b>${esc(r.line??'—')}</b><em>${fmtPrice(r.price)}</em></article>`).join('')}</div><p>The live board replaces this snapshot automatically when its provider refresh finishes. Source/freshness labels on the full board remain authoritative.</p>`;return el}
  async function ensure(){if(route()!=='markets'||!app||app.querySelector('.market-hub')||app.querySelector('.v14-market-fast'))return;const head=app.querySelector('.page-head');if(!head)return;let data=parse(localStorage.getItem(CACHE_KEY));let el=snapshot(data);if(el){head.insertAdjacentElement('afterend',el);return}try{const r=await fetch('/api/data',{cache:'default'}),d=await r.json();if(route()!=='markets'||app.querySelector('.market-hub')||app.querySelector('.v14-market-fast'))return;el=snapshot(d);if(el)head.insertAdjacentElement('afterend',el)}catch{}}
  function cleanup(){if(app?.querySelector('.market-hub'))app.querySelector('.v14-market-fast')?.remove()}
  if(app)new MutationObserver(()=>queueMicrotask(()=>{cleanup();ensure()})).observe(app,{childList:true,subtree:false});
  window.addEventListener('hashchange',()=>setTimeout(ensure,30));
  setTimeout(ensure,80);
})();
