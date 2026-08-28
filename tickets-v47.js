import './titans-social-v49.js';

(() => {
  'use strict';

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!runtime||!app)return;

  const OFFICIAL_URL='https://seatgeek.com/tennessee-titans-tickets';
  const CACHE_KEY='titans:tickets-fast-v52';
  const CACHE_TTL=5*60*1000;
  const state={payload:null,data:null,filter:'all',loading:null,dataLoading:null,renderToken:0,prefetched:false,refreshing:false};
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const route=()=>runtime.route();
  const finite=value=>Number.isFinite(Number(value))?Number(value):null;
  const money=value=>finite(value)!=null?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(value)):'Price unavailable';
  const safeUrl=value=>{try{const url=new URL(String(value||''));const host=url.hostname.toLowerCase();return url.protocol==='https:'&&(host==='seatgeek.com'||host.endsWith('.seatgeek.com')||host==='ticketmaster.com'||host.endsWith('.ticketmaster.com')||host==='stubhub.com'||host.endsWith('.stubhub.com'))?url.href:OFFICIAL_URL}catch{return OFFICIAL_URL}};
  function venueLocal(value,timeTbd=false){
    const match=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
    if(!match)return'Date TBD';
    const date=new Date(Date.UTC(Number(match[1]),Number(match[2])-1,Number(match[3]),Number(match[4]||12),Number(match[5]||0)));
    const options={timeZone:'UTC',weekday:'short',month:'short',day:'numeric'};
    if(!timeTbd&&match[4])Object.assign(options,{hour:'numeric',minute:'2-digit'});
    return new Intl.DateTimeFormat('en-US',options).format(date)+(timeTbd?' · Time TBD':'');
  }
  function ago(value){
    const stamp=Date.parse(value||'');
    if(!Number.isFinite(stamp))return'just now';
    const seconds=Math.max(0,Math.round((Date.now()-stamp)/1000));
    if(seconds<60)return`${seconds}s ago`;
    const minutes=Math.round(seconds/60);
    if(minutes<60)return`${minutes}m ago`;
    return`${Math.round(minutes/60)}h ago`;
  }
  function sortedGames(games){
    return [...(Array.isArray(games)?games:[])].filter(game=>state.filter==='all'||game.homeAway===state.filter).sort((a,b)=>(finite(a.lowestPrice)??Number.MAX_SAFE_INTEGER)-(finite(b.lowestPrice)??Number.MAX_SAFE_INTEGER)||String(a.datetimeUtc||a.datetimeLocal||'').localeCompare(String(b.datetimeUtc||b.datetimeLocal||'')));
  }
  function offerRow(offer,bestPrice){
    const price=finite(offer.lowestPrice);
    const delta=price!=null&&bestPrice!=null?price-bestPrice:null;
    const count=finite(offer.listingCount);
    return `<div class="tickets-offer-row${delta===0?' best':''}">
      <div><strong>${esc(offer.provider||'Marketplace')}</strong><span>${count!=null?`${count.toLocaleString()} listings`:'Marketplace inventory'}</span></div>
      <div class="tickets-offer-price"><b>${esc(money(price))}</b>${delta===0?'<span>BEST PRICE</span>':delta!=null?`<span>+${esc(money(delta))}</span>`:'<span>CHECK LIVE</span>'}</div>
      <a href="${esc(safeUrl(offer.url))}" target="_blank" rel="noopener noreferrer">${delta===0?'Buy cheapest':'View'} ↗</a>
    </div>`;
  }
  function comparisonGameCard(game,index){
    const offers=[...(Array.isArray(game.offers)?game.offers:[])].sort((a,b)=>(finite(a.lowestPrice)??Number.MAX_SAFE_INTEGER)-(finite(b.lowestPrice)??Number.MAX_SAFE_INTEGER));
    const best=finite(game.lowestPrice);
    const where=[game.venue?.name,game.venue?.city,game.venue?.state].filter(Boolean).join(' · ');
    return `<article class="tickets-compare-card${index===0?' global-cheapest':''}">
      <div class="tickets-price-block"><small>${index===0?'CHEAPEST TITANS TICKET NOW':'CHEAPEST NOW'}</small><strong>${esc(money(best))}</strong><span>${game.cheapestProvider?`via ${esc(game.cheapestProvider)}`:'starting price'}</span></div>
      <div class="tickets-event-copy">
        <div class="tickets-event-tags"><span>${esc(game.homeAway==='home'?'HOME':game.homeAway==='away'?'AWAY':'TITANS')}</span><b>${offers.length} ${offers.length===1?'SOURCE':'SOURCES'} CHECKED</b></div>
        <h3>${esc(game.title||'Tennessee Titans tickets')}</h3>
        <p>${esc(venueLocal(game.datetimeLocal,game.timeTbd))}</p><p>${esc(where||'Venue TBD')}</p>
      </div>
      <div class="tickets-offer-list">${offers.map(offer=>offerRow(offer,best)).join('')}</div>
    </article>`;
  }
  function comparisonBoard(games){
    const filtered=sortedGames(games);
    if(!filtered.length)return '<div class="tickets-empty"><strong>No ticketed games match this filter.</strong><span>Try All games or use the official Titans ticket links below.</span></div>';
    return `<section class="tickets-comparison-board"><header><div><small>LIVE PRICE COMPARISON</small><h2>Cheapest reported Titans tickets, lowest first</h2></div><span>${filtered.length} games</span></header><div class="tickets-compare-list">${filtered.map(comparisonGameCard).join('')}</div></section>`;
  }
  function fallbackGames(){
    return (Array.isArray(state.data?.games)?state.data.games:[]).filter(game=>{const stamp=Date.parse(game.date);return game.status!=='final'&&game.status!=='bye'&&(!Number.isFinite(stamp)||stamp>Date.now()-21600000);}).sort((a,b)=>(Date.parse(a.date)||Number.MAX_SAFE_INTEGER)-(Date.parse(b.date)||Number.MAX_SAFE_INTEGER));
  }
  function unavailableBody(){
    const games=fallbackGames();
    return `<section class="tickets-offline-state" role="status"><div><small>LIVE PRICE COMPARISON</small><h2>${state.payload?.configured?'Price sources unavailable':'Connect free price sources'}</h2><p>${esc(state.payload?.message||'Connect a free SeatGeek or Ticketmaster developer key to compare current starting prices. StubHub support is ready for approved affiliate API credentials.')}</p></div><button type="button" class="tickets-primary-link" data-ticket-refresh>${state.refreshing?'Checking…':'Check prices now'}</button></section>${games.length?`<section class="tickets-upcoming"><header><small>UPCOMING TITANS GAMES</small><h2>Official game links remain available while price feeds are offline.</h2></header><div class="tickets-upcoming-list">${games.map(game=>`<a href="${OFFICIAL_URL}" target="_blank" rel="noopener noreferrer"><span><b>${esc(game.homeAway==='home'?'VS':'AT')}</b><strong>${esc(game.opponent||game.opponentAbbr||'Opponent TBD')}</strong></span><em>${esc(runtime.formatTeamKickoff?.(game.date,{weekday:'short',month:'short',day:'numeric'})||'Date TBD')}</em><i>View tickets ↗</i></a>`).join('')}</div></section>`:''}`;
  }
  function providerSummary(){
    const results=Array.isArray(state.payload?.providerResults)?state.payload.providerResults:[];
    const successful=results.filter(result=>result.ok);
    const priceCount=successful.reduce((sum,result)=>sum+(Number(result.priceCount)||0),0);
    return `${successful.length} source${successful.length===1?'':'s'} compared · ${priceCount} priced event${priceCount===1?'':'s'} · updated ${ago(state.payload?.fetchedAt)}`;
  }
  function shell(body){
    const live=Array.isArray(state.payload?.games)&&state.payload.games.length;
    return `<section class="tickets-center-v47" data-ticket-center>
      <header class="tickets-hero"><div class="tickets-hero-copy"><div class="eyebrow">TICKETS · CHEAPEST CURRENT PRICE</div><h1>Titans Ticket Finder</h1><p>Compare every connected free marketplace feed at once. Games are sorted by the lowest current starting price we can verify, then you can jump straight to the marketplace showing that price.</p></div><div class="tickets-hero-price-rule"><small>${live?'CURRENT LEADER':'DEFAULT SORT'}</small><strong>${live?money(sortedGames(state.payload.games)[0]?.lowestPrice):'Cheapest first. Always.'}</strong><span>${live?`Lowest reported starting price · ${esc(sortedGames(state.payload.games)[0]?.cheapestProvider||'marketplace')}`:'No deal-score reshuffling.'}</span></div></header>
      <div class="tickets-trust-strip"><span><b>Comparison rule:</b> every configured free source is checked in parallel; we do not stop after the first provider answers.</span><span><b>Checkout rule:</b> starting prices are not guaranteed final totals. Compare fees, quantity and seat quality before buying.</span></div>
      <div class="tickets-toolbar" aria-label="Ticket game filters"><div role="group" aria-label="Filter ticketed games"><button type="button" data-ticket-filter="all" aria-pressed="${state.filter==='all'}">All games</button><button type="button" data-ticket-filter="home" aria-pressed="${state.filter==='home'}">Home</button><button type="button" data-ticket-filter="away" aria-pressed="${state.filter==='away'}">Away</button></div><div class="tickets-toolbar-actions"><span>${esc(providerSummary())}</span><button type="button" data-ticket-refresh ${state.refreshing?'disabled':''}>${state.refreshing?'Checking prices…':'Check prices now'}</button></div></div>
      <div class="tickets-body">${body}</div>
      <footer class="tickets-source-note"><strong>What “cheapest” means here</strong><span>Cheapest among the currently connected official marketplace APIs at their reported event-level starting price. SeatGeek exposes lowest-price event summaries; Ticketmaster Discovery exposes event price ranges; approved StubHub API access exposes minimum ticket prices. Individual seat inventory and final checkout totals stay on the marketplace.</span></footer>
    </section>`;
  }
  function loading(){return shell('<div class="tickets-loading" role="status"><span></span><strong>Checking connected ticket marketplaces…</strong></div>');}
  function readCachedPayload(){const cached=runtime.storage.getJSON(CACHE_KEY,null);if(!cached||!cached.payload||!Number.isFinite(Number(cached.savedAt)))return null;if(Date.now()-Number(cached.savedAt)>CACHE_TTL)return null;return cached.payload;}
  function cachePayload(payload){if(Array.isArray(payload?.games)&&payload.games.length)runtime.storage.setJSON(CACHE_KEY,{savedAt:Date.now(),payload});}
  function renderCurrent(){if(route()!=='tickets')return;const games=state.payload?.games||[];app.innerHTML=shell(Array.isArray(games)&&games.length?comparisonBoard(games):unavailableBody());}
  async function loadFallbackData(){if(state.dataLoading||state.data)return state.dataLoading;state.dataLoading=runtime.apiJson('/api/data',{ttl:60000,force:false}).then(data=>{if(data)state.data=data;if(route()==='tickets'&&!state.payload?.games?.length)renderCurrent();return data;}).finally(()=>{state.dataLoading=null;});return state.dataLoading;}
  async function loadTickets(force=false,bypassEdge=false){
    if(state.loading&&!force)return state.loading;
    const token=++state.renderToken;
    const endpoint=bypassEdge?'/api/tickets?refresh=1':'/api/tickets';
    state.refreshing=bypassEdge;
    if(route()==='tickets'&&bypassEdge)renderCurrent();
    state.loading=runtime.apiJson(endpoint,{ttl:bypassEdge?0:300000,force}).then(payload=>{if(token!==state.renderToken)return payload;if(payload)state.payload=payload;cachePayload(payload);state.refreshing=false;renderCurrent();if(!payload?.games?.length)loadFallbackData();return payload;}).catch(error=>{state.refreshing=false;renderCurrent();throw error;}).finally(()=>{if(token===state.renderToken)state.loading=null;});
    return state.loading;
  }
  function mountTickets(){if(route()!=='tickets')return;if(!state.payload)state.payload=readCachedPayload();if(!app.querySelector('[data-ticket-center]')){if(state.payload)renderCurrent();else app.innerHTML=loading();}loadTickets(false);}
  function prefetchTickets(){if(state.prefetched)return;state.prefetched=true;const run=()=>runtime.apiJson('/api/tickets',{ttl:300000,force:false}).then(payload=>{cachePayload(payload);return payload;});if('requestIdleCallback'in window)requestIdleCallback(()=>run(),{timeout:1800});else setTimeout(run,250);}
  function enhanceHome(){if(route()!=='home')return;prefetchTickets();if(app.querySelector('[data-ticket-home]'))return;const actions=app.querySelector('.fan-hero-actions');if(!actions)return;const link=document.createElement('a');link.className='fan-cta tickets-home-cta';link.href='#tickets';link.dataset.ticketHome='1';link.innerHTML='Find cheapest Titans tickets <span aria-hidden="true">→</span>';actions.prepend(link);}
  function reconcile(){if(route()==='tickets')mountTickets();else if(route()==='home')enhanceHome();}

  app.addEventListener('click',event=>{
    const filter=event.target instanceof Element?event.target.closest('[data-ticket-filter]'):null;
    if(filter&&route()==='tickets'){const next=filter.dataset.ticketFilter;if(['all','home','away'].includes(next)){state.filter=next;renderCurrent();}return;}
    const refresh=event.target instanceof Element?event.target.closest('[data-ticket-refresh]'):null;
    if(refresh&&route()==='tickets'&&!state.refreshing)loadTickets(true,true);
  });
  runtime.onRoute(()=>{state.renderToken++;state.loading=null;state.refreshing=false;queueMicrotask(reconcile);},{immediate:true});
  runtime.onAppRender(()=>queueMicrotask(()=>{if(route()==='home')enhanceHome();else if(route()==='tickets'&&!app.querySelector('[data-ticket-center]'))mountTickets();}),{immediate:true});
  runtime.onRefresh(()=>{if(route()==='tickets'){state.loading=null;loadTickets(true,true);}});
})();
