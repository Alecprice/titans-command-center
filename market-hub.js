import {formatAmerican,americanToImplied} from './src/odds.mjs';
const mhEsc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mhRoute=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
const validDate=v=>{if(!v)return null;const d=new Date(v);return Number.isNaN(d.getTime())?null:d};
const dt=v=>{const d=validDate(v);return d?new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'America/Chicago'}).format(d):'Time unavailable'};
const age=v=>{const d=validDate(v);if(!d)return'Unknown';const m=Math.max(0,Math.round((Date.now()-d.getTime())/60000));return m<2?'Just now':m<60?`${m} min ago`:m<1440?`${Math.round(m/60)} hr ago`:`${Math.round(m/1440)} day${Math.round(m/1440)===1?'':'s'} ago`};
const safeUrl=v=>{try{const u=new URL(String(v||''),location.origin);return ['http:','https:'].includes(u.protocol)?u.href:''}catch{return''}};
let marketRequestSerial=0;
function row(r){const implied=americanToImplied(r.price),ref=r.reference?'<em class="mh-ref">DATED</em>':'';return `<div class="mh-row"><div><strong>${mhEsc(r.eventName||r.marketName||'Titans market')} ${ref}</strong><small>${mhEsc(r.marketName||'')} · ${mhEsc(r.book||r.provider||'')}</small></div><div><small>Side</small><b>${mhEsc(r.side||'—')}</b></div><div><small>Line</small><b>${mhEsc(r.line??'—')}</b></div><div><small>Price</small><b>${r.price==null?'—':formatAmerican(r.price)}</b></div><div><small>Implied</small><b>${implied==null?'—':(implied*100).toFixed(1)+'%'}</b></div></div>`}
function links(sources){return (sources||[]).map(s=>{const url=safeUrl(s.url);return url?`<a href="${mhEsc(url)}" target="_blank" rel="noopener noreferrer">${mhEsc(s.label||'Source')} ↗</a>`:''}).join('')}
function quality(d){const q=d.quality||'';if(q==='live-provider')return['Live','good'];if(q==='live-keyless')return['Live','good'];if(q==='published-reference')return['Published reference','warn'];return['Unavailable','bad']}
function marketGroups(rows){const order=['Spread','Moneyline','Total'];const groups=new Map();for(const r of rows||[]){const key=r.marketName||'Other';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r)}return [...groups].sort((a,b)=>{const ai=order.indexOf(a[0]),bi=order.indexOf(b[0]);return (ai<0?99:ai)-(bi<0?99:bi)||a[0].localeCompare(b[0])}).map(([name,items])=>`<section class="mh-market-group"><header><strong>${mhEsc(name)}</strong><span>${items.length} line${items.length===1?'':'s'}</span></header><div>${items.map(row).join('')}</div></section>`).join('')}
function errorMarkup(message){return `<section class="mh-error" role="alert"><strong>Market data could not refresh.</strong><span>${mhEsc(message||'Try again in a moment. Any already-loaded lines were left in place.')}</span><button type="button" class="button primary" id="mh-retry">Try again</button></section>`}
async function loadMarket(force=false){
  if(mhRoute()!=='markets')return;
  const app=document.querySelector('#app');
  if(!app||app.dataset.marketHub==='loading'||(!force&&app.querySelector('.market-hub')))return;
  const requestId=++marketRequestSerial;
  app.dataset.marketHub='loading';
  app.setAttribute('aria-busy','true');
  const existing=app.querySelector('.market-hub'),button=existing?.querySelector('#mh-refresh');if(button){button.disabled=true;button.textContent='Refreshing…'}
  app.querySelector('.mh-error')?.remove();
  try{
    const url=force?`/api/market-data?refresh=${Date.now()}`:'/api/market-data',r=await fetch(url,{cache:force?'no-store':'default',headers:{Accept:'application/json'}}),d=await r.json();
    if(requestId!==marketRequestSerial||mhRoute()!=='markets')return;
    if(!r.ok||!d.ok)throw new Error(d.error||'Market source unavailable');
    const head=app.querySelector('.page-head');app.innerHTML='';if(head)app.append(head);
    const hub=document.createElement('section');hub.className='market-hub';const [qualityLabel,qualityTone]=quality(d),isRef=/reference/.test(d.sourceMode||''),title=isRef?'Published Titans line reference':d.quality==='unavailable'?'Titans market status':'Live Titans market board';hub.innerHTML=`<div class="mh-head"><div><small>Odds & props</small><h2>${title}</h2><p>${mhEsc(d.message||'Market data refresh completed.')}</p></div><button id="mh-refresh" type="button" class="button primary">Refresh odds</button></div><div class="mh-status"><span><b>${mhEsc(d.provider||'No source')}</b> source</span><span><b>${(d.odds||[]).length}</b> market rows</span><span><b>${d.propsAvailable?'Available':'Not supplied'}</b> player props</span><span class="${qualityTone}"><b>${mhEsc(qualityLabel)}</b> freshness</span><span><b>${mhEsc(age(d.fetchedAt))}</b> checked</span>${d.referencePublishedAt?`<span><b>${mhEsc(dt(d.referencePublishedAt))}</b> published</span>`:''}</div>${(d.events||[]).length?`<div class="mh-events">${d.events.map(e=>`<span>${mhEsc(e.name)} · ${mhEsc(e.status||dt(e.date))}</span>`).join('')}</div>`:''}${d.referenceNotice?`<div class="mh-reference-notice"><strong>Published reference — not live odds.</strong><span>${mhEsc(d.referenceNotice)}</span>${d.referenceExpiresAt?`<em>Hidden automatically at kickoff: ${mhEsc(dt(d.referenceExpiresAt))}</em>`:''}${links(d.sources)}</div>`:''}<div class="mh-table">${marketGroups(d.odds)||'<div class="mh-empty">No verified market rows are available right now. Expired lines stay hidden instead of being shown as current.</div>'}</div>${(d.diagnostics||[]).length?`<details class="mh-diagnostics"><summary>Technical details</summary><p>${d.diagnostics.map(mhEsc).join(' · ')}</p></details>`:''}<div class="mh-note">Use the freshness and source labels above to judge each line. Published reference lines are clearly marked and disappear at kickoff. Player props are shown only when a real source supplies them. This section is informational only.</div>`;app.append(hub);hub.querySelector('#mh-refresh')?.addEventListener('click',()=>loadMarket(true));
  }catch(e){
    if(requestId!==marketRequestSerial||mhRoute()!=='markets')return;
    if(existing&&button){button.disabled=false;button.textContent='Refresh odds'}
    if(!app.querySelector('.mh-error'))app.insertAdjacentHTML('beforeend',errorMarkup(e.message));
    app.querySelector('#mh-retry')?.addEventListener('click',()=>{delete app.dataset.marketHub;loadMarket(true)},{once:true});
  }finally{
    if(requestId===marketRequestSerial){delete app.dataset.marketHub;app.removeAttribute('aria-busy');}
  }
}
const mhRoot=document.querySelector('#app');if(mhRoot)new MutationObserver(()=>queueMicrotask(()=>loadMarket(false))).observe(mhRoot,{childList:true});
addEventListener('hashchange',()=>{marketRequestSerial++;const app=document.querySelector('#app');if(app){delete app.dataset.marketHub;app.removeAttribute('aria-busy');}queueMicrotask(()=>loadMarket(false))});
queueMicrotask(()=>loadMarket(false));
