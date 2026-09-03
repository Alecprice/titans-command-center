import './media-affiliates-v14.js';

(() => {
  'use strict';
  const app=document.querySelector('#app');
  const TERMS=/\b(?:listen|watch|radio|affiliate|station|stream|streaming|tv|television|broadcast|kickoff|am|fm|call sign|104\.5|wgfx|where to watch|where to listen)\b/i;
  const RADIO_CALLSIGN=/\b[WK][A-Z]{3}\b/;
  const RADIO_FREQUENCY=/\b(?:\d{3,4}\s*(?:AM|FM)|\d{2,3}\.\d\s*(?:AM|FM)?)\b/i;
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const params=()=>new URLSearchParams(location.hash.split('?')[1]||'');
  const query=()=>params().get('q')||'';
  const mediaIntent=value=>TERMS.test(value)||RADIO_CALLSIGN.test(value)||RADIO_FREQUENCY.test(value);
  const affiliateHandoff=value=>{
    const source=String(value||'');
    const call=source.match(RADIO_CALLSIGN)?.[0];
    if(call)return call;
    const frequency=source.match(RADIO_FREQUENCY)?.[0];
    return frequency?frequency.trim().toUpperCase():'';
  };
  function consumeAffiliateHandoff(){
    const next=params();
    if(!next.has('affiliate'))return;
    next.delete('affiliate');
    const rest=next.toString();
    history.replaceState(null,'',`#media${rest?`?${rest}`:''}`);
  }
  function applyAffiliateHandoff(){
    if(route()!=='media')return false;
    const requested=affiliateHandoff(params().get('affiliate')||'');
    if(!requested)return false;
    const input=app?.querySelector('[data-affiliate-search-input]');
    const details=input?.closest('.media-affiliate-finder');
    if(!input||!details)return false;
    if(details.dataset.searchHandoff===requested){consumeAffiliateHandoff();return true}
    details.open=true;
    input.value=requested;
    details.dataset.searchHandoff=requested;
    input.dispatchEvent(new Event('input',{bubbles:true}));
    consumeAffiliateHandoff();
    return true;
  }
  function enhance(){
    if(route()==='media'){applyAffiliateHandoff();return}
    const value=query();
    if(route()!=='search'||!mediaIntent(value))return;
    const links=app?.querySelector('.search-route-links');
    if(!links||links.querySelector('[data-media-search-link]'))return;
    const a=document.createElement('a');
    a.href='#media';
    const handoff=affiliateHandoff(value);
    if(handoff)a.href=`#media?affiliate=${encodeURIComponent(handoff)}`;
    a.dataset.mediaSearchLink='1';
    a.innerHTML='Listen / Watch<span aria-hidden="true">→</span>';
    links.prepend(a);
  }
  window.addEventListener('hashchange',()=>setTimeout(enhance,30));
  if(app)new MutationObserver(()=>queueMicrotask(enhance)).observe(app,{childList:true,subtree:true});
  setTimeout(enhance,80);
})();