import './media-affiliates-v14.js';

(() => {
  'use strict';
  const app=document.querySelector('#app');
  const TERMS=/\b(?:listen|watch|radio|stream|streaming|tv|television|broadcast|kickoff|104\.5|wgfx|where to watch|where to listen)\b/i;
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const query=()=>new URLSearchParams(location.hash.split('?')[1]||'').get('q')||'';
  function enhance(){
    if(route()!=='search'||!TERMS.test(query()))return;
    const links=app?.querySelector('.search-route-links');
    if(!links||links.querySelector('[data-media-search-link]'))return;
    const a=document.createElement('a');a.href='#media';a.dataset.mediaSearchLink='1';a.innerHTML='Listen / Watch<span aria-hidden="true">→</span>';links.prepend(a);
  }
  window.addEventListener('hashchange',()=>setTimeout(enhance,30));
  if(app)new MutationObserver(()=>queueMicrotask(enhance)).observe(app,{childList:true,subtree:true});
  setTimeout(enhance,80);
})();
