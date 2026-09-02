(() => {
  'use strict';
  const app=document.querySelector('#app');
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const AREA_KEY='titans:v14MediaArea';
  let data=null,loading=null,timer=0;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  const storageGet=key=>{try{return localStorage.getItem(key)}catch{return null}};
  const gameTime=g=>{const raw=g?.date;if(raw===null||raw===undefined||String(raw).trim()==='')return NaN;const value=Date.parse(raw);return Number.isFinite(value)?value:NaN};
  const focusedGame=()=>{
    const games=data?.games||[],shared=window.TitansRuntime?.scheduleFocus;
    if(typeof shared==='function'){
      const focus=shared(games,new Date());
      if(focus?.game)return focus.game;
    }
    const now=Date.now(),windowMs=Math.max(0,Number(window.TitansRuntime?.gameFocusWindowMs)||5*60*60*1000);
    const candidates=games.filter(g=>!/final|bye/i.test(String(g.status||''))&&Number.isFinite(gameTime(g))).sort((a,b)=>gameTime(a)-gameTime(b));
    return candidates.find(g=>gameTime(g)<=now&&gameTime(g)>=now-windowMs)||candidates.find(g=>gameTime(g)>now)||null;
  };
  async function load(){
    if(data)return data;
    if(loading)return loading;
    const runtime=window.TitansRuntime;
    loading=(typeof runtime?.apiJson==='function'?runtime.apiJson('/api/data',{ttl:30000}):fetch('/api/data',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)).then(d=>{data=d?.ok===false?null:d;return data}).finally(()=>loading=null);
    return loading;
  }
  const deviceZone=()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC'}catch{return'UTC'}};
  const areaMode=()=>{const saved=storageGet(AREA_KEY)||'nashville';return saved==='outside'?'us':['nashville','us','international'].includes(saved)?saved:'nashville'};
  function zoneParts(value,timeZone){try{const d=new Date(value);if(Number.isNaN(d.getTime()))return{date:'TBD',time:'TBD',code:''};const locale=navigator.language||'en-US';const date=new Intl.DateTimeFormat(locale,{weekday:'short',month:'short',day:'numeric',year:'numeric',timeZone}).format(d);const time=new Intl.DateTimeFormat(locale,{hour:'numeric',minute:'2-digit',timeZoneName:'short',timeZone}).format(d);const code=(time.match(/\b(?:GMT[+-]\d+|[A-Z]{2,5})\b/g)||[]).at(-1)||'';return{date,time,code}}catch{return{date:'TBD',time:'TBD',code:''}}}
  function countdown(value){const then=Date.parse(value),diff=then-Date.now();if(!Number.isFinite(then))return'Time TBD';if(diff<=0)return'Game time';const mins=Math.floor(diff/60000),days=Math.floor(mins/1440),hours=Math.floor((mins%1440)/60),minutes=mins%60;if(days>0)return`${days}d ${hours}h`;if(hours>0)return`${hours}h ${minutes}m`;return`${Math.max(1,minutes)}m`}
  function watchLine(g,area){
    const n=String(g?.network||'').toUpperCase();
    if(area==='international')return`${g?.network||'U.S. network TBD'} is U.S. broadcast context → use NFL International by-country guide / NFL Game Pass provider for your country`;
    if(/CBS/.test(n))return area==='nashville'?'CBS locally → Paramount+ or your local CBS station':'CBS game → Paramount+ if it is your local CBS game; otherwise check Sunday Ticket eligibility';
    if(/FOX/.test(n))return area==='nashville'?'FOX locally → FOX / FOX Sports with supported TV access':'FOX game → local FOX where carried; out-of-market Sunday afternoon games may require NFL Sunday Ticket';
    if(/NBC/.test(n))return'NBC → Peacock / NBC';
    if(/ESPN|ABC/.test(n))return'ESPN / ABC → ESPN watch options';
    if(/PRIME|AMAZON|TNF/.test(n))return'Prime Video → Thursday Night Football';
    if(/NFL NETWORK/.test(n))return'NFL Network → NFL Network / NFL+ according to your plan and device';
    if(/NETFLIX/.test(n))return'Netflix → open Netflix for this NFL game';
    return`${g?.network||'Network TBD'} → open the authorized provider choices below`;
  }
  function listenLine(area){if(area==='nashville')return'Nashville → WGFX 104.5 FM The Zone or the official Titans game-audio page. Titans says LISTEN LIVE appears one hour before kickoff; mobile home-market restrictions apply.';if(area==='international')return'International rights vary → use the NFL by-country guide / Game Pass provider; official Titans audio may be geographically restricted';return'Outside Nashville → NFL+ carries all-game audio; TuneIn Premium, SiriusXM and in-range Titans Radio affiliates are additional licensed options'}
  function gameName(g){if(!g)return'Titans game';return `${g.homeAway==='home'?'Titans vs':'Titans at'} ${g.opponent||g.opponentAbbr||'Opponent'}`}
  function timeRow(label,sub,value,primary=false){return`<div class="media-time-row ${primary?'primary':''}"><div><small>${esc(label)}</small><span>${esc(sub)}</span></div><strong>${esc(value.time)}</strong><em>${esc(value.date)}</em></div>`}
  function stopTimer(){if(timer){clearInterval(timer);timer=0}}
  function updateCountdown(g){if(route()!=='media'){stopTimer();return}if(document.visibilityState==='hidden')return;const el=document.querySelector('[data-media-countdown]');if(el)el.textContent=countdown(g.date);else stopTimer()}
  function renderGuide(){if(route()!=='media'){stopTimer();return}const watch=document.querySelector('.media-watch');if(!watch||watch.querySelector('.media-tune-guide'))return;const g=focusedGame(),area=areaMode();if(!g)return;const localZone=deviceZone(),local=zoneParts(g.date,localZone),et=zoneParts(g.date,'America/New_York'),ct=zoneParts(g.date,'America/Chicago'),utc=zoneParts(g.date,'UTC');const listenTitle=area==='nashville'?'104.5 FM · WGFX':area==='international'?'International options':'Titans live audio';const guide=document.createElement('section');guide.className='media-tune-guide';guide.innerHTML=`<header><div><small>CURRENT / NEXT TITANS BROADCAST</small><h3>${esc(gameName(g))}</h3><p>Kickoff, network and listening guidance stays on the current matchup through the shared game window before advancing.</p></div><div class="media-countdown"><small>STARTS IN</small><strong data-media-countdown>${esc(countdown(g.date))}</strong></div></header><div class="media-time-grid">${timeRow('YOUR TIME',localZone,local,true)}${timeRow('EASTERN TIME','ET · New York',et)}${timeRow('NASHVILLE TIME','CT · Tennessee',ct)}${timeRow('WORLD TIME','UTC',utc)}</div><div class="media-tune-simple"><div><small>WATCH</small><strong>${esc(g.network||'Network TBD')}</strong><span>${esc(watchLine(g,area))}</span></div><div><small>LISTEN</small><strong>${esc(listenTitle)}</strong><span>${esc(listenLine(area))}</span></div></div><p class="media-time-help">Times use your device timezone automatically. ET/CT labels stay familiar while the displayed clock shows the correct daylight code (EDT/CDT) or standard code (EST/CST) for the game date.</p>`;watch.querySelector('header')?.insertAdjacentElement('afterend',guide);stopTimer();timer=setInterval(()=>updateCountdown(g),30000)}
  async function run(){if(route()!=='media'){stopTimer();return}await load();renderGuide()}
  window.addEventListener('hashchange',()=>setTimeout(run,0));
  window.addEventListener('popstate',()=>setTimeout(run,0));
  window.addEventListener('storage',event=>{if(event.key===AREA_KEY&&route()==='media'){document.querySelector('.media-tune-guide')?.remove();run()}});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&route()==='media'){const g=focusedGame();if(g)updateCountdown(g)}});
  if(app)new MutationObserver(()=>queueMicrotask(()=>{if(route()==='media'&&!data)run();else renderGuide()})).observe(app,{childList:true,subtree:false});
  setTimeout(run,80);
})();