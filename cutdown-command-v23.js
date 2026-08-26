(() => {
  'use strict';

  const runtime=window.TitansRuntime;
  if(!runtime)return;

  const DEADLINE='2026-08-30T22:00:00Z';
  const FINAL_LIMIT=53;
  const NFL_SOURCE='https://operations.nfl.com/calendar-events/nfl-important-dates';
  const TITANS_MOVES='https://www.tennesseetitans.com/team/transactions/';
  const MY53_STORE='titans:my53:v1';
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

  const playerKey=p=>String(p?.id||p?.name||'').trim();
  function loadMy53(roster){
    const valid=new Set(rows(roster).map(playerKey).filter(Boolean));
    const stored=runtime.storage.getJSON(MY53_STORE,[]);
    const list=Array.isArray(stored)?stored:[];
    return new Set(list.map(String).filter(key=>valid.has(key)).slice(0,FINAL_LIMIT));
  }
  function saveMy53(selection){
    const list=[...selection].slice(0,FINAL_LIMIT);
    return runtime.storage.setJSON(MY53_STORE,list);
  }
  function my53PositionShape(roster,selection){
    const counts=new Map();
    for(const player of roster){
      if(!selection.has(playerKey(player)))continue;
      const position=String(player.position||'Other').trim()||'Other';
      counts.set(position,(counts.get(position)||0)+1);
    }
    return [...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
  }
  function my53Markup(roster){
    const active=rows(roster).filter(p=>String(p.status||'').toLowerCase()==='active');
    return `<section class="my53-builder" data-my53>
      <div class="my53-head">
        <div><small>MY 53 · FAN BOARD</small><h3>Build your own Titans 53</h3><p>Your picks stay on this device. This is a fan roster exercise—not an official roster projection or report.</p></div>
        <div class="my53-count"><strong data-my53-count>0 / 53</strong><button type="button" data-my53-clear>Clear picks</button></div>
      </div>
      <div class="my53-shape" data-my53-shape aria-live="polite"></div>
      <div class="my53-list" role="group" aria-label="Choose players for My 53">
        ${active.map(player=>`<button type="button" class="my53-player" data-my53-player="${esc(playerKey(player))}" aria-pressed="false"><span class="my53-number">#${esc(player.number||'—')}</span><span><b>${esc(player.name)}</b><small>${esc(player.position||'')} · ${esc(player.unit||'')}</small></span><i aria-hidden="true">+</i></button>`).join('')}
      </div>
      <p class="my53-note" data-my53-note>Pick up to 53 loaded active players. No selection changes the official roster or synced account settings.</p>
    </section>`;
  }
  function wireMy53(panel,roster){
    const root=panel.querySelector('[data-my53]');
    if(!root)return;
    let selection=loadMy53(roster);
    const count=root.querySelector('[data-my53-count]');
    const shape=root.querySelector('[data-my53-shape]');
    const note=root.querySelector('[data-my53-note]');
    const buttons=[...root.querySelectorAll('[data-my53-player]')];

    const paint=message=>{
      for(const button of buttons){
        const on=selection.has(button.dataset.my53Player);
        button.setAttribute('aria-pressed',String(on));
        button.classList.toggle('selected',on);
        const icon=button.querySelector('i');if(icon)icon.textContent=on?'✓':'+';
      }
      if(count)count.textContent=`${selection.size} / ${FINAL_LIMIT}`;
      const positions=my53PositionShape(roster,selection);
      if(shape)shape.innerHTML=positions.length
        ?positions.map(([position,total])=>`<span><b>${esc(total)}</b> ${esc(position)}</span>`).join('')
        :'<span>No fan picks yet.</span>';
      if(note&&message)note.textContent=message;
    };

    root.addEventListener('click',event=>{
      const button=event.target.closest('[data-my53-player]');
      if(button){
        const key=button.dataset.my53Player;
        if(selection.has(key)){selection.delete(key);saveMy53(selection);paint('Pick removed. Your fan board stays on this device.');return;}
        if(selection.size>=FINAL_LIMIT){paint('Your My 53 is full. Remove a player before adding another.');return;}
        selection.add(key);
        if(!saveMy53(selection)){selection.delete(key);paint('This browser could not save that pick. Nothing changed.');return;}
        paint(selection.size===FINAL_LIMIT?'Your fan-made 53 is full.':'Pick saved on this device.');
        return;
      }
      if(event.target.closest('[data-my53-clear]')){
        selection=new Set();
        runtime.storage.remove(MY53_STORE);
        paint('My 53 cleared on this device.');
      }
    });
    paint();
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
      ${my53Markup(s.roster)}
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
    const panel=app.querySelector('.team-room-panel[data-panel="cutdown"]');
    if(!panel)return false;
    panel.innerHTML=rosterPanel();
    wireMy53(panel,snapshot().roster);
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