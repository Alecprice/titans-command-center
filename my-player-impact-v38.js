(() => {
  'use strict';
  if(window.__TitansPlayerImpactV38)return;
  window.__TitansPlayerImpactV38=true;

  const PROFILE_KEY='titans:v15MyTitans';
  const MAX_FOLLOWED=9;
  const app=document.querySelector('#app');
  const runtime=window.TitansRuntime;
  let data=null,fan=null,loading=null;

  const arr=value=>Array.isArray(value)?value:[];
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const norm=value=>String(value??'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,' ').trim();
  const route=()=>runtime?.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';
  const getProfile=()=>runtime?.storage?.getJSON?.(PROFILE_KEY,{})||{};
  const playerName=row=>String(row?.name||row?.fullName||row?.playerName||row?.player||'').trim();
  const textMatch=(row,name)=>{
    const needle=norm(name);if(!needle)return false;
    const hay=norm([row?.name,row?.fullName,row?.playerName,row?.player,row?.title,row?.summary,row?.description,row?.type].filter(Boolean).join(' '));
    return hay.includes(needle);
  };

  async function load(){
    if((data||fan)&&!loading)return {data,fan};
    if(loading)return loading;
    loading=Promise.all([
      Promise.resolve(runtime?.apiJson?.('/api/data',{ttl:30000})).catch(()=>null),
      Promise.resolve(runtime?.apiJson?.('/api/fan-intel',{ttl:30000})).catch(()=>null)
    ]).then(([nextData,nextFan])=>{
      data=nextData?.ok?nextData:{};
      fan=nextFan?.ok?nextFan:{};
      return {data,fan};
    }).finally(()=>{loading=null;queueMicrotask(mount);});
    return loading;
  }

  function followed(){
    const profile=getProfile();
    const favorite=String(profile.favorite||'').trim();
    const watched=arr(profile.watchlist).map(item=>({id:String(item?.id||''),name:String(item?.name||'').trim()})).filter(item=>item.name).slice(0,8);
    const result=[];
    const add=item=>{if(!item.name||result.some(x=>norm(x.name)===norm(item.name)))return;result.push(item);};
    if(favorite)add({id:'',name:favorite,favorite:true});
    watched.forEach(add);
    return result.slice(0,MAX_FOLLOWED);
  }

  function impactFor(item){
    const rosterAvailable=Array.isArray(data?.roster);
    const roster=arr(data?.roster);
    const storedId=String(item?.id||'').trim();
    const storedName=norm(item?.name);
    const rosterRow=roster.find(row=>(storedId&&String(row?.id||'').trim()===storedId)||(storedName&&norm(playerName(row))===storedName))||null;
    const canonicalName=playerName(rosterRow);
    const verified=Boolean(rosterRow&&canonicalName);
    const resolvedName=verified?canonicalName:String(item?.name||'').trim();
    const injuryRows=verified&&Array.isArray(fan?.injuries)?fan.injuries:[];
    const transactionRows=verified&&Array.isArray(data?.transactions)?data.transactions:[];
    const depthRows=verified&&Array.isArray(fan?.depthChart?.changes)?fan.depthChart.changes:[];
    const injury=verified?(injuryRows.find(row=>norm(playerName(row))===norm(canonicalName)||textMatch(row,canonicalName))||null):null;
    const transaction=verified?(transactionRows.find(row=>textMatch(row,canonicalName))||null):null;
    const depth=verified?(depthRows.find(row=>textMatch(row,canonicalName))||null):null;
    const id=verified?String(rosterRow?.id||'').trim():'';
    const href=id?`#player?id=${encodeURIComponent(id)}`:verified?`#player?name=${encodeURIComponent(canonicalName)}`:'#roster';
    const routeState=verified?'verified':'review';
    const rosterStatus=verified
      ?String(rosterRow?.status||'Roster status unavailable').trim()
      :rosterAvailable?'Saved player is not on the loaded roster':'Current roster verification unavailable';
    const injuryLabel=injury?String(injury.practiceStatus||injury.reportStatus||injury.gameStatus||injury.status||injury.primaryInjury||'Injury-report row loaded').trim():'';
    const transactionLabel=transaction?String(transaction.description||transaction.summary||transaction.title||transaction.type||'Roster transaction').trim():'';
    const depthType=depth?String(depth.type||depth.change||'Depth-chart change').trim():'';
    const depthMove=depth&&((depth.from!=null)||(depth.to!=null))?`${depth.from??'—'} → ${depth.to??'—'}`:'';
    const loadedFeeds=[];
    if(verified&&Array.isArray(fan?.injuries))loadedFeeds.push('injury-report');
    if(verified&&Array.isArray(data?.transactions))loadedFeeds.push('transaction');
    if(verified&&Array.isArray(fan?.depthChart?.changes))loadedFeeds.push('depth');
    const noSignalLabel=!verified
      ?'Player-specific signals are withheld until current roster identity is verified.'
      :loadedFeeds.length
        ?`No flagged change in the loaded ${loadedFeeds.join(', ')} feed${loadedFeeds.length===1?'':'s'}. Unavailable feeds are excluded.`
        :'Player-specific change feeds are currently unavailable.';
    const flagged=routeState==='review'||Boolean(injury||transaction||depth||rosterStatus.toLowerCase()!=='active');
    return {item,rosterRow,resolvedName,href,routeState,rosterStatus,injuryLabel,transactionLabel,depthLabel:depth?[depthType,depthMove].filter(Boolean).join(' · '):'',noSignalLabel,flagged};
  }

  function cardMarkup(impact){
    const verified=impact.routeState==='verified';
    const meta=verified?[impact.rosterRow?.number?`#${impact.rosterRow.number}`:'',impact.rosterRow?.position,impact.rosterRow?.unit].filter(Boolean).join(' · '):'Saved follow · roster review needed';
    const signals=[];
    signals.push(`<li><b>Roster</b><span>${esc(impact.rosterStatus)}</span></li>`);
    if(verified&&impact.injuryLabel)signals.push(`<li class="attention"><b>Injury report</b><span>${esc(impact.injuryLabel)}</span></li>`);
    if(verified&&impact.transactionLabel)signals.push(`<li><b>Recent move</b><span>${esc(impact.transactionLabel)}</span></li>`);
    if(verified&&impact.depthLabel)signals.push(`<li><b>Depth context</b><span>${esc(impact.depthLabel)}</span></li>`);
    if(!verified||(!impact.injuryLabel&&!impact.transactionLabel&&!impact.depthLabel))signals.push(`<li><b>${verified?'Loaded feeds':'Impact feed'}</b><span>${esc(impact.noSignalLabel)}</span></li>`);
    const action=verified?'Open →':'Review roster →';
    const aria=verified?`Open ${impact.resolvedName} in Player Intelligence`:`Review ${impact.resolvedName} in Team Room`;
    return `<article class="v38-impact-card${impact.flagged?' has-impact':''}${verified?'':' needs-review'}" data-v38-state="${impact.routeState}"><header><div><small>${impact.item.favorite?'FAVORITE · FOLLOWED PLAYER':'FOLLOWED PLAYER'}</small><strong>${esc(impact.resolvedName)}</strong><span>${esc(meta||'Titans roster')}</span></div><a href="${esc(impact.href)}" aria-label="${esc(aria)}">${action}</a></header><ul>${signals.join('')}</ul></article>`;
  }

  function injectStyle(){
    if(document.querySelector('#my-player-impact-v38-style'))return;
    const style=document.createElement('style');
    style.id='my-player-impact-v38-style';
    style.textContent='.v38-impact{margin:0 0 18px;padding:16px;border:1px solid rgba(134,210,255,.24);border-radius:18px;background:linear-gradient(145deg,rgba(7,25,43,.96),rgba(13,43,70,.86));box-shadow:0 14px 34px rgba(0,0,0,.14)}.v38-impact>header{display:flex;align-items:end;justify-content:space-between;gap:12px;margin-bottom:11px}.v38-impact>header small,.v38-impact-card header small{display:block;color:#9ed8ff;font-size:.68rem;font-weight:950;letter-spacing:.11em}.v38-impact>header h2{margin:4px 0 0;color:#fff;font-size:1.08rem}.v38-impact>header span{max-width:480px;color:#c4d7e5;font-size:.76rem;line-height:1.45;text-align:right}.v38-impact-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.v38-impact-card{min-width:0;padding:13px;border:1px solid rgba(255,255,255,.11);border-radius:13px;background:rgba(255,255,255,.04)}.v38-impact-card.has-impact{border-color:rgba(134,210,255,.34);background:rgba(75,146,219,.085)}.v38-impact-card.needs-review{border-color:rgba(255,196,102,.34);background:rgba(255,196,102,.055)}.v38-impact-card.needs-review header a{color:#f2d49b}.v38-impact-card header{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.v38-impact-card header strong{display:block;margin:4px 0 2px;color:#fff;font-size:.95rem}.v38-impact-card header span{display:block;color:#bdd0df;font-size:.72rem}.v38-impact-card header a,.v38-impact-actions a,.v38-impact-empty a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;color:#a5dcff;font-size:.74rem;font-weight:900;text-decoration:none}.v38-impact-card ul{display:grid;gap:7px;margin:11px 0 0;padding:0;list-style:none}.v38-impact-card li{display:grid;gap:2px;padding-top:7px;border-top:1px solid rgba(255,255,255,.08)}.v38-impact-card li b{color:#eaf6ff;font-size:.69rem;text-transform:uppercase;letter-spacing:.06em}.v38-impact-card li span{color:#c5d7e5;font-size:.75rem;line-height:1.4}.v38-impact-card li.attention span{color:#fff}.v38-impact-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:11px}.v38-impact-actions a{padding:0 12px;border:1px solid rgba(134,210,255,.2);border-radius:11px;background:rgba(255,255,255,.035);color:#fff}.v38-impact-empty{color:#c5d7e5;font-size:.8rem;line-height:1.5}.v38-impact-empty a{margin-left:4px}.v38-impact :focus-visible{outline:3px solid #fff;outline-offset:2px}@media(max-width:980px){.v38-impact-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.v38-impact>header{align-items:flex-start;flex-direction:column}.v38-impact>header span{text-align:left}.v38-impact-grid{grid-template-columns:1fr}.v38-impact-actions a{flex:1 1 130px}}';
    document.head.appendChild(style);
  }

  function hostFor(current){
    if(current==='home')return app?.querySelector('.v36-watch-home')||app?.querySelector('.my-titans-home-v35')||app?.querySelector('.pulse-ribbon');
    if(current==='live')return app?.querySelector('.v37-my-gameday')||app?.querySelector('.v16-gameday');
    return null;
  }

  function mount(){
    if(!app||!['home','live'].includes(route()))return;
    const current=route(),host=hostFor(current);if(!host)return;
    const list=followed();
    if(list.length&&(!data||!fan)&&!loading){load();return;}
    const impacts=list.map(impactFor);
    const signature=JSON.stringify([current,impacts.map(x=>[x.resolvedName,x.href,x.routeState,x.rosterStatus,x.injuryLabel,x.transactionLabel,x.depthLabel,x.noSignalLabel])]);
    let root=app.querySelector(`.v38-impact[data-surface="${current}"]`);
    if(!root){root=document.createElement('section');root.className='v38-impact';root.dataset.surface=current;root.setAttribute('aria-label','My Player Impact');host.insertAdjacentElement('afterend',root);}
    if(root.dataset.signature===signature)return;
    root.dataset.signature=signature;
    root.innerHTML=`<header><div><small>MY PLAYER IMPACT</small><h2>What changed for the Titans you follow</h2></div><span>Current loaded roster, injury-report, transaction, and depth context. Missing signals are not treated as proof that nothing changed.</span></header>${impacts.length?`<div class="v38-impact-grid">${impacts.map(cardMarkup).join('')}</div>`:`<div class="v38-impact-empty">Watch a player from the roster to build your personal impact feed. <a href="#roster">Open roster →</a></div>`}<div class="v38-impact-actions" aria-label="Player impact quick actions"><a href="#transactions">All roster moves</a><a href="#roster?view=depth">Depth Chart</a><a href="#roster">Manage watchlist</a></div>`;
  }

  addEventListener('titans:player-watchlist',()=>queueMicrotask(mount));
  addEventListener('titans:preferences-synced',()=>queueMicrotask(mount));
  addEventListener('titans:preferences-imported',()=>queueMicrotask(mount));
  addEventListener('storage',event=>{if(event.key===PROFILE_KEY)queueMicrotask(mount);});
  if(runtime){runtime.onRoute(mount,{immediate:true});runtime.onAppRender(mount,{immediate:true});runtime.onRefresh(()=>{data=null;fan=null;queueMicrotask(mount);});}
  else{addEventListener('hashchange',()=>queueMicrotask(mount));queueMicrotask(mount);}
  injectStyle();
})();
