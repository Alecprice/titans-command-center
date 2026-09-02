(()=>{
  'use strict';

  const SHORTLIST_KEY='titans:tickets-shortlist-v123';
  const MEMORY_KEY='titans:tickets-price-memory-v124';
  const SHORTLIST_CHANGE='titans:ticket-shortlist-change';
  const MARKER='__TitansTicketCompareCacheBridgeV141';
  const existing=window[MARKER];
  if(existing?.loaded)return;

  const state={
    loaded:true,
    version:'v156',
    checks:0,
    repairs:0,
    centerRebinds:0,
    semanticDispatches:0,
    legacyWakeups:0,
    last:null
  };
  window[MARKER]=state;
  window.__TitansTicketCompareConvergenceV156=state;

  const app=document.querySelector('#app');
  const runtime=window.TitansRuntime;
  if(!app)return;

  const MAX_SAVED=3;
  let queued=false;
  let boundCenter=null;
  let centerObserver=null;

  const route=()=>runtime?.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';
  const money=value=>Number.isFinite(value)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value):'—';
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function ensureStyles(){
    if(document.querySelector('link[data-tickets-compare-v125]'))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='/tickets-compare-v125.css?v=1';
    link.dataset.ticketsCompareV125='1';
    document.head.append(link);
  }

  function readJson(key,fallback){
    const viaRuntime=runtime?.storage?.getJSON?.(key,undefined);
    if(viaRuntime!==undefined&&viaRuntime!==null)return viaRuntime;
    try{
      const raw=localStorage.getItem(key);
      return raw==null?fallback:(JSON.parse(raw)??fallback);
    }catch{return fallback;}
  }

  function saved(){
    const value=readJson(SHORTLIST_KEY,[]);
    return Array.isArray(value)?value.filter(item=>item&&typeof item.key==='string').slice(0,MAX_SAVED):[];
  }

  function memory(){
    const value=readJson(MEMORY_KEY,{events:{}});
    return value&&typeof value==='object'&&value.events&&typeof value.events==='object'?value:{events:{}};
  }

  function partySize(center){
    const active=center.querySelector('[data-ticket-tenx-party][aria-pressed="true"]');
    return Math.min(4,Math.max(1,Number(active?.dataset.ticketTenxParty)||2));
  }

  function record(card){
    const rawPrice=Number(card.dataset.ticketTenxPrice);
    const title=card.querySelector('.tickets-event-copy h3')?.textContent?.trim()||'Titans matchup';
    const copy=[...card.querySelectorAll('.tickets-event-copy p')].map(node=>node.textContent.trim()).filter(Boolean);
    return {
      key:card.dataset.ticketTenxKey||'',
      title,
      date:copy[0]||'Date TBD',
      venue:copy[1]||'Venue TBD',
      side:(card.querySelector('.tickets-event-tags span')?.textContent||'').trim(),
      price:Number.isFinite(rawPrice)&&rawPrice>0?rawPrice:null,
      sources:Math.max(0,Number(card.dataset.ticketTenxSources)||0)
    };
  }

  function currentRecords(center){
    return [...center.querySelectorAll('.tickets-compare-card[data-ticket-tenx-key]')]
      .map(record)
      .filter(item=>item.key);
  }

  function movement(event){
    const points=Array.isArray(event?.points)?event.points:[];
    if(points.length<2)return {kind:'first',label:'Baseline only'};
    const current=Number(points.at(-1)?.price);
    const previous=Number(points.at(-2)?.price);
    if(!Number.isFinite(current)||!Number.isFinite(previous)||previous<=0)return {kind:'first',label:'Baseline only'};
    const delta=current-previous;
    const pct=Math.round((Math.abs(delta)/previous)*100);
    if(delta<0)return {kind:'down',label:`Down ${money(Math.abs(delta))}${pct?` · ${pct}%`:''}`};
    if(delta>0)return {kind:'up',label:`Up ${money(delta)}${pct?` · ${pct}%`:''}`};
    return {kind:'flat',label:'No change observed'};
  }

  function savedRecords(center,items){
    const current=new Map(currentRecords(center).map(item=>[item.key,item]));
    const observed=memory();
    return items.map(item=>{
      const live=current.get(item.key);
      const history=observed.events?.[item.key];
      return {
        key:item.key,
        title:live?.title||item.title||history?.title||'Titans matchup',
        date:live?.date||item.date||history?.date||'Date TBD',
        venue:live?.venue||'Venue unavailable',
        side:live?.side||'',
        price:live?.price??null,
        sources:live?.sources||0,
        movement:live?.price!=null?movement(history):{kind:'unavailable',label:'Not in current board'},
        live:Boolean(live)
      };
    });
  }

  function badges(item,items){
    const priced=items.filter(entry=>entry.price!=null);
    const lowest=priced.length?Math.min(...priced.map(entry=>entry.price)):null;
    const mostSources=Math.max(0,...items.map(entry=>entry.sources||0));
    const labels=[];
    if(item.price!=null&&lowest!=null&&item.price===lowest)labels.push('LOWEST SAVED START');
    if(item.sources>0&&item.sources===mostSources&&mostSources>=2)labels.push('MOST SOURCES');
    if(item.movement.kind==='down')labels.push('PRICE DOWN');
    return labels;
  }

  function priceDifference(item,items){
    if(item.price==null)return 'Current starting price unavailable';
    const prices=items.map(entry=>entry.price).filter(Number.isFinite);
    if(!prices.length)return 'Current starting price unavailable';
    const lowest=Math.min(...prices);
    const gap=item.price-lowest;
    return gap===0?'Lowest saved starting price':`${money(gap)} above lowest saved start`;
  }

  function cardMarkup(item,items,party){
    const total=item.price!=null?item.price*party:null;
    const tags=badges(item,items).map(label=>`<span>${esc(label)}</span>`).join('');
    return `<article class="tickets-compare-v125-card" data-ticket-compare-key="${esc(item.key)}">
      <header><div>${tags?`<div class="tickets-compare-v125-badges">${tags}</div>`:''}<h3>${esc(item.title)}</h3><p>${esc(item.date)}${item.side?` · ${esc(item.side)}`:''}</p><small>${esc(item.venue)}</small></div></header>
      <dl>
        <div><dt>Starting price</dt><dd>${item.price!=null?esc(money(item.price)):'Check live'}</dd></div>
        <div><dt>${party} ticket${party===1?'':'s'}</dt><dd>${total!=null?`${esc(money(total))} <small>before fees</small>`:'— <small>before fees when a current price is available</small>'}</dd></div>
        <div><dt>Source coverage</dt><dd>${item.sources?`${item.sources} source${item.sources===1?'':'s'}`:'Not current'}</dd></div>
        <div><dt>Observed move</dt><dd class="${esc(item.movement.kind)}">${esc(item.movement.label)}</dd></div>
      </dl>
      <p class="tickets-compare-v125-gap">${esc(priceDifference(item,items))}</p>
      <div class="tickets-compare-v125-actions">
        ${item.live?`<button type="button" data-ticket-compare-focus="${esc(item.key)}">View offers</button>`:''}
        <button type="button" data-ticket-tenx-save="${esc(item.key)}" aria-label="Remove ${esc(item.title)} from shortlist">Remove</button>
      </div>
    </article>`;
  }

  function markup(items,party){
    const count=items.length;
    const prompt=count<2?'<p class="tickets-compare-v125-prompt">Save one more matchup to unlock a true side-by-side decision view.</p>':'';
    return `<section class="tickets-compare-v125" data-ticket-compare-v125 data-ticket-compare-owner="v156" aria-label="Saved matchup comparison">
      <header><div><small>TENX · SAVED GAME COMPARE</small><h2>${count>=2?'Your finalists, side by side.':'Build your final matchup list.'}</h2><p>Compares only the live starting prices, source counts, and browser-observed movement already shown in Ticket Center.</p></div><span>${count}/${MAX_SAVED} saved</span></header>
      ${prompt}
      <div class="tickets-compare-v125-grid">${items.map(item=>cardMarkup(item,items,party)).join('')}</div>
      <footer><span>Party totals are starting price × ticket count, before fees. Seat quality and checkout fees are not inferred.</span><button type="button" data-ticket-compare-share aria-label="Share saved ticket plan">Share plan</button></footer>
      <p class="tickets-compare-v125-status" data-ticket-compare-status role="status" aria-live="polite"></p>
    </section>`;
  }

  function panelKeys(panel){
    return panel?[...panel.querySelectorAll('.tickets-compare-v125-card')]
      .map(card=>card.dataset.ticketCompareKey||'')
      .filter(Boolean):[];
  }

  function settled(center,items){
    const panel=center.querySelector('[data-ticket-compare-v125]');
    if(!items.length)return !panel;
    if(!panel)return false;
    const expected=items.map(item=>item.key);
    const actual=panelKeys(panel);
    return expected.length===actual.length&&expected.every((key,index)=>key===actual[index]);
  }

  function render(center,items){
    let panel=center.querySelector('[data-ticket-compare-v125]');
    if(!items.length){
      panel?.remove();
      return;
    }
    const records=savedRecords(center,items);
    const holder=document.createElement('div');
    holder.innerHTML=markup(records,partySize(center));
    const fresh=holder.firstElementChild;
    if(!fresh)return;
    if(panel){panel.replaceWith(fresh);return;}
    const tray=center.querySelector('[data-ticket-tenx-shortlist]');
    if(tray)tray.after(fresh);
    else center.querySelector('[data-ticket-tenx-command]')?.append(fresh);
  }

  function bindCenter(center){
    if(boundCenter===center)return;
    centerObserver?.disconnect();
    boundCenter=center||null;
    if(!boundCenter)return;
    state.centerRebinds+=1;
    centerObserver=new MutationObserver(mutations=>{
      if(mutations.some(mutation=>mutation.type==='attributes'&&mutation.attributeName==='data-ticket-tenx-saved-count'))schedule('saved-count');
    });
    centerObserver.observe(boundCenter,{attributes:true,attributeFilter:['data-ticket-tenx-saved-count']});
  }

  function wakeLegacy(center,items){
    const keys=items.map(item=>item.key);
    state.semanticDispatches+=1;
    center.dispatchEvent(new CustomEvent(SHORTLIST_CHANGE,{bubbles:true,detail:{count:items.length,keys:[...keys],reason:'compare-convergence-v156'}}));
    requestAnimationFrame(()=>{
      const liveCenter=app.querySelector('[data-ticket-center]');
      if(!liveCenter)return;
      const liveItems=saved();
      if(settled(liveCenter,liveItems))return;
      state.legacyWakeups+=1;
      window.dispatchEvent(new StorageEvent('storage',{key:SHORTLIST_KEY,newValue:JSON.stringify(liveItems)}));
    });
  }

  function reconcile(reason='scheduled'){
    queued=false;
    if(route()!=='tickets'){
      bindCenter(null);
      return;
    }
    const center=app.querySelector('[data-ticket-center]');
    bindCenter(center);
    if(!center)return;
    const items=saved();
    const commandReady=Boolean(center.querySelector('[data-ticket-tenx-command]'));
    const before=settled(center,items);
    state.checks+=1;
    state.last={reason,savedCount:items.length,commandReady,settledBefore:before,owner:center.querySelector('[data-ticket-compare-v125]')?.dataset.ticketCompareOwner||'legacy-or-none'};
    if(!commandReady)return;
    if(before)return;
    ensureStyles();
    render(center,items);
    state.repairs+=1;
    state.last={...state.last,settledAfter:settled(center,items),owner:center.querySelector('[data-ticket-compare-v125]')?.dataset.ticketCompareOwner||'none'};
    wakeLegacy(center,items);
  }

  function schedule(reason='scheduled'){
    if(queued)return;
    queued=true;
    queueMicrotask(()=>reconcile(reason));
  }

  app.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    if(!target?.closest('[data-ticket-tenx-save],[data-ticket-tenx-clear]'))return;
    queueMicrotask(reconcile);
  },true);
  app.addEventListener(SHORTLIST_CHANGE,()=>schedule('shortlist-event'));
  addEventListener('storage',event=>{if(event.key===SHORTLIST_KEY||event.key===MEMORY_KEY)schedule('storage');});
  new MutationObserver(()=>schedule('app-replaced')).observe(app,{childList:true,subtree:false});
  runtime?.onRoute?.(()=>schedule('route'),{immediate:true});
  runtime?.onAppRender?.(()=>schedule('app-render'),{immediate:true});
  addEventListener('hashchange',()=>schedule('hashchange'));
  schedule('initial');
})();
