(() => {
  'use strict';
  if(window.__TitansMyGameDayV37)return;
  window.__TitansMyGameDayV37=true;

  const PROFILE_KEY='titans:v15MyTitans';
  const FANTASY_KEY='titans-fantasy-v1';
  const MAX_WATCH_PREVIEW=4;
  const app=document.querySelector('#app');
  const runtime=window.TitansRuntime;
  let data=null,dataLoading=null;

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const route=()=>runtime?.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';
  const getJSON=(key,fallback)=>runtime?.storage?.getJSON?.(key,fallback)??fallback;
  const scoringLabel=value=>value==='ppr'?'PPR':value==='standard'?'Standard':'Half PPR';

  async function loadData(){
    if(data||dataLoading)return dataLoading||data;
    dataLoading=Promise.resolve(runtime?.apiJson?.('/api/data',{ttl:30000}))
      .then(value=>{data=value?.ok?value:{};return data;})
      .catch(()=>{data={};return data;})
      .finally(()=>{dataLoading=null;mount();});
    return dataLoading;
  }

  function favoriteTarget(name,watchlist){
    if(!name)return '#roster';
    const watched=watchlist.find(item=>String(item?.name||'').trim().toLowerCase()===name.toLowerCase());
    if(watched?.id)return `#player?id=${encodeURIComponent(watched.id)}`;
    const rows=Array.isArray(data?.roster)?data.roster:[];
    const player=rows.find(row=>String(row?.name||row?.fullName||'').trim().toLowerCase()===name.toLowerCase());
    return player?.id?`#player?id=${encodeURIComponent(player.id)}`:'#roster';
  }

  function injectStyle(){
    if(document.querySelector('#gameday-personal-v37-style'))return;
    const style=document.createElement('style');
    style.id='gameday-personal-v37-style';
    style.textContent='.v37-my-gameday{margin:0 0 16px;padding:16px;border:1px solid rgba(134,210,255,.22);border-radius:18px;background:linear-gradient(145deg,rgba(6,24,41,.95),rgba(12,44,72,.86));box-shadow:0 14px 36px rgba(0,0,0,.16)}.v37-my-gameday>header{display:flex;align-items:end;justify-content:space-between;gap:14px;margin-bottom:11px}.v37-my-gameday>header small{display:block;color:#91d5ff;font-size:.68rem;font-weight:950;letter-spacing:.13em}.v37-my-gameday>header h2{margin:4px 0 0;color:#fff;font-size:1.12rem}.v37-my-gameday>header span{color:#c0d4e4;font-size:.75rem}.v37-gd-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.v37-gd-card{min-width:0;padding:13px;border:1px solid rgba(255,255,255,.11);border-radius:13px;background:rgba(255,255,255,.045)}.v37-gd-card small{display:block;color:#9fccea;font-size:.66rem;font-weight:900;letter-spacing:.08em}.v37-gd-card strong{display:block;margin:5px 0;color:#fff;font-size:.96rem}.v37-gd-card p,.v37-gd-card span{margin:0;color:#bfd1df;font-size:.76rem;line-height:1.45}.v37-gd-card>a{display:inline-flex;align-items:center;min-height:44px;margin-top:8px;color:#8dd1ff;font-size:.76rem;font-weight:900;text-decoration:none}.v37-gd-watch{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.v37-gd-watch a{display:inline-flex;align-items:center;min-height:36px;max-width:100%;padding:0 9px;border:1px solid rgba(134,210,255,.2);border-radius:999px;background:rgba(75,146,219,.08);color:#eaf6ff;font-size:.72rem;font-weight:850;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v37-gd-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.v37-gd-actions a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 12px;border:1px solid rgba(134,210,255,.22);border-radius:11px;background:rgba(255,255,255,.04);color:#fff;font-size:.75rem;font-weight:900;text-decoration:none}.v37-my-gameday :focus-visible{outline:3px solid #fff;outline-offset:2px}@media(max-width:900px){.v37-gd-grid{grid-template-columns:1fr 1fr}.v37-gd-card:last-child{grid-column:1/-1}}@media(max-width:620px){.v37-my-gameday>header{align-items:flex-start;flex-direction:column;gap:4px}.v37-gd-grid{grid-template-columns:1fr}.v37-gd-card:last-child{grid-column:auto}.v37-gd-watch a{min-height:44px}.v37-gd-actions a{flex:1 1 130px}}';
    document.head.appendChild(style);
  }

  function mount(){
    if(!app||route()!=='live')return;
    const phase=app.querySelector('.v16-gd-phase');
    if(!phase)return;
    const profile=getJSON(PROFILE_KEY,{})||{};
    const fantasy=getJSON(FANTASY_KEY,{})||{};
    const favorite=String(profile.favorite||'').trim();
    const watchlist=(Array.isArray(profile.watchlist)?profile.watchlist:[]).filter(item=>item&&String(item.name||'').trim()).slice(0,8);
    const manual=Array.isArray(fantasy.manual)?fantasy.manual:[];
    const starters=manual.filter(player=>player?.slot==='starter').length;
    if(favorite&&!data&&!dataLoading)loadData();
    const target=favoriteTarget(favorite,watchlist);
    const preview=watchlist.slice(0,MAX_WATCH_PREVIEW);
    const signature=JSON.stringify([favorite,target,watchlist,manual.length,starters,fantasy.scoring]);
    let root=app.querySelector('.v37-my-gameday');
    if(!root){root=document.createElement('section');root.className='v37-my-gameday';root.setAttribute('aria-label','My Game Day focus');phase.parentNode.insertBefore(root,phase);}
    if(root.dataset.signature===signature)return;
    root.dataset.signature=signature;
    root.innerHTML=`<header><div><small>MY GAME DAY</small><h2>Your Titans focus</h2></div><span>Built from your synced fan settings</span></header><div class="v37-gd-grid"><article class="v37-gd-card"><small>FAVORITE PLAYER</small><strong>${esc(favorite||'Choose your favorite')}</strong><p>${favorite?'Jump straight into the player context you care about most.':'Set a favorite once and Game Day will keep that player within reach.'}</p><a href="${esc(target)}">${favorite?'Open Player Intelligence →':'Choose from roster →'}</a></article><article class="v37-gd-card"><small>PLAYER WATCH</small><strong>${watchlist.length?`${watchlist.length} tracked Titan${watchlist.length===1?'':'s'}`:'No players tracked yet'}</strong>${preview.length?`<div class="v37-gd-watch">${preview.map(item=>`<a href="${item.id?`#player?id=${encodeURIComponent(item.id)}`:'#roster'}">${esc(item.name)}</a>`).join('')}${watchlist.length>preview.length?`<span>+${watchlist.length-preview.length} more</span>`:''}</div>`:'<p>Watch players from Player Intelligence to build a personal game-day shortlist.</p>'}<a href="#roster">Manage player watch →</a></article><article class="v37-gd-card"><small>FANTASY COMMAND</small><strong>${manual.length?`${manual.length} saved · ${starters} starters`:'Fantasy board not built yet'}</strong><p>${esc(scoringLabel(fantasy.scoring))} scoring · use your saved Titans context without invented projections.</p><a href="#fantasy">Open Fantasy Command →</a></article></div><div class="v37-gd-actions" aria-label="Game Day quick actions"><a href="#media">Listen / Watch</a><a href="#roster?view=depth">Depth Chart</a><a href="#transactions">Roster Moves</a></div>`;
  }

  addEventListener('titans:player-watchlist',()=>queueMicrotask(mount));
  addEventListener('titans:preferences-synced',()=>queueMicrotask(mount));
  addEventListener('titans:preferences-imported',()=>queueMicrotask(mount));
  addEventListener('storage',event=>{if(event.key===PROFILE_KEY||event.key===FANTASY_KEY)queueMicrotask(mount);});
  if(runtime){runtime.onRoute(mount,{immediate:true});runtime.onAppRender(mount,{immediate:true});}
  else{addEventListener('hashchange',()=>queueMicrotask(mount));queueMicrotask(mount);}
  injectStyle();
})();
