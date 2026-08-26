(() => {
  'use strict';
  const runtime=window.TitansRuntime;
  if(!runtime)return;

  const route=()=>runtime.route();
  const requestedView=()=>new URLSearchParams(location.hash.split('?')[1]||'').get('view');

  function sync(){
    if(route()!=='roster'||requestedView()!=='cutdown')return;
    const app=document.querySelector('#app');
    const switcher=app?.querySelector('.team-room-switcher');
    const cutdownPanel=app?.querySelector('.team-room-panel[data-panel="cutdown"]');
    if(!app||!switcher||!cutdownPanel)return;

    app.dataset.teamRoomView='cutdown';
    switcher.querySelectorAll('[data-team-room-view]').forEach(button=>{
      const selected=button.dataset.teamRoomView==='cutdown';
      button.classList.toggle('active',selected);
      button.setAttribute('aria-pressed',String(selected));
    });
    app.querySelectorAll('.team-room-panel').forEach(panel=>{
      panel.hidden=panel.dataset.panel!=='cutdown';
    });
    app.querySelectorAll('.roster-summary-strip,.filterbar,.roster-status-filters,#rg').forEach(element=>{
      element.hidden=true;
    });
  }

  runtime.onAppRender(()=>queueMicrotask(sync),{immediate:true});
  runtime.onRoute(()=>queueMicrotask(sync));
  runtime.onRefresh(()=>queueMicrotask(sync));
})();
