(() => {
  'use strict';

  if(!document.querySelector('link[data-media-custom-links]')){
    const style=document.createElement('link');style.rel='stylesheet';style.href='/media-custom-links-v14.css?v=1';style.dataset.mediaCustomLinks='true';document.head.append(style);
  }
  const STORAGE_KEY='titans:v14CustomMediaLinks';
  const MAX_LINKS=12;
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function readLinks(){try{const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return Array.isArray(value)?value.filter(item=>item&&typeof item.label==='string'&&typeof item.url==='string').slice(0,MAX_LINKS):[]}catch{return []}}
  function writeLinks(value){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(value.slice(0,MAX_LINKS)));return true}catch{return false}}
  function normalizeUrl(value){try{const u=new URL(String(value||'').trim());return ['https:','http:'].includes(u.protocol)?u.href:null}catch{return null}}
  function card(item,index){return `<article class="media-custom-card"><div><small>USER SAVED</small><strong>${esc(item.label||'Custom link')}</strong><span>${esc(new URL(item.url).hostname)}</span></div><div class="media-custom-actions"><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">Open ↗</a><button type="button" data-custom-remove="${index}" aria-label="Remove ${esc(item.label||'custom link')}">Remove</button></div></article>`}
  function sectionHtml(links){return `<section class="media-custom-links" data-custom-media-links><header><div><small>OTHER STREAMING OPTIONS</small><h3>Your saved links</h3><p>Add a website you personally use. Guest links stay on this device; signed-in users can sync saved links when account sync is available. Links are not verified or endorsed by the Command Center.</p></div></header><form class="media-custom-form" data-custom-form><label><span>Name</span><input name="label" maxlength="50" placeholder="My streaming option" required /></label><label><span>Website</span><input name="url" type="url" inputmode="url" autocomplete="url" placeholder="https://…" required /></label><button type="submit">Save link</button><p class="media-custom-error" data-custom-error role="status" aria-live="polite"></p></form><div class="media-custom-grid">${links.length?links.map(card).join(''):'<p class="media-custom-empty">No personal links saved yet.</p>'}</div></section>`}
  function render(){if(route()!=='media')return;const watch=document.querySelector('.media-watch');if(!watch)return;const old=document.querySelector('[data-custom-media-links]');const html=sectionHtml(readLinks());if(old)old.outerHTML=html;else watch.insertAdjacentHTML('beforeend',html)}
  document.addEventListener('submit',event=>{const form=event.target.closest?.('[data-custom-form]');if(!form)return;event.preventDefault();const data=new FormData(form),label=String(data.get('label')||'').trim(),url=normalizeUrl(data.get('url')),error=form.querySelector('[data-custom-error]');if(!label||!url){if(error)error.textContent='Enter a name and a normal http/https website.';return}const links=readLinks();links.push({label:label.slice(0,50),url});writeLinks(links);render()});
  document.addEventListener('click',event=>{const button=event.target.closest?.('[data-custom-remove]');if(!button)return;const links=readLinks();const index=Number(button.dataset.customRemove);links.splice(index,1);writeLinks(links);render()});
  addEventListener('hashchange',()=>setTimeout(render,0));
  const app=document.querySelector('#app');if(app)new MutationObserver(()=>{if(route()==='media')queueMicrotask(render)}).observe(app,{childList:true});
  render();
})();
