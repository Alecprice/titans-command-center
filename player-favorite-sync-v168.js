(() => {
  'use strict';
  if(window.__TitansPlayerFavoriteSyncV168)return;
  window.__TitansPlayerFavoriteSyncV168=true;

  const PROFILE_KEY='titans:v15MyTitans';
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const slug=value=>String(value??'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const profile=()=>{try{const raw=localStorage.getItem(PROFILE_KEY);return raw?JSON.parse(raw):{}}catch{return{}}};

  function reconcile(){
    if(route()!=='player')return;
    const command=document.querySelector('.v16-player-command');
    const button=command?.querySelector('[data-v16-favorite]');
    const playerName=command?.querySelector('h2')?.textContent?.trim()||'';
    if(!button||!playerName)return;
    const favorite=slug(profile()?.favorite)===slug(playerName);
    button.setAttribute('aria-pressed',String(favorite));
    button.removeAttribute('aria-label');
    button.textContent=favorite?'★ Favorite':'☆ Make favorite';
  }

  const preferenceEvent=event=>{
    const keys=event?.detail?.keys;
    if(Array.isArray(keys)&&!keys.includes(PROFILE_KEY))return;
    reconcile();
  };

  addEventListener('titans:preferences-synced',preferenceEvent);
  addEventListener('titans:preferences-imported',preferenceEvent);
  addEventListener('titans:preferences-reset',reconcile);
  addEventListener('storage',event=>{if(event.key===PROFILE_KEY)reconcile();});
})();
