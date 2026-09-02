(() => {
  'use strict';

  if(globalThis.__titansMediaAffiliateFinderLoaded)return;
  globalThis.__titansMediaAffiliateFinderLoaded=true;

  const OFFICIAL_AFFILIATES='https://www.tennesseetitans.com/broadcast/titans-radio/titans-radio-affiliates';
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize=v=>String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

  const STATIONS=[
    {state:'Tennessee',call:'WGFX',frequency:'104.5 The Zone',city:'Nashville (Flagship)'},
    {state:'Tennessee',call:'WCLE',frequency:'104.1 FM',city:'Cleveland'},
    {state:'Tennessee',call:'WQAK',frequency:'105.7 FM',city:'Union City'},
    {state:'Tennessee',call:'WKFN',frequency:'AM & FM 540 AM',city:'Clarksville'},
    {state:'Tennessee',call:'WKFN',frequency:'104.1 FM',city:'Clarksville'},
    {state:'Tennessee',call:'WZDQ',frequency:'102.3 FM',city:'Jackson'},
    {state:'Tennessee',call:'WKOM',frequency:'101.7 FM',city:'Columbia'},
    {state:'Tennessee',call:'WANT',frequency:'98.9 FM',city:'Lebanon'},
    {state:'Tennessee',call:'WCOR',frequency:'1490 AM',city:'Lebanon'},
    {state:'Tennessee',call:'WZNG',frequency:'100.9 FM',city:'Shelbyville'},
    {state:'Tennessee',call:'WZNG',frequency:'1400 AM',city:'Shelbyville'},
    {state:'Tennessee',call:'WAKM',frequency:'950 AM',city:'Franklin'},
    {state:'Tennessee',call:'WQMV',frequency:'93.5 FM',city:'Waverly'},
    {state:'Tennessee',call:'WQMV',frequency:'1060 AM',city:'Waverly'},
    {state:'Tennessee',call:'WJJM',frequency:'94.3 FM',city:'Lewisburg'},
    {state:'Tennessee',call:'WRJB',frequency:'95.9 FM',city:'Camden'},
    {state:'Tennessee',call:'WMSR',frequency:'1320 AM',city:'Manchester'},
    {state:'Tennessee',call:'WMSR',frequency:'107.9 FM',city:'Manchester'},
    {state:'Tennessee',call:'WGOW',frequency:'1150 AM',city:'Chattanooga'},
    {state:'Tennessee',call:'WGOW',frequency:'102.3 FM',city:'Chattanooga'},
    {state:'Tennessee',call:'WCRK',frequency:'105.7 FM',city:'Morristown'},
    {state:'Tennessee',call:'WOKI',frequency:'98.7 FM',city:'Knoxville'},
    {state:'Tennessee',call:'WKXD',frequency:'106.9 FM',city:'Cookeville'},
    {state:'Tennessee',call:'WKIM',frequency:'98.9 FM',city:'Memphis'},
    {state:'Tennessee',call:'WXSM',frequency:'640 AM',city:'Tri-Cities'},
    {state:'Tennessee',call:'WCDT',frequency:'1340 AM',city:'Winchester'},
    {state:'Tennessee',call:'WIKQ',frequency:'103.1 FM',city:'Greeneville'},
    {state:'Alabama',call:'WWIC',frequency:'1050 AM',city:'Scottsboro'},
    {state:'Alabama',call:'WJOX',frequency:'94.5 FM',city:'Birmingham'},
    {state:'Alabama',call:'WQLT',frequency:'107.3 FM',city:'Florence'},
    {state:'Alabama',call:'WZZN',frequency:'97.7',city:'Huntsville'},
    {state:'Alabama',call:'WJTW',frequency:'AM 1480',city:'Bridgeport'},
    {state:'Kentucky',call:'WCBL',frequency:'AM 1290',city:'Benton'},
    {state:'Kentucky',call:'WPTQ',frequency:'105.3 FM',city:'Bowling Green'},
    {state:'Kentucky',call:'WSON',frequency:'860 AM',city:'Henderson'},
    {state:'Kentucky',call:'WSON',frequency:'96.5 FM',city:'Henderson'},
    {state:'Kentucky',call:'WKDZ',frequency:'106.5 FM',city:'Cadiz'},
    {state:'Kentucky',call:'WAIN',frequency:'101.9 FM',city:'Columbia'},
    {state:'Kentucky',call:'WAIN',frequency:'1270 AM',city:'Columbia'}
  ].map((station,index)=>({...station,index,search:normalize(`${station.call} ${station.frequency} ${station.city} ${station.state}`)}));

  const STATES=['Tennessee','Alabama','Kentucky'];

  function stationCard(station){
    return `<article class="media-affiliate-card" data-affiliate-station data-affiliate-search="${esc(station.search)}"><strong>${esc(station.call)}</strong><span>${esc(station.frequency)}</span><small>${esc(station.city)}</small></article>`;
  }

  function stateGroup(state){
    const stations=STATIONS.filter(station=>station.state===state);
    return `<section class="media-affiliate-state" data-affiliate-state="${esc(state)}"><header><strong>${esc(state)}</strong><small>${stations.length} station${stations.length===1?'':'s'}</small></header><div class="media-affiliate-grid">${stations.map(stationCard).join('')}</div></section>`;
  }

  function finderHtml(){
    return `<summary>Find a Titans Radio affiliate <span>${STATIONS.length} stations · official 2026 network</span></summary><div class="media-affiliate-panel"><div class="media-affiliate-tools"><label><span>Search city, station or frequency</span><input type="search" inputmode="search" autocomplete="off" spellcheck="false" placeholder="Greeneville, WIKQ, 103.1…" data-affiliate-search-input aria-controls="titans-affiliate-results" /></label><button type="button" data-affiliate-clear aria-label="Clear affiliate search">Clear</button></div><p class="media-affiliate-count" data-affiliate-count role="status" aria-live="polite">${STATIONS.length} stations across Tennessee, Alabama and Kentucky.</p><div id="titans-affiliate-results" class="media-affiliate-results">${STATES.map(stateGroup).join('')}</div><div class="media-affiliate-source"><div><strong>Official Titans Radio Network</strong><span>Station list transcribed from the team’s page marked “Updated for 2026.” Broadcast availability can change.</span></div><a href="${OFFICIAL_AFFILIATES}" target="_blank" rel="noopener noreferrer">Verify official list ↗</a></div><p class="media-affiliate-note">Use an AM/FM radio when you are in a station’s coverage area. Digital game audio remains subject to NFL geographic and device restrictions.</p></div>`;
  }

  function applyFilter(details,value){
    if(!details)return;
    const query=normalize(value);
    let visible=0;
    details.querySelectorAll('[data-affiliate-station]').forEach(card=>{
      const match=!query||String(card.dataset.affiliateSearch||'').includes(query);
      card.hidden=!match;
      if(match)visible+=1;
    });
    details.querySelectorAll('[data-affiliate-state]').forEach(group=>{
      group.hidden=!group.querySelector('[data-affiliate-station]:not([hidden])');
    });
    const count=details.querySelector('[data-affiliate-count]');
    if(count)count.textContent=query?(visible?`${visible} of ${STATIONS.length} stations match “${String(value).trim()}”.`:`No 2026 Titans Radio affiliates match “${String(value).trim()}”.`):`${STATIONS.length} stations across Tennessee, Alabama and Kentucky.`;
  }

  function enhance(){
    if(route()!=='media')return;
    const details=document.querySelector('.media-affiliates');
    if(!details||details.dataset.affiliateFinder==='2026')return;
    details.dataset.affiliateFinder='2026';
    details.classList.add('media-affiliate-finder');
    details.innerHTML=finderHtml();
  }

  document.addEventListener('input',event=>{
    const input=event.target instanceof Element?event.target.closest('[data-affiliate-search-input]'):null;
    if(!input)return;
    const details=input.closest('.media-affiliate-finder');
    applyFilter(details,input.value);
  });

  document.addEventListener('click',event=>{
    const clear=event.target instanceof Element?event.target.closest('[data-affiliate-clear]'):null;
    if(!clear)return;
    const details=clear.closest('.media-affiliate-finder'),input=details?.querySelector('[data-affiliate-search-input]');
    if(!input)return;
    input.value='';
    applyFilter(details,'');
    input.focus();
  });

  if(!document.querySelector('link[data-media-affiliates-css]')){
    const style=document.createElement('link');
    style.rel='stylesheet';
    style.href='/media-affiliates-v14.css?v=1';
    style.dataset.mediaAffiliatesCss='true';
    document.head.append(style);
  }

  addEventListener('hashchange',()=>setTimeout(enhance,40));
  addEventListener('popstate',()=>setTimeout(enhance,40));
  const app=document.querySelector('#app');
  if(app)new MutationObserver(()=>queueMicrotask(enhance)).observe(app,{childList:true,subtree:false});
  setTimeout(enhance,120);
})();
