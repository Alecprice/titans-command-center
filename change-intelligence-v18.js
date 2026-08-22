(() => {
  'use strict';
  const app=document.querySelector('#app');
  const SNAP_KEY='titans:v18ReviewedSnapshot',PROFILE_KEY='titans:v15MyTitans';
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const arr=v=>Array.isArray(v)?v:[];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=v=>String(v??'').trim().toLowerCase();
  const getJson=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}};
  const setJson=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
  let state={data:null,fan:null,loading:null,serial:0,viewObserver:null};

  async function load(){
    if(state.data&&state.fan)return state;
    if(state.loading)return state.loading;
    state.loading=Promise.all([
      fetch('/api/data',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null),
      fetch('/api/fan-intel',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)
    ]).then(([data,fan])=>{state.data=data?.ok?data:{};state.fan=fan?.ok?fan:{};return state}).finally(()=>state.loading=null);
    return state.loading;
  }

  const key=(...parts)=>parts.map(x=>norm(x).replace(/[^a-z0-9]+/g,'-')).filter(Boolean).join('|');
  const playerName=p=>p?.name||[p?.firstName,p?.lastName].filter(Boolean).join(' ')||'Player';
  const favorite=()=>String(getJson(PROFILE_KEY,{})?.favorite||'');
  function snapshot(){
    const data=state.data||{},fan=state.fan||{};
    return {
      at:new Date().toISOString(),
      roster:arr(data.roster).map(p=>({id:String(p.id||key(playerName(p),p.number)),name:playerName(p),position:p.position||'',number:p.number||'',status:p.status||p.tag||'',unit:p.unit||''})),
      transactions:arr(data.transactions).slice(0,80).map(t=>({key:key(t.date,t.publishedAt,t.type,t.description,t.title,t.player,t.name),name:t.player||t.name||'',label:t.description||t.title||t.summary||'Transaction',date:t.date||t.publishedAt||''})),
      injuries:arr(fan.injuries).map(x=>({key:key(x.name),name:x.name||'Player',injury:x.primaryInjury||'',practice:x.practiceStatus||'',report:x.reportStatus||'',date:x.reportDate||x.capturedAt||''})),
      depth:arr(fan.depthChart?.changes).map(x=>({key:key(x.name,x.type,x.from,x.to),name:x.name||'Player',type:x.type||'change',from:x.from||'',to:x.to||''})),
      games:arr(data.games).filter(g=>g?.id||g?.week).map(g=>({id:String(g.id||g.week),opponent:g.opponent||g.opponentAbbr||'Opponent',date:g.date||'',network:g.network||'',status:g.status||''}))
    };
  }

  const mapBy=(rows,field='id')=>new Map(arr(rows).map(x=>[String(x[field]),x]));
  const mentions=(item,name)=>name&&norm(JSON.stringify(item)).includes(norm(name));
  function change(kind,label,before,after,item={}){const fav=favorite(),favHit=mentions(item,fav);return {kind,label,before,after,priority:favHit?'favorite':/injury|transaction|depth/i.test(kind)?'important':'normal',favorite:favHit}}
  function diff(oldSnap,current){
    if(!oldSnap)return[];const out=[];
    const oldRoster=mapBy(oldSnap.roster),newRoster=mapBy(current.roster);
    for(const [id,p] of newRoster){const old=oldRoster.get(id);if(!old)out.push(change('Roster','Added to loaded roster','Not on reviewed roster',`${p.name} · ${p.position} · ${p.status||'status not listed'}`,p));else if(key(old.status,old.position,old.number)!==key(p.status,p.position,p.number))out.push(change('Roster',p.name,`${old.position||'—'} · ${old.status||'—'} · #${old.number||'—'}`,`${p.position||'—'} · ${p.status||'—'} · #${p.number||'—'}`,p))}
    for(const [id,p] of oldRoster)if(!newRoster.has(id))out.push(change('Roster','No longer on loaded roster',`${p.name} · ${p.position} · ${p.status||'status not listed'}`,'Not on current loaded roster',p));

    const oldTx=new Set(arr(oldSnap.transactions).map(x=>x.key));for(const t of current.transactions)if(t.key&&!oldTx.has(t.key))out.push(change('Transaction',t.name||'Roster move','Not in reviewed transaction set',t.label,t));

    const oldInj=mapBy(oldSnap.injuries,'key'),newInj=mapBy(current.injuries,'key');
    for(const [id,x] of newInj){const old=oldInj.get(id);if(!old)out.push(change('Injury / availability',x.name,'No weekly report row in reviewed snapshot',`${x.practice||x.report||x.injury||'Reported'}${x.injury?` · ${x.injury}`:''}`,x));else if(key(old.practice,old.report,old.injury)!==key(x.practice,x.report,x.injury))out.push(change('Injury / availability',x.name,`${old.practice||old.report||'Reported'}${old.injury?` · ${old.injury}`:''}`,`${x.practice||x.report||'Reported'}${x.injury?` · ${x.injury}`:''}`,x))}
    for(const [id,x] of oldInj)if(!newInj.has(id))out.push(change('Injury / availability',x.name,`${x.practice||x.report||'Reported'}${x.injury?` · ${x.injury}`:''}`,'No longer present in current weekly-report rows',x));

    const oldDepth=new Set(arr(oldSnap.depth).map(x=>x.key));for(const x of current.depth)if(x.key&&!oldDepth.has(x.key))out.push(change('Depth chart',x.name, x.from||'Previous role not loaded',x.to||x.type||'Changed',x));

    const oldGames=mapBy(oldSnap.games),newGames=mapBy(current.games);for(const [id,g] of newGames){const old=oldGames.get(id);if(!old)continue;if(key(old.date,old.network,old.status)!==key(g.date,g.network,g.status))out.push(change('Schedule / broadcast',g.opponent,`${old.date||'TBD'} · ${old.network||'TV TBD'} · ${old.status||'status TBD'}`,`${g.date||'TBD'} · ${g.network||'TV TBD'} · ${g.status||'status TBD'}`,g))}
    return out.sort((a,b)=>({favorite:0,important:1,normal:2}[a.priority]-{favorite:0,important:1,normal:2}[b.priority]));
  }

  const timeLabel=value=>{const t=Date.parse(value);if(!Number.isFinite(t))return'No reviewed baseline';const mins=Math.max(0,Math.round((Date.now()-t)/60000));return mins<2?'just now':mins<60?`${mins}m ago`:mins<1440?`${Math.round(mins/60)}h ago`:`${Math.round(mins/1440)}d ago`};
  const categories=changes=>['All',...new Set(changes.map(x=>x.kind))];
  function card(x){return `<article class="v18-change-card ${x.favorite?'favorite':''}" data-v18-kind="${esc(x.kind)}"><header><span>${esc(x.kind)}</span>${x.favorite?'<b>★ MY TITANS</b>':''}</header><h4>${esc(x.label)}</h4><div class="v18-before-after"><div><small>BEFORE</small><p>${esc(x.before)}</p></div><div><small>NOW</small><p>${esc(x.after)}</p></div></div><p class="v18-why"><strong>Why it matters:</strong> ${esc(x.kind==='Schedule / broadcast'?'Game planning or viewing information changed.':x.kind==='Depth chart'?'A listed role changed in the structured depth snapshots.':x.kind==='Injury / availability'?'The latest loaded availability information changed.':x.kind==='Transaction'?'The personnel picture changed.':'The loaded roster state changed.')}</p></article>`}
  function shell(current,reviewed,changes){const fav=favorite(),counts=new Map();for(const x of changes)counts.set(x.kind,(counts.get(x.kind)||0)+1);return `<section class="v18-change-intel"><header class="v18-change-head"><div><small>CHANGE INTELLIGENCE 2.0</small><h3>Since you reviewed</h3><p>${reviewed?`Compared with your saved review point from ${esc(timeLabel(reviewed.at))}.`:'No review point is saved yet. Save a baseline and future visits will show before → now changes.'}</p></div><div class="v18-change-count"><strong>${changes.length}</strong><span>detected</span></div></header>${fav?`<div class="v18-favorite-callout"><strong>★ Prioritizing ${esc(fav)}</strong><span>Changes that mention your saved favorite player rise to the top.</span></div>`:''}<div class="v18-change-toolbar"><div class="v18-filters">${categories(changes).map((x,i)=>`<button type="button" class="${i===0?'active':''}" data-v18-filter="${esc(x)}">${esc(x)}${x!=='All'&&counts.get(x)?` · ${counts.get(x)}`:''}</button>`).join('')}</div><button type="button" class="button primary" data-v18-review>${reviewed?'Mark current state reviewed':'Save baseline now'}</button></div><div class="v18-changes" data-v18-list>${reviewed?(changes.length?changes.map(card).join(''):'<div class="v18-empty"><strong>No detected changes since your review point.</strong><span>Roster, transactions, weekly availability, depth changes, and game/broadcast details match the saved snapshot.</span></div>'):'<div class="v18-empty"><strong>Ready to start tracking.</strong><span>Saving a baseline stores only a compact comparison snapshot in this browser. It does not create an account or send your preferences anywhere.</span></div>'}</div><footer><span>Compared locally on this device</span><a href="#fan">Open Fan Hub →</a></footer></section>`}

  function bind(root,current){root.querySelector('[data-v18-review]')?.addEventListener('click',()=>{if(setJson(SNAP_KEY,current)){render(true)}});root.querySelectorAll('[data-v18-filter]').forEach(btn=>btn.addEventListener('click',()=>{root.querySelectorAll('[data-v18-filter]').forEach(x=>x.classList.toggle('active',x===btn));const filter=btn.dataset.v18Filter;root.querySelectorAll('[data-v18-kind]').forEach(card=>card.hidden=filter!=='All'&&card.dataset.v18Kind!==filter)}))}
  async function render(force=false){if(route()!=='command')return;const currentTab=document.querySelector('[data-v15-tab].active')?.dataset.v15Tab||'';if(currentTab&&currentTab!=='changes')return;const host=document.querySelector('.v15-command-view');if(!host)return;if(!force&&host.querySelector('.v18-change-intel'))return;const token=++state.serial;await load();if(token!==state.serial||route()!=='command')return;const current=snapshot(),reviewed=getJson(SNAP_KEY,null),changes=diff(reviewed,current);host.querySelector('.v18-change-intel')?.remove();const wrap=document.createElement('div');wrap.innerHTML=shell(current,reviewed,changes);const root=wrap.firstElementChild;host.prepend(root);bind(root,current)}
  function watchView(){state.viewObserver?.disconnect();state.viewObserver=null;if(route()!=='command')return;const host=document.querySelector('.v15-command-view');if(!host)return;render();state.viewObserver=new MutationObserver(()=>queueMicrotask(render));state.viewObserver.observe(host,{childList:true,subtree:false})}
  if(app)new MutationObserver(()=>queueMicrotask(watchView)).observe(app,{childList:true,subtree:false});
  addEventListener('hashchange',()=>{state.serial++;setTimeout(watchView,60)});
  setTimeout(watchView,140);
})();