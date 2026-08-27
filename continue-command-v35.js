(() => {
  'use strict';
  if(window.__TitansContinueCommandV35)return;
  window.__TitansContinueCommandV35=true;
  const STORE='titans:v35ContinueCommand';
  const app=document.querySelector('#app');
  const labels={live:'Game Day',games:'Schedule',roster:'Team Room',transactions:'Transactions',stats:'Stats Lab',fantasy:'Fantasy Command',markets:'Market Pulse',feed:'Intel Feed',legacy:'Legacy',sources:'Sources',fan:'Fan Hub',media:'Listen / Watch',command:'Command Intel',player:'Player Intelligence'};
  let timer=0;
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const read=()=>{try{const value=JSON.parse(localStorage.getItem(STORE)||'null');return value&&typeof value==='object'&&String(value.href||'').startsWith('#')?value:null}catch{return null}};
  const write=value=>{try{localStorage.setItem(STORE,JSON.stringify(value));return true}catch{return false}};
  const clear=()=>{try{localStorage.removeItem(STORE)}catch{}}
  function injectStyle(){
    if(document.querySelector('#continue-command-v35-style'))return;
    const style=document.createElement('style');style.id='continue-command-v35-style';
    style.textContent='.continue-command-v35{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;align-items:center;margin:0 0 18px;padding:16px 18px;border:1px solid rgba(134,210,255,.24);border-radius:16px;background:linear-gradient(115deg,rgba(18,52,82,.9),rgba(8,25,43,.9));box-shadow:0 12px 34px rgba(0,0,0,.16)}.continue-command-v35 small{display:block;color:#a9d8fb;font-size:.7rem;font-weight:900;letter-spacing:.12em}.continue-command-v35 strong{display:block;margin:5px 0 3px;color:#fff;font-size:1rem}.continue-command-v35 span{color:#c6d8e7;font-size:.78rem}.continue-command-v35-actions{display:flex;gap:8px;align-items:center}.continue-command-v35 a,.continue-command-v35 button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;border-radius:11px;font:inherit;font-weight:900;cursor:pointer}.continue-command-v35 a{padding:0 14px;background:#4b92db;color:#06101c;text-decoration:none}.continue-command-v35 button{width:44px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.05);color:#e7f2fb}.continue-command-v35 :focus-visible{outline:3px solid #fff;outline-offset:2px}@media(max-width:620px){.continue-command-v35{grid-template-columns:1fr;gap:12px}.continue-command-v35-actions{width:100%}.continue-command-v35 a{flex:1;min-height:48px}.continue-command-v35 button{width:48px;height:48px}}';
    document.head.appendChild(style);
  }
  function remember(){
    const current=route();
    if(current==='home'||!labels[current])return;
    const href=String(location.hash||`#${current}`).slice(0,180);
    if(!href.startsWith('#'))return;
    const pageTitle=document.querySelector('#app .page-head h1')?.textContent?.trim();
    const label=current==='player'&&pageTitle?pageTitle:labels[current];
    write({href,label:String(label||labels[current]).slice(0,80),section:labels[current],savedAt:new Date().toISOString()});
  }
  function mount(){
    if(!app||route()!=='home')return;
    const saved=read(),hero=app.querySelector('.fan-hero');
    let card=app.querySelector('.continue-command-v35');
    if(!saved||!hero){card?.remove();return;}
    if(!card){card=document.createElement('section');card.className='continue-command-v35';card.setAttribute('aria-label','Continue where you left off');hero.insertAdjacentElement('afterend',card);}
    const section=String(saved.section||'Titans Command Center');
    const label=String(saved.label||section);
    card.innerHTML=`<div><small>CONTINUE WHERE YOU LEFT OFF</small><strong>${esc(label)}</strong><span>${esc(section)} · saved on this device</span></div><div class="continue-command-v35-actions"><a href="${esc(saved.href)}">Continue →</a><button type="button" data-clear-continue aria-label="Clear continue shortcut">×</button></div>`;
  }
  function run(){remember();mount();}
  function schedule(){clearTimeout(timer);timer=setTimeout(run,60);}
  document.addEventListener('click',event=>{const target=event.target instanceof Element?event.target:null;if(!target?.closest('[data-clear-continue]'))return;clear();target.closest('.continue-command-v35')?.remove();});
  addEventListener('hashchange',schedule);
  if(app)new MutationObserver(schedule).observe(app,{childList:true});
  injectStyle();schedule();
})();
