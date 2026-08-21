(() => {
  'use strict';

  if(!document.querySelector('link[data-media-custom-links]')){
    const style=document.createElement('link');
    style.rel='stylesheet';
    style.href='/media-custom-links-v14.css?v=1';
    style.dataset.mediaCustomLinks='true';
    document.head.append(style);
  }

  const STORAGE_KEY='titans:v14CustomMediaLinks';
  const MAX_LINKS=12;
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function readLinks(){
    try{
      const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
      return Array.isArray(value)?value.filter(item=>item&&typeof item.label==='string'&&typeof item.url==='string').slice(0,MAX_LINKS):[];
    }catch{return []}
  }
  function writeLinks(value){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(value.slice(0,MAX_LINKS)));return true}catch{return false}}
  function normalizeUrl(value){
    try{
      const u=new URL(String(value||'').trim());
      return ['https:','http:'].includes(u.protocol)?u.href:null;
    }catch{return null}
  }

  function card(item,index){return `<article class="media-custom-card"><div><small>USER SAVED</small><strong>${esc(item.label||'Custom link')}</strong><span>${esc(new URL(item.url).hostname)}</span></div><div class="media-custom-actions"><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">Open ↗</a><button type="button" data-custom-remove="${index}" aria-label="Remove ${esc(item.label||'custom link')}">Remove</button></div></article>`}

  function sectionHtml(links){
    return `<section class="media-custom-links" data-custom-media-links><header><div><small>OTHER STREAMING OPTIONS</small><h3>Your saved links</h3><p>Add a website you personally use. Links are stored only on this device and are not verified, endorsed, or sent to the Command Center server.</p></div></header><form class="media-custom-form" data-custom-form><label><span>Name</span><input name="label" maxlength="50" placeholder="My streaming option" required /></label><label><span>Website</span><input name="url" type="url" inputmode="url" autocomplete="url" placeholder="https://…" required /></label><button type="submit">Save link</button><p class="media-custom-error" data-custom-error role="status" aria-live="polite"></p></form><div class="media-custom-grid">${links.length?links.map(card).join(''):'<p class="media-custom-empty">No personal links saved yet.</p>'}</div></section>`;
  }

  function render(){
    if(route()!=='media')return;
    const watch=document.querySelector('.media-watch');
    if(!watch)return;
    const existing=watch.querySelector('[data-custom-media-links]');
    const section=document.createElement('section');
    section.innerHTML=sectionHtml(readLinks());
    const next=section.firstElementChild;
    if(!next)return;
    if(existing)existing.replaceWith(next);
    else{
      const alternatives=watch.querySelector('.media-alternatives');
      const note=watch.querySelector('.media-watch-note');
      if(alternatives)alternatives.insertAdjacentElement('afterend',next);
      else if(note)note.insertAdjacentElement('beforebegin',next);
      else watch.append(next);
    }
  }

  document.addEventListener('submit',event=>{
    const form=event.target instanceof HTMLFormElement?event.target.closest('[data-custom-form]'):null;
    if(!form)return;
    event.preventDefault();
    const data=new FormData(form),label=String(data.get('label')||'').trim(),url=normalizeUrl(data.get('url'));
    const status=form.querySelector('[data-custom-error]');
    if(!label||!url){if(status)status.textContent='Enter a name and a valid http or https website.';return}
    const links=readLinks();
    if(links.length>=MAX_LINKS){if(status)status.textContent=`You can save up to ${MAX_LINKS} links on this device.`;return}
    links.push({label,url});
    if(!writeLinks(links)){if(status)status.textContent='This browser is blocking local storage, so the link could not be saved.';return}
    render();
  });

  document.addEventListener('click',event=>{
    const button=event.target instanceof Element?event.target.closest('[data-custom-remove]'):null;
    if(!button)return;
    const index=Number(button.getAttribute('data-custom-remove'));
    if(!Number.isInteger(index)||index<0)return;
    const links=readLinks();
    links.splice(index,1);
    writeLinks(links);
    render();
  });

  window.addEventListener('hashchange',()=>setTimeout(render,80));
  document.addEventListener('click',event=>{if(event.target instanceof Element&&event.target.closest('[data-media-area]'))setTimeout(render,120)},true);
  const app=document.querySelector('#app');
  if(app)new MutationObserver(()=>queueMicrotask(render)).observe(app,{childList:true,subtree:false});
  setTimeout(render,180);
})();