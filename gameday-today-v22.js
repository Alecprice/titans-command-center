(() => {
  'use strict';

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!runtime||!app)return;

  const OFFICIAL_SCHEDULE='https://www.tennesseetitans.com/schedule/';
  const HOME_GAMEDAY='https://www.tennesseetitans.com/stadium/gameday/';
  const TITANS_RADIO='WGFX 104.5 FM The Zone';

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
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
  const upcoming=games=>games
    .filter(game=>{
      const kickoff=Date.parse(game?.date);
      return Number.isFinite(kickoff)&&kickoff>Date.now()&&!/final|bye/i.test(String(game?.status||''));
    })
    .sort((a,b)=>Date.parse(a.date)-Date.parse(b.date))[0]||null;

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
      @media(max-width:759px){.v22-today-head{flex-direction:column}.v22-today-facts{grid-template-columns:1fr}.v22-today-actions{display:grid;grid-template-columns:1fr}.v22-today-actions a{min-height:48px;width:100%}.v22-today-source{margin-left:0;text-align:center}}
      @media(prefers-reduced-motion:reduce){.v22-today-brief *{animation:none!important;transition:none!important}}
    `;
    document.head.append(style);
  }

  function briefMarkup(game){
    const gameDay=teamDate(Date.now())===teamDate(game.date);
    const kickoff=runtime.formatTeamKickoff?runtime.formatTeamKickoff(game.date):new Date(game.date).toLocaleString();
    const where=game.homeAway==='home'?`Home · ${game.venue||'Nissan Stadium'}`:`Road · ${game.venue||'Venue TBD'}`;
    return `<section class="v22-today-brief" aria-label="Next Titans game fast pass" data-game-id="${esc(game.id||'')}"><div class="v22-today-head"><div><small>${gameDay?'GAME DAY IN NASHVILLE':'NEXT GAME FAST PASS'}</small><h3>${esc(matchup(game))}</h3></div><span class="v22-today-live${gameDay?' game-day':''}">${esc(weekLabel(game))}</span></div><div class="v22-today-facts"><div class="v22-today-fact"><small>WHEN</small><span>${esc(kickoff)} · ${esc(countdown(game.date))}</span></div><div class="v22-today-fact"><small>WATCH / LISTEN</small><span>${esc(game.network||'Network TBD')} · ${esc(TITANS_RADIO)}</span></div><div class="v22-today-fact"><small>WHERE</small><span>${esc(where)}</span></div></div><div class="v22-today-actions"><a href="#media">Open Listen / Watch</a><a href="${OFFICIAL_SCHEDULE}" target="_blank" rel="noopener noreferrer">Official schedule ↗</a>${game.homeAway==='home'?`<a href="${HOME_GAMEDAY}" target="_blank" rel="noopener noreferrer">Stadium guide ↗</a>`:''}<span class="v22-today-source">Schedule facts: TennesseeTitans.com</span></div></section>`;
  }

  async function mount(){
    if(runtime.route()!=='live')return;
    const phase=app.querySelector('.v16-gd-phase:not(.live):not(.post)');
    if(!phase)return;
    const existing=phase.querySelector('.v22-today-brief');
    const data=await runtime.apiJson('/api/data',{ttl:30000});
    if(runtime.route()!=='live'||!phase.isConnected)return;
    const game=upcoming(Array.isArray(data?.games)?data.games:[]);
    if(!game){existing?.remove();return;}
    if(existing?.dataset.gameId===String(game.id||''))return;
    existing?.remove();
    ensureStyle();
    const tune=phase.querySelector('.v16-gd-tune');
    if(tune)tune.insertAdjacentHTML('afterend',briefMarkup(game));
    else phase.querySelector(':scope > header')?.insertAdjacentHTML('afterend',briefMarkup(game));
  }

  runtime.onAppRender(()=>queueMicrotask(mount),{immediate:true});
  runtime.onRoute(current=>{if(current==='live')queueMicrotask(mount)});
  runtime.onRefresh(()=>{if(runtime.route()==='live')queueMicrotask(mount)});
})();
