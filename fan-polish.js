const fanQs=(s,r=document)=>r.querySelector(s),fanQsa=(s,r=document)=>[...r.querySelectorAll(s)];
const fanRoute=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
let fanData=null,fanHealth=null,fanFetch=null;
const fanEsc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fanDate=v=>{if(!v)return 'TBD';const d=new Date(/^\d{4}-\d{2}-\d{2}$/.test(String(v))?`${v}T12:00:00Z`:v);return Number.isNaN(d.getTime())?'TBD':new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(d)};
const fanTime=v=>{if(!v)return 'TBD';const d=new Date(v);return Number.isNaN(d.getTime())?'TBD':new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'America/Chicago'}).format(d)};

async function fanLoad(){
  if(fanData&&fanHealth)return {data:fanData,health:fanHealth};
  if(fanFetch)return fanFetch;
  fanFetch=Promise.all([
    fetch('/api/data',{headers:{Accept:'application/json'}}).then(r=>r.json()).catch(()=>null),
    fetch('/api/health',{cache:'no-store'}).then(r=>r.json()).catch(()=>null)
  ]).then(([data,health])=>{fanData=data?.ok?data:null;fanHealth=health||null;return {data:fanData,health:fanHealth};}).finally(()=>{fanFetch=null});
  return fanFetch;
}

function fanStatus(label,state,detail){
  const good=state==='ready'||state==='live',waiting=state==='waiting',bad=state==='error';
  return `<div class="fan-health-item ${good?'good':waiting?'waiting':bad?'bad':''}"><span></span><div><small>${fanEsc(label)}</small><strong>${fanEsc(detail)}</strong></div></div>`;
}

function fanNextGame(data){return (data?.games||[]).find(g=>g.status!=='final'&&g.status!=='bye'&&g.date&&new Date(g.date)>new Date())||null;}
function fanCoverage(data,key){return Number(data?.analytics?.coverage?.[key]||0);}

function polishHome(data){
  if(!data||fanQs('.home-quality-strip'))return;
  const ribbon=fanQs('.pulse-ribbon');if(!ribbon)return;
  const active=(data.roster||[]).filter(p=>String(p.status).toLowerCase()==='active').length;
  const reserve=(data.roster||[]).length-active;
  const audit=data.meta?.content_audit_at||data.dataQuality?.contentAuditAt;
  const strip=document.createElement('div');strip.className='home-quality-strip';
  strip.innerHTML=`<span><b>${data.roster?.length||0}</b> players loaded</span><span><b>${active}</b> active</span><span><b>${reserve}</b> reserve / injured</span><span><b>${data.transactions?.length||0}</b> roster moves</span><span class="verified">Content checked ${fanEsc(fanDate(audit))}</span>`;
  ribbon.insertAdjacentElement('afterend',strip);
}

function polishRoster(data){
  if(!data||fanQs('.roster-summary-strip'))return;
  const head=fanQs('.page-head');if(!head)return;
  const players=data.roster||[],active=players.filter(p=>String(p.status).toLowerCase()==='active').length,reserve=players.length-active;
  const strip=document.createElement('section');strip.className='roster-summary-strip';
  strip.innerHTML=`<div><small>Loaded</small><strong>${players.length}</strong><span>players</span></div><div><small>Active</small><strong>${active}</strong><span>current active listing</span></div><div><small>Reserve / injured</small><strong>${reserve}</strong><span>separate status group</span></div><div><small>Roster checked</small><strong>${fanEsc(fanDate(data.meta?.roster_snapshot_at))}</strong><span>Titans official roster</span></div>`;
  const disclosure=fanQs('.roster-fact-disclosure');(disclosure||head).insertAdjacentElement('afterend',strip);
}

function polishGameDay(data,health){
  if(!data||fanQs('.game-day-readiness'))return;
  const head=fanQs('.page-head');if(!head)return;
  const game=fanNextGame(data),weatherCount=fanCoverage(data,'weather_snapshots'),marketCount=fanCoverage(data,'market_odds'),injuryCount=fanCoverage(data,'injury_reports');
  const latestMove=data.transactions?.[0];
  const section=document.createElement('section');section.className='game-day-readiness';
  section.innerHTML=`<div class="game-day-brief-head"><div><small>Game week brief</small><h2>${game?`${game.homeAway==='home'?'TEN vs':'TEN at'} ${fanEsc(game.opponentAbbr)}`:'Next game unavailable'}</h2><p>${game?`${fanEsc(fanTime(game.date))} · ${fanEsc(game.venue||'Venue TBD')} · ${fanEsc(game.network||'TV TBD')}`:'Schedule data is not available.'}</p></div><a href="#games">Full schedule →</a></div><div class="fan-health-grid">${fanStatus('Roster','ready',`${data.roster?.length||0} players loaded`)}${fanStatus('Weather',weatherCount?'ready':'waiting',weatherCount?`${weatherCount} forecast snapshot${weatherCount===1?'':'s'}`:'Forecast not loaded yet')}${fanStatus('Markets',marketCount?'ready':'waiting',marketCount?`${marketCount} market lines loaded`:'No market lines loaded yet')}${fanStatus('Injuries',injuryCount?'ready':'waiting',injuryCount?`${injuryCount} injury-report row${injuryCount===1?'':'s'}`:'No injury report loaded yet')}${fanStatus('Roster moves',latestMove?'ready':'waiting',latestMove?`${fanDate(latestMove.date)} latest official move`:'No roster moves loaded')}${fanStatus('Site data',health?.ok?'live':'waiting',health?.ok?'Live updates available':'Verified backup available')}</div>`;
  head.insertAdjacentElement('afterend',section);
}

function polishStats(data){
  if(!data||fanQs('.warehouse-health-section'))return;
  const head=fanQs('.page-head');if(!head)return;
  const c=data.analytics?.coverage||{};
  const section=document.createElement('section');section.className='warehouse-health-section';
  const metrics=[
    ['Play-by-play',Number(c.plays||0),'plays',Number(c.plays||0)?'ready':'waiting'],
    ['Games with play data',Number(c.games_with_plays||0),'games',Number(c.games_with_plays||0)?'ready':'waiting'],
    ['Injury reports',Number(c.injury_reports||0),'rows',Number(c.injury_reports||0)?'ready':'waiting'],
    ['Weather',Number(c.weather_snapshots||0),'snapshots',Number(c.weather_snapshots||0)?'ready':'waiting'],
    ['Market lines',Number(c.market_odds||0),'rows',Number(c.market_odds||0)?'ready':'waiting'],
    ['Standings',Number(c.standings_snapshots||0),'snapshots',Number(c.standings_snapshots||0)?'ready':'waiting']
  ];
  section.innerHTML=`<div class="warehouse-health-head"><div><small>Data coverage</small><h2>What is loaded here</h2></div><span>A zero means this site has not loaded that data yet — not that the Titans recorded zero production.</span></div><div class="warehouse-health-grid">${metrics.map(([label,value,unit,state])=>`<div class="warehouse-health-card ${state}"><small>${fanEsc(label)}</small><strong>${value}</strong><span>${value?fanEsc(unit):'not loaded yet'}</span></div>`).join('')}</div>`;
  head.insertAdjacentElement('afterend',section);
}

function polishMarkets(data,health){
  if(!data||fanQs('.market-readiness'))return;
  const head=fanQs('.page-head');if(!head)return;
  const rows=data.markets?.rows?.length||0,futures=data.markets?.futures?.length||0,configured=Boolean(health?.providers?.propLine||health?.providers?.oddsApiIo);
  const section=document.createElement('div');section.className='market-readiness';
  section.innerHTML=`${fanStatus('Game markets',rows?'ready':'waiting',rows?`${rows} current rows`:'No saved lines yet')}${fanStatus('Futures',futures?'ready':'waiting',futures?`${futures} current rows`:'No saved futures yet')}${fanStatus('Data source',configured?'ready':'waiting',configured?'Live free source available':'Using fallback source')}`;
  head.insertAdjacentElement('afterend',section);
}

function polishSources(data,health){
  if(!data||fanQs('.source-quality-banner'))return;
  const head=fanQs('.page-head');if(!head)return;
  const enabled=(data.sources||[]).filter(s=>s.enabled).length,total=data.sources?.length||0,audit=data.meta?.content_audit_at;
  const banner=document.createElement('section');banner.className='source-quality-banner';
  banner.innerHTML=`<div><small>Data integrity</small><strong>${health?.ok?'Live data connected':'Verified backup available'}</strong><p>${enabled} of ${total} registered sources enabled · ${data.roster?.length||0} roster players · ${data.feed?.length||0} intel items.</p></div><div class="source-quality-meta"><span>Roster ${data.roster?.length||0}</span><span>Intel ${data.feed?.length||0}</span><span>Checked ${fanEsc(fanDate(audit))}</span></div>`;
  const disclosure=fanQs('.sources-fact-disclosure');(disclosure||head).insertAdjacentElement('afterend',banner);
}

async function fanApply(){
  if(fanRoute()==='transactions')return;
  const {data,health}=await fanLoad();if(!data)return;
  const route=fanRoute();
  if(route==='home')polishHome(data);
  if(route==='roster')polishRoster(data);
  if(route==='live')polishGameDay(data,health);
  if(route==='stats')polishStats(data);
  if(route==='markets')polishMarkets(data,health);
  if(route==='sources')polishSources(data,health);
}

const fanApp=fanQs('#app');if(fanApp)new MutationObserver(()=>queueMicrotask(fanApply)).observe(fanApp,{childList:true});
addEventListener('hashchange',()=>queueMicrotask(fanApply));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){fanData=null;fanHealth=null;queueMicrotask(fanApply)}});
queueMicrotask(fanApply);
