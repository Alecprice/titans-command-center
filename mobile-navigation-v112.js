import './account-v112.js';

(() => {
  'use strict';
  if(window.__TitansMobileNavigationV112)return;
  window.__TitansMobileNavigationV112=true;
  const sidebar=document.querySelector('#sidebar');
  const dock=document.querySelector('.mobile-nav');
  const searchButton=document.querySelector('#mobile-search-button');
  const searchInput=document.querySelector('#global-search');
  if(!sidebar||!dock)return;
  const phone=matchMedia('(max-width:760px)');
  let drag=null;

  function resetDrag(){sidebar.style.removeProperty('--pwa-sheet-drag');sidebar.classList.remove('dragging');drag=null;}
  function closeSheet(){sidebar.classList.remove('open');resetDrag();}
  function openSearch(){if(!phone.matches||!searchInput)return;closeSheet();document.body.classList.add('pwa-search-open');requestAnimationFrame(()=>{searchInput.focus({preventScroll:true});try{searchInput.setSelectionRange(searchInput.value.length,searchInput.value.length)}catch{}});}
  function syncSearchState(){const active=document.activeElement===searchInput||searchInput?.getAttribute('aria-expanded')==='true';document.body.classList.toggle('pwa-search-open',Boolean(phone.matches&&active));searchButton?.classList.toggle('active',Boolean(phone.matches&&active));searchButton?.setAttribute('aria-pressed',String(Boolean(phone.matches&&active)));}
  function pointerDown(event){if(!phone.matches||!sidebar.classList.contains('open')||event.pointerType==='mouse'&&event.button!==0)return;drag={id:event.pointerId,y:event.clientY,last:event.clientY,started:performance.now()};sidebar.classList.add('dragging');try{sidebar.setPointerCapture(event.pointerId)}catch{}}
  function pointerMove(event){if(!drag||event.pointerId!==drag.id)return;const dy=Math.max(0,event.clientY-drag.y);drag.last=event.clientY;sidebar.style.setProperty('--pwa-sheet-drag',`${Math.min(dy,180)}px`);if(dy>8)event.preventDefault();}
  function pointerEnd(event){if(!drag||event.pointerId!==drag.id)return;const dy=Math.max(0,drag.last-drag.y),elapsed=Math.max(1,performance.now()-drag.started),velocity=dy/elapsed;if(dy>=72||velocity>.55)closeSheet();else resetDrag();}
  function syncViewport(){const h=Math.round(window.visualViewport?.height||innerHeight);document.documentElement.style.setProperty('--pwa-viewport-h',`${h}px`);}

  sidebar.addEventListener('pointerdown',pointerDown);sidebar.addEventListener('pointermove',pointerMove,{passive:false});sidebar.addEventListener('pointerup',pointerEnd);sidebar.addEventListener('pointercancel',resetDrag);searchButton?.addEventListener('click',openSearch);searchInput?.addEventListener('focus',syncSearchState);searchInput?.addEventListener('blur',()=>setTimeout(syncSearchState,80));searchInput?.addEventListener('input',syncSearchState);addEventListener('hashchange',()=>{closeSheet();document.body.classList.remove('pwa-search-open');searchButton?.classList.remove('active')});document.addEventListener('pointerdown',event=>{if(!phone.matches||!document.body.classList.contains('pwa-search-open'))return;if(event.target.closest?.('.search-wrap')||event.target.closest?.('#mobile-search-button'))return;setTimeout(syncSearchState,0);});phone.addEventListener?.('change',()=>{if(!phone.matches){resetDrag();document.body.classList.remove('pwa-search-open')}syncViewport();});window.visualViewport?.addEventListener('resize',syncViewport,{passive:true});addEventListener('resize',syncViewport,{passive:true});syncViewport();syncSearchState();
})();
