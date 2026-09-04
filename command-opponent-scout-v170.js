import {WEEK1_OPPONENT_INTEL_2026,opponentIntelSourceTruth} from './src/week1-opponent-intel-2026.mjs';

(() => {
  'use strict';

  const runtime=window.TitansRuntime;
  if(!runtime||window.__TitansOpponentScoutV170)return;
  window.__TitansOpponentScoutV170=true;

  const intel=WEEK1_OPPONENT_INTEL_2026;
  const sourceTruth=opponentIntelSourceTruth(intel);
  const MAX_SETTLE_FRAMES=12;
  let renderGeneration=0;

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeArr=value=>Array.isArray(value)?value:[];
  const route=()=>runtime.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';
  const sourceFor=key=>intel?.sources?.[key]||null;
  const safeSourceUrl=source=>{
    try{
      const url=new URL(String(source?.url||''));
      return url.protocol==='https:'&&['www.newyorkjets.com','www.tennesseetitans.com'].includes(url.hostname)?url.href:'';
    }catch{return ''}
  };
  const sourceLink=(key,label='Official source')=>{
    const source=sourceFor(key),href=safeSourceUrl(source);
    return href?`<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(label)} · ${esc(source?.publisher||'Official')}</a>`:'';
  };
  const formatKickoff=value=>{
    try{return new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(value))}catch{return 'Kickoff time unavailable'}
  };
  const remove=()=>document.querySelector('[data-v170-opponent-scout]')?.remove();
  const exactMatch=game=>Boolean(
    game
    &&Number(game.week)===Number(intel?.game?.week)
    &&String(game.opponentAbbr||'').toUpperCase()===String(intel?.opponentAbbr||'').toUpperCase()
    &&String(game.date||'')===String(intel?.game?.kickoff||'')
  );

  function signalCard(signal){
    const subjects=safeArr(signal?.subjects).join(' · ')||'Opponent availability';
    return `<article class="v15-intel-item"><strong>${esc(subjects)}</strong><p><b>${esc(signal?.label||'Official context')}:</b> ${esc(signal?.detail||'No detail loaded.')}</p>${sourceLink(signal?.sourceKey,'Read source')}</article>`;
  }

  function panelMarkup(game){
    const spine=intel.activeRosterSpine||{},captains=safeArr(intel?.leadership?.captains),signals=safeArr(intel?.availability?.signals);
    const qb=spine?.quarterback||{},rb=spine?.runningBack||{};
    const defensiveRoster=new Set([...safeArr(spine?.defensiveFront),...safeArr(spine?.linebackers),...safeArr(spine?.secondary)]);
    const defensiveCaptains=captains.filter(name=>defensiveRoster.has(name));
    const conflictCount=Number(sourceTruth?.conflictCount)||0;
    const formalCount=Number(sourceTruth?.formalGameStatusCount)||0;
    return `<section class="v15-addon-panel v15-intel-desk" data-v170-opponent-scout>
      <header><div><small>OPPONENT SCOUT · WEEK ${esc(game.week)}</small><h3>${esc(intel.opponent)} · source-qualified snapshot</h3></div><span class="v15-intel-network">${esc(game.network||intel?.game?.network||'Network TBD')}</span></header>
      <p class="v15-intel-kickoff">${esc(formatKickoff(game.date))} · audited ${esc(intel.asOf||'date unavailable')}</p>
      <div class="v15-intel-grid">
        <section class="v15-intel-lane confirmed"><span class="v15-intel-status">CURRENT ROSTER</span><article class="v15-intel-item"><strong>Offensive spine</strong><p>QB ${esc(qb.starter||'Unavailable')} · backup ${esc(qb.backup||'Unavailable')}<br>RB ${esc(rb.lead||'Unavailable')}<br>WR ${esc(safeArr(spine.receivers).join(' · ')||'Unavailable')}</p>${sourceLink('jetsRoster')}</article><article class="v15-intel-item"><strong>Defensive captains</strong><p>${esc(defensiveCaptains.join(' · ')||'No defensive captain identities are loaded.')}</p>${sourceLink(intel?.leadership?.sourceKey,'Captain source')}</article></section>
        <section class="v15-intel-lane confirmed"><span class="v15-intel-status">TEAM-ELECTED CAPTAINS</span><article class="v15-intel-item"><strong>2026 leadership group</strong><p>${esc(captains.join(' · ')||'Captain list unavailable.')}</p>${sourceLink(intel?.leadership?.sourceKey,'Captain source')}</article><article class="v15-intel-item"><strong>Depth-chart caution</strong><p>${conflictCount?`${esc(conflictCount)} conflicts are already reconciled. Current roster and transactions control when the Jets’ unofficial depth chart disagrees.`:'No source conflict is loaded.'}</p>${sourceLink('jetsDepthChart','Unofficial depth chart')}</article></section>
        <section class="v15-intel-lane practice"><span class="v15-intel-status">AVAILABILITY WATCH</span>${signals.length?signals.map(signalCard).join(''):`<div class="v15-intel-empty"><strong>No qualified opponent availability signals loaded.</strong><span>The scout will not turn missing reporting into a healthy roster claim.</span></div>`}</section>
      </div>
      <p class="v15-addon-note">Official team reporting and practice observations are context, not formal Week 1 game-status designations unless explicitly marked formal. Formal designations loaded: ${esc(formalCount)}. No availability prediction is inferred.</p>
    </section>`;
  }

  async function mount(generation){
    if(generation!==renderGeneration||route()!=='command'){remove();return true}
    const root=document.querySelector('.v15-addon-root[data-tab="changes"]');
    if(!root)return false;
    const existing=root.querySelector('[data-v170-opponent-scout]');
    const payload=await runtime.apiJson('/api/data',{ttl:30000});
    if(generation!==renderGeneration||route()!=='command'||!root.isConnected)return true;
    const game=runtime.scheduleFocus?.(safeArr(payload?.games),new Date())?.next||null;
    if(!exactMatch(game)){existing?.remove();return true}
    const holder=document.createElement('div');
    holder.innerHTML=panelMarkup(game).trim();
    const panel=holder.firstElementChild;
    if(!panel)return true;
    existing?.remove();
    const decisionGrid=root.querySelector('.v15-addon-grid.two');
    if(decisionGrid)root.insertBefore(panel,decisionGrid);else root.append(panel);
    return true;
  }

  function schedule(){
    const generation=++renderGeneration;
    let frame=0;
    const settle=()=>{
      if(generation!==renderGeneration)return;
      Promise.resolve(mount(generation)).then(done=>{
        if(done||generation!==renderGeneration||++frame>=MAX_SETTLE_FRAMES)return;
        requestAnimationFrame(settle);
      }).catch(error=>console.warn('[opponent-scout]',error));
    };
    requestAnimationFrame(settle);
  }

  runtime.onRoute(schedule,{immediate:true});
  runtime.onAppRender(schedule,{immediate:true});
  runtime.onRefresh(event=>{if(!event?.urls||event.urls.includes('/api/data'))schedule()});
  document.addEventListener('click',event=>{
    if(route()==='command'&&event.target instanceof Element&&event.target.closest('[data-v15-tab]'))schedule();
  },true);
})();
