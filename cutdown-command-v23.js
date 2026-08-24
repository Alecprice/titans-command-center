(() => {
  'use strict';

  const runtime=window.TitansRuntime;
  if(!runtime)return;

  const DEADLINE='2026-08-30T22:00:00Z';
  const FINAL_LIMIT=53;
  const NFL_SOURCE='https://operations.nfl.com/calendar-events/nfl-important-dates';
  const TITANS_MOVES='https://www.tennesseetitans.com/team/transactions/';
  let data=null,loading=null,timer=null;

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rows=v=>Array.isArray(v)?v:[];
  const route=()=>runtime.route();
  const deadlineMs=()=>Date.parse(DEADLINE);
  const remaining=()=>{
    const diff=deadlineMs()-Date.now();
    if(diff<=0)return 'Deadline reached';
    const mins=Math.max(1,Math.floor(diff/60000));
    const days=Math.floor(mins/1440),hours=Math.floor((mins%1440)/60),m=mins%60;
    return days?`${days}d ${hours}h`:hours?`${hours}h ${m}m`:`${m}m`;
  };
  const deadlineLabel=()=>new Intl.DateTimeFormat('en-US',{
    weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',
    timeZone:'America/New_York',timeZoneName:'short'
  }).format(new Date(DEADLINE));

  async function load(force=false){
    if(data&&!force)return data;
    if(loading)return loading;
    loading=runtime.apiJson('/api/data',{ttl:30000,force}).then(value=>{if(value?.ok)data=value;return data;}).finally(()=>loading=null);
    return loading;
  }

  function snapshot(){
    const roster=rows(data?.roster);
    const active=roster.filter(p=>String(p.status||'').toLowerCase()==='active');
    const reserve=roster.filter(p=>String(p.status||'').toLowerCase()!=='active');
    const byPosition=new Map();
    for(const p of active){
      const key=String(p.position||'Other').trim()||'Other';
      byPosition.set(key,(byPosition.get(key)||0)+1);
    }
    const positions=[...byPosition.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
    const transactions=rows(data?.transactions).slice(0,6);
    return {roster,active,reserve,positions,transactions,over:Math.max(0,active.length-FINAL_LIMIT)};
  }

  function movementList(items){
    if(!items.length)return '<div class="cutdown-empty">No current transaction rows are loaded.</div>';
    return `<div class="cutdown-moves">${items.map(item=>`<article><small>${esc(String(item.date||'').slice(0,10)||'Date pending')}</small><p>${esc(item.description||item.type||'Roster transaction')}</p></article>`).join('')}</div>`;
  }

  function positionGrid(positions){
    if(!positions.length)return '<div class="cutdown-empty">Position counts are unavailable.</div>';
    return `<div class="cutdown-position-grid">${positions.map(([position,count])=>`<div><strong>${esc(count)}</strong><span>${esc(position)}</span></div>`).join('')}</div>`;
  }

  function rosterPanel(){
    const s=snapshot(),past=Date.now()>=deadlineMs();
    return `<div class="cutdown-command" data-cutdown-command>
      <header class="cutdown-command-head">
        <div><small>53-MAN CUTDOWN COMMAND</small><h2>${past?'Deadline tracker':'Final roster clock'}</h2><p>Facts from the loaded Titans roster and transaction feed. This does <strong>not</strong> rank bubble players or predict cuts.</p></div>
        <div class="cutdown-clock"><small>${past?'LEAGUE DEADLINE':'TIME REMAINING'}</small><strong>${esc(remaining())}</strong><span>${esc(deadlineLabel())}</span></div>
      </header>
      <div class="cutdown-scoreboard">
        <article><small>Loaded roster</small><strong>${s.roster.length||'—'}</strong><span>All current rows</span></article>
        <article><small>Active rows</small><strong>${s.active.length||'—'}</strong><span>Loaded status = Active</span></article>
        <article><small>Reserve / other</small><strong>${s.reserve.length}</strong><span>Not counted as active rows here</span></article>
        <article><small>Final active limit</small><strong>${FINAL_LIMIT}</strong><span>${s.over?`${s.over} loaded active rows above 53`:'Loaded active count is at or below 53'}</span></article>
      </div>
      <div class="cutdown-grid">
        <section><div class="cutdown-section-head"><div><small>POSITION SHAPE</small><h3>Active rows by position</h3></div><a href="#roster">Full roster →</a></div>${positionGrid(s.positions)}</section>
        <section><div class="cutdown-section-head"><div><small>MOVEMENT WIRE</small><h3>Latest loaded transactions</h3></div><a href="#transactions">All moves →</a></div>${movementList(s.transactions)}</section>
      </div>
      <footer class="cutdown-sources"><p>The NFL limit applies to the Active/Inactive List. Reserve, exempt, waiver and other roster mechanics can change how a club reaches 53, so “rows above 53” is not the same thing as “cuts required.”</p><div><a href="${NFL_SOURCE}" target="_blank" rel="noopener noreferrer">NFL roster deadline ↗</a><a href="${TITANS_MOVES}" target="_blank" rel="noopener noreferrer">Official Titans transactions ↗</a></div></footer>
    </div>`;
  }

  function homeCard(){
    const s=snapshot(),past=Date.now()>=deadlineMs();
    return `<section class="cutdown-home-card" data-cutdown-home>
      <div><small>${past?'ROSTER CUTDOWN':'CUTDOWN CLOCK'}</small><strong>${past?'Track the official 53-man moves':`${esc(remaining())} to the 53-man deadline`}</strong><span>${s.active.length||'—'} loaded active · ${s.reserve.length} reserve/other · ${esc(deadlineLabel())}</span></div>
      <a href="#roster?view=cutdown">Open Cutdown Command →</a>
    </section>`;
  }

  function mountHome(){
    const app=document.querySelector('#app');
    if(!app||route()!=='home'||app.querySelector('[data-cutdown-home]'))return;
    const anchor=app.querySelector('.pulse-ribbon');
    if(!anchor)return;
    anchor.insertAdjacentHTML('afterend',homeCard());
  }

  function mountRoster(){
    const app=document.querySelector('#app');
    if(!app||route()!=='roster')return false;
    const switcher=app.querySelector('.team-room-switcher');
    const panel=app.querySelector('.team-room-panel[data-panel="cutdown"]');
    if(!switcher||!panel)return false;
    panel.innerHTML=rosterPanel();
    if(new URLSearchParams(location.hash.split('?')[1]||'').get('view')==='cutdown'){
      const button=switcher.querySelector('[data-team-room-view="cutdown"]');
      if(button&&button.getAttribute('aria-pressed')!=='true')button.click();
    }
    return true;
  }

  async function mount(){
    if(!['home','roster'].includes(route()))return;
    await load();
    if(!data)return;
    if(route()==='home')mountHome();
    if(route()==='roster'&&!mountRoster())setTimeout(mountRoster,0);
  }

  function refreshClock(){
    const home=document.querySelector('[data-cutdown-home]');
    const panel=document.querySelector('[data-cutdown-command]');
    if((home||panel)&&data){
      if(route()==='home'){home?.remove();mountHome();}
      if(route()==='roster')mountRoster();
    }
  }

  runtime.onAppRender(()=>queueMicrotask(mount),{immediate:true});
  runtime.onRoute(()=>queueMicrotask(mount));
  runtime.onRefresh(()=>{data=null;load(true).then(()=>refreshClock());});
  timer=setInterval(refreshClock,60000);
  addEventListener('pagehide',()=>{if(timer)clearInterval(timer);},{once:true});
})();