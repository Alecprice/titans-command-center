import {scheduleFocus} from './src/core.mjs';

(() => {
  'use strict';

  const app=document.querySelector('#app');
  const toast=document.querySelector('#toast');
  const runtime=window.TitansRuntime;
  const KEY={mode:'titans:v13Mode',tab:'titans:v13Tab',predictions:'titans:v13Predictions',draft:'titans:v13DraftBoard',visit:'titans:v13VisitSnapshot'};
  const TABS=[['today','Today'],['game','Game'],['team','Team'],['season','Season'],['offseason','Offseason'],['history','History']];
  const state={base:null,intel:null,loading:null,hubRendering:false,tab:localStorage.getItem(KEY.tab)||'today',mode:localStorage.getItem(KEY.mode)||'simple'};

  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const parse=(value,fallback)=>{try{return JSON.parse(value)??fallback}catch{return fallback}};
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const fmtDate=value=>{if(value==null||String(value).trim()==='')return'TBD';const d=new Date(value);return Number.isNaN(d.getTime())?'TBD':new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(d)};
  const say=message=>{if(!toast)return;toast.textContent=message;toast.classList.add('show');clearTimeout(say.timer);say.timer=setTimeout(()=>toast.classList.remove('show'),2200)};
  const safeNum=value=>Number.isFinite(Number(value))?Number(value):null;
  const money=value=>{const n=safeNum(value);if(n==null)return'Not loaded';return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',notation:'compact',maximumFractionDigits:1}).format(n)};

  async function load(){
    if(state.base&&state.intel)return state;
    if(state.loading)return state.loading;
    const request=runtime?[
      runtime.apiJson('/api/data',{ttl:30000}),
      runtime.apiJson('/api/fan-intel',{ttl:30000})
    ]:[
      fetch('/api/data',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null),
      fetch('/api/fan-intel',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)
    ];
    state.loading=Promise.all(request).then(([base,intel])=>{state.base=base?.ok?base:null;state.intel=intel?.ok?intel:null;return state}).finally(()=>state.loading=null);
    return state.loading;
  }

  function gameFocus(){return scheduleFocus(state.base?.games||[])}
  function upcomingGame(){return gameFocus().next||null}
  function nextHomeGame(now=Date.now()){return (state.base?.games||[]).map((game,index)=>({game,index,kickoff:Date.parse(game?.date)})).filter(row=>row.game?.homeAway==='home'&&Number.isFinite(row.kickoff)&&row.kickoff>now).sort((a,b)=>a.kickoff-b.kickoff||a.index-b.index)[0]?.game||null}
  function latestFinal(){return [...(state.base?.games||[])].reverse().find(g=>/final/i.test(String(g.status||'')))||null}
  function favoriteIds(){return new Set(parse(localStorage.getItem('titans:favoritePlayers'),[]).map(String))}
  function favoritePlayers(){const ids=favoriteIds();return (state.base?.roster||[]).filter(p=>ids.has(String(p.id)))}
  function latestMove(){return state.base?.transactions?.[0]||null}
  function finalGames(){return (state.base?.games||[]).filter(g=>/final/i.test(String(g.status||'')))}
  function currentMarket(game=gameFocus().game){return (state.base?.markets?.rows||[]).filter(r=>!game||!r.gameId||String(r.gameId)===String(game.id)).slice(0,4)}

  function card(title,body,actions='',className=''){
    return `<article class="v13-card ${className}"><h3>${esc(title)}</h3>${body}${actions?`<div class="v13-actions">${actions}</div>`:''}</article>`;
  }
  function empty(title,copy){return `<div class="v13-empty"><strong>${esc(title)}</strong><p>${esc(copy)}</p></div>`}
  function details(label,body){return `<details class="v13-advanced" ${state.mode==='deep'?'open':''}><summary>${esc(label)}</summary>${body}</details>`}
  function pill(text,kind=''){return `<span class="v13-pill ${kind}">${esc(text)}</span>`}
  function section(title,copy,body){return `<section class="v13-section"><header><h2>${esc(title)}</h2>${copy?`<p>${esc(copy)}</p>`:''}</header>${body}</section>`}

  function topicPulse(){
    const counts=new Map();
    for(const item of state.base?.feed||[])for(const topic of item.topics||[]){const key=String(topic).trim();if(key)counts.set(key,(counts.get(key)||0)+1)}
    const rows=[...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5);
    if(!rows.length)return empty('Conversation pulse is warming up','Topics appear as new reports and stories are indexed.');
    return `<div class="v13-topic-list">${rows.map(([name,count])=>`<div><strong>${esc(name)}</strong><span>${count} recent mention${count===1?'':'s'}</span></div>`).join('')}</div>`;
  }

  function changeSummary(){
    const snapshot=parse(localStorage.getItem(KEY.visit),null),now={transactions:state.base?.transactions?.[0]?.id||null,feed:state.base?.feed?.[0]?.id||null,depth:state.intel?.depthChart?.capturedAt||null,injury:state.intel?.injuries?.[0]?.capturedAt||null,market:state.base?.markets?.rows?.[0]?.capturedAt||null};
    const changes=[];
    if(snapshot){
      if(snapshot.transactions!==now.transactions)changes.push('Roster move');
      if(snapshot.feed!==now.feed)changes.push('New team intel');
      if(snapshot.depth!==now.depth)changes.push('Depth chart update');
      if(snapshot.injury!==now.injury)changes.push('Injury report update');
      if(snapshot.market!==now.market)changes.push('Market update');
    }
    localStorage.setItem(KEY.visit,JSON.stringify(now));
    return changes.length?changes:['No major tracked changes since your last Fan Hub visit'];
  }

  function askAnswer(query){
    const q=String(query||'').toLowerCase(),ng=upcomingGame(),standings=state.intel?.standings||[],ten=standings.find(r=>r.abbreviation==='TEN');
    if(/next game|who.*play|opponent/.test(q))return ng?`Tennessee's next loaded game is ${ng.homeAway==='home'?'vs.':'at'} ${ng.opponent} on ${fmtDate(ng.date)}.`:'The next game is not available in the loaded schedule yet.';
    if(/stand|record|afc south|division/.test(q))return ten?`Tennessee is ${ten.record}. ${ten.divisionRank?`That is division rank ${ten.divisionRank}.`:''}`:'Regular-season standings are not loaded yet.';
    if(/injur|practice/.test(q)){const rows=state.intel?.injuries||[];return rows.length?`${rows.length} current injury-report row${rows.length===1?' is':'s are'} loaded. Open Team → Injuries for the official statuses.`:'No current weekly injury-report rows are loaded. Reserve/Injured roster status is tracked separately.'}
    if(/transaction|roster move|signed|waived|released/.test(q)){const move=latestMove();return move?`Latest roster move: ${move.description}`:'No roster transaction is loaded right now.'}
    if(/depth/.test(q)){const changes=state.intel?.depthChart?.changes||[];return changes.length?`${changes.length} depth-chart change${changes.length===1?' is':'s are'} detected between the two latest snapshots.`:'No depth-chart movement is detected between the latest two loaded snapshots.'}
    if(/favorite|my player/.test(q)){const fav=favoritePlayers();return fav.length?`Your favorite player${fav.length>1?'s are':' is'} ${fav.map(p=>p.name).join(', ')}.`:'You have not picked a favorite player yet. Open Roster and tap Favorite on a player.'}
    return 'Try asking: “Who is next?”, “What changed?”, “Any injuries?”, “AFC South standings”, or “Latest roster move”.';
  }

  function askBox(){return `<div class="v13-ask"><label for="v13-ask-input">Ask Titans Command Center</label><div><input id="v13-ask-input" type="search" placeholder="Example: Any injuries?" autocomplete="off"><button class="button primary" type="button" data-v13-ask>Ask</button></div><div class="v13-quick-asks"><button data-q="Who is next?">Who is next?</button><button data-q="Any injuries?">Any injuries?</button><button data-q="AFC South standings">Standings</button><button data-q="Latest roster move">Latest move</button></div><div id="v13-answer" class="v13-answer" aria-live="polite">Answers use the verified data already loaded by this site.</div></div>`}

  function todayView(){
    const focus=gameFocus(),ng=focus.game,current=focus.state==='game-window',fav=favoritePlayers(),changes=changeSummary(),move=latestMove(),market=currentMarket(ng)[0];
    const next=ng?`<div class="v13-big"><strong>${ng.homeAway==='home'?'VS':'AT'} ${esc(ng.opponent)}</strong><span>${esc(fmtDate(ng.date))}</span><span>${esc(ng.network||'TV TBD')} · ${esc(ng.venue||'Venue TBD')}</span></div>`:empty('Next game TBD','The schedule will fill this card automatically.');
    const favorite=fav.length?`<div class="v13-favorites">${fav.slice(0,3).map(p=>`<a href="#player?id=${encodeURIComponent(p.id)}"><strong>#${esc(p.number||'—')} ${esc(p.name)}</strong><span>${esc(p.position)} · ${esc(p.status||'Active')}</span></a>`).join('')}</div>`:empty('Pick a favorite player','Open the roster and favorite a player. Their updates will show here.');
    const changeBody=`<ul class="v13-clean-list">${changes.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
    const moveBody=move?`<p>${esc(move.description)}</p><small>${esc(move.date?fmtDate(move.date):'')}</small>`:empty('No move loaded','Transactions will appear as they are indexed.');
    const marketBody=market?`<p>${esc(market.entityName||market.marketName||(current?'Current-game market':'Next-game market'))} ${market.line??''}</p><small>Optional information · can be hidden in Settings</small>`:empty('Market pulse waiting','No current cached market row is available.');
    return section('Today','The important stuff first. No hunting around.',`<div class="v13-grid">${card(current?'Current matchup':'Next game',next,'<a class="button" href="#live">Game Day</a>','v13-feature')}${card('What changed?',changeBody,'<a class="button" href="#transactions">Roster moves</a>')}${card('Your players',favorite,'<a class="button" href="#roster">Roster</a>')}${card('Latest move',moveBody)}${card('Fan pulse',topicPulse())}${card('Market pulse',marketBody,'<a class="button" href="#markets">Markets</a>','v13-optional-market')}</div>${section('Ask Titans','Plain-English answers from the site data.',askBox())}`);
  }

  function opponentScout(){
    const o=state.intel?.opponent;
    if(!o)return empty('Opponent scout waiting','The next opponent is known, but enough opponent game data is not loaded yet.');
    const finals=(o.recent||[]).filter(g=>g.result),wins=finals.filter(g=>g.result==='W').length,losses=finals.filter(g=>g.result==='L').length;
    const form=finals.length?`${wins}-${losses} in ${finals.length} loaded final${finals.length===1?'':'s'}`:'No loaded final games yet';
    return `<div class="v13-scout"><div class="v13-big"><strong>${esc(o.abbreviation)} · ${esc(o.name)}</strong><span>${esc(o.division||o.conference||'Next opponent')}</span><span>${esc(form)}</span></div>${details('Recent game detail',`<div class="v13-mini-table">${(o.recent||[]).slice(0,6).map(g=>`<div><span>${esc(String(g.week??'—'))}</span><strong>${esc(g.result||g.status||'Scheduled')}</strong><small>${esc(g.away)} at ${esc(g.home)}${g.score?` · ${esc(g.score)}`:''}</small></div>`).join('')}</div>`)}</div>`;
  }

  function gameTimeline(){
    const plays=state.intel?.gameDay?.plays||[],drives=state.intel?.gameDay?.drives||[];
    if(!plays.length&&!drives.length)return empty('Game timeline waiting','Drive and play detail appears when play-by-play is available.');
    const latest=plays[0],wp=latest?.winProbability==null?null:Math.round(Number(latest.winProbability)*100);
    return `<div class="v13-game-summary">${wp==null?'':`<div class="v13-wp"><span>Latest win probability</span><strong>${wp}%</strong><progress max="100" value="${Math.max(0,Math.min(100,wp))}"></progress></div>`}<div class="v13-drive-list">${drives.slice(0,8).map(d=>`<div><strong>Drive ${d.drive}</strong><span>${esc(d.team||'')} · ${d.plays??'—'} plays · ${d.yards??'—'} yards</span><b>${esc(d.result||'End')}</b></div>`).join('')}</div>${details('Latest plays',`<div class="v13-play-list">${plays.slice(0,12).map(p=>`<div><small>Q${p.quarter??'—'} ${esc(p.clock||'')}</small><p>${esc(p.description||'Play')}</p>${p.winProbabilityAdded==null?'':`<span>Momentum ${p.winProbabilityAdded>=0?'+':''}${(p.winProbabilityAdded*100).toFixed(1)}%</span>`}</div>`).join('')}</div>`)}</div>`;
  }

  function predictionCard(){
    const ng=upcomingGame();if(!ng)return empty('Prediction opens when a game is scheduled','Your prediction stays on this device.');
    const all=parse(localStorage.getItem(KEY.predictions),{}),saved=all[ng.id]||{};
    return `<div class="v13-predict"><p>What do you think happens?</p><div class="v13-score-pick"><label>TEN <input type="number" min="0" max="99" inputmode="numeric" data-pred-ten value="${esc(saved.ten??'')}"></label><label>${esc(ng.opponentAbbr||'OPP')} <input type="number" min="0" max="99" inputmode="numeric" data-pred-opp value="${esc(saved.opp??'')}"></label></div><label>Confidence <input type="range" min="1" max="10" value="${esc(saved.confidence??5)}" data-pred-confidence><span data-confidence-label>${esc(saved.confidence??5)}/10</span></label><button class="button primary" type="button" data-save-prediction data-game-id="${esc(ng.id)}">Save my prediction</button><small>Private to this device.</small></div>`;
  }

  function simulator(){
    return `<div class="v13-sim"><p>Move the football levers. This is a scenario toy, not a prediction model.</p>${[['turnovers','Turnover edge',0,-3,3],['explosive','Explosive plays',0,-3,3],['redzone','Red-zone edge',0,-3,3],['pressure','Pressure/sack edge',0,-3,3]].map(([key,label,value,min,max])=>`<label>${label}<input type="range" min="${min}" max="${max}" value="${value}" data-sim="${key}"><span data-sim-label="${key}">Even</span></label>`).join('')}<div class="v13-sim-result" data-sim-result>Scenario: toss-up</div></div>`;
  }

  function attending(){
    const g=nextHomeGame();
    if(!g)return empty('No upcoming home game loaded','This mode will activate for the next home game.');
    const weather=(state.base?.weather?.rows||[]).find(w=>String(w.gameId)===String(g.id));
    return `<div class="v13-attend"><div class="v13-big"><strong>${esc(g.opponent)} at Tennessee</strong><span>${esc(fmtDate(g.date))}</span><span>${esc(g.venue||'Venue TBD')}</span></div><ul class="v13-clean-list"><li>Check your mobile tickets before leaving</li><li>Review official stadium bag and entry rules</li><li>${weather?`Forecast: ${esc(weather.condition||'')} ${weather.temperatureF==null?'':Math.round(weather.temperatureF)+'°F'}`:'Forecast will appear when available'}</li></ul><a class="button" href="https://www.tennesseetitans.com/" target="_blank" rel="noopener noreferrer">Official game-day info ↗</a></div>`;
  }

  function gameView(){return section('Game','Everything around kickoff in one place.',`<div class="v13-grid">${card('Opponent scout',opponentScout(),'','v13-feature')}${card('Game timeline',gameTimeline(),'','v13-wide')}${card('Your prediction',predictionCard())}${card('Matchup simulator',simulator())}${card("I'm going",attending())}</div>`)}

  function injuriesView(){
    const rows=state.intel?.injuries||[];
    if(!rows.length)return empty('No weekly injury report loaded','That does not mean zero injuries. Official weekly reports are separate from Reserve/Injured roster status.');
    return `<div class="v13-list">${rows.map(r=>`<div class="v13-row"><div><strong>#${esc(r.number||'—')} ${esc(r.name)}</strong><span>${esc(r.position||'')}</span></div><div>${pill(r.practiceStatus||'Practice TBD')}${pill(r.reportStatus||'Game status TBD')}</div><small>${esc(r.primaryInjury||'Injury not specified')} · ${esc(r.reportDate||'Date TBD')}</small></div>`).join('')}</div>`;
  }

  function depthView(){const rows=state.intel?.depthChart?.changes||[];if(!rows.length)return empty('No depth movement detected','The two latest official depth-chart snapshots match, or only one snapshot is loaded.');return `<div class="v13-list">${rows.map(r=>`<div class="v13-row"><div><strong>${esc(r.name)}</strong><span>${esc(r.position||r.unit||'')}</span></div><div>${pill(r.type==='up'?'Moved up':r.type==='down'?'Moved down':r.type==='added'?'Added':'Changed',r.type)}</div><small>${r.from==null?'New listing':`Rank ${r.from}`} → ${r.to==null?'—':`Rank ${r.to}`}</small></div>`).join('')}</div>`}

  function statValue(stats,aliases){for(const key of aliases)if(stats&&stats[key]!=null&&Number.isFinite(Number(stats[key])))return Number(stats[key]);return null}
  function playerTrends(){
    const favoritesSet=favoriteIds(),rows=(state.intel?.playerStats||[]).filter(r=>favoritesSet.has(String(r.playerId)));
    if(!rows.length)return empty('Favorite-player trends waiting','Favorite a player and their loaded game stats will appear here.');
    const byPlayer=new Map();
    for(const row of rows){const key=`${row.playerId}:${row.week}:${row.statGroup}`;if(byPlayer.has(key))continue;byPlayer.set(key,row)}
    const grouped=new Map();for(const row of byPlayer.values()){if(!grouped.has(row.playerId))grouped.set(row.playerId,[]);grouped.get(row.playerId).push(row)}
    return [...grouped.values()].slice(0,3).map(list=>{const p=list[0],values=list.slice(0,5).map(r=>statValue(r.stats,['passing_yards','pass_yds','rushing_yards','rush_yds','receiving_yards','rec_yds','total_tackles','tackles','sacks'])).filter(v=>v!=null);const max=Math.max(...values,1);return `<div class="v13-trend"><strong>${esc(p.name)}</strong><span>${esc(p.position)}</span>${values.length?`<div class="v13-bars">${values.map((v,i)=>`<i style="--h:${Math.max(8,Math.round(v/max*100))}%" title="${v}"><b>${v}</b><small>${list[i]?.week??''}</small></i>`).join('')}</div>`:'<p>Loaded stats do not yet include a simple trend metric for this position.</p>'}</div>`}).join('');
  }

  function teamView(){return section('Team','Roster health and movement, explained simply.',`<div class="v13-grid">${card('Injuries',injuriesView(),'','v13-wide')}${card('Depth chart changes',depthView())}${card('Your player trends',playerTrends())}${card('Roster movement',latestMove()?`<p>${esc(latestMove().description)}</p>`:empty('No move loaded','Latest transactions appear here.'),'<a class="button" href="#transactions">All moves</a>')}</div>`)}

  function standingsView(){
    const rows=state.intel?.standings||[];
    if(!rows.length)return empty('Standings start with the regular season','The AFC South table will turn on automatically when standings snapshots are available.');
    const south=rows.filter(r=>r.division==='AFC South');const use=south.length?south:rows.filter(r=>r.conference==='AFC').slice(0,8);
    return `<div class="v13-standings">${use.map((r,i)=>`<div class="${r.abbreviation==='TEN'?'ten':''}"><b>${i+1}</b><strong>${esc(r.abbreviation)} <span>${esc(r.team)}</span></strong><em>${esc(r.record)}</em>${state.mode==='deep'?`<small>PF ${r.pointsFor??'—'} · PA ${r.pointsAgainst??'—'} · AFC #${r.conferenceRank??'—'}</small>`:''}</div>`).join('')}</div>`;
  }

  function playoffView(){
    const rows=state.intel?.standings||[],ten=rows.find(r=>r.abbreviation==='TEN');
    if(!ten)return empty('Playoff picture is not active yet','Once regular-season standings are loaded, this will explain the division and wild-card picture in plain English.');
    const copy=ten.divisionRank===1?'Tennessee currently leads the AFC South.':ten.divisionRank?`Tennessee is currently ${ten.divisionRank}${ten.divisionRank===2?'nd':ten.divisionRank===3?'rd':'th'} in the AFC South.`:'Tennessee standings are loaded.';
    return `<p class="v13-callout">${esc(copy)}</p>${details('Tiebreaker / conference detail',`<p>Conference rank: ${esc(ten.conferenceRank??'Not loaded')}. Exact clinching scenarios will only be shown when the underlying standings and tiebreaker inputs are available.</p>`)}`;
  }

  function seasonStory(){
    const games=state.base?.games||[],moves=state.base?.transactions||[];const items=[];
    for(const g of games)items.push({at:g.date,title:`${String(g.week).startsWith('P')?'Preseason '+String(g.week).slice(1):'Week '+g.week}: ${g.homeAway==='home'?'vs':'at'} ${g.opponent}`,detail:/final/i.test(String(g.status||''))?`Final ${g.score}-${g.opponentScore}`:fmtDate(g.date)});
    for(const m of moves.slice(0,12))items.push({at:m.date,title:'Roster move',detail:m.description});
    items.sort((a,b)=>Date.parse(a.at||0)-Date.parse(b.at||0));
    return `<div class="v13-story">${items.slice(-18).map(x=>`<div><time>${esc(x.at?fmtDate(x.at):'')}</time><strong>${esc(x.title)}</strong><p>${esc(x.detail)}</p></div>`).join('')}</div>`;
  }

  function recordsWatch(){
    const rows=state.intel?.playerStats||[];if(!rows.length)return empty('Records watch is waiting for 2026 stats','Milestones appear after current-season player stats are loaded.');
    const totals=new Map();
    for(const row of rows){const s=row.stats||{},metrics=[['Passing yards',statValue(s,['passing_yards','pass_yds']),1000],['Rushing yards',statValue(s,['rushing_yards','rush_yds']),500],['Receiving yards',statValue(s,['receiving_yards','rec_yds']),500],['Tackles',statValue(s,['total_tackles','tackles']),50],['Sacks',statValue(s,['sacks']),5]];for(const [label,value,step] of metrics){if(value==null)continue;const key=`${row.playerId}:${label}`;const old=totals.get(key)||{name:row.name,label,total:0,step};old.total+=value;totals.set(key,old)}}
    const watches=[...totals.values()].map(x=>({...x,next:Math.ceil((x.total+0.001)/x.step)*x.step})).sort((a,b)=>(a.next-a.total)-(b.next-b.total)).slice(0,5);
    return watches.length?`<div class="v13-list">${watches.map(x=>`<div class="v13-row"><div><strong>${esc(x.name)}</strong><span>${esc(x.label)}</span></div><b>${Math.round(x.total)}</b><small>${Math.max(0,Math.round(x.next-x.total))} to ${x.next}</small></div>`).join('')}</div>`:empty('No simple milestones found','The loaded stat fields do not match the supported milestone categories yet.');
  }

  function seasonView(){return section('Season','Where Tennessee stands and how the year is unfolding.',`<div class="v13-grid">${card('AFC South',standingsView(),'','v13-wide')}${card('Playoff picture',playoffView())}${card('Records watch',recordsWatch())}${card('Season story',seasonStory(),'','v13-wide')}</div>`)}

  function teamNeeds(){
    const counts=new Map();for(const p of state.base?.roster||[]){const pos=String(p.position||'Other').toUpperCase();counts.set(pos,(counts.get(pos)||0)+1)}
    const priority=[['OL',['T','G','C','OT','OG']],['WR',['WR']],['CB',['CB']],['EDGE',['OLB','DE','EDGE']],['DL',['DT','NT','DL']],['LB',['LB','ILB']],['S',['S','FS','SS']],['TE',['TE']],['RB',['RB']],['QB',['QB']]];
    const rows=priority.map(([group,keys])=>({group,count:keys.reduce((n,k)=>n+(counts.get(k)||0),0)})).sort((a,b)=>a.count-b.count).slice(0,5);
    return `<div class="v13-needs">${rows.map(r=>`<div><strong>${esc(r.group)}</strong><span>${r.count} rostered</span><small>Depth signal only — not a scouting grade</small></div>`).join('')}</div>`;
  }

  function draftBoard(){
    const rows=parse(localStorage.getItem(KEY.draft),[]);
    return `<div class="v13-draft"><form data-draft-form><input name="name" placeholder="Prospect name" required><input name="position" placeholder="Pos." maxlength="8"><button class="button" type="submit">Add</button></form><div data-draft-list>${rows.length?rows.map((r,i)=>`<div><b>${i+1}</b><strong>${esc(r.name)}</strong><span>${esc(r.position||'')}</span><button type="button" data-remove-draft="${i}" aria-label="Remove ${esc(r.name)}">×</button></div>`).join(''):empty('Your draft board is empty','Add prospects you want Tennessee to watch. It stays on this device.')}</div></div>`;
  }

  function contractView(){const rows=state.intel?.contracts||[];if(!rows.length)return empty('Contract feed not populated yet','The center is ready for contract data when a verified source is loaded.');return `<div class="v13-list">${rows.slice(0,14).map(r=>`<div class="v13-row"><div><strong>${esc(r.name)}</strong><span>${esc(r.position)}</span></div><b>${money(r.apy)} / yr</b>${state.mode==='deep'?`<small>${r.years??'—'} yrs · ${money(r.totalValue)} total · ${money(r.guaranteed)} guaranteed</small>`:''}</div>`).join('')}</div>`}

  function offseasonView(){return section('Offseason','Useful even when there is no game this week.',`<div class="v13-grid">${card('Team-need signals',teamNeeds(),'','v13-feature')}${card('My draft board',draftBoard(),'','v13-wide')}${card('Contracts & free agency',contractView(),'','v13-wide')}${card('Training camp checklist','<ul class="v13-clean-list"><li>Roster battles</li><li>Depth-chart movement</li><li>Injury/report changes</li><li>Preseason usage</li><li>Transactions</li></ul>','<a class="button" href="#roster">Open roster</a>')}</div>`)}

  const ERAS=[
    {key:'oilers',years:'1960–1996',name:'Houston Oilers',copy:'The franchise begins in Houston. Open Legacy for the source-audited franchise history.'},
    {key:'tennessee-oilers',years:'1997–1998',name:'Tennessee Oilers',copy:'The franchise moves to Tennessee before adopting the Titans name.'},
    {key:'fireball',years:'1999–2025',name:'Tennessee Titans',copy:'The fireball-T era covers the franchise’s first Titans identity through 2025.'},
    {key:'shield',years:'2026–present',name:'The Shield era',copy:'The current visual identity begins in 2026.'}
  ];
  function timeMachine(){return `<div class="v13-eras">${ERAS.map(e=>`<button type="button" data-era="${e.key}"><small>${esc(e.years)}</small><strong>${esc(e.name)}</strong><span>${esc(e.copy)}</span></button>`).join('')}</div><div class="v13-era-detail" data-era-detail>Select an era to explore.</div>`}
  function historyView(){return section('History','A simple way to explore the franchise without losing the present-day site.',`<div class="v13-grid">${card('Titans Time Machine',timeMachine(),'','v13-wide v13-feature')}${card('Legacy museum','<p>Logos, identity changes, franchise milestones, and source notes already live in the Legacy section.</p>','<a class="button primary" href="#legacy">Open Legacy</a>')}${card('Compare eras','<p>Use Stats Lab for current performance. Historical season-vs-season comparison will expand as verified archive data is backfilled.</p>','<a class="button" href="#stats">Stats Lab</a>')}</div>`)}

  function shell(){
    return `<section class="v13-hero"><div><div class="eyebrow">Fan Hub</div><h1>Everything Titans.<br><em>Easy to use.</em></h1><p>Start simple. Open more detail only when you want it.</p></div><button type="button" class="v13-mode" data-mode-toggle>${state.mode==='simple'?'Simple view':'More detail'}</button></section><nav class="v13-tabs" aria-label="Fan Hub sections">${TABS.map(([key,label])=>`<button type="button" data-tab="${key}" class="${state.tab===key?'active':''}">${label}</button>`).join('')}</nav><div id="v13-view"></div>`;
  }

  function renderView(){
    const view=document.querySelector('#v13-view');if(!view)return;
    const map={today:todayView,game:gameView,team:teamView,season:seasonView,offseason:offseasonView,history:historyView};
    view.innerHTML=(map[state.tab]||todayView)();bindView();
  }

  function bindView(){
    document.querySelector('[data-v13-ask]')?.addEventListener('click',()=>{const input=document.querySelector('#v13-ask-input'),answer=document.querySelector('#v13-answer');if(answer)answer.textContent=askAnswer(input?.value)});
    document.querySelectorAll('[data-q]').forEach(button=>button.addEventListener('click',()=>{const input=document.querySelector('#v13-ask-input'),answer=document.querySelector('#v13-answer');if(input)input.value=button.dataset.q||'';if(answer)answer.textContent=askAnswer(button.dataset.q)}));
    document.querySelector('[data-pred-confidence]')?.addEventListener('input',event=>{const out=document.querySelector('[data-confidence-label]');if(out)out.textContent=`${event.target.value}/10`});
    document.querySelector('[data-save-prediction]')?.addEventListener('click',event=>{const id=event.currentTarget.dataset.gameId,all=parse(localStorage.getItem(KEY.predictions),{});all[id]={ten:document.querySelector('[data-pred-ten]')?.value||'',opp:document.querySelector('[data-pred-opp]')?.value||'',confidence:document.querySelector('[data-pred-confidence]')?.value||5,savedAt:Date.now()};localStorage.setItem(KEY.predictions,JSON.stringify(all));say('Prediction saved on this device.')});
    document.querySelectorAll('[data-sim]').forEach(input=>input.addEventListener('input',updateSimulator));updateSimulator();
    document.querySelector('[data-draft-form]')?.addEventListener('submit',event=>{event.preventDefault();const form=new FormData(event.currentTarget),rows=parse(localStorage.getItem(KEY.draft),[]);rows.push({name:String(form.get('name')||'').trim(),position:String(form.get('position')||'').trim().toUpperCase()});localStorage.setItem(KEY.draft,JSON.stringify(rows.slice(0,50)));renderView();say('Prospect added to your draft board.')});
    document.querySelectorAll('[data-remove-draft]').forEach(button=>button.addEventListener('click',()=>{const rows=parse(localStorage.getItem(KEY.draft),[]);rows.splice(Number(button.dataset.removeDraft),1);localStorage.setItem(KEY.draft,JSON.stringify(rows));renderView()}));
    document.querySelectorAll('[data-era]').forEach(button=>button.addEventListener('click',()=>{const era=ERAS.find(e=>e.key===button.dataset.era),out=document.querySelector('[data-era-detail]');if(out&&era)out.innerHTML=`<strong>${esc(era.name)} · ${esc(era.years)}</strong><p>${esc(era.copy)}</p><a class="button" href="#legacy">Open source-audited Legacy</a>`}));
  }

  function updateSimulator(){
    const inputs=[...document.querySelectorAll('[data-sim]')];if(!inputs.length)return;let total=0;for(const input of inputs){const value=Number(input.value||0);total+=value;const label=document.querySelector(`[data-sim-label="${input.dataset.sim}"]`);if(label)label.textContent=value===0?'Even':value>0?`TEN +${value}`:`TEN ${value}`}
    const out=document.querySelector('[data-sim-result]');if(out)out.textContent=total>=5?'Scenario: strong Tennessee edge':total>=2?'Scenario: Tennessee edge':total<=-5?'Scenario: strong opponent edge':total<=-2?'Scenario: opponent edge':'Scenario: toss-up';
  }

  async function renderHub(){
    if(route()!=='fan'||!app||state.hubRendering||app.querySelector('.v13-hero'))return;
    state.hubRendering=true;
    app.innerHTML='<div class="v13-loading"><strong>Loading Fan Hub…</strong><span>Pulling the latest Titans data.</span></div>';
    await load();
    if(route()!=='fan'){state.hubRendering=false;return;}
    app.innerHTML=shell();
    document.body.classList.toggle('v13-deep',state.mode==='deep');
    document.querySelectorAll('[data-tab]').forEach(button=>button.addEventListener('click',()=>{state.tab=button.dataset.tab;localStorage.setItem(KEY.tab,state.tab);document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===button));renderView();window.scrollTo({top:0,behavior:state.mode==='simple'?'auto':'smooth'})}));
    document.querySelector('[data-mode-toggle]')?.addEventListener('click',event=>{state.mode=state.mode==='simple'?'deep':'simple';localStorage.setItem(KEY.mode,state.mode);document.body.classList.toggle('v13-deep',state.mode==='deep');event.currentTarget.textContent=state.mode==='simple'?'Simple view':'More detail';renderView();say(state.mode==='simple'?'Simple view on.':'More detail on.')});
    renderView();
    state.hubRendering=false;
  }

  function injectHomeEntry(){
    if(route()!=='home'||document.querySelector('.v13-home-entry')||!app)return;
    const hero=app.querySelector('.fan-hero');if(!hero)return;
    const entry=document.createElement('section');entry.className='v13-home-entry';entry.innerHTML='<div><small>NEW FAN HUB</small><strong>One place for today, game day, injuries, standings, draft and history.</strong><span>Built to be easy on a phone.</span></div><a class="button primary" href="#fan">Open Fan Hub</a>';hero.insertAdjacentElement('afterend',entry);
  }

  function injectNavigation(){
    const nav=document.querySelector('#primary-nav');if(nav&&!nav.querySelector('[data-route="fan"]')){const a=document.createElement('a');a.href='#fan';a.dataset.route='fan';a.innerHTML='<b>11</b><span>Fan Hub</span>';nav.appendChild(a)}
  }

  const observer=new MutationObserver(()=>{if(route()==='fan')renderHub();else injectHomeEntry()});
  if(app)observer.observe(app,{childList:true});
  window.addEventListener('hashchange',()=>{if(route()==='fan')setTimeout(renderHub,0);else setTimeout(injectHomeEntry,0)});
  injectNavigation();
  if(route()==='fan')renderHub();else setTimeout(injectHomeEntry,0);
})();
