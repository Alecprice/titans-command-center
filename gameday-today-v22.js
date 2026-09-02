(() => {
  'use strict';

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!runtime||!app)return;

  const OFFICIAL_SCHEDULE='https://www.tennesseetitans.com/schedule/';
  const HOME_GAMEDAY='https://www.tennesseetitans.com/stadium/gameday/';
  const STADIUM_POLICIES='https://www.tennesseetitans.com/stadium/policies';
  const CLEAR_BAG_POLICY='https://www.tennesseetitans.com/stadium/bag-policy';
  const STADIUM_MAP='https://www.tennesseetitans.com/stadium/seating-guide';
  const TITANS_RADIO='WGFX 104.5 FM The Zone';

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const num=value=>Number.isFinite(Number(value))?Number(value):null;
  const teamDate=value=>{
    const date=new Date(value);
    if(Number.isNaN(date.getTime()))return'';
    const parts=new Intl.DateTimeFormat('en-US',{timeZone:runtime.teamTimeZone||'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
    const valueOf=type=>parts.find(part=>part.type===type)?.value||'';
    return `${valueOf('year')}-${valueOf('month')}-${valueOf('day')}`;
  };
  const countdown=value=>{
    const kickoff=Date.parse(value),diff=kickoff-Date.now();
    if(!Number.isFinite(kickoff))return'Time TBD';
    if(diff<=0)return'Kickoff';
    const minutes=Math.floor(diff/60000),days=Math.floor(minutes/1440),hours=Math.floor((minutes%1440)/60);
    return days?`${days}d ${hours}h`:hours?`${hours}h ${minutes%60}m`:`${Math.max(1,minutes)}m`;
  };
  const weekLabel=game=>String(game?.week||'').startsWith('P')?`Preseason ${String(game.week).slice(1)}`:`Week ${game?.week||'TBD'}`;
  const matchup=game=>game?.homeAway==='home'?`${game.opponent||'Opponent'} at Titans`:`Titans at ${game?.opponent||'Opponent'}`;
  const upcoming=games=>runtime.scheduleFocus(games).next||null;

  function ensureStyle(){
    if(document.querySelector('#gameday-today-v22-style'))return;
    const style=document.createElement('style');
    style.id='gameday-today-v22-style';
    style.textContent=`
      .v22-today-brief{margin:16px 0;padding:18px;border:1px solid rgba(75,146,219,.46);border-radius:16px;background:linear-gradient(135deg,rgba(75,146,219,.16),rgba(12,35,64,.72));display:grid;gap:14px}
      .v22-today-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
      .v22-today-head small,.v22-today-fact small{font-size:.7rem;letter-spacing:.11em;text-transform:uppercase;color:#8fc8ff;font-weight:900}
      .v22-today-head h3{margin:4px 0 0;font-size:clamp(1.25rem,3vw,1.7rem)}
      .v22-today-live{padding:7px 10px;border-radius:999px;background:rgba(75,146,219,.14);border:1px solid rgba(75,146,219,.38);font-size:.76rem;font-weight:900;letter-spacing:.07em;text-transform:uppercase;white-space:nowrap}
      .v22-today-live.game-day{background:rgba(237,23,76,.13);border-color:rgba(237,23,76,.38)}
      .v22-today-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
      .v22-today-fact{padding:12px;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:rgba(0,0,0,.12);display:grid;gap:6px;line-height:1.45}
      .v22-today-fact span{color:var(--muted,#a8b8c8)}
      .v22-today-actions{display:flex;gap:9px;flex-wrap:wrap;align-items:center}
      .v22-today-actions a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 13px;border:1px solid rgba(75,146,219,.4);border-radius:999px;color:#8fc8ff;font-weight:900;text-decoration:none}
      .v22-today-actions a:first-child{background:#4b92db;color:#071629;border-color:#4b92db}
      .v22-today-source{margin-left:auto;color:var(--muted,#a8b8c8);font-size:.76rem}
      .v22-home-guide{margin:16px 0;padding:18px;border:1px solid rgba(75,146,219,.38);border-radius:16px;background:linear-gradient(145deg,rgba(12,35,64,.96),rgba(7,22,41,.98));display:grid;gap:14px}
      .v22-home-guide-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-end}.v22-home-guide-head small,.v22-home-card small{font-size:.7rem;letter-spacing:.11em;text-transform:uppercase;color:#8fc8ff;font-weight:900}.v22-home-guide-head h3{margin:4px 0 0;font-size:clamp(1.15rem,2.8vw,1.55rem)}.v22-home-guide-head span{color:var(--muted,#a8b8c8);font-size:.78rem;text-align:right;max-width:320px;line-height:1.4}
      .v22-home-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.v22-home-card{padding:14px;border:1px solid rgba(255,255,255,.09);border-radius:13px;background:rgba(255,255,255,.035);display:grid;gap:7px;align-content:start}.v22-home-card strong{font-size:.95rem;line-height:1.35}.v22-home-card p{margin:0;color:var(--muted,#a8b8c8);font-size:.82rem;line-height:1.5}.v22-home-card a{margin-top:auto;min-height:44px;display:inline-flex;align-items:center;width:max-content;color:#8fc8ff;font-size:.82rem;font-weight:900;text-decoration:none}.v22-home-card a:focus-visible,.v22-home-actions a:focus-visible{outline:3px solid rgba(143,200,255,.55);outline-offset:2px}
      .v22-home-actions{display:flex;gap:9px;flex-wrap:wrap;align-items:center}.v22-home-actions a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 13px;border:1px solid rgba(75,146,219,.4);border-radius:999px;color:#8fc8ff;font-weight:900;text-decoration:none}.v22-home-actions span{margin-left:auto;color:var(--muted,#a8b8c8);font-size:.76rem}
      .v22-verification-note{margin:14px 0;padding:14px 16px;border:1px solid rgba(75,146,219,.4);border-radius:14px;background:rgba(75,146,219,.09);display:grid;gap:7px}
      .v22-verification-note small{font-size:.7rem;letter-spacing:.11em;text-transform:uppercase;color:#8fc8ff;font-weight:900}
      .v22-verification-note strong{font-size:1rem}
      .v22-verification-note p{margin:0;color:var(--muted,#a8b8c8);line-height:1.5}
      .v22-verification-note a{width:max-content;min-height:44px;display:inline-flex;align-items:center;color:#8fc8ff;font-weight:900;text-decoration:none}
      .v22-gameflow{margin-top:14px;padding:18px;border:1px solid rgba(75,146,219,.3);border-radius:16px;background:linear-gradient(180deg,rgba(75,146,219,.08),rgba(0,0,0,.12));display:grid;gap:14px}
      .v22-gameflow-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px}.v22-gameflow-head small,.v22-flow-drive small,.v22-flow-play small{font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:#8fc8ff;font-weight:900}.v22-gameflow-head h3{margin:3px 0 0}.v22-gameflow-head span{color:var(--muted,#a8b8c8);font-size:.8rem;text-align:right}
      .v22-flow-drives{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(190px,1fr);gap:10px;overflow-x:auto;padding:2px 2px 8px;scroll-snap-type:x proximity;overscroll-behavior-inline:contain}.v22-flow-drive{scroll-snap-align:start;padding:12px;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:rgba(255,255,255,.035);display:grid;gap:5px}.v22-flow-drive strong{font-size:.93rem}.v22-flow-drive span{color:var(--muted,#a8b8c8);font-size:.8rem;line-height:1.4}.v22-flow-drive[data-current="true"]{border-color:rgba(75,146,219,.56);box-shadow:inset 0 0 0 1px rgba(75,146,219,.14)}
      .v22-flow-plays{display:grid;gap:8px}.v22-flow-play{display:grid;grid-template-columns:76px minmax(0,1fr) auto;gap:12px;align-items:start;padding:11px 0;border-top:1px solid rgba(255,255,255,.07)}.v22-flow-play:first-child{border-top:0}.v22-flow-play strong{font-size:.9rem;line-height:1.35}.v22-flow-play p{margin:3px 0 0;color:var(--muted,#a8b8c8);font-size:.8rem;line-height:1.42}.v22-flow-play b{padding:4px 7px;border-radius:999px;background:rgba(75,146,219,.12);border:1px solid rgba(75,146,219,.24);font-size:.7rem;white-space:nowrap}.v22-flow-play[data-impact="high"] b{background:rgba(237,23,76,.12);border-color:rgba(237,23,76,.3)}
      .v22-flow-empty{padding:12px;border:1px dashed rgba(255,255,255,.14);border-radius:11px;color:var(--muted,#a8b8c8);line-height:1.45}
      @media(max-width:1050px){.v22-home-grid{grid-template-columns:1fr 1fr}}
      @media(max-width:759px){.v22-today-head{flex-direction:column}.v22-today-facts{grid-template-columns:1fr}.v22-today-actions{display:grid;grid-template-columns:1fr}.v22-today-actions a{min-height:48px;width:100%}.v22-today-source{margin-left:0;text-align:center}.v22-home-guide{padding:14px}.v22-home-guide-head{align-items:flex-start;flex-direction:column}.v22-home-guide-head span{text-align:left}.v22-home-grid{grid-template-columns:1fr}.v22-home-card a{min-height:48px}.v22-home-actions{display:grid;grid-template-columns:1fr}.v22-home-actions a{min-height:48px;width:100%}.v22-home-actions span{margin-left:0;text-align:center}.v22-verification-note a{width:100%;justify-content:center}.v22-gameflow{padding:14px}.v22-gameflow-head{align-items:flex-start;flex-direction:column}.v22-gameflow-head span{text-align:left}.v22-flow-drives{grid-auto-columns:minmax(78vw,1fr)}.v22-flow-play{grid-template-columns:58px minmax(0,1fr);gap:9px}.v22-flow-play b{grid-column:2;width:max-content;white-space:normal}}
      @media(prefers-reduced-motion:reduce){.v22-today-brief *,.v22-home-guide *,.v22-verification-note *,.v22-gameflow *{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
    `;
    document.head.append(style);
  }

  function briefMarkup(game){
    const gameDay=teamDate(Date.now())===teamDate(game.date);
    const kickoff=runtime.formatTeamKickoff?runtime.formatTeamKickoff(game.date):new Date(game.date).toLocaleString();
    const where=game.homeAway==='home'?`Home · ${game.venue||'Nissan Stadium'}`:`Road · ${game.venue||'Venue TBD'}`;
    const gameDayLabel=game.homeAway==='home'?'GAME DAY IN NASHVILLE':'TITANS GAME DAY';
    return `<section class="v22-today-brief" aria-label="Next Titans game fast pass" data-game-id="${esc(game.id||'')}"><div class="v22-today-head"><div><small>${gameDay?gameDayLabel:'NEXT GAME FAST PASS'}</small><h3>${esc(matchup(game))}</h3></div><span class="v22-today-live${gameDay?' game-day':''}">${esc(weekLabel(game))}</span></div><div class="v22-today-facts"><div class="v22-today-fact"><small>WHEN</small><span>${esc(kickoff)} · ${esc(countdown(game.date))}</span></div><div class="v22-today-fact"><small>WATCH / LISTEN</small><span>${esc(game.network||'Network TBD')} · ${esc(TITANS_RADIO)}</span></div><div class="v22-today-fact"><small>WHERE</small><span>${esc(where)}</span></div></div><div class="v22-today-actions"><a href="#media">Open Listen / Watch</a><a href="${OFFICIAL_SCHEDULE}" target="_blank" rel="noopener noreferrer">Official schedule ↗</a>${game.homeAway==='home'?`<a href="${HOME_GAMEDAY}" target="_blank" rel="noopener noreferrer">Stadium guide ↗</a>`:''}<span class="v22-today-source">Schedule facts: TennesseeTitans.com</span></div></section>`;
  }

  function homeGuideMarkup(game){
    if(game?.homeAway!=='home')return'';
    return `<section class="v22-home-guide" aria-label="Nissan Stadium know before you go" data-game-id="${esc(game.id||game.date||'home-game')}"><header class="v22-home-guide-head"><div><small>KNOW BEFORE YOU GO</small><h3>Nissan Stadium home-game essentials</h3></div><span>Quick checks from current official Titans stadium policies. Verify the official guide again before departure.</span></header><div class="v22-home-grid"><article class="v22-home-card"><small>MOBILE ENTRY</small><strong>Open the real ticket before you reach the gate.</strong><p>Titans game tickets are mobile-only. Screenshots and PDF printouts are not accepted for stadium entry.</p><a href="#tickets">Open Tickets →</a></article><article class="v22-home-card"><small>BAG CHECK</small><strong>Skip the bag when you can.</strong><p>Clear bags must be 12 × 12 × 6 inches or smaller. Non-transparent bags must be 4.5 × 6.5 inches or smaller.</p><a href="${CLEAR_BAG_POLICY}" target="_blank" rel="noopener noreferrer">Official bag policy ↗</a></article><article class="v22-home-card"><small>PARK / RIDE</small><strong>Do not arrive expecting a stadium cash lot.</strong><p>Stadium lots require a Titans-issued mobile parking pass. Check current parking, shuttle, rail and rideshare guidance before leaving.</p><a href="${HOME_GAMEDAY}" target="_blank" rel="noopener noreferrer">Parking & transportation ↗</a></article><article class="v22-home-card"><small>PAYMENTS</small><strong>Plan for cashless purchases.</strong><p>Nissan Stadium accepts credit card and mobile payment at vendors, concessions, parking and retail. Cash conversion is available inside.</p><a href="${STADIUM_POLICIES}" target="_blank" rel="noopener noreferrer">Stadium A–Z policies ↗</a></article></div><div class="v22-home-actions"><a href="${STADIUM_MAP}" target="_blank" rel="noopener noreferrer">Stadium map & gates ↗</a><a href="${HOME_GAMEDAY}" target="_blank" rel="noopener noreferrer">Full official gameday guide ↗</a><span>Policy source: TennesseeTitans.com</span></div></section>`;
  }

  function verificationMarkup(game){
    const kickoff=runtime.formatTeamKickoff?runtime.formatTeamKickoff(game.date):new Date(game.date).toLocaleString();
    const where=game.homeAway==='home'?`Home · ${game.venue||'Nissan Stadium'}`:`Road · ${game.venue||'Venue TBD'}`;
    return `<aside class="v22-verification-note" aria-label="Game status verification pending" data-game-id="${esc(game.id||game.date||'game-window')}"><small>GAME WINDOW · VERIFICATION PENDING</small><strong>${esc(matchup(game))}</strong><p>${esc(kickoff)} · ${esc(where)} · ${esc(game.network||'Network TBD')}. Kickoff has passed, but Command Center will not infer a live score, clock, drive, or result until the scoreboard provider confirms game state.</p><a href="${OFFICIAL_SCHEDULE}" target="_blank" rel="noopener noreferrer">Official schedule ↗</a></aside>`;
  }

  function gameRows(rows,game){
    if(!game)return[];
    const target=Date.parse(game.date);
    return (Array.isArray(rows)?rows:[]).filter(row=>{const when=Date.parse(row.kickoff||row.date||0);return Number.isFinite(target)&&Number.isFinite(when)&&Math.abs(when-target)<36*3600000});
  }

  function gameFlowMarkup(game,fan){
    const driveRows=gameRows(fan?.gameDay?.drives,game).slice().sort((a,b)=>(Number(a.drive)||0)-(Number(b.drive)||0)).slice(-6);
    const playRows=gameRows(fan?.gameDay?.plays,game).slice().sort((a,b)=>(Number(a.play)||0)-(Number(b.play)||0)).slice(-8).reverse();
    const drivesMarkup=driveRows.length?driveRows.map((drive,index)=>`<article class="v22-flow-drive" data-current="${index===driveRows.length-1?'true':'false'}"><small>${index===driveRows.length-1?'CURRENT / LATEST DRIVE':`DRIVE ${esc(drive.drive||index+1)}`}</small><strong>${esc(drive.team||'Team')} · ${esc(drive.result||'Result pending')}</strong><span>${drive.plays!=null?`${esc(drive.plays)} plays · `:''}${drive.yards!=null?`${esc(drive.yards)} yards`:''}${drive.start||drive.end?` · ${esc(drive.start||'')} → ${esc(drive.end||'')}`:''}</span></article>`).join(''):'<div class="v22-flow-empty">Drive sequence is not available yet. Gameday will not manufacture drive results.</div>';
    const playsMarkup=playRows.length?playRows.map(play=>{const wpa=num(play.winProbabilityAdded),epa=num(play.epa),impact=Math.abs(wpa||0)>=.08||play.explosive;const context=[play.down?`${play.down}${Number(play.down)===1?'st':Number(play.down)===2?'nd':Number(play.down)===3?'rd':'th'} & ${play.yardsToGo??'?'}`:'',play.yardline||'',play.yards!=null?`${play.yards} yds`:''].filter(Boolean).join(' · ');const metric=wpa!=null?`WPA ${wpa>=0?'+':''}${(wpa*100).toFixed(1)}%`:epa!=null?`EPA ${epa>=0?'+':''}${epa.toFixed(2)}`:play.explosive?'Explosive':'';return `<article class="v22-flow-play" data-impact="${impact?'high':'normal'}"><small>${play.play?`PLAY ${esc(play.play)}`:'PLAY'}</small><div><strong>${esc(play.description||play.type||'Latest play')}</strong>${context?`<p>${esc(context)}</p>`:''}</div>${metric?`<b>${esc(metric)}</b>`:''}</article>`}).join(''):'<div class="v22-flow-empty">Play-by-play is not available yet. No play description is guessed.</div>';
    return `<section class="v22-gameflow" aria-label="Game flow"><header class="v22-gameflow-head"><div><small>GAME FLOW</small><h3>How the game got here</h3></div><span>${driveRows.length} recent drive${driveRows.length===1?'':'s'} · ${playRows.length} recent play${playRows.length===1?'':'s'}</span></header><div class="v22-flow-drives" aria-label="Recent drives">${drivesMarkup}</div><div class="v22-flow-plays" aria-label="Recent plays">${playsMarkup}</div></section>`;
  }

  function mountHomeGuide(phase,game){
    if(!phase)return false;
    phase.querySelector('.v22-home-guide')?.remove();
    if(game?.homeAway!=='home')return false;
    ensureStyle();
    const brief=phase.querySelector('.v22-today-brief'),tune=phase.querySelector('.v16-gd-tune');
    if(brief)brief.insertAdjacentHTML('afterend',homeGuideMarkup(game));
    else if(tune)tune.insertAdjacentHTML('afterend',homeGuideMarkup(game));
    else phase.insertAdjacentHTML('afterbegin',homeGuideMarkup(game));
    return true;
  }

  function applyGameWindow(data){
    if(runtime.route()!=='live')return false;
    const root=app.querySelector('.v16-gameday');
    if(!root)return false;
    const existing=root.querySelector('.v22-verification-note');
    if(root.dataset.phase==='live'){existing?.remove();return false;}
    const games=Array.isArray(data?.games)?data.games:[];
    const focus=runtime.scheduleFocus(games);
    if(focus.state!=='game-window'||!focus.current){existing?.remove();return false;}
    const game=focus.current,id=String(game.id||game.date||'game-window');
    const phase=root.querySelector('.v16-gd-phase');
    if(!phase)return false;
    if(existing?.dataset.gameId===id){mountHomeGuide(phase,game);return true;}
    existing?.remove();
    ensureStyle();
    phase.insertAdjacentHTML('beforebegin',verificationMarkup(game));
    mountHomeGuide(phase,game);
    return true;
  }

  function tagPregamePhase(){
    const root=app.querySelector('.v16-gameday[data-phase="pregame"]');
    const phase=root?.querySelector('.v16-gd-phase:not(.live):not(.post):not(.window)');
    if(phase)phase.classList.add('pregame');
    return phase||null;
  }

  function mountGameFlow(data,fan){
    const root=app.querySelector('.v16-gameday[data-phase="live"]');
    if(!root)return false;
    const focus=runtime.scheduleFocus(Array.isArray(data?.games)?data.games:[]),game=focus.current||focus.game||null;
    const phase=root.querySelector('.v16-gd-phase.live');
    if(!phase||!game)return false;
    ensureStyle();
    phase.querySelector('.v22-home-guide')?.remove();
    phase.querySelector('.v22-gameflow')?.remove();
    phase.insertAdjacentHTML('beforeend',gameFlowMarkup(game,fan));
    return true;
  }

  async function mount(){
    if(runtime.route()!=='live')return;
    const root=app.querySelector('.v16-gameday');
    if(!root)return;
    const liveAtStart=root.dataset.phase==='live';
    const dataPromise=runtime.apiJson('/api/data',{ttl:30000});
    const [data,fan]=liveAtStart
      ?await Promise.all([dataPromise,runtime.apiJson('/api/fan-intel',{ttl:15000})])
      :[await dataPromise,null];
    if(runtime.route()!=='live'||!root.isConnected)return;
    if(root.dataset.phase==='live'){
      if(!liveAtStart){queueMicrotask(mount);return;}
      root.querySelector('.v22-verification-note')?.remove();
      root.querySelector('.v22-today-brief')?.remove();
      root.querySelector('.v22-home-guide')?.remove();
      mountGameFlow(data,fan);
      return;
    }
    root.querySelector('.v22-gameflow')?.remove();
    if(applyGameWindow(data)){
      app.querySelector('.v22-today-brief')?.remove();
      return;
    }
    root.querySelector('.v22-verification-note')?.remove();
    const phase=tagPregamePhase();
    if(!phase)return;
    const existing=phase.querySelector('.v22-today-brief');
    const game=upcoming(Array.isArray(data?.games)?data.games:[]);
    if(!game){existing?.remove();phase.querySelector('.v22-home-guide')?.remove();return;}
    if(existing?.dataset.gameId===String(game.id||'')){mountHomeGuide(phase,game);return;}
    existing?.remove();
    ensureStyle();
    const tune=phase.querySelector('.v16-gd-tune');
    if(tune)tune.insertAdjacentHTML('afterend',briefMarkup(game));
    else phase.querySelector(':scope > header')?.insertAdjacentHTML('afterend',briefMarkup(game));
    mountHomeGuide(phase,game);
  }

  function refreshGameDay(){
    if(runtime.route()!=='live')return;
    queueMicrotask(mount);
  }

  runtime.onAppRender(()=>queueMicrotask(mount),{immediate:true});
  runtime.onRoute(current=>{if(current==='live')queueMicrotask(mount)});
  runtime.onRefresh(refreshGameDay);
})();