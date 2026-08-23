(() => {
  'use strict';

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!runtime||!app)return;

  const BRIEFS={
    pre2:{
      teamDate:'2026-08-23',
      opponentAbbr:'SEA',
      eyebrow:'TONIGHT IN NASHVILLE',
      title:'Seahawks at Titans',
      facts:[
        'Kickoff is 7:00 PM CT on FOX. Titans radio is WGFX 104.5 FM The Zone.',
        'Parking lots open at 3 PM CT and Nissan Stadium gates open at 5 PM CT.',
        'Robert Saleh said he anticipates the starters playing roughly 20–25 plays, potentially until halftime.'
      ],
      guideUrl:'https://www.tennesseetitans.com/stadium/gameday/',
      previewUrl:'https://www.tennesseetitans.com/news/six-things-to-watch-for-the-titans-in-sunday-s-preseason-game-vs-the-seahawks',
      tuneUrl:'https://www.tennesseetitans.com/news/seattle-seahawks-vs-tennessee-titans-how-to-watch-listen-and-live-stream-x1296'
    }
  };

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const teamDate=value=>{
    const date=new Date(value);
    if(Number.isNaN(date.getTime()))return'';
    const parts=new Intl.DateTimeFormat('en-US',{timeZone:runtime.teamTimeZone||'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
    const valueOf=type=>parts.find(part=>part.type===type)?.value||'';
    return `${valueOf('year')}-${valueOf('month')}-${valueOf('day')}`;
  };
  const today=()=>teamDate(Date.now());

  function ensureStyle(){
    if(document.querySelector('#gameday-today-v22-style'))return;
    const style=document.createElement('style');
    style.id='gameday-today-v22-style';
    style.textContent=`
      .v22-today-brief{margin:16px 0;padding:18px;border:1px solid rgba(75,146,219,.46);border-radius:16px;background:linear-gradient(135deg,rgba(75,146,219,.16),rgba(12,35,64,.72));display:grid;gap:14px}
      .v22-today-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
      .v22-today-head small,.v22-today-fact small{font-size:.7rem;letter-spacing:.11em;text-transform:uppercase;color:#8fc8ff;font-weight:900}
      .v22-today-head h3{margin:4px 0 0;font-size:clamp(1.25rem,3vw,1.7rem)}
      .v22-today-live{padding:7px 10px;border-radius:999px;background:rgba(237,23,76,.13);border:1px solid rgba(237,23,76,.38);font-size:.76rem;font-weight:900;letter-spacing:.07em;text-transform:uppercase;white-space:nowrap}
      .v22-today-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
      .v22-today-fact{padding:12px;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:rgba(0,0,0,.12);display:grid;gap:6px;line-height:1.45}
      .v22-today-fact span{color:var(--muted,#a8b8c8)}
      .v22-today-actions{display:flex;gap:9px;flex-wrap:wrap;align-items:center}
      .v22-today-actions a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 13px;border:1px solid rgba(75,146,219,.4);border-radius:999px;color:#8fc8ff;font-weight:900;text-decoration:none}
      .v22-today-actions a:first-child{background:#4b92db;color:#071629;border-color:#4b92db}
      .v22-today-source{margin-left:auto;color:var(--muted,#a8b8c8);font-size:.76rem}
      @media(max-width:759px){.v22-today-head{flex-direction:column}.v22-today-facts{grid-template-columns:1fr}.v22-today-actions{display:grid;grid-template-columns:1fr}.v22-today-actions a{min-height:48px;width:100%}.v22-today-source{margin-left:0;text-align:center}}
      @media(prefers-reduced-motion:reduce){.v22-today-brief *{animation:none!important;transition:none!important}}
    `;
    document.head.append(style);
  }

  function briefMarkup(brief){
    return `<section class="v22-today-brief" aria-label="Official same-day game brief"><div class="v22-today-head"><div><small>${esc(brief.eyebrow)}</small><h3>${esc(brief.title)}</h3></div><span class="v22-today-live">Game day</span></div><div class="v22-today-facts">${brief.facts.map((fact,index)=>`<div class="v22-today-fact"><small>${index===0?'WATCH / LISTEN':index===1?'AT THE STADIUM':'ON THE FIELD'}</small><span>${esc(fact)}</span></div>`).join('')}</div><div class="v22-today-actions"><a href="#media">Open Listen / Watch</a><a href="${esc(brief.guideUrl)}" target="_blank" rel="noopener noreferrer">Official game guide ↗</a><a href="${esc(brief.previewUrl)}" target="_blank" rel="noopener noreferrer">Official preview ↗</a><span class="v22-today-source">Verified from TennesseeTitans.com · Aug. 22–23</span></div></section>`;
  }

  async function mount(){
    if(runtime.route()!=='live')return;
    const phase=app.querySelector('.v16-gd-phase:not(.live):not(.post)');
    if(!phase||phase.querySelector('.v22-today-brief'))return;
    const data=await runtime.apiJson('/api/data',{ttl:30000});
    if(runtime.route()!=='live'||!phase.isConnected)return;
    const games=Array.isArray(data?.games)?data.games:[];
    const game=games.find(item=>BRIEFS[item.id]);
    const brief=game?BRIEFS[game.id]:null;
    if(!brief||game.opponentAbbr!==brief.opponentAbbr)return;
    const kickoff=Date.parse(game.date);
    if(!Number.isFinite(kickoff)||Date.now()>=kickoff)return;
    if(teamDate(game.date)!==brief.teamDate||today()!==brief.teamDate)return;
    ensureStyle();
    const tune=phase.querySelector('.v16-gd-tune');
    if(tune)tune.insertAdjacentHTML('afterend',briefMarkup(brief));
    else phase.querySelector(':scope > header')?.insertAdjacentHTML('afterend',briefMarkup(brief));
  }

  runtime.onAppRender(()=>queueMicrotask(mount),{immediate:true});
  runtime.onRoute(current=>{if(current==='live')queueMicrotask(mount)});
})();
