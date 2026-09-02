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
    if(!name)return '#roster';
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
    style.textContent='.my-titans-home-v35{margin:0 0 16px;padding:14px 16px;border:1px solid rgba(134,210,255,.2);border-radius:16px;background:linear-gradient(145deg,rgba(10,31,51,.88),rgba(13,42,70,.68));box-shadow:0 10px 28px rgba(0,0,0,.13)}.my-titans-home-v35-head{display:flex;justify-content:space-between;gap:14px;align-items:center;margin-bottom:10px}.my-titans-home-v35-head small{display:block;color:#9fd7ff;font-size:.68rem;font-weight:900;letter-spacing:.13em}.my-titans-home-v35-head h2{margin:3px 0 0;font-size:1.05rem}.my-titans-home-v35-head span{color:#c0d4e4;font-size:.74rem}.my-titans-home-v35-summary{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(150px,.72fr) minmax(150px,.72fr);gap:8px}.my-titans-home-v35-primary,.my-titans-home-v35-quick{display:flex;min-width:0;min-height:72px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:rgba(255,255,255,.035);color:#f7fbff;text-decoration:none}.my-titans-home-v35-primary{padding:11px 13px;align-items:center;justify-content:space-between;gap:14px}.my-titans-home-v35-primary:hover,.my-titans-home-v35-quick:hover{border-color:rgba(134,210,255,.42);background:rgba(75,146,219,.09)}.my-titans-home-v35-primary-copy{min-width:0}.my-titans-home-v35-primary small,.my-titans-home-v35-quick small{display:block;color:#a9c9df;font-size:.65rem;font-weight:900;letter-spacing:.08em}.my-titans-home-v35-primary strong{display:block;margin:3px 0;color:#fff;font-size:.98rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.my-titans-home-v35-primary span{display:block;color:#bed0df;font-size:.73rem;line-height:1.35}.my-titans-home-v35-primary b{flex:0 0 auto;color:#8dd1ff;font-size:.74rem}.my-titans-home-v35-quick{padding:10px 11px;flex-direction:column;justify-content:center;gap:3px;text-align:left;font:inherit;cursor:pointer}.my-titans-home-v35-quick strong{display:block;color:#fff;font-size:.86rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.my-titans-home-v35-quick span{display:block;color:#b8cede;font-size:.7rem;line-height:1.3}.my-titans-home-v35 :focus-visible{outline:3px solid #fff;outline-offset:2px}@media(max-width:760px){.my-titans-home-v35{padding:13px}.my-titans-home-v35-head{align-items:start;flex-direction:column;gap:4px}.my-titans-home-v35-summary{display:flex;overflow-x:auto;gap:8px;padding:0 0 3px;scroll-snap-type:x proximity;overscroll-behavior-inline:contain}.my-titans-home-v35-primary{flex:0 0 82vw;max-width:430px;min-height:88px;scroll-snap-align:start}.my-titans-home-v35-quick{flex:0 0 52vw;min-width:176px;max-width:235px;min-height:88px;scroll-snap-align:start}.my-titans-home-v35-primary b{white-space:nowrap}}@media(max-width:420px){.my-titans-home-v35-primary{flex-basis:86vw}.my-titans-home-v35-primary{align-items:flex-start;flex-direction:column;gap:7px}.my-titans-home-v35-primary b{margin-top:0}}@media(prefers-reduced-motion:reduce){.my-titans-home-v35-summary{scroll-behavior:auto}}';
    document.head.appendChild(style);
  }

  function reconcilePersonalizationStack(root,pulse){
    const host=pulse?.parentNode;
    if(!root||!host)return;
    const watch=app.querySelector('.v36-watch-home');
    const impact=app.querySelector('.v38-impact[data-surface="home"]');
    const watchOrdered=!watch||(watch.parentNode===host&&watch.previousElementSibling===root);
    const impactAnchor=watch||root;
    const impactOrdered=!impact||(impact.parentNode===host&&impact.previousElementSibling===impactAnchor);
    const tail=impact||watch||root;
    const ordered=root.parentNode===host&&watchOrdered&&impactOrdered&&tail.nextElementSibling===pulse;
    if(ordered)return;
    host.insertBefore(root,pulse);
    if(watch)root.insertAdjacentElement('afterend',watch);
    if(impact)(watch||root).insertAdjacentElement('afterend',impact);
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
    const accountDetail=account?(syncState==='synced'?'Settings synced':'Sync available'):'Sign in for cross-device settings';
    const favoriteTitle=favorite||'Choose a favorite player';
    const favoriteHref=favoriteTarget(favorite);
    const favoriteVerified=favoriteHref.startsWith('#player?');
    const favoriteDetail=!favorite?'Open a roster player and tap Make favorite':favoriteVerified?'Open verified Player Intelligence':data?'Saved favorite is not on the loaded roster. Review Team Room before opening a player page.':'Checking your favorite against the current roster…';
    const favoriteAction=!favorite?'Choose player →':favoriteVerified?'Open player →':'Review roster →';
    const fantasyTitle=savedCount?`${savedCount} saved · ${starterCount} starters`:'Build your board';
    const fantasyDetail=`${scoringLabel(fantasy.scoring)}${sleeper?' · Sleeper linked':' · Sleeper optional'}`;
    const signature=JSON.stringify([favoriteTitle,favoriteDetail,favoriteHref,favoriteAction,fantasyTitle,fantasyDetail,accountTitle,accountDetail]);
    let root=app.querySelector('.my-titans-home-v35');
    if(!root){root=document.createElement('section');root.className='my-titans-home-v35';root.setAttribute('aria-label','My Titans profile summary');pulse.parentNode.insertBefore(root,pulse);}
    reconcilePersonalizationStack(root,pulse);
    if(root.dataset.signature===signature)return;
    root.dataset.signature=signature;
    root.innerHTML=`<div class="my-titans-home-v35-head"><div><small>MY TITANS</small><h2>Your fan profile</h2></div><span>Saved identity and setup at a glance</span></div><div class="my-titans-home-v35-summary"><a class="my-titans-home-v35-primary" href="${esc(favoriteHref)}" data-my-titans-favorite-state="${favoriteVerified?'verified':favorite?'review':'unset'}"><div class="my-titans-home-v35-primary-copy"><small>FAVORITE PLAYER</small><strong>${esc(favoriteTitle)}</strong><span>${esc(favoriteDetail)}</span></div><b>${esc(favoriteAction)}</b></a><a class="my-titans-home-v35-quick" href="#fantasy"><small>FANTASY</small><strong>${esc(fantasyTitle)}</strong><span>${esc(fantasyDetail)}</span></a><button class="my-titans-home-v35-quick" type="button" data-my-titans-account><small>ACCOUNT</small><strong>${esc(accountTitle)}</strong><span>${esc(accountDetail)}</span></button></div>`;
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