(() => {
  'use strict';

  const app=document.querySelector('#app');
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const AREA_KEY='titans:v14MediaArea';
  const OFFICIAL={
    titansLiveAudio:'https://www.tennesseetitans.com/broadcast/titans-radio/live-game-day-audio',
    titansRadio:'https://www.tennesseetitans.com/audio/live-game-broadcast-titans-radio-2026',
    zonePlayer:'https://www.1045thezone.com/player/?playerID=3234',
    zoneListen:'https://www.1045thezone.com/listen/',
    titansWatch:'https://www.tennesseetitans.com/watch-live-games/ways-to-watch',
    nflPlus:'https://www.nfl.com/plus/learn-more',
    nflInternational:'https://www.nfl.com/international/ways-to-watch/by-country',
    tuneIn:'https://tunein.com/radio/Tennessee-Titans-s252150/',
    sirius:'https://www.siriusxm.com/sports/nfl',
    sundayTicket:'https://tv.youtube.com/learn/nflsundayticket/',
    paramount:'https://www.paramountplus.com/shows/nfl-on-cbs/',
    fox:'https://www.foxsports.com/nfl',
    peacock:'https://www.peacocktv.com/sports/nfl',
    espn:'https://www.espn.com/watch/',
    prime:'https://www.amazon.com/gp/video/sports',
    netflix:'https://www.netflix.com/',
    dazn:'https://www.dazn.com/',
    nflWatch:'https://www.nfl.com/ways-to-watch'
  };

  const storageGet=key=>{try{return localStorage.getItem(key)}catch{return null}};
  const storageSet=(key,value)=>{try{localStorage.setItem(key,value);return true}catch{return false}};
  const savedArea=storageGet(AREA_KEY);
  const initialArea=savedArea==='outside'?'us':['nashville','us','international'].includes(savedArea)?savedArea:'nashville';
  const state={data:null,loading:null,area:initialArea};

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
    if(state.area==='international')return [
      {name:'NFL International',note:'Choose your country for the NFL’s current authorized TV and streaming options.',url:OFFICIAL.nflInternational,badge:'By country'},
      {name:'NFL Game Pass on DAZN',note:'International Game Pass carries NFL games in supported markets. Availability and local partners vary by country.',url:OFFICIAL.dazn,badge:'International'},
      {name:'NFL Ways to Watch',note:'Official fallback for current game and territory viewing guidance.',url:OFFICIAL.nflWatch,badge:'Official guide'}
    ];
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
    ['WGFX','104.5 FM','Nashville flagship'],['WAKM','950 AM','Franklin'],['WANT','98.9 FM','Lebanon'],['WCOR','1490 AM','Lebanon'],['WZNG','100.9 FM / 1400 AM','Shelbyville'],['WQMV','93.5 FM / 1060 AM','Waverly'],['WMSR','107.9 FM / 1320 AM','Manchester'],['WGOW','102.3 FM / 1150 AM','Chattanooga'],['WXSM','640 AM','Tri-Cities'],['WCDT','1340 AM','Winchester']
  ]}

  function areaSwitch(){return `<div class="media-area-switch" role="group" aria-label="Media area"><button type="button" data-media-area="nashville" class="${state.area==='nashville'?'active':''}" aria-pressed="${state.area==='nashville'}">Nashville / Middle Tennessee</button><button type="button" data-media-area="us" class="${state.area==='us'?'active':''}" aria-pressed="${state.area==='us'}">Elsewhere in U.S.</button><button type="button" data-media-area="international" class="${state.area==='international'?'active':''}" aria-pressed="${state.area==='international'}">International</button></div>`}

  function radioProviderGrid(){
    if(state.area==='international')return `<div class="media-provider-grid"><a class="media-provider" href="${OFFICIAL.nflInternational}" target="_blank" rel="noopener noreferrer"><b>NFL International</b><span>Choose your country for current authorized NFL viewing and streaming partners.</span><em>By country</em></a><a class="media-provider" href="${OFFICIAL.dazn}" target="_blank" rel="noopener noreferrer"><b>NFL Game Pass on DAZN</b><span>International NFL access in supported countries; local rights and availability vary.</span><em>International</em></a><a class="media-provider" href="${OFFICIAL.titansRadio}" target="_blank" rel="noopener noreferrer"><b>Titans Radio</b><span>Open the official Titans audio page. Geographic and digital restrictions may apply.</span><em>Official team</em></a></div>`;
    return `<div class="media-provider-grid"><a class="media-provider" href="${OFFICIAL.nflPlus}" target="_blank" rel="noopener noreferrer"><b>NFL+</b><span>Every NFL game: home, away & national live audio calls.</span><em>All games</em></a><a class="media-provider" href="${OFFICIAL.tuneIn}" target="_blank" rel="noopener noreferrer"><b>TuneIn Premium</b><span>Live local Titans call all season, per Titans' official watch/listen guide.</span><em>Subscription</em></a><a class="media-provider" href="${OFFICIAL.sirius}" target="_blank" rel="noopener noreferrer"><b>SiriusXM</b><span>Licensed NFL play-by-play with team channels and home/away feeds.</span><em>North America</em></a></div>`;
  }

  function radioSection(g){
    const local=state.area==='nashville',international=state.area==='international';
    const intro=local?'Nashville flagship: WGFX 104.5 The Zone. Use the official station or Titans game-audio player below; NFL geographic/device restrictions can still apply.':international?'International audio and streaming rights vary by country. Use the official country guide first.':'For Titans games outside the Nashville market in the U.S., use an NFL-licensed all-game audio provider.';
    const localDeck=local?`<div class="media-radio-player"><div class="media-onair"><i></i><span>${g?'NEXT TITANS BROADCAST':'NASHVILLE SPORTS RADIO'}</span><strong>${esc(g?gameLabel(g):'104.5 The Zone')}</strong><small>${g?fmt(g.date):'Official listening options'}</small></div><div class="media-radio-launch" role="group" aria-label="Official Titans Radio listening options"><a class="media-radio-launch-main" href="${OFFICIAL.titansLiveAudio}" target="_blank" rel="noopener noreferrer"><small>GAME AUDIO</small><strong>Listen on Titans Radio</strong><span>The official live-audio button appears when the broadcast is available. Mobile home-market rules apply.</span><b>Open official game audio ↗</b></a><a class="media-radio-launch-alt" href="${OFFICIAL.zonePlayer}" target="_blank" rel="noopener noreferrer"><small>104.5 THE ZONE</small><strong>Open the official station player</strong><span>Current 104.5 web player · player ID 3234.</span><b>Open 104.5 ↗</b></a></div><p class="media-rights-note">The Command Center does not hotlink or rebroadcast the station’s raw audio stream. That avoids broken-player errors and keeps playback on the current rights-holder player. You can keep this page open for kickoff times, affiliates and watch guidance.</p><div class="media-action-row"><a class="button" target="_blank" rel="noopener noreferrer" href="${OFFICIAL.zoneListen}">104.5 listening options ↗</a><a class="button" target="_blank" rel="noopener noreferrer" href="${OFFICIAL.titansRadio}">Titans Radio broadcast page ↗</a></div></div>`:'';
    return `<section class="media-radio-deck"><div class="media-radio-top"><div><small>LISTEN</small><h2>Titans Radio</h2><p>${intro}</p></div><div class="media-radio-dial"><span>104.5</span><small>THE ZONE</small></div></div>${localDeck}${radioProviderGrid()}<details class="media-affiliates"><summary>Terrestrial Titans Radio affiliates</summary><div>${stationAffiliates().map(x=>`<div><strong>${x[0]}</strong><span>${x[1]}</span><small>${x[2]}</small></div>`).join('')}</div><p>Use your actual radio for AM/FM reception. iPhones do not expose an AM/FM tuner to websites, so web playback uses authorized digital sources instead.</p></details></section>`
  }

  function watchSection(g){
    const providers=providerCards(g);
    const heading=g?`How to watch ${esc(gameLabel(g))}`:'How to watch the Titans';
    const scheduleLine=g?`${fmt(g.date)} · ${esc(g.network||'Network TBD')}`:"Authorized viewing options are matched from the game's network and your market.";
    const cards=providers.map(p=>`<a class="media-watch-card" href="${safeUrl(p.url)}" target="_blank" rel="noopener noreferrer"><small>${esc(p.badge)}</small><strong>${esc(p.name)}</strong><span>${esc(p.note)}</span><b>Open provider ↗</b></a>`).join('');
    const internationalNote=state.area==='international'?'<p class="media-rights-note">The U.S. broadcast network shown above is schedule context only. International rights differ by country; use the country guide for the authoritative local provider.</p>':'';
    return `<section class="media-watch"><header><div><small>WATCH</small><h2>${heading}</h2><p>${scheduleLine}</p></div><a class="button" href="${OFFICIAL.titansWatch}" target="_blank" rel="noopener noreferrer">Official Titans guide ↗</a></header>${internationalNote}<div class="media-watch-grid">${cards}</div><div class="media-watch-note"><strong>Why we route instead of embedding live games</strong><p>NFL live video is protected by broadcaster authentication, DRM, market rules and commercial media rights. There is no public third-party API that legally hands this site the raw game stream. This page sends fans to the authorized service and can become more precise as we add licensed broadcast/TV-listing data.</p></div></section>`;
  }

  function futureSection(){return `<section class="media-future"><div><small>MEDIA ROADMAP</small><h2>What unlocks a true all-games media layer?</h2></div><div class="media-future-grid"><article><strong>1. All-game audio</strong><p>Already solvable today through NFL+, TuneIn Premium and SiriusXM in supported U.S./North American use cases. International availability must follow country-specific rights.</p></article><article><strong>2. Market-aware TV routing</strong><p>Use a licensed listings/broadcast feed such as Gracenote, Sportradar or SportsDataIO to resolve network and market details. The site can then say exactly where a fan should watch without guessing.</p></article><article><strong>3. In-app live video</strong><p>This requires a direct commercial rights agreement with the NFL/broadcaster plus DRM/authentication integration. A normal public developer key is not enough.</p></article><article><strong>4. Official highlights</strong><p>YouTube Data + IFrame APIs can support embeddable official Titans/NFL videos when the rights holder allows embedding. This is a good next media enhancement without touching live-game rights.</p></article></div></section>`}

  function syncChrome(){document.querySelectorAll('[data-route]').forEach(a=>{const active=a.dataset.route===route();a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});const sidebar=document.querySelector('#sidebar');sidebar?.classList.remove('open');if(sidebar&&matchMedia('(max-width: 759px)').matches)sidebar.inert=true;const more=document.querySelector('#mobile-more-button');if(more){more.setAttribute('aria-expanded','false');more.setAttribute('aria-pressed','false')}}
  function mediaPage(){if(!app)return;const g=nextGame();app.innerHTML=`<section class="media-page"><header class="media-hero"><div><div class="eyebrow">TITANS MEDIA CENTER</div><h1>Listen / Watch</h1><p>One simple place to find the Titans broadcast you can legally use — local radio, all-game audio, TV and streaming.</p>${areaSwitch()}</div><div class="media-next"><small>NEXT GAME</small><strong>${esc(gameLabel(g))}</strong><span>${g?fmt(g.date):'Schedule loading'}</span><em>${esc(g?.network||'Network TBD')}</em></div></header>${radioSection(g)}${watchSection(g)}${futureSection()}</section>`;syncChrome()}

  function homeCard(){if(route()!=='home'||document.querySelector('.media-home-card'))return;const hero=document.querySelector('.fan-hero');if(!hero)return;const g=nextGame(),card=document.createElement('section');card.className='media-home-card';const scheduleLine=g?`${fmt(g.date)} · ${esc(g.network||'Network TBD')}`:'Find the authorized radio or streaming option.';card.innerHTML=`<div><small>LISTEN / WATCH</small><strong>${esc(g?gameLabel(g):'Titans media')}</strong><span>${scheduleLine}</span></div><a href="#media">Open media center →</a>`;hero.insertAdjacentElement('afterend',card)}

  document.addEventListener('click',event=>{
    const areaButton=event.target instanceof Element?event.target.closest('[data-media-area]'):null;
    if(areaButton&&route()==='media'){
      event.preventDefault();
      const next=areaButton.dataset.mediaArea;
      if(!['nashville','us','international'].includes(next))return;
      state.area=next;
      storageSet(AREA_KEY,next);
      mediaPage();
      return;
    }
    const mediaLink=event.target instanceof Element?event.target.closest('a[href="#media"]'):null;
    if(mediaLink){
      event.preventDefault();
      if(location.hash!=='#media')history.pushState(null,'','#media');
      load().then(()=>mediaPage());
    }
  },true);

  async function render(){await load();if(route()==='media')mediaPage();else homeCard()}
  window.addEventListener('hashchange',()=>setTimeout(render,0));
  window.addEventListener('popstate',()=>setTimeout(render,0));
  if(app)new MutationObserver(()=>queueMicrotask(()=>{if(route()==='media'){if(!app.querySelector('.media-page')){if(state.data)mediaPage();else render()}}else homeCard()})).observe(app,{childList:true,subtree:false});
  setTimeout(render,40);
})();
