(() => {
  'use strict';

  if(window.__TitansTicketSignalLensV128)return;
  window.__TitansTicketSignalLensV128=true;

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!app)return;

  const MEMORY_KEY='titans:tickets-price-memory-v124';
  let queued=false;

  const route=()=>runtime?.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';
  const money=value=>Number.isFinite(value)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value):'—';
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function ensureStyles(){
    if(document.querySelector('link[data-tickets-signal-lens-v128]'))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='/tickets-signal-lens-v128.css?v=1';
    link.dataset.ticketsSignalLensV128='1';
    document.head.append(link);
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
    const rawPrice=Number(card.dataset.ticketTenxPrice);
    const price=Number.isFinite(rawPrice)&&rawPrice>0?rawPrice:null;
    const title=card.querySelector('.tickets-event-copy h3')?.textContent?.trim()||'Titans matchup';
    const date=card.querySelector('.tickets-event-copy p')?.textContent?.trim()||'Date TBD';
    const side=(card.querySelector('.tickets-event-tags span')?.textContent||'').trim().toLowerCase();
    const sources=Math.max(0,Number(card.dataset.ticketTenxSources)||0);
    return {card,key:card.dataset.ticketTenxKey||'',title,date,side,sources,price};
  }

  function records(center){
    return [...center.querySelectorAll('.tickets-compare-card[data-ticket-tenx-key]')].map(record).filter(item=>item.key);
  }

  function localDrop(event,currentPrice){
    const points=Array.isArray(event?.points)?event.points:[];
    if(points.length<2||currentPrice==null)return null;
    const previous=Number(points.at(-2)?.price);
    const current=Number(points.at(-1)?.price);
    if(!Number.isFinite(previous)||!Number.isFinite(current)||previous<=0||current!==currentPrice)return null;
    const delta=current-previous;
    if(delta>=0)return null;
    const amount=Math.abs(delta);
    const pct=Math.round((amount/previous)*100);
    return {amount,pct,previous,current};
  }

  function pickLowest(items){
    return [...items].filter(item=>item.price!=null).sort((a,b)=>a.price-b.price||b.sources-a.sources)[0]||null;
  }

  function pickMostSources(items){
    return [...items].filter(item=>item.sources>=2).sort((a,b)=>b.sources-a.sources||(a.price??Number.MAX_SAFE_INTEGER)-(b.price??Number.MAX_SAFE_INTEGER))[0]||null;
  }

  function pickMarketplaceAvailable(items){
    return [...items].filter(item=>item.sources>=1).sort((a,b)=>b.sources-a.sources)[0]||null;
  }

  function buildSignals(items,memory,party){
    const lowest=pickLowest(items);
    const lowestHome=pickLowest(items.filter(item=>item.side==='home'));
    const crossChecked=pickMostSources(items);
    const drops=items.map(item=>({item,drop:localDrop(memory.events?.[item.key],item.price)})).filter(entry=>entry.drop).sort((a,b)=>b.drop.amount-a.drop.amount||b.drop.pct-a.drop.pct);
    const biggestDrop=drops[0]||null;
    const marketplaceAvailable=!lowest&&!lowestHome&&!crossChecked&&!biggestDrop?pickMarketplaceAvailable(items):null;

    return [
      lowest?{
        kind:'lowest',label:'LOWEST CURRENT START',title:lowest.title,key:lowest.key,
        detail:`${money(lowest.price)} per ticket · ${money(lowest.price*party)} for ${party} before fees`,
        note:'Lowest reported starting price on the current board.'
      }:null,
      lowestHome?{
        kind:'home',label:'LOWEST HOME START',title:lowestHome.title,key:lowestHome.key,
        detail:`${money(lowestHome.price)} per ticket · ${money(lowestHome.price*party)} for ${party} before fees`,
        note:'Lowest reported starting price among current Titans home games.'
      }:null,
      crossChecked?{
        kind:'sources',label:'MOST CROSS-CHECKED',title:crossChecked.title,key:crossChecked.key,
        detail:`${crossChecked.sources} reported source${crossChecked.sources===1?'':'s'} · ${crossChecked.price!=null?`${money(crossChecked.price)} starting price`:'check live'}`,
        note:'Highest current marketplace source coverage; ties break toward lower starting price.'
      }:null,
      marketplaceAvailable?{
        kind:'marketplace',label:'MARKETPLACE AVAILABLE',title:marketplaceAvailable.title,key:marketplaceAvailable.key,
        detail:`${marketplaceAvailable.sources} source${marketplaceAvailable.sources===1?'':'s'} with offers · live price pending`,
        note:'Open the current marketplace for live price and inventory.'
      }:null,
      biggestDrop?{
        kind:'drop',label:'BIGGEST LOCAL DROP',title:biggestDrop.item.title,key:biggestDrop.item.key,
        detail:`Down ${money(biggestDrop.drop.amount)}${biggestDrop.drop.pct?` · ${biggestDrop.drop.pct}%`:''} since the prior browser observation`,
        note:`Previously observed at ${money(biggestDrop.drop.previous)} on this device.`
      }:{kind:'drop-empty',label:'LOCAL DROP WATCH',title:'No price drop observed yet',key:'',detail:'This browser needs at least two observations before a drop can be shown.',note:'No marketplace-wide history or prediction is inferred.'}
    ].filter(Boolean);
  }

  function signalMarkup(signal){
    const actionable=Boolean(signal.key);
    return `<article class="tickets-signal-v128-card ${esc(signal.kind)}" data-ticket-signal-kind="${esc(signal.kind)}"${actionable?` data-ticket-signal-key="${esc(signal.key)}"`:''}>
      <small>${esc(signal.label)}</small>
      <strong>${esc(signal.title)}</strong>
      <span>${esc(signal.detail)}</span>
      <p>${esc(signal.note)}</p>
      ${actionable?`<button type="button" data-ticket-signal-focus="${esc(signal.key)}">Show matchup</button>`:'<em>Observation only</em>'}
    </article>`;
  }

  function markup(signals){
    return `<section class="tickets-signal-v128" data-ticket-signal-lens-v128 aria-label="Ticket matchup signal lens">
      <header><div><small>TENX · SIGNAL LENS</small><h2>Why check these matchups first?</h2><p>These are factual board signals, not a deal score or buy/wait recommendation.</p></div><span>Current board + local observations</span></header>
      <div class="tickets-signal-v128-grid">${signals.map(signalMarkup).join('')}</div>
      <footer>Starting-price and source signals come from the live Ticket Center. Price-drop context uses only observations stored in this browser.</footer>
      <p class="tickets-signal-v128-status" data-ticket-signal-status role="status" aria-live="polite"></p>
    </section>`;
  }

  function render(center){
    const items=records(center);
    if(!items.length)return;
    const signals=buildSignals(items,readMemory(),partySize(center));
    const holder=document.createElement('div');
    holder.innerHTML=markup(signals);
    const fresh=holder.firstElementChild;
    let panel=center.querySelector('[data-ticket-signal-lens-v128]');
    if(panel){panel.replaceWith(fresh);return;}
    const trend=center.querySelector('[data-ticket-trend-v124]');
    const command=center.querySelector('[data-ticket-tenx-command]');
    if(trend)trend.before(fresh);
    else if(command)command.after(fresh);
  }

  function setStatus(center,message){
    const node=center.querySelector('[data-ticket-signal-status]')||center.querySelector('[data-ticket-tenx-status]');
    if(node)node.textContent=message;
  }

  function reveal(center,key){
    center.querySelector('[data-ticket-filter="all"]')?.click();
    center.querySelector('[data-ticket-tenx-budget="all"]')?.click();
    center.querySelector('[data-ticket-finalists-view="all"]')?.click();
    center.querySelector('[data-ticket-finalists-budget="all"]')?.click();
    const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const card=[...center.querySelectorAll('.tickets-compare-card[data-ticket-tenx-key]')].find(node=>node.dataset.ticketTenxKey===key);
      if(!card){setStatus(center,'That matchup is not in the current live ticket board.');return;}
      card.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});
      const focusTarget=card.querySelector('.tickets-offer-row a,[data-ticket-tenx-save],button,a');
      focusTarget?.focus?.({preventScroll:true});
      setStatus(center,'Showing the matchup behind that factual ticket signal.');
    }));
  }

  function decorateCards(center){
    const items=records(center);
    if(!items.length)return;
    const signals=buildSignals(items,readMemory(),partySize(center)).filter(signal=>signal.key);
    const labelsByKey=new Map();
    for(const signal of signals){
      const labels=labelsByKey.get(signal.key)||[];
      labels.push(signal.label);
      labelsByKey.set(signal.key,labels);
    }
    for(const item of items){
      let row=item.card.querySelector('[data-ticket-signal-badges]');
      const labels=labelsByKey.get(item.key)||[];
      if(!labels.length){row?.remove();continue;}
      if(!row){
        row=document.createElement('div');
        row.className='tickets-signal-v128-badges';
        row.dataset.ticketSignalBadges='1';
        const tools=item.card.querySelector('[data-ticket-tenx-card-tools]');
        if(tools)tools.before(row);else item.card.append(row);
      }
      row.innerHTML=labels.map(label=>`<span>${esc(label)}</span>`).join('');
    }
  }

  function enhance(){
    queued=false;
    if(route()!=='tickets')return;
    ensureStyles();
    const center=app.querySelector('[data-ticket-center]');
    if(!center||!center.querySelector('[data-ticket-tenx-command]'))return;
    render(center);
    decorateCards(center);
  }

  function schedule(){if(queued)return;queued=true;queueMicrotask(enhance);}

  app.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    if(!target)return;
    const center=target.closest('[data-ticket-center]');
    if(!center)return;
    const focus=target.closest('[data-ticket-signal-focus]');
    if(focus){reveal(center,focus.dataset.ticketSignalFocus||'');return;}
    if(target.closest('[data-ticket-tenx-party],[data-ticket-tenx-budget],[data-ticket-tenx-sort],[data-ticket-tenx-save],[data-ticket-tenx-clear],[data-ticket-trend-clear],[data-ticket-finalists-view],[data-ticket-finalists-budget],[data-ticket-refresh],[data-ticket-filter]'))schedule();
  });

  addEventListener('storage',event=>{if(event.key===MEMORY_KEY)schedule();});
  new MutationObserver(schedule).observe(app,{childList:true,subtree:false});
  runtime?.onRoute?.(schedule,{immediate:true});
  runtime?.onAppRender?.(schedule,{immediate:true});
  addEventListener('hashchange',schedule);
  schedule();
})();
