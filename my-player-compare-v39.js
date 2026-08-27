(() => {
  'use strict';
  if(window.__TitansPlayerCompareV39)return;
  window.__TitansPlayerCompareV39=true;

  const PROFILE_KEY='titans:v15MyTitans';
  const MAX_WATCHED=8;
  const app=document.querySelector('#app');
  const runtime=window.TitansRuntime;
  let data=null,loading=null,selectedA='',selectedB='';

  const arr=value=>Array.isArray(value)?value:[];
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const norm=value=>String(value??'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,' ').trim();
  const route=()=>runtime?.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';
  const profile=()=>runtime?.storage?.getJSON?.(PROFILE_KEY,{})||{};
  const nameOf=row=>String(row?.name||row?.fullName||row?.playerName||row?.player||'').trim();
  const keyFor=item=>String(item?.id||`name:${norm(item?.name)}`);
  const textMatch=(row,name)=>{
    const needle=norm(name);if(!needle)return false;
    return norm([row?.name,row?.fullName,row?.playerName,row?.player,row?.title,row?.summary,row?.description,row?.type].filter(Boolean).join(' ')).includes(needle);
  };

  async function load(){
    if(data&&!loading)return data;
    if(loading)return loading;
    loading=Promise.resolve(runtime?.apiJson?.('/api/data',{ttl:30000}))
      .then(value=>{data=value?.ok?value:{};return data;})
      .catch(()=>{data={};return data;})
      .finally(()=>{loading=null;queueMicrotask(mount);});
    return loading;
  }

  function watched(){
    const seen=new Set(),list=[];
    for(const item of arr(profile().watchlist).slice(0,MAX_WATCHED)){
      const name=String(item?.name||'').trim();if(!name)continue;
      const id=String(item?.id||'');const key=id||norm(name);
      if(!key||seen.has(key))continue;
      seen.add(key);list.push({id,name});
    }
    return list;
  }

  function ensureSelection(list){
    const keys=list.map(keyFor);
    if(!keys.includes(selectedA))selectedA=keys[0]||'';
    if(!keys.includes(selectedB)||selectedB===selectedA)selectedB=keys.find(key=>key!==selectedA)||'';
  }

  function rosterFor(item){
    return arr(data?.roster).find(row=>(item.id&&String(row?.id||'')===item.id)||norm(nameOf(row))===norm(item.name))||null;
  }

  function contextFor(item){
    const roster=rosterFor(item),resolved=nameOf(roster)||item.name;
    const depthRows=arr(data?.teamContext?.depthChart?.rows);
    const depth=depthRows.find(row=>(roster?.id&&String(row?.playerId||'')===String(roster.id))||norm(nameOf(row))===norm(resolved))||null;
    const transaction=arr(data?.transactions).find(row=>textMatch(row,resolved))||null;
    const verifiedId=String(roster?.id||'');
    const href=verifiedId?`#player?id=${encodeURIComponent(verifiedId)}`:'#roster';
    const favorite=norm(profile().favorite)===norm(resolved);
    return {
      resolved,href,favorite,
      number:String(roster?.number||'').trim(),
      position:String(roster?.position||'Position unavailable').trim(),
      unit:String(roster?.unit||'Unit unavailable').trim(),
      status:String(roster?.status||'Roster status unavailable').trim(),
      depthSlot:String(depth?.slot||'Not listed in loaded depth snapshot').trim(),
      depthRank:depth?.rank!=null?String(depth.rank):'',
      depthUnit:String(depth?.unit||'').trim(),
      transaction:transaction?String(transaction.description||transaction.summary||transaction.title||transaction.type||'Roster transaction').trim():'No matching recent transaction in the loaded feed.',
      transactionDate:transaction?String(transaction.date||'').slice(0,10):''
    };
  }

  function optionMarkup(list,selected){
    return list.map(item=>`<option value="${esc(keyFor(item))}" ${keyFor(item)===selected?'selected':''}>${esc(item.name)}</option>`).join('');
  }

  function playerCard(ctx,label){
    const meta=[ctx.number?`#${ctx.number}`:'',ctx.position,ctx.unit].filter(Boolean).join(' · ');
    const depth=[ctx.depthUnit,ctx.depthSlot,ctx.depthRank?`rank ${ctx.depthRank}`:''].filter(Boolean).join(' · ');
    return `<article class="v39-compare-card"><header><div><small>${esc(label)}${ctx.favorite?' · FAVORITE':''}</small><strong>${esc(ctx.resolved)}</strong><span>${esc(meta)}</span></div><a href="${esc(ctx.href)}" aria-label="Open ${esc(ctx.resolved)} in Player Intelligence">Open →</a></header><dl><div><dt>Roster status</dt><dd>${esc(ctx.status)}</dd></div><div><dt>Depth context</dt><dd>${esc(depth)}</dd></div><div><dt>Latest matching move</dt><dd>${ctx.transactionDate?`<time datetime="${esc(ctx.transactionDate)}">${esc(ctx.transactionDate)}</time> · `:''}${esc(ctx.transaction)}</dd></div></dl></article>`;
  }

  function injectStyle(){
    if(document.querySelector('#my-player-compare-v39-style'))return;
    const style=document.createElement('style');
    style.id='my-player-compare-v39-style';
    style.textContent='.v39-compare{margin:0 0 18px;padding:16px;border:1px solid rgba(134,210,255,.24);border-radius:18px;background:linear-gradient(145deg,rgba(7,25,43,.97),rgba(12,35,61,.88));box-shadow:0 14px 34px rgba(0,0,0,.14)}.v39-compare>header{display:flex;align-items:end;justify-content:space-between;gap:12px;margin-bottom:12px}.v39-compare>header small{display:block;color:#9ed8ff;font-size:.68rem;font-weight:950;letter-spacing:.11em}.v39-compare>header h2{margin:4px 0 0;color:#fff;font-size:1.08rem}.v39-compare>header p{max-width:540px;margin:0;color:#c5d7e5;font-size:.76rem;line-height:1.45;text-align:right}.v39-compare-controls{display:grid;grid-template-columns:minmax(0,1fr) 52px minmax(0,1fr);gap:9px;align-items:end;margin-bottom:10px}.v39-compare-controls label{display:grid;gap:5px;color:#bcd1df;font-size:.7rem;font-weight:900;letter-spacing:.05em}.v39-compare-controls select,.v39-compare-swap{min-height:44px;border:1px solid rgba(134,210,255,.25);border-radius:11px;background:#0b2944;color:#fff;font:inherit;font-size:.8rem;font-weight:800}.v39-compare-controls select{width:100%;padding:0 10px}.v39-compare-swap{display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer}.v39-compare-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.v39-compare-card{min-width:0;padding:13px;border:1px solid rgba(255,255,255,.11);border-radius:13px;background:rgba(255,255,255,.04)}.v39-compare-card header{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.v39-compare-card header small{display:block;color:#91d5ff;font-size:.66rem;font-weight:950;letter-spacing:.08em}.v39-compare-card header strong{display:block;margin:4px 0 2px;color:#fff;font-size:.98rem}.v39-compare-card header span{display:block;color:#bdd0df;font-size:.73rem}.v39-compare-card header a,.v39-compare-empty a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;color:#a5dcff;font-size:.74rem;font-weight:900;text-decoration:none}.v39-compare-card dl{display:grid;gap:0;margin:11px 0 0}.v39-compare-card dl div{display:grid;gap:3px;padding:9px 0;border-top:1px solid rgba(255,255,255,.08)}.v39-compare-card dt{color:#eaf6ff;font-size:.68rem;font-weight:900;text-transform:uppercase;letter-spacing:.06em}.v39-compare-card dd{margin:0;color:#c5d7e5;font-size:.76rem;line-height:1.45}.v39-compare-note{margin:10px 0 0;color:#aebfcd;font-size:.72rem;line-height:1.45}.v39-compare-empty{color:#c5d7e5;font-size:.8rem;line-height:1.5}.v39-compare-empty a{margin-left:4px}.v39-compare :focus-visible{outline:3px solid #fff;outline-offset:2px}@media(max-width:620px){.v39-compare>header{align-items:flex-start;flex-direction:column}.v39-compare>header p{text-align:left}.v39-compare-controls{grid-template-columns:1fr 44px 1fr}.v39-compare-grid{grid-template-columns:1fr}}@media(max-width:430px){.v39-compare-controls{grid-template-columns:1fr}.v39-compare-swap{width:100%}}';
    document.head.appendChild(style);
  }

  function render(root,list){
    ensureSelection(list);
    const a=list.find(item=>keyFor(item)===selectedA),b=list.find(item=>keyFor(item)===selectedB);
    const favorite=String(profile().favorite||'').trim();
    const signature=JSON.stringify([list,selectedA,selectedB,favorite,data?.teamContext?.depthChart?.capturedAt,arr(data?.transactions)[0]?.date]);
    if(root.dataset.signature===signature)return;
    root.dataset.signature=signature;
    if(list.length<2){
      root.innerHTML=`<header><div><small>PLAYER COMPARE</small><h2>Compare the Titans you follow</h2></div><p>Side-by-side context from the same loaded team data.</p></header><div class="v39-compare-empty">Watch at least two players to unlock a factual side-by-side view. <a href="#roster">Open roster →</a></div>`;
      return;
    }
    if(!a||!b)return;
    const left=contextFor(a),right=contextFor(b);
    root.innerHTML=`<header><div><small>PLAYER COMPARE</small><h2>Your watched Titans, side by side</h2></div><p>Roster, depth, and transaction context only. This does not grade players, predict roles, or declare a winner.</p></header><div class="v39-compare-controls"><label>Player A<select data-v39-compare="a" aria-label="Choose first player to compare">${optionMarkup(list,selectedA)}</select></label><button class="v39-compare-swap" type="button" data-v39-swap aria-label="Swap compared players">⇄</button><label>Player B<select data-v39-compare="b" aria-label="Choose second player to compare">${optionMarkup(list,selectedB)}</select></label></div><div class="v39-compare-grid">${playerCard(left,'PLAYER A')}${playerCard(right,'PLAYER B')}</div><p class="v39-compare-note">A missing transaction or depth row means no matching item is present in the currently loaded feed or snapshot—not that no change exists anywhere.</p>`;
  }

  function mount(){
    if(!app||route()!=='home')return;
    const host=app.querySelector('.v38-impact[data-surface="home"]')||app.querySelector('.v36-watch-home')||app.querySelector('.my-titans-home-v35');
    if(!host)return;
    const list=watched();
    if(list.length>=2&&!data&&!loading){load();return;}
    let root=app.querySelector('.v39-compare');
    if(!root){root=document.createElement('section');root.className='v39-compare';root.setAttribute('aria-label','Watched player comparison');host.insertAdjacentElement('afterend',root);}
    render(root,list);
  }

  document.addEventListener('change',event=>{
    const select=event.target instanceof Element?event.target.closest('[data-v39-compare]'):null;
    if(!select)return;
    const next=String(select.value||'');
    if(select.dataset.v39Compare==='a'){
      const old=selectedA;selectedA=next;if(selectedA===selectedB)selectedB=old;
    }else{
      const old=selectedB;selectedB=next;if(selectedA===selectedB)selectedA=old;
    }
    queueMicrotask(mount);
  });
  document.addEventListener('click',event=>{
    const swap=event.target instanceof Element?event.target.closest('[data-v39-swap]'):null;
    if(!swap)return;
    [selectedA,selectedB]=[selectedB,selectedA];queueMicrotask(mount);
  });
  addEventListener('titans:player-watchlist',()=>queueMicrotask(mount));
  addEventListener('titans:preferences-synced',()=>queueMicrotask(mount));
  addEventListener('titans:preferences-imported',()=>queueMicrotask(mount));
  addEventListener('storage',event=>{if(event.key===PROFILE_KEY)queueMicrotask(mount);});
  if(runtime){runtime.onRoute(mount,{immediate:true});runtime.onAppRender(mount,{immediate:true});runtime.onRefresh(()=>{data=null;queueMicrotask(mount);});}
  else{addEventListener('hashchange',()=>queueMicrotask(mount));queueMicrotask(mount);}
  injectStyle();
})();
