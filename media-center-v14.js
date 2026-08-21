(() => {
  'use strict';

  const app=document.querySelector('#app');
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const AREA_KEY='titans:v14MediaArea';
  const PLAYER_KEY='titans:v14RadioProvider';
  const OFFICIAL={
    titansRadio:'https://www.tennesseetitans.com/audio/live-game-broadcast-titans-radio-2026',
    zonePlayer:'https://player.1045thezone.com/',
    zoneListen:'https://www.1045thezone.com/listen/',
    titansWatch:'https://www.tennesseetitans.com/watch-live-games/ways-to-watch',
    nflPlus:'https://www.nfl.com/plus/learn-more',
    tuneIn:'https://tunein.com/radio/Tennessee-Titans-s252150/',
    sirius:'https://www.siriusxm.com/sports/nfl',
    sundayTicket:'https://tv.youtube.com/learn/nflsundayticket/',
    paramount:'https://www.paramountplus.com/shows/nfl-on-cbs/',
    fox:'https://www.foxsports.com/nfl',
    peacock:'https://www.peacocktv.com/sports/nfl',
    espn:'https://www.espn.com/watch/',
    prime:'https://www.amazon.com/gp/video/sports',
    netflix:'https://www.netflix.com/',
    nflWatch:'https://www.nfl.com/ways-to-watch'
  };
  const RADIO_STREAM='https://playerservices.streamtheworld.com/api/livestream-redirect/WGFXFMAAC.aac';
  const state={data:null,loading:null,area:localStorage.getItem(AREA_KEY)||'nashville',radioProvider:localStorage.getItem(PLAYER_KEY)||'zone'};

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const validDate=v=>{const d=new Date(v);return Number.isNaN(d.getTime())?null:d};
  const fmt=v=>{const d=validDate(v);return d?new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'America/Chicago'}).format(d):'TBD'};
  const safeUrl=v=>{try{const u=new URL(v);return ['https:','http:'].includes(u.protocol)?u.href:'#'}catch{return'#'}};

  async function load(){
    if(state.data)return state.data;
    if(state.loading)return state.loading;
    state.loading=fetch('/api/data',{cache:'no-store',headers:{Accept:'application/json'}}).then(async r=>r.ok?r.json():null).catch(()=>null).then(d=>{state.data=d?.ok?d:null;return state.data}).finally(()=>state.loading=null);
    return state.loading;
  }

  function nextGame(){const now=Date.now();return (state.data?.games||[]).find(g=>{const t=Date.parse(g.date);return Number.isFinite(t)&&t>now&&!/final|bye/i.test(String(g.status||''))})||null}
  function gameLabel(g){if(!g)return'Titans game';return `${g.homeAway==='home'?'vs':'at'} ${g.opponent||g.opponentAbbr||'Opponent'}`}
  function providerCards(g){
    const network=String(g?.network||'').toUpperCase();
    const cards=[];
    const add=(name,note,url,badge='Authorized')=>cards.push({name,note,url,badge});
    if(/CBS/.test(network))add('Paramount+','Streams your live local CBS game where available.',OFFICIAL.paramount,'Local CBS');
    if(/FOX/.test(network))add('FOX Sports','Watch the local FOX broadcast with supported TV-provider access.',OFFICIAL.fox,'Local FOX');
    if(/NBC/.test(network))add('Peacock / NBC','Sunday Night Football and NBC coverage where available.',OFFICIAL.peacock,'NBC');
    if(/ESPN|ABC/.test(network))add('ESPN','Monday Night Football / ESPN or ABC coverage where available.',OFFICIAL.espn,'ESPN');
    if(/PRIME|AMAZON|TNF/.test(network))add('Prime Video','Thursday Night Football and other Prime-exclusive NFL games.',OFFICIAL.prime,'Prime');
    if(/NFL NETWORK/.test(network))add('NFL+ / NFL Network','NFL Network games and NFL+ access according to your plan/device.',OFFICIAL.nflPlus,'NFL');
    if(/NETFLIX/.test(network))add('Netflix','NFL games carried by Netflix when scheduled.',OFFICIAL.netflix,'Netflix');
    if(!cards.length)add('NFL Ways to Watch','Use the NFL game guide to match location, network and service.',OFFICIAL.nflWatch,'Game guide');
    if(!/PRIME|AMAZON|TNF|NETFLIX/.test(network))add('NFL Sunday Ticket','For eligible out-of-market Sunday afternoon games on YouTube / YouTube TV.',OFFICIAL.sundayTicket,'Out of market');
    add('NFL+','Live local & primetime games on mobile/tablet; live audio for every NFL game.',OFFICIAL.nflPlus,'Mobile + audio');
    return cards;
  }

  function stationAffiliates(){return [
    ['WGFX','104.5 FM','Nashville flagship'],['WAKM','950 AM','Franklin'],['WANT','98.9 FM','Lebanon'],['WCOR','1490 AM','Lebanon'],['WZNG','100.9 FM / 1400 AM','Shelbyville'],['WQMV','1060 AM','Waverly'],['WMSR','1320 AM','Manchester'],['WGOW','1150 AM','Chattanooga'],['WXSM','640 AM','Tri-Cities'],['WCDT','1340 AM','Winchester']
  ]}

  function areaSwitch(){return `<div class="media-area-switch" role="group" aria-label="Media area"><button type="button" data-media-area="nashville" class="${state.area==='nashville'?'active':''}">Nashville / Middle Tennessee</button><button type="button" data-media-area="outside" class="${state.area==='outside'?'active':''}">Outside local market</button></div>`}

  function radioSection(g){
    const local=state.area==='nashville';
    return `<section class="media-radio-deck">
      <div class="media-radio-top"><div><small>LISTEN</small><h2>Titans Radio</h2><p>${local?'Nashville flagship: WGFX 104.5 The Zone. Station and NFL digital restrictions still apply.':'For every Titans game outside the Nashville market, use an NFL-licensed all-game audio provider.'}</p></div><div class="media-radio-dial"><span>104.5</span><small>THE ZONE</small></div></div>
      ${local?`<div class="media-radio-player"><div class="media-onair"><i></i><span>${g?'NEXT TITANS BROADCAST':'NASHVILLE SPORTS RADIO'}</span><strong>${esc(g?gameLabel(g):'104.5 The Zone')}</strong><small>${g?fmt(g.date):'Official station stream'}</small></div><audio id="media-zone-audio" preload="none" controls playsinline src="${RADIO_STREAM}"></audio><p class="media-rights-note">Direct station playback is requested from the station's streaming provider in your browser. Titans Command Center does not proxy, copy or rebroadcast the audio. If the provider blocks playback or a game is digitally restricted, use the official player below.</p><div class="media-action-row"><a class="button primary" target="_blank" rel="noopener noreferrer" href="${OFFICIAL.zonePlayer}">Open official 104.5 player ↗</a><a class="button" target="_blank" rel="noopener noreferrer" href="${OFFICIAL.titansRadio}">Titans live audio page ↗</a></div></div>`:''}
      <div class="media-provider-grid">
        <a class="media-provider" href="${OFFICIAL.nflPlus}" target="_blank" rel="noopener noreferrer"><b>NFL+</b><span>Every NFL game: home, away & national live audio calls.</span><em>All games</em></a>
        <a class="media-provider" href="${OFFICIAL.tuneIn}" target="_blank" rel="noopener noreferrer"><b>TuneIn Premium</b><span>Live local Titans call all season, per Titans' official watch/listen guide.</span><em>Subscription</em></a>
        <a class="media-provider" href="${OFFICIAL.sirius}" target="_blank" rel="noopener noreferrer"><b>SiriusXM</b><span>Licensed NFL play-by-play with team channels and home/away feeds.</span><em>North America</em></a>
      </div>
      <details class="media-affiliates"><summary>Terrestrial Titans Radio affiliates</summary><div>${stationAffiliates().map(x=>`<div><strong>${x[0]}</strong><span>${x[1]}</span><small>${x[2]}</small></div>`).join('')}</div><p>Use your actual radio for AM/FM reception. iPhones do not expose an AM/FM tuner to websites, so web playback uses authorized digital sources instead.</p></details>
    </section>`
  }

  function watchSection(g){
    const providers=providerCards(g);
    const heading=g?`How to watch ${esc(gameLabel(g))}`:'How to watch the Titans';
    const scheduleLine=g?`${fmt(g.date)} · ${esc(g.network||'Network TBD')}`:"Authorized viewing options are matched from the game's network and your market.";
    const cards=providers.map(p=>`<a class="media-watch-card" href="${safeUrl(p.url)}" target="_blank" rel="noopener noreferrer"><small>${esc(p.badge)}</small><strong>${esc(p.name)}</strong><span>${esc(p.note)}</span><b>Open provider ↗</b></a>`).join('');
    return `<section class="media-watch"><header><div><small>WATCH</small><h2>${heading}</h2><p>${scheduleLine}</p></div><a class="button" href="${OFFICIAL.titansWatch}" target="_blank" rel="noopener noreferrer">Official Titans guide ↗</a></header><div class="media-watch-grid">${cards}</div><div class="media-watch-note"><strong>Why we route instead of embedding live games</strong><p>NFL live video is protected by broadcaster authentication, DRM, market rules and commercial media rights. There is no public third-party API that legally hands this site the raw game stream. This page sends fans to the authorized service and can become more precise as we add licensed broadcast/TV-listing data.</p></div></section>`;
  }

  function futureSection(){return `<section class="media-future"><div><small>MEDIA ROADMAP</small><h2>What unlocks a true all-games media layer?</h2></div><div class="media-future-grid"><article><strong>1. All-game audio</strong><p>Already solvable today through NFL+, TuneIn Premium and SiriusXM. We can deep-link by game; direct in-app playback would require an approved provider integration or commercial audio rights.</p></article><article><strong>2. Market-aware TV routing</strong><p>Use a licensed listings/broadcast feed such as Gracenote, Sportradar or SportsDataIO to resolve network and market details. The site can then say exactly where a fan should watch without guessing.</p></article><article><strong>3. In-app live video</strong><p>This requires a direct commercial rights agreement with the NFL/broadcaster plus DRM/authentication integration. A normal public developer key is not enough.</p></article><article><strong>4. Official highlights</strong><p>YouTube Data + IFrame APIs can support embeddable official Titans/NFL videos when the rights holder allows embedding. This is a good next media enhancement without touching live-game rights.</p></article></div></section>`}

  function mediaPage(){const g=nextGame();app.innerHTML=`<section class="media-page"><header class="media-hero"><div><div class="eyebrow">TITANS MEDIA CENTER</div><h1>Listen / Watch</h1><p>One simple place to find the Titans broadcast you can legally use — local radio, all-game audio, TV and streaming.</p>${areaSwitch()}</div><div class="media-next"><small>NEXT GAME</small><strong>${esc(gameLabel(g))}</strong><span>${g?fmt(g.date):'Schedule loading'}</span><em>${esc(g?.network||'Network TBD')}</em></div></header>${radioSection(g)}${watchSection(g)}${futureSection()}</section>`;bind()}

  function homeCard(){if(route()!=='home'||document.querySelector('.media-home-card'))return;const hero=document.querySelector('.fan-hero');if(!hero)return;const g=nextGame(),card=document.createElement('section');card.className='media-home-card';const scheduleLine=g?`${fmt(g.date)} · ${esc(g.network||'Network TBD')}`:'Find the authorized radio or streaming option.';card.innerHTML=`<div><small>LISTEN / WATCH</small><strong>${esc(g?gameLabel(g):'Titans media')}</strong><span>${scheduleLine}</span></div><a href="#media">Open media center →</a>`;hero.insertAdjacentElement('afterend',card)}

  function bind(){document.querySelectorAll('[data-media-area]').forEach(btn=>btn.addEventListener('click',()=>{state.area=btn.dataset.mediaArea;localStorage.setItem(AREA_KEY,state.area);mediaPage()}));const audio=document.querySelector('#media-zone-audio');if(audio){audio.addEventListener('error',()=>{const note=document.createElement('div');note.className='media-playback-error';note.textContent='The station stream did not open here. Use the official 104.5 player — station/NFL geo or digital restrictions may apply.';audio.insertAdjacentElement('afterend',note)},{once:true})}}

  async function render(){await load();if(route()==='media')mediaPage();else homeCard();document.querySelectorAll('[data-route]').forEach(a=>a.classList.toggle('active',a.dataset.route===route()))}
  window.addEventListener('hashchange',()=>setTimeout(render,20));
  if(app)new MutationObserver(()=>queueMicrotask(()=>{if(route()==='media'){if(!app.querySelector('.media-page'))render()}else homeCard()})).observe(app,{childList:true,subtree:false});
  setTimeout(render,80);
})();
