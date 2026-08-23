import {formatAmerican,americanToImplied} from './src/odds.mjs';
const mhEsc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mhRoute=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
const validDate=v=>{if(!v)return null;const d=new Date(v);return Number.isNaN(d.getTime())?null:d};
const dt=v=>{const d=validDate(v);return d?new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'America/Chicago',timeZoneName:'short'}).format(d):'Time unavailable'};
const age=v=>{const d=validDate(v);if(!d)return'Unknown';const m=Math.max(0,Math.round((Date.now()-d.getTime())/60000));return m<2?'Just now':m<60?`${m} min ago`:m<1440?`${Math.round(m/60)} hr ago`:`${Math.round(m/1440)} day${Math.round(m/1440)===1?'':'s'} ago`};
const safeUrl=v=>{try{const u=new URL(String(v||''),location.origin);return ['http:','https:'].includes(u.protocol)?u.href:''}catch{return''}};
const eventId=e=>String(e?.id??e?.eventId??e?.key??'');
const rowEventId=r=>String(r?.providerEventId??r?.eventId??'');
const eventName=e=>{if(!e)return'';if(e.name||e.eventName)return String(e.name||e.eventName);const away=e.away_team??e.awayTeam??e.away,home=e.home_team??e.homeTeam??e.home;return away&&home?`${away} at ${home}`:String(home||away||'')};
const eventDate=e=>validDate(e?.commence_time??e?.commenceTime??e?.date);
const eventWhen=e=>e?.live?'Live':String(e?.status||dt(e?.commence_time??e?.commenceTime??e?.date));
const bookKey=r=>String(r?.bookId||r?.book||r?.provider||'Unknown');
let marketRequestSerial=0;
const marketUi={showAlt:false,book:'all',category:'all',event:'all'};

function row(r,eventMap){
  const implied=americanToImplied(r.price),ref=r.reference?'<em class="mh-ref">DATED</em>':'',alt=r.alt?'<em class="mh-alt">ALT</em>':'';
  const event=eventMap.get(rowEventId(r));
  const title=r.category==='player_prop'&&r.entityName?`${r.entityName} · ${r.marketName||'Player prop'}`:r.eventName||eventName(event)||r.marketName||'Titans market';
  const book=String(r.book||r.provider||'Source'),deeplink=safeUrl(r.deeplink),bookMarkup=deeplink?`<a class="mh-book-link" href="${mhEsc(deeplink)}" target="_blank" rel="noopener noreferrer">${mhEsc(book)} ↗</a>`:mhEsc(book);
  return `<div class="mh-row${r.alt?' is-alt':''}"><div><strong>${mhEsc(title)} ${ref}${alt}</strong><small>${mhEsc(r.marketName||'')} · ${bookMarkup}</small></div><div><small>Side</small><b>${mhEsc(r.side||'—')}</b></div><div><small>Line</small><b>${mhEsc(r.line??'—')}</b></div><div><small>Price</small><b>${r.price==null?'—':formatAmerican(r.price)}</b></div><div><small>Implied</small><b>${implied==null?'—':(implied*100).toFixed(1)+'%'}</b></div></div>`;
}
function links(sources){return (sources||[]).map(s=>{const url=safeUrl(s.url);return url?`<a href="${mhEsc(url)}" target="_blank" rel="noopener noreferrer">${mhEsc(s.label||'Source')} ↗</a>`:''}).join('')}
function quality(d){const q=d.quality||'';if(q==='live-provider')return['Live','good'];if(q==='live-keyless')return['Live','good'];if(q==='published-reference')return['Published reference','warn'];return['Unavailable','bad']}
function sortedMarketRows(items,eventMap){return [...items].sort((a,b)=>{const ae=eventMap.get(rowEventId(a)),be=eventMap.get(rowEventId(b)),at=eventDate(ae)?.getTime()??Number.MAX_SAFE_INTEGER,bt=eventDate(be)?.getTime()??Number.MAX_SAFE_INTEGER;if(at!==bt)return at-bt;const an=eventName(ae)||a.eventName||'',bn=eventName(be)||b.eventName||'';return an.localeCompare(bn)||String(a.side||'').localeCompare(String(b.side||''))||(Number(a.line??0)-Number(b.line??0))||String(a.book||'').localeCompare(String(b.book||''))||(Number(b.price??0)-Number(a.price??0));})}
function marketGroups(rows,eventMap){const order=['Spread','Moneyline','Total'];const groups=new Map();for(const r of rows||[]){const key=r.marketName||'Other';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r)}return [...groups].sort((a,b)=>{const ai=order.indexOf(a[0]),bi=order.indexOf(b[0]);return (ai<0?99:ai)-(bi<0?99:bi)||a[0].localeCompare(b[0])}).map(([name,items])=>{const sorted=sortedMarketRows(items,eventMap);return `<section class="mh-market-group"><header><strong>${mhEsc(name)}</strong><span>${sorted.length} line${sorted.length===1?'':'s'}</span></header><div>${sorted.map(item=>row(item,eventMap)).join('')}</div></section>`}).join('')}
function errorMarkup(message){return `<section class="mh-error" role="alert"><strong>Market data could not refresh.</strong><span>${mhEsc(message||'Try again in a moment. Any already-loaded lines were left in place.')}</span><button type="button" class="button primary" id="mh-retry">Try again</button></section>`}
function availableBooks(rows){const map=new Map();for(const r of rows||[]){const key=bookKey(r),label=String(r.book||r.provider||key);if(!map.has(key))map.set(key,label)}return [...map].sort((a,b)=>a[1].localeCompare(b[1]))}
function availableEvents(d){const rowIds=new Set((d.odds||[]).map(rowEventId).filter(Boolean));return (d.events||[]).map(e=>[eventId(e),eventName(e)||'Titans event',eventWhen(e)]).filter(([id])=>id&&(!rowIds.size||rowIds.has(id)))}
function filteredRows(d){return (d.odds||[]).filter(r=>(marketUi.showAlt||!r.alt)&&(marketUi.book==='all'||bookKey(r)===marketUi.book)&&(marketUi.category==='all'||r.category===marketUi.category)&&(marketUi.event==='all'||rowEventId(r)===marketUi.event))}
function controls(d,shown){
  const rows=d.odds||[],books=availableBooks(rows),events=availableEvents(d),altCount=rows.filter(r=>r.alt).length,hasProps=rows.some(r=>r.category==='player_prop');
  if(!rows.length)return'';
  const eventOptions=[`<option value="all">All Titans games</option>`,...events.map(([id,name,when])=>`<option value="${mhEsc(id)}"${marketUi.event===id?' selected':''}>${mhEsc(`${name} · ${when}`)}</option>`)].join('');
  const bookOptions=[`<option value="all">All sportsbooks</option>`,...books.map(([key,label])=>`<option value="${mhEsc(key)}"${marketUi.book===key?' selected':''}>${mhEsc(label)}</option>`)].join('');
  const categoryOptions=[['all','All markets'],['game_line','Game lines'],...(hasProps?[['player_prop','Player props']]:[])].map(([value,label])=>`<option value="${value}"${marketUi.category===value?' selected':''}>${label}</option>`).join('');
  return `<div class="mh-controls" aria-label="Market filters">${events.length?`<label>Game<select id="mh-event-filter">${eventOptions}</select></label>`:''}<label>Sportsbook<select id="mh-book-filter">${bookOptions}</select></label><label>Market type<select id="mh-category-filter">${categoryOptions}</select></label><button type="button" class="button secondary" id="mh-alt-toggle" aria-pressed="${marketUi.showAlt?'true':'false'}"${altCount?'':' disabled'}>${marketUi.showAlt?'Hide':'Show'} alternate lines${altCount?` (${altCount})`:''}</button><span class="mh-results" role="status">Showing <b>${shown.length}</b> of <b>${rows.length}</b> rows</span></div>`;
}
function normalizeSelection(d){const rows=d.odds||[],books=new Set(availableBooks(rows).map(([key])=>key)),events=new Set(availableEvents(d).map(([id])=>id));if(marketUi.book!=='all'&&!books.has(marketUi.book))marketUi.book='all';if(marketUi.event!=='all'&&!events.has(marketUi.event))marketUi.event='all';if(marketUi.category==='player_prop'&&!rows.some(r=>r.category==='player_prop'))marketUi.category='all'}
function bindControls(app,d,hub){
  hub.querySelector('#mh-refresh')?.addEventListener('click',()=>loadMarket(true));
  hub.querySelector('#mh-event-filter')?.addEventListener('change',event=>{marketUi.event=event.target.value;renderMarket(app,d)});
  hub.querySelector('#mh-book-filter')?.addEventListener('change',event=>{marketUi.book=event.target.value;renderMarket(app,d)});
  hub.querySelector('#mh-category-filter')?.addEventListener('change',event=>{marketUi.category=event.target.value;renderMarket(app,d)});
  hub.querySelector('#mh-alt-toggle')?.addEventListener('click',()=>{marketUi.showAlt=!marketUi.showAlt;renderMarket(app,d)});
}
function renderMarket(app,d){
  normalizeSelection(d);
  const existingHead=app.querySelector('.page-head'),eventMap=new Map((d.events||[]).map(e=>[eventId(e),e])),shown=filteredRows(d),[qualityLabel,qualityTone]=quality(d),isRef=/reference/.test(d.sourceMode||''),title=isRef?'Published Titans line reference':d.quality==='unavailable'?'Titans market status':'Live Titans market board';
  app.innerHTML='';if(existingHead)app.append(existingHead);
  const hub=document.createElement('section');hub.className='market-hub';
  const eventMarkup=(d.events||[]).map(e=>{const name=eventName(e)||'Titans event',when=eventWhen(e);return `<span><b>${mhEsc(name)}</b><small>${mhEsc(when)}</small></span>`}).join('');
  hub.innerHTML=`<div class="mh-head"><div><small>Odds & props</small><h2>${title}</h2><p>${mhEsc(d.message||'Market data refresh completed.')}</p></div><button id="mh-refresh" type="button" class="button primary">Refresh board</button></div><div class="mh-status"><span><b>${mhEsc(d.provider||'No source')}</b> source</span><span><b>${(d.odds||[]).length}</b> market rows</span><span><b>${d.propsAvailable?'Available':'Not supplied'}</b> player props</span><span class="${qualityTone}"><b>${mhEsc(qualityLabel)}</b> freshness</span><span><b>${mhEsc(age(d.fetchedAt))}</b> checked</span>${d.referencePublishedAt?`<span><b>${mhEsc(dt(d.referencePublishedAt))}</b> published</span>`:''}</div>${eventMarkup?`<div class="mh-events">${eventMarkup}</div>`:''}${d.referenceNotice?`<div class="mh-reference-notice"><strong>Published reference — not live odds.</strong><span>${mhEsc(d.referenceNotice)}</span>${d.referenceExpiresAt?`<em>Hidden automatically at kickoff: ${mhEsc(dt(d.referenceExpiresAt))}</em>`:''}${links(d.sources)}</div>`:''}${controls(d,shown)}<div class="mh-table">${marketGroups(shown,eventMap)||'<div class="mh-empty">No market rows match these filters. Try another game or sportsbook, show alternate lines, or switch the market type.</div>'}</div>${(d.diagnostics||[]).length?`<details class="mh-diagnostics"><summary>Technical details</summary><p>${d.diagnostics.map(mhEsc).join(' · ')}</p></details>`:''}<div class="mh-note">Use the freshness and source labels above to judge each line. Provider checks are quota-aware and may reuse a recent server response. Alternate lines are hidden by default to keep the board readable. Player props are shown only when a real source supplies them. This section is informational only.</div>`;
  app.append(hub);bindControls(app,d,hub);
}
async function loadMarket(force=false){
  if(mhRoute()!=='markets')return;
  const app=document.querySelector('#app');
  if(!app||app.dataset.marketHub==='loading'||(!force&&app.querySelector('.market-hub')))return;
  const requestId=++marketRequestSerial;
  app.dataset.marketHub='loading';app.setAttribute('aria-busy','true');
  const existing=app.querySelector('.market-hub'),button=existing?.querySelector('#mh-refresh');if(button){button.disabled=true;button.textContent='Refreshing…'}
  app.querySelector('.mh-error')?.remove();
  try{
    const r=await fetch('/api/market-data',{cache:force?'no-store':'default',headers:{Accept:'application/json'}}),d=await r.json();
    if(requestId!==marketRequestSerial||mhRoute()!=='markets')return;
    if(!r.ok||!d.ok)throw new Error(d.error||'Market source unavailable');
    renderMarket(app,d);
  }catch(e){
    if(requestId!==marketRequestSerial||mhRoute()!=='markets')return;
    if(existing&&button){button.disabled=false;button.textContent='Refresh board'}
    if(!app.querySelector('.mh-error'))app.insertAdjacentHTML('beforeend',errorMarkup(e.message));
    app.querySelector('#mh-retry')?.addEventListener('click',()=>{delete app.dataset.marketHub;loadMarket(true)},{once:true});
  }finally{
    if(requestId===marketRequestSerial){delete app.dataset.marketHub;app.removeAttribute('aria-busy')}
  }
}
const mhRoot=document.querySelector('#app');if(mhRoot)new MutationObserver(()=>queueMicrotask(()=>loadMarket(false))).observe(mhRoot,{childList:true});
addEventListener('hashchange',()=>{marketRequestSerial++;marketUi.showAlt=false;marketUi.book='all';marketUi.category='all';marketUi.event='all';const app=document.querySelector('#app');if(app){delete app.dataset.marketHub;app.removeAttribute('aria-busy')}queueMicrotask(()=>loadMarket(false))});
queueMicrotask(()=>loadMarket(false));
