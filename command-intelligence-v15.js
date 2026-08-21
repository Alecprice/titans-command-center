(() => {
  'use strict';

  const ROUTE='command';
  const TAB_KEY='titans:v15CommandTab';
  const SNAP_KEY='titans:v15ChangeSnapshot';
  const PASSPORT_KEY='titans:v15FanPassport';
  const GM_KEY='titans:v15FanGM';
  const SINCE_KEY='titans:v15FanSince';
  const SPOILER_KEY='titans:v15SpoilerFree';
  const app=document.querySelector('#app');
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const safeArr=value=>Array.isArray(value)?value:[];
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const jsonGet=(key,fallback)=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}};
  const jsonSet=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
  const textGet=(key,fallback='')=>{try{return localStorage.getItem(key)||fallback}catch{return fallback}};
  const textSet=(key,value)=>{try{localStorage.setItem(key,String(value));return true}catch{return false}};
  const fmtDate=value=>{const d=new Date(value);return Number.isNaN(d.getTime())?'TBD':new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'}).format(d)};
  const zoneFmt=(value,timeZone)=>{try{const d=new Date(value);if(Number.isNaN(d.getTime()))return'TBD';return new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short',timeZone}).format(d)}catch{return'TBD'}};
  const slug=value=>String(value??'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

  const TABS=[
    ['changes','Changes'],['press','Press Room'],['scheme','Scheme Lab'],['global','Global Fans'],['stadium','Stadium'],['gm','Fan GM'],['history','Time Machine']
  ];
  const STADIUM_SOURCES={
    project:'https://www.tennesseetitans.com/new-stadium/',
    faq:'https://www.tennesseetitans.com/new-stadium/info',
    update:'https://www.tennesseetitans.com/news/checking-in-with-titans-president-and-ceo-burke-nihill-from-the-nfl-owners-meetings'
  };
  const PRESS_SOURCE='https://www.tennesseetitans.com/video/press-conferences';

  const state={
    data:null,fan:null,loading:null,
    tab:TABS.some(([id])=>id===textGet(TAB_KEY))?textGet(TAB_KEY):'changes',
    previousSnapshot:jsonGet(SNAP_KEY,null),snapshotSaved:false,
    selectedPlayer:'',scheme:'11',pressAnalysis:null,recordPlayer:''
  };

  function applySpoilerMode(){document.body.classList.toggle('v15-spoiler-free',textGet(SPOILER_KEY)==='1')}
  applySpoilerMode();

  async function load(){
    if(state.data||state.loading)return state.loading||state;
    state.loading=Promise.all([
      fetch('/api/data',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null),
      fetch('/api/fan-intel',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)
    ]).then(([data,fan])=>{state.data=data?.ok?data:{};state.fan=fan?.ok?fan:{};return state}).finally(()=>{state.loading=null});
    return state.loading;
  }

  const roster=()=>safeArr(state.data?.roster);
  const transactions=()=>safeArr(state.data?.transactions);
  const feed=()=>safeArr(state.data?.feed);
  const games=()=>safeArr(state.data?.games);
  const injuries=()=>safeArr(state.fan?.injuries);
  const depthChanges=()=>safeArr(state.fan?.depthChart?.changes);
  const playerStats=()=>safeArr(state.fan?.playerStats);
  const nextGame=()=>games().find(g=>{const t=Date.parse(g?.date);return Number.isFinite(t)&&t>Date.now()&&!/final|bye/i.test(String(g?.status||''))})||null;
  const playerName=p=>p?.name||p?.fullName||p?.full_name||p?.player||'Player';
  const playerPos=p=>p?.position||p?.pos||'';
  const playerNumber=p=>p?.number??p?.jerseyNumber??p?.jersey_number??'';

  function syncChrome(){
    document.querySelectorAll('[data-route]').forEach(a=>{const active=a.dataset.route===route();a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    const sidebar=document.querySelector('#sidebar');sidebar?.classList.remove('open');if(sidebar&&matchMedia('(max-width:759px)').matches)sidebar.inert=true;
    const more=document.querySelector('#mobile-more-button');if(more){more.setAttribute('aria-expanded','false');more.setAttribute('aria-pressed','false')}
  }

  function tabs(){return `<div class="v15-tabs" role="tablist" aria-label="Command Intelligence sections">${TABS.map(([id,label])=>`<button type="button" role="tab" data-v15-tab="${id}" aria-selected="${state.tab===id}" class="${state.tab===id?'active':''}">${esc(label)}</button>`).join('')}</div>`}
  const card=(label,title,body,extra='')=>`<article class="v15-card"><small>${esc(label)}</small><h3>${esc(title)}</h3><p>${body}</p>${extra}</article>`;

  function transactionKey(t){return slug([t?.date,t?.publishedAt,t?.type,t?.title,t?.summary,t?.player,t?.name].filter(Boolean).join('|'))}
  function injuryKey(x){return slug([x?.name,x?.primaryInjury,x?.reportStatus,x?.practiceStatus,x?.reportDate].join('|'))}
  function rosterKey(p){return slug([playerName(p),playerPos(p),p?.status,playerNumber(p)].join('|'))}
  function gameKey(g){return slug([g?.id,g?.week,g?.date,g?.opponent,g?.network,g?.status].join('|'))}
  function snapshot(){return{
    at:new Date().toISOString(),
    transactions:transactions().slice(0,40).map(t=>({key:transactionKey(t),label:t?.title||t?.summary||t?.name||'Transaction'})),
    injuries:injuries().slice(0,60).map(x=>({key:injuryKey(x),label:`${x?.name||'Player'} · ${x?.practiceStatus||x?.reportStatus||x?.primaryInjury||'status update'}`})),
    roster:roster().map(p=>({key:rosterKey(p),name:playerName(p),position:playerPos(p)})),
    games:games().filter(g=>g?.id||g?.week).map(g=>({id:String(g.id||g.week),key:gameKey(g),label:`${g?.week??''} ${g?.opponent||''} · ${g?.network||'TBD'}`})),
    depth:depthChanges().map(x=>({key:slug([x?.name,x?.type,x?.from,x?.to,x?.position].join('|')),label:`${x?.name||'Player'} · ${x?.type||'depth change'}`}))
  }}

  function diffSnapshot(prev,curr){
    if(!prev)return[];
    const out=[];
    const newer=(kind,items,oldItems,why)=>{const old=new Set(safeArr(oldItems).map(x=>x.key));for(const item of safeArr(items)){if(item.key&&!old.has(item.key))out.push({kind,label:item.label||item.name||kind,why})}};
    newer('Roster move',curr.transactions,prev.transactions,'The roster composition or transaction log changed.');
    newer('Injury',curr.injuries,prev.injuries,'A player availability or practice designation changed.');
    newer('Depth chart',curr.depth,prev.depth,'The pecking order or listed role changed.');
    const oldRoster=new Map(safeArr(prev.roster).map(x=>[x.name,x]));
    const newRoster=new Map(safeArr(curr.roster).map(x=>[x.name,x]));
    for(const [name,p] of newRoster){if(!oldRoster.has(name))out.push({kind:'Roster',label:`${name} added to current snapshot`,why:'The current roster snapshot gained a player.'})}
    for(const [name] of oldRoster){if(!newRoster.has(name))out.push({kind:'Roster',label:`${name} no longer in current snapshot`,why:'The current roster snapshot no longer includes this player.'})}
    const oldGames=new Map(safeArr(prev.games).map(x=>[x.id,x]));
    for(const g of safeArr(curr.games)){const old=oldGames.get(g.id);if(old&&old.key!==g.key)out.push({kind:'Broadcast / schedule',label:g.label,why:'Kickoff, network or game status changed since the saved snapshot.'})}
    return out.slice(0,30);
  }

  function sourceTier(item){
    const tier=String(item?.tier||'').toLowerCase(),url=String(item?.url||'');
    if(tier==='official'||/tennesseetitans\.com|nfl\.com/.test(url))return['VERIFIED','Official team / league'];
    if(/espn\.com|apnews\.com|reuters\.com/.test(url))return['MAJOR OUTLET','Independent reporting'];
    if(tier==='community')return['COMMUNITY','Community signal, not confirmation'];
    return['EXTERNAL','Needs cross-check'];
  }

  function changesView(){
    const curr=snapshot(),changes=diffSnapshot(state.previousSnapshot,curr);
    if(!state.snapshotSaved){jsonSet(SNAP_KEY,curr);state.snapshotSaved=true}
    const changeHtml=state.previousSnapshot?(changes.length?changes.map(x=>`<article class="v15-change"><div><small>${esc(x.kind)}</small><strong>${esc(x.label)}</strong></div><p><b>Why it matters:</b> ${esc(x.why)}</p></article>`).join(''):`<div class="v15-empty"><strong>No detected changes since the saved snapshot.</strong><span>The engine compares roster, transactions, injuries, depth changes and game/broadcast details.</span></div>`):`<div class="v15-empty"><strong>Baseline created.</strong><span>Come back after data changes and this page will show before/after differences instead of making you hunt across sections.</span></div>`;
    const tx=transactions().slice(0,6).map(t=>`<li><strong>${esc(t?.title||t?.summary||t?.name||'Transaction')}</strong><span>${esc(fmtDate(t?.date||t?.publishedAt||t?.createdAt||''))}</span></li>`).join('')||'<li>No recent transaction rows loaded.</li>';
    const sourceRows=feed().slice(0,10).map(item=>{const [badge,note]=sourceTier(item);return`<li><span class="v15-source-badge">${badge}</span><div><strong>${esc(item?.source||'Source')}</strong><small>${esc(note)} · ${esc(item?.title||item?.summary||'Update')}</small></div></li>`}).join('')||'<li>No feed rows loaded.</li>';
    return `<section class="v15-pane"><header class="v15-section-head"><div><small>SIGNATURE FEATURE</small><h2>Titans Change Engine</h2><p>What changed, when it changed, and why a fan should care.</p></div><div class="v15-count"><strong>${changes.length}</strong><span>changes</span></div></header><div class="v15-change-list">${changeHtml}</div><div class="v15-grid two"><section class="v15-panel"><h3>Latest roster movement</h3><ul class="v15-list">${tx}</ul><a href="#transactions">Open transactions →</a></section><section class="v15-panel"><h3>Source reliability</h3><p class="v15-muted">Evidence tiers show what a source is. We do not invent an accuracy percentage without a verified history.</p><ul class="v15-source-list">${sourceRows}</ul><a href="#sources">Open source registry →</a></section></div>${playerJourneyView()}</section>`
  }

  function playerJourneyView(){
    const players=roster().slice().sort((a,b)=>playerName(a).localeCompare(playerName(b)));
    if(!state.selectedPlayer&&players.length)state.selectedPlayer=playerName(players[0]);
    const p=players.find(x=>playerName(x)===state.selectedPlayer)||players[0];
    if(!p)return'';
    const name=playerName(p),pos=playerPos(p),exp=p?.experience||p?.exp||'';
    const mentions=[...transactions(),...feed()].filter(x=>slug([x?.title,x?.summary,x?.name,x?.player].join(' ')).includes(slug(name))).slice(0,8);
    const peers=players.filter(x=>playerName(x)!==name&&(playerPos(x)===pos||(exp&&String(x?.experience||x?.exp||'')===String(exp)))).slice(0,8);
    return `<section class="v15-panel v15-journey"><div class="v15-panel-head"><div><small>PLAYER JOURNEY + CONNECTIONS</small><h3>${esc(name)}</h3></div><label>Player<select data-v15-player>${players.map(x=>`<option ${playerName(x)===name?'selected':''}>${esc(playerName(x))}</option>`).join('')}</select></label></div><div class="v15-player-facts"><span>#${esc(playerNumber(p)||'—')}</span><span>${esc(pos||'Position TBD')}</span><span>${esc(p?.unit||p?.side||'Titans')}</span><span>${esc(exp?`Exp ${exp}`:'Experience not loaded')}</span></div><div class="v15-grid two"><div><h4>Timeline evidence</h4>${mentions.length?mentions.map(x=>`<div class="v15-mini"><strong>${esc(x?.title||x?.summary||'Roster mention')}</strong><small>${esc(fmtDate(x?.publishedAt||x?.date||''))}</small></div>`).join(''):'<p class="v15-muted">No matching transaction/feed history is loaded for this player yet.</p>'}</div><div><h4>Roster connections</h4><p class="v15-muted">Connections use current position / experience metadata, not guessed friendships.</p><div class="v15-chips">${peers.map(x=>`<span>${esc(playerName(x))} · ${esc(playerPos(x))}</span>`).join('')||'<span>No comparable metadata loaded</span>'}</div></div></div></section>`
  }

  function pressView(){
    const pressItems=feed().filter(x=>/press|conference|podium|interview|saleh|borgonzi/i.test([x?.title,x?.summary,...safeArr(x?.topics)].join(' '))).slice(0,10);
    const analysis=state.pressAnalysis;
    const analysisHtml=analysis?`<div class="v15-analysis"><div><small>PLAYERS MENTIONED</small><strong>${analysis.players.length?analysis.players.map(esc).join(' · '):'No roster names detected'}</strong></div><div><small>TOPICS</small><strong>${analysis.topics.length?analysis.topics.map(esc).join(' · '):'No tracked topics detected'}</strong></div><div><small>CHANGE LANGUAGE</small><strong>${analysis.signals.length?analysis.signals.map(esc).join(' / '):'No obvious change-language detected'}</strong></div></div>`:'';
    return `<section class="v15-pane"><header class="v15-section-head"><div><small>PRESS CONFERENCE INTELLIGENCE</small><h2>Press Room</h2><p>Turn long media sessions into searchable Titans context without pretending a video transcript exists when it does not.</p></div><a class="button" href="${PRESS_SOURCE}" target="_blank" rel="noopener noreferrer">Official press conferences ↗</a></header><div class="v15-grid two"><section class="v15-panel"><h3>Recent media signals</h3>${pressItems.length?pressItems.map(item=>{const [badge,note]=sourceTier(item);return`<a class="v15-press-row" href="${esc(item.url||PRESS_SOURCE)}" target="_blank" rel="noopener noreferrer"><span>${badge}</span><div><strong>${esc(item?.title||'Press item')}</strong><small>${esc(note)} · ${esc(fmtDate(item?.publishedAt||''))}</small></div></a>`}).join(''):'<div class="v15-empty"><strong>No press-specific feed items loaded.</strong><span>Use the official press center or analyze a transcript below.</span></div>'}</section><section class="v15-panel"><h3>Analyze a transcript locally</h3><p class="v15-muted">Paste text you already have. Analysis happens in this browser and is not uploaded.</p><textarea data-v15-transcript rows="9" placeholder="Paste press conference transcript or notes…"></textarea><button class="button" type="button" data-v15-analyze>Analyze transcript</button>${analysisHtml}</section></div></section>`
  }

  function analyzeTranscript(text){
    const lower=String(text||'').toLowerCase();
    const players=roster().map(playerName).filter(name=>lower.includes(name.toLowerCase())).slice(0,16);
    const topics={injury:/injur|limited|practice|rehab|return/,depth:/starter|depth|first team|second team|reps/,offense:/offense|quarterback|receiver|run game|pass game|protection/,defense:/defense|coverage|pressure|rush|tackle/,specialTeams:/special teams|returner|kickoff|punt/,roster:/roster|cut|waive|sign|53-man/};
    const found=Object.entries(topics).filter(([,rx])=>rx.test(lower)).map(([k])=>k.replace(/([A-Z])/g,' $1'));
    const signals=(String(text||'').match(/[^.!?]*(?:now|today|expect|will|won't|limited|full participant|starter|first[- ]team|changed)[^.!?]*[.!?]?/gi)||[]).map(x=>x.trim()).filter(Boolean).slice(0,4);
    state.pressAnalysis={players,topics:found,signals};
  }

  const conceptData={
    '11':{title:'11 personnel',plain:'One running back, one tight end and three wide receivers. It creates flexible run/pass looks without changing personnel.',positions:['QB','RB','TE','WR']},
    nickel:{title:'Nickel defense',plain:'Five defensive backs on the field. It is a common answer to spread passing formations.',positions:['CB','DB','S','LB']},
    rush4:{title:'Four-man pressure',plain:'Four rushers attack while seven defenders handle coverage. The advantage is keeping more bodies behind the pressure.',positions:['DE','DL','DT','LB']},
    zone:{title:'Zone run family',plain:'The offensive line works areas and combinations instead of every blocker owning one defender. Running backs read leverage and cut lanes.',positions:['C','G','T','RB']},
    playaction:{title:'Play action',plain:'The offense sells a run before throwing. It tries to move linebackers and create space behind them.',positions:['QB','RB','TE','WR']}
  };
  function schemeView(){const c=conceptData[state.scheme]||conceptData['11'];const fits=roster().filter(p=>c.positions.includes(playerPos(p))).slice(0,14);return`<section class="v15-pane"><header class="v15-section-head"><div><small>FOOTBALL EXPLAINED WITH TITANS PERSONNEL</small><h2>Scheme Lab</h2><p>Simple first. Deeper second. These are educational concept maps, not claims about a private Titans playbook.</p></div></header><div class="v15-scheme-picker">${Object.entries(conceptData).map(([id,x])=>`<button type="button" data-v15-scheme="${id}" class="${state.scheme===id?'active':''}">${esc(x.title)}</button>`).join('')}</div><section class="v15-panel v15-scheme-detail"><small>QUICK ANSWER</small><h3>${esc(c.title)}</h3><p>${esc(c.plain)}</p><h4>Current Titans position groups that fit this teaching example</h4><div class="v15-roster-map">${fits.map(p=>`<div><strong>${esc(playerName(p))}</strong><span>${esc(playerPos(p))} · #${esc(playerNumber(p)||'—')}</span></div>`).join('')||'<p>No matching roster metadata loaded.</p>'}</div><details><summary>Why this matters</summary><p>Once play-level personnel and coverage labels are verified in the analytics warehouse, this panel can connect the concept to actual Titans snaps, success rate and EPA instead of generic examples.</p></details></section></section>`}

  function globalView(){
    const g=nextGame(),passport=jsonGet(PASSPORT_KEY,{city:'',country:'',note:''}),zone=(()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC'}catch{return'UTC'}})();
    const kickoff=g?.date||null;
    return `<section class="v15-pane"><header class="v15-section-head"><div><small>GLOBAL FAN DESK</small><h2>Be a Titans fan anywhere</h2><p>Kickoff translation, media routing, a local fan passport and spoiler controls without assuming everyone lives in Nashville.</p></div><a class="button" href="#media">Open Listen / Watch →</a></header><div class="v15-grid two"><section class="v15-panel"><h3>Next-game concierge</h3><div class="v15-concierge"><strong>${esc(g?`Titans ${g.homeAway==='home'?'vs':'at'} ${g.opponent}`:'Next game TBD')}</strong><span>Your device · ${esc(kickoff?zoneFmt(kickoff,zone):'TBD')}</span><span>Eastern · ${esc(kickoff?zoneFmt(kickoff,'America/New_York'):'TBD')}</span><span>Nashville · ${esc(kickoff?zoneFmt(kickoff,'America/Chicago'):'TBD')}</span><span>UTC · ${esc(kickoff?zoneFmt(kickoff,'UTC'):'TBD')}</span><em>${esc(g?.network||'Network TBD')}</em></div></section><section class="v15-panel"><h3>Fan passport</h3><label>My city<input data-v15-passport="city" value="${esc(passport.city)}" placeholder="London, Toronto, Knoxville…"></label><label>Country<input data-v15-passport="country" value="${esc(passport.country)}" placeholder="Country"></label><label>My watch-party note<textarea data-v15-passport="note" rows="3" placeholder="Favorite bar, friends, ritual…">${esc(passport.note)}</textarea></label><button class="button" type="button" data-v15-save-passport>Save on this device</button></section></div><section class="v15-panel v15-spoiler-panel"><div><small>SPOILER-FREE MODE</small><h3>Watching later?</h3><p>Mask common score elements across Command Center until you turn them back on.</p></div><button class="button" type="button" data-v15-spoiler aria-pressed="${textGet(SPOILER_KEY)==='1'}">${textGet(SPOILER_KEY)==='1'?'Reveal scores':'Hide scores'}</button></section><p class="v15-muted">Community map / nearby-fan counts are intentionally not fabricated. That feature needs an opt-in community backend and moderation before it can be trustworthy.</p></section>`
  }

  function stadiumView(){return`<section class="v15-pane"><header class="v15-section-head"><div><small>2026 → 2027</small><h2>Stadium Transition Center</h2><p>Preserve the farewell season while following the next home of Titans football.</p></div><a class="button" href="${STADIUM_SOURCES.project}" target="_blank" rel="noopener noreferrer">Official stadium project ↗</a></header><div class="v15-stadium-hero"><div><small>CURRENT STATUS</small><strong>New Nissan Stadium · targeted completion February 2027</strong><span>First Titans games are planned for fall 2027.</span></div><div><small>2026</small><strong>Farewell season</strong><span>The current Nissan Stadium remains in use during construction.</span></div></div><div class="v15-timeline"><article><b>2024</b><strong>Groundbreaking</strong><span>Construction began after the 2023 season.</span></article><article><b>2025</b><strong>Building the new home</strong><span>The project continued on the East Bank beside the current stadium.</span></article><article><b>2026</b><strong>Farewell season</strong><span>Track every final-season home game and memorable moment.</span></article><article><b>Feb 2027</b><strong>Targeted completion</strong><span>Official Titans leadership continues to cite February 2027 completion.</span></article><article><b>Fall 2027</b><strong>Titans move in</strong><span>First Titans games in the new enclosed stadium.</span></article></div><div class="v15-grid two"><section class="v15-panel"><h3>What the new building is designed to add</h3><ul class="v15-bullets"><li>Enclosed high-tech ETFE translucent roof</li><li>Exterior terraces and porches with Nashville views</li><li>Improved sight lines and multiple viewing experiences</li><li>Year-round event capability beyond Titans games</li></ul></section><section class="v15-panel"><h3>Source trail</h3><a href="${STADIUM_SOURCES.faq}" target="_blank" rel="noopener noreferrer">Official stadium FAQ ↗</a><a href="${STADIUM_SOURCES.update}" target="_blank" rel="noopener noreferrer">2026 team leadership update ↗</a><p class="v15-muted">This center should become an archive over time: final current-stadium games, construction milestones, opening events and first-game history.</p></section></div></section>`}

  function gmState(){return jsonGet(GM_KEY,{seasonWins:'',mvp:'',nextPick:null,board:{},records:[]})}
  function saveGm(value){jsonSet(GM_KEY,value)}
  function aggregateStats(name){
    const allowed=/yard|touchdown|reception|attempt|completion|carry|tackle|sack|interception|target|snap|field.?goal|extra.?point/i,out={};
    for(const row of playerStats().filter(x=>x?.name===name)){for(const [key,value] of Object.entries(row?.stats||{})){const n=Number(value);if(Number.isFinite(n)&&allowed.test(key))out[key]=(out[key]||0)+n}}
    return out;
  }
  function gmView(){
    const gm=gmState(),players=roster().slice().sort((a,b)=>playerName(a).localeCompare(playerName(b))),g=nextGame();
    if(!state.recordPlayer)state.recordPlayer=gm.records?.[0]?.player||playerName(players[0]);
    const statMap=aggregateStats(state.recordPlayer),statKeys=Object.keys(statMap).sort();
    const board=Object.entries(gm.board||{}).map(([name,status])=>`<div class="v15-board-row"><strong>${esc(name)}</strong><span>${esc(status)}</span><button type="button" data-v15-board-remove="${esc(name)}">Remove</button></div>`).join('')||'<p class="v15-muted">No camp-board calls saved yet.</p>';
    const records=safeArr(gm.records).map((r,i)=>{const current=aggregateStats(r.player)[r.stat]||0,remaining=Math.max(0,Number(r.target||0)-current),pct=r.target?Math.min(100,Math.max(0,current/Number(r.target)*100)):0;return`<article class="v15-record"><div><strong>${esc(r.player)} · ${esc(r.stat.replaceAll('_',' '))}</strong><span>${current} / ${esc(r.target)}</span></div><progress max="100" value="${pct}"></progress><small>${remaining?`${remaining} remaining`:'Target reached'} · fan-saved milestone</small><button type="button" data-v15-record-remove="${i}">Remove</button></article>`}).join('')||'<p class="v15-muted">No milestones saved yet.</p>';
    const locked=g&&Date.parse(g.date)<=Date.now();
    return `<section class="v15-pane"><header class="v15-section-head"><div><small>PREDICTIONS WITH RECEIPTS</small><h2>Fan GM</h2><p>Make calls before the outcome, save the timestamp, and keep the receipts.</p></div></header><div class="v15-grid two"><section class="v15-panel"><h3>Season prediction</h3><label>Regular-season wins<input data-v15-gm="wins" type="number" min="0" max="17" value="${esc(gm.seasonWins)}"></label><label>Season MVP<select data-v15-gm="mvp"><option value="">Choose a player</option>${players.map(p=>`<option ${gm.mvp===playerName(p)?'selected':''}>${esc(playerName(p))}</option>`).join('')}</select></label><button class="button" data-v15-save-season type="button">Save prediction</button></section><section class="v15-panel"><h3>Next game pick</h3><strong>${esc(g?`TEN ${g.homeAway==='home'?'vs':'at'} ${g.opponent}`:'Next game TBD')}</strong><label>Winner<select data-v15-gm="winner" ${locked?'disabled':''}><option value="TEN" ${gm.nextPick?.pick==='TEN'?'selected':''}>Tennessee Titans</option><option value="OPP" ${gm.nextPick?.pick==='OPP'?'selected':''}>${esc(g?.opponent||'Opponent')}</option></select></label><label>Confidence · 1–10<input data-v15-gm="confidence" type="number" min="1" max="10" value="${esc(gm.nextPick?.confidence||7)}" ${locked?'disabled':''}></label><button class="button" data-v15-save-game type="button" ${locked?'disabled':''}>${locked?'Pick locked after kickoff':'Save timestamped pick'}</button>${gm.nextPick?`<p class="v15-receipt">Saved ${esc(fmtDate(gm.nextPick.savedAt))} · ${esc(gm.nextPick.pick==='TEN'?'Titans':g?.opponent||'Opponent')} · confidence ${esc(gm.nextPick.confidence)}/10</p>`:''}</section></div><div class="v15-grid two"><section class="v15-panel"><h3>53-man bubble board</h3><div class="v15-inline-form"><select data-v15-board-player><option value="">Player</option>${players.map(p=>`<option>${esc(playerName(p))}</option>`).join('')}</select><select data-v15-board-status><option>Lock</option><option>Likely</option><option>Bubble</option><option>Long shot</option></select><button type="button" data-v15-board-add>Add</button></div>${board}</section><section class="v15-panel"><h3>Records & milestone watch</h3><p class="v15-muted">Automatic franchise-record baselines are not claimed until a verified record dataset is loaded. These targets use the game stats currently in Command Center.</p><div class="v15-inline-form"><select data-v15-record-player>${players.map(p=>`<option ${state.recordPlayer===playerName(p)?'selected':''}>${esc(playerName(p))}</option>`).join('')}</select><select data-v15-record-stat>${statKeys.length?statKeys.map(k=>`<option value="${esc(k)}">${esc(k.replaceAll('_',' '))} · ${esc(statMap[k])}</option>`).join(''):'<option value="">No counting stats loaded</option>'}</select><input data-v15-record-target type="number" min="1" placeholder="Target"><button type="button" data-v15-record-add ${statKeys.length?'':'disabled'}>Watch</button></div>${records}</section></div><div class="v15-score-placeholder"><strong>Fan GM Score</strong><span>Scoring activates as saved predictions resolve against actual results. No retroactive picks.</span></div></section>`
  }

  const ERAS=[
    {from:1960,to:1996,label:'Houston Oilers',note:'Franchise origin and Houston era.'},
    {from:1997,to:1998,label:'Tennessee Oilers',note:'Two-year Tennessee transition before the Titans identity.'},
    {from:1999,to:2025,label:'Tennessee Titans · Fireball era',note:'Titans identity from the 1999 rebrand through 2025.'},
    {from:2026,to:2026,label:'The Shield era begins',note:'New primary identity and uniforms introduced for 2026.'},
    {from:2027,to:9999,label:'New Nissan Stadium era',note:'The franchise is scheduled to begin playing in the new stadium in fall 2027.'}
  ];
  function historyView(){const currentYear=new Date().getFullYear(),since=Math.max(1960,Math.min(currentYear,Number(textGet(SINCE_KEY,'1999'))||1999)),active=ERAS.filter(e=>e.to>=since);return`<section class="v15-pane"><header class="v15-section-head"><div><small>TITANS TIME MACHINE</small><h2>Your franchise timeline</h2><p>Start with the year you became a fan, then move through the eras that shaped the team.</p></div><a class="button" href="#legacy">Open full Legacy archive →</a></header><section class="v15-panel"><label>I became a fan in<input data-v15-fan-since type="number" min="1960" max="${currentYear}" value="${since}"></label><button class="button" type="button" data-v15-save-since>Build my timeline</button><p class="v15-muted">Your timeline starts in ${since}. This setting stays on this device.</p></section><div class="v15-era-list">${active.map(e=>`<article><b>${e.to===9999?`${e.from}+`:e.from===e.to?e.from:`${e.from}–${e.to}`}</b><div><strong>${esc(e.label)}</strong><span>${esc(e.note)}</span></div></article>`).join('')}</div><div class="v15-grid two"><section class="v15-panel"><h3>Titans DNA</h3><p>Use the existing verified 2025 ↔ 2026 comparison in Fan Hub while the historical warehouse is expanded. We will not claim era-to-era statistical similarity without normalized historical data.</p><a href="#fan">Open Fan Hub history →</a></section><section class="v15-panel"><h3>Archive goal</h3><p>Future historical backfill can make any date behave like a snapshot: coach, roster, standings, leaders, schedule, logo era and major stories from that moment.</p><a href="#legacy">Explore current history →</a></section></div></section>`}

  function content(){switch(state.tab){case'press':return pressView();case'scheme':return schemeView();case'global':return globalView();case'stadium':return stadiumView();case'gm':return gmView();case'history':return historyView();default:return changesView()}}

  async function render(){
    if(route()!==ROUTE||!app)return;
    app.innerHTML='<section class="v15-loading"><strong>Loading Command Intelligence…</strong><span>Comparing Titans data and fan tools.</span></section>';
    await load();
    if(route()!==ROUTE)return;
    app.innerHTML=`<section class="v15-command"><header class="v15-hero"><div><div class="eyebrow">TITANS COMMAND INTELLIGENCE</div><h1>What changed. Why it matters. What comes next.</h1><p>A Titans-specific intelligence layer built around context instead of another wall of headlines.</p></div><div class="v15-hero-actions"><a href="#media">Listen / Watch</a><a href="#live">Game Day</a><a href="#fan">Fan Hub</a></div></header>${tabs()}${content()}</section>`;
    syncChrome();
  }

  function homeCard(){
    if(route()!=='home'||document.querySelector('.v15-home-card'))return;
    const hero=document.querySelector('.fan-hero');if(!hero)return;
    const section=document.createElement('section');section.className='v15-home-card';section.innerHTML='<div><small>COMMAND INTELLIGENCE</small><strong>What changed since your last visit?</strong><span>Changes · Press Room · Scheme · Global · Stadium · Fan GM · Time Machine</span></div><a href="#command">Open Command Intelligence →</a>';hero.insertAdjacentElement('afterend',section);
  }

  document.addEventListener('click',event=>{
    if(!(event.target instanceof Element))return;
    const commandLink=event.target.closest('a[href="#command"]');
    if(commandLink){event.preventDefault();event.stopImmediatePropagation();history.pushState(null,'','#command');render();return}
    const tab=event.target.closest('[data-v15-tab]');if(tab){state.tab=tab.dataset.v15Tab;textSet(TAB_KEY,state.tab);render();return}
    const scheme=event.target.closest('[data-v15-scheme]');if(scheme){state.scheme=scheme.dataset.v15Scheme;render();return}
    if(event.target.closest('[data-v15-analyze]')){const text=document.querySelector('[data-v15-transcript]')?.value||'';analyzeTranscript(text);render();return}
    if(event.target.closest('[data-v15-save-passport]')){const value={};document.querySelectorAll('[data-v15-passport]').forEach(el=>value[el.dataset.v15Passport]=el.value);jsonSet(PASSPORT_KEY,value);render();return}
    if(event.target.closest('[data-v15-spoiler]')){textSet(SPOILER_KEY,textGet(SPOILER_KEY)==='1'?'0':'1');applySpoilerMode();render();return}
    if(event.target.closest('[data-v15-save-season]')){const gm=gmState();gm.seasonWins=document.querySelector('[data-v15-gm="wins"]')?.value||'';gm.mvp=document.querySelector('[data-v15-gm="mvp"]')?.value||'';gm.seasonSavedAt=new Date().toISOString();saveGm(gm);render();return}
    if(event.target.closest('[data-v15-save-game]')){const g=nextGame();if(!g||Date.parse(g.date)<=Date.now())return;const gm=gmState();gm.nextPick={gameId:g.id||g.week,pick:document.querySelector('[data-v15-gm="winner"]')?.value||'TEN',confidence:Number(document.querySelector('[data-v15-gm="confidence"]')?.value||7),savedAt:new Date().toISOString()};saveGm(gm);render();return}
    if(event.target.closest('[data-v15-board-add]')){const name=document.querySelector('[data-v15-board-player]')?.value,status=document.querySelector('[data-v15-board-status]')?.value;if(name){const gm=gmState();gm.board={...(gm.board||{}),[name]:status};saveGm(gm);render()}return}
    const removeBoard=event.target.closest('[data-v15-board-remove]');if(removeBoard){const gm=gmState();delete gm.board?.[removeBoard.dataset.v15BoardRemove];saveGm(gm);render();return}
    if(event.target.closest('[data-v15-record-add]')){const player=document.querySelector('[data-v15-record-player]')?.value,stat=document.querySelector('[data-v15-record-stat]')?.value,target=Number(document.querySelector('[data-v15-record-target]')?.value);if(player&&stat&&target>0){const gm=gmState();gm.records=[...safeArr(gm.records),{player,stat,target,createdAt:new Date().toISOString()}].slice(-12);saveGm(gm);render()}return}
    const removeRecord=event.target.closest('[data-v15-record-remove]');if(removeRecord){const gm=gmState();gm.records=safeArr(gm.records).filter((_,i)=>i!==Number(removeRecord.dataset.v15RecordRemove));saveGm(gm);render();return}
    if(event.target.closest('[data-v15-save-since]')){const year=document.querySelector('[data-v15-fan-since]')?.value;textSet(SINCE_KEY,year);render();return}
  },true);

  document.addEventListener('change',event=>{
    if(!(event.target instanceof Element)||route()!==ROUTE)return;
    if(event.target.matches('[data-v15-player]')){state.selectedPlayer=event.target.value;render()}
    if(event.target.matches('[data-v15-record-player]')){state.recordPlayer=event.target.value;render()}
  });

  window.addEventListener('hashchange',()=>setTimeout(()=>{if(route()===ROUTE)render();else homeCard()},0));
  window.addEventListener('popstate',()=>setTimeout(()=>{if(route()===ROUTE)render();else homeCard()},0));
  if(app)new MutationObserver(()=>{if(route()==='home')queueMicrotask(homeCard)}).observe(app,{childList:true,subtree:false});
  setTimeout(()=>{if(route()===ROUTE)render();else homeCard()},100);
})();
