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
    sundayTicket:'https://tv.youtube.com/learn/nflsundayticket/',
    nflInternational:'https://www.nfl.com/international/ways-to-watch/by-country',
    dazn:'https://www.dazn.com/',
    everpass:'https://everpass.com/live-sports/nfl-sunday-ticket/'
  };

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const card=(item)=>`<a class="media-alt-card" href="${item.url}" target="_blank" rel="noopener noreferrer"><small>${esc(item.badge)}</small><strong>${esc(item.title)}</strong><span>${esc(item.note)}</span><b>${esc(item.action)} ↗</b></a>`;

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

  function render(){
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

  window.addEventListener('hashchange',()=>setTimeout(render,60));
  document.addEventListener('click',event=>{if(event.target instanceof Element&&event.target.closest('[data-media-area]'))setTimeout(render,80)},true);
  const app=document.querySelector('#app');
  if(app)new MutationObserver(()=>queueMicrotask(render)).observe(app,{childList:true,subtree:true});
  setTimeout(render,140);
})();
