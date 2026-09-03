(() => {
  'use strict';

  const isIOS=()=>/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;

  function ensureStyles(){
    if(document.querySelector('#ios-home-screen-styles'))return;
    const style=document.createElement('style');
    style.id='ios-home-screen-styles';
    style.textContent=`
      #ios-home-screen-guide .ios-home-screen-intro{margin:0 0 16px;color:var(--muted,#64748b);line-height:1.55}
      #ios-home-screen-guide .ios-home-screen-steps{list-style:none;margin:0;padding:0;display:grid;gap:12px}
      #ios-home-screen-guide .ios-home-screen-steps li{display:grid;grid-template-columns:42px 1fr;gap:12px;align-items:start;padding:14px;border:1px solid rgba(148,163,184,.25);border-radius:14px;background:rgba(148,163,184,.08)}
      #ios-home-screen-guide .ios-step-number{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;font-weight:900;background:#4b92db;color:#fff}
      #ios-home-screen-guide .ios-home-screen-steps strong{display:block;margin-bottom:4px}
      #ios-home-screen-guide .ios-home-screen-steps p{margin:0;line-height:1.45}
      #ios-home-screen-guide .ios-home-screen-note{margin:14px 0 0;padding:12px 14px;border-radius:12px;background:rgba(75,146,219,.12);line-height:1.45}
      #ios-home-screen-guide .ios-home-screen-actions{display:flex;justify-content:flex-end;margin-top:18px}
      @media(max-width:759px){#ios-home-screen-guide section{max-height:calc(100dvh - env(safe-area-inset-top) - 12px)}#ios-home-screen-guide .ios-home-screen-actions .button{width:100%;min-height:48px}}
    `;
    document.head.appendChild(style);
  }

  function closeGuide(){
    document.querySelector('#ios-home-screen-guide')?.remove();
    if(!document.querySelector('.v10-modal'))document.body.classList.remove('v10-modal-open');
  }

  function openGuide(){
    if(isStandalone())return;
    ensureStyles();
    document.querySelector('#ios-home-screen-guide')?.remove();
    const guide=document.createElement('div');
    guide.id='ios-home-screen-guide';
    guide.className='v10-modal';
    guide.innerHTML=`<div class="v10-modal-backdrop" data-ios-close></div><section role="dialog" aria-modal="true" aria-labelledby="ios-home-screen-title"><header><div><small>IPHONE SETUP</small><strong id="ios-home-screen-title">Add Titans Command Center to Home Screen</strong></div><button type="button" data-ios-close aria-label="Close">×</button></header><div class="v10-modal-body"><p class="ios-home-screen-intro">iPhone does not show the same automatic Install button used by desktop and Android browsers. Add it from Safari's Share menu instead.</p><ol class="ios-home-screen-steps"><li><span class="ios-step-number">1</span><div><strong>Open this page in Safari</strong><p>If you are already in Safari, stay here.</p></div></li><li><span class="ios-step-number">2</span><div><strong>Tap Share</strong><p>Tap the square-with-an-up-arrow Share button in Safari.</p></div></li><li><span class="ios-step-number">3</span><div><strong>Choose “Add to Home Screen”</strong><p>Scroll the Share sheet if needed, then tap Add to Home Screen.</p></div></li><li><span class="ios-step-number">4</span><div><strong>Tap “Add”</strong><p>Keep the Titans Command Center name, then tap Add in the upper-right.</p></div></li></ol><p class="ios-home-screen-note"><strong>Using another iPhone browser?</strong> If Add to Home Screen is not offered, open this page in Safari first.</p><div class="ios-home-screen-actions"><button type="button" class="button primary" data-ios-close>Got it</button></div></div></section>`;
    document.body.appendChild(guide);
    document.body.classList.add('v10-modal-open');
    guide.addEventListener('click',event=>{const target=event.target instanceof Element?event.target.closest('[data-ios-close]'):null;if(target)closeGuide()});
    requestAnimationFrame(()=>guide.querySelector('[data-ios-close]')?.focus());
  }

  document.addEventListener('click',event=>{
    if(!isIOS()||isStandalone())return;
    const target=event.target instanceof Element?event.target.closest('[data-onboard-install],#install-button'):null;
    if(!target)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openGuide();
  },true);
})();

// Lightweight fan-experience enhancements that do not need to block the app shell.
import('./roster-practice-squad-v0.js').catch(()=>{});
