(() => {
  'use strict';
  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  const topActions=document.querySelector('.top-actions');
  const route=runtime?.route||(()=>location.hash.replace(/^#/,'').split('?')[0]||'home');
  const state={data:null,intel:null,loading:null};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const TERMS={
    'EPA':'Expected Points Added: how much a play helped or hurt the team’s expected scoring position. Higher is better.',
    'EPA / play':'Average Expected Points Added per play. It helps compare efficiency instead of just total yards.',
    'CPOE':'Completion Percentage Over Expected: how often a quarterback completes passes compared with how difficult those throws were.',
    'Success rate':'The share of plays that meaningfully improve the offense’s situation. It is a consistency measure.',
    'Pressure rate':'How often the quarterback is pressured on dropbacks. Lower is generally better for the offense.',
    'WPA':'Win Probability Added: how much a play changed the team’s estimated chance to win.',
    'YAC':'Yards After Catch: receiving yards gained after the catch is made.',
    'Target share':'The percentage of team pass targets sent to a player.',
    'Snap share':'The percentage of team offensive or defensive snaps a player was on the field.',
    'Rest days':'Days between games. It can help explain short-week or extra-rest situations.'
  };

  async function load(){
    if(state.data&&state.intel)return;
    if(state.loading)return state.loading;
    const request=runtime?[
      runtime.apiJson('/api/data',{ttl:30000}),
      runtime.apiJson('/api/fan-intel',{ttl:30000})
    ]:[
      fetch('/api/data',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null),
      fetch('/api/fan-intel',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)
    ];
    state.loading=Promise.all(request).then(([data,intel])=>{state.data=data?.ok?data:null;state.intel=intel?.ok?intel:null}).finally(()=>state.loading=null);return state.loading
  }
  const valid=v=>{const d=new Date(v);return Number.isNaN(d.getTime())?null:d};
  const nextGame=()=>{const now=Date.now();return (state.data?.games||[]).find(g=>{const t=Date.parse(g.date);return Number.isFinite(t)&&t>now&&!/final|bye/i.test(String(g.status||''))})||null};
  const latestFinal=()=>[...(state.data?.games||[])].reverse().find(g=>/final/i.test(String(g.status||'')))||null;
  const latestMove=()=>state.data?.transactions?.[0]||null;
  const latestStory=()=>state.data?.feed?.[0]||null;
  const gameName=g=>g?`${g.homeAway==='home'?'vs':'at'} ${g.opponent||g.opponentAbbr||'Opponent'}`:'Schedule TBD';
  const gameTime=g=>{const d=valid(g?.date);return d?new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(d):'TBD'};
  function seasonPhase(){const m=new Date().getMonth()+1;if(m===4)return'DRAFT SEASON';if(m===3)return'FREE AGENCY';if(m>=5&&m<=6)return'OFFSEASON';if(m===7)return'TRAINING CAMP';if(m===8)return'PRESEASON';if(m>=9&&m<=12)return'REGULAR SEASON';if(m===1)return'PLAYOFF PUSH';return'OFFSEASON'}
  function countdown(g){const t=Date.parse(g?.date),diff=t-Date.now();if(!Number.isFinite(t))return'Time TBD';if(diff<=0)return'Game time';const h=Math.floor(diff/3600000);if(h>=48)return`${Math.floor(h/24)} days`;if(h>=1)return`${h} hours`;return`${Math.max(1,Math.floor(diff/60000))} min`}

  function termsModal(){document.querySelector('#v14-terms-modal')?.remove();const el=document.createElement('div');el.id='v14-terms-modal';el.className='v14-modal';el.innerHTML=`<div class="v14-modal-backdrop" data-v14-close></div><section role="dialog" aria-modal="true" aria-labelledby="v14-terms-title"><header><div><small>PLAIN ENGLISH</small><h2 id="v14-terms-title">Football terms, without the homework</h2></div><button type="button" data-v14-close aria-label="Close">×</button></header><div class="v14-term-grid">${Object.entries(TERMS).map(([term,copy])=>`<article><strong>${esc(term)}</strong><p>${esc(copy)}</p></article>`).join('')}</div></section>`;document.body.appendChild(el);el.addEventListener('click',e=>{if(e.target.closest?.('[data-v14-close]'))el.remove()});el.querySelector('section')?.focus?.()}
  function addTermsButton(){if(!topActions||document.querySelector('#v14-terms-button'))return;const b=document.createElement('button');b.id='v14-terms-button';b.className='icon-button v14-terms-button';b.type='button';b.title='Explain football stats';b.setAttribute('aria-label','Explain football stats');b.textContent='?';b.addEventListener('click',termsModal);topActions.prepend(b)}

  function homeNow(){if(route()!=='home'||document.querySelector('.v14-now'))return;const hero=document.querySelector('.fan-hero');if(!hero)return;const g=nextGame(),move=latestMove(),story=latestStory(),injuries=state.intel?.injuries||[];const box=document.createElement('section');box.className='v14-now';box.innerHTML=`<header><div><small>${seasonPhase()}</small><h2>What matters right now</h2></div><a href="#fan">What changed →</a></header><div class="v14-now-grid"><a href="#live" class="v14-now-main"><small>NEXT GAME</small><strong>${esc(gameName(g))}</strong><span>${esc(gameTime(g))}</span><b>${esc(g?`Starts in ${countdown(g)}`:'Schedule loading')}</b></a><a href="#media"><small>LISTEN / WATCH</small><strong>${esc(g?.network||'Broadcast guide')}</strong><span>Kickoff converted to your timezone + authorized providers</span></a><a href="#transactions"><small>ROSTER</small><strong>${esc(move?.type||'Latest move')}</strong><span>${esc(move?.description||'No new transaction loaded')}</span></a><a href="#fan"><small>TEAM STATUS</small><strong>${injuries.length?`${injuries.length} injury-report row${injuries.length===1?'':'s'}`:'Report awaiting update'}</strong><span>${injuries.length?'Open the simple injury view':'We do not assume an empty feed means no injuries'}</span></a>${story?`<a href="#feed"><small>TOP INTEL</small><strong>${esc(story.title||'Latest Titans story')}</strong><span>Open Intel Feed →</span></a>`:''}</div></section>`;hero.insertAdjacentElement('afterend',box)}

  function gameDayQuick(){if(route()!=='live'||document.querySelector('.v14-gameday-quick'))return;const target=app.querySelector('.page-head')||app.firstElementChild;if(!target)return;const g=nextGame(),last=latestFinal();const el=document.createElement('section');el.className='v14-gameday-quick';el.innerHTML=`<div><small>QUICK READ</small><strong>${g?`${esc(gameName(g))} · ${esc(gameTime(g))}`:last?`Last result: ${esc(gameName(last))}`:'Titans Game Day'}</strong><span>${g?`Kickoff in ${esc(countdown(g))}. Open Listen / Watch for your local kickoff time and legal broadcast options.`:'Live and postgame details appear here when game data is available.'}</span></div><div><a class="button primary" href="#media">Listen / Watch</a><a class="button" href="#fan">Opponent + fan hub</a></div>`;target.insertAdjacentElement('afterend',el)}

  function statsHelp(){if(route()!=='stats'||document.querySelector('.v14-stats-help'))return;const target=app.querySelector('.page-head');if(!target)return;const el=document.createElement('section');el.className='v14-stats-help';el.innerHTML=`<div><small>STATS, MADE SIMPLE</small><strong>Start with the answer. Open the math only when you want it.</strong><span>EPA measures efficiency. Success rate measures consistency. Pressure rate tells you how often the quarterback is hurried.</span></div><button class="button" type="button" data-v14-open-terms>Explain the stats</button>`;target.insertAdjacentElement('afterend',el);el.querySelector('[data-v14-open-terms]').addEventListener('click',termsModal)}

  function playerHelp(){if(route()!=='player'||document.querySelector('.v14-player-help'))return;const target=app.querySelector('.page-head');if(!target)return;const el=document.createElement('div');el.className='v14-player-help';el.innerHTML=`<span><strong>Quick first:</strong> status, recent production and trend. Advanced metrics stay optional.</span><button type="button" data-v14-open-terms>Explain advanced stats</button>`;target.insertAdjacentElement('afterend',el);el.querySelector('button').addEventListener('click',termsModal)}

  function applyPhase(){document.body.dataset.v14Season=seasonPhase().toLowerCase().replace(/\s+/g,'-')}
  async function enhance(){await load();addTermsButton();applyPhase();homeNow();gameDayQuick();statsHelp();playerHelp()}
  if(runtime){runtime.onRoute(()=>setTimeout(enhance,40));runtime.onAppRender(()=>queueMicrotask(()=>{homeNow();gameDayQuick();statsHelp();playerHelp()}));}
  else {window.addEventListener('hashchange',()=>setTimeout(enhance,40));if(app)new MutationObserver(()=>queueMicrotask(()=>{homeNow();gameDayQuick();statsHelp();playerHelp()})).observe(app,{childList:true,subtree:false});}
  setTimeout(enhance,100);
})();
