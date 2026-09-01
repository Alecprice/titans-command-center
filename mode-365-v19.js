(() => {
  'use strict';
  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!runtime||!app)return;
  if(!document.querySelector('link[data-v19-365-style]')){
    const link=document.createElement('link');link.rel='stylesheet';link.href='/mode-365-v19.css?v=1';link.dataset.v19_365Style='1';link.setAttribute('data-v19-365-style','1');document.head.appendChild(link);
  }

  const arr=v=>Array.isArray(v)?v:[];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const state={data:null,fan:null,loading:null,serial:0};

  async function load(){
    if(state.data&&state.fan)return state;
    if(state.loading)return state.loading;
    state.loading=Promise.all([
      runtime.apiJson('/api/data',{ttl:30000}),
      runtime.apiJson('/api/fan-intel',{ttl:30000})
    ]).then(([data,fan])=>{state.data=data?.ok?data:{};state.fan=fan?.ok?fan:{};return state}).finally(()=>state.loading=null);
    return state.loading;
  }

  const games=()=>arr(state.data?.games);
  const moves=()=>arr(state.data?.transactions);
  const injuries=()=>arr(state.fan?.injuries);
  const standings=()=>arr(state.fan?.standings);
  const depthChanges=()=>arr(state.fan?.depthChart?.changes);
  const gameFocus=()=>runtime.scheduleFocus(games());
  const latestFinal=()=>[...games()].reverse().find(g=>/final/i.test(String(g?.status||'')))||null;
  const regularFinals=()=>games().filter(g=>Number(g?.week)>=1&&/final/i.test(String(g?.status||''))&&Number.isFinite(Number(g?.score))&&Number.isFinite(Number(g?.opponentScore)));

  function scheduleRecord(){
    let wins=0,losses=0,ties=0;
    for(const game of regularFinals()){
      const scored=Number(game.score),allowed=Number(game.opponentScore);
      if(scored>allowed)wins++;
      else if(scored<allowed)losses++;
      else ties++;
    }
    return{wins,losses,ties,games:wins+losses+ties};
  }

  function availabilityState(game,rows){
    if(rows.length)return{title:`${rows.length} weekly report row${rows.length===1?'':'s'}`,copy:'Open the latest structured availability rows.'};
    const kickoff=Date.parse(game?.date);
    if(Number.isFinite(kickoff)&&kickoff>Date.now()){
      const days=Math.max(1,Math.ceil((kickoff-Date.now())/86400000));
      const week=Number(game?.week)>=1?`Week ${Number(game.week)}`:'Next-game';
      if(days>7)return{title:`${week} prep window`,copy:`Kickoff is ${days} days away. Weekly availability will replace this readiness state when structured report rows are loaded.`};
      return{title:`${week} availability pending`,copy:`Kickoff is ${days} day${days===1?'':'s'} away. Missing report data is not treated as an all-clear.`};
    }
    return{title:'Availability refresh pending',copy:'No current weekly report rows are loaded. Missing report data is not treated as an all-clear.'};
  }

  function standingsState(row){
    if(row)return{title:`${row.record||`${row.wins??'—'}-${row.losses??'—'}`}${row.divisionRank?` · rank ${row.divisionRank}`:''}`,copy:'Current regular-season standings snapshot.'};
    const record=scheduleRecord();
    const recordText=`${record.wins}-${record.losses}${record.ties?`-${record.ties}`:''}`;
    if(!record.games)return{title:`${recordText} · Week 1 ahead`,copy:'No Titans regular-season result is complete yet. Division rank will appear when a current AFC South standings snapshot is loaded.'};
    return{title:`${recordText} · rank pending`,copy:'Record is derived from loaded final Titans games; division rank waits for a current AFC South standings snapshot.'};
  }

  function phase(now=new Date()){
    const m=now.getMonth()+1,d=now.getDate();
    if(m===1||m===2&&d<=15)return{key:'postseason',label:'POSTSEASON WINDOW',title:'Season finish + next steps',copy:'Results, roster consequences, coaching decisions and what comes next.',accent:'Season'};
    if(m===3&&d>=10||m===4&&d<=10)return{key:'free-agency',label:'FREE AGENCY FOCUS',title:'Roster construction season',copy:'Transactions, depth changes and verified contract context move to the front.',accent:'Roster'};
    if(m===4)return{key:'draft',label:'DRAFT FOCUS',title:'Draft week command',copy:'Team needs, fan board, roster gaps and verified prospect context take priority.',accent:'Draft'};
    if(m===5||m===6)return{key:'spring',label:'SPRING PROGRAM',title:'Build toward camp',copy:'Roster churn, position groups and player development context matter most.',accent:'Team'};
    if(m===7)return{key:'camp',label:'TRAINING CAMP',title:'Camp battles + availability',copy:'Depth movement, roster competition and player availability rise to the top.',accent:'Camp'};
    if(m===8)return{key:'preseason',label:'PRESEASON',title:'Roster decisions are the story',copy:'Next game, position battles, depth changes and roster movement matter more than standings.',accent:'Preseason'};
    if(m>=9&&m<=12)return{key:'regular',label:'REGULAR SEASON',title:'Game week first',copy:'Next opponent, availability, standings and what changed lead the experience.',accent:'Game week'};
    return{key:'offseason',label:'OFFSEASON',title:'Team-building mode',copy:'Roster construction, development and the next major NFL calendar milestone come first.',accent:'Team'};
  }

  const fmtDate=value=>runtime.formatTeamKickoff(value);
  function priorityCards(p){
    const focus=gameFocus(),g=focus.game,last=latestFinal(),move=moves()[0],inj=injuries(),stand=standings().find(x=>x.abbreviation==='TEN'),depth=depthChanges();
    const availability=availabilityState(g,inj),division=standingsState(stand);
    const gameCard=focus.state==='game-window'&&g
      ?{eyebrow:'GAME WINDOW',title:`${g.homeAway==='home'?'vs':'at'} ${g.opponent||g.opponentAbbr||'Opponent'}`,copy:`Kickoff ${fmtDate(g.date)}. Live status has not been verified yet${g.network?` · ${g.network}`:''}.`,href:'#live'}
      :{eyebrow:'NEXT GAME',title:g?`${g.homeAway==='home'?'vs':'at'} ${g.opponent||g.opponentAbbr||'Opponent'}`:'Next game TBD',copy:g?`${fmtDate(g.date)}${g.network?` · ${g.network}`:''}`:'The schedule will fill this automatically.',href:'#live'};
    const base={
      game:gameCard,
      changes:{eyebrow:'WHAT CHANGED?',title:depth.length?`${depth.length} depth change${depth.length===1?'':'s'} loaded`:'Review team changes',copy:move?.description||'Roster, availability, depth and broadcast changes are compared against your last review.',href:'#command'},
      roster:{eyebrow:'ROSTER',title:move?.type||'Latest roster movement',copy:move?.description||'No new transaction is loaded right now.',href:'#transactions'},
      injury:{eyebrow:'AVAILABILITY',title:availability.title,copy:availability.copy,href:'#fan'},
      standings:{eyebrow:'AFC SOUTH',title:division.title,copy:division.copy,href:'#fan'},
      last:{eyebrow:'LAST RESULT',title:last?`${last.opponent||last.opponentAbbr||'Opponent'} · ${last.status||'Final'}`:'No final loaded',copy:last?fmtDate(last.date):'Completed game context will appear here.',href:'#games'},
      draft:{eyebrow:'FAN GM',title:'Build your draft board',copy:'Use the local fan board without pretending the site has a complete live prospect feed.',href:'#command'},
      players:{eyebrow:'PLAYER INTEL',title:'Track roles and trends',copy:'Open the roster for player command centers, favorites and loaded trend data.',href:'#roster'}
    };
    const order={
      postseason:['last','changes','roster','players'],
      'free-agency':['roster','changes','players','draft'],
      draft:['draft','roster','changes','players'],
      spring:['roster','players','changes','injury'],
      camp:['changes','injury','players','roster'],
      preseason:['game','changes','roster','injury'],
      regular:['game','injury','standings','changes'],
      offseason:['roster','players','changes','draft']
    }[p.key]||['game','changes','roster','players'];
    return order.map(key=>base[key]);
  }

  function updateStatus(p){
    document.body.dataset.v19Phase=p.key;
    const pill=document.querySelector('.sidebar-foot .status-pill');
    if(pill){pill.dataset.v19Mode='1';pill.innerHTML=`<i></i> ${esc(p.accent)} mode`}
  }

  async function render(){
    if(runtime.route()!=='home')return;
    if(document.querySelector('.v19-365'))return;
    const token=++state.serial;await load();if(token!==state.serial||runtime.route()!=='home')return;
    const target=document.querySelector('.v14-now')||document.querySelector('.fan-hero');if(!target)return;
    const p=phase(),cards=priorityCards(p);
    const section=document.createElement('section');section.className='v19-365';section.innerHTML=`<header><div><small>365 MODE · ${esc(p.label)}</small><h2>${esc(p.title)}</h2><p>${esc(p.copy)}</p></div><a href="#command">Review changes →</a></header><div class="v19-365-grid">${cards.map(card=>`<a href="${esc(card.href)}"><small>${esc(card.eyebrow)}</small><strong>${esc(card.title)}</strong><span>${esc(card.copy)}</span></a>`).join('')}</div><footer><span>Command Center mode adapts to the football calendar; it does not claim an official league transaction window.</span></footer>`;
    target.insertAdjacentElement('afterend',section);updateStatus(p);
  }

  function refreshMode(){
    state.serial++;
    state.data=null;
    state.fan=null;
    state.loading=null;
    document.querySelector('.v19-365')?.remove();
    setTimeout(render,0);
  }

  runtime.onRoute(()=>{state.serial++;setTimeout(render,30)});
  runtime.onAppRender(()=>queueMicrotask(render));
  runtime.onRefresh(refreshMode);
  setTimeout(render,100);
})();