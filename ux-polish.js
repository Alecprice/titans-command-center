const ROUTE_LABELS={home:'Home',live:'Game Day',games:'Schedule',roster:'Roster',transactions:'Transactions',stats:'Stats Lab',markets:'Market Pulse',feed:'Intel Feed',legacy:'Legacy',sources:'Sources',player:'Player'};
const qs=(s,r=document)=>r.querySelector(s),qsa=(s,r=document)=>[...r.querySelectorAll(s)];
const currentRoute=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
const reduceMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
let kickoffTimer=null,lastBootstrap=null;

function ensureSkipLink(){
  if(qs('.skip-link'))return;
  const a=document.createElement('a');
  a.className='skip-link';a.href='#app';a.textContent='Skip to Titans content';
  document.body.prepend(a);
}

function ensureUtilityChips(){
  const actions=qs('.top-actions');if(!actions)return;
  if(!qs('#kickoff-chip')){
    const a=document.createElement('a');a.id='kickoff-chip';a.className='ux-chip kickoff-chip';a.href='#live';a.innerHTML='<span class="ux-chip-dot"></span><span>Next game</span>';
    actions.prepend(a);
  }
  if(!qs('#data-chip')){
    const a=document.createElement('a');a.id='data-chip';a.className='ux-chip data-chip';a.href='#sources';a.innerHTML='<span class="ux-chip-dot"></span><span>Checking data…</span>';
    actions.prepend(a);
  }
}

function formatCountdown(iso){
  if(!iso)return 'Kickoff TBD';
  const ms=new Date(iso)-Date.now();
  if(ms<=0&&ms>-5*60*60*1000)return 'Game window';
  if(ms<=0)return 'Next game';
  const mins=Math.floor(ms/60000),days=Math.floor(mins/1440),hours=Math.floor((mins%1440)/60),minutes=mins%60;
  if(days>0)return `${days}d ${hours}h to kickoff`;
  if(hours>0)return `${hours}h ${minutes}m to kickoff`;
  return `${Math.max(1,minutes)}m to kickoff`;
}

function updateKickoffChip(){
  const chip=qs('#kickoff-chip');if(!chip)return;
  const next=(lastBootstrap?.games||[]).find(g=>g.status!=='final'&&g.status!=='bye'&&g.date&&new Date(g.date)>new Date());
  if(!next){chip.querySelector('span:last-child').textContent='Schedule';return;}
  chip.querySelector('span:last-child').textContent=`${next.opponentAbbr||'TEN'} · ${formatCountdown(next.date)}`;
  chip.title=`Next Titans game: ${next.homeAway==='home'?'vs':'at'} ${next.opponent||next.opponentAbbr}`;
}

async function refreshUtilityData(){
  ensureUtilityChips();
  const dataChip=qs('#data-chip');
  try{
    const [healthRes,dataRes]=await Promise.all([
      fetch('/api/health',{cache:'no-store'}),
      fetch('/api/data',{headers:{Accept:'application/json'}})
    ]);
    const health=await healthRes.json().catch(()=>({}));
    const data=await dataRes.json().catch(()=>({}));
    if(data?.ok)lastBootstrap=data;
    if(dataChip){
      dataChip.classList.toggle('is-good',Boolean(health?.ok));
      dataChip.classList.toggle('is-bad',!health?.ok);
      const audit=health?.database?.content_audit_at||data?.meta?.content_audit_at;
      dataChip.querySelector('span:last-child').textContent=health?.ok?(audit?`Verified · ${audit}`:'Data online'):'Data fallback';
      dataChip.title=health?.ok?'Neon database online and responding':'Live database unavailable; app may be using verified fallback data';
    }
    updateKickoffChip();
    clearInterval(kickoffTimer);kickoffTimer=setInterval(updateKickoffChip,60000);
  }catch{
    if(dataChip){dataChip.classList.add('is-bad');dataChip.querySelector('span:last-child').textContent=navigator.onLine?'Data check failed':'Offline';}
  }
}

function updateRouteState(){
  const r=currentRoute();
  document.body.dataset.route=r;
  qsa('[data-route]').forEach(a=>{
    const active=a.dataset.route===r;
    a.classList.toggle('active',active);
    if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  });
  document.title=`${ROUTE_LABELS[r]||'Titans'} · Titans Command Center`;
}

function scrollRouteTop(){
  const main=qs('.main');
  if(main)main.scrollTo({top:0,behavior:reduceMotion()?'auto':'smooth'});
  else scrollTo({top:0,behavior:reduceMotion()?'auto':'smooth'});
}

function addScheduleSections(){
  const schedule=qs('.schedule');if(!schedule||schedule.dataset.uxGrouped)return;
  schedule.dataset.uxGrouped='true';
  const rows=qsa('.game-row',schedule);
  const pre=rows.find(r=>/^P\d+/i.test(qs('.week',r)?.textContent?.trim()||''));
  const regular=rows.find(r=>/^Wk\s*1$/i.test(qs('.week',r)?.textContent?.trim()||''));
  if(pre){const h=document.createElement('div');h.className='schedule-section-label';h.textContent='Preseason';pre.before(h);}
  if(regular){const h=document.createElement('div');h.className='schedule-section-label';h.textContent='Regular season';regular.before(h);}
}

function statusOfCard(card){return (qs('.player-tag',card)?.textContent||'').trim().toLowerCase();}
function addRosterFilters(){
  const bar=qs('.filterbar'),grid=qs('#rg');if(!bar||!grid||qs('.roster-status-filters'))return;
  const wrap=document.createElement('div');wrap.className='ux-filter-row roster-status-filters';
  wrap.innerHTML='<span class="ux-filter-label">Status</span><button type="button" data-roster-status="all" class="active">All</button><button type="button" data-roster-status="active">Active</button><button type="button" data-roster-status="reserve">Reserve / injured</button><span class="ux-filter-count" aria-live="polite"></span>';
  bar.insertAdjacentElement('afterend',wrap);
  let selected='all';
  const apply=()=>{
    const cards=qsa('.player-card',grid);let shown=0;
    cards.forEach(card=>{
      const status=statusOfCard(card),visible=selected==='all'||(selected==='active'&&status==='active')||(selected==='reserve'&&status!=='active');
      card.hidden=!visible;if(visible)shown++;
    });
    const count=qs('.ux-filter-count',wrap);if(count)count.textContent=`${shown} shown`;
  };
  qsa('button',wrap).forEach(btn=>btn.addEventListener('click',()=>{selected=btn.dataset.rosterStatus;qsa('button',wrap).forEach(b=>b.classList.toggle('active',b===btn));apply();}));
  new MutationObserver(apply).observe(grid,{childList:true});apply();
}

function addFeedFilters(){
  const bar=qs('.filterbar'),list=qs('#fl');if(!bar||!list||qs('.intel-tier-filters'))return;
  const wrap=document.createElement('div');wrap.className='ux-filter-row intel-tier-filters';
  wrap.innerHTML='<span class="ux-filter-label">Trust</span><button type="button" data-tier="all" class="active">All</button><button type="button" data-tier="official">Official</button><button type="button" data-tier="media">Analysis / media</button><button type="button" data-tier="reporter">Reporter</button><button type="button" data-tier="community">Community</button>';
  bar.insertAdjacentElement('afterend',wrap);
  let tier='all';
  const apply=()=>qsa('.intel-item',list).forEach(item=>{const dot=qs('.source-dot',item);item.hidden=tier!=='all'&&!dot?.classList.contains(tier);});
  qsa('button',wrap).forEach(btn=>btn.addEventListener('click',()=>{tier=btn.dataset.tier;qsa('button',wrap).forEach(b=>b.classList.toggle('active',b===btn));apply();}));
  new MutationObserver(apply).observe(list,{childList:true,subtree:true});apply();
}

function addSourceFilters(){
  const grid=qs('.source-grid'),head=qs('.page-head');if(!grid||!head||qs('.source-ux-filters'))return;
  const wrap=document.createElement('div');wrap.className='ux-filter-row source-ux-filters';
  wrap.innerHTML='<span class="ux-filter-label">Integrations</span><button type="button" data-source-filter="all" class="active">All</button><button type="button" data-source-filter="ready">Enabled / ready</button><button type="button" data-source-filter="disabled">Disabled / needs setup</button>';
  head.insertAdjacentElement('afterend',wrap);
  let selected='all';
  const apply=()=>qsa('.source-card',grid).forEach(card=>{const status=(qs('.source-status',card)?.textContent||'').toLowerCase();const disabled=status.includes('disabled')||status.includes('need');card.hidden=selected==='ready'?disabled:selected==='disabled'?!disabled:false;});
  qsa('button',wrap).forEach(btn=>btn.addEventListener('click',()=>{selected=btn.dataset.sourceFilter;qsa('button',wrap).forEach(b=>b.classList.toggle('active',b===btn));apply();}));apply();
}

function enhanceEmptyStates(){
  qsa('.empty').forEach(el=>{if(el.dataset.uxEmpty)return;el.dataset.uxEmpty='true';el.setAttribute('role','status');el.innerHTML=`<span class="empty-mark" aria-hidden="true">T</span><span>${el.innerHTML}</span>`;});
}

function applyPagePolish(){
  updateRouteState();
  const r=currentRoute();
  if(r==='games')addScheduleSections();
  if(r==='roster')addRosterFilters();
  if(r==='feed')addFeedFilters();
  if(r==='sources')addSourceFilters();
  enhanceEmptyStates();
}

function bindKeyboard(){
  document.addEventListener('keydown',event=>{
    const search=qs('#global-search');
    if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){
      event.preventDefault();search?.focus();search?.select();
    }
    if(event.key==='Escape'){
      qs('#sidebar')?.classList.remove('open');
      if(document.activeElement===search){search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));search.blur();}
    }
  });
}

function bindConnectivity(){
  const apply=()=>{document.body.dataset.offline=String(!navigator.onLine);const chip=qs('#data-chip');if(chip&&!navigator.onLine){chip.classList.add('is-bad');chip.querySelector('span:last-child').textContent='Offline';}};
  addEventListener('online',()=>{apply();refreshUtilityData();});addEventListener('offline',apply);apply();
}

function bindSidebarDismiss(){
  document.addEventListener('pointerdown',event=>{
    const sidebar=qs('#sidebar');if(!sidebar?.classList.contains('open')||innerWidth>980)return;
    if(!sidebar.contains(event.target)&&!event.target.closest('#menu-button'))sidebar.classList.remove('open');
  });
}

ensureSkipLink();ensureUtilityChips();bindKeyboard();bindConnectivity();bindSidebarDismiss();
const app=qs('#app');if(app)new MutationObserver(()=>queueMicrotask(applyPagePolish)).observe(app,{childList:true,subtree:true});
addEventListener('hashchange',()=>{queueMicrotask(applyPagePolish);scrollRouteTop();});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refreshUtilityData();});
queueMicrotask(applyPagePolish);refreshUtilityData();
