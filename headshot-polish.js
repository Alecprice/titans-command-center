const hsNormalize=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\b(jr|sr|ii|iii|iv|v)\b/g,'').replace(/[^a-z0-9]+/g,'');
const hsAllowedHosts=new Set(['static.clubs.nfl.com','static.www.nfl.com','static.nfl.com','a.espncdn.com','a1.espncdn.com']);
const hsSafeUrl=value=>{try{const url=new URL(String(value||''));return url.protocol==='https:'&&hsAllowedHosts.has(url.hostname)?url.href:''}catch{return''}};
let hsManifestPromise=null;
const hsObserved=new WeakSet();

async function hsManifest(){
  if(!hsManifestPromise)hsManifestPromise=fetch('/assets/data/player-headshots.json',{cache:'no-store',headers:{Accept:'application/json'}})
    .then(response=>response.ok?response.json():Promise.reject(new Error(`Headshot manifest ${response.status}`)))
    .then(data=>{
      const byName=new Map();
      for(const player of data.players||[]){
        const url=hsSafeUrl(player.headshotUrl);if(!url)continue;
        const row={...player,headshotUrl:url};
        const key=player.normalizedName||hsNormalize(player.name);if(key)byName.set(key,row);
      }
      return {data,byName};
    }).catch(error=>{console.warn('[player-headshots]',error.message);return {data:null,byName:new Map()}});
  return hsManifestPromise;
}

function hsImage(name,row,loading='lazy'){
  const image=document.createElement('img');
  image.src=row.headshotUrl;image.alt=`${name} headshot`;image.loading=loading;image.decoding='async';image.referrerPolicy='no-referrer';
  image.dataset.headshotSource=row.source||'nflverse roster headshot';
  return image;
}

function hsApplyMedia(media,name,row,{hero=false}={}){
  if(!media||media.dataset.headshotApplied==='true')return;
  media.dataset.headshotApplied='true';
  const number=media.textContent.trim();
  const image=hsImage(name,row,hero?'eager':'lazy');
  const numberBadge=document.createElement('span');numberBadge.className='player-photo-number';numberBadge.textContent=number;
  media.textContent='';media.classList.add('has-headshot');media.append(image,numberBadge);
  image.addEventListener('error',()=>{media.classList.remove('has-headshot');media.textContent=number;media.removeAttribute('data-headshot-applied')},{once:true});
}

async function hsDecorate(){
  const {byName}=await hsManifest();if(!byName.size)return;
  document.querySelectorAll('.player-card').forEach(card=>{
    const name=card.querySelector('h3')?.textContent?.trim()||'';const row=byName.get(hsNormalize(name));
    if(row)hsApplyMedia(card.querySelector('.jersey'),name,row);
  });
  document.querySelectorAll('.ps-player').forEach(card=>{
    const name=card.querySelector('.ps-player-id strong')?.textContent?.trim()||'';const row=byName.get(hsNormalize(name));
    if(row)hsApplyMedia(card.querySelector('.ps-number'),name,row);
  });
  const hero=document.querySelector('.player-profile-rich .player-rich-hero');
  if(hero){
    const name=hero.querySelector('.player-rich-copy h1')?.textContent?.trim()||'';const row=byName.get(hsNormalize(name));
    if(row){
      hsApplyMedia(hero.querySelector('.player-rich-number'),name,row,{hero:true});
      const copy=hero.querySelector('.player-rich-copy');
      if(copy&&!copy.querySelector('.player-photo-credit'))copy.insertAdjacentHTML('beforeend','<div class="player-photo-credit">Player photo · NFL roster headshot via nflverse</div>');
    }
  }
  hsAttachTargetObservers();
}

function hsObserve(target){
  if(!target||hsObserved.has(target))return;hsObserved.add(target);
  new MutationObserver(()=>queueMicrotask(hsDecorate)).observe(target,{childList:true});
}
function hsAttachTargetObservers(){hsObserve(document.querySelector('#rg'));hsObserve(document.querySelector('#ps-roster-wrap'));}

const hsApp=document.querySelector('#app');
if(hsApp)new MutationObserver(()=>queueMicrotask(hsDecorate)).observe(hsApp,{childList:true});
addEventListener('hashchange',()=>queueMicrotask(hsDecorate));
queueMicrotask(hsDecorate);
