(() => {
  'use strict';

  const STALE_AFTER_MS=48*60*60*1000;
  const app=document.querySelector('#app');
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  let snapshot=null;
  let loading=null;
  let queued=false;

  function validDate(value){
    if(value==null||value==='')return null;
    const date=new Date(value);
    return Number.isNaN(date.getTime())?null:date;
  }

  function isCalendarDate(value){
    return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value.trim());
  }

  function latestDate(values){
    return values.map(validDate).filter(Boolean).sort((a,b)=>b-a)[0]||null;
  }

  function rel(value){
    const date=validDate(value);
    if(!date)return'unknown';
    const diff=date.getTime()-Date.now();
    const abs=Math.abs(diff);
    const [size,unit]=abs>=86400000?[86400000,'day']:abs>=3600000?[3600000,'hour']:[60000,'minute'];
    return new Intl.RelativeTimeFormat('en',{numeric:'auto'}).format(Math.round(diff/size),unit);
  }

  function shortDate(value){
    const date=validDate(value);
    if(!date)return'unknown date';
    return new Intl.DateTimeFormat('en-US',{
      month:'short',
      day:'numeric',
      timeZone:isCalendarDate(value)?'UTC':'America/Chicago'
    }).format(date);
  }

  function fallbackAuditDate(data){
    const value=data?.fallback?.auditedAt||data?.dataQuality?.rosterSnapshotAt||data?.meta?.roster_snapshot_at||data?.dataQuality?.contentAuditAt||data?.meta?.content_audit_at;
    return validDate(value)?value:null;
  }

  function isAuditedFallback(data){
    return data?.mode==='audited-fallback'||data?.fallback?.active===true;
  }

  function freshness(data){
    return {
      roster:latestDate((data?.roster||[]).map(player=>player.capturedAt)),
      transactions:latestDate((data?.transactions||[]).map(item=>item.date||item.publishedAt||item.capturedAt)),
      feed:latestDate((data?.feed||[]).map(item=>item.publishedAt||item.capturedAt))
    };
  }

  function rosterState(rosterDate){
    if(!rosterDate)return'unknown';
    return Date.now()-rosterDate.getTime()>STALE_AFTER_MS?'stale':'recent';
  }

  function findCard(){
    return [...document.querySelectorAll('.v10-command-card')].find(card=>card.querySelector('small')?.textContent?.trim()==='DATA FRESHNESS')||null;
  }

  async function load(){
    if(snapshot)return snapshot;
    if(loading)return loading;
    loading=fetch('/api/data',{cache:'no-store',headers:{Accept:'application/json'}})
      .then(async response=>{
        if(!response.ok)throw new Error(`data ${response.status}`);
        const payload=await response.json();
        if(!payload?.ok)throw new Error(payload?.error||'data unavailable');
        snapshot=payload;
        return payload;
      })
      .finally(()=>{loading=null;});
    return loading;
  }

  function render(card,data){
    const fresh=freshness(data);
    const fallback=isAuditedFallback(data);
    const auditDate=fallbackAuditDate(data);
    const state=fallback?'fallback':rosterState(fresh.roster);
    const strong=card.querySelector('strong');
    const detail=card.querySelector('p');
    card.classList.add('v10-freshness-card');
    card.dataset.freshnessState=state;
    if(fallback){
      const verified=shortDate(auditDate);
      if(strong)strong.textContent=`Verified backup · ${verified}`;
      if(detail)detail.textContent=`Roster verified ${verified} · Moves ${rel(fresh.transactions)} · Intel ${rel(fresh.feed)}`;
      card.title=`Live roster updates are temporarily unavailable. Showing the verified roster backup audited ${verified}.`;
      return;
    }
    if(strong)strong.textContent=state==='recent'?'Recent server snapshot':state==='stale'?'Roster snapshot needs review':'Freshness unknown';
    if(detail)detail.textContent=`Roster ${rel(fresh.roster)} · Moves ${rel(fresh.transactions)} · Intel ${rel(fresh.feed)}`;
    card.title=state==='stale'?'The loaded roster snapshot is more than 48 hours old. Open Sources before treating it as current.':state==='recent'?'The loaded roster snapshot was captured within the last 48 hours.':'The loaded roster does not provide a usable capture timestamp.';
  }

  async function enhance(){
    queued=false;
    if(route()!=='home')return;
    const card=findCard();
    if(!card)return;
    const strong=card.querySelector('strong');
    if(strong?.textContent?.trim()==='Saved snapshot')return;
    if(card.dataset.freshnessState&&snapshot){render(card,snapshot);return;}
    card.dataset.freshnessState='checking';
    if(strong)strong.textContent='Checking snapshot age…';
    try{render(card,await load());}
    catch{
      card.dataset.freshnessState='unknown';
      if(strong)strong.textContent='Snapshot age unavailable';
      card.title='The source-age check could not be completed. Open Sources for the underlying dataset details.';
    }
  }

  function queue(){
    if(queued)return;
    queued=true;
    queueMicrotask(enhance);
  }

  addEventListener('hashchange',queue);
  addEventListener('online',()=>{snapshot=null;queue();});
  if(app)new MutationObserver(queue).observe(app,{childList:true});
  queue();
})();
