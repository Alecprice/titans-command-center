const saQs=(s,r=document)=>r.querySelector(s),saRoute=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
let saPromise=null,saRequestSerial=0;
const saEsc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const saDate=v=>{if(!v)return 'Unknown';const d=new Date(v);return Number.isNaN(d.getTime())?'Unknown':new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'America/Chicago'}).format(d)};
const statusLabel=run=>run.status==='success'?'Checked':run.status==='skipped'?'Skipped':'Needs attention';
async function loadActivity(){if(saPromise)return saPromise;saPromise=fetch('/api/data',{headers:{Accept:'application/json'}}).then(r=>r.json()).then(d=>d?.ok?d:null).finally(()=>{saPromise=null});return saPromise;}
function activityCard(run){const status=String(run.status||'unknown').toLowerCase(),seen=Number(run.recordsSeen||0),written=Number(run.recordsWritten||0),note=run.metadata?.note||'';return `<article class="source-activity-row ${saEsc(status)}"><div class="activity-status"><i></i><span>${saEsc(statusLabel(run))}</span></div><div class="activity-main"><strong>${saEsc(run.source||run.sourceSlug||'Source')}</strong><small>${saEsc(saDate(run.startedAt))}</small>${note?`<p>${saEsc(note)}</p>`:''}</div><div class="activity-counts"><span><b>${seen}</b> checked</span><span><b>${written}</b> new rows</span></div></article>`;}
async function applySourceActivity(){
  if(saRoute()!=='sources')return;
  const app=saQs('#app');if(!app||saQs('.source-activity-panel',app))return;
  const requestId=++saRequestSerial;
  try{
    const data=await loadActivity();
    if(requestId!==saRequestSerial||saRoute()!=='sources'||!data)return;
    const runs=(data.syncRuns||[]).slice(0,10),latestVerified=runs.find(r=>r.status==='success'),panel=document.createElement('section');panel.className='source-activity-panel';panel.innerHTML=`<div class="source-activity-head"><div><small>Update history</small><h2>Recent source checks</h2><p>A source can be checked successfully even when there is nothing new to save. “0 new rows” means no new records were found, not that the check failed.</p></div><div class="last-verified"><small>Last successful check</small><strong>${latestVerified?saEsc(saDate(latestVerified.startedAt)):'No successful check stored'}</strong></div></div>${runs.length?`<div class="source-activity-list">${runs.map(activityCard).join('')}</div>`:'<div class="team-room-empty">No source-check history is available yet.</div>'}`;
    const anchor=saQs('.source-arbitration',app)||saQs('.source-quality-banner',app)||saQs('.page-head',app);anchor?.insertAdjacentElement('afterend',panel);
  }catch{}
}
const saApp=saQs('#app');if(saApp)new MutationObserver(()=>queueMicrotask(applySourceActivity)).observe(saApp,{childList:true});
addEventListener('hashchange',()=>{saRequestSerial++;queueMicrotask(applySourceActivity)});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')queueMicrotask(applySourceActivity)});
queueMicrotask(applySourceActivity);
