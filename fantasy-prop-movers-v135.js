(() => {
  'use strict';
  const ROUTE='fantasy',ROOT='#fantasy-live-props-v122';
  const MODES=new Set(['all','moved','roster']);
  const state={mode:'all'};
  const app=document.querySelector('#app');
  let observer=null,queued=false;

  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const clean=value=>String(value??'').trim();
  const esc=value=>clean(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const resumeObserver=()=>{if(observer&&app)observer.observe(app,{childList:true,subtree:true})};
  const moved=row=>Boolean(row.querySelector('.fprop-trend-badge.is-up,.fprop-trend-badge.is-down'));
  const rostered=row=>Boolean(row.querySelector('.frp-roster-badge'));
  const starter=row=>Boolean(row.querySelector('.frp-roster-badge.is-starter'));
  const rosterReady=()=>Boolean(window.TitansFantasyRosterContext?.matched);

  function moverQuotes(rows){
    const found=[];
    for(const row of rows){
      const player=clean(row.querySelector('.fprop-player strong')?.textContent);
      const market=clean(row.querySelector('.fprop-player span')?.textContent);
      for(const quote of row.querySelectorAll('.fprop-quote:not(.is-empty)')){
        const badge=quote.querySelector('.fprop-trend-badge.is-up,.fprop-trend-badge.is-down');
        if(!badge)continue;
        const match=clean(badge.textContent).match(/^Line (up|down) ([0-9]+(?:\.[0-9]+)?)$/i);
        if(!match)continue;
        found.push({
          player,
          market,
          book:clean(quote.querySelector(':scope > strong')?.textContent),
          direction:match[1].toLowerCase(),
          delta:Number(match[2]),
          roster:rostered(row),
          starter:starter(row)
        });
      }
    }
    return found.sort((a,b)=>b.delta-a.delta||Number(b.starter)-Number(a.starter)||a.player.localeCompare(b.player));
  }

  function injectStyle(){
    if(document.querySelector('style[data-fantasy-prop-movers-v135]'))return;
    const style=document.createElement('style');style.dataset.fantasyPropMoversV135='true';style.textContent=`
      .fpm-movers-lens{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;margin:0 0 14px;padding:13px 14px;border:1px solid rgba(75,146,219,.24);border-radius:14px;background:linear-gradient(135deg,rgba(75,146,219,.1),rgba(12,36,61,.62))}
      .fpm-movers-copy strong,.fpm-movers-copy span{display:block}.fpm-movers-copy strong{color:#f5f8fb;font-size:.88rem}.fpm-movers-copy span{margin-top:3px;color:#9db1c5;font-size:.77rem;line-height:1.4}.fpm-leader{margin-top:7px!important;color:#cfe8ff!important}.fpm-leader b{color:#fff}.fpm-leader em{font-style:normal;color:#7eb8ee;font-weight:900}
      .fpm-movers-actions{display:grid;grid-template-columns:repeat(3,max-content);gap:7px}.fpm-movers-actions button{min-height:44px;border:1px solid rgba(126,184,238,.32);border-radius:10px;padding:0 11px;background:#102c49;color:#eaf5ff;font:inherit;font-size:.76rem;font-weight:900;cursor:pointer}.fpm-movers-actions button:hover{background:#183b60}.fpm-movers-actions button:focus-visible{outline:3px solid #7eb8ee;outline-offset:2px}.fpm-movers-actions button[aria-pressed="true"]{background:#4b92db;color:#071321}.fpm-movers-actions button:disabled{opacity:.48;cursor:not-allowed}.fprop-row.is-filtered-by-movers{display:none!important}
      @media(max-width:760px){.fpm-movers-lens{grid-template-columns:1fr;align-items:stretch}.fpm-movers-actions{grid-template-columns:repeat(3,1fr)}.fpm-movers-actions button{min-height:48px}}
      @media(max-width:430px){.fpm-movers-actions{grid-template-columns:1fr}.fpm-movers-copy strong{font-size:.92rem}.fpm-movers-copy span{font-size:.8rem}}
      @media(forced-colors:active){.fpm-movers-lens,.fpm-movers-actions button{border:1px solid CanvasText}}
    `;document.head.append(style);
  }

  function ensureLens(root){
    let lens=root.querySelector('.fpm-movers-lens');
    if(!lens){lens=document.createElement('section');lens.className='fpm-movers-lens';lens.setAttribute('aria-label','Observed prop movers');lens.setAttribute('aria-live','polite')}
    const anchor=root.querySelector('.frp-roster-tools')||root.querySelector('.fprop-trend-summary')||root.querySelector('.fprop-controls');
    if(anchor&&lens.previousElementSibling!==anchor)anchor.insertAdjacentElement('afterend',lens);
    return lens;
  }

  function summaryMarkup(rows,quotes){
    const movedRows=rows.filter(moved),rosterRows=movedRows.filter(rostered),starterRows=movedRows.filter(starter),canRoster=rosterReady();
    const leader=quotes[0];
    const rosterSummary=canRoster?`${rosterRows.length} on your roster · ${starterRows.length} starter${starterRows.length===1?'':'s'}`:'Sleeper roster not connected';
    const rosterTag=canRoster&&leader?.starter?' · MY STARTER':canRoster&&leader?.roster?' · MY ROSTER':'';
    const leaderText=leader?`<span class="fpm-leader">Largest observed change: <b>${esc(leader.player)}</b> · ${esc(leader.market)} · ${esc(leader.book)} <em>${leader.direction==='up'?'↑':'↓'} ${esc(leader.delta)}</em>${rosterTag}</span>`:`<span class="fpm-leader">No previously observed line changes yet. Recheck later to compare against this browser’s saved observations.</span>`;
    return `<div class="fpm-movers-copy"><strong>${movedRows.length} moved prop${movedRows.length===1?'':'s'} · ${rosterSummary}</strong><span>Movement is ranked only by absolute line change previously observed in this browser. No market history or projection is inferred.</span>${leaderText}</div><div class="fpm-movers-actions" role="group" aria-label="Observed prop mover filter"><button type="button" data-fpm-mode="all" aria-pressed="${state.mode==='all'}">All props</button><button type="button" data-fpm-mode="moved" aria-pressed="${state.mode==='moved'}">Moved only</button><button type="button" data-fpm-mode="roster" aria-pressed="${state.mode==='roster'}"${canRoster?'':' disabled title="Connect Sleeper to filter roster movers"'}>My roster movers</button></div>`;
  }

  function applyFilter(rows){
    for(const row of rows){
      const hide=state.mode==='moved'?!moved(row):state.mode==='roster'?!(moved(row)&&rostered(row)):false;
      row.classList.toggle('is-filtered-by-movers',hide);
    }
  }

  function decorate(){
    if(route()!==ROUTE)return;
    const root=document.querySelector(ROOT);if(!root)return;
    observer?.disconnect();
    try{
      injectStyle();
      const rows=[...root.querySelectorAll('.fprop-row')];
      if(state.mode==='roster'&&!rosterReady())state.mode='moved';
      const quotes=moverQuotes(rows);
      applyFilter(rows);
      const lens=ensureLens(root),markup=summaryMarkup(rows,quotes);
      if(lens.dataset.signature!==markup){lens.innerHTML=markup;lens.dataset.signature=markup}
      lens.querySelectorAll('[data-fpm-mode]').forEach(button=>button.addEventListener('click',()=>{
        const next=button.dataset.fpmMode;
        if(!MODES.has(next)||(next==='roster'&&!rosterReady()))return;
        state.mode=next;decorate();
      },{once:true}));
    }finally{resumeObserver()}
  }

  const queue=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;decorate()})};
  observer=new MutationObserver(queue);resumeObserver();
  addEventListener('hashchange',()=>{if(route()!==ROUTE)state.mode='all';queue()});
  addEventListener('titans:fantasy-roster-context',queue);
  queue();
  window.TitansFantasyPropMovers={moverQuotes,setMode:mode=>{if(MODES.has(mode)){state.mode=mode;decorate()}}};
})();
