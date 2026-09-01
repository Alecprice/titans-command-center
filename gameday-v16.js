(() => {
  'use strict';

  const app=document.querySelector('#app');
  const runtime=window.TitansRuntime;
  const POSTGAME_WINDOW_MS=18*3600000;
  const LIVE_REFRESH_MS=30000;
  const REFRESH_GUARD_MS=10000;
  const SCOREBOARD_STALE_MS=300000;
  let state={data:null,fan:null,espn:null,loading:null,refreshing:null,feed:{fanOk:null,espnOk:null,checkedAt:null},serial:0};
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const arr=v=>Array.isArray(v)?v:[];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  const num=v=>Number.isFinite(Number(v))?Number(v):null;
  const fmt=value=>{try{const d=new Date(value);return Number.isNaN(d.getTime())?'TBD':new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(d)}catch{return'TBD'}};
  const shortFmt=value=>{try{const d=new Date(value);return Number.isNaN(d.getTime())?'TBD':new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric'}).format(d)}catch{return'TBD'}};
  const gameLabel=g=>g?`${g.homeAway==='home'?'vs':'at'} ${g.opponent||g.opponentAbbr||'Opponent'}`:'Titans game';
  const countdown=value=>{const t=Date.parse(value),diff=t-Date.now();if(!Number.isFinite(t))return'Time TBD';if(diff<=0)return'Game time';const m=Math.floor(diff/60000),d=Math.floor(m/1440),h=Math.floor((m%1440)/60);return d?`${d}d ${h}h`:h?`${h}h ${m%60}m`:`${Math.max(1,m)}m`};
  const checkedAge=()=>{const t=Date.parse(state.feed.checkedAt);return Number.isFinite(t)?Math.max(0,Date.now()-t):Infinity};
  const relativeAge=value=>{const t=Date.parse(value);if(!Number.isFinite(t))return'';const ms=Math.max(0,Date.now()-t);if(ms<5000)return'just now';if(ms<60000)return`${Math.max(1,Math.floor(ms/1000))}s ago`;const minutes=Math.floor(ms/60000);if(minutes<60)return`${minutes}m ago`;return fmt(value)};
  const json=url=>fetch(url,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);

  async function load(){
    if(state.data&&state.fan)return state;
    if(state.loading)return state.loading;
    state.loading=Promise.all([json('/api/data'),json('/api/fan-intel'),json('/api/espn-scoreboard')]).then(([data,fan,espn])=>{
      state.data=data?.ok?data:{};
      state.fan=fan?.ok?fan:{};
      state.espn=espn?.ok?espn:null;
      state.feed={fanOk:Boolean(fan?.ok),espnOk:Boolean(espn?.ok),checkedAt:new Date().toISOString()};
      return state;
    }).finally(()=>state.loading=null);
    return state.loading;
  }

  async function refreshLiveData(force=false){
    if(state.refreshing)return state.refreshing;
    if(!force&&checkedAge()<REFRESH_GUARD_MS)return state;
    state.refreshing=Promise.all([json('/api/fan-intel'),json('/api/espn-scoreboard')]).then(([fan,espn])=>{
      const fanOk=Boolean(fan?.ok),espnOk=Boolean(espn?.ok);
      if(fanOk)state.fan=fan;
      if(espnOk)state.espn=espn;
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

  function espnGame(){
    for(const event of arr(state.espn?.payload?.events)){
      const competition=event?.competitions?.[0];if(!competition)continue;
      const comps=arr(competition.competitors),ten=comps.find(x=>x?.team?.abbreviation==='TEN');if(!ten)continue;
      const opp=comps.find(x=>x!==ten)||{};
      const detail=competition.status||event.status||{};
      return {
        id:String(event.id||''),name:event.name||'',date:event.date||competition.date||'',status:detail.type?.description||detail.type?.name||'',detail:detail.type?.shortDetail||detail.type?.detail||'',clock:detail.displayClock||'',period:detail.period||null,
        score:num(ten.score),opponentScore:num(opp.score),opponent:opp.team?.displayName||opp.team?.shortDisplayName||'Opponent',opponentAbbr:opp.team?.abbreviation||'',homeAway:ten.homeAway||'',network:arr(competition.broadcasts).flatMap(x=>x.names||[]).join(' / '),venue:competition.venue?.fullName||'',possession:competition.situation?.possession||'',downDistance:competition.situation?.shortDownDistanceText||'',yardLine:competition.situation?.possessionText||''
      };
    }
    return null;
  }

  function phase(){
    const eg=espnGame(),focus=gameFocus();
    if(eg&&/in progress|halftime|end of/i.test(`${eg.status} ${eg.detail}`))return['live',focus.current||focus.game||latestFinal(),eg];
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
    return {record:recent.length?`${wins}-${losses} over ${recent.length} loaded games`:'Recent results not loaded',recent};
  }

  function topAvailability(){return injuries().slice(0,6)}

  function momentum(g){
    const rows=relevantRows(plays(),g).slice().sort((a,b)=>(a.play||0)-(b.play||0)).slice(-8);if(!rows.length)return null;
    const wpa=rows.map(x=>num(x.winProbabilityAdded)).filter(v=>v!=null),epa=rows.map(x=>num(x.epa)).filter(v=>v!=null);
    const wpaSum=wpa.reduce((a,b)=>a+b,0),epaSum=epa.reduce((a,b)=>a+b,0);
    return {plays:rows,wpa:wpa.length?wpaSum:null,epa:epa.length?epaSum:null,label:wpa.length?(wpaSum>0.04?'Titans momentum':wpaSum<-0.04?'Opponent momentum':'Even stretch'):(epa.length?(epaSum>0?'Positive offensive stretch':'Negative offensive stretch'):'No model signal')};
  }

  function leaders(g){
    const rows=relevantRows(playerStats(),g);if(!rows.length)return[];
    const byPlayer=new Map();
    for(const row of rows){const key=row.playerId||row.name;if(!byPlayer.has(key))byPlayer.set(key,{name:row.name||'Player',position:row.position||'',values:[]});const holder=byPlayer.get(key);for(const [k,v] of Object.entries(row.stats||{})){if(num(v)!=null)holder.values.push([k,num(v)])}}
    return [...byPlayer.values()].map(x=>{x.values.sort((a,b)=>Math.abs(b[1])-Math.abs(a[1]));return x}).sort((a,b)=>(b.values[0]?.[1]||0)-(a.values[0]?.[1]||0)).slice(0,5);
  }

  function feedStatus(mode){
    const stamp=Date.parse(state.espn?.fetchedAt),ageMs=Number.isFinite(stamp)?Math.max(0,Date.now()-stamp):Infinity;
    const espnHealthy=Boolean(state.espn)&&state.feed.espnOk!==false&&ageMs<=SCOREBOARD_STALE_MS;
    const fanHealthy=state.feed.fanOk!==false;
    const healthy=espnHealthy&&fanHealthy;
    const label=mode==='live'?(espnHealthy?'Live scoreboard connected':'Live scoreboard delayed'):(espnHealthy?'Game data synced':'Scoreboard feed delayed');
    const source=state.espn?`${state.espn.provider||'ESPN'} · synced ${relativeAge(state.espn.fetchedAt)||'recently'}${state.espn.unofficial?' · unofficial':''}`:'ESPN scoreboard unavailable';
    const fan=fanHealthy?'Fan intel connected':'Fan intel retrying · showing last good snapshot';
    return {healthy,label,source,fan};
  }

  function feedBar(mode){
    const status=feedStatus(mode),label=`Game data status: ${status.label}. ${status.source}. ${status.fan}.`;
    return `<div class="v16-gd-feed" data-state="${status.healthy?'healthy':'degraded'}" aria-label="${esc(label)}"><span class="v16-gd-feed-dot" aria-hidden="true"></span><strong>${esc(status.label)}</strong><span>${esc(status.source)}</span><span>${esc(status.fan)} · checks every 30s while open</span><button type="button" data-gameday-refresh>Refresh now</button></div>`;
  }

  function playCard(play){if(!play)return'<div class="v16-gd-empty"><strong>No play loaded.</strong><span>Live play context appears only when a trustworthy play row exists.</span></div>';const down=play.down?`${play.down}${play.down===1?'st':play.down===2?'nd':play.down===3?'rd':'th'} & ${play.yardsToGo??'?'}`:'Down/distance unavailable';return `<article class="v16-last-play"><small>WHAT JUST HAPPENED</small><strong>${esc(play.description||play.type||'Latest play')}</strong><span>${esc(down)}${play.yardline?` · ${esc(play.yardline)}`:''}${play.yards!=null?` · ${esc(play.yards)} yards`:''}</span><div><b>${play.success?'Successful play':'Not marked successful'}</b>${play.explosive?'<b>Explosive</b>':''}${num(play.epa)!=null?`<b>EPA ${play.epa>0?'+':''}${Number(play.epa).toFixed(2)}</b>`:''}${num(play.winProbabilityAdded)!=null?`<b>WPA ${play.winProbabilityAdded>0?'+':''}${(Number(play.winProbabilityAdded)*100).toFixed(1)}%</b>`:''}</div><p>EPA/WPA are model-derived football metrics from the loaded play data, not official league win-probability labels.</p></article>`}

  function broadcast(g){return `<section class="v16-gd-tune"><div><small>TUNE IN</small><strong>${esc(g?.network||'Network TBD')}</strong><span>Kickoff ${esc(g?.date?fmt(g.date):'TBD')} · ${esc(g?.date?countdown(g.date):'')}</span></div><a href="#media">Listen / Watch →</a></section>`}

  function pregame(g){
    const w=weather(g),opp=opponentQuick(g),inj=topAvailability();
    const watch=[inj.length?`${inj.length} current injury-report row${inj.length===1?'':'s'} are loaded.`:'Injury feed is awaiting a current update.',opp?`${g.opponentAbbr||g.opponent}: ${opp.record}.`:'Opponent recent-form data is not loaded.',w?`${w.temperatureF??'—'}°F · ${w.condition||'conditions TBD'}${w.windMph!=null?` · wind ${w.windMph} mph`:''}`:'Weather snapshot is not loaded yet.'];
    return `<section class="v16-gd-phase"><header><div><small>PREGAME COMMAND</small><h2>${esc(gameLabel(g))}</h2><p>${esc(fmt(g.date))} · ${esc(g.venue||'Venue TBD')}</p></div><div class="v16-gd-countdown"><small>KICKOFF IN</small><strong>${esc(countdown(g.date))}</strong></div></header>${broadcast(g)}<div class="v16-gd-grid three"><article><small>WHAT TO WATCH</small><h3>Three things before kickoff</h3><ol>${watch.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></article><article><small>AVAILABILITY</small><h3>Latest report</h3>${inj.length?inj.map(x=>`<div class="v16-gd-row"><strong>${esc(x.name)}</strong><span>${esc(x.practiceStatus||x.reportStatus||x.primaryInjury||'Reported')}</span></div>`).join(''):'<p>No current injury rows loaded; that is not a medical clearance.</p>'}</article><article><small>OPPONENT</small><h3>${esc(g.opponent||'Opponent')}</h3>${opp?`<p>${esc(opp.record)}</p><div class="v16-gd-chips">${opp.recent.map(x=>`<span>${esc(x.result||'—')} · ${esc(x.score||'score TBD')}</span>`).join('')}</div>`:'<p>Opponent recent-game context is awaiting data.</p>'}<a href="#fan">Open opponent scouting →</a></article></div></section>`;
  }

  function live(g,eg){
    const game=g||{},m=momentum(game),rows=relevantRows(plays(),game).sort((a,b)=>(b.play||0)-(a.play||0)),last=rows[0],currentDrive=relevantRows(drives(),game).sort((a,b)=>(b.drive||0)-(a.drive||0))[0],top=leaders(game);
    return `<section class="v16-gd-phase live"><header class="v16-live-score"><div><small>LIVE</small><h2>TEN ${esc(eg?.score??game.score??'—')} <span>—</span> ${esc(eg?.opponentAbbr||game.opponentAbbr||'OPP')} ${esc(eg?.opponentScore??game.opponentScore??'—')}</h2><p>${esc(eg?.detail||eg?.status||'Game in progress')}${eg?.clock?` · ${esc(eg.clock)}`:''}${eg?.period?` · Q${esc(eg.period)}`:''}</p></div><div><small>DOWN / FIELD</small><strong>${esc(eg?.downDistance||'Awaiting live situation')}</strong><span>${esc(eg?.yardLine||'')}</span></div></header>${broadcast(game)}<div class="v16-gd-grid two">${playCard(last)}<article class="v16-gd-panel"><small>CURRENT DRIVE</small><h3>${currentDrive?`${esc(currentDrive.team||'Team')} · ${esc(currentDrive.result||'In progress')}`:'Drive feed awaiting update'}</h3><p>${currentDrive?`${esc(currentDrive.plays??'—')} plays · ${esc(currentDrive.yards??'—')} yards · ${esc(currentDrive.start||'')} → ${esc(currentDrive.end||'')}`:'No live drive row is currently loaded.'}</p><div class="v16-gd-momentum"><small>MOMENTUM</small><strong>${esc(m?.label||'Not enough play data')}</strong><span>${m?.wpa!=null?`Recent model WPA ${(m.wpa*100).toFixed(1)}%`:m?.epa!=null?`Recent EPA ${m.epa.toFixed(2)}`:'No model-derived signal loaded'}</span></div></article></div><section class="v16-gd-panel"><header><div><small>TOP PERFORMERS</small><h3>Loaded game leaders</h3></div><span>Structured stats only</span></header>${top.length?`<div class="v16-gd-leaders">${top.map(x=>`<article><strong>${esc(x.name)}</strong><small>${esc(x.position||'')}</small><span>${x.values.slice(0,2).map(([k,v])=>`${esc(String(k).replace(/_/g,' '))} ${esc(v)}`).join(' · ')}</span></article>`).join('')}</div>`:'<div class="v16-gd-empty"><strong>Player leader rows are awaiting ingest.</strong><span>No live leader is guessed.</span></div>'}</section></section>`;
  }

  function postgame(g){
    const rows=relevantRows(plays(),g).sort((a,b)=>(a.play||0)-(b.play||0)),turning=rows.filter(x=>Math.abs(num(x.winProbabilityAdded)||0)>=.08||x.explosive).sort((a,b)=>Math.abs(num(b.winProbabilityAdded)||0)-Math.abs(num(a.winProbabilityAdded)||0)).slice(0,5),top=leaders(g),m=momentum(g),next=nextGame();
    const result=g&&g.score!=null&&g.opponentScore!=null?(Number(g.score)>Number(g.opponentScore)?'Titans win':Number(g.score)<Number(g.opponentScore)?'Titans lose':'Tie'):'Final result';
    return `<section class="v16-gd-phase post"><header><div><small>POSTGAME COMMAND</small><h2>${esc(result)} · TEN ${esc(g?.score??'—')} — ${esc(g?.opponentAbbr||'OPP')} ${esc(g?.opponentScore??'—')}</h2><p>${esc(gameLabel(g))} · ${esc(shortFmt(g?.date))}</p></div><a href="#games">Full schedule →</a></header><div class="v16-gd-grid two"><article class="v16-gd-panel"><small>TURNING POINTS</small><h3>Biggest loaded swings</h3>${turning.length?turning.map(x=>`<div class="v16-gd-row"><strong>${esc(x.description||x.type||'Play')}</strong><span>${num(x.winProbabilityAdded)!=null?`WPA ${(Number(x.winProbabilityAdded)*100).toFixed(1)}%`:x.explosive?'Explosive play':'High-impact play'}</span></div>`).join(''):'<p>No trustworthy turning-point rows are loaded yet.</p>'}</article><article class="v16-gd-panel"><small>WHAT CHANGED?</small><h3>Because of this game</h3><p>${m?.label?`The final loaded stretch reads as “${esc(m.label)}.” `:''}Roster, injury and depth consequences populate through Command Intel as verified updates arrive.</p><a href="#command">Open Change Engine →</a></article></div><section class="v16-gd-panel"><header><div><small>TOP PERFORMERS</small><h3>Final loaded leaders</h3></div><span>${top.length} players</span></header>${top.length?`<div class="v16-gd-leaders">${top.map(x=>`<article><strong>${esc(x.name)}</strong><small>${esc(x.position||'')}</small><span>${x.values.slice(0,3).map(([k,v])=>`${esc(String(k).replace(/_/g,' '))} ${esc(v)}`).join(' · ')}</span></article>`).join('')}</div>`:'<div class="v16-gd-empty"><strong>Postgame player stats are awaiting ingest.</strong><span>The page will populate automatically when the warehouse has them.</span></div>'}</section>${next?`<section class="v16-next-up"><div><small>NEXT UP</small><strong>${esc(gameLabel(next))}</strong><span>${esc(fmt(next.date))} · ${esc(next.network||'Network TBD')}</span></div><a href="#media">Plan how to watch →</a></section>`:''}</section>`;
  }

  function render(replaceExisting=false){
    if(route()!=='live'||!state.data||!state.fan)return;
    const target=document.querySelector('.v14-gameday-quick')||document.querySelector('.page-head'),existing=document.querySelector('.v16-gameday');
    if(!target||(existing&&!replaceExisting))return;
    const [mode,g,eg]=phase(),root=document.createElement('section');
    root.className='v16-gameday';root.dataset.phase=mode;
    root.innerHTML=`<div class="v16-gd-mode"><span class="active">${mode==='pregame'?'Pregame':mode==='live'?'Live':'Postgame'}</span><small>Game Day 3.1 · source-aware</small></div>${feedBar(mode)}${mode==='live'?live(g,eg):mode==='postgame'?postgame(g):pregame(g)}`;
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

  async function enhance(){if(route()!=='live')return;const current=++state.serial;await load();if(current!==state.serial||route()!=='live')return;render()}
  if(app){
    new MutationObserver(()=>queueMicrotask(render)).observe(app,{childList:true,subtree:false});
    app.addEventListener('click',event=>{const button=event.target.closest?.('[data-gameday-refresh]');if(!button)return;event.preventDefault();void refresh(true,button)});
  }
  addEventListener('hashchange',()=>{state.serial++;setTimeout(enhance,40)});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&route()==='live')void refresh()});
  setInterval(()=>{if(route()==='live'&&!document.hidden)void refresh()},LIVE_REFRESH_MS);
  setTimeout(enhance,120);
})();