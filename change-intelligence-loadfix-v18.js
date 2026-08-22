(() => {
  'use strict';
  const app=document.querySelector('#app');
  if(!app)return;
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  let generation=0;

  function wake(){
    if(route()!=='command'||document.querySelector('.v18-change-intel'))return;
    if(!document.querySelector('.v15-command-view'))return;
    const marker=document.createComment('v18-late-mount');
    app.appendChild(marker);
    marker.remove();
  }

  function schedule(){
    const token=++generation;
    for(const delay of [120,360,900,1800,3200])setTimeout(()=>{
      if(token!==generation)return;
      wake();
    },delay);
  }

  addEventListener('hashchange',schedule);
  schedule();
})();
