(() => {
  'use strict';

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!runtime||!app)return;

  const VERSION='145.0.0';
  const API='/api/fan-events';
  const CENTRAL='America/Chicago';
  const state={loading:false,lastPayload:null,lastError:'',renderQueued:false};
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeExternal=value=>{try{const url=new URL(String(value||''));return url.protocol==='https:'?url.href:''}catch{return''}};
  const stamp=value=>{const valueMs=Date.parse(String(value||''));return Number.isFinite(valueMs)?valueMs:null};
  const dateLabel=value=>{const ms=stamp(value);return ms==null?'Date TBD':new Intl.DateTimeFormat('en-US',{timeZone:CENTRAL,weekday:'short',month:'short',day:'numeric'}).format(new Date(ms));};
  const timeLabel=value=>{const ms=stamp(value);return ms==null?'Time TBD':new Intl.DateTimeFormat('en-US',{timeZone:CENTRAL,hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(ms));};
  const venueLabel=event=>[event?.venue?.name,event?.venue?.city,event?.venue?.state].filter(Boolean).join(' · ')||'Venue TBD';

  function sourceLabel(source){
    if(source?.provider==='Skiddle')return'Skiddle ↗';
    if(source?.provider==='Bandsintown')return'Bandsintown ↗';
    if(source?.provider==='Eventbrite')return'Eventbrite ↗';
    if(source?.provider==='Ticketmaster')return'Ticketmaster ↗';
    return`${String(source?.provider||'Source')} ↗`;
  }

  function providerSummary(payload){
    const catalog=Array.isArray(payload?.providerCatalog)?payload.providerCatalog:[];
    const configured=payload?.configuredProviders||{};
    const status=new Map((payload?.providerResults||[]).map(result=>[result.provider,result]));
    return catalog.map(item=>{
      const key=String(item.key||'');
      const active=Boolean(configured[key]);
      const result=status.get(item.provider);
      const tone=!active?'not-connected':result?.ok?'ready':'degraded';
      const label=!active?'Not connected':result?.ok?`${result.events===undefined?'Connected':`${result.events} events`}`:'Unavailable';
      return `<div class="fan-events-provider ${tone}"><strong>${esc(item.provider)}</strong><span>${esc(label)}</span><small>${esc(item.scope||'Provider-specific scope')}</small></div>`;
    }).join('');
  }

  function sourceLinks(event){
    const sources=Array.isArray(event?.sources)?event.sources:[];
    const links=sources.map(source=>{
      const url=safeExternal(source?.url);
      if(!url)return'';
      return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" data-fan-events-source="${esc(source?.provider||'source')}">${esc(sourceLabel(source))}</a>`;
    }).filter(Boolean);
    return links.length?links.join(''):'';
  }

  function eventCard(event){
    const links=sourceLinks(event);
    const sourceCount=Math.max(1,Number(event?.providerCount)||1);
    return `<article class="fan-event-card">
      <div class="fan-event-time"><small>${esc(dateLabel(event?.start))}</small><strong>${esc(timeLabel(event?.start))}</strong></div>
      <div class="fan-event-copy"><span class="fan-event-category">${esc(event?.category||event?.artist||'Local event')}</span><h3>${esc(event?.title||'Upcoming event')}</h3><p>${esc(venueLabel(event))}</p></div>
      <div class="fan-event-meta"><span>${sourceCount} connected source${sourceCount===1?'':'s'}</span>${links?`<div class="fan-event-links">${links}</div>`:''}</div>
    </article>`;
  }

  function content(payload){
    const events=Array.isArray(payload?.events)?payload.events:[];
    const region=payload?.region?.label||'Nashville, TN';
    const radius=Number(payload?.region?.radiusMiles)||25;
    const providerCount=Number(payload?.providersAvailable)||0;
    const header=`<header class="fan-events-head"><div><small>TENX · FAN EVENT RADAR</small><h2>Nashville Event Radar</h2><p>Upcoming public events around ${esc(region)} from connected event providers. Listings are discovery links, not Titans-affiliated events unless a source explicitly says so.</p></div><button type="button" data-fan-events-refresh>${state.loading?'Refreshing…':'Refresh events'}</button></header>`;
    const trust=`<div class="fan-events-trust"><strong>${esc(payload?.message||'Event sources are checked independently.')}</strong><span>${providerCount} provider${providerCount===1?'':'s'} responding · ${radius}-mile configured radius · source availability can differ by provider.</span></div>`;
    const providers=`<details class="fan-events-sources"><summary>Provider scope & availability</summary><div class="fan-events-provider-grid">${providerSummary(payload)}</div><p>Eventbrite is limited to events owned by organizations authorized for the connected token. Bandsintown is limited to configured artists unless broader access is approved. Skiddle is primarily UK-focused; Skiddle listings retain a direct Skiddle source link.</p></details>`;
    const cards=events.length?`<div class="fan-events-rail" aria-label="Upcoming Nashville events">${events.map(eventCard).join('')}</div>`:`<div class="fan-events-empty"><strong>No upcoming events returned in the current window.</strong><p>This can mean a provider has no matching inventory for Nashville, an artist list has not been configured, or a connected source is temporarily unavailable.</p></div>`;
    return `${header}${trust}${cards}${providers}`;
  }

  function ensureStyle(){
    if(document.getElementById('fan-events-v145-style'))return;
    const style=document.createElement('style');
    style.id='fan-events-v145-style';
    style.textContent=`
      .fan-events-radar{margin:18px 0 24px;padding:20px;border:1px solid rgba(75,146,219,.36);border-radius:18px;background:linear-gradient(145deg,rgba(12,35,64,.96),rgba(7,22,41,.98));display:grid;gap:14px;overflow:hidden}
      .fan-events-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;align-items:end}.fan-events-head small{display:block;color:#8fc8ff;font-size:.72rem;font-weight:950;letter-spacing:.12em;text-transform:uppercase}.fan-events-head h2{margin:4px 0 5px;font-size:clamp(1.35rem,3vw,2rem)}.fan-events-head p{margin:0;max-width:760px;color:var(--muted,#a8b8c8);line-height:1.55}.fan-events-head button{min-height:44px;padding:0 16px;border:1px solid rgba(75,146,219,.5);border-radius:999px;background:#4b92db;color:#071629;font-weight:900;cursor:pointer}.fan-events-head button:disabled{opacity:.65;cursor:wait}
      .fan-events-trust{display:grid;gap:4px;padding:11px 13px;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:rgba(255,255,255,.035)}.fan-events-trust strong{font-size:.88rem}.fan-events-trust span{color:var(--muted,#a8b8c8);font-size:.78rem;line-height:1.45}
      .fan-events-rail{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(270px,340px);gap:11px;overflow-x:auto;padding:2px 2px 10px;scroll-snap-type:x proximity;overscroll-behavior-inline:contain}.fan-event-card{scroll-snap-align:start;display:grid;grid-template-rows:auto 1fr auto;gap:12px;min-width:0;padding:15px;border:1px solid rgba(255,255,255,.1);border-top:4px solid #4b92db;border-radius:14px;background:rgba(255,255,255,.045)}.fan-event-time{display:flex;justify-content:space-between;gap:12px;align-items:center}.fan-event-time small{color:#8fc8ff;font-weight:950;text-transform:uppercase;letter-spacing:.06em}.fan-event-time strong{font-size:.78rem}.fan-event-category{display:inline-block;margin-bottom:5px;color:var(--muted,#a8b8c8);font-size:.72rem;font-weight:850;text-transform:uppercase;letter-spacing:.06em}.fan-event-copy h3{margin:0;font-size:1.05rem;line-height:1.28}.fan-event-copy p{margin:7px 0 0;color:var(--muted,#a8b8c8);font-size:.82rem;line-height:1.45}.fan-event-meta{display:grid;gap:8px;padding-top:10px;border-top:1px solid rgba(255,255,255,.08);color:var(--muted,#a8b8c8);font-size:.76rem}.fan-event-links{display:flex;flex-wrap:wrap;gap:7px}.fan-event-links a{min-height:44px;display:inline-flex;align-items:center;padding:0 11px;border:1px solid rgba(75,146,219,.36);border-radius:999px;color:#8fc8ff;font-weight:900;text-decoration:none}
      .fan-events-sources{border-top:1px solid rgba(255,255,255,.09);padding-top:12px}.fan-events-sources summary{min-height:44px;display:flex;align-items:center;cursor:pointer;color:#8fc8ff;font-weight:900}.fan-events-provider-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;padding:8px 0}.fan-events-provider{display:grid;gap:3px;padding:10px;border:1px solid rgba(255,255,255,.09);border-radius:10px}.fan-events-provider strong{font-size:.84rem}.fan-events-provider span{font-size:.72rem;font-weight:900;text-transform:uppercase}.fan-events-provider small,.fan-events-sources p{color:var(--muted,#a8b8c8);font-size:.74rem;line-height:1.45}.fan-events-provider.degraded{border-color:rgba(237,23,76,.38)}.fan-events-provider.not-connected{opacity:.62}.fan-events-empty{padding:18px;border:1px dashed rgba(255,255,255,.15);border-radius:12px}.fan-events-empty p{margin:6px 0 0;color:var(--muted,#a8b8c8);line-height:1.5}
      .fan-events-radar a:focus-visible,.fan-events-radar button:focus-visible,.fan-events-radar summary:focus-visible{outline:3px solid rgba(143,200,255,.6);outline-offset:3px}
      @media(max-width:920px){.fan-events-provider-grid{grid-template-columns:1fr 1fr}}
      @media(max-width:759px){.fan-events-radar{padding:14px}.fan-events-head{grid-template-columns:1fr}.fan-events-head button,.fan-event-links a,.fan-events-sources summary{min-height:48px}.fan-events-head button{width:100%}.fan-events-rail{grid-auto-columns:minmax(82vw,1fr)}.fan-events-provider-grid{grid-template-columns:1fr}.fan-event-time{align-items:flex-start;flex-direction:column;gap:3px}.fan-event-links{display:grid}.fan-event-links a{width:100%;justify-content:center}}
      @media(prefers-reduced-motion:reduce){.fan-events-radar *{scroll-behavior:auto!important;transition:none!important}}
      @media(forced-colors:active){.fan-events-radar,.fan-event-card,.fan-events-provider,.fan-events-head button,.fan-event-links a{border:1px solid CanvasText}.fan-events-radar a:focus-visible,.fan-events-radar button:focus-visible,.fan-events-radar summary:focus-visible{outline:3px solid Highlight}}
    `;
    document.head.appendChild(style);
  }

  function mountShell(){
    if(runtime.route()!=='fan')return null;
    let root=app.querySelector('[data-fan-events-v145]');
    if(root)return root;
    ensureStyle();
    root=document.createElement('section');
    root.className='fan-events-radar';
    root.dataset.fanEventsV145=VERSION;
    root.setAttribute('aria-label','Nashville Event Radar');
    root.innerHTML='<div class="fan-events-empty"><strong>Loading Nashville events…</strong><p>Checking connected server-side event sources.</p></div>';
    const first=app.firstElementChild;
    if(first)first.insertAdjacentElement('afterend',root);else app.prepend(root);
    return root;
  }

  function draw(){
    const root=mountShell();
    if(!root)return;
    if(state.lastPayload){root.innerHTML=content(state.lastPayload);root.querySelector('[data-fan-events-refresh]')?.addEventListener('click',refresh);return;}
    if(state.lastError)root.innerHTML=`<header class="fan-events-head"><div><small>TENX · FAN EVENT RADAR</small><h2>Nashville Event Radar</h2><p>${esc(state.lastError)}</p></div><button type="button" data-fan-events-refresh>Try again</button></header>`;
    root.querySelector('[data-fan-events-refresh]')?.addEventListener('click',refresh);
  }

  async function load({force=false}={}){
    if(runtime.route()!=='fan'||state.loading)return;
    state.loading=true;draw();
    try{
      if(force)runtime.invalidateApi(API);
      const payload=await runtime.apiJson(API,{ttl:600000,force});
      if(!payload?.ok)throw new Error(payload?.error||'Event sources unavailable');
      state.lastPayload=payload;state.lastError='';
    }catch(error){
      state.lastError='Event discovery is temporarily unavailable. Titans Command Center can keep running without it.';
      console.warn('[fan-events-v145]',error);
    }finally{state.loading=false;draw();}
  }

  function schedule(){
    if(state.renderQueued)return;
    state.renderQueued=true;
    queueMicrotask(()=>{state.renderQueued=false;if(runtime.route()!=='fan')return;draw();if(!state.lastPayload&&!state.loading)load();});
  }
  function refresh(){load({force:true});}

  runtime.onRoute(schedule,{immediate:true});
  runtime.onAppRender(schedule);
  runtime.onRefresh(event=>{if(!event?.urls||event.urls.includes(API)){state.lastPayload=null;schedule();}});
})();
