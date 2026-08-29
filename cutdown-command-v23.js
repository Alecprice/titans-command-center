(() => {
  'use strict';

  const runtime=window.TitansRuntime;
  if(!runtime)return;

  const DEADLINE='2026-08-30T22:00:00Z';
  const FINAL_LIMIT=53;
  const NFL_SOURCE='https://operations.nfl.com/calendar-events/nfl-important-dates';
  const TITANS_MOVES='https://www.tennesseetitans.com/team/transactions/';
  const MY53_STORE='titans:my53:v1';
  const TEAM_ROOM_VIEW_REQUEST='titans:team-room-view-request';
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
  function my53UnitShape(roster,selection){
    const counts=new Map();
    for(const player of roster){
      if(!selection.has(playerKey(player)))continue;
      const unit=String(player.unit||'Other').trim()||'Other';
      counts.set(unit,(counts.get(unit)||0)+1);
    }
    return [...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
  }
  function my53ShareText(roster,selection){
    const selected=rows(roster)
      .filter(player=>selection.has(playerKey(player)))
      .sort((a,b)=>String(a.unit||'Other').localeCompare(String(b.unit||'Other'))||String(a.position||'').localeCompare(String(b.position||''))||String(a.name||'').localeCompare(String(b.name||'')));
    const grouped=new Map();
    for(const player of selected){
      const unit=String(player.unit||'Other').trim()||'Other';
      if(!grouped.has(unit))grouped.set(unit,[]);
      grouped.get(unit).push(player);
    }
    const lines=['My Titans 53 · fan roster board',`${selected.length} of ${FINAL_LIMIT} selected`,''];
    for(const [unit,players] of grouped){
      lines.push(unit.toUpperCase());
      for(const player of players)lines.push(`• ${player.number?`#${player.number} `:''}${player.name} · ${player.position||'Position not listed'}`);
      lines.push('');
    }
    lines.push('Fan-made roster exercise · not an official Titans projection.');
    return lines.join('\n').trim();
  }
  async function copyMy53Text(text){
    try{
      if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);return true;}
    }catch{}
    try{
      const area=document.createElement('textarea');
      area.value=text;
      area.setAttribute('readonly','');
      area.style.position='fixed';
      area.style.opacity='0';
      document.body.appendChild(area);
      area.select();
      const copied=document.execCommand?.('copy')===true;
      area.remove();
      return copied;
    }catch{return false;}
  }
  async function shareMy53(roster,selection,note){
    if(!selection.size)return;
    const text=my53ShareText(roster,selection);
    if(typeof navigator.share==='function'){
      try{
        await navigator.share({title:'My Titans 53',text});
        if(note)note.textContent='My 53 shared. Your picks still stay on this device.';
        return;
      }catch(error){
        if(error?.name==='AbortError'){if(note)note.textContent='Share canceled. Your My 53 is unchanged.';return;}
      }
    }
    const copied=await copyMy53Text(text);
    if(note)note.textContent=copied?'My 53 copied to your clipboard.':'This browser could not share or copy My 53.';
  }
  function my53Markup(roster){
    const active=rows(roster).filter(p=>String(p.status||'').toLowerCase()==='active');
    const positions=[...new Set(active.map(player=>String(player.position||'Other').trim()||'Other'))].sort((a,b)=>a.localeCompare(b));
    return `<section class="my53-builder" data-my53>
      <div class="my53-head">
        <div><small>MY 53 · FAN BOARD</small><h3>Build your own Titans 53</h3><p>Your picks stay on this device. This is a fan roster exercise—not an official roster projection or report.</p></div>
        <div class="my53-count"><strong data-my53-count>0 / 53</strong><button type="button" data-my53-clear>Clear picks</button></div>
      </div>
      <div class="my53-shape" data-my53-shape aria-live="polite"></div>
      <div class="my53-tools" data-my53-tools>
        <div class="my53-tools-row">
          <label><span>Find player</span><input type="search" data-my53-search placeholder="Search name or number…" autocomplete="off"></label>
          <label><span>Position</span><select data-my53-position><option value="all">All positions</option>${positions.map(position=>`<option value="${esc(position)}">${esc(position)}</option>`).join('')}</select></label>
        </div>
        <div class="my53-tools-actions">
          <button type="button" data-my53-selected aria-pressed="false">Selected only</button>
          <button type="button" data-my53-share disabled>Share / Copy My 53</button>
          <span data-my53-visible aria-live="polite"></span>
        </div>
        <div class="my53-unit-shape" data-my53-units aria-live="polite"></div>
      </div>
      <div class="my53-list" role="group" aria-label="Choose players for My 53">
        ${active.map(player=>`<button type="button" class="my53-player" data-my53-player="${esc(playerKey(player))}" data-my53-name="${esc(player.name)}" data-my53-number="${esc(player.number||'')}" data-my53-position="${esc(player.position||'Other')}" data-my53-unit="${esc(player.unit||'Other')}" aria-pressed="false"><span class="my53-number">#${esc(player.number||'—')}</span><span><b>${esc(player.name)}</b><small>${esc(player.position||'')} · ${esc(player.unit||'')}</small></span><i aria-hidden="true">+</i></button>`).join('')}
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
    const search=root.querySelector('[data-my53-search]');
    const positionFilter=root.querySelector('[data-my53-position]');
    const selectedToggle=root.querySelector('[data-my53-selected]');
    const share=root.querySelector('[data-my53-share]');
    const visible=root.querySelector('[data-my53-visible]');
    const units=root.querySelector('[data-my53-units]');
    const buttons=[...root.querySelectorAll('[data-my53-player]')];

    const refreshTools=()=>{
      const query=String(search?.value||'').trim().toLowerCase();
      const position=String(positionFilter?.value||'all');
      const selectedOnly=selectedToggle?.getAttribute('aria-pressed')==='true';
      let shown=0;
      for(const button of buttons){
        const on=selection.has(button.dataset.my53Player);
        const haystack=`${button.dataset.my53Name||''} ${button.dataset.my53Number||''}`.toLowerCase();
        const show=(!query||haystack.includes(query))&&(position==='all'||button.dataset.my53Position===position)&&(!selectedOnly||on);
        button.hidden=!show;
        if(show)shown+=1;
      }
      if(visible)visible.textContent=`${shown} shown · ${selection.size} selected`;
      if(share)share.disabled=selection.size===0;
      const unitShape=my53UnitShape(roster,selection);
      if(units)units.innerHTML=unitShape.length
        ?unitShape.map(([unit,total])=>`<span><b>${esc(total)}</b> ${esc(unit)}</span>`).join('')
        :'<span>Select players to see unit composition.</span>';
    };
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
      refreshTools();
    };

    search?.addEventListener('input',refreshTools);
    positionFilter?.addEventListener('change',refreshTools);
    root.addEventListener('click',event=>{
      const selectedControl=event.target.closest('[data-my53-selected]');
      if(selectedControl){
        const next=selectedControl.getAttribute('aria-pressed')!=='true';
        selectedControl.setAttribute('aria-pressed',String(next));
        selectedControl.classList.toggle('active',next);
        refreshTools();
        return;
      }
      if(event.target.closest('[data-my53-share]')){
        void shareMy53(roster,selection,note);
        return;
      }
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

  function requestCutdownOwner(app){
    if(!app||route()!=='roster')return;
    const requested=new URLSearchParams(location.hash.split('?')[1]||'').get('view');
    if(requested!=='cutdown')return;
    app.dispatchEvent(new CustomEvent(TEAM_ROOM_VIEW_REQUEST,{detail:{view:'cutdown',persist:false,reason:'cutdown-panel-mounted'}}));
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
    queueMicrotask(()=>requestCutdownOwner(app));
    requestAnimationFrame(()=>requestCutdownOwner(app));
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