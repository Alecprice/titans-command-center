(() => {
  'use strict';

  // This module can be reached both through media-alternatives and the app shell.
  // Guard it so duplicate module URLs never register duplicate listeners.
  if(globalThis.__titansCustomMediaLinksLoaded)return;
  globalThis.__titansCustomMediaLinksLoaded=true;

  if(!document.querySelector('link[data-media-custom-links]')){
    const style=document.createElement('link');
    style.rel='stylesheet';
    style.href='/media-custom-links-v14.css?v=2';
    style.dataset.mediaCustomLinks='true';
    document.head.append(style);
  }

  // Keep the permanent device key stable. The versioned alias remains only because
  // account sync already recognizes it; every save keeps both copies synchronized.
  const STORAGE_KEY='titans:customMediaLinks';
  const SYNC_STORAGE_KEY='titans:v14CustomMediaLinks';
  const STORAGE_VERSION=1;
  const LEGACY_STORAGE_RE=/^titans:v\d+CustomMediaLinks$/i;
  const MAX_LINKS=12;
  const PRIORITY_ACCOUNT='titans77fan@gmail.com';
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));

  function normalizeUrl(value){
    try{
      const u=new URL(String(value||'').trim());
      return ['https:','http:'].includes(u.protocol)?u.href:null;
    }catch{return null}
  }

  function parseStored(key){
    try{
      const raw=localStorage.getItem(key);
      return raw?JSON.parse(raw):null;
    }catch{return null}
  }

  function sanitizeLinks(value){
    const input=Array.isArray(value)?value:Array.isArray(value?.links)?value.links:[];
    const seen=new Set();
    return input.flatMap(item=>{
      if(!item||typeof item.label!=='string'||typeof item.url!=='string')return[];
      const label=item.label.trim(),url=normalizeUrl(item.url);
      if(!label||!url||seen.has(url))return[];
      seen.add(url);
      return [{label:label.slice(0,50),url}];
    }).slice(0,MAX_LINKS);
  }

  function legacyKeys(){
    const keys=[];
    try{
      for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i);
        if(key&&key!==SYNC_STORAGE_KEY&&LEGACY_STORAGE_RE.test(key))keys.push(key);
      }
    }catch{}
    return keys;
  }

  function encodedLinks(value){return JSON.stringify({version:STORAGE_VERSION,links:sanitizeLinks(value)});}

  function persistLinks(value){
    try{
      const payload=encodedLinks(value);
      localStorage.setItem(STORAGE_KEY,payload);
      // Compatibility alias for the existing account preference namespace. This is
      // presentation data only; account identity still comes from the authenticated session.
      try{localStorage.setItem(SYNC_STORAGE_KEY,payload)}catch{}
      return true;
    }catch{return false}
  }

  function migrateAndReadLinks(){
    const current=parseStored(STORAGE_KEY);
    const sync=parseStored(SYNC_STORAGE_KEY);
    const keys=legacyKeys();
    const combined=[...sanitizeLinks(current)];
    const seen=new Set(combined.map(item=>item.url));

    for(const item of sanitizeLinks(sync)){
      if(seen.has(item.url))continue;
      seen.add(item.url);combined.push(item);
      if(combined.length>=MAX_LINKS)break;
    }
    for(const key of keys){
      for(const item of sanitizeLinks(parseStored(key))){
        if(seen.has(item.url))continue;
        seen.add(item.url);
        combined.push(item);
        if(combined.length>=MAX_LINKS)break;
      }
      if(combined.length>=MAX_LINKS)break;
    }

    const needsRewrite=keys.length>0||Array.isArray(current)||(current&&Number(current.version)!==STORAGE_VERSION)||(!current&&sync);
    if((needsRewrite||(!current&&combined.length))&&persistLinks(combined)){
      for(const key of keys){
        try{localStorage.removeItem(key)}catch{}
      }
    }
    return combined.slice(0,MAX_LINKS);
  }

  function adoptSyncedLinks(){
    const synced=parseStored(SYNC_STORAGE_KEY);
    if(synced===null)return false;
    const links=sanitizeLinks(synced);
    try{localStorage.setItem(STORAGE_KEY,encodedLinks(links));return true}catch{return false}
  }

  const readLinks=()=>migrateAndReadLinks();
  const writeLinks=value=>persistLinks(value);
  const priorityAccount=()=>String(window.TitansAccount?.user?.email||'').trim().toLowerCase()===PRIORITY_ACCOUNT;

  function card(item,index){
    return `<article class="media-custom-card"><div><small>USER SAVED</small><strong>${esc(item.label||'Custom link')}</strong><span>${esc(new URL(item.url).hostname)}</span></div><div class="media-custom-actions"><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">Open ↗</a><button type="button" data-custom-remove="${index}" aria-label="Remove ${esc(item.label||'custom link')}">Remove</button></div></article>`;
  }

  function sectionHtml(links){
    return `<section class="media-custom-links" data-custom-media-links><header><div><small>OTHER STREAMING OPTIONS</small><h3>Your saved links</h3><p>Add a website you personally use. <strong>Guest links stay on this device through normal app and PWA updates.</strong> Signed-in users can sync saved links when account sync is available. Clearing browser/site data, switching site domains, or uninstalling may remove device-only links. Links are not verified or endorsed by the Command Center. Save up to ${MAX_LINKS} unique websites.</p></div></header><form class="media-custom-form" data-custom-form><label><span>Name</span><input name="label" maxlength="50" placeholder="My streaming option" required /></label><label><span>Website</span><input name="url" type="url" inputmode="url" autocomplete="url" spellcheck="false" autocapitalize="none" placeholder="https://…" required /></label><button type="submit">Save link</button><p class="media-custom-error" data-custom-error role="status" aria-live="polite"></p></form><div class="media-custom-grid">${links.length?links.map(card).join(''):'<p class="media-custom-empty">No personal links saved yet.</p>'}</div></section>`;
  }

  function placeSection(section,links){
    if(!section)return;
    const watch=document.querySelector('.media-watch'),page=document.querySelector('.media-page');
    if(!watch)return;
    const priority=priorityAccount()&&links.length>0;
    section.classList.toggle('media-custom-links-priority',priority);
    section.dataset.savedPriority=String(priority);
    if(priority){
      const hero=page?.querySelector('.media-hero');
      if(hero)hero.insertAdjacentElement('afterend',section);else watch.prepend(section);
    }else watch.append(section);
  }

  function render(){
    if(route()!=='media')return;
    const watch=document.querySelector('.media-watch');
    if(!watch)return;
    const links=readLinks(),old=document.querySelector('[data-custom-media-links]');
    const html=sectionHtml(links);
    if(old)old.outerHTML=html;else watch.insertAdjacentHTML('beforeend',html);
    placeSection(document.querySelector('[data-custom-media-links]'),links);
  }

  document.addEventListener('submit',event=>{
    const form=event.target.closest?.('[data-custom-form]');
    if(!form)return;
    event.preventDefault();
    const data=new FormData(form),label=String(data.get('label')||'').trim(),url=normalizeUrl(data.get('url')),error=form.querySelector('[data-custom-error]');
    if(!label||!url){if(error)error.textContent='Enter a name and a normal http/https website.';return}
    const links=readLinks();
    if(links.length>=MAX_LINKS){if(error)error.textContent=`You can save up to ${MAX_LINKS} websites. Remove one before adding another.`;return}
    if(links.some(item=>item.url===url)){if(error)error.textContent='That website is already saved.';return}
    links.push({label:label.slice(0,50),url});
    if(!writeLinks(links)){if(error)error.textContent='This link could not be saved on this device.';return}
    render();
  });

  document.addEventListener('click',event=>{
    const button=event.target.closest?.('[data-custom-remove]');
    if(!button)return;
    const links=readLinks(),index=Number(button.dataset.customRemove);
    if(!Number.isInteger(index)||index<0||index>=links.length)return;
    links.splice(index,1);
    if(!writeLinks(links)){
      const error=document.querySelector('[data-custom-error]');
      if(error)error.textContent='This link could not be removed from this device.';
      return;
    }
    render();
  });

  addEventListener('storage',event=>{
    if(event.key===STORAGE_KEY||event.key===SYNC_STORAGE_KEY||LEGACY_STORAGE_RE.test(String(event.key||'')))render();
  });
  addEventListener('titans:account',()=>queueMicrotask(render));
  addEventListener('titans:preferences-synced',()=>{adoptSyncedLinks();queueMicrotask(render)});
  addEventListener('titans:preferences-imported',()=>{adoptSyncedLinks();queueMicrotask(render)});
  addEventListener('titans:preferences-reset',()=>{try{localStorage.removeItem(STORAGE_KEY)}catch{};queueMicrotask(render)});
  addEventListener('hashchange',()=>setTimeout(render,0));
  const app=document.querySelector('#app');
  if(app)new MutationObserver(()=>{if(route()==='media')queueMicrotask(render)}).observe(app,{childList:true});
  render();
})();
