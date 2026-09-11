(() => {
  'use strict';

  if(window.__TitansTicketActualCostCompareV135)return;
  window.__TitansTicketActualCostCompareV135=true;

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!app)return;

  const SHORTLIST_KEY='titans:tickets-shortlist-v123';
  const BUDGET_KEY='titans:tickets-outing-budget-v134';
  const MAX_SAVED=3;
  const MAX_AMOUNT=99999.99;
  let queued=false;

  const route=()=>runtime?.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';
  const money=value=>Number.isFinite(value)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(value):'—';
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function ensureStyles(){
    if(document.querySelector('link[data-tickets-actual-cost-compare-v135]'))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='/tickets-actual-cost-compare-v135.css?v=1';
    link.dataset.ticketsActualCostCompareV135='1';
    document.head.append(link);
  }

  function amount(value){
    if(value===''||value==null)return null;
    const parsed=Number(value);
    if(!Number.isFinite(parsed)||parsed<0||parsed>MAX_AMOUNT)return null;
    return Math.round(parsed*100)/100;
  }

  function readSaved(){
    const value=runtime?.storage?.getJSON?.(SHORTLIST_KEY,[]);
    return Array.isArray(value)?value.filter(item=>item&&typeof item.key==='string').slice(0,MAX_SAVED):[];
  }

  function readPlans(saved){
    const raw=runtime?.storage?.getJSON?.(BUDGET_KEY,{plans:{}});
    const source=raw&&typeof raw==='object'&&raw.plans&&typeof raw.plans==='object'?raw.plans:{};
    const allowed=new Set(saved.map(item=>item.key));
    const plans={};
    for(const [key,value] of Object.entries(source).slice(0,MAX_SAVED)){
      if(!allowed.has(key)||!value||typeof value!=='object')continue;
      const plan={};
      for(const field of ['checkout','parking','food','other']){
        const parsed=amount(value[field]);
        if(parsed!=null)plan[field]=parsed;
      }
      plans[key]=plan;
    }
    return plans;
  }

  function partySize(center){
    const active=center.querySelector('[data-ticket-tenx-party][aria-pressed="true"]');
    return Math.min(4,Math.max(1,Number(active?.dataset.ticketTenxParty)||2));
  }

  function record(savedItem,plan,party,index){
    const checkout=amount(plan?.checkout);
    const extras=['parking','food','other'].reduce((sum,field)=>sum+(amount(plan?.[field])??0),0);
    const total=checkout==null?null:checkout+extras;
    return {
      key:savedItem.key,
      title:savedItem.title||'Titans matchup',
      date:savedItem.date||'Date TBD',
      checkout,
      extras,
      total,
      perPerson:total==null?null:total/party,
      ready:checkout!=null,
      index
    };
  }

  function rows(center,saved,plans){
    const party=partySize(center);
    return saved.map((item,index)=>record(item,plans[item.key]||{},party,index)).sort((a,b)=>{
      if(a.ready!==b.ready)return a.ready?-1:1;
      if(a.ready&&b.ready)return (a.total-b.total)||(a.checkout-b.checkout)||(a.index-b.index);
      return a.index-b.index;
    });
  }

  function shareUrl(){return `${location.origin}${location.pathname}#tickets`;}

  function shareText(items,party){
    const lines=['Tennessee Titans saved game actual-cost plan'];
    items.forEach((item,index)=>{
      lines.push('');
      lines.push(`${index+1}. ${item.title}`);
      lines.push(item.date);
      if(item.ready){
        lines.push(`Actual ticket checkout: ${money(item.checkout)}`);
        lines.push(`Entered extras: ${money(item.extras)}`);
        lines.push(`Outing total: ${money(item.total)} · ${party} ticket${party===1?'':'s'} · ${money(item.perPerson)} per person`);
      }else{
        lines.push('Actual ticket checkout: not entered · outing total not ranked');
      }
    });
    lines.push('');
    lines.push('Amounts above are user-entered in Ticket Center. Starting prices, unentered fees, seat quality, and projected spending are excluded.');
    return lines.join('\n');
  }

  function cardMarkup(item,readyCount,party,lowestTotal){
    const badge=!item.ready
      ?'NEEDS CHECKOUT'
      :readyCount>=2&&item.total===lowestTotal
        ?'LOWEST ENTERED OUTING'
        :readyCount>=2?'ACTUAL TOTAL ENTERED':'CHECKOUT ENTERED';
    const detail=item.ready
      ?`<dl><div><dt>Actual checkout</dt><dd>${esc(money(item.checkout))}</dd></div><div><dt>Extras entered</dt><dd>${esc(money(item.extras))}</dd></div><div><dt>Outing total</dt><dd>${esc(money(item.total))}</dd></div><div><dt>Per person</dt><dd>${esc(money(item.perPerson))}</dd></div></dl>`
      :'<p class="tickets-cost-v135-missing">Enter the actual ticket checkout total in Game Night Budget before this matchup can be ranked by cost.</p>';
    return `<article class="tickets-cost-v135-card ${item.ready?'is-ready':'is-missing'}" data-ticket-cost-key="${esc(item.key)}" data-ticket-cost-ready="${item.ready}">
      <header><div><small>${esc(badge)}</small><h3>${esc(item.title)}</h3><p>${esc(item.date)}</p></div>${item.ready?`<strong>${esc(money(item.total))}</strong>`:'<strong>—</strong>'}</header>
      ${detail}
      <footer><span>${item.ready?`${party} ticket${party===1?'':'s'} selected · user-entered amounts only`:'Starting prices are not substituted for checkout.'}</span><button type="button" data-ticket-cost-edit="${esc(item.key)}" aria-label="Edit Game Night Budget for ${esc(item.title)}">${item.ready?'Edit budget':'Enter checkout'}</button></footer>
    </article>`;
  }

  function panelMarkup(center,saved,plans){
    const party=partySize(center);
    const items=rows(center,saved,plans);
    const ready=items.filter(item=>item.ready);
    const lowestTotal=ready.length>=2?ready[0].total:null;
    const tiedLowest=lowestTotal==null?[]:ready.filter(item=>item.total===lowestTotal);
    const cards=items.map(item=>cardMarkup(item,ready.length,party,lowestTotal)).join('');
    const lead=ready.length>=2
      ?tiedLowest.length>1
        ?`Lowest entered outing total: ${money(lowestTotal)}, shared by ${tiedLowest.length} saved games. This compares only amounts entered in this browser.`
        :`Lowest entered outing total: ${money(lowestTotal)} for ${tiedLowest[0].title}. This compares only amounts entered in this browser.`
      :ready.length===1
        ?'One saved matchup has an actual checkout total. Enter checkout for another saved game to compare real outing costs.'
        :'Enter an actual checkout total for at least one saved game to start building a real-cost comparison.';
    return `<section class="tickets-cost-v135" data-ticket-cost-compare-v135 aria-label="Actual saved game cost comparison">
      <header><div><small>TENX · ACTUAL COST COMPARE</small><h2>Compare what the saved games really cost.</h2><p>${esc(lead)}</p></div><span>${ready.length}/${saved.length} actual totals ready</span></header>
      <div class="tickets-cost-v135-grid">${cards}</div>
      <footer class="tickets-cost-v135-panel-footer"><span>Ranking uses actual ticket checkout plus only the optional extras you entered. Starting prices, unentered fees, seat quality, and projected spending are excluded.</span><button type="button" data-ticket-cost-share aria-label="Share saved game actual-cost plan" ${ready.length?'':'disabled'}>Share actual costs</button></footer>
      <p class="tickets-cost-v135-status" data-ticket-cost-status role="status" aria-live="polite"></p>
    </section>`;
  }

  function render(){
    queued=false;
    if(route()!=='tickets')return;
    ensureStyles();
    const center=app.querySelector('[data-ticket-center]');
    if(!center)return;
    const saved=readSaved();
    let panel=center.querySelector('[data-ticket-cost-compare-v135]');
    if(saved.length<2){panel?.remove();return;}
    const plans=readPlans(saved);
    const holder=document.createElement('div');
    holder.innerHTML=panelMarkup(center,saved,plans);
    const fresh=holder.firstElementChild;
    if(!fresh)return;
    if(panel){panel.replaceWith(fresh);return;}
    const budget=center.querySelector('[data-ticket-outing-v134]');
    const compare=center.querySelector('[data-ticket-compare-v125]');
    if(budget)budget.after(fresh);else if(compare)compare.after(fresh);else center.append(fresh);
  }

  function schedule(){if(queued)return;queued=true;queueMicrotask(render);}

  function setStatus(center,message){
    const node=center.querySelector('[data-ticket-cost-status]');
    if(node)node.textContent=message;
  }

  async function shareActualCosts(center){
    const saved=readSaved();
    if(saved.length<2){setStatus(center,'Save at least two matchups before sharing an actual-cost comparison.');return;}
    const plans=readPlans(saved);
    const party=partySize(center);
    const items=rows(center,saved,plans);
    if(!items.some(item=>item.ready)){setStatus(center,'Enter at least one actual ticket checkout total before sharing.');return;}
    const text=shareText(items,party);
    const url=shareUrl();
    try{
      if(typeof navigator.share==='function'){
        await navigator.share({title:'Titans actual-cost plan',text,url});
        setStatus(center,'Shared the saved-game actual-cost plan.');
        return;
      }
    }catch(error){
      if(error?.name==='AbortError'){
        setStatus(center,'Share canceled. Your actual-cost plans are unchanged.');
        return;
      }
    }
    try{
      if(navigator.clipboard?.writeText){
        await navigator.clipboard.writeText(`${text}\n\nOpen Ticket Center: ${url}`);
        setStatus(center,'Share is unavailable here, so the actual-cost plan was copied to your clipboard.');
        return;
      }
    }catch{}
    setStatus(center,'Sharing is unavailable in this browser. Your actual-cost plans are unchanged.');
  }

  function editBudget(center,key){
    const picker=center.querySelector('[data-ticket-outing-game]');
    const panel=center.querySelector('[data-ticket-outing-v134]');
    if(!picker||!panel)return;
    if([...picker.options].some(option=>option.value===key)){
      picker.value=key;
      picker.dispatchEvent(new Event('change',{bubbles:true}));
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        const refreshed=center.querySelector('[data-ticket-outing-v134]');
        refreshed?.scrollIntoView({behavior:'smooth',block:'center'});
        refreshed?.querySelector('[data-ticket-outing-field="checkout"]')?.focus({preventScroll:true});
      }));
    }
  }

  app.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    if(!target)return;
    const center=target.closest('[data-ticket-center]');
    if(!center)return;
    if(target.closest('[data-ticket-cost-share]')){shareActualCosts(center);return;}
    const button=target.closest('[data-ticket-cost-edit]');
    if(!button)return;
    editBudget(center,button.dataset.ticketCostEdit||'');
  });

  app.addEventListener('change',event=>{
    const target=event.target instanceof Element?event.target:null;
    if(target?.matches('[data-ticket-outing-field],[data-ticket-outing-game]'))schedule();
  });
  app.addEventListener('titans:ticket-shortlist-change',schedule);
  addEventListener('storage',event=>{if(event.key===SHORTLIST_KEY||event.key===BUDGET_KEY)schedule();});
  new MutationObserver(schedule).observe(app,{childList:true,subtree:false});
  runtime?.onRoute?.(schedule,{immediate:true});
  runtime?.onAppRender?.(schedule,{immediate:true});
  addEventListener('hashchange',schedule);
  schedule();
})();