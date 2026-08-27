(() => {
  'use strict';
  if(window.__TitansRosterFilterGuardV40)return;
  window.__TitansRosterFilterGuardV40=true;

  const resetLiveRosterFilters=()=>{
    const wrap=document.querySelector('.roster-status-filters');
    const bar=document.querySelector('.filterbar');
    const search=bar?.querySelector('#rs');
    const unit=bar?.querySelector('#ru');
    if(!wrap||!bar)return;

    wrap.querySelectorAll('[data-roster-status]').forEach(button=>{
      const active=button.dataset.rosterStatus==='all';
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
    });

    if(search){
      search.value='';
      search.dispatchEvent(new Event('input',{bubbles:true}));
    }
    if(unit){
      unit.value='all';
      unit.dispatchEvent(new Event('input',{bubbles:true}));
      unit.dispatchEvent(new Event('change',{bubbles:true}));
    }
  };

  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target.closest('[data-roster-clear]'):null;
    if(!target)return;
    resetLiveRosterFilters();
    queueMicrotask(()=>{
      const unit=document.querySelector('#ru');
      if(unit&&unit.value!=='all')resetLiveRosterFilters();
    });
  },true);
})();
