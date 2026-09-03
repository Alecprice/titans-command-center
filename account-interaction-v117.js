(() => {
  'use strict';
  if(window.__TitansAccountInteractionV117)return;
  window.__TitansAccountInteractionV117=true;

  function ensurePasswordStyle(){
    if(document.querySelector('style[data-account-password-v167]'))return;
    const style=document.createElement('style');style.dataset.accountPasswordV167='';style.textContent='.account-password-wrap{position:relative}.account-password-wrap input{padding-right:86px}.account-password-toggle{position:absolute;right:6px;top:50%;transform:translateY(-50%);min-width:72px;min-height:36px;padding:0 10px;border:1px solid rgba(134,210,255,.2);border-radius:9px;background:#10283d;color:#d9ecfb;font:inherit;font-size:.72rem;font-weight:850;cursor:pointer}.account-password-toggle:focus-visible{outline:3px solid #86d2ff;outline-offset:2px}@media(max-width:760px){.account-password-toggle{min-height:40px;font-size:.78rem}}@media(prefers-reduced-motion:reduce){.account-password-toggle{transition:none!important}}';document.head.appendChild(style);
  }

  function enhancePassword(){
    const input=document.querySelector('.account-form input[name="password"]');
    if(!(input instanceof HTMLInputElement)||input.dataset.passwordV167==='true')return;
    input.dataset.passwordV167='true';
    const wrap=document.createElement('span');wrap.className='account-password-wrap';
    input.parentNode?.insertBefore(wrap,input);wrap.appendChild(input);
    const toggle=document.createElement('button');toggle.type='button';toggle.className='account-password-toggle';toggle.dataset.accountPasswordToggle='';toggle.setAttribute('aria-pressed','false');toggle.setAttribute('aria-label','Show password');toggle.textContent='Show';wrap.appendChild(toggle);
  }

  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    const toggle=target?.closest('[data-account-password-toggle]');
    if(toggle){
      const input=toggle.parentElement?.querySelector('input[name="password"]');
      if(input instanceof HTMLInputElement){
        const showing=input.type==='text';input.type=showing?'password':'text';toggle.textContent=showing?'Show':'Hide';toggle.setAttribute('aria-pressed',String(!showing));toggle.setAttribute('aria-label',showing?'Show password':'Hide password');input.focus({preventScroll:true});
      }
      return;
    }

    if(target?.closest('[data-account-mode]')){queueMicrotask(enhancePassword);return;}

    const trigger=target?.closest('#account-button,[data-account-open]');
    const account=window.TitansAccount;
    if(!trigger||!account?.open)return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const sidebar=document.querySelector('#sidebar');
    if(sidebar?.classList.contains('open'))sidebar.classList.remove('open');

    requestAnimationFrame(()=>{account.open(account.guest?'signin':'account');enhancePassword();});
  },true);

  ensurePasswordStyle();
})();
