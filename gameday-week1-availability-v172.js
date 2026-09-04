import {feed,games} from './src/data.mjs';

(() => {
  'use strict';

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!runtime||!app||window.__TitansWeek1AvailabilityV172)return;
  window.__TitansWeek1AvailabilityV172=true;

  const REPORTING_WINDOW_START=Date.parse('2026-09-09T00:00:00-05:00');
  const MAX_LEAD_MS=21*24*60*60*1000;
  const OFFICIAL_HOSTS=new Set(['www.tennesseetitans.com','operations.nfl.com']);
  const NFL_REPORTING_SOURCE='https://operations.nfl.com/calendar-events/nfl-important-dates';
  const MAX_SETTLE_FRAMES=10;
  let generation=0;

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const route=()=>runtime.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';
  const arr=value=>Array.isArray(value)?value:[];
  const topics=item=>new Set(arr(item?.topics).map(value=>String(value).toLowerCase()));
  const exactWeek1=game=>Boolean(game&&Number(game.week)===1&&String(game.opponentAbbr||'').toUpperCase()==='NYJ'&&String(game.date||'')==='2026-09-13T17:00:00Z');
  const withinContextWindow=game=>{
    const kickoff=Date.parse(game?.date),now=Date.now();
    return Number.isFinite(kickoff)&&now<REPORTING_WINDOW_START&&kickoff-now>0&&kickoff-now<=MAX_LEAD_MS;
  };
  const safeUrl=value=>{
    try{const url=new URL(String(value||''));return url.protocol==='https:'&&OFFICIAL_HOSTS.has(url.hostname)?url.href:''}catch{return''}
  };
  const sourceLink=(url,label)=>{
    const href=safeUrl(url);
    return href?`<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`:'';
  };
  const remove=()=>app.querySelector('[data-v172-titans-availability]')?.remove();

  function evidenceRows(){
    return arr(feed).filter(item=>{
      const itemTopics=topics(item);
      if(!itemTopics.has('week-1'))return false;
      return item?.evidence==='practice-observation'||(item?.evidence==='coach-confirmed'&&itemTopics.has('starter'));
    }).sort((a,b)=>Date.parse(b?.publishedAt||0)-Date.parse(a?.publishedAt||0));
  }

  function evidenceLabel(item){
    return item?.evidence==='coach-confirmed'?'COACH-CONFIRMED LINEUP':'PRACTICE CONTEXT · NOT GAME STATUS';
  }

  function card(item){
    return `<article class="v172-availability-item"><small>${esc(evidenceLabel(item))}</small><strong>${esc(item?.title||'Official Titans update')}</strong><p>${esc(item?.summary||'No summary loaded.')}</p>${sourceLink(item?.url,'Official Titans source')}</article>`;
  }

  function ensureStyle(){
    if(document.querySelector('#gameday-week1-availability-v172-style'))return;
    const style=document.createElement('style');
    style.id='gameday-week1-availability-v172-style';
    style.textContent=`
      .v172-availability{margin:14px 0;padding:18px;border:1px solid rgba(75,146,219,.34);border-radius:16px;background:linear-gradient(180deg,rgba(75,146,219,.09),rgba(7,22,41,.96));display:grid;gap:14px}
      .v172-availability>header{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.v172-availability>header small,.v172-availability-item small{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:#8fc8ff;font-weight:900}.v172-availability h3{margin:4px 0 0}.v172-availability-badge{padding:7px 10px;border-radius:999px;border:1px solid rgba(245,190,75,.4);background:rgba(245,190,75,.1);font-size:.72rem;font-weight:900;letter-spacing:.07em;text-transform:uppercase;white-space:nowrap}
      .v172-availability-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.v172-availability-item{padding:14px;border:1px solid rgba(255,255,255,.09);border-radius:13px;background:rgba(255,255,255,.035);display:grid;gap:7px}.v172-availability-item strong{line-height:1.35}.v172-availability-item p,.v172-availability-note{margin:0;color:var(--muted,#a8b8c8);line-height:1.5}.v172-availability-item a,.v172-availability-policy{width:max-content;min-height:44px;display:inline-flex;align-items:center;color:#8fc8ff;font-weight:900;text-decoration:none}.v172-availability-item a:focus-visible,.v172-availability-policy:focus-visible{outline:3px solid rgba(143,200,255,.55);outline-offset:2px}.v172-availability-note{padding:12px 14px;border-left:3px solid rgba(245,190,75,.72);background:rgba(245,190,75,.06);border-radius:0 10px 10px 0}.v172-availability-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.v172-availability-actions span{margin-left:auto;color:var(--muted,#a8b8c8);font-size:.76rem}
      @media(max-width:759px){.v172-availability{padding:14px}.v172-availability>header{flex-direction:column}.v172-availability-grid{grid-template-columns:1fr}.v172-availability-item a,.v172-availability-policy{min-height:48px;width:100%;justify-content:center}.v172-availability-actions{display:grid;grid-template-columns:1fr}.v172-availability-actions span{margin-left:0;text-align:center}.v172-availability-badge{white-space:normal}}
      @media(prefers-reduced-motion:reduce){.v172-availability *{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
      @media(forced-colors:active){.v172-availability,.v172-availability-item,.v172-availability-note{border-color:CanvasText}.v172-availability-item a,.v172-availability-policy{color:LinkText}}
    `;
    document.head.append(style);
  }

  function markup(game){
    const rows=evidenceRows();
    if(!rows.length)return'';
    return `<section class="v172-availability" data-v172-titans-availability aria-label="Titans Week 1 availability context"><header><div><small>WEEK 1 · TITANS AVAILABILITY CONTEXT</small><h3>What is known before formal game-week reporting</h3></div><span class="v172-availability-badge">Practice context only</span></header><div class="v172-availability-grid">${rows.map(card).join('')}</div><p class="v172-availability-note"><strong>Truth boundary:</strong> these official team practice and coach updates are context, not formal Week 1 game-status designations. This panel does not infer Questionable, Doubtful, or Out from stiffness, soreness, missed practice time, or a return to practice.</p><div class="v172-availability-actions">${sourceLink(NFL_REPORTING_SOURCE,'NFL reporting calendar')}<span>Game-week reporting takes over beginning Sept. 9 for the Sunday opener.</span></div></section>`;
  }

  function mount(currentGeneration){
    if(currentGeneration!==generation||route()!=='live'){remove();return true}
    const focus=runtime.scheduleFocus?.(games,new Date())||{};
    const game=focus.next||focus.game||null;
    if(!exactWeek1(game)||!withinContextWindow(game)){remove();return true}
    const shell=app.querySelector('.v16-gameday');
    if(!shell)return false;
    if(shell.querySelector('[data-v172-titans-availability]'))return true;
    ensureStyle();
    const holder=document.createElement('div');
    holder.innerHTML=markup(game).trim();
    const panel=holder.firstElementChild;
    if(!panel)return true;
    const phase=shell.querySelector('.v16-gd-phase');
    if(phase)phase.insertAdjacentElement('afterend',panel);else shell.prepend(panel);
    return true;
  }

  function schedule(){
    const currentGeneration=++generation;
    let frame=0;
    const settle=()=>{
      if(currentGeneration!==generation)return;
      const done=mount(currentGeneration);
      if(done||currentGeneration!==generation||++frame>=MAX_SETTLE_FRAMES)return;
      requestAnimationFrame(settle);
    };
    requestAnimationFrame(settle);
  }

  runtime.onRoute(schedule,{immediate:true});
  runtime.onAppRender(schedule,{immediate:true});
})();
