(() => {
  'use strict';
  if(window.__TitansAccountSessionV117)return;
  window.__TitansAccountSessionV117=true;
  let hadUser=false,expired=false,signingOut=false,checking=false,lastCheck=0,toastTimer=0;
  const CHECK_INTERVAL=60000;
  function toast(message,ms=4200){
    const el=document.querySelector('#toast');if(!el)return;
    el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),ms);
  }
  function decorate(){
    const guest=Boolean(window.TitansAccount?.guest);
    const mini=document.querySelector('.account-sheet-card .account-mini-status');
    if(mini&&expired&&guest)mini.textContent='Session expired · browsing as guest';
    const form=document.querySelector('.account-panel .account-form');
    if(!form)return;
    let note=form.querySelector('.account-session-note');
    if(expired&&guest){
      if(!note){note=document.createElement('div');note.className='account-session-note';note.setAttribute('role','status');form.prepend(note);}
      note.innerHTML='<strong>Session expired</strong><span>You can keep browsing as a guest. Sign in again to resume account sync.</span>';
    }else note?.remove();
  }
  function markExpired(){
    if(expired)return;
    expired=true;
    toast('Your Titans session expired. You can keep browsing as a guest.',5200);
    window.dispatchEvent(new CustomEvent('titans:session-expired'));
    queueMicrotask(decorate);
  }
  addEventListener('titans:account-signout',()=>{signingOut=true;hadUser=false;expired=false;queueMicrotask(decorate);});
  addEventListener('titans:account',event=>{
    const user=event.detail?.user||null;
    if(user){hadUser=true;expired=false;signingOut=false;queueMicrotask(decorate);return;}
    if(hadUser&&!signingOut)markExpired();
    hadUser=false;signingOut=false;queueMicrotask(decorate);
  });
  addEventListener('titans:account-refresh-error',()=>{if(hadUser)toast('Couldn’t verify your account right now. Your current signed-in session was kept.',4200);});
  async function recheck(reason='resume'){
    if(!hadUser||checking||navigator.onLine===false)return false;
    const now=Date.now();if(now-lastCheck<CHECK_INTERVAL)return false;
    checking=true;lastCheck=now;
    try{return Boolean(await window.TitansAccount?.refresh?.({reason}));}
    finally{checking=false;}
  }
  addEventListener('focus',()=>recheck('focus'));
  addEventListener('online',()=>recheck('online'));
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')recheck('visible');});
  const observer=new MutationObserver(decorate);observer.observe(document.body,{childList:true,subtree:false});
  window.TitansAccountSession={recheck,get expired(){return expired;},get hadUser(){return hadUser;},get checking(){return checking;}};
})();
