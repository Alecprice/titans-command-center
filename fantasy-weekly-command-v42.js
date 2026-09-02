(() => {
  'use strict';
  if(globalThis.__titansFantasyWeeklyV42)return;
  globalThis.__titansFantasyWeeklyV42=true;

  const ROUTE='fantasy';
  const STORE='titans-fantasy-v1';
  const runtime=window.TitansRuntime;
  let data=null,intel=null,loading=null;

  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const norm=value=>String(value??'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const readState=()=>{try{const value=JSON.parse(localStorage.getItem(STORE)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}catch{return{}}};
  const fantasyPlayer=player=>['QB','RB','FB','WR','TE','K'].includes(String(player?.position||'').toUpperCase());
  const injuryName=row=>row?.playerName||row?.player_name||row?.name||row?.athleteName||row?.athlete_name||'';
  const injuryStatus=row=>row?.reportStatus||row?.practiceStatus||row?.status||row?.designation||row?.primaryInjury||row?.injury||'Report row loaded';
  const sleeperKey=state=>{const username=String(state?.sleeperUser||'').trim().toLowerCase(),leagueId=String(state?.leagueId||'').trim();return username&&/^\d{6,32}$/.test(leagueId)?`${username}|${leagueId}`:''};

  function rosterContextState(saved){
    const key=sleeperKey(saved);
    if(!key)return {status:'none',starters:null,bench:null};
    const context=window.TitansFantasyRosterContext;
    if(!context||context.connectionKey!==key)return {status:'pending',starters:null,bench:null};
    if(context.matched!==true)return {status:'unmatched',starters:null,bench:null};
    const starters=Number(context.starterCount),bench=Number(context.benchCount);
    if(!Number.isFinite(starters)||starters<0||!Number.isFinite(bench)||bench<0)return {status:'pending',starters:null,bench:null};
    return {status:'matched',starters,bench};
  }

  function ensureStyle(){
    if(document.querySelector('style[data-fantasy-weekly-v42]'))return;
    const style=document.createElement('style');
    style.dataset.fantasyWeeklyV42='true';
    style.textContent=`
      .fantasy-weekly-v42{margin:0 0 16px;padding:18px;border:1px solid rgba(126,199,255,.42);border-radius:20px;background:linear-gradient(135deg,rgba(16,48,80,.98),rgba(7,24,42,.98));color:#fff;box-shadow:0 14px 36px rgba(0,0,0,.18)}
      .fw42-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:14px}.fw42-head small{display:block;color:#a8d6ff;font-size:.78rem;font-weight:950;letter-spacing:.14em}.fw42-head h2{margin:.2rem 0 .3rem;font-size:clamp(1.35rem,4vw,2rem)}.fw42-head p{margin:0;color:#d9e8f5;line-height:1.55;font-size:.96rem;max-width:720px}.fw42-week{flex:0 0 auto;padding:8px 11px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:rgba(255,255,255,.08);font-size:.82rem;font-weight:900;color:#fff}
      .fw42-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.fw42-card{min-width:0;padding:13px;border:1px solid rgba(255,255,255,.14);border-radius:14px;background:rgba(255,255,255,.065)}.fw42-card small,.fw42-card strong,.fw42-card span{display:block}.fw42-card small{color:#add8ff;font-size:.75rem;font-weight:900;letter-spacing:.08em}.fw42-card strong{margin-top:4px;font-size:1rem;line-height:1.3}.fw42-card span{margin-top:4px;color:#d4e5f4;font-size:.88rem;line-height:1.45}.fw42-watch{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.fw42-watch span{margin:0;padding:5px 8px;border-radius:999px;background:rgba(200,16,46,.24);border:1px solid rgba(255,128,147,.42);color:#fff;font-size:.78rem}
      .fw42-actions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:12px}.fw42-actions button{min-height:46px;border:1px solid rgba(160,211,255,.5);border-radius:11px;background:#0c2947;color:#fff;font:inherit;font-weight:900;cursor:pointer;padding:8px 10px}.fw42-actions button:first-child{background:#4b92db;color:#061321;border-color:#8bcbff}.fw42-actions button:focus-visible{outline:3px solid #fff;outline-offset:3px}
      .fantasy-head p,.fantasy-panel p,.fantasy-impact-list span,.fantasy-player span,.fantasy-calc label,.fantasy-add input,.fantasy-add select,.fantasy-connect input,.fantasy-select,.fantasy-lineup-row span,.fantasy-matchup span,.fantasy-draft-board small,.fantasy-empty,.fantasy-disclaimer{color:#cfe0ef}.fantasy-panel-head a,.fantasy-panel-head span,.fantasy-decision-links a{color:#a9d6ff}.fsi-note,.fsi-player span,.fsi-attribution{color:#c8dbea!important}.fsi-player em{color:#a9d8ff!important}.fdc-note{opacity:1!important;color:#cbddec!important}
      @media(max-width:820px){.fw42-grid{grid-template-columns:1fr 1fr}.fw42-card:first-child{grid-column:1/-1}.fw42-actions{grid-template-columns:1fr 1fr}}
      @media(max-width:560px){.fantasy-weekly-v42{padding:14px;border-radius:16px}.fw42-head{display:block}.fw42-week{display:inline-flex;margin-top:10px}.fw42-grid,.fw42-actions{grid-template-columns:1fr}.fw42-card:first-child{grid-column:auto}.fw42-card{padding:12px}.fw42-actions button{min-height:48px;font-size:.95rem}.fw42-head p,.fw42-card span{font-size:.92rem}}
      @media(prefers-contrast:more){.fantasy-weekly-v42,.fw42-card,.fw42-actions button{border-color:#fff}.fw42-head p,.fw42-card span,.fantasy-head p,.fantasy-panel p,.fantasy-empty,.fantasy-disclaimer{color:#fff}}
    `;
    document.head.append(style);
  }

  async function load(){
    if(data&&intel)return {data,intel};
    if(loading)return loading;
    const calls=runtime?[
      runtime.apiJson('/api/data',{ttl:30000}),
      runtime.apiJson('/api/fan-intel',{ttl:30000})
    ]:[
      fetch('/api/data',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null),
      fetch('/api/fan-intel',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)
    ];
    loading=Promise.all(calls).then(([base,fan])=>{data=base?.ok?base:null;intel=fan?.ok?fan:null;return {data,intel}}).finally(()=>loading=null);
    return loading;
  }

  function nextGame(){
    const games=data?.games||[];
    if(typeof runtime?.scheduleFocus==='function')return runtime.scheduleFocus(games,new Date())?.next||null;
    const now=Date.now();
    return games.map(game=>({game,at:Date.parse(game?.date)})).filter(row=>Number.isFinite(row.at)&&row.at>now&&!/final|bye/i.test(String(row.game?.status||''))).sort((a,b)=>a.at-b.at)[0]?.game||null;
  }
  function gameTime(game){
    const date=new Date(game?.date);if(Number.isNaN(date.getTime()))return 'Kickoff TBD';
    return new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(date);
  }
  function latestMove(){
    const rows=Array.isArray(data?.transactions)?data.transactions:[];
    if(typeof runtime?.latestTransaction==='function')return runtime.latestTransaction(rows);
    return rows.map((move,index)=>{const raw=String(move?.date||'').trim(),time=raw?new Date(raw).getTime():Number.NaN;return {move,index,time}}).filter(row=>Number.isFinite(row.time)).sort((a,b)=>b.time-a.time||a.index-b.index)[0]?.move||null;
  }
  function availabilityWatch(){
    const roster=(data?.roster||[]).filter(fantasyPlayer),byName=new Map(roster.map(player=>[norm(player.name),player]));
    const rows=[];
    for(const row of intel?.injuries||[]){const player=byName.get(norm(injuryName(row)));if(!player)continue;rows.push({player,status:injuryStatus(row)});if(rows.length>=3)break;}
    return rows;
  }
  function stateSummary(){
    const saved=readState(),manual=Array.isArray(saved.manual)?saved.manual:[],roster=rosterContextState(saved);
    return {week:Number.isInteger(saved.week)&&saved.week>=1&&saved.week<=18?saved.week:1,starters:manual.filter(player=>player?.slot==='starter').length,bench:manual.filter(player=>player?.slot==='bench').length,watch:manual.filter(player=>player?.slot==='watch').length,sleeper:Boolean(sleeperKey(saved)),roster};
  }
  function workspaceCopy(state,moveText){
    const latest=`Latest Titans move: ${esc(String(moveText).slice(0,120))}`;
    if(state.roster.status==='matched')return {title:'Sleeper roster matched',detail:`${state.roster.starters} starters · ${state.roster.bench} bench from Sleeper · ${state.watch} manual watchlist. ${latest}`};
    if(state.roster.status==='unmatched')return {title:'Sleeper roster not matched',detail:`The connected user is not matched to a roster in the selected league. Manual board: ${state.starters} starters · ${state.bench} bench · ${state.watch} watchlist. ${latest}`};
    if(state.sleeper)return {title:'Sleeper league connected',detail:`Sleeper roster counts appear after the read-only roster match finishes. Manual board: ${state.starters} starters · ${state.bench} bench · ${state.watch} watchlist. ${latest}`};
    return {title:'Manual board ready',detail:`${state.starters} starters · ${state.bench} bench · ${state.watch} watchlist. ${latest}`};
  }
  function markup(){
    const game=nextGame(),watch=availabilityWatch(),state=stateSummary(),move=latestMove();
    const gameName=game?`${game.homeAway==='home'?'vs':'at'} ${game.opponent||game.opponentAbbr||'Opponent'}`:'Next game not loaded';
    const moveText=move?.description||'No dated roster move is loaded.';
    const workspace=workspaceCopy(state,moveText);
    return `<section class="fantasy-weekly-v42" data-fantasy-weekly-v42>
      <div class="fw42-head"><div><small>FANTASY THIS WEEK</small><h2>Decisions first. Tools second.</h2><p>Verified Titans context for your lineup workflow. This card does not create projections or pretend an empty feed means a player is cleared.</p></div><span class="fw42-week">Selected week ${state.week}</span></div>
      <div class="fw42-grid">
        <article class="fw42-card"><small>NEXT TITANS GAME</small><strong>${esc(gameName)}</strong><span>${esc(game?`${gameTime(game)} · ${game.network||'TV TBD'}`:'Schedule context is unavailable right now.')}</span></article>
        <article class="fw42-card"><small>AVAILABILITY WATCH</small><strong>${watch.length?`${watch.length} fantasy-relevant report row${watch.length===1?'':'s'}`:'No matching injury rows loaded'}</strong><span>${watch.length?'Review the exact report statuses before lineup lock.':'No matching row here is not medical clearance.'}</span>${watch.length?`<div class="fw42-watch">${watch.map(item=>`<span>${esc(item.player.name)} · ${esc(item.status)}</span>`).join('')}</div>`:''}</article>
        <article class="fw42-card"><small>YOUR WORKSPACE</small><strong>${workspace.title}</strong><span>${workspace.detail}</span></article>
      </div>
      <div class="fw42-actions" aria-label="Fantasy quick actions"><button type="button" data-fw42-tab="my">My lineup</button><button type="button" data-fw42-startsit>Start / Sit</button><button type="button" data-fw42-tab="sleeper">Sleeper</button><button type="button" data-fw42-calc>Points calculator</button></div>
    </section>`;
  }

  async function mount(){
    if(route()!==ROUTE)return;
    const root=document.querySelector('#app'),tabs=root?.querySelector('.fantasy-tabs');
    if(!root||!tabs||root.querySelector('[data-fantasy-weekly-v42]'))return;
    ensureStyle();await load();
    if(route()!==ROUTE||!tabs.isConnected||root.querySelector('[data-fantasy-weekly-v42]'))return;
    tabs.insertAdjacentHTML('afterend',markup());
  }

  function openTab(name){const button=document.querySelector(`[data-ftab="${name}"]`);button?.click();}
  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;if(!target||route()!==ROUTE)return;
    const tab=target.closest('[data-fw42-tab]')?.dataset.fw42Tab;if(tab){openTab(tab);return;}
    if(target.closest('[data-fw42-calc]')){openTab('lab');requestAnimationFrame(()=>document.querySelector('#fantasy-calc')?.scrollIntoView({block:'center',behavior:'smooth'}));return;}
    if(target.closest('[data-fw42-startsit]')){const decision=document.querySelector('[data-fantasy-decision]');if(decision)decision.scrollIntoView({block:'start',behavior:'smooth'});else{openTab('my');requestAnimationFrame(()=>document.querySelector('[data-fantasy-decision]')?.scrollIntoView({block:'start',behavior:'smooth'}));}}
  });

  const rerender=()=>{document.querySelector('[data-fantasy-weekly-v42]')?.remove();queueMicrotask(mount)};
  const refresh=()=>{data=null;intel=null;loading=null;rerender()};
  if(runtime){runtime.onRoute(()=>queueMicrotask(mount));runtime.onAppRender(()=>queueMicrotask(mount));runtime.onRefresh(refresh);}
  else {addEventListener('hashchange',()=>queueMicrotask(mount));const app=document.querySelector('#app');if(app)new MutationObserver(()=>queueMicrotask(mount)).observe(app,{childList:true});}
  addEventListener('titans:fantasy-roster-context',rerender);
  addEventListener('titans:preferences-synced',refresh);
  addEventListener('titans:preferences-imported',refresh);
  queueMicrotask(mount);
})();