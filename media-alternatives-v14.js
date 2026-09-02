import './media-custom-links-v14.js';

(() => {
  'use strict';

  const AREA_KEY='titans:v14MediaArea';
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const storageGet=key=>{try{return localStorage.getItem(key)}catch{return null}};
  const area=()=>{const saved=storageGet(AREA_KEY)||'nashville';return saved==='outside'?'us':['nashville','us','international'].includes(saved)?saved:'nashville'};
  const OFFICIAL={
    nflGuide:'https://www.nfl.com/ways-to-watch',
    nflTeamGuide:'https://www.nfl.com/ways-to-watch/team-schedule',
    nflPlus:'https://www.nfl.com/plus/learn-more',
    titansGuide:'https://www.tennesseetitans.com/watch-live-games/ways-to-watch',
    titansLiveAudio:'https://www.tennesseetitans.com/broadcast/titans-radio/live-game-day-audio',
    titansRadio:'https://www.tennesseetitans.com/audio/live-game-broadcast-titans-radio-2026',
    sundayTicket:'https://tv.youtube.com/learn/nflsundayticket/',
    nflInternational:'https://www.nfl.com/international/ways-to-watch/by-country',
    dazn:'https://www.dazn.com/',
    everpass:'https://everpass.com/live-sports/nfl-sunday-ticket/'
  };
  const HOUR=60*60*1000;
  const DAY=24*HOUR;

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const card=(item)=>`<a class="media-alt-card" href="${item.url}" target="_blank" rel="noopener noreferrer"><small>${esc(item.badge)}</small><strong>${esc(item.title)}</strong><span>${esc(item.note)}</span><b>${esc(item.action)} ↗</b></a>`;
  const gameTime=game=>{const raw=game?.date;if(raw===null||raw===undefined||String(raw).trim()==='')return NaN;const value=new Date(raw).getTime();return Number.isFinite(value)?value:NaN};
  const gameLabel=game=>game?`${game.homeAway==='home'?'vs':'at'} ${game.opponent||game.opponentAbbr||'Opponent'}`:'Titans game';
  const kickoffLabel=game=>{const time=gameTime(game);if(!Number.isFinite(time))return'Time TBD';return new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'America/Chicago',timeZoneName:'short'}).format(new Date(time))};

  function options(){
    if(area()==='international')return [
      {badge:'BEST MATCH',title:'NFL by-country guide',note:'Choose your country to see the current authorized TV and streaming partners for NFL games.',action:'Find my country',url:OFFICIAL.nflInternational},
      {badge:'INTERNATIONAL',title:'NFL Game Pass on DAZN',note:'Game Pass carries NFL games in supported international markets; exact rights and packages vary by country.',action:'Open DAZN',url:OFFICIAL.dazn},
      {badge:'OFFICIAL GUIDE',title:'NFL Ways to Watch',note:'Use the league guide when local broadcaster rights differ from the U.S. network shown on the schedule.',action:'Open NFL guide',url:OFFICIAL.nflGuide}
    ];
    if(area()==='us')return [
      {badge:'PERSONALIZED',title:'NFL Game Guide',note:'Enter your location and services to see which authorized provider carries the Titans game where you are.',action:'Find my game',url:OFFICIAL.nflGuide},
      {badge:'OUT OF MARKET',title:'NFL Sunday Ticket',note:'Eligible out-of-market Sunday afternoon games are available through YouTube / YouTube TV Sunday Ticket.',action:'Check Sunday Ticket',url:OFFICIAL.sundayTicket},
      {badge:'MOBILE + REPLAYS',title:'NFL+',note:'Local and primetime mobile access, live game audio, NFL Network and replay features vary by plan and device.',action:'Open NFL+',url:OFFICIAL.nflPlus},
      {badge:'WATCH AT A VENUE',title:'Licensed sports bar',note:'Commercial establishments use licensed commercial packages such as NFL Sunday Ticket through EverPass.',action:'EverPass info',url:OFFICIAL.everpass}
    ];
    return [
      {badge:'FREE WHEN LOCAL',title:'Over-the-air / local TV',note:'If the Titans game is on your local CBS, FOX, NBC or ABC affiliate, an antenna or normal local TV service may be the simplest option.',action:'Check NFL Game Guide',url:OFFICIAL.nflGuide},
      {badge:'TENNESSEE',title:'Titans official watch guide',note:'The team guide lists current local network, mobile, streaming and preseason options with geographic restrictions.',action:'Open Titans guide',url:OFFICIAL.titansGuide},
      {badge:'PERSONALIZED',title:'NFL Game Guide',note:'Enter your ZIP code and services to confirm the correct authorized provider for this specific game.',action:'Find my game',url:OFFICIAL.nflGuide},
      {badge:'WATCH AT A VENUE',title:'Licensed sports bar',note:'For out-of-market Sunday games, commercial venues can carry NFL Sunday Ticket through licensed EverPass service.',action:'EverPass info',url:OFFICIAL.everpass}
    ];
  }

  async function currentGame(){
    const runtime=window.TitansRuntime;
    const payload=typeof runtime?.apiJson==='function'?await runtime.apiJson('/api/data',{ttl:30000}):await fetch('/api/data',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    const games=payload?.ok===false?[]:(payload?.games||[]);
    if(typeof runtime?.scheduleFocus==='function')return runtime.scheduleFocus(games,new Date())?.game||null;
    const now=Date.now(),windowMs=Math.max(0,Number(runtime?.gameFocusWindowMs)||5*HOUR);
    const candidates=games.filter(game=>!/final|bye/i.test(String(game?.status||''))&&Number.isFinite(gameTime(game))).sort((a,b)=>gameTime(a)-gameTime(b));
    return candidates.find(game=>gameTime(game)<=now&&gameTime(game)>=now-windowMs)||candidates.find(game=>gameTime(game)>now)||null;
  }

  function gamePhase(game,now=Date.now()){
    const kickoff=gameTime(game);
    if(!game||!Number.isFinite(kickoff))return{key:'ready',eyebrow:'MEDIA READY',title:'Set your Titans media route',detail:'Pick the authorized watch and listen options you want ready for the next broadcast.'};
    const diff=kickoff-now;
    const windowMs=Math.max(0,Number(window.TitansRuntime?.gameFocusWindowMs)||5*HOUR);
    if(/live/i.test(String(game.status||''))||(diff<=0&&diff>=-windowMs))return{key:'live',eyebrow:'LIVE WINDOW',title:`${gameLabel(game)} is in the game window`,detail:'Jump straight to the authorized video or audio route for this matchup.'};
    if(diff>0&&diff<=HOUR)return{key:'pregame',eyebrow:'TITANS COUNTDOWN',title:`Kickoff is ${Math.max(1,Math.ceil(diff/60000))} min away`,detail:'Titans Countdown begins one hour before kickoff. Get your TV / stream and radio route open now.'};
    if(diff>0&&diff<=DAY)return{key:'today',eyebrow:'GAME DAY',title:`${gameLabel(game)} is up next`,detail:'Your game-day watch and listen routes are matched below so you can open them before kickoff.'};
    return{key:'upcoming',eyebrow:'NEXT BROADCAST',title:`Plan for ${gameLabel(game)}`,detail:'Set your preferred authorized watch and listen routes before game day.'};
  }

  function listenRoute(currentArea){
    if(currentArea==='nashville')return{title:'Listen to Titans Radio',action:'Open official game audio',url:OFFICIAL.titansLiveAudio,note:'Official Titans game audio. LISTEN LIVE appears one hour before kickoff; mobile users must be in the Titans home market.'};
    if(currentArea==='us')return{title:'Listen with NFL+',action:'Open NFL+ audio',url:OFFICIAL.nflPlus,note:'NFL+ offers live audio for every NFL game, including home, away and national calls. Plan and device rules apply.'};
    return{title:'Open Titans Radio',action:'Open official Titans Radio',url:OFFICIAL.titansRadio,note:'Start with the official Titans Radio page. Digital audio availability and geographic restrictions vary internationally.'};
  }

  function renderAlternatives(){
    if(route()!=='media')return;
    const watch=document.querySelector('.media-watch');
    if(!watch)return;
    const current=area();
    const existing=watch.querySelector('.media-alternatives');
    if(existing?.dataset.area===current)return;
    existing?.remove();
    const section=document.createElement('section');
    section.className='media-alternatives';
    section.dataset.area=current;
    section.innerHTML=`<header><div><small>ALTERNATIVE VIEWING</small><h3>Other legitimate ways to watch</h3><p>Useful fallbacks when your first provider is unavailable. Options change by location, network, device and subscription.</p></div></header><div class="media-alt-grid">${options().map(card).join('')}</div><p class="media-alt-note"><strong>Why only authorized options?</strong> Live NFL broadcasts are territory- and rights-controlled. The Command Center links to official or licensed providers rather than unlicensed restreams, so fans get safer links and fewer broken or malicious pop-ups.</p>`;
    const note=watch.querySelector('.media-watch-note');
    if(note)note.insertAdjacentElement('beforebegin',section);else watch.append(section);
  }

  async function renderQuickStart(){
    if(route()!=='media')return;
    const hero=document.querySelector('.media-hero'),watch=document.querySelector('.media-watch');
    if(!hero||!watch)return;
    const game=await currentGame();
    if(route()!=='media'||!document.body.contains(hero))return;
    const current=area(),phase=gamePhase(game),provider=watch.querySelector('.media-watch-card');
    const providerName=provider?.querySelector('strong')?.textContent?.trim()||'Official Titans watch guide';
    const providerUrl=provider?.href||OFFICIAL.titansGuide;
    const listen=listenRoute(current);
    const signature=[current,game?.id||game?.date||'none',phase.key,providerName].join('|');
    let section=document.querySelector('.media-quickstart');
    if(section?.dataset.signature===signature)return;
    if(!section){section=document.createElement('section');section.className='media-quickstart';hero.insertAdjacentElement('afterend',section)}
    section.dataset.signature=signature;
    section.dataset.phase=phase.key;
    const network=game?.network||'Network TBD';
    section.innerHTML=`<header class="media-quick-head"><div><small>GAME DAY QUICK START</small><h2>${esc(phase.title)}</h2><p>${esc(phase.detail)}</p></div><div class="media-phase media-phase-${esc(phase.key)}"><i aria-hidden="true"></i><span>${esc(phase.eyebrow)}</span>${game?`<strong>${esc(kickoffLabel(game))}</strong><em>${esc(network)}</em>`:'<strong>Official routes only</strong><em>Watch + listen</em>'}</div></header><div class="media-quick-grid"><a class="media-quick-card media-quick-watch" href="${esc(providerUrl)}" target="_blank" rel="noopener noreferrer"><small>WATCH</small><strong>${phase.key==='live'?'Watch this game':'Set up your stream'}</strong><span>${esc(providerName)}${game?` · ${esc(network)}`:''}</span><b>Open ${esc(providerName)} ↗</b></a><a class="media-quick-card media-quick-listen" href="${esc(listen.url)}" target="_blank" rel="noopener noreferrer"><small>LISTEN</small><strong>${esc(listen.title)}</strong><span>${esc(listen.note)}</span><b>${esc(listen.action)} ↗</b></a></div><div class="media-gameplan" aria-label="Titans game day media timeline"><div><small>60 MIN BEFORE</small><strong>Titans Countdown</strong><span>Pregame radio coverage begins.</span></div><div><small>KICKOFF</small><strong>TV / stream + radio</strong><span>Use the authorized routes above.</span></div><div><small>POSTGAME</small><strong>Highlights + podium</strong><span>Continue with official Titans video.</span></div></div>`;
  }

  function render(){renderAlternatives();renderQuickStart()}

  window.addEventListener('hashchange',()=>setTimeout(render,60));
  document.addEventListener('click',event=>{if(event.target instanceof Element&&event.target.closest('[data-media-area]'))setTimeout(render,80)},true);
  const app=document.querySelector('#app');
  if(app)new MutationObserver(()=>queueMicrotask(render)).observe(app,{childList:true,subtree:true});
  setTimeout(render,140);
})();
