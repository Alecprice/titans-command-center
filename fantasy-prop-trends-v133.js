(() => {
  'use strict';
  const ROUTE='fantasy',ROOT='#fantasy-live-props-v122',STORE='titans-fantasy-prop-observations-v1',MAX_KEYS=120,MAX_POINTS=8,MIN_CAPTURE_MS=120000;
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const safeJson=(raw,fallback)=>{try{return JSON.parse(raw)}catch{return fallback}};
  const load=()=>{try{const parsed=safeJson(localStorage.getItem(STORE),{});return parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{}}catch{return {}}};
  const save=value=>{try{localStorage.setItem(STORE,JSON.stringify(value))}catch{}};
  const clean=value=>String(value??'').trim();
  const slug=value=>clean(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const num=value=>{const n=Number(String(value??'').replace(/,/g,''));return Number.isFinite(n)?n:null};
  const now=()=>Date.now();

  function observationKey(player,market,book){return `${slug(player)}|${slug(market)}|${slug(book)}`}
  function prune(store){
    const entries=Object.entries(store).map(([key,points])=>[key,Array.isArray(points)?points.slice(-MAX_POINTS):[]]).filter(([,points])=>points.length);
    entries.sort((a,b)=>(b[1].at(-1)?.at||0)-(a[1].at(-1)?.at||0));
    return Object.fromEntries(entries.slice(0,MAX_KEYS));
  }
  function priorPoint(points,current){
    if(!Array.isArray(points)||!points.length)return null;
    for(let i=points.length-1;i>=0;i--){const point=points[i];if(point.line!==current.line)return point}
    return points.length>1?points[points.length-2]:null;
  }
  function movement(previous,current){
    if(!previous||previous.line==null||current.line==null)return {kind:'first',label:'First observed',delta:null};
    const delta=Number((current.line-previous.line).toFixed(2));
    if(delta===0)return {kind:'flat',label:'No line change',delta:0};
    return {kind:delta>0?'up':'down',label:`Line ${delta>0?'up':'down'} ${Math.abs(delta)}`,delta};
  }
  function ensureSummary(root){
    let summary=root.querySelector('.fprop-trend-summary');
    if(summary)return summary;
    summary=document.createElement('div');summary.className='fprop-trend-summary';summary.setAttribute('aria-live','polite');
    const controls=root.querySelector('.fprop-controls');
    (controls||root.querySelector('.fprop-board'))?.insertAdjacentElement('beforebegin',summary);
    return summary;
  }
  function decorate(){
    if(route()!==ROUTE)return;
    const root=document.querySelector(ROOT);if(!root)return;
    const store=load(),seen=[],counts={up:0,down:0,flat:0,first:0};
    root.querySelectorAll('.fprop-row').forEach(row=>{
      const player=clean(row.querySelector('.fprop-player strong')?.textContent),market=clean(row.querySelector('.fprop-player span')?.textContent);
      if(!player||!market)return;
      row.querySelectorAll('.fprop-quote:not(.is-empty)').forEach(quote=>{
        const book=clean(quote.querySelector(':scope > strong')?.textContent),line=num(quote.querySelector('.fprop-line b')?.textContent);
        if(!book||line==null)return;
        const key=observationKey(player,market,book),points=Array.isArray(store[key])?store[key]:[],current={line,at:now()};
        const previous=priorPoint(points,current),move=movement(previous,current);counts[move.kind]++;
        let badge=quote.querySelector('.fprop-trend-badge');
        if(!badge){badge=document.createElement('span');badge.className='fprop-trend-badge';quote.appendChild(badge)}
        badge.className=`fprop-trend-badge is-${move.kind}`;
        badge.textContent=move.label;
        badge.title=previous?`This browser previously observed ${previous.line}`:'No earlier different line is stored in this browser';
        const last=points.at(-1),shouldCapture=!last||last.line!==line||current.at-(last.at||0)>=MIN_CAPTURE_MS;
        if(shouldCapture){store[key]=[...points,current].slice(-MAX_POINTS)}
        seen.push(key);
      });
    });
    save(prune(store));
    const summary=ensureSummary(root);if(!summary)return;
    const changed=counts.up+counts.down;
    summary.innerHTML=`<div><strong>${changed}</strong><span>lines moved in this browser</span></div><div><b>${counts.up}</b><span>up</span></div><div><b>${counts.down}</b><span>down</span></div><div><b>${counts.first}</b><span>first observed</span></div><button type="button" class="fprop-trend-reset">Reset line memory</button>`;
    summary.querySelector('.fprop-trend-reset')?.addEventListener('click',()=>{try{localStorage.removeItem(STORE)}catch{};decorate()},{once:true});
  }
  let queued=false;
  const queue=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;decorate()})};
  const app=document.querySelector('#app');
  const observer=new MutationObserver(queue);if(app)observer.observe(app,{childList:true,subtree:true});
  addEventListener('hashchange',queue);queue();
  window.TitansFantasyPropTrends={movement,observationKey,prune};
})();
