(() => {
  'use strict';
  const sidebar=document.querySelector('#sidebar');
  const dock=document.querySelector('.mobile-nav');
  if(!sidebar||!dock)return;
  const phone=matchMedia('(max-width:760px)');
  let drag=null;

  function resetDrag(){
    sidebar.style.removeProperty('--pwa-sheet-drag');
    sidebar.classList.remove('dragging');
    drag=null;
  }
  function closeSheet(){
    sidebar.classList.remove('open');
    resetDrag();
  }
  function pointerDown(event){
    if(!phone.matches||!sidebar.classList.contains('open')||event.pointerType==='mouse'&&event.button!==0)return;
    drag={id:event.pointerId,y:event.clientY,last:event.clientY,started:performance.now()};
    sidebar.classList.add('dragging');
    try{sidebar.setPointerCapture(event.pointerId)}catch{}
  }
  function pointerMove(event){
    if(!drag||event.pointerId!==drag.id)return;
    const dy=Math.max(0,event.clientY-drag.y);drag.last=event.clientY;
    sidebar.style.setProperty('--pwa-sheet-drag',`${Math.min(dy,180)}px`);
    if(dy>8)event.preventDefault();
  }
  function pointerEnd(event){
    if(!drag||event.pointerId!==drag.id)return;
    const dy=Math.max(0,drag.last-drag.y),elapsed=Math.max(1,performance.now()-drag.started),velocity=dy/elapsed;
    if(dy>=72||velocity>.55)closeSheet();else resetDrag();
  }
  function syncViewport(){
    const h=Math.round(window.visualViewport?.height||innerHeight);
    document.documentElement.style.setProperty('--pwa-viewport-h',`${h}px`);
  }

  sidebar.addEventListener('pointerdown',pointerDown);
  sidebar.addEventListener('pointermove',pointerMove,{passive:false});
  sidebar.addEventListener('pointerup',pointerEnd);
  sidebar.addEventListener('pointercancel',resetDrag);
  phone.addEventListener?.('change',()=>{if(!phone.matches)resetDrag();syncViewport();});
  window.visualViewport?.addEventListener('resize',syncViewport,{passive:true});
  addEventListener('resize',syncViewport,{passive:true});
  syncViewport();
})();
