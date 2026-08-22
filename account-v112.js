(() => {
  'use strict';
  if(window.__TitansAccountV112)return;
  window.__TitansAccountV112=true;
  const AUTH='/api/account/auth';
  const phone=matchMedia('(max-width:760px)');
  const state={session:null,loading:true,mode:'signin',sync:{state:'idle',message:'Selected settings can sync when account storage is available.'}};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  async function auth(path,{method='GET',body}={}){
    const res=await fetch(`${AUTH}/${path}`,{method,credentials:'same-origin',cache:'no-store',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined});
    let data={};try{data=await res.json()}catch{}
    if(!res.ok)throw new Error(data?.message||data?.error||'Account request failed');
    return data;
  }
  function ensureCss(){if(document.querySelector('link[data-account-v112]'))return;const link=document.createElement('link');link.rel='stylesheet';link.href='/account-v112.css?v=3';link.dataset.accountV112='';document.head.appendChild(link);}
  function user(){return state.session?.user||state.session?.data?.user||null;}
  function announce(){window.dispatchEvent(new CustomEvent('titans:account',{detail:{user:user()}}));}
  function placeEntryCard(card){
    const sidebar=document.querySelector('#sidebar'),nav=sidebar?.querySelector('.nav'),foot=sidebar?.querySelector('.sidebar-foot');
    if(!card||!sidebar||!nav||!foot)return;
    if(phone.matches)nav.before(card);else foot.prepend(card);
  }
  function renderEntry(){
    const u=user();
    let btn=document.querySelector('#account-button');
    if(!btn){btn=document.createElement('button');btn.type='button';btn.id='account-button';btn.className='account-button';document.querySelector('.top-actions')?.prepend(btn);}
    btn.textContent=u?(u.name||u.email||'Account'):'Guest';
    btn.setAttribute('aria-label',u?'Open account':'Sign in or create account');
    let card=document.querySelector('.account-sheet-card');
    if(!card){card=document.createElement('section');card.className='account-sheet-card';}
    placeEntryCard(card);
    card.innerHTML=u?`<small>SIGNED IN</small><strong>${esc(u.name||u.email||'Titans fan')}</strong><span class="account-mini-status">${esc(state.sync.message)}</span><button type="button" data-account-open>Account</button>`:`<small>VIEWING AS GUEST</small><strong>No account required</strong><span class="account-mini-status">Settings stay on this device.</span><button type="button" data-account-open>Sign in / Sign up</button>`;
  }
  function syncStatusMarkup(){return `<div class="account-sync-status ${esc(state.sync.state)}" role="status" aria-live="polite"><i aria-hidden="true"></i><span>${esc(state.sync.message)}</span></div>`;}
  function refreshOpenStatus(){const el=document.querySelector('.account-sync-status');if(!el)return;el.className=`account-sync-status ${state.sync.state}`;el.querySelector('span').textContent=state.sync.message;}
  function close(){document.querySelector('.account-modal')?.remove();document.body.classList.remove('account-open');}
  function open(mode='signin'){
    state.mode=mode;close();
    const u=user(),modal=document.createElement('div');modal.className='account-modal';modal.innerHTML=`<div class="account-backdrop" data-account-close></div><section class="account-panel" role="dialog" aria-modal="true" aria-labelledby="account-title"><button class="account-close" data-account-close aria-label="Close account">×</button>${u?`<small class="account-eyebrow">YOUR TITANS ACCOUNT</small><h2 id="account-title">${esc(u.name||'Signed in')}</h2><p>${esc(u.email||'')}</p>${syncStatusMarkup()}<div class="account-benefits"><span>Favorite player can sync across signed-in devices when account storage is available.</span><span>Smart alert preferences can follow your account when sync is available.</span><span>Saved personal media links can follow your account when sync is available.</span><span>Guest browsing and device-local settings always remain available.</span></div><button class="account-primary" data-account-sync type="button">Sync now</button><button class="account-guest" data-account-signout type="button">Sign out</button>`:`<small class="account-eyebrow">OPTIONAL ACCOUNT</small><h2 id="account-title">${mode==='signup'?'Create your account':'Welcome back'}</h2><p>Everything is still available as a guest. Sign in only if you want favorites and selected preferences to sync when account storage is available.</p><div class="account-tabs" role="tablist"><button type="button" data-account-mode="signin" class="${mode==='signin'?'active':''}">Log in</button><button type="button" data-account-mode="signup" class="${mode==='signup'?'active':''}">Sign up</button></div><form class="account-form">${mode==='signup'?'<label>Name<input name="name" autocomplete="name" required maxlength="80"></label>':''}<label>Email<input name="email" type="email" autocomplete="email" required></label><label>Password<input name="password" type="password" autocomplete="${mode==='signup'?'new-password':'current-password'}" required minlength="8"></label><div class="account-error" role="alert"></div><button class="account-primary" type="submit">${mode==='signup'?'Create account':'Log in'}</button><button class="account-guest" type="button" data-account-close>Continue as guest</button></form>`}</section>`;
    document.body.appendChild(modal);document.body.classList.add('account-open');modal.querySelector('input')?.focus();
  }
  async function refresh(){state.loading=true;try{state.session=await auth('get-session');}catch{state.session=null;}state.loading=false;renderEntry();announce();}
  document.addEventListener('click',async e=>{
    const t=e.target instanceof Element?e.target:null;if(!t)return;
    if(t.closest('#account-button,[data-account-open]')){open(user()?'account':'signin');return;}
    if(t.closest('[data-account-close]')){close();return;}
    const mode=t.closest('[data-account-mode]')?.dataset.accountMode;if(mode){open(mode);return;}
    if(t.closest('[data-account-sync]')){await window.TitansAccountSync?.sync?.();return;}
    if(t.closest('[data-account-signout]')){try{await auth('sign-out',{method:'POST'});}catch{}state.session=null;state.sync={state:'guest',message:'Guest settings stay on this device.'};close();renderEntry();announce();return;}
  });
  document.addEventListener('submit',async e=>{
    const form=e.target;if(!(form instanceof HTMLFormElement)||!form.classList.contains('account-form'))return;e.preventDefault();
    const fd=new FormData(form),error=form.querySelector('.account-error'),submit=form.querySelector('.account-primary');error.textContent='';submit.disabled=true;
    try{const email=String(fd.get('email')||'').trim(),password=String(fd.get('password')||'');if(state.mode==='signup')await auth('sign-up/email',{method:'POST',body:{name:String(fd.get('name')||'Titans fan').trim(),email,password}});else await auth('sign-in/email',{method:'POST',body:{email,password}});await refresh();close();}
    catch(err){error.textContent=err instanceof Error?err.message:'Could not complete account request.';}finally{submit.disabled=false;}
  });
  addEventListener('titans:sync-status',event=>{state.sync={state:event.detail?.state||'idle',message:event.detail?.message||'Sync status unavailable.'};renderEntry();refreshOpenStatus();});
  phone.addEventListener?.('change',()=>{const card=document.querySelector('.account-sheet-card');if(card)placeEntryCard(card);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.querySelector('.account-modal'))close();});
  ensureCss();refresh();
  window.TitansAccount={open,refresh,get user(){return user();},get guest(){return !user();},get syncStatus(){return {...state.sync}}};
})();
