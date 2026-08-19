const playerQs=(s,r=document)=>r.querySelector(s);
const playerRoute=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
const playerId=()=>new URLSearchParams(location.hash.split('?')[1]||'').get('id')||'';
const playerEsc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const playerDate=v=>{if(!v)return 'Not available';const d=new Date(v);return Number.isNaN(d.getTime())?String(v):new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(d)};
const american=v=>v==null?'—':Number(v)>0?`+${Number(v)}`:String(Number(v));
let loadingId=null,requestSerial=0;

function statEmpty(title,copy){return `<div class="player-data-empty"><strong>${playerEsc(title)}</strong><p>${playerEsc(copy)}</p></div>`}

function renderStats(rows){
  if(!rows?.length)return statEmpty('Stats awaiting ingest','No player-game stat rows are loaded yet. This does not mean the player has zero production.');
  return `<div class="player-data-list">${rows.map(row=>`<article><div><small>${playerEsc(row.seasonType||'game')} · Week ${playerEsc(row.week??'—')}</small><strong>${playerEsc(row.homeAbbr||'')} vs ${playerEsc(row.awayAbbr||'')}</strong></div><span>${playerEsc(row.statGroup||'stats')}</span></article>`).join('')}</div>`;
}

function renderInjuries(rows){
  if(!rows?.length)return statEmpty('No injury rows loaded','The injury warehouse has no current rows for this player. Treat this as “not reported here,” not a medical clearance.');
  return `<div class="player-data-list">${rows.map(row=>`<article><div><small>${playerEsc(row.reportDate||playerDate(row.capturedAt))}</small><strong>${playerEsc(row.primaryInjury||row.secondaryInjury||'Injury report')}</strong></div><span>${playerEsc(row.reportStatus||row.practiceStatus||'Reported')}</span></article>`).join('')}</div>`;
}

function renderProps(rows){
  if(!rows?.length)return statEmpty('No current player markets','No free-provider player prop rows are loaded for this player right now.');
  return `<div class="player-market-list">${rows.slice(0,12).map(row=>`<article><div><small>${playerEsc(row.provider||row.book||'Market')}</small><strong>${playerEsc(row.marketName||row.category||'Player market')}</strong></div><div><span>${playerEsc(row.side||'')}</span><b>${row.line==null?'—':playerEsc(row.line)} · ${american(row.price)}</b></div></article>`).join('')}</div>`;
}

function renderProfile(data,id){
  const p=data.player||{},source=p.sourceUrl||'https://www.tennesseetitans.com/team/players-roster/';
  const facts=[
    ['Position',p.position||'—'],['Unit',p.unit||'—'],['Status',p.rosterStatus||'—'],['Experience',p.experience?`${p.experience} yr${String(p.experience)==='1'?'':'s'}`:'—'],
    ['College',p.college||'—'],['Age',p.age??'—'],['Height',p.height||'—'],['Weight',p.weight?`${p.weight} lb`:'—']
  ];
  return `<div class="player-profile-rich" data-rich-player="${playerEsc(id)}">
    <div class="player-back-row"><a href="#roster">← Back to roster</a><a href="${playerEsc(source)}" target="_blank" rel="noopener noreferrer">Official roster source ↗</a></div>
    <section class="player-rich-hero">
      <div class="player-rich-number" aria-label="Jersey number ${playerEsc(p.number||'')}">${playerEsc(p.number||'—')}</div>
      <div class="player-rich-copy"><div class="eyebrow">Player Intelligence · ${playerEsc(p.rosterStatus||'Roster')}</div><h1>${playerEsc(p.name||'Titans player')}</h1><p>${playerEsc(p.position||'')} ${p.unit?`· ${playerEsc(p.unit)}`:''}</p><div class="player-source-line"><span></span>${playerEsc(p.sourceLabel||'Tennessee Titans roster')} · ${playerDate(p.auditedOn||p.rosterCapturedAt)}</div></div>
      <div class="player-rich-watermark">${playerEsc(p.number||'')}</div>
    </section>
    <section class="player-fact-grid">${facts.map(([label,value])=>`<div><small>${playerEsc(label)}</small><strong>${playerEsc(value)}</strong></div>`).join('')}</section>
    <div class="player-section-grid">
      <section class="panel player-intel-panel"><div class="panel-head"><h2>Current roster context</h2><span class="player-verified-badge">Verified roster</span></div><div class="panel-body"><p class="player-context-copy">${playerEsc(p.name||'This player')} is currently listed as <strong>${playerEsc(p.rosterStatus||'roster status unavailable')}</strong>${p.position?` at ${playerEsc(p.position)}`:''}${p.number?` wearing No. ${playerEsc(p.number)}`:''}. Player details come from the latest audited Titans roster snapshot.</p><div class="player-context-meta"><span>Snapshot ${playerDate(p.rosterCapturedAt)}</span><span>Unofficial fan-built presentation</span></div></div></section>
      <section class="panel player-intel-panel"><div class="panel-head"><h2>Game stats</h2><span>Warehouse</span></div><div class="panel-body">${renderStats(data.stats)}</div></section>
      <section class="panel player-intel-panel"><div class="panel-head"><h2>Injury reports</h2><span>Official-first</span></div><div class="panel-body">${renderInjuries(data.injuries)}</div></section>
      <section class="panel player-intel-panel"><div class="panel-head"><h2>Player market pulse</h2><span>Informational</span></div><div class="panel-body">${renderProps(data.props)}<p class="player-market-note">Market information is presented for comparison/context only and is not wagering advice.</p></div></section>
    </div>
  </div>`;
}

async function loadRichPlayer(){
  if(playerRoute()!=='player')return;
  const id=playerId(),app=playerQs('#app');if(!app||!/^[0-9a-f-]{36}$/i.test(id))return;
  if(playerQs(`[data-rich-player="${CSS.escape(id)}"]`,app))return;
  if(loadingId===id)return;
  loadingId=id;const serial=++requestSerial;
  const existingName=playerQs('.player-profile-head h2',app)?.textContent||'Player';
  app.innerHTML=`<div class="player-profile-loading"><div class="player-loading-number"></div><div><div class="player-loading-line short"></div><div class="player-loading-line"></div><p>Loading verified ${playerEsc(existingName)} profile…</p></div></div>`;
  try{
    const response=await fetch(`/api/player?id=${encodeURIComponent(id)}`,{headers:{Accept:'application/json'}}),data=await response.json();
    if(serial!==requestSerial||playerRoute()!=='player'||playerId()!==id)return;
    if(!response.ok||!data.ok)throw new Error(data.error||'Player profile unavailable');
    app.innerHTML=renderProfile(data,id);
  }catch(error){
    if(serial!==requestSerial)return;
    app.innerHTML=`<div class="player-profile-error"><a href="#roster">← Back to roster</a>${statEmpty('Player profile unavailable',error.message||'Try again shortly.')}</div>`;
  }finally{if(loadingId===id)loadingId=null;}
}

const playerApp=playerQs('#app');if(playerApp)new MutationObserver(()=>queueMicrotask(loadRichPlayer)).observe(playerApp,{childList:true});
addEventListener('hashchange',()=>{requestSerial++;loadingId=null;queueMicrotask(loadRichPlayer)});
queueMicrotask(loadRichPlayer);
