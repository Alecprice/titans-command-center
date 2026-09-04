(() => {
  'use strict';

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!runtime||!app)return;

  const MOBILE_TICKETS='https://www.tennesseetitans.com/tickets/mobile-tickets/';
  const TITANS_APP='https://www.tennesseetitans.com/fans/mobile-app/';
  const STADIUM_POLICIES='https://www.tennesseetitans.com/stadium/policies';

  function ensureStyle(){
    if(document.querySelector('#gameday-entry-ready-v185-style'))return;
    const style=document.createElement('style');
    style.id='gameday-entry-ready-v185-style';
    style.textContent=`
      .v185-entry-ready{padding:14px 15px;border:1px solid rgba(75,146,219,.32);border-radius:13px;background:rgba(75,146,219,.07);display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px 18px;align-items:center}
      .v185-entry-copy{display:grid;gap:5px}.v185-entry-copy small{font-size:.7rem;letter-spacing:.11em;text-transform:uppercase;color:#8fc8ff;font-weight:900}.v185-entry-copy strong{font-size:.98rem;line-height:1.35}.v185-entry-copy p{margin:0;color:var(--muted,#a8b8c8);font-size:.82rem;line-height:1.5}
      .v185-entry-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.v185-entry-actions a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 12px;border:1px solid rgba(75,146,219,.4);border-radius:999px;color:#8fc8ff;font-size:.8rem;font-weight:900;text-decoration:none}.v185-entry-actions a:first-child{background:#4b92db;color:#071629;border-color:#4b92db}.v185-entry-actions a:focus-visible{outline:3px solid rgba(143,200,255,.55);outline-offset:2px}
      @media(max-width:759px){.v185-entry-ready{grid-template-columns:1fr;padding:13px}.v185-entry-actions{display:grid;grid-template-columns:1fr}.v185-entry-actions a{min-height:48px;width:100%}}
      @media(prefers-reduced-motion:reduce){.v185-entry-ready *{animation:none!important;transition:none!important}}
    `;
    document.head.append(style);
  }

  function markup(){
    return `<aside class="v185-entry-ready" aria-label="Nissan Stadium mobile entry readiness"><div class="v185-entry-copy"><small>ENTRY READY</small><strong>Have the official mobile ticket open before you reach the gate.</strong><p>Titans home-game gates open two hours before kickoff. Screenshots and PDF printouts are not accepted for entry. If your mobile ticket needs help on game day, official guidance directs fans to the Gate 1 ticket windows or a mobile ticket specialist outside an entrance.</p></div><div class="v185-entry-actions"><a href="${MOBILE_TICKETS}" target="_blank" rel="noopener noreferrer">Mobile ticket guide ↗</a><a href="${TITANS_APP}" target="_blank" rel="noopener noreferrer">Titans + Stadium app ↗</a><a href="${STADIUM_POLICIES}" target="_blank" rel="noopener noreferrer">Entry policies ↗</a></div></aside>`;
  }

  function mount(){
    if(runtime.route()!=='live')return false;
    const guide=app.querySelector('.v22-home-guide');
    if(!guide)return false;
    if(guide.querySelector('.v185-entry-ready'))return true;
    ensureStyle();
    const grid=guide.querySelector('.v22-home-grid');
    if(grid)grid.insertAdjacentHTML('beforebegin',markup());
    else guide.insertAdjacentHTML('beforeend',markup());
    return true;
  }

  runtime.onAppRender(()=>queueMicrotask(mount),{immediate:true});
  runtime.onRoute(route=>{if(route==='live')queueMicrotask(mount)});
  runtime.onRefresh(()=>{if(runtime.route()==='live')queueMicrotask(mount)});
})();
