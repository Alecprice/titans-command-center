(() => {
  'use strict';

  if(window.__TitansHomeCommandV123)return;
  window.__TitansHomeCommandV123=true;

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!runtime||!app)return;

  let data=null;
  let loading=null;

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const rows=value=>Array.isArray(value)?value:[];
  const route=()=>runtime.route();

  function ensureStyles(){
    if(document.querySelector('#home-command-v123-style'))return;
    const style=document.createElement('style');
    style.id='home-command-v123-style';
    style.textContent=`
      .home-command-v123{margin:14px 0 20px;padding:14px;border:1px solid rgba(134,210,255,.24);border-radius:20px;background:linear-gradient(145deg,rgba(6,24,42,.96),rgba(12,35,64,.9) 54%,rgba(31,76,118,.82));box-shadow:0 18px 42px rgba(0,0,0,.2);overflow:hidden;position:relative}
      .home-command-v123:before{content:"";position:absolute;inset:0 auto 0 0;width:4px;background:linear-gradient(#c8102e 0 38%,#4b92db 38% 76%,#8ad8f8 76%);opacity:.92}
      .home-command-v123-head{display:flex;justify-content:space-between;align-items:end;gap:16px;padding:2px 4px 12px 8px}
      .home-command-v123-head small,.home-command-v123-kicker{display:block;color:#8ad8f8;font-size:11px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}
      .home-command-v123-head h2{margin:4px 0 0;color:#fff;font-size:clamp(1.15rem,2vw,1.45rem);letter-spacing:-.02em}
      .home-command-v123-head p{margin:0;max-width:470px;color:#bed3e4;font-size:.82rem;line-height:1.45;text-align:right}
      .home-command-v123-grid{display:grid;grid-template-columns:minmax(0,1.24fr) minmax(300px,.86fr);gap:12px}
      .home-command-v123-focus{min-width:0;padding:18px;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:linear-gradient(125deg,rgba(75,146,219,.16),rgba(3,18,33,.42));position:relative;overflow:hidden}
      .home-command-v123-focus:after{content:"TEN";position:absolute;right:12px;bottom:-25px;color:rgba(255,255,255,.035);font-size:6.5rem;font-weight:1000;letter-spacing:-.08em;pointer-events:none}
      .home-command-v123-matchup{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:start;position:relative;z-index:1}
      .home-command-v123-matchup h3{margin:5px 0 5px;color:#fff;font-size:clamp(1.25rem,3.1vw,2rem);line-height:1.05;letter-spacing:-.035em}
      .home-command-v123-matchup p{margin:0;color:#c9d8e5;font-size:.84rem;line-height:1.5}
      .home-command-v123-opponent{display:grid;place-items:center;min-width:72px;min-height:72px;padding:8px;border:1px solid rgba(138,216,248,.3);border-radius:16px;background:rgba(0,0,0,.22);color:#fff;font-size:1.25rem;font-weight:1000;letter-spacing:.04em}
      .home-command-v123-meta{display:flex;flex-wrap:wrap;gap:7px;margin:15px 0 0;position:relative;z-index:1}
      .home-command-v123-meta span{padding:6px 9px;border-radius:999px;background:rgba(255,255,255,.075);color:#d7e5ef;font-size:.73rem;font-weight:800}
      .home-command-v123-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:15px;position:relative;z-index:1}
      .home-command-v123-action{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 15px;border:1px solid rgba(138,216,248,.35);border-radius:12px;background:#4b92db;color:#07192a;text-decoration:none;font-size:.8rem;font-weight:950;letter-spacing:.01em}
      .home-command-v123-action.secondary{background:rgba(255,255,255,.055);color:#f5fbff}
      .home-command-v123-action:hover{transform:translateY(-1px);filter:brightness(1.06)}
      .home-command-v123-launch{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
      .home-command-v123-link{display:flex;min-width:0;min-height:88px;padding:12px;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:rgba(255,255,255,.045);color:#f7fbff;text-decoration:none;flex-direction:column;justify-content:space-between;transition:border-color .15s ease,background .15s ease,transform .15s ease}
      .home-command-v123-link:hover{transform:translateY(-1px);border-color:rgba(138,216,248,.45);background:rgba(75,146,219,.12)}
      .home-command-v123-link small{color:#8ad8f8;font-size:10px;font-weight:950;letter-spacing:.1em;text-transform:uppercase}
      .home-command-v123-link strong{display:block;margin:4px 0 2px;color:#fff;font-size:.9rem;line-height:1.15}
      .home-command-v123-link span{color:#b9cedd;font-size:.71rem;line-height:1.32}
      .home-command-v123-link b{margin-top:7px;color:#d8f1ff;font-size:.72rem}
      .home-command-v123 a:focus-visible{outline:3px solid #fff;outline-offset:2px}
      @media(max-width:760px){
        .home-command-v123{margin-top:10px;padding:11px;border-radius:17px}
        .home-command-v123-head{align-items:start;flex-direction:column;gap:4px;padding:2px 4px 10px 7px}
        .home-command-v123-head p{max-width:none;text-align:left;font-size:.78rem}
        .home-command-v123-grid{grid-template-columns:1fr}
        .home-command-v123-focus{padding:15px}
        .home-command-v123-matchup{gap:10px}
        .home-command-v123-opponent{min-width:62px;min-height:62px;border-radius:14px}
        .home-command-v123-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}
        .home-command-v123-action{width:100%;padding-inline:9px}
        .home-command-v123-launch{grid-template-columns:repeat(2,minmax(0,1fr))}
        .home-command-v123-link{min-height:86px;padding:11px}
      }
      @media(max-width:390px){
        .home-command-v123-matchup h3{font-size:1.2rem}
        .home-command-v123-opponent{min-width:56px;min-height:56px;font-size:1.05rem}
        .home-command-v123-link strong{font-size:.83rem}
        .home-command-v123-link span{font-size:.69rem}
      }
      @media(prefers-reduced-motion:reduce){.home-command-v123 a{transition:none!important}.home-command-v123 a:hover{transform:none!important}}
    `;
    document.head.appendChild(style);
  }

  async function load(force=false){
    if(data&&!force)return data;
    if(loading)return loading;
    loading=runtime.apiJson('/api/data',{ttl:30000,force}).then(value=>{
      if(value?.ok)data=value;
      return data;
    }).catch(()=>data).finally(()=>{
      loading=null;
      mount();
    });
    return loading;
  }

  function weekLabel(game){
    const value=String(game?.week??'').trim();
    if(!value)return 'Titans football';
    return value.startsWith('P')?`Preseason ${value.slice(1)}`:`Week ${value}`;
  }

  function countdown(game,state){
    if(state==='game-window')return 'Game window';
    const kickoff=new Date(game?.date).getTime();
    if(!Number.isFinite(kickoff)||game?.dateTbd)return 'Kickoff TBD';
    const diff=kickoff-Date.now();
    if(diff<=0)return 'Kickoff window';
    const hours=Math.ceil(diff/3600000);
    if(hours<24)return `${hours}h to kickoff`;
    const days=Math.ceil(diff/86400000);
    return `${days}d to kickoff`;
  }

  function kickoffLabel(game){
    if(!game||game.dateTbd||!game.date)return 'Time TBD';
    return runtime.formatTeamKickoff?.(game.date)||'Time TBD';
  }

  function focusActions(game,state){
    if(state==='game-window')return [
      {href:'#live',label:'Open Game Day'},
      {href:'#media',label:'Watch / Listen',secondary:true}
    ];
    if(game?.homeAway==='home')return [
      {href:'#tickets',label:'Find tickets'},
      {href:'#live',label:'Game Day plan',secondary:true}
    ];
    if(game)return [
      {href:'#media',label:'Watch / Listen'},
      {href:'#live',label:'Game Day plan',secondary:true}
    ];
    return [
      {href:'#games',label:'Open schedule'},
      {href:'#feed',label:'Latest intel',secondary:true}
    ];
  }

  function focusMarkup(){
    const games=rows(data?.games);
    const focus=runtime.scheduleFocus?.(games)||{state:'none',game:null};
    const game=focus.game||null;
    const state=focus.state||'none';
    const opponent=String(game?.opponent||'').trim();
    const abbr=String(game?.opponentAbbr||'').trim()||'—';
    const home=game?.homeAway==='home';
    const matchup=game?`Titans ${home?'vs':'at'} ${opponent||abbr}`:'Your Titans command center';
    const description=game
      ?`${kickoffLabel(game)} · ${home?'Home':'Road'}${game?.network?` · ${String(game.network)}`:''}`
      :'No upcoming kickoff is loaded right now. The core fan tools stay one tap away.';
    const meta=game
      ?[weekLabel(game),countdown(game,state),game?.venue||null].filter(Boolean)
      :['Schedule status','Fan tools ready'];
    const actions=focusActions(game,state);
    return `<article class="home-command-v123-focus" aria-label="Next Titans action">
      <div class="home-command-v123-matchup">
        <div><span class="home-command-v123-kicker">${state==='game-window'?'GAME WINDOW':game?'NEXT TITANS ACTION':'FAN COMMAND'}</span><h3>${esc(matchup)}</h3><p>${esc(description)}</p></div>
        <div class="home-command-v123-opponent" aria-label="${game?`${esc(abbr)} opponent abbreviation`:'Titans'}">${game?esc(abbr):'TEN'}</div>
      </div>
      <div class="home-command-v123-meta">${meta.map(item=>`<span>${esc(item)}</span>`).join('')}</div>
      <div class="home-command-v123-actions">${actions.map(action=>`<a class="home-command-v123-action${action.secondary?' secondary':''}" href="${action.href}">${esc(action.label)} →</a>`).join('')}</div>
    </article>`;
  }

  const launchLinks=[
    ['TIX','Tickets','Shop the next home game','#tickets'],
    ['MEDIA','Watch / Listen','Broadcast, radio & video','#media'],
    ['FANTASY','Fantasy','Player props & weekly decisions','#fantasy'],
    ['53','Roster','Current roster & player intel','#roster'],
    ['LAB','Stats Lab','Football-first analytics','#stats'],
    ['RETRO','Legacy','Oilers through The Shield','#legacy']
  ];

  function launchMarkup(){
    return `<nav class="home-command-v123-launch" aria-label="Fan launchpad">${launchLinks.map(([eyebrow,title,detail,href])=>`<a class="home-command-v123-link" href="${href}"><div><small>${esc(eyebrow)}</small><strong>${esc(title)}</strong><span>${esc(detail)}</span></div><b>Open →</b></a>`).join('')}</nav>`;
  }

  function signature(){
    const games=rows(data?.games);
    const focus=runtime.scheduleFocus?.(games)||{};
    const game=focus.game||{};
    return JSON.stringify([focus.state||'none',game.id||'',game.date||'',game.status||'',game.opponentAbbr||'',game.network||'',Boolean(data)]);
  }

  function mount(){
    if(route()!=='home')return;
    const hero=app.querySelector('.fan-hero');
    if(!hero)return;
    ensureStyles();
    if(!data&&!loading)load();

    let root=app.querySelector('.home-command-v123');
    if(!root){
      root=document.createElement('section');
      root.className='home-command-v123';
      root.setAttribute('aria-labelledby','home-command-v123-title');
      hero.insertAdjacentElement('afterend',root);
    }
    const nextSignature=signature();
    if(root.dataset.signature===nextSignature)return;
    root.dataset.signature=nextSignature;
    root.innerHTML=`<div class="home-command-v123-head"><div><small>FAN LAUNCHPAD</small><h2 id="home-command-v123-title">What do you want to do next?</h2></div><p>Game-week context first, then the Titans destinations fans use most.</p></div><div class="home-command-v123-grid">${focusMarkup()}${launchMarkup()}</div>`;
  }

  runtime.onRoute(mount,{immediate:true});
  runtime.onAppRender(mount,{immediate:true});
  runtime.onRefresh(()=>{
    data=null;
    if(route()==='home')load(true);
  });
})();
