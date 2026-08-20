const thRoute=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
const thEsc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const thDate=value=>{if(!value)return'TBD';const date=new Date(value);return Number.isNaN(date.getTime())?'TBD':new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(date)};
const thStamp=value=>{if(!value)return'Update time unavailable';const date=new Date(value);return Number.isNaN(date.getTime())?'Update time unavailable':new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(date)};
const thSafeUrl=value=>{try{const url=new URL(String(value||''),location.origin);return ['http:','https:'].includes(url.protocol)?url.href:''}catch{return''}};
let thRequestSerial=0;

function rowMarkup(row){
  const source=thSafeUrl(row.sourceUrl);
  return `<div class="transaction-row" data-txn-type="${thEsc(String(row.type||'transaction').toLowerCase())}" data-txn-search="${thEsc(`${row.description||''} ${row.type||''}`.toLowerCase())}"><div class="transaction-date"><strong>${thDate(row.date)}</strong><small>${thEsc(row.type||'transaction')}</small></div><div><p>${thEsc(row.description||'Titans transaction')}</p>${source?`<a class="transaction-source-link" href="${thEsc(source)}" target="_blank" rel="noopener noreferrer">Official source ↗</a>`:''}</div></div>`;
}

function wireTransactionsHub(hub){
  const search=hub.querySelector('#txn-search'),type=hub.querySelector('#txn-type'),count=hub.querySelector('.ux-filter-count');
  const apply=()=>{
    const query=(search?.value||'').trim().toLowerCase(),selected=(type?.value||'all').toLowerCase();let shown=0;
    hub.querySelectorAll('.transaction-row').forEach(row=>{
      const visible=(!query||(row.dataset.txnSearch||'').includes(query))&&(selected==='all'||row.dataset.txnType===selected);
      row.hidden=!visible;if(visible)shown++;
    });
    if(count)count.textContent=`${shown} shown`;
  };
  search?.addEventListener('input',apply);type?.addEventListener('change',apply);apply();
}

function loadingMarkup(){return `<div class="page-head"><div><div class="eyebrow">Personnel Movement</div><h1>Transactions</h1><p>Latest Titans roster moves, signings, waivers, releases, and reserve-list changes.</p></div></div><div class="panel"><div class="panel-body"><div class="notice" role="status">Updating the latest roster moves…</div></div></div>`;}

async function renderTransactionsHub(){
  if(thRoute()!=='transactions')return;
  const app=document.querySelector('#app');
  if(!app||app.dataset.transactionsHub==='loading'||app.querySelector('.transactions-hub'))return;
  const requestId=++thRequestSerial;app.dataset.transactionsHub='loading';app.setAttribute('aria-busy','true');
  if(!app.querySelector('.transaction-row'))app.innerHTML=loadingMarkup();
  try{
    const response=await fetch(`/api/data?transactions=${Date.now()}`,{cache:'no-store',headers:{Accept:'application/json'}});
    const data=await response.json();
    if(requestId!==thRequestSerial||thRoute()!=='transactions')return;
    if(!response.ok||!data?.ok)throw new Error(data?.error||'Transaction data unavailable');
    const rows=Array.isArray(data.transactions)?data.transactions:[];
    const types=[...new Set(rows.map(row=>String(row.type||'transaction').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    app.innerHTML=`<div class="page-head"><div><div class="eyebrow">Personnel Movement</div><h1>Transactions</h1><p>Latest Titans roster moves, signings, waivers, releases, and reserve-list changes.</p></div><span class="tag official">LIVE DATA</span></div><div class="filterbar transaction-tools"><input type="search" id="txn-search" placeholder="Search players or roster moves…" aria-label="Search transactions"><select id="txn-type" aria-label="Filter transaction type"><option value="all">All move types</option>${types.map(type=>`<option value="${thEsc(type.toLowerCase())}">${thEsc(type)}</option>`).join('')}</select><span class="ux-filter-count" aria-live="polite"></span></div><section class="panel transactions-hub"><div class="panel-head"><h2>Transactions · ${rows.length}</h2><span>Verified roster-move feed · Updated ${thEsc(thStamp(data.fetchedAt))}</span></div>${rows.length?`<div class="transaction-list">${rows.map(rowMarkup).join('')}</div>`:'<div class="panel-body"><div class="empty">No transaction rows are available yet.</div></div>'}</section>`;
    wireTransactionsHub(app);
  }catch(error){
    if(requestId!==thRequestSerial||thRoute()!=='transactions')return;
    app.innerHTML=`<div class="page-head"><div><div class="eyebrow">Personnel Movement</div><h1>Transactions</h1><p>Latest Titans roster moves, signings, waivers, releases, and reserve-list changes.</p></div></div><div class="panel"><div class="panel-body"><div class="empty"><strong>Transactions could not load.</strong><br>${thEsc(error.message||'Try again shortly.')}<div style="height:14px"></div><button class="button primary" type="button" id="txn-retry">Try again</button></div></div></div>`;
    app.querySelector('#txn-retry')?.addEventListener('click',()=>{delete app.dataset.transactionsHub;queueMicrotask(renderTransactionsHub)});
  }finally{
    if(app&&requestId===thRequestSerial){delete app.dataset.transactionsHub;app.removeAttribute('aria-busy');}
  }
}

const thApp=document.querySelector('#app');
if(thApp)new MutationObserver(()=>queueMicrotask(renderTransactionsHub)).observe(thApp,{childList:true});
addEventListener('hashchange',()=>{thRequestSerial++;const app=document.querySelector('#app');if(app){delete app.dataset.transactionsHub;app.removeAttribute('aria-busy');}queueMicrotask(renderTransactionsHub)});
queueMicrotask(renderTransactionsHub);
