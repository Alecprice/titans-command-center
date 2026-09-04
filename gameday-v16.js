(() => {
  'use strict';

  const app=document.querySelector('#app');
  const runtime=window.TitansRuntime;
  const POSTGAME_WINDOW_MS=18*3600000;
  const LIVE_REFRESH_MS=30000;
  const IDLE_REFRESH_MS=300000;
  const REFRESH_GUARD_MS=10000;
  const SCOREBOARD_STALE_MS=300000;
  const BOOTSTRAP_TTL_MS=30000;
  const LIVE_DATA_TTL_MS=15000;
  let state={data:null,fan:null,espn:null,loading:null,refreshing:null,feed:{fanOk:null,espnOk:null,checkedAt:null},serial:0};
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const arr=v=>Array.isArray(v)?v:[];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=v=>Number.isFinite(Number(v))?Number(v):null;
  const fmt=value=>{try{const d=new Date(value);return Number.isNaN(d.getTime())?'TBD':new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(d)}catch{return'TBD'}};
  const shortFmt=value=>{try{const d=new Date(value);return Number.isNaN(d.getTime())?'TBD':new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric'}).format(d)}catch{return'TBD'}};
  const gameLabel=g=>g?`${g.homeAway==='home'?'vs':'at'} ${g.opponent||g.opponentAbbr||'Opponent'}`:'Titans game';
  const countdown=value=>{const t=Date.parse(value),diff=t-Date.now();if(!Number.isFinite(t))return'Time TBD';if(diff<=0)return'Game time';const m=Math.floor(diff/60000),d=Math.floor(m/1440),h=Math.floor((m%1440)/60);return d?`${d}d ${h}h`:h?`${h}h ${m%60}m`:`${Math.max(1,m)}m`};
  const checkedAge=()=>{const t=Date.parse(state.feed.checkedAt);return Number.isFinite(t)?Math.max(0,Date.now()-t):Infinity};
  const relativeAge=value=>{const t=Date.parse(value);if(!Number.isFinite(t))return'';const ms=Math.max(0,Date.now()-t);if(ms<5000)return'just now';if(ms<60000)return`${Math.max(1,Math.floor(ms/1000))}s ago`;const minutes=Math.floor(ms/60000);if(minutes<60)return`${minutes}m ago`;return fmt(value)};
  const json=url=>fetch(url,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
  const available=response=>Boolean(response?.ok&&response?.available!==false);
  const cacheInfo=url=>runtime?.apiCacheInfo?.().find(row=>row.url===url)||null;

  async function sharedJson(url,{ttl=LIVE_DATA_TTL_MS,force=false}={}){
    if(!runtime?.apiJson)return {value:await json(url),fresh:null};
    const value=await runtime.apiJson(url,{ttl,force});
    const updatedAt=Number(cacheInfo(url)?.updatedAt)||0;
    const age=updatedAt?Math.max(0,Date.now()-updatedAt):Infinity;
    return {value,fresh:Number.isFinite(age)&&age<=Math.max(1000,ttl)};
  }
  const readHealthy=read=>read?.fresh!==false&&available(read?.value);

  async function load(){
    if(state.data&&state.fan)return state;
    if(state.loading)return state.loading;
    state.loading=Promise.all([
      sharedJson('/api/data',{ttl:BOOTSTRAP_TTL_MS}),
      sharedJson('/api/fan-intel',{ttl:LIVE_DATA_TTL_MS}),
      sharedJson('/api/espn-scoreboard',{ttl:LIVE_DATA_TTL_MS})
    ]).then(([dataRead,fanRead,espnRead])=>{
      const data=dataRead.value,fan=fanRead.value,espn=espnRead.value;
      state.data=data?.ok?data:{};
      state.fan=fan?.ok?fan:{};
      state.espn=espn?.ok?espn:null;
      state.feed={fanOk:readHealthy(fanRead),espnOk:readHealthy(espnRead),checkedAt:new Date().toISOString()};
      return state;
    }).finally(()=>state.loading=null);
    return state.loading;
  }

  async function refreshLiveData(force=false){
    if(state.refreshing)return state.refreshing;
    if(!force&&checkedAge()<REFRESH_GUARD_MS)return state;
    state.refreshing=Promise.all([
      sharedJson('/api/fan-intel',{ttl:LIVE_DATA_TTL_MS,force}),
      sharedJson('/api/espn-scoreboard',{ttl:LIVE_DATA_TTL_MS,force})
    ]).then(([fanRead,espnRead])=>{
      const fan=fanRead.value,espn=espnRead.value;
      const fanOk=readHealthy(fanRead),espnOk=readHealthy(espnRead);
      if(available(fan))state.fan=fan;
      if(available(espn))state.espn=espn;
      state.feed={fanOk,espnOk,checkedAt:new Date().toISOString()};
      return state;
    }).finally(()=>state.refreshing=null);
    return state.refreshing;
  }

  const games=()=>arr(state.data?.games);
  const injuries=()=>arr(state.fan?.injuries);
  const drives=()=>arr(state.fan?.gameDay?.drives);
  const plays=()=>arr(state.fan?.gameDay?.plays);
  const playerStats=()=>arr(state.fan?.playerStats);

  function gameFocus(){return runtime?.scheduleFocus?.(games())||{state:'none',game:null,current:null,next:null}}
  function nextGame(){return gameFocus().next||null}
  function latestFinal(){
    const finals=games().map((game,index)=>({game,index,time:Date.parse(game?.date)})).filter(row=>/final/i.test(String(row.game?.status||'')));
    if(!finals.length)return null;
    finals.sort((a,b)=>{const av=Number.isFinite(a.time),bv=Number.isFinite(b.time);if(av&&bv)return a.time-b.time||a.index-b.index;if(av)return 1;if(bv)return-1;return a.index-b.index});
    return finals.at(-1)?.game||null;
  }
  function recentFinal(){const g=latestFinal(),t=Date.parse(g?.date);return g&&Number.isFinite(t)&&Date.now()>=t&&Date.now()-t<=POSTGAME_WINDOW_MS?g:null}

  const normalizeOpponent=value=>String(value||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'');
  function providerOpponentMatches(eg,g){
    const providerAbbr=String(eg?.opponentAbbr||'').trim().toUpperCase(),scheduleAbbr=String(g?.opponentAbbr||'').trim().toUpperCase();
    if(providerAbbr&&scheduleAbbr)return providerAbbr===scheduleAbbr;
    const providerName=normalizeOpponent(eg?.opponent),scheduleName=normalizeOpponent(g?.opponent);
    return Boolean(providerName&&scheduleName&&providerName===scheduleName);
  }
  function providerMatchesGame(eg,g){
    if(!eg||!g||!providerOpponentMatches(eg,g))return false;
    const providerKickoff=Date.parse(eg.date),scheduleKickoff=Date.parse(g.date);
    return Number.isFinite(providerKickoff)&&Number.isFinite(scheduleKickoff)&&Math.abs(providerKickoff-scheduleKickoff)<12*3600000;
  }

  const providerLiveStatus=eg=>Boolean(eg&&/in progress|halftime|end of/i.test(`${eg.status} ${eg.detail}`));

  function espnGame(focus=gameFocus()){
    const rows=[];
    for(const event of arr(state.espn?.payload?.events)){
      const competition=event?.competitions?.[0];if(!competition)continue;
      const comps=arr(competition.competitors),ten=comps.find(x=>x?.team?.abbreviation==='TEN');if(!ten)continue;
      const opp=comps.find(x=>x!==ten)||{};
      const detail=competition.status||event.status||{};
      rows.push({
        id:String(event.id||''),name:event.name||'',date:event.date||competition.date||'',status:detail.type?.description||detail.type?.name||'',detail:detail.type?.shortDetail||detail.type?.detail||'',clock:detail.displayClock||'',period:detail.period||null,
        score:num(ten.score),opponentScore:num(opp.score),opponent:opp.team?.displayName||opp.team?.shortDisplayName||'Opponent',opponentAbbr:opp.team?.abbreviation||'',homeAway:ten.homeAway||'',network:arr(competition.broadcasts).flatMap(x=>x.names||[]).join(' / '),venue:competition.venue?.fullName||'',possession:competition.situation?.possession||'',downDistance:competition.situation?.shortDownDistanceText||'',yardLine:competition.situation?.possessionText||''
      });
    }
    if(!rows.length)return null;
    const focused=focus?.current||focus?.game;
    if(focused){
      const matches=rows.filter(row=>providerMatchesGame(row,focused));
      if(!matches.length)return null;
      const kickoff=Date.parse(focused.date);
      matches.sort((a,b)=>{
        const at=Date.parse(a.date),bt=Date.parse(b.date);
        const ad=Number.isFinite(at)&&Number.isFinite(kickoff)?Math.abs(at-kickoff):Infinity;
        const bd=Number.isFinite(bt)&&Number.isFinite(kickoff)?Math.abs(bt-kickoff):Infinity;
        return ad-bd||String(a.id).localeCompare(String(b.id));
      });
      return matches[0];
    }
    const live=rows.filter(providerLiveStatus),pool=live.length?live:rows,now=Date.now();
    pool.sort((a,b)=>{
      const at=Date.parse(a.date),bt=Date.parse(b.date),ad=Number.isFinite(at)?Math.abs(at-now):Infinity,bd=Number.isFinite(bt)?Math.abs(bt-now):Infinity;
      return ad-bd||String(a.id).localeCompare(String(b.id));
    });
    return pool[0]||null;
  }

  function providerFinalGame(eg,focus){
    const game=focus.current||focus.game;
    if(!game||!eg||!(/\bfinal\b/i.test(`${eg.status} ${eg.detail}`))||eg.score==null||eg.opponentScore==null||!providerMatchesGame(eg,game))return null;
    return {...game,score:eg.score,opponentScore:eg.opponentScore,opponent:eg.opponent||game.opponent,opponentAbbr:eg.opponentAbbr||game.opponentAbbr,homeAway:eg.homeAway||game.homeAway,date:eg.date||game.date,network:eg.network||game.network,venue:eg.venue||game.venue,status:'Final'};
  }

  function phase(){
    const focus=gameFocus(),eg=espnGame(focus);
    if(providerLiveStatus(eg))return['live',focus.current||focus.game||latestFinal(),eg];
    const providerFinal=providerFinalGame(eg,focus);if(providerFinal)return['postgame',providerFinal,eg];
    const justFinished=recentFinal();if(justFinished)return['postgame',justFinished,eg];
    if(focus.game)return['pregame',focus.game,eg];
    return['postgame',latestFinal(),eg];
  }

  function relevantRows(rows,g){
    if(!g)return[];
    const target=Date.parse(g.date);return rows.filter(x=>{const t=Date.parse(x.kickoff||x.date||0);return Number.isFinite(t)&&Number.isFinite(target)&&Math.abs(t-target)<36*3600000});
  }

  function weather(g){
    const rows=arr(state.data?.weather?.rows);return rows.find(x=>String(x.gameId||'')===String(g?.id||''))||rows.find(x=>{const a=Date.parse(x.kickoff),b=Date.parse(g?.date);return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<6*3600000})||null;
  }

  function opponentQuick(g){
    const opp=state.fan?.opponent;if(!opp||!g)return null;
    if(opp.abbreviation&&g.opponentAbbr&&opp.abbreviation!==g.opponentAbbr)return null;
    const recent=arr(opp.recent).slice(0,4),wins=recent.filter(x=>x.result==='W').length,losses=recent.filter(x=>x.result==='L').length;
    return {record:recent.length?`${wins}-${losses} over ${recent.length} recent games`:'Recent results unavailable',recent};
  }

  function topAvailability(){return injuries().slice(0,6)}

  function momentum(g){
    const rows=relevantRows(plays(),g).slice().sort((a,b)=>(a.play||0)-(b.play||0)).slice(-8);if(!rows.length)return null;
    const wpa=rows.map(x=>num(x.winProbabilityAdded)).filter(v=>v!=null),epa=rows.map(x=>num(x.epa)).filter(v=>v!=null);
    const wpaSum=wpa.reduce((a,b)=>a+b,0),epaSum=epa.reduce((a,b)=>a+b,0);
    return {plays:rows,wpa:wpa.length?wpaSum:null,epa:epa.length?epaSum:null,label:wpa.length?(wpaSum>0.04?'Titans momentum':wpaSum<-0.04?'Opponent momentum':'Even stretch'):(epa.length?(epaSum>0?'Positive offensive stretch':'Negative offensive stretch'):'No model signal')};
  }

  const LEADER_GROUPS=[
    {label:'Passing',positions:['QB'],primary:[['passing_yards','pass_yards'],['passing_touchdowns','passing_tds','pass_touchdowns','pass_tds'],['completions','passing_completions']],details:[['passing_yards','pass_yards'],['passing_touchdowns','passing_tds','pass_touchdowns','pass_tds'],['completions','passing_completions'],['attempts','passing_attempts']]},
    {label:'Rushing',positions:['QB','RB','FB','WR','TE'],primary:[['rushing_yards','rush_yards'],['rushing_touchdowns','rushing_tds','rush_touchdowns','rush_tds'],['carries','rushing_attempts']],details:[['rushing_yards','rush_yards'],['rushing_touchdowns','rushing_tds','rush_touchdowns','rush_tds'],['carries','rushing_attempts']]},
    {label:'Receiving',positions:['WR','TE','RB','FB'],primary:[['receiving_yards','rec_yards'],['receptions'],['receiving_touchdowns','receiving_tds','rec_touchdowns','rec_tds'],['targets']],details:[['receiving_yards','rec_yards'],['receptions'],['receiving_touchdowns','receiving_tds','rec_touchdowns','rec_tds'],['targets']]},
    {label:'Defense',positions:['DL','DE','DT','NT','EDGE','LB','ILB','OLB','CB','DB','S','FS','SS'],primary:[['sacks'],['defensive_interceptions','def_interceptions'],['tackles_for_loss','tfl'],['forced_fumbles'],['total_tackles','tackles_combined','tackles']],details:[['sacks'],['defensive_interceptions','def_interceptions'],['total_tackles','tackles_combined','tackles'],['tackles_for_loss','tfl'],['forced_fumbles'],['qb_hits']]},
    {label:'Kicking',positions:['K','PK'],primary:[['field_goals_made','fg_made'],['kicking_points'],['extra_points_made','xp_made']],details:[['field_goals_made','fg_made'],['field_goals_attempted','fg_attempted'],['extra_points_made','xp_made'],['kicking_points']]}
  ];
  const METRIC_LABELS={passing_yards:'pass yds',pass_yards:'pass yds',passing_touchdowns:'pass TD',passing_tds:'pass TD',pass_touchdowns:'pass TD',pass_tds:'pass TD',completions:'completions',passing_completions:'completions',attempts:'attempts',passing_attempts:'attempts',rushing_yards:'rush yds',rush_yards:'rush yds',rushing_touchdowns:'rush TD',rushing_tds:'rush TD',rush_touchdowns:'rush TD',rush_tds:'rush TD',carries:'carries',rushing_attempts:'carries',receiving_yards:'rec yds',rec_yards:'rec yds',receptions:'receptions',receiving_touchdowns:'rec TD',receiving_tds:'rec TD',rec_touchdowns:'rec TD',rec_tds:'rec TD',targets:'targets',sacks:'sacks',defensive_interceptions:'INT',def_interceptions:'INT',total_tackles:'tackles',tackles_combined:'tackles',tackles:'tackles',tackles_for_loss:'TFL',tfl:'TFL',forced_fumbles:'forced fumbles',qb_hits:'QB hits',field_goals_made:'FG made',fg_made:'FG made',field_goals_attempted:'FG att',fg_attempted:'FG att',extra_points_made:'XP made',xp_made:'XP made',kicking_points:'kicking pts'};
  const normalizeStatKey=key=>String(key||'').replace(/([a-z0-9])([A-Z])/g,'$1_$2').replace(/[^a-zA-Z0-9]+/g,'_').replace(/^_+|_+$/g,'').toLowerCase();
  const metricLabel=key=>METRIC_LABELS[key]||String(key||'stat').replace(/_/g,' ');

  function normalizedStats(row){
    const stats=new Map();
    for(const [key,value] of Object.entries(row?.stats||{})){
      const normalized=normalizeStatKey(key),n=num(value);if(!normalized||n==null)continue;
      const current=stats.get(normalized);if(current==null||Math.abs(n)>Math.abs(current))stats.set(normalized,n);
    }
    return stats;
  }

  function playerLeaderRows(g){
    const byPlayer=new Map();
    for(const row of relevantRows(playerStats(),g)){
      const key=String(row.playerId||row.name||'').trim();if(!key)continue;
      if(!byPlayer.has(key))byPlayer.set(key,{name:row.name||'Player',position:String(row.position||'').toUpperCase(),stats:new Map()});
      const holder=byPlayer.get(key);
      for(const [metric,value] of normalizedStats(row)){
        const current=holder.stats.get(metric);if(current==null||Math.abs(value)>Math.abs(current))holder.stats.set(metric,value);
      }
    }
    return [...byPlayer.values()];
  }

  function playerMetric(player,aliases){for(const key of aliases){if(player.stats.has(key))return[key,player.stats.get(key)]}return null}
  function positionEligible(player,group){return !player.position||group.positions.includes(player.position)}

  function groupLeader(players,group){
    const eligible=players.filter(player=>positionEligible(player,group));if(!eligible.length)return null;
    for(const primaryAliases of group.primary){
      const candidates=eligible.map(player=>({player,metric:playerMetric(player,primaryAliases)})).filter(row=>row.metric&&row.metric[1]>0);
      if(!candidates.length)continue;
      candidates.sort((a,b)=>b.metric[1]-a.metric[1]||a.player.name.localeCompare(b.player.name));
      const winner=candidates[0].player,values=[];
      for(const aliases of group.details){const found=playerMetric(winner,aliases);if(!found||found[1]===0)continue;values.push(found);if(values.length===3)break}
      return {name:winner.name,position:winner.position,label:group.label,values};
    }
    return null;
  }

  function leaders(g){
    const players=playerLeaderRows(g);if(!players.length)return[];
    return LEADER_GROUPS.map(group=>groupLeader(players,group)).filter(Boolean);
  }

  function feedStatus(mode){
    const stamp=Date.parse(state.espn?.fetchedAt),ageMs=Number.isFinite(stamp)?Math.max(0,Date.now()-stamp):Infinity;
    const espnHealthy=Boolean(state.espn)&&state.feed.espnOk!==false&&state.espn?.snapshot?.stale!==true&&ageMs<=SCOREBOARD_STALE_MS;
    const fanHealthy=state.feed.fanOk!==false;
    const healthy=espnHealthy&&fanHealthy;
    const label=mode==='live'?(espnHealthy?'Live scoreboard connected':'Live scoreboard delayed'):(espnHealthy?'Game data synced':'Scoreboard feed delayed');
    const source=state.espn?`${state.espn.provider||'ESPN'} · synced ${relativeAge(state.espn.fetchedAt)||'recently'}${state.espn.unofficial?' · unofficial':''}`:'ESPN scoreboard unavailable';
    const fan=fanHealthy?'Fan intel connected':'Fan intel retrying · showing the last confirmed update';
    return {healthy,label,source,fan};
  }

  function feedBar(mode){
    const status=feedStatus(mode),label=`Game data status: ${status.label}. ${status.source}. ${status.fan}.`;
    return `<div class="v16-gd-feed" data-state="${status.healthy?'healthy':'degraded'}" aria-label="${esc(label)}"><span class="v16-gd-feed-dot" aria-hidden="true"></span><strong>${esc(status.label)}</strong><span>${esc(status.source)}</span><span>${esc(status.fan)} · checks every 30s during game windows</span><button type="button" data-gameday-refresh>Refresh now</button></div>`;
  }

  function playCard(play){if(!play)return'<div class="v16-gd-empty"><strong>No play update yet.</strong><span>Live play context appears only when a trustworthy play is available.</span></div>';const down=play.down?`${play.down}${play.down===1?'st':play.down===2?'nd':play.down===3?'rd':'th'} & ${play.yardsToGo??'?'}`:'Down/distance unavailable';return `<article class="v16-last-play"><small>WHAT JUST HAPPENED</small><strong>${esc(play.description||play.type||'Latest play')}</strong><span>${esc(down)}${play.yardline?` · ${esc(play.yardline)}`:''}${play.yards!=null?` · ${esc(play.yards)} yards`:''}</span><div><b>${play.success?'Successful play':'Not marked successful'}</b>${play.explosive?'<b>Explosive</b>':''}${num(play.epa)!=null?`<b>EPA ${play.epa>0?'+':''}${Number(play.epa).toFixed(2)}</b>`:''}${num(play.winProbabilityAdded)!=null?`<b>WPA ${play.winProbabilityAdded>0?'+':''}${(Number(play.winProbabilityAdded)*100).toFixed(1)}%</b>`:''}</div><p>EPA/WPA are model-derived football metrics from available play-by-play, not official league win-probability labels.</p></article>`}

  function broadcast(g){return `<section class="v16-gd-tune"><div><small>TUNE IN</small><strong>${esc(g?.network||'Network TBD')}</strong><span>Kickoff ${esc(g?.date?fmt(g.date):'TBD')} · ${esc(g?.date?countdown(g.date):'')}</span></div><a href="#media">Listen / Watch →</a></section>`}

  function pregame(g){
    const w=weather(g),opp=opponentQuick(g),inj=topAvailability();
    const watch=[inj.length?`${inj.length} current injury-report row${inj.length===1?'':'s'} available.`:'Injury report is awaiting a current update.',opp?`${g.opponentAbbr||g.opponent}: ${opp.record}.`:'Opponent recent-form data is not available.',w?`${w.temperatureF??'—'}°F · ${w.condition||'conditions TBD'}${w.windMph!=null?` · wind ${w.windMph} mph`:''}`:'Weather update is not available yet.'];
    return `<section class="v16-gd-phase"><header><div><small>PREGAME COMMAND</small><h2>${esc(gameLabel(g))}</h2><p>${esc(fmt(g.date))} · ${esc(g.venue||'Venue TBD')}</p></div><div class="v16-gd-countdown"><small>KICKOFF IN</small><strong>${esc(countdown(g.date))}</strong></div></header>${broadcast(g)}<div class="v16-gd-grid three"><article><small>WHAT TO WATCH</small><h3>Three things before kickoff</h3><ol>${watch.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></article><article><small>AVAILABILITY</small><h3>Latest report</h3>${inj.length?inj.map(x=>`<div class="v16-gd-row"><strong>${esc(x.name)}</strong><span>${esc(x.practiceStatus||x.reportStatus||x.primaryInjury||'Reported')}</span></div>`).join(''):'<p>No current injury report is available; that is not a medical clearance.</p>'}</article><article><small>OPPONENT</small><h3>${esc(g.opponent||'Opponent')}</h3>${opp?`<p>${esc(opp.record)}</p><div class="v16-gd-chips">${opp.recent.map(x=>`<span>${esc(x.result||'—')} · ${esc(x.score||'score TBD')}</span>`).join('')}</div>`:'<p>Opponent recent-game context is not available yet.</p>'}<a href="#fan">Open opponent scouting →</a></article></div></section>`;
  }

  function live(g,eg){
    const game=g||{},m=momentum(game),rows=relevantRows(plays(),game).sort((a,b)=>(b.play||0)-(a.play||0)),last=rows[0],currentDrive=relevantRows(drives(),game).sort((a,b)=>(b.drive||0)-(a.drive||0))[0],top=leaders(game);
    return `<section class="v16-gd-phase live"><header class="v16-live-score"><div><small>LIVE</small><h2>TEN ${esc(eg?.score??game.score??'—')} <span>—</span> ${esc(eg?.opponentAbbr||game.opponentAbbr||'OPP')} ${esc(eg?.opponentScore??game.opponentScore??'—')}</h2><p>${esc(eg?.detail||eg?.status||'Game in progress')}${eg?.clock?` · ${esc(eg.clock)}`:''}${eg?.period?` · Q${esc(eg.period)}`:''}</p></div><div><small>DOWN / FIELD</small><strong>${esc(eg?.downDistance||'Awaiting live situation')}</strong><span>${esc(eg?.yardLine||'')}</span></div></header>${broadcast(game)}<div class="v16-gd-grid two">${playCard(last)}<article class="v16-gd-panel"><small>CURRENT DRIVE</small><h3>${currentDrive?`${esc(currentDrive.team||'Team')} · ${esc(currentDrive.result||'In progress')}`:'Drive feed awaiting update'}</h3><p>${currentDrive?`${esc(currentDrive.plays??'—')} plays · ${esc(currentDrive.yards??'—')} yards · ${esc(currentDrive.start||'')} → ${esc(currentDrive.end||'')}`:'No live drive update is available yet.'}</p><div class="v16-gd-momentum"><small>MOMENTUM</small><strong>${esc(m?.label||'Not enough play data')}</strong><span>${m?.wpa!=null?`Recent model WPA ${(m.wpa*100).toFixed(1)}%`:m?.epa!=null?`Recent EPA ${m.epa.toFixed(2)}`:'No model-derived signal available'}</span></div></article></div><section class="v16-gd-panel"><header><div><small>TOP PERFORMERS</small><h3>Game leaders by category</h3></div><span>Available category stats only</span></header>${top.length?`<div class="v16-gd-leaders">${top.map(x=>`<article><strong>${esc(x.name)}</strong><small>${esc(x.label)}${x.position?` · ${esc(x.position)}`:''}</small><span>${x.values.slice(0,2).map(([k,v])=>`${esc(metricLabel(k))} ${esc(v)}`).join(' · ')}</span></article>`).join('')}</div>`:'<div class="v16-gd-empty"><strong>Player leader stats are not available yet.</strong><span>No live leader is guessed.</span></div>'}</section></section>`;
  }

  function postgame(g){
    const rows=relevantRows(plays(),g).sort((a,b)=>(a.play||0)-(b.play||0)),turning=rows.filter(x=>Math.abs(num(x.winProbabilityAdded)||0)>=.08||x.explosive).sort((a,b)=>Math.abs(num(b.winProbabilityAdded)||0)-Math.abs(num(a.winProbabilityAdded)||0)).slice(0,5),top=leaders(g),m=momentum(g),next=nextGame();
    const result=g&&g.score!=null&&g.opponentScore!=null?(Number(g.score)>Number(g.opponentScore)?'Titans win':Number(g.score)<Number(g.opponentScore)?'Titans lose':'Tie'):'Final result';
    return `<section class="v16-gd-phase post"><header><div><small>POSTGAME COMMAND</small><h2>${esc(result)} · TEN ${esc(g?.score??'—')} — ${esc(g?.opponentAbbr||'OPP')} ${esc(g?.opponentScore??'—')}</h2><p>${esc(gameLabel(g))} · ${esc(shortFmt(g?.date))}</p></div><a href="#games">Full schedule →</a></header><div class="v16-gd-grid two"><article class="v16-gd-panel"><small>TURNING POINTS</small><h3>Biggest available swings</h3>${turning.length?turning.map(x=>`<div class="v16-gd-row"><strong>${esc(x.description||x.type||'Play')}</strong><span>${num(x.winProbabilityAdded)!=null?`WPA ${(Number(x.winProbabilityAdded)*100).toFixed(1)}%`:x.explosive?'Explosive play':'High-impact play'}</span></div>`).join(''):'<p>No trustworthy turning-point data is available yet.</p>'}</article><article class="v16-gd-panel"><small>WHAT CHANGED?</small><h3>Because of this game</h3><p>${m?.label?`The final available stretch reads as “${esc(m.label)}.” `:''}Roster, injury and depth consequences populate through Command Intel as verified updates arrive.</p><a href="#command">Open Change Engine →</a></article></div><section class="v16-gd-panel"><header><div><small>TOP PERFORMERS</small><h3>Final game leaders by category</h3></div><span>${top.length} categories</span></header>${top.length?`<div class="v16-gd-leaders">${top.map(x=>`<article><strong>${esc(x.name)}</strong><small>${esc(x.label)}${x.position?` · ${esc(x.position)}`:''}</small><span>${x.values.slice(0,3).map(([k,v])=>`${esc(metricLabel(k))} ${esc(v)}`).join(' · ')}</span></article>`).join('')}</div>`:'<div class="v16-gd-empty"><strong>Postgame player stats are not available yet.</strong><span>This section updates automatically when verified stats arrive.</span></div>'}</section>${next?`<section class="v16-next-up"><div><small>NEXT UP</small><strong>${esc(gameLabel(next))}</strong><span>${esc(fmt(next.date))} · ${esc(next.network||'Network TBD')}</span></div><a href="#media">Plan how to watch →</a></section>`:''}</section>`;
  }

  function render(replaceExisting=false){
    if(route()!=='live'||!state.data||!state.fan)return;
    const target=document.querySelector('.v14-gameday-quick')||document.querySelector('.page-head'),existing=document.querySelector('.v16-gameday');
    if(!target||(existing&&!replaceExisting))return;
    const [mode,g,eg]=phase(),root=document.createElement('section');
    root.className='v16-gameday';root.dataset.phase=mode;
    root.innerHTML=`<div class="v16-gd-mode"><span class="active">${mode==='pregame'?'Pregame':mode==='live'?'Live':'Postgame'}</span><small>Game Day 3.1 · verified updates</small></div>${feedBar(mode)}${mode==='live'?live(g,eg):mode==='postgame'?postgame(g):pregame(g)}`;
    if(existing)existing.replaceWith(root);else target.insertAdjacentElement('afterend',root);
  }

  async function refresh(force=false,button=null){
    if(route()!=='live'||document.hidden||!state.data)return;
    const current=state.serial;
    if(button){button.disabled=true;button.textContent='Refreshing…'}
    await refreshLiveData(force);
    if(current!==state.serial||route()!=='live'||document.hidden)return;
    render(true);
  }

  function shouldAutoRefresh(){
    if(route()!=='live'||document.hidden||!state.data)return false;
    const [mode]=phase(),focus=gameFocus();
    return mode==='live'||focus.state==='game-window'||checkedAge()>=IDLE_REFRESH_MS;
  }

  async function enhance(){if(route()!=='live')return;const current=++state.serial;await load();if(current!==state.serial||route()!=='live')return;render()}
  if(app){
    new MutationObserver(()=>queueMicrotask(render)).observe(app,{childList:true,subtree:false});
    app.addEventListener('click',event=>{const button=event.target.closest?.('[data-gameday-refresh]');if(!button)return;event.preventDefault();void refresh(true,button)});
  }
  addEventListener('hashchange',()=>{state.serial++;setTimeout(enhance,40)});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&route()==='live')void refresh()});
  setInterval(()=>{if(shouldAutoRefresh())void refresh()},LIVE_REFRESH_MS);
  setTimeout(enhance,120);
})();