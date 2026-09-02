(() => {
  'use strict';

  if(window.__TitansTicketCompareV125)return;
  window.__TitansTicketCompareV125=true;

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!app)return;

  const SHORTLIST_KEY='titans:tickets-shortlist-v123';
  const MEMORY_KEY='titans:tickets-price-memory-v124';
  const FOCUS_COMPLETE_EVENT='titans:ticket-compare-focus-complete';
  const MAX_FOCUS_SETTLE_FRAMES=18;
  const MAX_SAVED=3;
  let queued=false;

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

  function readSaved(){
    const value=runtime?.storage?.getJSON?.(SHORTLIST_KEY,[]);
    return Array.isArray(value)?value.filter(item=>item&&typeof item.key==='string').slice(0,MAX_SAVED):[];
  }

  function readMemory(){
    const value=runtime?.storage?.getJSON?.(MEMORY_KEY,{events:{}});
    return value&&typeof value==='object'&&value.events&&typeof value.events==='object'?value:{events:{}};
  }

  function partySize(center){
    const active=center.querySelector('[data-ticket-tenx-party][aria-pressed="true"]');
    return Math.min(4,Math.max(1,Number(active?.dataset.ticketTenxParty)||2));
  }

  function record(card){
    const key=card.dataset.ticketTenxKey||'';
    const rawPrice=Number(card.dataset.ticketTenxPrice);
    const title=card.querySelector('.tickets-event-copy h3')?.textContent?.trim()||'Titans matchup';
    const copy=[...card.querySelectorAll('.tickets-event-copy p')].map(node=>node.textContent.trim()).filter(Boolean);
    const date=copy[0]||'Date TBD';
    const venue=copy[1]||'Venue TBD';
    const side=(card.querySelector('.tickets-event-tags span')?.textContent||'').trim();
    const sources=Math.max(0,Number(card.dataset.ticketTenxSources)||0);
    return {card,key,title,date,venue,side,price:Number.isFinite(rawPrice)&&rawPrice>0?rawPrice:null,sources};
  }

  function currentRecords(center){
    return [...center.querySelectorAll('.tickets-compare-card[data-ticket-tenx-key]')].map(record).filter(item=>item.key);
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

  function savedRecords(center){
    const current=new Map(currentRecords(center).map(item=>[item.key,item]));
    const memory=readMemory();
    return readSaved().map(saved=>{
      const live=current.get(saved.key);
      const observed=memory.events?.[saved.key];
      return {
        key:saved.key,
        title:live?.title||saved.title||observed?.title||'Titans matchup',
        date:live?.date||saved.date||observed?.date||'Date TBD',
        venue:live?.venue||'Venue unavailable',
        side:live?.side||'',
        price:live?.price??null,
        sources:live?.sources||0,
        movement:live?.price!=null?movement(observed):{kind:'unavailable',label:'Not in current board'},
        live:Boolean(live)
      };
    });
  }

  function shareUrl(){
    return `${location.origin}${location.pathname}#tickets`;
  }

  function shareText(items,party){
    const lines=['Tennessee Titans ticket shortlist'];
    items.forEach((item,index)=>{
      const total=item.price!=null?item.price*party:null;
      const sources=item.sources?`${item.sources} source${item.sources===1?'':'s'}`:'Source coverage not current';
      const place=item.venue&&item.venue!=='Venue unavailable'?` · ${item.venue}`:'';
      lines.push('');
      lines.push(`${index+1}. ${item.title}`);
      lines.push(`${item.date}${item.side?` · ${item.side}`:''}${place}`);
      lines.push(item.price!=null?`Current start: ${money(item.price)} · ${party} ticket${party===1?'':'s'}: ${money(total)} before fees · ${sources}`:`Current starting price unavailable · ${sources}`);
      lines.push(`Browser-observed movement: ${item.movement.label}`);
    });
    lines.push('');
    lines.push('Ticket Center uses current reported starting prices. Party totals are starting price × ticket count, before fees. Seat quality and checkout fees are not inferred.');
    return lines.join('\n');
  }

  async function sharePlan(center){
    const items=savedRecords(center);
    if(!items.length){setStatus(center,'Save a matchup before sharing a ticket plan.');return;}
    const party=partySize(center);
    const text=shareText(items,party);
    const url=shareUrl();
    try{
      if(typeof navigator.share==='function'){
        await navigator.share({title:'Titans ticket shortlist',text,url});
        setStatus(center,'Shared your saved Ticket Center plan.');
        return;
      }
    }catch(error){
      if(error?.name==='AbortError'){
        setStatus(center,'Share canceled. Your shortlist is unchanged.');
        return;
      }
    }
    try{
      if(navigator.clipboard?.writeText){
        await navigator.clipboard.writeText(`${text}\n\nOpen Ticket Center: ${url}`);
        setStatus(center,'Share is not available here, so the ticket plan was copied to your clipboard.');
        return;
      }
    }catch{}
    setStatus(center,'Sharing is unavailable in this browser. Your saved matchups are unchanged.');
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
    return `<section class="tickets-compare-v125" data-ticket-compare-v125 aria-label="Saved matchup comparison">
      <header><div><small>TENX · SAVED GAME COMPARE</small><h2>${count>=2?'Your finalists, side by side.':'Build your final matchup list.'}</h2><p>Compares only the live starting prices, source counts, and browser-observed movement already shown in Ticket Center.</p></div><span>${count}/${MAX_SAVED} saved</span></header>
      ${prompt}
      <div class="tickets-compare-v125-grid">${items.map(item=>cardMarkup(item,items,party)).join('')}</div>
      <footer><span>Party totals are starting price × ticket count, before fees. Seat quality and checkout fees are not inferred.</span><button type="button" data-ticket-compare-share aria-label="Share saved ticket plan">Share plan</button></footer>
      <p class="tickets-compare-v125-status" data-ticket-compare-status role="status" aria-live="polite"></p>
    </section>`;
  }

  function render(center){
    const saved=readSaved();
    let panel=center.querySelector('[data-ticket-compare-v125]');
    if(!saved.length){panel?.remove();return;}
    const items=savedRecords(center);
    const html=markup(items,partySize(center));
    const holder=document.createElement('div');
    holder.innerHTML=html;
    const fresh=holder.firstElementChild;
    if(!fresh)return;
    if(panel){panel.replaceWith(fresh);return;}
    const tray=center.querySelector('[data-ticket-tenx-shortlist]');
    if(tray)tray.after(fresh);
    else center.querySelector('[data-ticket-tenx-command]')?.append(fresh);
  }

  function setStatus(center,message){
    const node=center.querySelector('[data-ticket-compare-status]')||center.querySelector('[data-ticket-tenx-status]');
    if(node)node.textContent=message;
  }

  function findCard(center,key){
    return [...center.querySelectorAll('.tickets-compare-card[data-ticket-tenx-key]')].find(node=>node.dataset.ticketTenxKey===key)||null;
  }

  function requestCanonicalFilters(center){
    const selectors=[
      '[data-ticket-filter="all"]',
      '[data-ticket-tenx-budget="all"]',
      '[data-ticket-finalists-view="all"]',
      '[data-ticket-finalists-budget="all"]'
    ];
    for(const selector of selectors){
      const control=center.querySelector(selector);
      if(control&&!control.disabled&&control.getAttribute('aria-pressed')!=='true')control.click();
    }
  }

  function focusState(center,key){
    const all=center.querySelector('[data-ticket-filter="all"]')?.getAttribute('aria-pressed')==='true';
    const ticketBudget=center.querySelector('[data-ticket-tenx-budget="all"]')?.getAttribute('aria-pressed')==='true';
    const allGames=center.querySelector('[data-ticket-finalists-view="all"]')?.getAttribute('aria-pressed')==='true';
    const groupBudget=center.querySelector('[data-ticket-finalists-budget="all"]')?.getAttribute('aria-pressed')==='true';
    const card=findCard(center,key);
    return {settled:Boolean(all&&ticketBudget&&allGames&&groupBudget&&card&&!card.hidden),card};
  }

  function settleReveal(center,key,frame=0,stableFrames=0){
    if(route()!=='tickets'||!center.isConnected)return;
    requestCanonicalFilters(center);
    const current=focusState(center,key);
    if(current.settled&&current.card){
      const focusTarget=current.card.querySelector('.tickets-offer-row a,[data-ticket-tenx-save],button,a');
      if(focusTarget&&!current.card.contains(document.activeElement))focusTarget.focus({preventScroll:true});
      const focused=current.card.contains(document.activeElement);
      if(focused&&stableFrames>=1){
        current.card.scrollIntoView({behavior:'smooth',block:'center'});
        center.dataset.ticketCompareFocusComplete=key;
        center.dispatchEvent(new CustomEvent(FOCUS_COMPLETE_EVENT,{bubbles:true,detail:{key}}));
        setStatus(center,'Showing the saved matchup and its current marketplace offers.');
        return;
      }
      if(frame<MAX_FOCUS_SETTLE_FRAMES){
        requestAnimationFrame(()=>settleReveal(center,key,frame+1,focused?stableFrames+1:0));
        return;
      }
    }else if(frame<MAX_FOCUS_SETTLE_FRAMES){
      requestAnimationFrame(()=>settleReveal(center,key,frame+1,0));
      return;
    }
    delete center.dataset.ticketCompareFocusComplete;
    setStatus(center,'Could not settle that saved matchup view. Try View offers again.');
  }

  function reveal(center,key){
    if(!key)return;
    delete center.dataset.ticketCompareFocusComplete;
    setStatus(center,'Opening that saved matchup and clearing conflicting ticket filters…');
    requestCanonicalFilters(center);
    requestAnimationFrame(()=>settleReveal(center,key,0,0));
  }

  function enhance(){
    queued=false;
    if(route()!=='tickets')return;
    ensureStyles();
    const center=app.querySelector('[data-ticket-center]');
    if(!center)return;
    if(!center.querySelector('[data-ticket-tenx-command]'))return;
    center.classList.add('tickets-compare-v125-ready');
    render(center);
  }

  function schedule(){if(queued)return;queued=true;queueMicrotask(enhance);}

  app.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    if(!target)return;
    const center=target.closest('[data-ticket-center]');
    if(!center)return;
    const share=target.closest('[data-ticket-compare-share]');
    if(share){void sharePlan(center);return;}
    const focus=target.closest('[data-ticket-compare-focus]');
    if(focus){reveal(center,focus.dataset.ticketCompareFocus||'');return;}
    if(target.closest('[data-ticket-tenx-save],[data-ticket-tenx-clear],[data-ticket-tenx-party],[data-ticket-tenx-budget],[data-ticket-tenx-sort],[data-ticket-trend-clear],[data-ticket-refresh],[data-ticket-filter]'))schedule();
  });

  addEventListener('storage',event=>{if(event.key===SHORTLIST_KEY||event.key===MEMORY_KEY)schedule();});
  new MutationObserver(schedule).observe(app,{childList:true,subtree:false});
  runtime?.onRoute?.(schedule,{immediate:true});
  runtime?.onAppRender?.(schedule,{immediate:true});
  addEventListener('hashchange',schedule);
  schedule();
})();