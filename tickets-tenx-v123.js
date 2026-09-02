(() => {
  'use strict';

  if(window.__TitansTicketTenxV123)return;
  window.__TitansTicketTenxV123=true;

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!app)return;

  const VERSION='123';
  const STORAGE_KEY='titans:tickets-shortlist-v123';
  const PRICE_MEMORY_KEY='titans:tickets-price-memory-v124';
  const SHORTLIST_CHANGE='titans:ticket-shortlist-change';
  const MAX_SAVED=3;
  const state={budget:'all',sort:'price',party:2,queued:false};
  const money=value=>Number.isFinite(value)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value):'—';
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const route=()=>runtime?.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';

  function ensureStyles(){
    if(document.querySelector('link[data-tickets-tenx-v123]'))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='/tickets-tenx-v123.css?v=1';
    link.dataset.ticketsTenxV123='1';
    document.head.append(link);
  }

  function parsePrice(text){
    const source=String(text||'').replace(/,/g,'');
    if(!source.includes('$'))return null;
    const match=source.match(/\$\s*([0-9]+(?:\.[0-9]+)?)/);
    const value=match?Number(match[1]):NaN;
    return Number.isFinite(value)&&value>0?value:null;
  }

  function hashKey(text){
    let hash=2166136261;
    for(let index=0;index<text.length;index+=1){hash^=text.charCodeAt(index);hash=Math.imul(hash,16777619);}
    return `tix-${(hash>>>0).toString(36)}`;
  }

  function readSaved(){
    const value=runtime?.storage?.getJSON?.(STORAGE_KEY,[]);
    return Array.isArray(value)?value.filter(item=>item&&typeof item.key==='string').slice(0,MAX_SAVED):[];
  }

  function readMemory(){
    const value=runtime?.storage?.getJSON?.(PRICE_MEMORY_KEY,{events:{}});
    return value&&typeof value==='object'&&value.events&&typeof value.events==='object'?value:{events:{}};
  }

  function observedDrop(item,memory){
    const points=Array.isArray(memory?.events?.[item.key]?.points)?memory.events[item.key].points:[];
    if(points.length<2||item.price==null)return null;
    const current=Number(points.at(-1)?.price);
    const previous=Number(points.at(-2)?.price);
    if(!Number.isFinite(current)||!Number.isFinite(previous)||current<=0||previous<=current||current!==item.price)return null;
    const amount=previous-current;
    const pct=Math.round((amount/previous)*100);
    return {amount,pct,previous,current};
  }

  function writeSaved(value){runtime?.storage?.setJSON?.(STORAGE_KEY,value.slice(0,MAX_SAVED));}

  function announceSaved(center,saved=readSaved()){
    const items=Array.isArray(saved)?saved.filter(item=>item&&typeof item.key==='string').slice(0,MAX_SAVED):[];
    const keys=items.map(item=>item.key);
    const count=keys.length;
    center.dataset.ticketTenxSavedCount=String(count);
    const tray=center.querySelector('[data-ticket-tenx-shortlist]');
    if(tray)tray.dataset.ticketTenxSavedCount=String(count);
    center.dispatchEvent(new CustomEvent(SHORTLIST_CHANGE,{bubbles:true,detail:{count,keys:[...keys]}}));
    window.dispatchEvent(new StorageEvent('storage',{key:STORAGE_KEY,newValue:JSON.stringify(items)}));
  }

  function recordFor(card,index){
    const title=card.querySelector('.tickets-event-copy h3')?.textContent?.trim()||'Titans matchup';
    const copy=[...card.querySelectorAll('.tickets-event-copy p')].map(node=>node.textContent.trim()).filter(Boolean);
    const date=copy[0]||'Date TBD';
    const venue=copy[1]||'Venue TBD';
    const side=(card.querySelector('.tickets-event-tags span')?.textContent||'').trim().toLowerCase();
    const sourceText=card.querySelector('.tickets-event-tags b')?.textContent||'';
    const sourceCount=Number(sourceText.match(/\d+/)?.[0]||0);
    const price=parsePrice(card.querySelector('.tickets-price-block strong')?.textContent);
    const insight=card.querySelector('.tickets-price-block em')?.textContent||'';
    const spreadPct=Number(insight.match(/\((\d+)%\)/)?.[1]||NaN);
    const nextGap=parsePrice(insight.match(/Next best is (\$\s*[0-9]+(?:\.[0-9]+)?)/i)?.[1]||'');
    const key=hashKey(`${title}|${date}|${venue}`);
    return {card,index,key,title,date,venue,side,sourceCount,price,spreadPct:Number.isFinite(spreadPct)?spreadPct:null,nextGap};
  }

  function records(center){return [...center.querySelectorAll('.tickets-compare-card')].map(recordFor);}

  function budgetCap(){
    if(state.budget==='75')return 75;
    if(state.budget==='100')return 100;
    if(state.budget==='150')return 150;
    return null;
  }

  function medianPrice(items){
    const values=items.map(item=>item.price).filter(Number.isFinite).sort((a,b)=>a-b);
    if(!values.length)return null;
    const middle=Math.floor(values.length/2);
    return values.length%2?values[middle]:(values[middle-1]+values[middle])/2;
  }

  function recommendation(record,cheapest){
    if(record.price!=null&&cheapest!=null&&record.price===cheapest)return['LOWEST ENTRY','Best starting price currently reported'];
    if(record.sourceCount>=3&&record.spreadPct!=null&&record.spreadPct<=15)return['STRONG CROSS-CHECK',`${record.sourceCount} sources with a relatively tight starting-price spread`];
    if(record.sourceCount>=2)return['COMPARE CHECKOUT','Multiple sources available — compare fees and seat quality'];
    return['VERIFY LIVE','Only one usable starting-price source is visible'];
  }

  function summaryMarkup(items){
    const priced=items.filter(item=>item.price!=null);
    const cheapest=priced.length?Math.min(...priced.map(item=>item.price)):null;
    const home=priced.filter(item=>item.side==='home');
    const cheapestHome=home.length?Math.min(...home.map(item=>item.price)):null;
    const multiSource=items.filter(item=>item.sourceCount>=2).length;
    return `<div class="tickets-tenx-metrics" aria-label="Ticket decision summary">
      <div><small>BEST ENTRY</small><strong>${esc(money(cheapest))}</strong><span>Lowest reported starting price</span></div>
      <div><small>MEDIAN GAME</small><strong>${esc(money(medianPrice(priced)))}</strong><span>Median of visible starting prices</span></div>
      <div><small>BEST HOME</small><strong>${esc(money(cheapestHome))}</strong><span>Lowest home-game starting price</span></div>
      <div><small>MULTI-SOURCE</small><strong>${multiSource}/${items.length}</strong><span>Games cross-checked by 2+ sources</span></div>
    </div>`;
  }

  function commandMarkup(items){
    const saved=readSaved();
    return `<section class="tickets-tenx-command" data-ticket-tenx-command data-version="${VERSION}" aria-label="Ticket decision tools">
      <header><div><small>TENX · TICKET DECISION CENTER</small><h2>Pick the game, then verify the checkout.</h2><p>Budget filters use reported starting prices only. We do not invent fee estimates.</p></div><span data-ticket-tenx-visible>${items.length} games shown</span></header>
      ${summaryMarkup(items)}
      <div class="tickets-tenx-controls">
        <fieldset><legend>Budget per ticket</legend><button type="button" data-ticket-tenx-budget="all" aria-pressed="${state.budget==='all'}">Any price</button><button type="button" data-ticket-tenx-budget="75" aria-pressed="${state.budget==='75'}">≤ $75</button><button type="button" data-ticket-tenx-budget="100" aria-pressed="${state.budget==='100'}">≤ $100</button><button type="button" data-ticket-tenx-budget="150" aria-pressed="${state.budget==='150'}">≤ $150</button></fieldset>
        <fieldset><legend>Sort games</legend><button type="button" data-ticket-tenx-sort="price" aria-pressed="${state.sort==='price'}">Cheapest</button><button type="button" data-ticket-tenx-sort="sources" aria-pressed="${state.sort==='sources'}">Most sources</button><button type="button" data-ticket-tenx-sort="drops" aria-pressed="${state.sort==='drops'}" disabled>Observed drops</button></fieldset>
        <fieldset><legend>Party size</legend>${[1,2,3,4].map(size=>`<button type="button" data-ticket-tenx-party="${size}" aria-pressed="${state.party===size}">${size}</button>`).join('')}</fieldset>
      </div>
      <div class="tickets-tenx-shortlist" data-ticket-tenx-shortlist data-ticket-tenx-saved-count="${saved.length}"><div><strong>Compare shortlist</strong><span>Save up to ${MAX_SAVED} matchups. Prices refresh from the live cards when available.</span></div><div data-ticket-tenx-saved>${saved.length?`${saved.length}/${MAX_SAVED} saved`:'Nothing saved yet'}</div>${saved.length?'<button type="button" data-ticket-tenx-clear>Clear</button>':''}</div>
      <p class="tickets-tenx-status" data-ticket-tenx-status role="status" aria-live="polite"></p>
    </section>`;
  }

  function ensureCommand(center,items){
    let command=center.querySelector('[data-ticket-tenx-command]');
    if(command)return command;
    command=document.createElement('div');
    command.innerHTML=commandMarkup(items);
    const node=command.firstElementChild;
    const anchor=center.querySelector('.tickets-provider-health')||center.querySelector('.tickets-trust-strip')||center.querySelector('.tickets-toolbar');
    if(anchor)anchor.after(node);else center.prepend(node);
    return node;
  }

  function decorate(items){
    const savedKeys=new Set(readSaved().map(item=>item.key));
    const priced=items.filter(item=>item.price!=null);
    const cheapest=priced.length?Math.min(...priced.map(item=>item.price)):null;
    for(const item of items){
      item.card.dataset.ticketTenxKey=item.key;
      item.card.dataset.ticketTenxPrice=item.price==null?'':String(item.price);
      item.card.dataset.ticketTenxSources=String(item.sourceCount||0);
      let tools=item.card.querySelector('[data-ticket-tenx-card-tools]');
      if(!tools){
        tools=document.createElement('div');
        tools.className='tickets-tenx-card-tools';
        tools.dataset.ticketTenxCardTools='1';
        item.card.append(tools);
      }
      const [label,detail]=recommendation(item,cheapest);
      const total=item.price!=null?item.price*state.party:null;
      const gap=item.nextGap!=null?` · lowest source is ${money(item.nextGap)} below the next reported source`:'';
      tools.innerHTML=`<div class="tickets-tenx-signal"><small>${esc(label)}</small><strong>${esc(detail)}</strong><span>${total!=null?`${esc(money(total))} for ${state.party} before fees${esc(gap)}`:'Open a marketplace to check current price and inventory'}</span></div><button type="button" data-ticket-tenx-save="${esc(item.key)}" aria-pressed="${savedKeys.has(item.key)}">${savedKeys.has(item.key)?'Saved ✓':'Save matchup'}</button>`;
    }
  }

  function savedTray(center,items){
    const saved=readSaved();
    const current=new Map(items.map(item=>[item.key,item]));
    const tray=center.querySelector('[data-ticket-tenx-shortlist]');
    if(!tray)return;
    const content=saved.map(savedItem=>{
      const live=current.get(savedItem.key);
      const title=live?.title||savedItem.title||'Titans matchup';
      const date=live?.date||savedItem.date||'Date TBD';
      const price=live?.price??null;
      return `<article><span><strong>${esc(title)}</strong><small>${esc(date)}</small></span><b>${price!=null?`${esc(money(price))} from`:'Price not in current filter'}</b><button type="button" data-ticket-tenx-save="${esc(savedItem.key)}" aria-label="Remove ${esc(title)} from shortlist">×</button></article>`;
    }).join('');
    tray.classList.toggle('has-saved',Boolean(saved.length));
    tray.dataset.ticketTenxSavedCount=String(saved.length);
    center.dataset.ticketTenxSavedCount=String(saved.length);
    tray.innerHTML=`<div><strong>Compare shortlist</strong><span>${saved.length?`${saved.length}/${MAX_SAVED} saved · current prices shown when this filter includes the matchup`:`Save up to ${MAX_SAVED} matchups to keep your finalists together.`}</span></div><div class="tickets-tenx-saved-cards">${content||'<em>Nothing saved yet</em>'}</div>${saved.length?'<button type="button" data-ticket-tenx-clear>Clear</button>':''}`;
  }

  function apply(center,items){
    const cap=budgetCap();
    const list=center.querySelector('.tickets-compare-list');
    const memory=readMemory();
    const drops=new Map(items.map(item=>[item.key,observedDrop(item,memory)]));
    const dropCount=[...drops.values()].filter(Boolean).length;
    if(state.sort==='drops'&&!dropCount)state.sort='price';
    const sorted=[...items].sort((a,b)=>{
      if(state.sort==='sources')return (b.sourceCount-a.sourceCount)||((a.price??Number.MAX_SAFE_INTEGER)-(b.price??Number.MAX_SAFE_INTEGER));
      if(state.sort==='drops'){
        const aDrop=drops.get(a.key)?.amount||0;
        const bDrop=drops.get(b.key)?.amount||0;
        return (bDrop-aDrop)||((a.price??Number.MAX_SAFE_INTEGER)-(b.price??Number.MAX_SAFE_INTEGER))||(b.sourceCount-a.sourceCount);
      }
      return ((a.price??Number.MAX_SAFE_INTEGER)-(b.price??Number.MAX_SAFE_INTEGER))||(b.sourceCount-a.sourceCount);
    });
    if(list)for(const item of sorted)list.append(item.card);
    let visible=0;
    for(const item of sorted){
      const drop=drops.get(item.key);
      if(drop){item.card.dataset.ticketObservedDrop=String(drop.amount);item.card.dataset.ticketObservedDropPct=String(drop.pct);}
      else{delete item.card.dataset.ticketObservedDrop;delete item.card.dataset.ticketObservedDropPct;}
      const show=cap==null||(item.price!=null&&item.price<=cap);
      item.card.hidden=!show;
      if(show)visible+=1;
    }
    const dropButton=center.querySelector('[data-ticket-tenx-sort="drops"]');
    if(dropButton){
      dropButton.disabled=dropCount===0;
      dropButton.textContent=dropCount?`Observed drops (${dropCount})`:'Observed drops';
      dropButton.setAttribute('aria-label',dropCount?`Sort with ${dropCount} browser-observed price drop${dropCount===1?'':'s'} first`:'Observed drops unavailable until this browser records a lower current price after an earlier observation');
    }
    const visibleNode=center.querySelector('[data-ticket-tenx-visible]');
    if(visibleNode)visibleNode.textContent=`${visible} of ${items.length} games shown`;
    let empty=center.querySelector('[data-ticket-tenx-empty]');
    if(!empty&&list){empty=document.createElement('div');empty.className='tickets-tenx-empty';empty.dataset.ticketTenxEmpty='1';empty.innerHTML='<strong>No games fit this budget.</strong><span>Try a higher cap or Any price. Games without a live starting price are hidden by budget filters.</span>';list.after(empty);}
    if(empty)empty.hidden=visible>0;
    center.querySelectorAll('[data-ticket-tenx-budget]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.ticketTenxBudget===state.budget)));
    center.querySelectorAll('[data-ticket-tenx-sort]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.ticketTenxSort===state.sort)));
    center.querySelectorAll('[data-ticket-tenx-party]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.ticketTenxParty)===state.party)));
    const boardCount=center.querySelector('.tickets-comparison-board>header>span');
    if(boardCount)boardCount.textContent=cap==null?`${items.length} games`:`${visible} within budget`;
  }

  function setStatus(center,message){const node=center.querySelector('[data-ticket-tenx-status]');if(node)node.textContent=message;}

  function toggleSaved(center,key){
    const items=records(center);
    const item=items.find(entry=>entry.key===key);
    let saved=readSaved();
    const exists=saved.some(entry=>entry.key===key);
    if(exists){saved=saved.filter(entry=>entry.key!==key);writeSaved(saved);setStatus(center,'Removed matchup from your compare shortlist.');}
    else{
      if(saved.length>=MAX_SAVED){setStatus(center,`Shortlist is full. Remove one of the ${MAX_SAVED} saved matchups first.`);return;}
      saved.push({key,title:item?.title||'Titans matchup',date:item?.date||'Date TBD'});
      writeSaved(saved);
      setStatus(center,'Saved matchup to your compare shortlist.');
    }
    decorate(items);
    savedTray(center,items);
    announceSaved(center,saved);
  }

  function enhance(){
    state.queued=false;
    if(route()!=='tickets')return;
    ensureStyles();
    const center=app.querySelector('[data-ticket-center]');
    if(!center)return;
    const items=records(center);
    if(!items.length)return;
    center.classList.add('tickets-tenx-v123');
    ensureCommand(center,items);
    decorate(items);
    savedTray(center,items);
    apply(center,items);
  }

  function schedule(){if(state.queued)return;state.queued=true;queueMicrotask(enhance);}
  function scheduleAfterMemoryCapture(){schedule();requestAnimationFrame(schedule);}

  app.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    if(!target)return;
    const center=target.closest('[data-ticket-center]');
    if(!center)return;
    const budget=target.closest('[data-ticket-tenx-budget]');
    if(budget){state.budget=budget.dataset.ticketTenxBudget||'all';apply(center,records(center));setStatus(center,state.budget==='all'?'Showing every priced game.':`Showing games at ${money(Number(state.budget))} or less per ticket.`);return;}
    const sort=target.closest('[data-ticket-tenx-sort]');
    if(sort){
      if(sort.disabled)return;
      state.sort=sort.dataset.ticketTenxSort||'price';
      apply(center,records(center));
      const message=state.sort==='sources'?'Sorted by source coverage, then price.':state.sort==='drops'?'Sorted with the largest price drops observed in this browser first, then current starting price. This is local history, not marketplace-wide.':'Sorted by lowest reported starting price.';
      setStatus(center,message);
      return;
    }
    const party=target.closest('[data-ticket-tenx-party]');
    if(party){state.party=Math.min(4,Math.max(1,Number(party.dataset.ticketTenxParty)||2));decorate(records(center));apply(center,records(center));setStatus(center,`Showing simple starting-price totals for ${state.party} ticket${state.party===1?'':'s'} before fees.`);return;}
    const save=target.closest('[data-ticket-tenx-save]');
    if(save){toggleSaved(center,save.dataset.ticketTenxSave||'');return;}
    if(target.closest('[data-ticket-tenx-clear]')){const saved=[];writeSaved(saved);decorate(records(center));savedTray(center,records(center));announceSaved(center,saved);setStatus(center,'Compare shortlist cleared.');return;}
    if(target.closest('[data-ticket-refresh],[data-ticket-trend-clear]'))requestAnimationFrame(schedule);
  });

  addEventListener('storage',event=>{if(event.key===PRICE_MEMORY_KEY)schedule();});
  new MutationObserver(schedule).observe(app,{childList:true,subtree:false});
  runtime?.onRoute?.(scheduleAfterMemoryCapture,{immediate:true});
  runtime?.onAppRender?.(scheduleAfterMemoryCapture,{immediate:true});
  addEventListener('hashchange',scheduleAfterMemoryCapture);
  scheduleAfterMemoryCapture();
})();