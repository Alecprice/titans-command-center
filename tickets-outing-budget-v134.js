(() => {
  'use strict';

  if(window.__TitansTicketOutingBudgetV134)return;
  window.__TitansTicketOutingBudgetV134=true;

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!app)return;

  const SHORTLIST_KEY='titans:tickets-shortlist-v123';
  const BUDGET_KEY='titans:tickets-outing-budget-v134';
  const MAX_PLANS=3;
  const MAX_AMOUNT=99999.99;
  const fields=['checkout','parking','food','other'];
  let activeKey='';
  let queued=false;

  const route=()=>runtime?.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';
  const money=value=>Number.isFinite(value)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(value):'—';
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function ensureStyles(){
    if(document.querySelector('link[data-tickets-outing-budget-v134]'))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='/tickets-outing-budget-v134.css?v=1';
    link.dataset.ticketsOutingBudgetV134='1';
    document.head.append(link);
  }

  function readSaved(){
    const value=runtime?.storage?.getJSON?.(SHORTLIST_KEY,[]);
    return Array.isArray(value)?value.filter(item=>item&&typeof item.key==='string').slice(0,MAX_PLANS):[];
  }

  function amount(value){
    if(value===''||value==null)return null;
    const parsed=Number(value);
    if(!Number.isFinite(parsed)||parsed<0||parsed>MAX_AMOUNT)return null;
    return Math.round(parsed*100)/100;
  }

  function cleanPlan(value){
    const plan={};
    for(const field of fields){
      const parsed=amount(value?.[field]);
      if(parsed!=null)plan[field]=parsed;
    }
    return plan;
  }

  function readStore(saved=readSaved()){
    const raw=runtime?.storage?.getJSON?.(BUDGET_KEY,{plans:{}});
    const source=raw&&typeof raw==='object'&&raw.plans&&typeof raw.plans==='object'?raw.plans:{};
    const allowed=new Set(saved.map(item=>item.key));
    const plans={};
    for(const key of Object.keys(source).slice(0,MAX_PLANS)){
      if(!allowed.has(key))continue;
      plans[key]=cleanPlan(source[key]);
    }
    return {plans};
  }

  function writeStore(store){
    runtime?.storage?.setJSON?.(BUDGET_KEY,{plans:store.plans,updatedAt:Date.now()});
  }

  function pruneStore(saved){
    const raw=runtime?.storage?.getJSON?.(BUDGET_KEY,{plans:{}});
    const original=raw&&typeof raw==='object'&&raw.plans&&typeof raw.plans==='object'?raw.plans:{};
    const clean=readStore(saved);
    const before=Object.keys(original).sort().join('|');
    const after=Object.keys(clean.plans).sort().join('|');
    if(before!==after)writeStore(clean);
    return clean;
  }

  function partySize(center){
    const active=center.querySelector('[data-ticket-tenx-party][aria-pressed="true"]');
    return Math.min(4,Math.max(1,Number(active?.dataset.ticketTenxParty)||2));
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

  function selected(saved){
    if(saved.some(item=>item.key===activeKey))return activeKey;
    activeKey=saved[0]?.key||'';
    return activeKey;
  }

  function totals(plan,party){
    const checkout=amount(plan.checkout);
    const extras=['parking','food','other'].reduce((sum,field)=>sum+(amount(plan[field])??0),0);
    const total=checkout==null?null:checkout+extras;
    return {checkout,extras,total,perPerson:total==null?null:total/party};
  }

  function inputValue(plan,field){
    const value=amount(plan[field]);
    return value==null?'':String(value);
  }

  function panelMarkup(center,saved,store){
    const key=selected(saved);
    const savedItem=saved.find(item=>item.key===key)||saved[0];
    const plan=store.plans[key]||{};
    const party=partySize(center);
    const live=liveRecord(center,key);
    const math=totals(plan,party);
    const startReference=live?.price!=null?`${money(live.price)} × ${party} = ${money(live.price*party)} before fees`:'Current starting-price reference unavailable';
    return `<section class="tickets-outing-v134" data-ticket-outing-v134 aria-label="Game outing budget worksheet">
      <header><div><small>TENX · GAME NIGHT BUDGET</small><h2>Turn checkout into the real group cost.</h2><p>Enter the actual ticket checkout total you see. Parking, food, and extras are optional. Ticket Center never guesses fees.</p></div><span>Browser-local plan</span></header>
      <div class="tickets-outing-v134-picker">
        <label for="ticket-outing-game-v134">Saved matchup</label>
        <select id="ticket-outing-game-v134" data-ticket-outing-game>${saved.map(item=>`<option value="${esc(item.key)}" ${item.key===key?'selected':''}>${esc(item.title||'Titans matchup')} · ${esc(item.date||'Date TBD')}</option>`).join('')}</select>
        <p><strong>Starting-price reference:</strong> ${esc(startReference)}. This reference is not used as your checkout total.</p>
      </div>
      <div class="tickets-outing-v134-fields">
        <label><span>Ticket checkout total <b>actual amount</b></span><span class="tickets-outing-v134-money">$ <input type="number" min="0" max="${MAX_AMOUNT}" step="0.01" inputmode="decimal" autocomplete="off" data-ticket-outing-field="checkout" value="${esc(inputValue(plan,'checkout'))}" placeholder="0.00"></span><small>Enter the total shown at checkout for the whole group, including ticket fees shown there.</small></label>
        <label><span>Parking / transit</span><span class="tickets-outing-v134-money">$ <input type="number" min="0" max="${MAX_AMOUNT}" step="0.01" inputmode="decimal" autocomplete="off" data-ticket-outing-field="parking" value="${esc(inputValue(plan,'parking'))}" placeholder="0.00"></span><small>Use what you actually plan to spend.</small></label>
        <label><span>Food / drinks</span><span class="tickets-outing-v134-money">$ <input type="number" min="0" max="${MAX_AMOUNT}" step="0.01" inputmode="decimal" autocomplete="off" data-ticket-outing-field="food" value="${esc(inputValue(plan,'food'))}" placeholder="0.00"></span><small>Optional group budget.</small></label>
        <label><span>Merch / other</span><span class="tickets-outing-v134-money">$ <input type="number" min="0" max="${MAX_AMOUNT}" step="0.01" inputmode="decimal" autocomplete="off" data-ticket-outing-field="other" value="${esc(inputValue(plan,'other'))}" placeholder="0.00"></span><small>Optional extras you choose to include.</small></label>
      </div>
      <div class="tickets-outing-v134-summary" aria-label="Outing budget summary">
        <div><small>ACTUAL CHECKOUT</small><strong>${math.checkout==null?'Not entered':esc(money(math.checkout))}</strong><span>User-entered ticket checkout total</span></div>
        <div><small>EXTRAS</small><strong>${esc(money(math.extras))}</strong><span>Parking + food + merch/other</span></div>
        <div class="total"><small>OUTING TOTAL</small><strong>${math.total==null?'Waiting for checkout':esc(money(math.total))}</strong><span>Actual checkout + your optional extras</span></div>
        <div><small>PER PERSON</small><strong>${math.perPerson==null?'—':esc(money(math.perPerson))}</strong><span>${party} ticket${party===1?'':'s'} selected in Ticket Center</span></div>
      </div>
      <footer><span>Only amounts entered in this browser are included. No fee, parking, food, or merch estimate is generated.</span><button type="button" data-ticket-outing-clear ${Object.keys(plan).length?'':'disabled'}>Clear this plan</button></footer>
      <p class="tickets-outing-v134-status" data-ticket-outing-status role="status" aria-live="polite"></p>
    </section>`;
  }

  function setStatus(center,message){
    const node=center.querySelector('[data-ticket-outing-status]');
    if(node)node.textContent=message;
  }

  function render(){
    queued=false;
    if(route()!=='tickets')return;
    ensureStyles();
    const center=app.querySelector('[data-ticket-center]');
    if(!center)return;
    const saved=readSaved();
    let panel=center.querySelector('[data-ticket-outing-v134]');
    if(!saved.length){panel?.remove();activeKey='';return;}
    const store=pruneStore(saved);
    const holder=document.createElement('div');
    holder.innerHTML=panelMarkup(center,saved,store);
    const fresh=holder.firstElementChild;
    if(!fresh)return;
    if(panel){panel.replaceWith(fresh);return;}
    const compare=center.querySelector('[data-ticket-compare-v125]');
    const shortlist=center.querySelector('[data-ticket-tenx-shortlist]');
    if(compare)compare.after(fresh);else if(shortlist)shortlist.after(fresh);else center.append(fresh);
  }

  function schedule(){if(queued)return;queued=true;queueMicrotask(render);}

  function saveField(center,input){
    const saved=readSaved();
    const key=selected(saved);
    if(!key)return;
    const field=input.dataset.ticketOutingField;
    if(!fields.includes(field))return;
    const raw=input.value.trim();
    const parsed=amount(raw);
    if(raw!==''&&parsed==null){
      input.setAttribute('aria-invalid','true');
      setStatus(center,`Enter a ${field==='checkout'?'checkout':'budget'} amount from $0 to ${money(MAX_AMOUNT)}.`);
      return;
    }
    input.removeAttribute('aria-invalid');
    const store=readStore(saved);
    const plan=cleanPlan(store.plans[key]||{});
    if(parsed==null)delete plan[field];else plan[field]=parsed;
    store.plans[key]=plan;
    writeStore(store);
    schedule();
  }

  app.addEventListener('change',event=>{
    const target=event.target instanceof Element?event.target:null;
    if(!target)return;
    const center=target.closest('[data-ticket-center]');
    if(!center)return;
    if(target.matches('[data-ticket-outing-game]')){activeKey=target.value||'';schedule();return;}
    if(target.matches('[data-ticket-outing-field]'))saveField(center,target);
  });

  app.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    if(!target)return;
    const center=target.closest('[data-ticket-center]');
    if(!center)return;
    if(target.closest('[data-ticket-outing-clear]')){
      const saved=readSaved();
      const key=selected(saved);
      const store=readStore(saved);
      delete store.plans[key];
      writeStore(store);
      schedule();
      return;
    }
    if(target.closest('[data-ticket-tenx-party],[data-ticket-tenx-save],[data-ticket-tenx-clear]'))schedule();
  });

  app.addEventListener('titans:ticket-shortlist-change',schedule);
  addEventListener('storage',event=>{if(event.key===SHORTLIST_KEY||event.key===BUDGET_KEY)schedule();});
  new MutationObserver(schedule).observe(app,{childList:true,subtree:false});
  runtime?.onRoute?.(schedule,{immediate:true});
  runtime?.onAppRender?.(schedule,{immediate:true});
  addEventListener('hashchange',schedule);
  schedule();
})();