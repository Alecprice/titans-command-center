(() => {
  'use strict';
  if(window.__TitansMyHomeV35)return;
  window.__TitansMyHomeV35=true;

  const PROFILE_KEY='titans:v15MyTitans';
  const FANTASY_KEY='titans-fantasy-v1';
  const app=document.querySelector('#app');
  const runtime=window.TitansRuntime;
  let data=null,dataLoading=null,syncState='';

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const getJSON=(key,fallback)=>runtime?.storage?.getJSON?.(key,fallback)??fallback;
  const route=()=>runtime?.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';
  const scoringLabel=value=>value==='ppr'?'PPR':value==='standard'?'Standard':'Half PPR';
  const normalizeName=value=>String(value||'').trim().toLowerCase();

  async function loadData(){
    if(data||dataLoading)return dataLoading||data;
    dataLoading=Promise.resolve(runtime?.apiJson?.('/api/data',{ttl:30000})).then(value=>{data=value?.ok?value:{};return data;}).catch(()=>{data={};return data;}).finally(()=>{dataLoading=null;mount();});
    return dataLoading;
  }

  function favoritePlayer(name){
    const needle=normalizeName(name);
    if(!needle)return null;
    const rows=Array.isArray(data?.roster)?data.roster:[];
    return rows.find(row=>normalizeName(row?.name||row?.fullName)===needle)||null;
  }

  function favoriteTarget(name){
    if(!name)return '#command';
    const player=favoritePlayer(name);
    if(!player)return '#roster';
    const id=String(player.id||'').trim();
    if(id)return `#player?id=${encodeURIComponent(id)}`;
    const canonical=String(player.name||player.fullName||'').trim();
    return canonical?`#player?name=${encodeURIComponent(canonical)}`:'#roster';
  }

  function injectStyle(){
    if(document.querySelector('#my-titans-home-v35-style'))return;
    const style=document.createElement('style');
    style.id='my-titans-home-v35-style';
    style.textContent='.my-titans-home-v35{margin:0 0 18px;padding:18px;border:1px solid rgba(134,210,255,.22);border-radius:18px;background:linear-gradient(145deg,rgba(10,31,51,.9),rgba(13,42,70,.72));box-shadow:0 14px 38px rgba(0,0,0,.16)}.my-titans-home-v35-head{display:flex;justify-content:space-between;gap:16px;align-items:end;margin-bottom:12px}.my-titans-home-v35-head small{display:block;color:#9fd7ff;font-size:.7rem;font-weight:900;letter-spacing:.13em}.my-titans-home-v35-head h2{margin:4px 0 0;font-size:1.2rem}.my-titans-home-v35-head span{color:#c0d4e4;font-size:.76rem}.my-titans-home-v35-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.my-titans-home-v35-card{display:flex;min-width:0;min-height:112px;padding:14px;border:1px solid rgba(255,255,255,.11);border-radius:14px;background:rgba(255,255,255,.04);color:#f7fbff;text-decoration:none;flex-direction:column;justify-content:space-between}.my-titans-home-v35-card:hover{border-color:rgba(134,210,255,.45);background:rgba(75,146,219,.1)}.my-titans-home-v35-card small{color:#a9c9df;font-size:.68rem;font-weight:900;letter-spacing:.08em}.my-titans-home-v35-card strong{display:block;margin:5px 0;color:#fff;font-size:1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.my-titans-home-v35-card span{color:#bed0df;font-size:.76rem;line-height:1.4}.my-titans-home-v35-card b{margin-top:10px;color:#8dd1ff;font-size:.75rem}.my-titans-home-v35-card.account{cursor:pointer;text-align:left;font:inherit}.my-titans-home-v35 :focus-visible{outline:3px solid #fff;outline-offset:2px}@media(max-width:760px){.my-titans-home-v35-grid{grid-template-columns:1fr}.my-titans-home-v35-card{min-height:94px}.my-titans-home-v35-head{align-items:start;flex-direction:column;gap:5px}}';
    document.head.appendChild(style);
  }

  function mount(){
    if(!app||route()!=='home')return;
    const pulse=app.querySelector('.pulse-ribbon');
    if(!pulse)return;
    const profile=getJSON(PROFILE_KEY,{})||{};
    const fantasy=getJSON(FANTASY_KEY,{})||{};
    const favorite=String(profile.favorite||'').trim();
    if(favorite&&!data&&!dataLoading)loadData();
    const manual=Array.isArray(fantasy.manual)?fantasy.manual:[];
    const starterCount=manual.filter(player=>player?.slot==='starter').length;
    const savedCount=manual.length;
    const sleeper=String(fantasy.sleeperUser||'').trim();
    const account=window.TitansAccount?.user||null;
    const accountTitle=account?String(account.name||'Signed in'):'Device profile';
    const accountDetail=account?(syncState==='synced'?'Cloud settings synced':'Signed in · sync available'):'Sign in to carry settings across devices';
    const favoriteTitle=favorite||'Choose a favorite player';
    const favoriteHref=favoriteTarget(favorite);
    const favoriteVerified=favoriteHref.startsWith('#player?');
    const favoriteDetail=!favorite?'Set it once in My Titans':favoriteVerified?'Jump straight back into Player Intelligence':data?'Saved favorite is not on the loaded roster. Review Team Room before opening a player page.':'Checking your favorite against the current roster…';
    const favoriteAction=!favorite?'Set favorite →':favoriteVerified?'Open player →':'Review roster →';
    const fantasyTitle=savedCount?`${savedCount} saved · ${starterCount} starters`:'Build your fantasy board';
    const fantasyDetail=`${scoringLabel(fantasy.scoring)}${sleeper?` · Sleeper: ${sleeper}`:' · Sleeper optional'}`;
    const signature=JSON.stringify([favoriteTitle,favoriteDetail,favoriteHref,favoriteAction,fantasyTitle,fantasyDetail,accountTitle,accountDetail]);
    let root=app.querySelector('.my-titans-home-v35');
    if(!root){root=document.createElement('section');root.className='my-titans-home-v35';root.setAttribute('aria-label','My Titans quick access');pulse.parentNode.insertBefore(root,pulse);}
    if(root.dataset.signature===signature)return;
    root.dataset.signature=signature;
    root.innerHTML=`<div class="my-titans-home-v35-head"><div><small>MY TITANS</small><h2>Your fan command shortcuts</h2></div><span>Personalized from your saved settings</span></div><div class="my-titans-home-v35-grid"><a class="my-titans-home-v35-card" href="${esc(favoriteHref)}" data-my-titans-favorite-state="${favoriteVerified?'verified':favorite?'review':'unset'}"><div><small>FAVORITE PLAYER</small><strong>${esc(favoriteTitle)}</strong><span>${esc(favoriteDetail)}</span></div><b>${esc(favoriteAction)}</b></a><a class="my-titans-home-v35-card" href="#fantasy"><div><small>FANTASY COMMAND</small><strong>${esc(fantasyTitle)}</strong><span>${esc(fantasyDetail)}</span></div><b>Open Fantasy →</b></a><button class="my-titans-home-v35-card account" type="button" data-my-titans-account><div><small>ACCOUNT</small><strong>${esc(accountTitle)}</strong><span>${esc(accountDetail)}</span></div><b>Manage account →</b></button></div>`;
  }

  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target.closest('[data-my-titans-account]'):null;
    if(!target)return;
    document.querySelector('[data-account-open]')?.click();
  });
  addEventListener('titans:account',()=>queueMicrotask(mount));
  addEventListener('titans:sync-status',event=>{syncState=String(event.detail?.state||'');queueMicrotask(mount);});
  addEventListener('titans:preferences-synced',()=>queueMicrotask(mount));
  addEventListener('titans:preferences-imported',()=>queueMicrotask(mount));
  if(runtime){runtime.onRoute(mount,{immediate:true});runtime.onAppRender(mount,{immediate:true});}
  else{addEventListener('hashchange',()=>queueMicrotask(mount));queueMicrotask(mount);}
  injectStyle();
})();
