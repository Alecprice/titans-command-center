(() => {
  'use strict';
  const app=document.querySelector('#app');
  if(!app)return;
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  let generation=0;

  function wake(){
    if(route()!=='command'||document.querySelector('.v18-change-intel'))return;
    const host=document.querySelector('.v15-command > .v15-pane');
    if(!host)return;
    host.classList.add('v15-command-view');
    window.TitansChangeIntelligence?.wake?.();
  }

  function schedule(){
    const token=++generation;
    queueMicrotask(()=>{if(token===generation)wake()});
    for(const delay of [120,360,900,1800,3200])setTimeout(()=>{
      if(token!==generation)return;
      wake();
    },delay);
  }

  new MutationObserver(()=>queueMicrotask(wake)).observe(app,{childList:true,subtree:false});
  addEventListener('hashchange',schedule);
  schedule();
})();
