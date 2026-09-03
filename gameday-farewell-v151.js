(() => {
  'use strict';

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!runtime||!app)return;

  const NEW_STADIUM='https://www.tennesseetitans.com/new-stadium/';
  const OFFICIAL_SCHEDULE='https://www.tennesseetitans.com/schedule/';
  const SEASON=2026;

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const weekNumber=game=>Number.isInteger(Number(game?.week))?Number(game.week):null;
  const validKickoff=game=>Number.isFinite(Date.parse(game?.date||''));
  const teamDay=value=>{
    const date=new Date(value);
    if(Number.isNaN(date.getTime()))return'';
    const parts=new Intl.DateTimeFormat('en-US',{timeZone:runtime.teamTimeZone||'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
    const part=type=>parts.find(item=>item.type===type)?.value||'';
    return `${part('year')}-${part('month')}-${part('day')}`;
  };
  const shortDate=value=>{
    const date=new Date(value);
    if(Number.isNaN(date.getTime()))return'Date TBD';
    return new Intl.DateTimeFormat('en-US',{timeZone:runtime.teamTimeZone||'America/Chicago',month:'short',day:'numeric',year:'numeric'}).format(date);
  };

  function ensureStyle(){
    if(document.querySelector('#gameday-farewell-v151-style'))return;
    const style=document.createElement('style');
    style.id='gameday-farewell-v151-style';
    style.textContent=`
      .v151-farewell{margin:16px 0;padding:18px;border:1px solid rgba(75,146,219,.4);border-radius:16px;background:linear-gradient(135deg,rgba(12,35,64,.96),rgba(75,146,219,.13) 58%,rgba(237,23,76,.08));display:grid;gap:14px;overflow:hidden;position:relative}
      .v151-farewell::before{content:"";position:absolute;inset:0 auto 0 0;width:4px;background:linear-gradient(180deg,#4b92db,#fff,#ed174c);opacity:.86}
      .v151-farewell-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}.v151-farewell-head small,.v151-farewell-fact small{font-size:.7rem;letter-spacing:.11em;text-transform:uppercase;color:#8fc8ff;font-weight:900}.v151-farewell-head h3{margin:4px 0 0;font-size:clamp(1.2rem,2.9vw,1.65rem);line-height:1.18}.v151-farewell-head p{margin:7px 0 0;color:var(--muted,#a8b8c8);line-height:1.5;max-width:720px}.v151-farewell-badge{padding:7px 10px;border-radius:999px;border:1px solid rgba(237,23,76,.38);background:rgba(237,23,76,.12);font-size:.72rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
      .v151-farewell-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.v151-farewell-fact{padding:12px;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:rgba(0,0,0,.13);display:grid;gap:6px}.v151-farewell-fact strong{font-size:.94rem;line-height:1.4}.v151-farewell-fact span{font-size:.78rem;color:var(--muted,#a8b8c8);line-height:1.4}
      .v151-farewell-actions{display:flex;gap:9px;flex-wrap:wrap;align-items:center}.v151-farewell-actions a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 13px;border:1px solid rgba(75,146,219,.4);border-radius:999px;color:#8fc8ff;font-weight:900;text-decoration:none}.v151-farewell-actions a:first-child{background:#4b92db;color:#071629;border-color:#4b92db}.v151-farewell-actions span{margin-left:auto;color:var(--muted,#a8b8c8);font-size:.75rem}
      @media(max-width:759px){.v151-farewell{padding:15px}.v151-farewell-head{flex-direction:column}.v151-farewell-facts{grid-template-columns:1fr}.v151-farewell-actions{display:grid;grid-template-columns:1fr}.v151-farewell-actions a{min-height:48px;width:100%}.v151-farewell-actions span{margin-left:0;text-align:center}}
      @media(prefers-reduced-motion:reduce){.v151-farewell *{animation:none!important;transition:none!important}}
    `;
    document.head.append(style);
  }

  function seasonContext(data){
    if(Number(data?.team?.season)!==SEASON)return null;
    const games=Array.isArray(data?.games)?data.games:[];
    const regular=games.filter(game=>{
      const week=weekNumber(game);
      return week!==null&&week>=1&&week<=18&&game?.homeAway!=='bye'&&String(game?.opponent||'').toUpperCase()!=='BYE';
    });
    const home=regular.filter(game=>game?.homeAway==='home');
    const completeSchedule=regular.length>=17&&home.length>=8&&home.length<=9&&home.every(validKickoff);
    if(!completeSchedule)return {completeSchedule:false};

    const ordered=home.slice().sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
    const today=teamDay(Date.now());
    const remaining=ordered.filter(game=>teamDay(game.date)>=today);
    return {
      completeSchedule:true,
      homeTotal:ordered.length,
      remaining,
      nextHome:remaining[0]||null,
      finalHome:ordered[ordered.length-1]||null
    };
  }

  function dynamicFacts(context){
    if(!context?.completeSchedule)return'';
    const remaining=context.remaining.length;
    const remainingCopy=remaining===0?'The 2026 regular-season home slate is complete.':`${remaining} scheduled regular-season home date${remaining===1?'':'s'} remain${remaining===1?'s':''}.`;
    const next=context.nextHome;
    const final=context.finalHome;
    return `<div class="v151-farewell-facts"><article class="v151-farewell-fact"><small>HOME DATES</small><strong>${esc(remainingCopy)}</strong><span>Derived from the current Command Center schedule feed.</span></article>${next?`<article class="v151-farewell-fact"><small>NEXT AT NISSAN</small><strong>vs. ${esc(next.opponent||'Opponent')}</strong><span>${esc(shortDate(next.date))}</span></article>`:'<article class="v151-farewell-fact"><small>HOME SLATE</small><strong>Regular-season dates complete</strong><span>Postseason games are not assumed.</span></article>'}${final?`<article class="v151-farewell-fact"><small>FINAL SCHEDULED HOME DATE</small><strong>vs. ${esc(final.opponent||'Opponent')}</strong><span>${esc(shortDate(final.date))}</span></article>`:''}</div>`;
  }

  function markup(data){
    const context=seasonContext(data);
    if(!context)return'';
    return `<section class="v151-farewell" aria-label="2026 Nissan Stadium Farewell Season"><header class="v151-farewell-head"><div><small>NISSAN STADIUM · 2026 FAREWELL SEASON</small><h3>One final regular season at the current Nissan Stadium.</h3><p>The Titans are recognizing 2026 as the Farewell Season at the current stadium. The New Nissan Stadium is scheduled to open in 2027.</p></div><span class="v151-farewell-badge">FINAL SEASON</span></header>${dynamicFacts(context)}<div class="v151-farewell-actions"><a href="${NEW_STADIUM}" target="_blank" rel="noopener noreferrer">Explore the New Nissan Stadium ↗</a><a href="${OFFICIAL_SCHEDULE}" target="_blank" rel="noopener noreferrer">Verify official schedule ↗</a><span>Farewell / stadium facts: TennesseeTitans.com</span></div></section>`;
  }

  function place(root,node){
    const homeGuide=root.querySelector('.v22-home-guide');
    const brief=root.querySelector('.v22-today-brief');
    const phase=root.querySelector('.v16-gd-phase');
    if(homeGuide)homeGuide.insertAdjacentElement('afterend',node);
    else if(brief)brief.insertAdjacentElement('afterend',node);
    else if(phase)phase.insertAdjacentElement('afterend',node);
    else root.append(node);
  }

  async function mount(){
    if(runtime.route()!=='live')return;
    const root=app.querySelector('.v16-gameday');
    if(!root)return;
    if(root.dataset.phase==='live'){
      root.querySelector('.v151-farewell')?.remove();
      return;
    }
    const data=await runtime.apiJson('/api/data',{ttl:30000});
    if(runtime.route()!=='live'||!root.isConnected)return;
    const html=markup(data);
    const existing=root.querySelector('.v151-farewell');
    if(!html){existing?.remove();return;}
    ensureStyle();
    const shell=document.createElement('div');
    shell.innerHTML=html;
    const node=shell.firstElementChild;
    if(!node)return;
    existing?.remove();
    place(root,node);
  }

  const queueMount=()=>queueMicrotask(mount);
  runtime.onAppRender(queueMount,{immediate:true});
  runtime.onRoute(current=>{if(current==='live')queueMount()});
  runtime.onRefresh(refresh=>{
    const targets=Array.isArray(refresh?.targets)?refresh.targets:[];
    if(!targets.length||targets.includes('/api/data'))queueMount();
  });
})();
