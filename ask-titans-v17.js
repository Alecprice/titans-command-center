(() => {
  'use strict';

  const app=document.querySelector('#app');
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const arr=value=>Array.isArray(value)?value:[];
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=value=>Number.isFinite(Number(value))?Number(value):null;
  const state={data:null,fan:null,score:null,loading:null,viewObserver:null,serial:0};
  const METRICS={
    epa:['EPA','Expected Points Added estimates how much a play helped or hurt scoring expectation.'],
    wpa:['WPA','Win Probability Added estimates how much a play changed a model’s chance of winning.'],
    cpoe:['CPOE','Completion Percentage Over Expected compares completed passes with a model’s expected completion rate.'],
    success:['Success rate','The share of plays that meet a situation-adjusted definition of a successful result.'],
    pressure:['Pressure rate','How often a quarterback is pressured on passing plays in the loaded data.']
  };

  async function load(){
    if(state.data&&state.fan)return state;
    if(state.loading)return state.loading;
    state.loading=Promise.all([
      fetch('/api/data',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null),
      fetch('/api/fan-intel',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null),
      fetch('/api/espn-scoreboard',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)
    ]).then(([data,fan,score])=>{
      state.data=data?.ok?data:{};
      state.fan=fan?.ok?fan:{};
      state.score=score?.ok?score:null;
      return state;
    }).finally(()=>state.loading=null);
    return state.loading;
  }

  const games=()=>arr(state.data?.games);
  const roster=()=>arr(state.data?.roster);
  const moves=()=>arr(state.data?.transactions);
  const injuries=()=>arr(state.fan?.injuries);
  const standings=()=>arr(state.fan?.standings);
  const depth=()=>arr(state.fan?.depthChart?.changes);
  const stats=()=>arr(state.fan?.playerStats);
  const nextGame=()=>games().find(g=>{const t=Date.parse(g?.date);return Number.isFinite(t)&&t>Date.now()&&!/final|bye/i.test(String(g?.status||''))})||null;
  const iso=value=>{const d=new Date(value);return Number.isNaN(d.getTime())?null:d.toISOString()};
  const fmt=value=>{const d=new Date(value);return Number.isNaN(d.getTime())?'Time TBD':new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(d)};
  const age=value=>{const t=Date.parse(value);if(!Number.isFinite(t))return'Freshness not provided';const m=Math.max(0,Math.round((Date.now()-t)/60000));return m<2?'Updated just now':m<60?`Updated ${m} min ago`:m<1440?`Updated ${Math.round(m/60)} hr ago`:`Updated ${Math.round(m/1440)} day${Math.round(m/1440)===1?'':'s'} ago`};
  const sourceTime=(...values)=>values.map(iso).find(Boolean)||null;
  const clean=value=>String(value??'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

  function scoreGame(){
    for(const event of arr(state.score?.payload?.events)){
      const comp=event?.competitions?.[0],teams=arr(comp?.competitors),ten=teams.find(x=>x?.team?.abbreviation==='TEN');
      if(!ten)continue;
      const opp=teams.find(x=>x!==ten)||{},status=comp?.status||event?.status||{};
      return {status:status.type?.description||status.type?.name||'',detail:status.type?.shortDetail||status.type?.detail||'',clock:status.displayClock||'',period:status.period||null,tenScore:num(ten.score),oppScore:num(opp.score),opponent:opp.team?.displayName||'Opponent',opponentAbbr:opp.team?.abbreviation||'OPP',date:event.date||comp?.date||''};
    }
    return null;
  }

  function findPlayer(query){
    const q=clean(query);if(!q)return null;
    const exact=roster().find(p=>q.includes(clean(p.name))&&clean(p.name).length>3);if(exact)return exact;
    const tokens=q.split(' ').filter(x=>x.length>2),candidates=roster().map(p=>({p,score:clean(p.name).split(' ').filter(x=>tokens.includes(x)).length})).filter(x=>x.score).sort((a,b)=>b.score-a.score);
    return candidates[0]?.p||null;
  }

  function fact(label,value){return {label,value:String(value)}}
  function source(label,detail,updatedAt=null,href=''){return {label,detail,updatedAt,href}}
  function response(answer,why,facts=[],sources=[],action=null,confidence='Verified loaded data'){return {answer,why,facts,sources,action,confidence}}

  function nextGameAnswer(){
    const g=nextGame();
    if(!g)return response('The next Titans game is not available in the loaded schedule yet.','I will not guess a kickoff or opponent when the schedule row is missing.',[],[source('Titans schedule data','Internal verified schedule feed',state.data?.fetchedAt||state.data?.meta?.updatedAt)],{label:'Open Schedule',href:'#games'},'Data unavailable');
    return response(`Tennessee is next scheduled ${g.homeAway==='home'?'to host':'to visit'} ${g.opponent||g.opponentAbbr} on ${fmt(g.date)}.`,`That is the next non-final, non-bye game in the loaded Titans schedule. ${g.network?`${g.network} is the listed network.`:'The network is not loaded yet.'}`,[fact('Opponent',g.opponent||g.opponentAbbr||'TBD'),fact('Kickoff',fmt(g.date)),fact('Network',g.network||'TBD'),fact('Venue',g.venue||'TBD')],[source('Schedule','Titans Command Center loaded schedule',g.updatedAt||state.data?.fetchedAt||state.data?.meta?.updatedAt)],{label:'Open Game Day',href:'#live'});
  }

  function watchAnswer(){
    const g=nextGame();
    return response(g?`The next game is ${fmt(g.date)} and the loaded TV listing is ${g.network||'TBD'}. Open Listen / Watch for your device-local time, Eastern time, Nashville time, UTC, radio, and territory-specific viewing guidance.`:'The next kickoff is not loaded, but Listen / Watch still has the official and licensed provider guides.','Broadcast rights vary by location, so the media center keeps viewing guidance separate by Nashville, elsewhere in the U.S., and international fans.',g?[fact('Listed network',g.network||'TBD'),fact('Kickoff',fmt(g.date))]:[],[source('Broadcast guide','Titans Command Center media routing',g?.updatedAt||state.data?.fetchedAt)],{label:'Open Listen / Watch',href:'#media'});
  }

  function standingsAnswer(){
    const rows=standings(),ten=rows.find(x=>x.abbreviation==='TEN');
    if(!ten)return response('Regular-season AFC South standings are not loaded yet.','Preseason results should not be presented as regular-season standings.',[],[source('Standings','Fan intelligence standings feed',state.fan?.fetchedAt)],{label:'Open Fan Hub',href:'#fan'},'Data unavailable');
    const south=rows.filter(x=>x.division==='AFC South').sort((a,b)=>(a.divisionRank??99)-(b.divisionRank??99));
    return response(`Tennessee is ${ten.record||`${ten.wins??'—'}-${ten.losses??'—'}`}${ten.divisionRank?` and currently ranks ${ten.divisionRank} in the AFC South`:''}.`,'Division position matters because it is the first simple snapshot of where Tennessee sits, but official playoff seeding can require league tiebreakers not reproduced here.',[fact('TEN record',ten.record||`${ten.wins??'—'}-${ten.losses??'—'}`),...south.slice(0,4).map(x=>fact(`#${x.divisionRank??'—'} ${x.abbreviation}`,x.record||`${x.wins??'—'}-${x.losses??'—'}`))],[source('AFC South standings','Loaded structured standings',state.fan?.fetchedAt||ten.capturedAt)],{label:'Open Season Center',href:'#fan'});
  }

  function injuryAnswer(query){
    const player=findPlayer(query),rows=injuries(),matching=player?rows.filter(x=>clean(x.name).includes(clean(player.name))||clean(player.name).includes(clean(x.name))):rows;
    if(player&&matching.length){const x=matching[0];return response(`${player.name}: ${x.practiceStatus||x.reportStatus||x.primaryInjury||'an injury-report row is loaded'}.`,'Practice and report designations describe the latest loaded availability information; they are not a medical diagnosis or guarantee of game status.',[fact('Player',player.name),fact('Practice',x.practiceStatus||'Not listed'),fact('Game status',x.reportStatus||'Not listed'),fact('Injury',x.primaryInjury||'Not specified')],[source('Injury report','Loaded weekly injury-report data',x.reportDate||x.capturedAt||state.fan?.fetchedAt)],{label:'Open Team Intel',href:'#fan'});}
    if(rows.length)return response(`${rows.length} current injury-report row${rows.length===1?' is':'s are'} loaded.`,'These are current structured report rows. Reserve/Injured roster status is tracked separately from the weekly injury report.',[fact('Loaded rows',rows.length),...rows.slice(0,4).map(x=>fact(x.name||'Player',x.practiceStatus||x.reportStatus||x.primaryInjury||'Reported'))],[source('Injury report','Loaded weekly injury-report data',sourceTime(rows[0]?.reportDate,rows[0]?.capturedAt,state.fan?.fetchedAt))],{label:'Open Team Intel',href:'#fan'});
    return response('No current weekly injury-report rows are loaded.','That does not mean the roster has zero injuries. The site deliberately avoids turning missing weekly-report data into an all-clear.',[],[source('Injury report','No current rows in the structured feed',state.fan?.fetchedAt)],{label:'Open Roster',href:'#roster'},'Data unavailable');
  }

  function moveAnswer(query){
    const player=findPlayer(query),rows=player?moves().filter(x=>clean([x.description,x.title,x.summary,x.player,x.name].join(' ')).includes(clean(player.name))):moves();
    const x=rows[0];
    if(!x)return response(player?`No loaded transaction currently matches ${player.name}.`:'No roster transaction is loaded right now.','A missing transaction row is reported as missing rather than converted into a claim that nothing happened.',[],[source('Transactions','Loaded Titans transaction feed',state.data?.fetchedAt)],{label:'Open Transactions',href:'#transactions'},'Data unavailable');
    return response(player?`Latest loaded ${player.name} roster movement: ${x.description||x.title||x.summary||'transaction recorded'}.`:`Latest loaded roster move: ${x.description||x.title||x.summary||'transaction recorded'}.`,'Roster movement can change depth, role, and available game-day personnel. The Change Engine tracks follow-on depth and availability updates separately.',[fact('Type',x.type||'Transaction'),fact('Date',x.date?fmt(x.date):'Date not loaded')],[source('Transactions','Loaded Titans transaction record',x.date||x.publishedAt||x.capturedAt||state.data?.fetchedAt)],{label:'Open Transactions',href:'#transactions'});
  }

  function depthAnswer(query){
    const player=findPlayer(query),rows=player?depth().filter(x=>clean(x.name).includes(clean(player.name))):depth();
    if(!rows.length)return response(player?`No loaded depth-chart change currently matches ${player.name}.`:'No depth-chart movement is detected between the latest two loaded snapshots.','This only describes the snapshots the site has. It does not infer practice reps or coaching intent.',[],[source('Depth chart','Structured depth snapshot comparison',state.fan?.depthChart?.capturedAt||state.fan?.fetchedAt)],{label:'Open Command Intel',href:'#command'});
    const x=rows[0];
    return response(player?`${player.name} has a loaded depth-chart change: ${x.type||'role change'}${x.from||x.to?` (${x.from||'—'} → ${x.to||'—'})`:''}.`:`${rows.length} depth-chart change${rows.length===1?' is':'s are'} detected between the latest snapshots.`,'Depth movement is useful because it can reveal a listed role change before raw season totals make the change obvious.',[...rows.slice(0,5).map(r=>fact(r.name||'Player',`${r.type||'change'}${r.from||r.to?` · ${r.from||'—'} → ${r.to||'—'}`:''}`))],[source('Depth chart','Structured snapshot comparison',state.fan?.depthChart?.capturedAt||state.fan?.fetchedAt)],{label:'Open Change Engine',href:'#command'});
  }

  function playerAnswer(query){
    const p=findPlayer(query);if(!p)return null;
    const rows=stats().filter(x=>clean(x.name)===clean(p.name)).sort((a,b)=>(Number(b.week)||0)-(Number(a.week)||0)),recent=rows.slice(0,3);
    const totals=new Map();
    for(const row of recent)for(const [key,value] of Object.entries(row.stats||{})){const n=num(value);if(n!=null)totals.set(key,(totals.get(key)||0)+n)}
    const top=[...totals.entries()].sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,4);
    const injury=injuries().find(x=>clean(x.name)===clean(p.name));
    return response(`${p.name} is listed as ${p.position||'position TBD'}${p.number?` #${p.number}`:''}${p.status?` with roster status ${p.status}`:''}.`,recent.length?`I found structured player-game rows for ${recent.length} recent loaded stat group${recent.length===1?'':'s'}. The numbers below are sums of loaded numeric fields only, not a film grade.`:'No recent structured player-game rows are loaded, so I am not treating missing stats as zero production.',[fact('Position',p.position||'TBD'),fact('Roster status',p.status||'Active / status not specified'),...(injury?[fact('Latest availability',injury.practiceStatus||injury.reportStatus||injury.primaryInjury||'Reported')]:[]),...top.map(([k,v])=>fact(String(k).replace(/_/g,' '),v))],[source('Roster','Current loaded Titans roster',p.updatedAt||state.data?.fetchedAt),source('Player-game warehouse',recent.length?'Loaded numeric player stats':'No recent matching rows',recent[0]?.capturedAt||state.fan?.fetchedAt)],{label:`Open ${p.name}`,href:p.id?`#player?id=${encodeURIComponent(p.id)}`:'#roster'});
  }

  function liveAnswer(){
    const g=scoreGame();
    if(!g)return response('No current Titans scoreboard event is loaded.','Without a current scoreboard event, Ask Titans will not invent a live score, clock, possession, or game state.',[],[source('Scoreboard','Internal scoreboard proxy',state.score?.fetchedAt)],{label:'Open Game Day',href:'#live'},'No live event');
    const isLive=/in progress|halftime|end of/i.test(`${g.status} ${g.detail}`);
    if(!isLive)return response(`The scoreboard event is ${g.detail||g.status||'not marked live'}${g.date?` for ${fmt(g.date)}`:''}.`,'The live command surface only activates when the upstream status genuinely indicates a game in progress.',[fact('Status',g.detail||g.status||'Unknown'),fact('Opponent',g.opponent)],[source('Scoreboard','Internal ESPN scoreboard proxy',state.score?.fetchedAt||g.date)],{label:'Open Game Day',href:'#live'});
    return response(`TEN ${g.tenScore??'—'} — ${g.opponentAbbr} ${g.oppScore??'—'}${g.clock?` · ${g.clock}`:''}${g.period?` · Q${g.period}`:''}.`,'This is the current loaded scoreboard state. Drive, play, EPA, and WPA context appears in Game Day only when trustworthy structured rows are available.',[fact('Game status',g.detail||g.status||'Live'),fact('Opponent',g.opponent)],[source('Scoreboard','Internal ESPN scoreboard proxy',state.score?.fetchedAt||new Date().toISOString())],{label:'Open Game Day',href:'#live'});
  }

  function changedAnswer(){
    const tx=moves()[0],inj=injuries()[0],dc=depth()[0],g=nextGame(),facts=[];
    if(tx)facts.push(fact('Latest move',tx.description||tx.title||'Roster transaction'));
    if(inj)facts.push(fact('Latest availability row',`${inj.name||'Player'} · ${inj.practiceStatus||inj.reportStatus||inj.primaryInjury||'updated'}`));
    if(dc)facts.push(fact('Latest depth change',`${dc.name||'Player'} · ${dc.type||'changed'}`));
    if(g)facts.push(fact('Next broadcast',`${g.opponentAbbr||g.opponent||'Opponent'} · ${g.network||'TV TBD'}`));
    return response(facts.length?`${facts.length} high-signal categories have current loaded evidence to review.`:'No high-signal change evidence is loaded right now.','This is a current-data briefing, not a claim that every item happened today. For true before/after “since your last visit” detection, the Command Intel Change Engine compares saved snapshots.',facts,[source('Command data','Roster, availability, depth and schedule feeds',sourceTime(state.data?.fetchedAt,state.fan?.fetchedAt))],{label:'Open What Changed?',href:'#command'});
  }

  function favoriteAnswer(){
    let profile={};try{profile=JSON.parse(localStorage.getItem('titans:v15MyTitans')||'{}')}catch{}
    let legacy=[];try{legacy=JSON.parse(localStorage.getItem('titans:favoritePlayers')||'[]')}catch{}
    const names=[];if(profile.favorite)names.push(profile.favorite);for(const id of arr(legacy)){const p=roster().find(x=>String(x.id)===String(id));if(p&&!names.includes(p.name))names.push(p.name)}
    return response(names.length?`Your saved Titans player${names.length===1?' is':'s are'} ${names.join(', ')}.`:'You have not saved a favorite player yet.','Favorites are stored locally on this device and help the site prioritize the players you care about.',names.map((x,i)=>fact(`Favorite ${i+1}`,x)),[source('My Titans','Device-local preference','')],{label:'Choose from Roster',href:'#roster'},'Device-local preference');
  }

  function metricAnswer(query){
    const q=clean(query),entry=Object.entries(METRICS).find(([key,[label]])=>q.includes(key)||q.includes(clean(label)));
    if(!entry)return null;const [, [label,definition]]=entry;
    return response(`${label}: ${definition}`,'Advanced metrics are context tools, not standalone player grades. Command Center labels model-derived metrics and keeps them behind plain-English explanations.',[fact('Use it for','Adding context to play/team performance'),fact('Do not treat it as','Certainty or a complete film grade')],[source('Stats glossary','Titans Command Center metric definitions',state.fan?.fetchedAt)],{label:'Open Stats Lab',href:'#stats'});
  }

  function answer(query){
    const q=clean(query);if(!q)return response('Ask me a Titans question.','I answer from the structured data already loaded by Command Center.',[],[],null,'Waiting for question');
    const metric=metricAnswer(q);if(metric)return metric;
    if(/watch|listen|radio|stream|broadcast|channel|network|what time/.test(q))return watchAnswer();
    if(/live|score|clock|quarter|game status/.test(q))return liveAnswer();
    if(/next game|who.*next|who.*play|opponent|kickoff/.test(q))return nextGameAnswer();
    if(/stand|record|afc south|division rank/.test(q))return standingsAnswer();
    if(/injur|practice|available|availability|questionable|doubtful/.test(q))return injuryAnswer(q);
    if(/transaction|roster move|signed|signing|waived|released|cut/.test(q))return moveAnswer(q);
    if(/depth|starter|backup|role change/.test(q))return depthAnswer(q);
    if(/what changed|changed today|new today|since/.test(q))return changedAnswer();
    if(/favorite|my player/.test(q))return favoriteAnswer();
    const player=playerAnswer(q);if(player)return player;
    return response('I could not map that question to a trustworthy loaded-data answer yet.','Ask Titans 2.0 prefers saying “I do not have that data” over inventing an answer.',[fact('Try','Next game · injuries · latest move · depth chart · a player name · live score · how to watch · EPA')],[source('Ask Titans 2.0','Structured-data answer engine',new Date().toISOString())],null,'No supported data intent');
  }

  function renderAnswer(result){
    const facts=result.facts.length?`<div class="v17-ask-facts">${result.facts.map(x=>`<div><small>${esc(x.label)}</small><strong>${esc(x.value)}</strong></div>`).join('')}</div>`:'';
    const sources=result.sources.length?`<div class="v17-ask-sources"><small>SOURCE + FRESHNESS</small>${result.sources.map(x=>`<div><div><strong>${esc(x.label)}</strong><span>${esc(x.detail)}</span></div><em>${esc(x.updatedAt?age(x.updatedAt):'Freshness not provided')}</em>${x.href?`<a href="${esc(x.href)}">Open →</a>`:''}</div>`).join('')}</div>`:'';
    return `<article class="v17-ask-answer"><div class="v17-answer-top"><span>ANSWER</span><b>${esc(result.confidence)}</b></div><h4>${esc(result.answer)}</h4><div class="v17-why"><small>WHY IT MATTERS</small><p>${esc(result.why)}</p></div>${facts}${sources}${result.action?`<a class="button primary v17-answer-action" href="${esc(result.action.href)}">${esc(result.action.label)} →</a>`:''}</article>`;
  }

  function shell(){return `<section class="v17-ask" aria-label="Ask Titans 2.0"><header><div><small>ASK TITANS 2.0</small><h3>Ask the Command Center</h3><p>Plain-English answers from loaded Titans data — with evidence, freshness, and no made-up certainty.</p></div><span>STRUCTURED DATA</span></header><div class="v17-ask-form"><label for="v17-ask-input">What do you want to know?</label><div><input id="v17-ask-input" type="search" autocomplete="off" placeholder="Example: What changed? How is Cam Ward doing?"><button type="button" class="button primary" data-v17-ask>Ask</button></div></div><div class="v17-quick" aria-label="Quick questions"><button type="button" data-v17-q="What changed?">What changed?</button><button type="button" data-v17-q="Who is next?">Who is next?</button><button type="button" data-v17-q="Any injuries?">Injuries</button><button type="button" data-v17-q="How do I watch?">Watch</button><button type="button" data-v17-q="Cam Ward">Cam Ward</button><button type="button" data-v17-q="What is EPA?">Explain EPA</button></div><div class="v17-ask-result" data-v17-result aria-live="polite"><div class="v17-ask-empty"><strong>Ask a Titans question.</strong><span>I will show the answer, why it matters, supporting facts, source, and freshness.</span></div></div></section>`}

  async function ask(query){
    const out=document.querySelector('[data-v17-result]');if(!out)return;
    out.innerHTML='<div class="v17-ask-empty"><strong>Checking loaded Titans data…</strong><span>Roster, game, injury, depth and scoreboard context.</span></div>';
    await load();if(route()!=='fan'||!document.querySelector('.v17-ask'))return;
    out.innerHTML=renderAnswer(answer(query));
  }

  function bind(root){
    root.querySelector('[data-v17-ask]')?.addEventListener('click',()=>ask(root.querySelector('#v17-ask-input')?.value||''));
    root.querySelector('#v17-ask-input')?.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();ask(event.currentTarget.value)}});
    root.querySelectorAll('[data-v17-q]').forEach(button=>button.addEventListener('click',()=>{const input=root.querySelector('#v17-ask-input');if(input)input.value=button.dataset.v17Q||'';ask(button.dataset.v17Q||'')}));
  }

  function upgrade(){
    if(route()!=='fan')return;
    const legacy=document.querySelector('.v13-ask');if(!legacy||legacy.dataset.v17Upgraded==='1')return;
    const wrap=document.createElement('div');wrap.innerHTML=shell();const root=wrap.firstElementChild;legacy.replaceWith(root);bind(root);
  }

  function watchFanView(){
    state.viewObserver?.disconnect();state.viewObserver=null;
    if(route()!=='fan')return;
    const view=document.querySelector('#v13-view');if(!view)return;
    upgrade();state.viewObserver=new MutationObserver(()=>queueMicrotask(upgrade));state.viewObserver.observe(view,{childList:true,subtree:false});
  }

  if(app)new MutationObserver(()=>queueMicrotask(watchFanView)).observe(app,{childList:true,subtree:false});
  addEventListener('hashchange',()=>{state.serial++;setTimeout(watchFanView,50)});
  setTimeout(watchFanView,100);
})();