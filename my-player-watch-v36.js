(() => {
  'use strict';
  if(window.__TitansPlayerWatchV36)return;
  window.__TitansPlayerWatchV36=true;

  const PROFILE_KEY='titans:v15MyTitans';
  const MAX_WATCHED=8;
  const app=document.querySelector('#app');
  const runtime=window.TitansRuntime;
  const route=()=>runtime?.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';
  const playerId=()=>new URLSearchParams(location.hash.split('?')[1]||'').get('id')||'';
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const normalizeName=value=>String(value||'').trim().toLowerCase();
  const getProfile=()=>runtime?.storage?.getJSON?.(PROFILE_KEY,{})??(()=>{try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}')}catch{return{}}})();
  const setProfile=profile=>{try{localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));return true}catch{return false}};
  const watched=profile=>(Array.isArray(profile?.watchlist)?profile.watchlist:[]).filter(item=>item&&String(item.name||'').trim()).slice(0,MAX_WATCHED);
  let rosterData=null,rosterPending=null,rosterSettled=false;
  const rosterRows=()=>Array.isArray(rosterData?.roster)?rosterData.roster:[];

  function saveWatchlist(list){
    const profile=getProfile()||{};
    profile.watchlist=list.slice(0,MAX_WATCHED).map(item=>({id:String(item.id||''),name:String(item.name||'').trim()}));
    if(!setProfile(profile))return false;
    window.dispatchEvent(new CustomEvent('titans:player-watchlist',{detail:{count:profile.watchlist.length}}));
    return true;
  }

  function watchMatch(item){
    const id=String(item?.id||'').trim(),name=normalizeName(item?.name);
    return rosterRows().find(row=>id&&String(row?.id||'').trim()===id)||rosterRows().find(row=>name&&normalizeName(row?.name||row?.fullName)===name)||null;
  }

  function watchTarget(item){
    const player=watchMatch(item);
    if(!player)return '#roster';
    const id=String(player.id||'').trim();
    if(id)return `#player?id=${encodeURIComponent(id)}`;
    const canonical=String(player.name||player.fullName||'').trim();
    return canonical?`#player?name=${encodeURIComponent(canonical)}`:'#roster';
  }

  function watchRouteState(item){
    if(!rosterSettled)return {href:'#roster',copy:'Checking current roster…',state:'checking'};
    const href=watchTarget(item);
    if(href.startsWith('#player?'))return {href,copy:'Open Player Intelligence →',state:'verified'};
    return {href:'#roster',copy:'Review roster →',state:'review'};
  }

  function ensureRoster(){
    if(rosterSettled||rosterPending)return;
    if(!runtime?.apiJson){rosterSettled=true;queueMicrotask(mountHome);return;}
    rosterPending=Promise.resolve(runtime.apiJson('/api/data',{ttl:30000}))
      .then(payload=>{rosterData=payload?.ok===false?null:payload;})
      .catch(()=>{rosterData=null;})
      .finally(()=>{rosterSettled=true;rosterPending=null;queueMicrotask(mountHome);});
  }

  function injectStyle(){
    if(document.querySelector('#my-player-watch-v36-style'))return;
    const style=document.createElement('style');
    style.id='my-player-watch-v36-style';
    style.textContent='.v36-watchbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:12px 0 0;padding:10px 12px;border:1px solid rgba(134,210,255,.2);border-radius:12px;background:rgba(75,146,219,.075)}.v36-watchbar span{color:#d5e5f1;font-size:.78rem;line-height:1.45}.v36-watchbar button,.v36-watch-remove{min-height:44px;border:1px solid rgba(134,210,255,.28);border-radius:11px;background:rgba(255,255,255,.055);color:#f7fbff;padding:0 13px;font:inherit;font-size:.76rem;font-weight:900;cursor:pointer}.v36-watchbar button[aria-pressed="true"]{background:#4b92db;color:#071421;border-color:#86d2ff}.v36-watch-home{margin:0 0 18px;padding:16px;border:1px solid rgba(134,210,255,.22);border-radius:18px;background:linear-gradient(145deg,rgba(8,27,46,.92),rgba(11,39,65,.78))}.v36-watch-home header{display:flex;justify-content:space-between;gap:12px;align-items:end;margin-bottom:10px}.v36-watch-home small{display:block;color:#9fd7ff;font-size:.68rem;font-weight:900;letter-spacing:.12em}.v36-watch-home h2{margin:4px 0 0;font-size:1.08rem}.v36-watch-home header span{color:#c0d4e4;font-size:.74rem}.v36-watch-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.v36-watch-card{position:relative;min-width:0;padding:12px 54px 12px 12px;border:1px solid rgba(255,255,255,.11);border-radius:13px;background:rgba(255,255,255,.04)}.v36-watch-card[data-v36-state="review"]{border-color:rgba(255,196,102,.3)}.v36-watch-card[data-v36-state="review"] a span{color:#f2d49b}.v36-watch-card a{display:block;color:#fff;text-decoration:none}.v36-watch-card strong{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v36-watch-card span{display:block;margin-top:5px;color:#b9cddd;font-size:.73rem}.v36-watch-remove{position:absolute;right:4px;top:4px;width:44px;min-height:44px;height:44px;padding:0;border-radius:10px}.v36-watch-empty{color:#c1d3e2;font-size:.8rem;line-height:1.5}.v36-watchbar :focus-visible,.v36-watch-home :focus-visible{outline:3px solid #fff;outline-offset:2px}@media(max-width:900px){.v36-watch-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.v36-watchbar{align-items:flex-start;flex-direction:column}.v36-watchbar button{width:100%}.v36-watch-grid{grid-template-columns:1fr}.v36-watch-home header{align-items:flex-start;flex-direction:column;gap:4px}}';
    document.head.appendChild(style);
  }

  function mountPlayer(){
    if(!app||route()!=='player')return;
    const command=app.querySelector('.v16-player-command');
    if(!command||command.querySelector('.v36-watchbar'))return;
    const name=String(command.querySelector('h2')?.textContent||'').trim();
    if(!name)return;
    const id=playerId();
    const list=watched(getProfile());
    const isWatched=list.some(item=>(id&&item.id===id)||normalizeName(item.name)===normalizeName(name));
    const bar=document.createElement('div');
    bar.className='v36-watchbar';
    bar.innerHTML=`<span>Track this player in your synced My Titans watchlist. Up to ${MAX_WATCHED} players.</span><button type="button" data-v36-watch data-v15-profile-save aria-pressed="${isWatched}" data-player-id="${esc(id)}" data-player-name="${esc(name)}">${isWatched?'✓ Watching':'＋ Watch player'}</button>`;
    command.appendChild(bar);
  }

  function mountHome(){
    if(!app||route()!=='home')return;
    const anchor=app.querySelector('.my-titans-home-v35')||app.querySelector('.pulse-ribbon');
    if(!anchor)return;
    const list=watched(getProfile());
    if(list.length)ensureRoster();
    let root=app.querySelector('.v36-watch-home');
    if(!root){root=document.createElement('section');root.className='v36-watch-home';root.setAttribute('aria-label','Watched Titans players');anchor.insertAdjacentElement('afterend',root);}
    const signature=JSON.stringify([list,rosterSettled]);
    if(root.dataset.signature===signature)return;
    root.dataset.signature=signature;
    root.innerHTML=`<header><div><small>PLAYER WATCH</small><h2>Your Titans watchlist</h2></div><span>${list.length}/${MAX_WATCHED} tracked</span></header>${list.length?`<div class="v36-watch-grid">${list.map(item=>{const target=watchRouteState(item);return `<article class="v36-watch-card" data-v36-state="${target.state}"><a href="${target.href}"><strong>${esc(item.name)}</strong><span>${target.copy}</span></a><button class="v36-watch-remove" type="button" data-v36-remove data-v15-profile-save data-player-id="${esc(item.id)}" data-player-name="${esc(item.name)}" aria-label="Remove ${esc(item.name)} from watchlist">×</button></article>`;}).join('')}</div>`:'<div class="v36-watch-empty">Open any player from the roster and tap <strong>Watch player</strong>. Signed-in accounts carry this list across devices.</div>'}`;
  }

  function mount(){mountPlayer();mountHome();}

  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    if(!target)return;
    const watch=target.closest('[data-v36-watch]');
    const remove=target.closest('[data-v36-remove]');
    if(!watch&&!remove)return;
    const button=watch||remove;
    const id=String(button.dataset.playerId||'');
    const name=String(button.dataset.playerName||'').trim();
    if(!name)return;
    let list=watched(getProfile());
    const match=item=>(id&&item.id===id)||normalizeName(item.name)===normalizeName(name);
    if(remove||list.some(match))list=list.filter(item=>!match(item));
    else if(list.length<MAX_WATCHED)list=[...list,{id,name}];
    else{return;}
    if(saveWatchlist(list))queueMicrotask(mount);
  });

  addEventListener('titans:player-watchlist',()=>queueMicrotask(mount));
  addEventListener('titans:preferences-synced',()=>queueMicrotask(mount));
  addEventListener('titans:preferences-imported',()=>queueMicrotask(mount));
  addEventListener('storage',event=>{if(event.key===PROFILE_KEY)queueMicrotask(mount);});
  if(runtime){runtime.onRoute(mount,{immediate:true});runtime.onAppRender(mount,{immediate:true});}
  else{addEventListener('hashchange',()=>queueMicrotask(mount));queueMicrotask(mount);}
  injectStyle();
})();
