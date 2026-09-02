(() => {
  'use strict';

  if(window.__TitansTicketTrendV124)return;
  window.__TitansTicketTrendV124=true;

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!app)return;

  const STORAGE_KEY='titans:tickets-price-memory-v124';
  const TTL=30*24*60*60*1000;
  const MIN_CAPTURE_AGE=4*60*1000;
  const MAX_EVENTS=24;
  const MAX_POINTS=12;
  let queued=false;

  const route=()=>runtime?.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';
  const money=value=>Number.isFinite(value)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value):'—';
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function ensureStyles(){
    if(document.querySelector('link[data-tickets-trend-v124]'))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='/tickets-trend-v124.css?v=1';
    link.dataset.ticketsTrendV124='1';
    document.head.append(link);
  }

  function readMemory(){
    const value=runtime?.storage?.getJSON?.(STORAGE_KEY,{events:{}});
    return value&&typeof value==='object'&&value.events&&typeof value.events==='object'?value:{events:{}};
  }

  function writeMemory(memory){
    const entries=Object.entries(memory.events||{}).sort((a,b)=>(b[1]?.updatedAt||0)-(a[1]?.updatedAt||0)).slice(0,MAX_EVENTS);
    runtime?.storage?.setJSON?.(STORAGE_KEY,{events:Object.fromEntries(entries),updatedAt:Date.now()});
  }

  function cards(center){
    return [...center.querySelectorAll('.tickets-compare-card[data-ticket-tenx-key]')].map(card=>{
      const key=card.dataset.ticketTenxKey||'';
      const price=Number(card.dataset.ticketTenxPrice);
      const title=card.querySelector('.tickets-event-copy h3')?.textContent?.trim()||'Titans matchup';
      const date=card.querySelector('.tickets-event-copy p')?.textContent?.trim()||'Date TBD';
      return {card,key,price:Number.isFinite(price)&&price>0?price:null,title,date};
    }).filter(item=>item.key);
  }

  function capture(items){
    const now=Date.now();
    const cutoff=now-TTL;
    const memory=readMemory();
    for(const [key,event] of Object.entries(memory.events)){
      event.points=Array.isArray(event.points)?event.points.filter(point=>Number(point?.at)>=cutoff&&Number(point?.price)>0).slice(-MAX_POINTS):[];
      if(!event.points.length)delete memory.events[key];
    }
    for(const item of items){
      if(item.price==null)continue;
      const event=memory.events[item.key]||{title:item.title,date:item.date,points:[]};
      const points=Array.isArray(event.points)?event.points:[];
      const last=points.at(-1);
      if(!last||Number(last.price)!==item.price||now-Number(last.at)>=MIN_CAPTURE_AGE){
        points.push({price:item.price,at:now});
      }
      event.title=item.title;
      event.date=item.date;
      event.updatedAt=now;
      event.points=points.slice(-MAX_POINTS);
      memory.events[item.key]=event;
    }
    writeMemory(memory);
    return memory;
  }

  function movement(event){
    const points=Array.isArray(event?.points)?event.points:[];
    if(points.length<2)return {kind:'first',delta:0,pct:0,label:'First observed price',detail:'This browser now has a baseline for this matchup.'};
    const current=Number(points.at(-1).price);
    const previous=Number(points.at(-2).price);
    const delta=current-previous;
    const pct=previous>0?Math.round((Math.abs(delta)/previous)*100):0;
    if(delta<0)return {kind:'down',delta,pct,label:`Down ${money(Math.abs(delta))}${pct?` · ${pct}%`:''}`,detail:`Previously observed at ${money(previous)} in this browser.`};
    if(delta>0)return {kind:'up',delta,pct,label:`Up ${money(delta)}${pct?` · ${pct}%`:''}`,detail:`Previously observed at ${money(previous)} in this browser.`};
    return {kind:'flat',delta:0,pct:0,label:'No change observed',detail:`Still ${money(current)} since the previous browser observation.`};
  }

  function summary(items,memory){
    const states=items.filter(item=>item.price!=null).map(item=>movement(memory.events[item.key]));
    const drops=states.filter(state=>state.kind==='down').length;
    const rises=states.filter(state=>state.kind==='up').length;
    const steady=states.filter(state=>state.kind==='flat').length;
    return {tracked:states.length,drops,rises,steady};
  }

  function panelMarkup(stats){
    return `<section class="tickets-trend-panel" data-ticket-trend-v124 aria-label="Observed ticket price movement">
      <header><div><small>TENX · PRICE MEMORY</small><h2>What changed since this browser last checked?</h2><p>Only prices actually observed on this device are compared. This is not marketplace-wide historical pricing.</p></div><span>30-day local memory</span></header>
      <div class="tickets-trend-metrics"><div><small>TRACKED NOW</small><strong>${stats.tracked}</strong><span>Priced matchups with a local baseline</span></div><div class="down"><small>DROPS</small><strong>${stats.drops}</strong><span>Lower than the prior observation</span></div><div class="up"><small>RISES</small><strong>${stats.rises}</strong><span>Higher than the prior observation</span></div><div><small>UNCHANGED</small><strong>${stats.steady}</strong><span>Same as the prior observation</span></div></div>
      <div class="tickets-trend-foot"><span>Memory is browser-local, capped, and automatically expires after 30 days.</span><button type="button" data-ticket-trend-clear>Reset price memory</button></div>
      <p class="tickets-trend-status" data-ticket-trend-status role="status" aria-live="polite"></p>
    </section>`;
  }

  function renderPanel(center,items,memory){
    const stats=summary(items,memory);
    let panel=center.querySelector('[data-ticket-trend-v124]');
    if(!panel){
      const holder=document.createElement('div');
      holder.innerHTML=panelMarkup(stats);
      panel=holder.firstElementChild;
      const anchor=center.querySelector('[data-ticket-tenx-command]')||center.querySelector('.tickets-provider-health')||center.querySelector('.tickets-toolbar');
      if(anchor)anchor.after(panel);else center.prepend(panel);
    }else{
      const metrics=panel.querySelector('.tickets-trend-metrics');
      if(metrics){
        const replacement=document.createElement('div');
        replacement.innerHTML=panelMarkup(stats);
        const fresh=replacement.querySelector('.tickets-trend-metrics');
        if(fresh&&metrics.innerHTML!==fresh.innerHTML)metrics.innerHTML=fresh.innerHTML;
      }
    }
  }

  function decorate(items,memory){
    for(const item of items){
      const signal=item.card.querySelector('.tickets-tenx-signal');
      if(!signal)continue;
      const state=movement(memory.events[item.key]);
      let row=signal.querySelector('[data-ticket-trend-line]');
      if(!row){row=document.createElement('div');row.className='tickets-trend-line';row.dataset.ticketTrendLine='1';signal.append(row);}
      row.className=`tickets-trend-line ${state.kind}`;
      const html=`<b>${esc(state.label)}</b><span>${esc(state.detail)}</span>`;
      if(row.innerHTML!==html)row.innerHTML=html;
    }
  }

  function enhance(){
    queued=false;
    if(route()!=='tickets')return;
    ensureStyles();
    const center=app.querySelector('[data-ticket-center]');
    if(!center)return;
    const items=cards(center);
    if(!items.length)return;
    center.classList.add('tickets-trend-v124');
    const memory=capture(items);
    renderPanel(center,items,memory);
    decorate(items,memory);
  }

  function schedule(){if(queued)return;queued=true;queueMicrotask(enhance);}

  app.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    if(!target)return;
    const center=target.closest('[data-ticket-center]');
    if(!center)return;
    if(target.closest('[data-ticket-trend-clear]')){
      runtime?.storage?.setJSON?.(STORAGE_KEY,{events:{},updatedAt:Date.now()});
      const status=center.querySelector('[data-ticket-trend-status]');
      if(status)status.textContent='Price memory reset. Current live prices are now the new local baseline.';
      schedule();
      return;
    }
    if(target.closest('[data-ticket-tenx-party],[data-ticket-tenx-budget],[data-ticket-tenx-sort],[data-ticket-refresh]'))schedule();
  });

  new MutationObserver(schedule).observe(app,{childList:true,subtree:false});
  runtime?.onRoute?.(schedule,{immediate:true});
  runtime?.onAppRender?.(schedule,{immediate:true});
  addEventListener('hashchange',schedule);
  schedule();
})();