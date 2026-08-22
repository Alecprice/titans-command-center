(() => {
  'use strict';

  const app=document.querySelector('#app');
  const PROFILE_KEY='titans:v15MyTitans';
  let serial=0,fanPromise=null,dataPromise=null;
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const playerId=()=>new URLSearchParams(location.hash.split('?')[1]||'').get('id')||'';
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const arr=value=>Array.isArray(value)?value:[];
  const getJson=(key,fallback)=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}};
  const setJson=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
  const fmt=value=>{try{const d=new Date(value);return Number.isNaN(d.getTime())?'TBD':new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric'}).format(d)}catch{return'TBD'}};
  const slug=value=>String(value??'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const human=value=>String(value??'').replace(/[_-]+/g,' ').replace(/\b\w/g,m=>m.toUpperCase());
  const number=value=>Number.isFinite(Number(value))?Number(value):null;

  async function fanIntel(){
    if(!fanPromise)fanPromise=fetch('/api/fan-intel',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    return fanPromise;
  }

  async function siteData(){
    if(!dataPromise)dataPromise=fetch('/api/data',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    return dataPromise;
  }

  function flattenStats(row){
    const out={};
    const walk=(obj,prefix='')=>{
      if(!obj||typeof obj!=='object'||Array.isArray(obj))return;
      for(const [key,value] of Object.entries(obj)){
        const path=prefix?`${prefix}_${key}`:key;
        if(value&&typeof value==='object'&&!Array.isArray(value))walk(value,path);
        else if(number(value)!=null)out[path]=number(value);
      }
    };
    walk(row?.stats||{});
    return out;
  }

  const METRIC_PRIORITY=[
    /passing.*yards|pass.*yards|passing_yards/i,/passing.*td|pass.*touchdown/i,/completion/i,/attempt/i,
    /rushing.*yards|rush.*yards/i,/rushing.*td|rush.*touchdown/i,/receiving.*yards|rec.*yards/i,/reception/i,/target/i,
    /tackle/i,/sack/i,/pressure/i,/interception/i,/pass.*def/i,/snap/i
  ];

  function metricKeys(rows){
    const keys=[...new Set(rows.flatMap(row=>Object.keys(flattenStats(row))))];
    keys.sort((a,b)=>{
      const pa=METRIC_PRIORITY.findIndex(rx=>rx.test(a)),pb=METRIC_PRIORITY.findIndex(rx=>rx.test(b));
      const aa=pa<0?999:pa,bb=pb<0?999:pb;
      return aa-bb||a.localeCompare(b);
    });
    return keys.slice(0,8);
  }

  function trendMetric(rows,key){
    return rows.slice().reverse().map(row=>({label:`W${row.week??'—'}`,value:flattenStats(row)[key],date:row.kickoff})).filter(x=>x.value!=null).slice(-8);
  }

  function spark(values){
    if(values.length<2)return'<div class="v16-spark-empty">More games needed for a trend.</div>';
    const nums=values.map(x=>x.value),min=Math.min(...nums),max=Math.max(...nums),range=max-min||1;
    const points=values.map((x,i)=>`${(i/(values.length-1))*100},${34-((x.value-min)/range)*28}`).join(' ');
    return `<svg class="v16-spark" viewBox="0 0 100 40" role="img" aria-label="Trend chart"><polyline points="${points}" fill="none" stroke="currentColor" stroke-width="3" vector-effect="non-scaling-stroke"/><line x1="0" y1="36" x2="100" y2="36" stroke="currentColor" opacity=".2"/></svg>`;
  }

  function latestStatus(data,fan){
    const player=data.player||{},name=player.name||'Player',injuries=arr(data.injuries),currentInjury=injuries[0];
    const depth=arr(fan?.depthChart?.changes).find(x=>String(x.playerId||'')===String(player.id||'')||slug(x.name)===slug(name));
    if(currentInjury)return {label:'Availability',value:currentInjury.reportStatus||currentInjury.practiceStatus||currentInjury.primaryInjury||'Reported',copy:`Latest injury-report row: ${currentInjury.primaryInjury||'designation'} · ${currentInjury.reportDate||fmt(currentInjury.capturedAt)}`};
    if(depth)return {label:'Depth chart',value:depth.type||'Changed',copy:`Listed depth role moved ${depth.from??'—'} → ${depth.to??'—'}.`};
    return {label:'Roster status',value:player.rosterStatus||'Active roster',copy:'No newer injury or depth-change row is loaded for this player.'};
  }

  function lastGame(rows){return rows.slice().sort((a,b)=>Date.parse(b.kickoff||0)-Date.parse(a.kickoff||0))[0]||null}

  function metricSummary(row){
    if(!row)return[];
    const stats=flattenStats(row),keys=metricKeys([row]);
    return keys.slice(0,4).map(key=>({label:human(key),value:stats[key]}));
  }

  function whatChanged(data,fan){
    const player=data.player||{},name=player.name||'',rows=[];
    const injury=arr(data.injuries)[0];if(injury)rows.push(['Injury report',injury.reportStatus||injury.practiceStatus||injury.primaryInjury||'Updated',injury.reportDate||fmt(injury.capturedAt)]);
    const depth=arr(fan?.depthChart?.changes).find(x=>String(x.playerId||'')===String(player.id||'')||slug(x.name)===slug(name));if(depth)rows.push(['Depth chart',`${depth.type||'changed'} · ${depth.from??'—'} → ${depth.to??'—'}`,fan?.depthChart?.capturedAt?fmt(fan.depthChart.capturedAt):'Current snapshot']);
    const mentions=arr(fan?.playerStats).filter(x=>String(x.playerId||'')===String(player.id||'')).slice(0,2);if(mentions.length)rows.push(['Production',`${mentions.length} recent player-stat row${mentions.length===1?'':'s'} loaded`,'Game data']);
    if(!rows.length)rows.push(['No detected change','Roster profile is stable in the currently loaded datasets.','Current load']);
    return rows;
  }

  function gameLog(rows){
    if(!rows.length)return'<div class="v16-empty"><strong>No player-game rows loaded.</strong><span>This is an ingest gap, not a zero-stat claim.</span></div>';
    return `<div class="v16-game-log">${rows.slice(0,12).map(row=>{const metrics=metricSummary(row);return `<article><div class="v16-game-id"><small>${esc(row.season?`${row.season} · `:'')}Week ${esc(row.week??'—')}</small><strong>${esc(row.homeAbbr||'')} vs ${esc(row.awayAbbr||'')}</strong><span>${esc(fmt(row.kickoff))}</span></div><div class="v16-log-stats">${metrics.length?metrics.map(metric=>`<div><small>${esc(metric.label)}</small><strong>${esc(metric.value)}</strong></div>`).join(''):'<span>No numeric fields in this stat row.</span>'}</div></article>`}).join('')}</div>`;
  }

  function trends(rows){
    const keys=metricKeys(rows).slice(0,3);
    if(!keys.length)return'<div class="v16-empty"><strong>Trend data is not loaded yet.</strong><span>Charts appear only when numeric player-game fields exist.</span></div>';
    return `<div class="v16-trend-grid">${keys.map(key=>{const values=trendMetric(rows,key),latest=values.at(-1);return `<article><small>${esc(human(key))}</small><strong>${esc(latest?.value??'—')}</strong>${spark(values)}<span>${values.map(x=>`${esc(x.label)} ${esc(x.value)}`).join(' · ')}</span></article>`}).join('')}</div>`;
  }

  function newsAndMoves(data,fan,site){
    const player=data.player||{},name=slug(player.name),rows=[];
    for(const item of arr(fan?.playerStats).filter(x=>String(x.playerId||'')===String(player.id||'')).slice(0,4))rows.push({kind:'Game data',title:`${item.statGroup||'Stats'} · Week ${item.week??'—'}`,meta:fmt(item.kickoff)});
    for(const item of arr(data.injuries).slice(0,4))rows.push({kind:'Injury report',title:item.primaryInjury||item.reportStatus||'Availability update',meta:item.reportDate||fmt(item.capturedAt)});
    for(const transaction of arr(site?.transactions).filter(x=>slug([x.description,x.title,x.summary,x.player,x.name].filter(Boolean).join(' ')).includes(name)).slice(0,4))rows.push({kind:'Transaction',title:transaction.description||transaction.title||transaction.summary||'Roster transaction',meta:fmt(transaction.date||transaction.publishedAt)});
    return rows.length?`<div class="v16-move-list">${rows.slice(0,8).map(item=>`<article><small>${esc(item.kind)}</small><strong>${esc(item.title)}</strong><span>${esc(item.meta)}</span></article>`).join('')}</div>`:'<div class="v16-empty"><strong>No additional timeline rows loaded.</strong><span>The page will expand automatically as transactions, injuries and game stats accumulate.</span></div>';
  }

  function contractCard(data,fan){
    const player=data.player||{},contract=arr(fan?.contracts).find(x=>String(x.playerId||'')===String(player.id||'')||slug(x.name)===slug(player.name));
    if(!contract)return'<div class="v16-empty"><strong>Contract row not loaded.</strong><span>No salary/cap values are inferred.</span></div>';
    const money=value=>number(value)==null?'—':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(value));
    return `<div class="v16-contract-grid"><div><small>Years</small><strong>${esc(contract.years??'—')}</strong></div><div><small>Total value</small><strong>${esc(money(contract.totalValue))}</strong></div><div><small>APY</small><strong>${esc(money(contract.apy))}</strong></div><div><small>Guaranteed</small><strong>${esc(money(contract.guaranteed))}</strong></div></div><p class="v16-note">Contract context is informational. Cap savings/dead-money outcomes are not estimated without a verified cap model.</p>`;
  }

  function renderLayer(data,fan,site){
    const root=document.querySelector('.player-profile-rich');if(!root||root.querySelector('.v16-player-intel'))return;
    const player=data.player||{},rows=arr(data.stats),status=latestStatus(data,fan),last=lastGame(rows),quick=metricSummary(last),changes=whatChanged(data,fan),profile=getJson(PROFILE_KEY,{}),favorite=profile.favorite===player.name;
    const layer=document.createElement('section');layer.className='v16-player-intel';layer.innerHTML=`
      <section class="v16-player-command">
        <header><div><small>PLAYER COMMAND CENTER</small><h2>${esc(player.name||'Titans player')}</h2><p>Quick answer first. Game logs, trends and deeper football context stay one tap away.</p></div><button type="button" data-v16-favorite aria-pressed="${favorite}">${favorite?'★ Favorite':'☆ Make favorite'}</button></header>
        <div class="v16-quick-grid"><article><small>${esc(status.label)}</small><strong>${esc(status.value)}</strong><span>${esc(status.copy)}</span></article><article><small>Last loaded game</small><strong>${esc(last?`Week ${last.week??'—'}`:'Awaiting stats')}</strong><span>${esc(last?fmt(last.kickoff):'No game-stat row loaded')}</span></article>${quick.slice(0,2).map(metric=>`<article><small>${esc(metric.label)}</small><strong>${esc(metric.value)}</strong><span>Latest loaded game</span></article>`).join('')}</div>
      </section>
      <section class="v16-player-changed"><header><div><small>WHAT CHANGED?</small><h3>Latest player movement</h3></div><span>Verified loaded data only</span></header>${changes.map(change=>`<article><small>${esc(change[0])}</small><strong>${esc(change[1])}</strong><span>${esc(change[2])}</span></article>`).join('')}</section>
      <div class="v16-player-tabs" role="tablist" aria-label="Player intelligence sections"><button class="active" type="button" data-v16-player-tab="overview" aria-selected="true">Overview</button><button type="button" data-v16-player-tab="games" aria-selected="false">Game Log</button><button type="button" data-v16-player-tab="trends" aria-selected="false">Trends</button><button type="button" data-v16-player-tab="career" aria-selected="false">Career + Contract</button><button type="button" data-v16-player-tab="timeline" aria-selected="false">Timeline</button></div>
      <section class="v16-player-pane" data-v16-pane="overview"><div class="v16-grid two"><article class="v16-panel"><small>SEASON SNAPSHOT</small><h3>What the loaded numbers say</h3>${quick.length?`<div class="v16-snapshot">${quick.map(metric=>`<div><small>${esc(metric.label)}</small><strong>${esc(metric.value)}</strong></div>`).join('')}</div>`:'<div class="v16-empty"><strong>Season production is awaiting ingest.</strong><span>No zeroes are invented.</span></div>'}</article><article class="v16-panel"><small>ROLE + AVAILABILITY</small><h3>${esc(status.value)}</h3><p>${esc(status.copy)}</p><a href="#command">Open Change Engine →</a></article></div></section>
      <section class="v16-player-pane" data-v16-pane="games" hidden><header><div><small>GAME LOG</small><h3>Loaded player-game production</h3></div><span>${rows.length} rows</span></header>${gameLog(rows)}</section>
      <section class="v16-player-pane" data-v16-pane="trends" hidden><header><div><small>TRENDS</small><h3>Recent direction, not a hot-take grade</h3></div><span>Last ${Math.min(8,rows.length)} loaded rows</span></header>${trends(rows)}<p class="v16-note">Trend charts visualize fields already stored in the player-game warehouse. They do not infer film grades.</p></section>
      <section class="v16-player-pane" data-v16-pane="career" hidden><div class="v16-grid two"><article class="v16-panel"><small>CAREER COVERAGE</small><h3>${esc(player.experience?`${player.experience} year${String(player.experience)==='1'?'':'s'} experience`:'Experience not loaded')}</h3><p>${esc(player.college?`${player.college} · `:'')}The game log can include any seasons currently backfilled for this player. A complete career archive is not claimed until historical ingestion is complete.</p></article><article class="v16-panel"><small>CONTRACT</small><h3>Current loaded contract context</h3>${contractCard(data,fan)}</article></div></section>
      <section class="v16-player-pane" data-v16-pane="timeline" hidden><header><div><small>PLAYER TIMELINE</small><h3>Game, injury and roster evidence</h3></div><a href="#command">Open full knowledge graph →</a></header>${newsAndMoves(data,fan,site)}</section>`;
    root.append(layer);
    layer.addEventListener('click',event=>{
      const tab=event.target.closest?.('[data-v16-player-tab]');
      if(tab){const id=tab.dataset.v16PlayerTab;layer.querySelectorAll('[data-v16-player-tab]').forEach(x=>{const on=x===tab;x.classList.toggle('active',on);x.setAttribute('aria-selected',String(on))});layer.querySelectorAll('[data-v16-pane]').forEach(x=>x.hidden=x.dataset.v16Pane!==id);return}
      const favoriteButton=event.target.closest?.('[data-v16-favorite]');
      if(favoriteButton){const isFavorite=favoriteButton.getAttribute('aria-pressed')==='true',next=getJson(PROFILE_KEY,{});next.favorite=isFavorite?'':player.name;setJson(PROFILE_KEY,next);favoriteButton.textContent=isFavorite?'☆ Make favorite':'★ Favorite';favoriteButton.setAttribute('aria-pressed',String(!isFavorite))}
    });
  }

  async function enhance(){
    if(route()!=='player')return;
    const id=playerId();if(!/^[0-9a-f-]{36}$/i.test(id))return;
    const current=++serial;
    try{
      const [profile,fan,site]=await Promise.all([
        fetch(`/api/player?id=${encodeURIComponent(id)}`,{cache:'no-store'}).then(r=>r.ok?r.json():null),
        fanIntel(),
        siteData()
      ]);
      if(current!==serial||route()!=='player'||playerId()!==id||!profile?.ok)return;
      renderLayer(profile,fan?.ok?fan:{},site?.ok?site:{});
    }catch{}
  }

  if(app)new MutationObserver(()=>queueMicrotask(enhance)).observe(app,{childList:true,subtree:false});
  addEventListener('hashchange',()=>{serial++;setTimeout(enhance,40)});
  setTimeout(enhance,120);
})();
