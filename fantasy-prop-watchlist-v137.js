import('./fantasy-prop-review-v138.js').catch(()=>{});
(() => {
  'use strict';
  const ROUTE='fantasy',ROOT='#fantasy-live-props-v122',STORE='titans-fantasy-prop-watchlist-v1',MAX_ITEMS=32;
  const app=document.querySelector('#app');
  const state={only:false};
  let observer=null,queued=false;

  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const clean=value=>String(value??'').trim();
  const slug=value=>clean(value).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const keyFor=(player,market)=>`${slug(player)}|${slug(market)}`;
  const resumeObserver=()=>{if(observer&&app)observer.observe(app,{childList:true,subtree:true})};
  const moved=row=>Boolean(row.querySelector('.fprop-trend-badge.is-up,.fprop-trend-badge.is-down'));

  function load(){
    try{
      const parsed=JSON.parse(localStorage.getItem(STORE)||'[]');
      if(!Array.isArray(parsed))return [];
      return parsed.filter(item=>item&&typeof item==='object'&&clean(item.player)&&clean(item.market))
        .map(item=>{const player=clean(item.player),market=clean(item.market);return {key:keyFor(player,market),player,market,savedAt:Number(item.savedAt)||0}})
        .sort((a,b)=>b.savedAt-a.savedAt)
        .filter((item,index,list)=>list.findIndex(candidate=>candidate.key===item.key)===index)
        .slice(0,MAX_ITEMS);
    }catch{return []}
  }

  function save(items){
    try{localStorage.setItem(STORE,JSON.stringify(items.slice(0,MAX_ITEMS)))}catch{}
  }

  function rowIdentity(row){
    const player=clean(row.querySelector('.fprop-player strong')?.textContent),market=clean(row.querySelector('.fprop-player span')?.textContent);
    return player&&market?{key:keyFor(player,market),player,market}:null;
  }

  function toggle(identity){
    const items=load(),exists=items.some(item=>item.key===identity.key);
    const next=exists?items.filter(item=>item.key!==identity.key):[{...identity,savedAt:Date.now()},...items.filter(item=>item.key!==identity.key)];
    save(next);decorate();
  }

  function injectStyle(){
    if(document.querySelector('style[data-fantasy-prop-watchlist-v137]'))return;
    const style=document.createElement('style');style.dataset.fantasyPropWatchlistV137='true';style.textContent=`
      .fpw-watch-button{align-self:flex-start;min-height:44px;margin-top:7px;border:1px solid rgba(126,184,238,.28);border-radius:10px;padding:0 10px;background:rgba(16,44,73,.88);color:#dceeff;font:inherit;font-size:.7rem;font-weight:900;cursor:pointer}.fpw-watch-button:hover{background:#183b60}.fpw-watch-button[aria-pressed="true"]{background:#4b92db;color:#071321}.fpw-watch-button:focus-visible,.fpw-tools button:focus-visible{outline:3px solid #7eb8ee;outline-offset:2px}
      .fpw-tools{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 14px;padding:12px 14px;border:1px solid rgba(126,184,238,.2);border-radius:14px;background:rgba(75,146,219,.06)}.fpw-copy strong,.fpw-copy span{display:block}.fpw-copy strong{color:#f5f8fb;font-size:.86rem}.fpw-copy span{margin-top:3px;color:#9db1c5;font-size:.76rem;line-height:1.4}.fpw-tools button{min-height:44px;border:1px solid rgba(126,184,238,.3);border-radius:10px;padding:0 12px;background:#102c49;color:#eaf5ff;font:inherit;font-size:.76rem;font-weight:900;cursor:pointer}.fpw-tools button[aria-pressed="true"]{background:#4b92db;color:#071321}.fpw-tools button:disabled{opacity:.48;cursor:not-allowed}.fprop-row.is-filtered-by-watchlist{display:none!important}.fprop-row.is-watched-prop{box-shadow:inset 3px 0 0 rgba(75,146,219,.65)}
      @media(max-width:620px){.fpw-tools{align-items:stretch;flex-direction:column}.fpw-tools button,.fpw-watch-button{min-height:48px}.fpw-tools button{width:100%}}
      @media(forced-colors:active){.fpw-tools,.fpw-tools button,.fpw-watch-button{border:1px solid CanvasText}.fprop-row.is-watched-prop{outline:1px solid Highlight}}
    `;document.head.append(style);
  }

  function ensureTools(root){
    let tools=root.querySelector('.fpw-tools');
    if(!tools){
      tools=document.createElement('section');tools.className='fpw-tools';tools.setAttribute('aria-live','polite');tools.setAttribute('aria-label','Watched player props');
      const anchor=root.querySelector('.fpm-movers-lens')||root.querySelector('.frp-roster-tools')||root.querySelector('.fprop-controls');
      anchor?.insertAdjacentElement('afterend',tools);
    }
    return tools;
  }

  function decorate(){
    if(route()!==ROUTE)return;
    const root=document.querySelector(ROOT);if(!root)return;
    observer?.disconnect();
    try{
      injectStyle();
      const items=load();
      if(state.only&&!items.length)state.only=false;
      const watched=new Set(items.map(item=>item.key)),rows=[...root.querySelectorAll('.fprop-row')];
      let boardWatched=0,movedWatched=0;
      for(const row of rows){
        const identity=rowIdentity(row);if(!identity)continue;
        const isWatched=watched.has(identity.key);
        row.classList.toggle('is-watched-prop',isWatched);
        row.classList.toggle('is-filtered-by-watchlist',Boolean(state.only&&!isWatched));
        if(isWatched){boardWatched++;if(moved(row))movedWatched++}
        const host=row.querySelector('.fprop-player');if(!host)continue;
        let button=host.querySelector('.fpw-watch-button');
        if(!button){button=document.createElement('button');button.type='button';button.className='fpw-watch-button';host.append(button);button.addEventListener('click',()=>toggle(identity))}
        button.setAttribute('aria-pressed',isWatched?'true':'false');
        button.textContent=isWatched?'Watching':'Watch prop';
        button.setAttribute('aria-label',`${isWatched?'Remove':'Add'} ${identity.player} ${identity.market} ${isWatched?'from':'to'} watched props`);
      }
      const tools=ensureTools(root),signedIn=Boolean(window.TitansAccount?.user);
      const storageTruth=signedIn?'Watch targets sync with your Titans account. Observed line history and review checkpoints stay on this browser.':'Watch targets stay on this browser until you sign in. Observed line history and review checkpoints always stay browser-local.';
      const markup=`<div class="fpw-copy"><strong>${items.length} watched prop${items.length===1?'':'s'} ${signedIn?'in your synced watchlist':'saved on this browser'}</strong><span>${boardWatched} on this board · ${movedWatched} currently show browser-observed movement. ${storageTruth} Watching never triggers background refreshes.</span></div><button type="button" class="fpw-only" aria-pressed="${state.only?'true':'false'}"${items.length?'':' disabled'}>${state.only?'Show all props':'Watched only'}</button>`;
      if(tools.dataset.signature!==markup){tools.innerHTML=markup;tools.dataset.signature=markup}
      tools.querySelector('.fpw-only')?.addEventListener('click',()=>{if(!items.length)return;state.only=!state.only;decorate()},{once:true});
    }finally{resumeObserver()}
  }

  const queue=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;decorate()})};
  observer=new MutationObserver(queue);resumeObserver();
  addEventListener('hashchange',()=>{if(route()!==ROUTE)state.only=false;queue()});
  addEventListener('storage',event=>{if(event.key===STORE)queue()});
  addEventListener('titans:account',queue);
  addEventListener('titans:preferences-synced',event=>{if(event.detail?.keys?.includes(STORE))queue()});
  queue();
  window.TitansFantasyPropWatchlist={load,keyFor,toggle,setOnly:value=>{state.only=Boolean(value);decorate()}};
})();
