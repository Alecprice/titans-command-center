import './tickets-official-v51.js';

(() => {
  'use strict';
  if(!document.querySelector('link[data-titans-social-v49]')){const link=document.createElement('link');link.rel='stylesheet';link.href='/titans-social-v49.css';link.dataset.titansSocialV49='1';document.head.append(link);}
  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!runtime||!app)return;

  const HOME_ITEM_LIMIT=3;
  const DEFAULT_LINKS=[
    {label:'Titans News',url:'https://www.tennesseetitans.com/news/'},
    {label:'r/TennesseeTitans',url:'https://www.reddit.com/r/Tennesseetitans/'},
    {label:'Bluesky',url:'https://bsky.app/search?q=Tennessee%20Titans'},
    {label:'Facebook',url:'https://www.facebook.com/titans'},
    {label:'YouTube',url:'https://www.youtube.com/titans'},
  ];
  const state={payload:null,loading:null};
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const route=()=>runtime.route();
  const allowedHosts=['tennesseetitans.com','titansonline.com','reddit.com','bsky.app','facebook.com','youtube.com','youtu.be'];
  const safeUrl=value=>{try{const url=new URL(String(value||''));const host=url.hostname.toLowerCase();return url.protocol==='https:'&&allowedHosts.some(allowed=>host===allowed||host.endsWith(`.${allowed}`))?url.href:'#'}catch{return'#'}};
  const stampOf=item=>{const stamp=Date.parse(item?.createdAt);return Number.isFinite(stamp)?stamp:0;};
  function relativeTime(value){
    const stamp=Date.parse(value);if(!Number.isFinite(stamp))return'Recent';
    const seconds=Math.max(0,Math.round((Date.now()-stamp)/1000));
    if(seconds<60)return'Just now';if(seconds<3600)return`${Math.floor(seconds/60)}m`;if(seconds<86400)return`${Math.floor(seconds/3600)}h`;return`${Math.floor(seconds/86400)}d`;
  }
  function pulseItems(){
    const items=Array.isArray(state.payload?.items)?state.payload.items:Array.isArray(state.payload?.posts)?state.payload.posts:[];
    const safe=items.filter(item=>safeUrl(item?.url)!=='#').sort((a,b)=>stampOf(b)-stampOf(a));
    const official=safe.filter(item=>Boolean(item?.official));
    const publicItems=safe.filter(item=>!item?.official);
    if(!official.length)return publicItems.slice(0,HOME_ITEM_LIMIT);
    return [official[0],...publicItems,...official.slice(1)].slice(0,HOME_ITEM_LIMIT);
  }
  function itemCard(item){
    const url=safeUrl(item?.url);
    const source=String(item?.source||'Titans Pulse');
    const official=Boolean(item?.official);
    const title=String(item?.title||source);
    const text=String(item?.text||'').trim();
    const author=String(item?.author||'').trim();
    return `<article class="social-post-v49 ${official?'is-official-v49':'is-fan-v49'}">
      <a class="social-item-link-v49" href="${esc(url)}" target="_blank" rel="noopener noreferrer">
        <header><span class="social-source-badge-v49">${official?'✓ ':''}${esc(source)}</span><time datetime="${esc(item?.createdAt||'')}">${esc(relativeTime(item?.createdAt))}</time></header>
        <strong>${esc(title)}</strong>${text?`<span>${esc(text)}</span>`:''}
        <footer><span>${esc(author||'Public source')}</span><b>Open ↗</b></footer>
      </a>
    </article>`;
  }
  function sourceLinks(payload){
    const links=Array.isArray(payload?.links)&&payload.links.length?payload.links:DEFAULT_LINKS;
    return links.map(link=>{const url=safeUrl(link.url);return url==='#'?'':`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)}</a>`;}).join('');
  }
  function sourceStatus(){
    const sources=state.payload?.sources;if(!sources)return'';
    const labels=[['officialNews','Official news'],['officialVideo','Official video'],['bluesky','Bluesky'],['reddit','Reddit']];
    const available=labels.filter(([key])=>sources[key]?.available).length;
    const unavailable=labels.filter(([key])=>!sources[key]?.available).map(([,label])=>label);
    const detail=unavailable.length?`${unavailable.join(', ')} temporarily unavailable`:'All checked feeds responded';
    return `<div class="social-source-status-v49" aria-label="Free source status"><span class="social-status-count-v49"><i aria-hidden="true"></i>${available} of ${labels.length} free sources responding</span><span class="social-status-detail-v49">${esc(detail)}</span><span class="social-status-freshness-v49" data-social-freshness>Updated ${esc(relativeTime(state.payload?.fetchedAt))}</span></div>`;
  }
  function sectionBody(){
    const items=pulseItems();
    if(state.payload?.available&&items.length)return `<div class="social-post-grid-v49" aria-label="Latest Titans pulse digest">${items.map(itemCard).join('')}</div>`;
    if(state.loading&&!state.payload)return'<div class="social-pulse-loading-v49" role="status"><span></span><strong>Checking free Titans sources…</strong></div>';
    return `<div class="social-pulse-fallback-v49"><strong>Free feeds are temporarily quiet</strong><p>${esc(state.payload?.message||'Use the source shortcuts below for official Titans updates and fan conversation while the feed refreshes.')}</p></div>`;
  }
  function render(){
    if(route()!=='home')return;
    let section=app.querySelector('[data-titans-social-pulse]');
    if(!section){section=document.createElement('section');section.className='titans-social-pulse-v49';section.dataset.titansSocialPulse='1';app.append(section);}
    section.innerHTML=`<header class="social-pulse-head-v49"><div><div class="eyebrow">FAN PULSE · FREE SOURCES</div><h2>Around Titans Nation</h2><p>Three quick source-backed updates: official Titans coverage first, then the latest public fan conversation when available.</p></div><a class="social-primary-link-v49" href="https://www.tennesseetitans.com/news/" target="_blank" rel="noopener noreferrer">Official news ↗</a></header>${sourceStatus()}${sectionBody()}<div class="social-pulse-foot-v49"><nav class="social-search-chips-v49" aria-label="Free Titans source shortcuts">${sourceLinks(state.payload)}</nav><div class="social-pulse-note-v49"><span>Free only · Titans RSS + Bluesky public API + Reddit RSS · 10-minute shared cache.</span><button type="button" data-social-refresh>Refresh pulse</button></div></div>`;
  }
  async function load(force=false){
    if(state.loading&&!force)return state.loading;
    state.loading=runtime.apiJson('/api/social-pulse',{ttl:10*60*1000,force}).then(payload=>{if(payload)state.payload=payload;render();return payload;}).finally(()=>{state.loading=null;});
    render();
    return state.loading;
  }
  function reconcile(){if(route()!=='home')return;render();load(false);}
  app.addEventListener('click',event=>{
    const button=event.target instanceof Element?event.target.closest('[data-social-refresh]'):null;
    if(!button||route()!=='home')return;
    button.disabled=true;
    load(true).finally(()=>{if(button.isConnected)button.disabled=false;});
  });
  runtime.onRoute(()=>queueMicrotask(reconcile),{immediate:true});
  runtime.onAppRender(()=>queueMicrotask(()=>{if(route()==='home'&&!app.querySelector('[data-titans-social-pulse]'))reconcile();}),{immediate:true});
})();
