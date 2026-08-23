(() => {
  'use strict';
  const STORE='titans-fantasy-v1',PENDING='titans-fantasy-pending-question-v1';
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=v=>String(v??'').toLowerCase().replace(/[^a-z0-9/]+/g,' ').trim();
  const readState=()=>{try{const raw=JSON.parse(localStorage.getItem(STORE)||'{}');return raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{}}catch{return {}}};
  const fantasyIntent=query=>{
    const q=clean(query);if(!q)return false;
    return /\bfantasy\b|\bwaiver\b|\blineup\b|\bflex\b|\bppr\b|\bhalf ppr\b|\bstart\s*\/\s*sit\b|\bstart or sit\b|\bwho should i start\b|\bshould i start\b/.test(q);
  };
  const scoringLabel=value=>value==='ppr'?'PPR':value==='standard'?'Standard':'Half PPR';
  const savePending=query=>{try{localStorage.setItem(PENDING,String(query||'').trim().slice(0,160))}catch{}};
  function render(query){
    const root=document.querySelector('.v17-ask'),out=root?.querySelector('[data-v17-result]');if(!root||!out)return false;
    const s=readState(),manual=Array.isArray(s.manual)?s.manual.slice(0,40):[],connected=Boolean(String(s.sleeperUser||'').trim()&&String(s.leagueId||'').trim());
    savePending(query);
    out.innerHTML=`<article class="v17-ask-answer" data-fantasy-ask-bridge="ready"><div class="v17-answer-top"><span>FANTASY HANDOFF</span><b>Evidence workspace</b></div><h4>Use Fantasy Decision Center for this one.</h4><div class="v17-why"><small>WHY IT MATTERS</small><p>Start/sit and waiver choices depend on league context. Command Center will carry this question into the fantasy workspace and compare loaded evidence without inventing a point projection or guarantee.</p></div><div class="v17-ask-facts"><div><small>Scoring preset</small><strong>${esc(scoringLabel(s.scoring))}</strong></div><div><small>Sleeper league</small><strong>${connected?'Connected':'Not connected'}</strong></div><div><small>Saved fantasy players</small><strong>${manual.length}</strong></div></div><div class="v17-ask-sources"><small>SOURCE + CONTEXT</small><div><div><strong>Fantasy Command</strong><span>Device-local scoring, roster selections and read-only Sleeper context when connected</span></div><em>No projection generated</em></div></div><a class="button primary v17-answer-action" href="#fantasy">Open Decision Center →</a></article>`;
    return true;
  }
  function intercept(query,event){if(route()!=='fan'||!fantasyIntent(query))return false;event?.preventDefault?.();event?.stopImmediatePropagation?.();return render(query)}
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('.v17-ask [data-v17-ask],.v17-ask [data-v17-q]');if(!button)return;
    const root=button.closest('.v17-ask'),input=root?.querySelector('#v17-ask-input');
    const query=button.dataset.v17Q||input?.value||'';intercept(query,event);
  },true);
  document.addEventListener('keydown',event=>{
    if(event.key!=='Enter')return;const input=event.target.closest?.('.v17-ask #v17-ask-input');if(!input)return;intercept(input.value,event);
  },true);
})();
