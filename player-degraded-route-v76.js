(() => {
  'use strict';

  const app=document.querySelector('#app');
  if(!app||window.__titansPlayerDegradedRouteV76)return;
  window.__titansPlayerDegradedRouteV76=true;

  const PROFILE_KEY='titans:v15MyTitans';
  const MAX_NAME=120;
  let renderSerial=0,dataPromise=null,preseasonPromise=null;

  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const params=()=>new URLSearchParams(location.hash.split('?')[1]||'');
  const playerName=()=>String(params().get('name')||'').trim().slice(0,MAX_NAME);
  const playerId=()=>String(params().get('id')||'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const arr=value=>Array.isArray(value)?value:[];
  const exactName=value=>String(value||'').normalize('NFKC').trim().toLocaleLowerCase('en-US');
  const slug=value=>String(value||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]/g,'').replace(/\b(jr|sr|ii|iii|iv)\b/g,'').replace(/\s+/g,' ').trim();
  const date=value=>{try{const parsed=new Date(value);return Number.isNaN(parsed.getTime())?'Not available':new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(parsed)}catch{return'Not available'}};
  const readProfile=()=>{try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}')}catch{return{}}};
  const writeProfile=value=>{try{localStorage.setItem(PROFILE_KEY,JSON.stringify(value));return true}catch{return false}};

  async function siteData(){
    if(!dataPromise)dataPromise=fetch('/api/data',{cache:'no-store',headers:{Accept:'application/json'}}).then(r=>r.ok?r.json():null).catch(()=>null);
    return dataPromise;
  }
  async function preseasonData(){
    if(!preseasonPromise)preseasonPromise=fetch('/api/preseason-stats',{cache:'no-store',headers:{Accept:'application/json'}}).then(r=>r.ok?r.json():null).catch(()=>null);
    return preseasonPromise;
  }

  function degradedHref(name){
    const safe=String(name||'').trim().slice(0,MAX_NAME);
    return safe?`#player?id=&name=${encodeURIComponent(safe)}`:'#roster';
  }

  function rewriteFallbackPlayerLinks(){
    if(route()==='roster'){
      for(const card of app.querySelectorAll('.player-card[href="#roster"]')){
        const name=card.querySelector('h3')?.textContent?.trim()||'';
        if(!name)continue;
        card.setAttribute('href',degradedHref(name));
        card.dataset.playerRouteMode='audited-name';
        card.setAttribute('aria-label',`${name} Player Intelligence`);
      }
    }
    if(route()==='search'){
      for(const link of app.querySelectorAll('a.tag[href="#player?id=undefined"],a.tag[href="#player?id="]')){
        const label=link.textContent?.split('·')[0]?.trim()||'';
        if(!label)continue;
        link.setAttribute('href',degradedHref(label));
        link.dataset.playerRouteMode='audited-name';
      }
    }
  }

  function rosterMatch(site,name){
    const wanted=exactName(name);
    if(!wanted)return null;
    return arr(site?.roster).find(player=>exactName(player?.name)===wanted)||null;
  }

  function preseasonMatch(preseason,name){
    const wanted=exactName(name);
    const all=[...arr(preseason?.players),...arr(preseason?.otherParticipants)];
    return all.find(player=>exactName(player?.name)===wanted)||null;
  }

  function sourceMeta(site){
    const audit=site?.fallbackContentAudit||site?.dataQuality?.contentAuditAt||site?.meta?.content_audit_at||'2026-08-27';
    const databaseAvailable=site?.databaseAvailable!==false&&site?.mode!=='audited-fallback';
    return {
      audit,
      databaseAvailable,
      label:databaseAvailable?'Current loaded Titans roster':'Audited Titans roster fallback',
      detail:databaseAvailable
        ?'This name-routed profile was resolved against the current loaded roster without inventing a player ID.'
        :'Neon is currently unavailable. This profile uses the dated audited Titans roster plus verified preseason sources; no database UUID is fabricated.'
    };
  }

  function rawStatRows(preseason,name){
    const match=preseasonMatch(preseason,name);
    return arr(match?.stats).map(row=>({
      ...row,
      source:row?.source||preseason?.statsSource||'Official audited preseason source',
      sourceUrl:row?.sourceUrl||''
    }));
  }

  function statPairs(row,limit=5){
    const pairs=[];
    for(const item of arr(row?.fields)){
      const label=String(item?.label||'').trim(),value=String(item?.value??'').trim();
      if(!label||!value)continue;
      pairs.push({label,value});
      if(pairs.length>=limit)break;
    }
    return pairs;
  }

  function preseasonWeek(row,preseason){
    const day=String(row?.date||'').slice(0,10);
    const schedule=arr(preseason?.preseasonSchedule).find(game=>String(game?.date||'').slice(0,10)===day);
    return schedule?.week||String(row?.eventId||'').replace(/^p/i,'P')||'Preseason';
  }

  function gameLog(rows,preseason){
    if(!rows.length)return '<div class="v16-empty"><strong>Verified player-game detail is not loaded.</strong><span>This is a missing-data state, not a zero-stat claim.</span></div>';
    return `<div class="v16-game-log">${rows.map(row=>`<article><div class="v16-game-id"><small>${esc(preseasonWeek(row,preseason))} · 2026 preseason</small><strong>${esc(row.eventName||'Titans preseason game')}</strong><span>${esc(date(row.date))} · Official fallback</span></div><div class="v16-log-stats">${statPairs(row,4).map(stat=>`<div><small>${esc(stat.label)}</small><strong>${esc(stat.value)}</strong></div>`).join('')||'<span>No published numeric fields in this row.</span>'}</div></article>`).join('')}</div>`;
  }

  function timeline(site,name){
    const wanted=slug(name),rows=arr(site?.transactions).filter(item=>slug([item?.description,item?.title,item?.summary,item?.player,item?.name].filter(Boolean).join(' ')).includes(wanted)).slice(0,6);
    if(!rows.length)return '<div class="v16-empty"><strong>No matching transaction rows loaded.</strong><span>No roster movement is inferred from silence.</span></div>';
    return `<div class="v16-move-list">${rows.map(item=>`<article><small>Transaction</small><strong>${esc(item.description||item.title||item.summary||'Roster transaction')}</strong><span>${esc(date(item.date||item.publishedAt))}</span></article>`).join('')}</div>`;
  }

  function renderFallbackPlayer(site,preseason,player,name){
    const source=sourceMeta(site),rows=rawStatRows(preseason,name),latest=rows.slice().sort((a,b)=>Date.parse(b?.date||0)-Date.parse(a?.date||0))[0]||null,quick=latest?statPairs(latest,3):[],profile=readProfile(),favorite=profile.favorite===player.name;
    const coverage=preseason?.coverage?`${preseason.coverage.completedGamesWithPlayerStats??'—'} of ${preseason.coverage.completedGames??'—'} completed preseason games with player detail`:'Official preseason coverage';
    const facts=[['Position',player.position||'—'],['Unit',player.unit||'—'],['Status',player.status||'—'],['Experience',player.experience?`${player.experience} yr${String(player.experience)==='1'?'':'s'}`:'—']];
    app.innerHTML=`<div class="player-profile-rich" data-degraded-player="${esc(player.name)}" data-player-route-mode="audited-name">
      <div class="player-back-row"><a href="#roster">← Back to roster</a><a href="https://www.tennesseetitans.com/team/players-roster/" target="_blank" rel="noopener noreferrer">Official roster source ↗</a></div>
      <section class="player-rich-hero"><div class="player-rich-number" aria-label="Jersey number ${esc(player.number||'')}">${esc(player.number||'—')}</div><div class="player-rich-copy"><div class="eyebrow">Player Intelligence · ${esc(player.status||'Roster')}</div><h1>${esc(player.name)}</h1><p>${esc(player.position||'')} ${player.unit?`· ${esc(player.unit)}`:''}</p><div class="player-source-line"><span></span>${esc(source.label)} · ${esc(date(source.audit))}</div></div><div class="player-rich-watermark">${esc(player.number||'')}</div></section>
      <section class="player-fact-grid">${facts.map(([label,value])=>`<div><small>${esc(label)}</small><strong>${esc(value)}</strong></div>`).join('')}</section>
      <section class="v16-player-intel" data-degraded-intel="true">
        <section class="v16-player-command"><header><div><small>PLAYER COMMAND CENTER</small><h2>${esc(player.name)}</h2><p>Quick answer first. Audited roster truth and verified preseason production remain available while the live player database is degraded.</p></div><button type="button" data-v16-favorite aria-pressed="${favorite}">${favorite?'★ Favorite':'☆ Make favorite'}</button></header>
          <p class="v16-note"><strong>${source.databaseAvailable?'Name-routed roster profile':'Database degraded · audited fallback active'}</strong> · ${esc(source.detail)}</p>
          <p class="v16-note"><strong>2026 Preseason · official fallback</strong> · ${esc(preseason?.statsSource||'Verified Titans/NFL preseason sources')}. ${esc(coverage)}</p>
          <div class="v16-quick-grid"><article><small>Roster status</small><strong>${esc(player.status||'Current roster')}</strong><span>${esc(player.position||'Position')} · No. ${esc(player.number||'—')}</span></article><article><small>Last verified game</small><strong>${esc(latest?preseasonWeek(latest,preseason):'Awaiting stats')}</strong><span>${esc(latest?date(latest.date):'No verified player-game row loaded')}</span></article>${quick.slice(0,2).map(stat=>`<article><small>${esc(stat.label)}</small><strong>${esc(stat.value)}</strong><span>Latest official preseason row</span></article>`).join('')}</div>
        </section>
        <section class="v16-player-changed"><header><div><small>WHAT CHANGED?</small><h3>Current evidence state</h3></div><span>Verified loaded data only</span></header><article><small>Database</small><strong>${source.databaseAvailable?'Available':'Degraded'}</strong><span>${esc(source.databaseAvailable?'Current roster payload loaded':'Audited fallback is serving this player')}</span></article><article><small>Preseason production</small><strong>${rows.length} verified row${rows.length===1?'':'s'}</strong><span>Missing categories remain missing</span></article></section>
        <div class="v16-player-tabs" role="tablist" aria-label="Player intelligence sections"><button class="active" type="button" data-v16-player-tab="overview" aria-selected="true">Overview</button><button type="button" data-v16-player-tab="games" aria-selected="false">Game Log</button><button type="button" data-v16-player-tab="trends" aria-selected="false">Trends</button><button type="button" data-v16-player-tab="career" aria-selected="false">Career + Contract</button><button type="button" data-v16-player-tab="timeline" aria-selected="false">Timeline</button></div>
        <section class="v16-player-pane" data-v16-pane="overview"><div class="v16-grid two"><article class="v16-panel"><small>SEASON SNAPSHOT</small><h3>2026 preseason production</h3>${quick.length?`<div class="v16-snapshot">${quick.map(stat=>`<div><small>${esc(stat.label)}</small><strong>${esc(stat.value)}</strong></div>`).join('')}</div>`:'<div class="v16-empty"><strong>Production detail is awaiting a verified row.</strong><span>No zeroes are invented.</span></div>'}<p class="v16-note">Official preseason rows are shown separately from regular-season totals.</p></article><article class="v16-panel"><small>ROLE + AVAILABILITY</small><h3>${esc(player.status||'Roster status')}</h3><p>${esc(source.detail)}</p><a href="#command">Open Change Engine →</a></article></div></section>
        <section class="v16-player-pane" data-v16-pane="games" hidden><header><div><small>GAME LOG</small><h3>Verified preseason production</h3></div><span>${rows.length} rows · 2026 preseason</span></header>${gameLog(rows,preseason)}</section>
        <section class="v16-player-pane" data-v16-pane="trends" hidden><header><div><small>TRENDS</small><h3>Published game-to-game fields</h3></div><span>${rows.length} verified rows</span></header>${rows.length>1?`<div class="v16-trend-grid">${rows.slice().reverse().map(row=>`<article><small>${esc(preseasonWeek(row,preseason))}</small><strong>${esc(statPairs(row,1)[0]?.value??'—')}</strong><span>${esc(statPairs(row,1)[0]?.label||'Published stat field')} · ${esc(date(row.date))}</span></article>`).join('')}</div>`:'<div class="v16-empty"><strong>More verified games are needed for a trend.</strong><span>A one-game sample is not presented as direction.</span></div>'}<p class="v16-note">Trend context uses only fields published in the official preseason rows shown here; it does not infer film grades.</p></section>
        <section class="v16-player-pane" data-v16-pane="career" hidden><div class="v16-grid two"><article class="v16-panel"><small>CAREER COVERAGE</small><h3>${esc(player.experience?`${player.experience} year${String(player.experience)==='1'?'':'s'} experience`:'Experience not loaded')}</h3><p>This degraded route does not claim a complete career archive. Live warehouse history returns automatically when the database-backed player route is available.</p></article><article class="v16-panel"><small>CONTRACT</small><h3>Verified contract row unavailable</h3><div class="v16-empty"><strong>No contract values are loaded for this degraded profile.</strong><span>No salary, cap savings, dead money or guarantees are inferred.</span></div></article></div></section>
        <section class="v16-player-pane" data-v16-pane="timeline" hidden><header><div><small>PLAYER TIMELINE</small><h3>Loaded roster evidence</h3></div><a href="#command">Open full knowledge graph →</a></header>${timeline(site,player.name)}</section>
      </section>
    </div>`;

    const root=app.querySelector('[data-degraded-player]');
    root?.addEventListener('click',event=>{
      const tab=event.target.closest?.('[data-v16-player-tab]');
      if(tab){const selected=tab.dataset.v16PlayerTab;root.querySelectorAll('[data-v16-player-tab]').forEach(button=>{const active=button===tab;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active))});root.querySelectorAll('[data-v16-pane]').forEach(pane=>{pane.hidden=pane.dataset.v16Pane!==selected});return;}
      const favoriteButton=event.target.closest?.('[data-v16-favorite]');
      if(favoriteButton){const wasFavorite=favoriteButton.getAttribute('aria-pressed')==='true',next=readProfile();next.favorite=wasFavorite?'':player.name;if(writeProfile(next)){favoriteButton.setAttribute('aria-pressed',String(!wasFavorite));favoriteButton.textContent=wasFavorite?'☆ Make favorite':'★ Favorite';}}
    });
    window.dispatchEvent(new CustomEvent('titans:rendered',{detail:{route:'player',mode:'audited-name',player:player.name}}));
  }

  async function renderNameRoute(){
    if(route()!=='player'||playerId()||!playerName())return;
    const name=playerName();
    if(app.querySelector(`[data-degraded-player="${CSS.escape(name)}"]`))return;
    const current=++renderSerial;
    try{
      const [site,preseason]=await Promise.all([siteData(),preseasonData()]);
      if(current!==renderSerial||route()!=='player'||playerId()||exactName(playerName())!==exactName(name))return;
      if(!site?.ok)throw new Error('Audited roster data is unavailable');
      const player=rosterMatch(site,name);if(!player)throw new Error('Player is not present in the current audited roster');
      renderFallbackPlayer(site,preseason?.ok?preseason:{},player,name);
    }catch(error){
      if(current!==renderSerial)return;
      app.innerHTML=`<div class="player-profile-error"><a href="#roster">← Back to roster</a><div class="player-data-empty"><strong>Player profile unavailable</strong><p>${esc(error?.message||'Try again shortly.')}</p></div></div>`;
    }
  }

  function reconcile(){rewriteFallbackPlayerLinks();queueMicrotask(renderNameRoute);}
  new MutationObserver(()=>queueMicrotask(reconcile)).observe(app,{childList:true,subtree:false});
  addEventListener('hashchange',()=>{renderSerial++;setTimeout(reconcile,25)});
  setTimeout(reconcile,80);
})();
