(() => {
  'use strict';
  if(window.__TitansAccountInteractionV117)return;
  window.__TitansAccountInteractionV117=true;

  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    const trigger=target?.closest('#account-button,[data-account-open]');
    const account=window.TitansAccount;
    if(!trigger||!account?.open)return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const sidebar=document.querySelector('#sidebar');
    if(sidebar?.classList.contains('open'))sidebar.classList.remove('open');

    requestAnimationFrame(()=>account.open(account.guest?'signin':'account'));
  },true);
})();
