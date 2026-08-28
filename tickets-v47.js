(() => {
  'use strict';

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!runtime||!app)return;

  const OFFICIAL_URL='https://seatgeek.com/tennessee-titans-tickets';
  const state={payload:null,data:null,filter:'all',loading:null,renderToken:0};
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const route=()=>runtime.route();
  const money=value=>Number.isFinite(Number(value))?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(value)):'Price unavailable';
  const safeUrl=value=>{try{const url=new URL(String(value||''));return url.protocol==='https:'&&(url.hostname==='seatgeek.com'||url.hostname.endsWith('.seatgeek.com'))?url.href:OFFICIAL_URL}catch{return OFFICIAL_URL}};
  function venueLocal(value,timeTbd=false){
    const match=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
    if(!match)return'Date TBD';
    const date=new Date(Date.UTC(Number(match[1]),Number(match[2])-1,Number(match[3]),Number(match[4]||12),Number(match[5]||0)));
    const options={timeZone:'UTC',weekday:'short',month:'short',day:'numeric'};
    if(!timeTbd&&match[4])Object.assign(options,{hour:'numeric',minute:'2-digit'});
    return new Intl.DateTimeFormat('en-US',options).format(date)+(timeTbd?' · Time TBD':'');
  }
  function priceBand(price){
    const value=Number(price);
    if(!Number.isFinite(value))return {key:'unknown',label:'Price unavailable',order:99};
    if(value<50)return {key:'under-50',label:'Under $50',order:0};
    if(value<100)return {key:'50-99',label:'$50–$99',order:1};
    if(value<200)return {key:'100-199',label:'$100–$199',order:2};
    return {key:'200-plus',label:'$200+',order:3};
  }
  function sortedEvents(events){
    return [...(Array.isArray(events)?events:[])].sort((a,b)=>(Number.isFinite(Number(a.lowestPrice))?Number(a.lowestPrice):Number.MAX_SAFE_INTEGER)-(Number.isFinite(Number(b.lowestPrice))?Number(b.lowestPrice):Number.MAX_SAFE_INTEGER)||String(a.datetimeUtc||'').localeCompare(String(b.datetimeUtc||'')));
  }
  function groupEvents(events){
    const groups=new Map();
    for(const event of sortedEvents(events)){
      const band=event.priceBand?.key?event.priceBand:priceBand(event.lowestPrice);
      if(!groups.has(band.key))groups.set(band.key,{...band,events:[]});
      groups.get(band.key).events.push(event);
    }
    return [...groups.values()].sort((a,b)=>a.order-b.order);
  }
  function eventCard(event,index){
    const count=Number(event.listingCount);
    const listingText=Number.isFinite(count)?`${count.toLocaleString()} ${count===1?'listing':'listings'} available`:'Live inventory';
    const where=[event.venue?.name,event.venue?.city,event.venue?.state].filter(Boolean).join(' · ');
    return `<article class="tickets-event-card${index===0?' cheapest-event':''}">
      <div class="tickets-price-block"><small>${index===0?'CHEAPEST IN THIS GROUP':'STARTING AT'}</small><strong>${esc(money(event.lowestPrice))}</strong><span>per ticket</span></div>
      <div class="tickets-event-copy">
        <div class="tickets-event-tags"><span>${esc(event.homeAway==='home'?'HOME':event.homeAway==='away'?'AWAY':'TITANS')}</span>${index===0?'<b>LOWEST FIRST</b>':''}</div>
        <h3>${esc(event.title)}</h3>
        <p>${esc(venueLocal(event.datetimeLocal,event.timeTbd))}</p>
        <p>${esc(where||'Venue TBD')}</p>
        <div class="tickets-event-meta"><span>${esc(listingText)}</span>${Number.isFinite(Number(event.averagePrice))?`<span>Average ${esc(money(event.averagePrice))}</span>`:''}</div>
      </div>
      <a class="tickets-buy-button" href="${esc(safeUrl(event.url))}" target="_blank" rel="noopener noreferrer">See all tickets <span aria-hidden="true">↗</span></a>
    </article>`;
  }
  function priceGroups(events){
    const filtered=events.filter(event=>state.filter==='all'||event.homeAway===state.filter);
    if(!filtered.length)return '<div class="tickets-empty"><strong>No ticketed games match this filter.</strong><span>Try All games, or open SeatGeek for the full Titans ticket marketplace.</span></div>';
    return groupEvents(filtered).map(group=>`<section class="tickets-price-group" data-price-group="${esc(group.key)}">
      <header><div><small>PRICE GROUP</small><h2>${esc(group.label)}</h2></div><span>${group.events.length} ${group.events.length===1?'game':'games'}</span></header>
      <div class="tickets-event-list">${group.events.map((event,index)=>eventCard(event,index)).join('')}</div>
    </section>`).join('');
  }
  function fallbackGames(){
    const now=Date.now();
    return (Array.isArray(state.data?.games)?state.data.games:[]).filter(game=>{
      const stamp=Date.parse(game.date);
      return game.status!=='final'&&game.status!=='bye'&&(!Number.isFinite(stamp)||stamp>Date.now()-21600000);
    }).sort((a,b)=>(Date.parse(a.date)||Number.MAX_SAFE_INTEGER)-(Date.parse(b.date)||Number.MAX_SAFE_INTEGER));
  }
  function unavailableBody(){
    const games=fallbackGames();
    return `<section class="tickets-offline-state" role="status">
      <div><small>LIVE PRICE FEED</small><h2>${state.payload?.configured?'Temporarily unavailable':'Not connected yet'}</h2><p>${esc(state.payload?.message||'Live SeatGeek starting prices are not connected to this deployment yet.')}</p></div>
      <a href="${OFFICIAL_URL}" target="_blank" rel="noopener noreferrer" class="tickets-primary-link">Browse live SeatGeek tickets ↗</a>
    </section>
    ${games.length?`<section class="tickets-upcoming"><header><small>UPCOMING TITANS GAMES</small><h2>Pick a game, then compare every available seat.</h2></header><div class="tickets-upcoming-list">${games.map(game=>`<a href="${OFFICIAL_URL}" target="_blank" rel="noopener noreferrer"><span><b>${esc(game.homeAway==='home'?'VS':'AT')}</b><strong>${esc(game.opponent||game.opponentAbbr||'Opponent TBD')}</strong></span><em>${esc(runtime.formatTeamKickoff?.(game.date,{weekday:'short',month:'short',day:'numeric'})||'Date TBD')}</em><i>View tickets ↗</i></a>`).join('')}</div></section>`:''}`;
  }
  function shell(body){
    return `<section class="tickets-center-v47" data-ticket-center>
      <header class="tickets-hero">
        <div class="tickets-hero-copy"><div class="eyebrow">TICKETS · OFFICIAL SEATGEEK PATH</div><h1>Titans Tickets</h1><p>Find the cheapest available Titans games first. Price groups always run low to high, and every buy button opens the complete verified SeatGeek inventory for that game.</p></div>
        <div class="tickets-hero-price-rule"><small>DEFAULT SORT</small><strong>Cheapest first. Always.</strong><span>No deal-score reshuffling.</span></div>
      </header>
      <div class="tickets-trust-strip"><span><b>Official source:</b> Titans single-game ticket purchases route to SeatGeek.</span><span><b>Price note:</b> SeatGeek includes mandatory fees in displayed ticket prices; taxes, delivery, or optional add-ons may still apply.</span></div>
      <div class="tickets-toolbar" aria-label="Ticket game filters"><div role="group" aria-label="Filter ticketed games"><button type="button" data-ticket-filter="all" aria-pressed="${state.filter==='all'}">All games</button><button type="button" data-ticket-filter="home" aria-pressed="${state.filter==='home'}">Home</button><button type="button" data-ticket-filter="away" aria-pressed="${state.filter==='away'}">Away</button></div><a href="${OFFICIAL_URL}" target="_blank" rel="noopener noreferrer">Open SeatGeek ↗</a></div>
      <div class="tickets-body">${body}</div>
      <footer class="tickets-source-note"><strong>Why no individual seat rows here?</strong><span>The standard SeatGeek developer feed exposes live event inventory summaries and starting prices, while SeatGeek owns the complete seat-by-seat marketplace. Titans Command Center sends you directly to that verified inventory instead of scraping or inventing listings.</span></footer>
    </section>`;
  }
  function loading(){return shell('<div class="tickets-loading" role="status"><span></span><strong>Checking Titans ticket inventory…</strong></div>');}
  function renderCurrent(){
    if(route()!=='tickets')return;
    const events=sortedEvents(state.payload?.events||[]);
    app.innerHTML=shell(state.payload?.available&&events.length?priceGroups(events):unavailableBody());
  }
  async function loadTickets(force=false){
    if(state.loading&&!force)return state.loading;
    const token=++state.renderToken;
    state.loading=Promise.all([
      runtime.apiJson('/api/tickets',{ttl:60000,force}),
      runtime.apiJson('/api/data',{ttl:30000,force:false}),
    ]).then(([payload,data])=>{
      if(token!==state.renderToken)return;
      state.payload=payload||{configured:false,available:false,events:[],message:'Ticket inventory is unavailable.'};
      state.data=data||state.data;
      renderCurrent();
    }).finally(()=>{if(token===state.renderToken)state.loading=null;});
    return state.loading;
  }
  function mountTickets(){
    if(route()!=='tickets')return;
    if(!app.querySelector('[data-ticket-center]'))app.innerHTML=loading();
    loadTickets(false);
  }
  function enhanceHome(){
    if(route()!=='home'||app.querySelector('[data-ticket-home]'))return;
    const actions=app.querySelector('.fan-hero-actions');
    if(!actions)return;
    const link=document.createElement('a');
    link.className='fan-cta tickets-home-cta';
    link.href='#tickets';
    link.dataset.ticketHome='1';
    link.innerHTML='Buy Titans tickets <span aria-hidden="true">→</span>';
    actions.prepend(link);
  }
  function reconcile(){
    if(route()==='tickets')mountTickets();
    else if(route()==='home')enhanceHome();
  }

  app.addEventListener('click',event=>{
    const button=event.target instanceof Element?event.target.closest('[data-ticket-filter]'):null;
    if(!button||route()!=='tickets')return;
    const next=button.dataset.ticketFilter;
    if(!['all','home','away'].includes(next))return;
    state.filter=next;
    renderCurrent();
  });
  runtime.onRoute(()=>{state.renderToken++;state.loading=null;queueMicrotask(reconcile);},{immediate:true});
  runtime.onAppRender(()=>queueMicrotask(reconcile),{immediate:true});
  runtime.onRefresh(()=>{if(route()==='tickets'){state.loading=null;loadTickets(true);}});
})();
