(() => {
  'use strict';
  if(window.__TitansAccountInteractionV117)return;
  window.__TitansAccountInteractionV117=true;

  function ensurePasswordStyle(){
    if(document.querySelector('style[data-account-password-v173]'))return;
    const style=document.createElement('style');
    style.dataset.accountPasswordV173='';
    style.textContent='.account-password-field{display:grid;gap:6px}.account-password-wrap{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:stretch}.account-password-wrap input{min-width:0}.account-password-toggle{min-width:76px;min-height:48px;padding:0 12px;border:1px solid rgba(134,210,255,.2);border-radius:13px;background:#10283d;color:#d9ecfb;font:inherit;font-size:.76rem;font-weight:850;cursor:pointer}.account-password-toggle:hover{background:#173f64}.account-password-toggle:focus-visible{outline:3px solid #86d2ff;outline-offset:2px}@media(max-width:400px){.account-password-wrap{gap:6px}.account-password-toggle{min-width:70px;padding:0 8px;font-size:.74rem}}@media(prefers-reduced-motion:reduce){.account-password-toggle{transition:none!important}}@media(forced-colors:active){.account-password-toggle{border-color:ButtonText}}';
    document.head.appendChild(style);
  }

  function enhancePassword(){
    const input=document.querySelector('.account-form input[name="password"]');
    if(!(input instanceof HTMLInputElement)||input.dataset.passwordV173==='true')return;
    const label=input.closest('label');
    if(!(label instanceof HTMLLabelElement))return;

    input.dataset.passwordV173='true';
    input.id=input.id||'account-password-input';

    const field=document.createElement('div');
    field.className='account-password-field';
    const fieldLabel=document.createElement('label');
    fieldLabel.htmlFor=input.id;
    fieldLabel.textContent='Password';
    const wrap=document.createElement('div');
    wrap.className='account-password-wrap';
    const toggle=document.createElement('button');
    toggle.type='button';
    toggle.className='account-password-toggle';
    toggle.dataset.accountPasswordToggle='';
    toggle.setAttribute('aria-controls',input.id);
    toggle.setAttribute('aria-label','Show password');
    toggle.textContent='Show';

    label.replaceWith(field);
    field.append(fieldLabel,wrap);
    wrap.append(input,toggle);
  }

  function togglePasswordVisibility(toggle){
    const input=toggle.parentElement?.querySelector('input[name="password"]');
    if(!(input instanceof HTMLInputElement))return;
    const reveal=input.type==='password';
    const start=input.selectionStart,end=input.selectionEnd,direction=input.selectionDirection;
    input.type=reveal?'text':'password';
    toggle.textContent=reveal?'Hide':'Show';
    toggle.setAttribute('aria-label',reveal?'Hide password':'Show password');
    try{
      input.focus({preventScroll:true});
      if(start!==null&&end!==null)input.setSelectionRange(start,end,direction||'none');
    }catch{input.focus();}
  }

  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    const toggle=target?.closest('[data-account-password-toggle]');
    if(toggle){event.preventDefault();togglePasswordVisibility(toggle);return;}

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

  queueMicrotask(()=>{
    const account=window.TitansAccount;
    if(!account?.open||account.open.__passwordVisibilityV173)return;
    const originalOpen=account.open;
    const wrappedOpen=(...args)=>{const result=originalOpen(...args);enhancePassword();return result;};
    wrappedOpen.__passwordVisibilityV173=true;
    account.open=wrappedOpen;
  });

  ensurePasswordStyle();
})();
