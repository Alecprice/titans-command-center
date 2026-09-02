const playerQs=(s,r=document)=>r.querySelector(s);
const playerRoute=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
const playerParams=()=>new URLSearchParams(location.hash.split('?')[1]||'');
const playerId=()=>playerParams().get('id')||'';
const playerName=()=>playerParams().get('name')||'';
const playerEsc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const playerDate=v=>{if(!v)return 'Not available';const d=new Date(v);return Number.isNaN(d.getTime())?String(v):new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(d)};
const american=v=>v==null?'—':Number(v)>0?`+${Number(v)}`:String(Number(v));
const playerNorm=v=>String(v||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,' ').trim();
const playerDay=v=>String(v||'').slice(0,10);
const PLAYER_PROFILE_KEY='titans:v15MyTitans';
const savePlayerProfile=value=>{try{localStorage.setItem(PLAYER_PROFILE_KEY,JSON.stringify(value));return true}catch{return false}};
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
      <section class="panel player-intel-panel"><div class="panel-head"><h2>Current roster context</h2><span class="player-verified-badge">Verified roster</span></div><div class="panel-body"><p class="player-context-copy">${playerEsc(p.name||'This player')} is currently listed as <strong>${playerEsc(p.rosterStatus||'roster status unavailable')}</strong>${p.position?` at ${playerEsc(p.position)}`:''}${p.number?` wearing No. ${playerEsc(p.number)}`:''}. Player details come from the latest audited Titans roster snapshot.</p><div class="player-context-meta"><span>Snapshot ${playerDate(p.rosterCapturedAt||p.auditedOn)}</span><span>Unofficial fan-built presentation</span></div></div></section>
      <section class="panel player-intel-panel"><div class="panel-head"><h2>Game stats</h2><span>Warehouse / official fallback</span></div><div class="panel-body">${renderStats(data.stats)}</div></section>
      <section class="panel player-intel-panel"><div class="panel-head"><h2>Injury reports</h2><span>Official-first</span></div><div class="panel-body">${renderInjuries(data.injuries)}</div></section>
      <section class="panel player-intel-panel"><div class="panel-head"><h2>Player market pulse</h2><span>Informational</span></div><div class="panel-body">${renderProps(data.props)}<p class="player-market-note">Market information is presented for comparison/context only and is not wagering advice.</p></div></section>
    </div>
  </div>`;
}

function fallbackLinkName(link){
  if(link?.matches?.('.player-card'))return link.querySelector('h3')?.textContent?.trim()||'';
  if(link?.matches?.('a.tag'))return String(link.textContent||'').split('·')[0].trim();
  return '';
}

function wireAuditedPlayerLinks(){
  for(const link of document.querySelectorAll('.player-card[href="#roster"]')){
    const name=fallbackLinkName(link);if(name)link.setAttribute('href',`#player?name=${encodeURIComponent(name)}`);
  }
  for(const link of document.querySelectorAll('a.tag[href="#player?id="]')){
    const name=fallbackLinkName(link);if(name)link.setAttribute('href',`#player?name=${encodeURIComponent(name)}`);
  }
}

function fallbackWeek(row,preseason){
  const schedule=[...(preseason?.preseasonSchedule||[]),...(preseason?.coverage?.games||[])];
  const game=schedule.find(item=>playerDay(item?.date)===playerDay(row?.date))||{};
  const name=String(game.name||row?.eventName||''),opponent=String(game.opponentAbbr||'');
  if(/^TEN\s+vs\s+/i.test(name))return {week:game.week||'—',homeAbbr:'TEN',awayAbbr:opponent||name.replace(/^TEN\s+vs\s+/i,'').trim()};
  if(/^TEN\s+@\s+/i.test(name))return {week:game.week||'—',homeAbbr:opponent||name.replace(/^TEN\s+@\s+/i,'').trim(),awayAbbr:'TEN'};
  return {week:game.week||'—',homeAbbr:'TEN',awayAbbr:opponent||''};
}

function auditedProfile(site,preseason,name){
  const roster=Array.isArray(site?.roster)?site.roster:[],p=roster.find(row=>playerNorm(row?.name)===playerNorm(name));
  if(!p)return null;
  const candidates=[...(preseason?.players||[]),...(preseason?.otherParticipants||[])],pre=candidates.find(row=>playerNorm(row?.name)===playerNorm(p.name)),sourceRows=Array.isArray(pre?.stats)?pre.stats:[];
  const stats=sourceRows.map(row=>{const game=fallbackWeek(row,preseason);return {seasonType:'preseason',week:game.week,homeAbbr:game.homeAbbr,awayAbbr:game.awayAbbr,statGroup:row.category||'Stats',kickoff:row.date||null,source:row.source||preseason?.statsSource||'Official preseason source',sourceUrl:row.sourceUrl||'',fields:Array.isArray(row.fields)?row.fields:[]};});
  const auditedOn=site?.fallback?.auditedAt||site?.dataQuality?.rosterSnapshotAt||p.capturedAt||'2026-08-27';
  return {
    ok:true,fallback:true,
    player:{id:String(p.id||''),name:p.name||name,number:p.number||'',position:p.position||'',unit:p.unit||'',rosterStatus:p.status||'Current roster',experience:p.experience||'',college:'',age:null,height:'',weight:null,rosterCapturedAt:p.capturedAt||auditedOn,auditedOn,sourceLabel:'Tennessee Titans roster · audited fallback',sourceUrl:'https://www.tennesseetitans.com/team/players-roster/'},
    stats,injuries:[],props:[],sourceRows
  };
}

function fallbackFields(row){
  return (Array.isArray(row?.fields)?row.fields:[]).filter(item=>String(item?.value??'').trim()!=='').slice(0,8);
}

function auditedTimeline(site,name){
  const needle=playerNorm(name),rows=(Array.isArray(site?.transactions)?site.transactions:[]).filter(row=>playerNorm([row.description,row.title,row.summary].filter(Boolean).join(' ')).includes(needle)).slice(0,6);
  if(!rows.length)return '<div class="v16-empty"><strong>No additional timeline rows loaded.</strong><span>No transaction or injury event is inferred from missing data.</span></div>';
  return `<div class="v16-move-list">${rows.map(row=>`<article><small>Transaction</small><strong>${playerEsc(row.description||row.title||'Roster move')}</strong><span>${playerEsc(playerDate(row.date||row.publishedAt))}</span></article>`).join('')}</div>`;
}

function auditedGameLog(profile){
  const rows=profile?.sourceRows||[];
  if(!rows.length)return '<div class="v16-empty"><strong>No verified player-game rows loaded.</strong><span>This is a source-coverage gap, not a zero-stat claim.</span></div>';
  return `<div class="v16-game-log">${rows.map(row=>`<article><div class="v16-game-id"><small>2026 preseason · ${playerEsc(playerDate(row.date))}</small><strong>${playerEsc(row.category||'Stats')}</strong><span>Official fallback</span></div><div class="v16-log-stats">${fallbackFields(row).slice(0,4).map(item=>`<div><small>${playerEsc(item.label||'Stat')}</small><strong>${playerEsc(item.value??'—')}</strong></div>`).join('')||'<span>No numeric fields published in this row.</span>'}</div></article>`).join('')}</div>`;
}

function renderAuditedIntelligence(root,profile,preseason,site){
  if(!root||root.querySelector('.v16-player-intel'))return;
  const p=profile.player||{},rows=profile.sourceRows||[],last=rows.at(-1)||rows[0]||null,quick=fallbackFields(last).slice(0,2),stored=(()=>{try{return JSON.parse(localStorage.getItem(PLAYER_PROFILE_KEY)||'{}')}catch{return{}}})(),favorite=stored.favorite===p.name;
  const source=preseason?.statsSource||'NFL official P1 gamebook + Tennessee Titans official P2 Game Center/postgame notes',coverage=preseason?.coverage?`${preseason.coverage.completedGamesWithPlayerStats??'—'} of ${preseason.coverage.completedGames??'—'} completed preseason games with player detail`:'Official preseason coverage';
  const layer=document.createElement('section');layer.className='v16-player-intel';layer.dataset.mode='audited-fallback';layer.innerHTML=`
    <section class="v16-player-command"><header><div><small>PLAYER COMMAND CENTER</small><h2>${playerEsc(p.name||'Titans player')}</h2><p>Audited roster identity and verified official preseason production remain available while the live player warehouse is unavailable.</p></div><button type="button" data-v16-favorite aria-pressed="${favorite}" aria-live="polite">${favorite?'★ Favorite':'☆ Make favorite'}</button></header><p class="v16-note"><strong>2026 Preseason · official fallback</strong> · ${playerEsc(source)}. ${playerEsc(coverage)}</p><div class="v16-quick-grid"><article><small>Roster status</small><strong>${playerEsc(p.rosterStatus||'Current roster')}</strong><span>Audited ${playerEsc(playerDate(p.auditedOn))}</span></article><article><small>Verified game rows</small><strong>${rows.length}</strong><span>Missing categories remain missing.</span></article>${quick.map(item=>`<article><small>${playerEsc(item.label||'Stat')}</small><strong>${playerEsc(item.value??'—')}</strong><span>Latest verified preseason row</span></article>`).join('')}</div></section>
    <section class="v16-player-changed"><header><div><small>WHAT CHANGED?</small><h3>Fallback coverage state</h3></div><span>Verified loaded data only</span></header><article><small>Live warehouse</small><strong>Temporarily unavailable</strong><span>Player identity comes from the Aug. 27 audited roster snapshot.</span></article>${rows.length?`<article><small>Preseason production</small><strong>${rows.length} official stat row${rows.length===1?'':'s'} loaded</strong><span>These are not regular-season totals.</span></article>`:''}</section>
    <div class="v16-player-tabs" role="tablist" aria-label="Player intelligence sections"><button class="active" type="button" data-v16-player-tab="overview" aria-selected="true">Overview</button><button type="button" data-v16-player-tab="games" aria-selected="false">Game Log</button><button type="button" data-v16-player-tab="trends" aria-selected="false">Trends</button><button type="button" data-v16-player-tab="career" aria-selected="false">Career + Contract</button><button type="button" data-v16-player-tab="timeline" aria-selected="false">Timeline</button></div>
    <section class="v16-player-pane" data-v16-pane="overview"><div class="v16-grid two"><article class="v16-panel"><small>SEASON SNAPSHOT</small><h3>2026 preseason production</h3>${quick.length?`<div class="v16-snapshot">${quick.map(item=>`<div><small>${playerEsc(item.label||'Stat')}</small><strong>${playerEsc(item.value??'—')}</strong></div>`).join('')}</div>`:'<div class="v16-empty"><strong>Verified production is awaiting source coverage.</strong><span>No zeroes are invented.</span></div>'}<p class="v16-note">Only official preseason fields currently loaded for this player are shown.</p></article><article class="v16-panel"><small>ROLE + AVAILABILITY</small><h3>${playerEsc(p.rosterStatus||'Current roster')}</h3><p>No live injury or depth-chart claim is made while the warehouse is unavailable.</p><a href="#roster">Back to audited roster →</a></article></div></section>
    <section class="v16-player-pane" data-v16-pane="games" hidden><header><div><small>GAME LOG</small><h3>Verified official preseason rows</h3></div><span>${rows.length} rows · 2026 preseason</span></header>${auditedGameLog(profile)}</section>
    <section class="v16-player-pane" data-v16-pane="trends" hidden><header><div><small>TRENDS</small><h3>Source-backed direction only</h3></div><span>${rows.length} verified rows</span></header>${rows.length?`<div class="v16-move-list">${rows.map(row=>`<article><small>${playerEsc(playerDate(row.date))}</small><strong>${playerEsc(row.category||'Stats')}</strong><span>${playerEsc(fallbackFields(row).slice(0,4).map(item=>`${item.label} ${item.value}`).join(' · ')||'Published row')}</span></article>`).join('')}</div>`:'<div class="v16-empty"><strong>More verified games are needed.</strong><span>No trend is inferred from missing rows.</span></div>'}<p class="v16-note">This fallback does not compute film grades, hidden coaching intent, or missing statistical categories.</p></section>
    <section class="v16-player-pane" data-v16-pane="career" hidden><div class="v16-grid two"><article class="v16-panel"><small>CAREER COVERAGE</small><h3>${playerEsc(p.experience?`${p.experience} year${String(p.experience)==='1'?'':'s'} experience`:'Experience not loaded')}</h3><p>A complete historical career archive is not claimed from the audited fallback snapshot.</p></article><article class="v16-panel"><small>CONTRACT</small><h3>Contract row not loaded</h3><div class="v16-empty"><strong>No salary/cap values are inferred.</strong><span>Live contract warehouse data is unavailable.</span></div></article></div></section>
    <section class="v16-player-pane" data-v16-pane="timeline" hidden><header><div><small>PLAYER TIMELINE</small><h3>Audited roster evidence</h3></div><a href="#roster">Open roster →</a></header>${auditedTimeline(site,p.name)}</section>`;
  root.append(layer);
  layer.addEventListener('click',event=>{
    const tab=event.target.closest?.('[data-v16-player-tab]');if(tab){const key=tab.dataset.v16PlayerTab;layer.querySelectorAll('[data-v16-player-tab]').forEach(node=>{const on=node===tab;node.classList.toggle('active',on);node.setAttribute('aria-selected',String(on))});layer.querySelectorAll('[data-v16-pane]').forEach(node=>node.hidden=node.dataset.v16Pane!==key);return;}
    const button=event.target.closest?.('[data-v16-favorite]');if(button){const next=(()=>{try{return JSON.parse(localStorage.getItem(PLAYER_PROFILE_KEY)||'{}')}catch{return{}}})(),on=button.getAttribute('aria-pressed')==='true';next.favorite=on?'':p.name;const saved=savePlayerProfile(next);if(!saved){button.textContent=on?'★ Favorite still saved · retry':'☆ Favorite not saved · retry';button.setAttribute('aria-label',on?'Could not remove favorite. Favorite is still saved. Retry.':'Favorite was not saved on this device. Retry.');return;}button.removeAttribute('aria-label');button.setAttribute('aria-pressed',String(!on));button.textContent=on?'☆ Make favorite':'★ Favorite';}
  });
}

async function loadAuditedPlayer(name,key,serial){
  const [siteResponse,preseasonResponse]=await Promise.all([fetch('/api/data',{cache:'no-store',headers:{Accept:'application/json'}}),fetch('/api/preseason-stats',{cache:'no-store',headers:{Accept:'application/json'}})]),site=await siteResponse.json(),preseason=preseasonResponse.ok?await preseasonResponse.json().catch(()=>null):null;
  if(serial!==requestSerial||playerRoute()!=='player'||playerName()!==name)return;
  if(!siteResponse.ok||!site?.ok)throw new Error(site?.error||'Audited roster unavailable');
  const matched=(site.roster||[]).find(row=>playerNorm(row?.name)===playerNorm(name));
  if(matched?.id&&/^[0-9a-f-]{36}$/i.test(String(matched.id))&&site?.databaseAvailable!==false){location.replace(`#player?id=${encodeURIComponent(matched.id)}`);return;}
  const profile=auditedProfile(site,preseasonResponse.ok&&preseason?.ok?preseason:{},name);if(!profile)throw new Error('Player is not present in the current audited roster');
  const app=playerQs('#app');if(!app)return;app.innerHTML=renderProfile(profile,key);renderAuditedIntelligence(playerQs('.player-profile-rich',app),profile,preseasonResponse.ok&&preseason?.ok?preseason:{},site);
}

async function loadRichPlayer(){
  if(playerRoute()!=='player')return;
  const id=playerId(),name=playerName(),uuid=/^[0-9a-f-]{36}$/i.test(id),key=uuid?`id:${id}`:name?`name:${name}`:'';
  const app=playerQs('#app');if(!app||!key)return;
  if(playerQs(`[data-rich-player="${CSS.escape(key)}"]`,app))return;
  if(loadingId===key)return;
  loadingId=key;const serial=++requestSerial;
  const existingName=playerQs('.player-profile-head h2',app)?.textContent||name||'Player';
  app.innerHTML=`<div class="player-profile-loading"><div class="player-loading-number"></div><div><div class="player-loading-line short"></div><div class="player-loading-line"></div><p>Loading verified ${playerEsc(existingName)} profile…</p></div></div>`;
  try{
    if(!uuid){await loadAuditedPlayer(name,key,serial);return;}
    const response=await fetch(`/api/player?id=${encodeURIComponent(id)}`,{headers:{Accept:'application/json'}}),data=await response.json();
    if(serial!==requestSerial||playerRoute()!=='player'||playerId()!==id)return;
    if(!response.ok||!data.ok)throw new Error(data.error||'Player profile unavailable');
    app.innerHTML=renderProfile(data,key);
  }catch(error){
    if(serial!==requestSerial)return;
    app.innerHTML=`<div class="player-profile-error"><a href="#roster">← Back to roster</a>${statEmpty('Player profile unavailable',error.message||'Try again shortly.')}</div>`;
  }finally{if(loadingId===key)loadingId=null;}
}

document.addEventListener('click',event=>{
  const link=event.target.closest?.('.player-card[href="#roster"], a.tag[href="#player?id="]');if(!link)return;
  const name=fallbackLinkName(link);if(!name)return;event.preventDefault();location.hash=`player?name=${encodeURIComponent(name)}`;
},true);

const playerApp=playerQs('#app');if(playerApp)new MutationObserver(()=>queueMicrotask(()=>{wireAuditedPlayerLinks();loadRichPlayer()})).observe(playerApp,{childList:true});
addEventListener('hashchange',()=>{requestSerial++;loadingId=null;queueMicrotask(()=>{wireAuditedPlayerLinks();loadRichPlayer()})});
queueMicrotask(()=>{wireAuditedPlayerLinks();loadRichPlayer()});