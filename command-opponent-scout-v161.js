import {WEEK1_OPPONENT_INTEL_2026,opponentIntelSourceTruth} from './src/week1-opponent-intel-2026.mjs';

(() => {
  'use strict';

  const app=document.querySelector('#app');
  const intel=WEEK1_OPPONENT_INTEL_2026;
  const VERSION=String(intel.version||'2026-w1');
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeArr=value=>Array.isArray(value)?value:[];
  const safeUrl=source=>{try{const url=new URL(source?.url,location.href);return url.protocol==='https:'?url.href:''}catch{return''}};

  function sourceLinks(){
    const keys=['jetsRoster','jetsTransactions','jetsPracticeSquad','jetsWeek1Prep'];
    return keys.map(key=>intel?.sources?.[key]).filter(Boolean).map(source=>{
      const href=safeUrl(source);
      return href?`<article class="v15-intel-item"><strong>${esc(source.label||source.publisher||'Official source')}</strong><p>${esc(source.publisher||'New York Jets')} · checked ${esc(intel.asOf||'current audit')}</p><a href="${esc(href)}" target="_blank" rel="noopener noreferrer">Open official source ↗</a></article>`:'';
    }).join('');
  }

  function panelHtml(){
    const spine=intel.activeRosterSpine||{},truth=opponentIntelSourceTruth(intel),conflicts=safeArr(intel?.depthChart?.conflicts),practice=safeArr(intel?.rosterGroupContext?.practiceSquad);
    const qb=spine.quarterback||{},rb=spine.runningBack||{},receivers=safeArr(spine.receivers),oline=safeArr(spine.offensiveLine);
    const conflictNames=conflicts.map(item=>item.subject).filter(Boolean).join(' · ');
    return `<section class="v15-addon-panel v15-intel-desk v161-opponent-scout" data-v161-opponent="${esc(VERSION)}" aria-labelledby="v161-opponent-title"><header><div><small>OPPONENT SCOUT · SOURCE QUALIFIED</small><h3 id="v161-opponent-title">${esc(intel.opponent)} · Week ${esc(intel.game?.week)} verified snapshot</h3></div><span class="v15-intel-network">${esc(String(truth.status||'audited').replaceAll('-',' ').toUpperCase())}</span></header><p class="v15-intel-kickoff">Audited ${esc(intel.asOf)} · ${esc(intel.game?.venue)} · ${esc(intel.game?.network)}</p><div class="v15-intel-grid"><section class="v15-intel-lane confirmed"><div class="v15-intel-status">ACTIVE ROSTER SPINE</div><article class="v15-intel-item"><strong>QB · ${esc(qb.starter||'TBD')}</strong><p>Backup: ${esc(qb.backup||'TBD')}</p></article><article class="v15-intel-item"><strong>RB · ${esc(rb.lead||'TBD')}</strong><p>Primary depth: ${esc(safeArr(rb.depth).join(' · ')||'not loaded')}</p></article><article class="v15-intel-item"><strong>Pass game</strong><p>${esc(receivers.slice(0,4).join(' · ')||'not loaded')}</p></article><article class="v15-intel-item"><strong>Starting OL snapshot</strong><p>${esc(oline.join(' · ')||'not loaded')}</p></article></section><section class="v15-intel-lane practice"><div class="v15-intel-status">ROSTER-GROUP TRUTH</div><article class="v15-intel-item"><strong>Kicker · ${esc(spine.kicker||'TBD')}</strong><p>Official post-cutdown active-roster evidence controls the current kicker role.</p></article><article class="v15-intel-item"><strong>Practice squad context</strong><p>${esc(practice.join(' · ')||'No audited practice-squad conflicts loaded.')}</p></article><article class="v15-intel-item"><strong>Depth-chart conflicts · ${esc(conflicts.length)}</strong><p>${esc(conflictNames||'None detected')}. The Jets label their depth chart unofficial, so current roster-group evidence wins when pages disagree.</p></article></section><section class="v15-intel-lane formal"><div class="v15-intel-status">AVAILABILITY BOUNDARY</div><article class="v15-intel-item"><strong>${esc(String(intel.availability?.status||'status unknown').replaceAll('-',' '))}</strong><p>${esc(intel.availability?.note||'No availability note loaded.')}</p></article>${sourceLinks()}</section></div><p class="v15-addon-note"><b>Opponent evidence boundary:</b> this is a dated, source-audited Week 1 snapshot. It does not turn practice context into an injury designation, and it does not treat an unofficial depth chart as active-roster authority.</p></section>`;
  }

  function matchingDesk(){
    if(route()!=='command')return null;
    const root=app?.querySelector('.v15-addon-root[data-tab="changes"]');
    const desk=root?.querySelector('.v15-intel-desk:not(.v161-opponent-scout)');
    if(!root||!desk)return null;
    const text=String(desk.textContent||'').toLowerCase();
    if(!text.includes(String(intel.opponent||'').toLowerCase()))return null;
    if(!text.includes(`week ${String(intel.game?.week||'')}`.toLowerCase()))return null;
    return desk;
  }

  function render(){
    const existing=app?.querySelector('.v161-opponent-scout');
    const desk=matchingDesk();
    if(!desk){existing?.remove();return;}
    if(existing?.dataset.v161Opponent===VERSION&&existing.previousElementSibling===desk)return;
    existing?.remove();
    const template=document.createElement('template');
    template.innerHTML=panelHtml().trim();
    const panel=template.content.firstElementChild;
    if(panel)desk.insertAdjacentElement('afterend',panel);
  }

  const delayedRender=delay=>setTimeout(render,delay);
  window.addEventListener('hashchange',()=>delayedRender(220),{passive:true});
  window.addEventListener('popstate',()=>delayedRender(220),{passive:true});
  document.addEventListener('click',event=>{if(event.target?.closest?.('[data-v15-tab]'))delayedRender(90)},true);
  delayedRender(260);
})();
