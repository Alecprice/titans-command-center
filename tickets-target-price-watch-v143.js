(() => {
  'use strict';

  if(window.__TitansTicketTargetPriceWatchV143)return;
  window.__TitansTicketTargetPriceWatchV143=true;

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!app)return;

  const SHORTLIST_KEY='titans:tickets-shortlist-v123';
  const TARGET_KEY='titans:tickets-target-price-v143';
  const MAX_TARGETS=3;
  const MAX_AMOUNT=99999.99;
  let queued=false;
  let notice='';

  const route=()=>runtime?.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const money=value=>Number.isFinite(value)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(value):'—';

  function ensureStyles(){
    if(document.querySelector('link[data-tickets-target-price-v143]'))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='/tickets-target-price-watch-v143.css?v=1';
    link.dataset.ticketsTargetPriceV143='1';
    document.head.append(link);
  }

  function targetAmount(value){
    if(value===''||value==null)return null;
    const parsed=Number(value);
    if(!Number.isFinite(parsed)||parsed<1||parsed>MAX_AMOUNT)return null;
    return Math.round(parsed*100)/100;
  }

  function readSaved(){
    const value=runtime?.storage?.getJSON?.(SHORTLIST_KEY,[]);
    return Array.isArray(value)?value.filter(item=>item&&typeof item.key==='string').slice(0,MAX_TARGETS):[];
  }

  function readStore(saved=readSaved()){
    const raw=runtime?.storage?.getJSON?.(TARGET_KEY,{targets:{}});
    const source=raw&&typeof raw==='object'&&raw.targets&&typeof raw.targets==='object'?raw.targets:{};
    const allowed=new Set(saved.map(item=>item.key));
    const targets={};
    for(const [key,value] of Object.entries(source)){
      if(!allowed.has(key))continue;
      const parsed=targetAmount(value);
      if(parsed!=null)targets[key]=parsed;
      if(Object.keys(targets).length>=MAX_TARGETS)break;
    }
    return {targets};
  }

  function writeStore(store){
    runtime?.storage?.setJSON?.(TARGET_KEY,{targets:store.targets,updatedAt:Date.now()});
  }

  function pruneStore(saved){
    const raw=runtime?.storage?.getJSON?.(TARGET_KEY,{targets:{}});
    const original=raw&&typeof raw==='object'&&raw.targets&&typeof raw.targets==='object'?raw.targets:{};
    const clean=readStore(saved);
    if(JSON.stringify(original)!==JSON.stringify(clean.targets))writeStore(clean);
    return clean;
  }

  function liveRecord(center,key){
    const card=[...center.querySelectorAll('.tickets-compare-card[data-ticket-tenx-key]')].find(node=>node.dataset.ticketTenxKey===key);
    if(!card)return null;
    const raw=Number(card.dataset.ticketTenxPrice);
    return {
      price:Number.isFinite(raw)&&raw>0?raw:null,
      title:card.querySelector('.tickets-event-copy h3')?.textContent?.trim()||'Titans matchup',
      date:card.querySelector('.tickets-event-copy p')?.textContent?.trim()||'Date TBD'
    };
  }

  function stateFor(target,current){
    if(target==null)return {kind:'unset',badge:'NO TARGET',detail:'Set a per-ticket threshold to compare when a current reported starting price is available.'};
    if(current==null)return {kind:'unavailable',badge:'PRICE UNAVAILABLE',detail:`Target ${money(target)} per ticket saved. Current reported starting price is unavailable.`};
    if(current<=target){
      const difference=target-current;
      return {kind:'met',badge:'TARGET MET',detail:`Current reported start ${money(current)} per ticket is ${difference>0?`${money(difference)} below`:'at'} your ${money(target)} target.`};
    }
    return {kind:'above',badge:'ABOVE TARGET',detail:`Current reported start ${money(current)} per ticket is ${money(current-target)} above your ${money(target)} target.`};
  }

  function rows(center,saved,store){
    return saved.map(item=>{
      const live=liveRecord(center,item.key);
      const target=targetAmount(store.targets[item.key]);
      const current=live?.price??null;
      return {
        key:item.key,
        title:live?.title||item.title||'Titans matchup',
        date:live?.date||item.date||'Date TBD',
        current,
        target,
        state:stateFor(target,current)
      };
    });
  }

  function cardMarkup(item){
    const current=item.current==null?'Current start unavailable':`${money(item.current)} current reported start per ticket`;
    return `<article class="tickets-target-v143-card is-${esc(item.state.kind)}" data-ticket-target-key="${esc(item.key)}" data-ticket-target-state="${esc(item.state.kind)}">
      <header><div><small>${esc(item.state.badge)}</small><h3>${esc(item.title)}</h3><p>${esc(item.date)}</p></div><strong>${esc(current)}</strong></header>
      <p class="tickets-target-v143-detail">${esc(item.state.detail)}</p>
      <label><span>Target starting price per ticket</span><span class="tickets-target-v143-money">$ <input type="number" min="1" max="${MAX_AMOUNT}" step="0.01" inputmode="decimal" autocomplete="off" data-ticket-target-input="${esc(item.key)}" value="${item.target==null?'':esc(String(item.target))}" aria-label="Target reported starting price per ticket for ${esc(item.title)}" placeholder="0.00"></span></label>
    </article>`;
  }

  function panelMarkup(center,saved,store){
    const items=rows(center,saved,store);
    const setCount=items.filter(item=>item.target!=null).length;
    const metCount=items.filter(item=>item.state.kind==='met').length;
    const summary=setCount?`${setCount}/${items.length} targets set · ${metCount} currently met`:`0/${items.length} targets set`;
    return `<section class="tickets-target-v143" data-ticket-target-v143 aria-label="Saved game target price watch">
      <header><div><small>TENX · TARGET PRICE WATCH</small><h2>Set the per-ticket starting price that gets your attention.</h2><p>Targets are checked only while Ticket Center is open or refreshed. This browser does not monitor prices or send background alerts while closed.</p></div><span>${esc(summary)}</span></header>
      <div class="tickets-target-v143-grid">${items.map(cardMarkup).join('')}</div>
      <footer><span>Targets compare current reported starting prices per ticket only. Checkout fees, seat quality, and future prices are not inferred.</span><button type="button" data-ticket-target-clear ${setCount?'':'disabled'}>Clear all targets</button></footer>
      <p class="tickets-target-v143-status" data-ticket-target-status role="status" aria-live="polite">${esc(notice)}</p>
    </section>`;
  }

  function render(){
    queued=false;
    if(route()!=='tickets')return;
    ensureStyles();
    const center=app.querySelector('[data-ticket-center]');
    if(!center)return;
    const saved=readSaved();
    let panel=center.querySelector('[data-ticket-target-v143]');
    if(!saved.length){panel?.remove();notice='';return;}
    const store=pruneStore(saved);
    const holder=document.createElement('div');
    holder.innerHTML=panelMarkup(center,saved,store);
    const fresh=holder.firstElementChild;
    if(!fresh)return;
    if(panel){panel.replaceWith(fresh);return;}
    const signal=center.querySelector('[data-ticket-signal-lens-v128]');
    const compare=center.querySelector('[data-ticket-compare-v125]');
    const shortlist=center.querySelector('[data-ticket-tenx-shortlist]');
    if(signal)signal.after(fresh);else if(compare)compare.after(fresh);else if(shortlist)shortlist.after(fresh);else center.append(fresh);
  }

  function schedule(){if(queued)return;queued=true;queueMicrotask(render);}

  function saveTarget(input){
    const saved=readSaved();
    const key=input.dataset.ticketTargetInput||'';
    if(!saved.some(item=>item.key===key))return;
    const raw=input.value.trim();
    const parsed=targetAmount(raw);
    if(raw!==''&&parsed==null){
      input.setAttribute('aria-invalid','true');
      notice=`Enter a per-ticket target from $1 to ${money(MAX_AMOUNT)}.`;
      const status=input.closest('[data-ticket-target-v143]')?.querySelector('[data-ticket-target-status]');
      if(status)status.textContent=notice;
      return;
    }
    input.removeAttribute('aria-invalid');
    const store=readStore(saved);
    if(parsed==null){delete store.targets[key];notice='Target cleared for this saved matchup.';}
    else{store.targets[key]=parsed;notice=`Target saved at ${money(parsed)} per ticket. It will be checked only when Ticket Center is open or refreshed.`;}
    writeStore(store);
    schedule();
  }

  app.addEventListener('change',event=>{
    const target=event.target instanceof Element?event.target:null;
    if(target?.matches('[data-ticket-target-input]'))saveTarget(target);
  });

  app.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    if(!target)return;
    const center=target.closest('[data-ticket-center]');
    if(!center)return;
    if(target.closest('[data-ticket-target-clear]')){
      writeStore({targets:{}});
      notice='All saved target prices cleared. Your matchup shortlist is unchanged.';
      schedule();
      return;
    }
    if(target.closest('[data-ticket-refresh]'))requestAnimationFrame(schedule);
  });

  app.addEventListener('titans:ticket-shortlist-change',schedule);
  addEventListener('storage',event=>{if(event.key===SHORTLIST_KEY||event.key===TARGET_KEY)schedule();});
  new MutationObserver(schedule).observe(app,{childList:true,subtree:false});
  runtime?.onRoute?.(schedule,{immediate:true});
  runtime?.onAppRender?.(schedule,{immediate:true});
  addEventListener('hashchange',schedule);
  schedule();
})();
