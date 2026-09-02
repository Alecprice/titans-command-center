(() => {
  'use strict';

  if(window.__TitansTicketFinalistsV127)return;
  window.__TitansTicketFinalistsV127=true;

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!app)return;

  const SHORTLIST_KEY='titans:tickets-shortlist-v123';
  const state={view:'all',groupBudget:'all',queued:false};
  const money=value=>Number.isFinite(value)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value):'—';
  const route=()=>runtime?.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';

  function ensureStyles(){
    if(document.querySelector('link[data-tickets-finalists-v127]'))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='/tickets-finalists-v127.css?v=1';
    link.dataset.ticketsFinalistsV127='1';
    document.head.append(link);
  }

  function readSavedKeys(){
    const saved=runtime?.storage?.getJSON?.(SHORTLIST_KEY,[]);
    return new Set((Array.isArray(saved)?saved:[]).filter(item=>item&&typeof item.key==='string').map(item=>item.key));
  }

  function partySize(center){
    const pressed=center.querySelector('[data-ticket-tenx-party][aria-pressed="true"]');
    return Math.min(4,Math.max(1,Number(pressed?.dataset.ticketTenxParty)||2));
  }

  function perTicketCap(center){
    const pressed=center.querySelector('[data-ticket-tenx-budget][aria-pressed="true"]');
    const raw=pressed?.dataset.ticketTenxBudget||'all';
    if(raw==='all')return null;
    const value=Number(raw);
    return Number.isFinite(value)&&value>0?value:null;
  }

  function groupCap(){
    if(state.groupBudget==='all')return null;
    const value=Number(state.groupBudget);
    return Number.isFinite(value)&&value>0?value:null;
  }

  function cardRecords(center){
    return [...center.querySelectorAll('.tickets-compare-card[data-ticket-tenx-key]')].map(card=>{
      const raw=Number(card.dataset.ticketTenxPrice);
      return {
        card,
        key:card.dataset.ticketTenxKey||'',
        price:Number.isFinite(raw)&&raw>0?raw:null
      };
    }).filter(item=>item.key);
  }

  function panelMarkup(savedCount){
    return `<section class="tickets-finalists-v127" data-ticket-finalists-v127 aria-label="Finalist and group budget filters">
      <header>
        <div><small>TENX · FINALISTS MODE</small><strong>Narrow the board to the games your group can actually consider.</strong></div>
        <span data-ticket-finalists-summary>All games · group budget open</span>
      </header>
      <div class="tickets-finalists-v127-controls">
        <fieldset><legend>Board view</legend><button type="button" data-ticket-finalists-view="all" aria-pressed="true">All games</button><button type="button" data-ticket-finalists-view="saved" aria-pressed="false" ${savedCount?'':'disabled aria-disabled="true"'}>Finalists only</button></fieldset>
        <fieldset><legend>Group budget · before fees</legend><button type="button" data-ticket-finalists-budget="all" aria-pressed="true">Any total</button><button type="button" data-ticket-finalists-budget="200" aria-pressed="false">≤ $200</button><button type="button" data-ticket-finalists-budget="300" aria-pressed="false">≤ $300</button><button type="button" data-ticket-finalists-budget="500" aria-pressed="false">≤ $500</button></fieldset>
      </div>
      <p>Group budget uses the current reported starting price × selected party size. Checkout fees and seat quality are never estimated.</p>
      <span class="tickets-finalists-v127-status" data-ticket-finalists-status role="status" aria-live="polite"></span>
    </section>`;
  }

  function ensurePanel(center){
    let panel=center.querySelector('[data-ticket-finalists-v127]');
    if(panel)return panel;
    const holder=document.createElement('div');
    holder.innerHTML=panelMarkup(readSavedKeys().size);
    panel=holder.firstElementChild;
    const controls=center.querySelector('.tickets-tenx-controls');
    const shortlist=center.querySelector('[data-ticket-tenx-shortlist]');
    if(controls)controls.after(panel);
    else if(shortlist)shortlist.before(panel);
    else center.querySelector('[data-ticket-tenx-command]')?.append(panel);
    return panel;
  }

  function setStatus(center,message){
    const node=center.querySelector('[data-ticket-finalists-status]');
    if(node)node.textContent=message;
  }

  function syncControls(center,savedCount){
    const savedButton=center.querySelector('[data-ticket-finalists-view="saved"]');
    if(savedButton){
      savedButton.disabled=savedCount===0;
      savedButton.setAttribute('aria-disabled',String(savedCount===0));
    }
    center.querySelectorAll('[data-ticket-finalists-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.ticketFinalistsView===state.view)));
    center.querySelectorAll('[data-ticket-finalists-budget]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.ticketFinalistsBudget===state.groupBudget)));
  }

  function emptyMessage(center,visible,savedCount,groupBudget,baseBudget){
    let empty=center.querySelector('[data-ticket-tenx-empty]');
    const list=center.querySelector('.tickets-compare-list');
    if(!empty&&list){
      empty=document.createElement('div');
      empty.className='tickets-tenx-empty';
      empty.dataset.ticketTenxEmpty='1';
      list.after(empty);
    }
    if(!empty)return;
    if(visible>0){empty.hidden=true;return;}
    empty.hidden=false;
    if(state.view==='saved'&&savedCount){
      empty.innerHTML='<strong>No finalists fit this group budget.</strong><span>Raise the group total, change party size, or return to All games.</span>';
    }else if(groupBudget!=null){
      empty.innerHTML='<strong>No games fit this group budget.</strong><span>Raise the group total or change the selected party size.</span>';
    }else if(baseBudget!=null){
      empty.innerHTML='<strong>No games fit this per-ticket budget.</strong><span>Try a higher cap or Any price. Games without a live starting price are hidden by budget filters.</span>';
    }else{
      empty.innerHTML='<strong>No live priced games match this view.</strong><span>Try All games or check the official ticket links.</span>';
    }
  }

  function apply(center){
    const records=cardRecords(center);
    if(!records.length)return;
    const saved=readSavedKeys();
    if(state.view==='saved'&&!saved.size)state.view='all';
    const party=partySize(center);
    const baseBudget=perTicketCap(center);
    const totalBudget=groupCap();
    let visible=0;

    for(const item of records){
      const baseOk=baseBudget==null||(item.price!=null&&item.price<=baseBudget);
      const groupOk=totalBudget==null||(item.price!=null&&item.price*party<=totalBudget);
      const viewOk=state.view==='all'||saved.has(item.key);
      const show=baseOk&&groupOk&&viewOk;
      item.card.hidden=!show;
      if(show)visible+=1;
    }

    syncControls(center,saved.size);
    const summary=center.querySelector('[data-ticket-finalists-summary]');
    const scope=state.view==='saved'?`${visible} of ${saved.size} finalist${saved.size===1?'':'s'} fit`:`${visible} of ${records.length} games fit`;
    const budgetLabel=totalBudget==null?'group budget open':`${money(totalBudget)} group cap`;
    if(summary)summary.textContent=`${scope} · ${party} ticket${party===1?'':'s'} · ${budgetLabel}`;
    const visibleNode=center.querySelector('[data-ticket-tenx-visible]');
    if(visibleNode)visibleNode.textContent=`${visible} of ${records.length} games shown`;
    const boardCount=center.querySelector('.tickets-comparison-board>header>span');
    if(boardCount)boardCount.textContent=state.view==='saved'?`${visible} finalist${visible===1?'':'s'}`:totalBudget!=null?`${visible} within group budget`:baseBudget!=null?`${visible} within per-ticket budget`:`${visible} games`;
    emptyMessage(center,visible,saved.size,totalBudget,baseBudget);
  }

  function resetForOfferReveal(center){
    state.view='all';
    state.groupBudget='all';
    apply(center);
    setStatus(center,'Showing all games so the saved matchup and its live offers stay visible.');
  }

  function enhance(){
    state.queued=false;
    if(route()!=='tickets')return;
    ensureStyles();
    const center=app.querySelector('[data-ticket-center]');
    if(!center||!center.querySelector('[data-ticket-tenx-command]'))return;
    ensurePanel(center);
    apply(center);
  }

  function schedule(){
    if(state.queued)return;
    state.queued=true;
    queueMicrotask(enhance);
  }

  app.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    if(!target)return;
    const center=target.closest('[data-ticket-center]');
    if(!center)return;

    const view=target.closest('[data-ticket-finalists-view]');
    if(view&&!view.disabled){
      state.view=view.dataset.ticketFinalistsView==='saved'?'saved':'all';
      apply(center);
      setStatus(center,state.view==='saved'?'Showing only saved finalist matchups.':'Showing all matchups that fit the active budgets.');
      return;
    }

    const budget=target.closest('[data-ticket-finalists-budget]');
    if(budget){
      state.groupBudget=budget.dataset.ticketFinalistsBudget||'all';
      apply(center);
      setStatus(center,state.groupBudget==='all'?'Group total budget removed.':`Showing matchups at ${money(Number(state.groupBudget))} or less for the selected party, before fees.`);
      return;
    }

    if(target.closest('[data-ticket-compare-focus]')){resetForOfferReveal(center);return;}
    if(target.closest('[data-ticket-tenx-save],[data-ticket-tenx-clear],[data-ticket-tenx-party],[data-ticket-tenx-budget],[data-ticket-tenx-sort],[data-ticket-filter],[data-ticket-refresh]'))schedule();
  });

  addEventListener('storage',event=>{if(event.key===SHORTLIST_KEY)schedule();});
  new MutationObserver(schedule).observe(app,{childList:true,subtree:false});
  runtime?.onRoute?.(schedule,{immediate:true});
  runtime?.onAppRender?.(schedule,{immediate:true});
  addEventListener('hashchange',schedule);
  schedule();
})();
