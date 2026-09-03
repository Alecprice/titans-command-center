import './command-opponent-scout-v161.js';

(() => {
  'use strict';

  const app=document.querySelector('#app');
  if(!app)return;

  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const commandOwnsApp=()=>Boolean(app.querySelector('.v15-command,.v15-loading'));
  let scheduled=false;

  function handBackToCommand(){
    if(route()!=='command'||commandOwnsApp()||scheduled)return;
    scheduled=true;
    setTimeout(()=>{
      scheduled=false;
      if(route()==='command'&&!commandOwnsApp()){
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    },0);
  }

  new MutationObserver(handBackToCommand).observe(app,{childList:true,subtree:false});
  window.addEventListener('hashchange',handBackToCommand);
  window.addEventListener('popstate',handBackToCommand);
  setTimeout(handBackToCommand,120);
})();
