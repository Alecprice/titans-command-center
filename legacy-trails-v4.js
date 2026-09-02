const STYLE_ID='legacy-trails-v4-styles';
const TRAIL_VERSION='4.0.1';
const ROUTE='legacy';

const trails=[
  {
    id:'afl-roots',tone:'retro',eyebrow:'1960–61',title:'AFL roots',summary:'Start with the championship foundation, first home, and an original franchise star.',
    stops:[
      {label:'Back-to-back AFL titles',q:'AFL championship',scope:'story'},
      {label:'Jeppesen Stadium',q:'Jeppesen Stadium',scope:'heritage'},
      {label:'George Blanda',q:'George Blanda',scope:'legends'}
    ]
  },
  {
    id:'luv-ya-blue',tone:'oilers',eyebrow:'1975–80',title:'Luv Ya Blue',summary:'Follow the Houston fan-culture era through its coach, stadium, and signature runner.',
    stops:[
      {label:'Luv Ya Blue',q:'Luv Ya Blue',scope:'story'},
      {label:'Astrodome',q:'Astrodome',scope:'heritage'},
      {label:'Earl Campbell',q:'Earl Campbell',scope:'legends'},
      {label:'Bum Phillips',q:'Bum Phillips',scope:'heritage'}
    ]
  },
  {
    id:'run-and-shoot',tone:'midnight',eyebrow:'1984–93',title:'Moon + Run-and-Shoot',summary:'Jump through the passing era, its quarterback, and the Houston home behind the playoff streak.',
    stops:[
      {label:'Run-and-Shoot years',q:'Run-and-Shoot',scope:'story'},
      {label:'Warren Moon',q:'Warren Moon',scope:'legends'},
      {label:'Astrodome',q:'Astrodome',scope:'heritage'}
    ]
  },
  {
    id:'1999-run',tone:'titans',eyebrow:'1999',title:'The Super Bowl run',summary:'Trace the first Titans season from the new identity through the miracle and the franchise icons who drove it.',
    stops:[
      {label:'Titans era begins',q:'Titans era begins',scope:'story'},
      {label:'Music City Miracle',q:'Music City Miracle',scope:'moments'},
      {label:'Steve McNair',q:'Steve McNair',scope:'legends'},
      {label:'Eddie George',q:'Eddie George',scope:'legends'},
      {label:'Nissan Stadium',q:'Nissan Stadium',scope:'heritage'}
    ]
  },
  {
    id:'rushing-kings',tone:'red',eyebrow:'2009–20',title:'Rushing kings',summary:'Move from CJ2K to King Henry and finish on the current single-season franchise mark.',
    stops:[
      {label:'2K club',q:'2K club',scope:'story'},
      {label:'Chris Johnson',q:'Chris Johnson',scope:'legends'},
      {label:'Derrick Henry',q:'Derrick Henry',scope:'legends'},
      {label:'2,027-yard record',q:'2,027',scope:'records'}
    ]
  }
];

const trailById=id=>trails.find(trail=>trail.id===id)||null;
const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
const hashQuery=()=>location.hash.replace(/^#/,'').split('?')[1]||'';

function routeState(){
  const params=new URLSearchParams(hashQuery());
  const trail=trailById(params.get('trail'));
  const rawStep=Number.parseInt(params.get('step')||'0',10);
  const step=trail?Math.min(Math.max(Number.isFinite(rawStep)?rawStep:0,0),trail.stops.length-1):0;
  return {trail,step};
}

function writeTrailState(trailId,step){
  if(route()!==ROUTE)return;
  const params=new URLSearchParams(hashQuery());
  if(trailId){params.set('trail',trailId);params.set('step',String(step));}
  else{params.delete('trail');params.delete('step');}
  const query=params.toString();
  const next=`#${ROUTE}${query?`?${query}`:''}`;
  if(location.hash!==next)history.replaceState(history.state,'',`${location.pathname}${location.search}${next}`);
}

function injectStyles(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
    .legacy-trails{margin:18px 0 24px;padding:18px;border:1px solid rgba(0,33,68,.15);background:linear-gradient(135deg,#f7f3ea 0 44%,#edf7fd 44% 100%);box-shadow:0 16px 42px rgba(0,33,68,.08)}
    .legacy-trails-head{display:flex;justify-content:space-between;gap:18px;align-items:end}.legacy-trails-head small{display:block;color:var(--retro-red,#c8102e);font-size:11px;font-weight:950;letter-spacing:.12em;text-transform:uppercase}.legacy-trails-head h2{margin:5px 0 0;color:var(--retro-navy,#002144);font-size:27px;line-height:1;text-transform:uppercase}.legacy-trails-head p{max-width:540px;margin:0;color:#526b80;font-size:12px;line-height:1.55}
    .legacy-trail-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px;margin-top:14px}.legacy-trail-card{position:relative;min-height:152px;padding:14px;border:1px solid rgba(0,33,68,.14);background:#fff;color:var(--retro-navy,#002144);text-align:left;cursor:pointer;overflow:hidden}.legacy-trail-card:before{content:"";position:absolute;inset:0 auto 0 0;width:4px;background:var(--retro-blue,#4b92db)}.legacy-trail-card[data-trail-tone="oilers"]:before{background:#69b3e7}.legacy-trail-card[data-trail-tone="red"]:before{background:var(--retro-red,#c8102e)}.legacy-trail-card[data-trail-tone="midnight"]:before{background:#002a5c}.legacy-trail-card[aria-pressed="true"]{border-color:rgba(0,33,68,.45);box-shadow:0 0 0 2px rgba(75,146,219,.18)}
    .legacy-trail-card small,.legacy-trail-card strong,.legacy-trail-card span{display:block}.legacy-trail-card small{font-size:11px;font-weight:950;letter-spacing:.1em;text-transform:uppercase;color:#5b7388}.legacy-trail-card strong{margin-top:7px;font-size:15px;line-height:1.1;text-transform:uppercase}.legacy-trail-card span{margin-top:8px;color:#526b80;font-size:12px;line-height:1.45}.legacy-trail-card em{position:absolute;right:10px;bottom:8px;font-style:normal;font-size:11px;font-weight:900;color:#637b8f}
    .legacy-trail-player{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;margin-top:13px;padding:14px;border:1px solid rgba(0,33,68,.16);background:var(--retro-navy,#002144);color:#fff}.legacy-trail-player[hidden]{display:none!important}.legacy-trail-player small{display:block;color:#bfe1f6;font-size:11px;font-weight:950;letter-spacing:.12em;text-transform:uppercase}.legacy-trail-player h3{margin:5px 0 0;font-size:19px;line-height:1.05;text-transform:uppercase}.legacy-trail-progress{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;margin-top:9px}.legacy-trail-progress-bar{height:5px;background:rgba(255,255,255,.2);overflow:hidden}.legacy-trail-progress-bar span{display:block;height:100%;background:#69b3e7;transition:width .2s ease}.legacy-trail-progress strong{font-size:11px;letter-spacing:.08em}.legacy-trail-stop{margin-top:8px;color:#e3f0f8;font-size:12px}.legacy-trail-actions{display:flex;gap:7px;align-items:center}.legacy-trail-actions button{min-height:44px;padding:0 12px;border:1px solid rgba(255,255,255,.32);background:#fff;color:var(--retro-navy,#002144);font-size:11px;font-weight:950;text-transform:uppercase;letter-spacing:.05em;cursor:pointer}.legacy-trail-actions button:disabled{opacity:.42;cursor:not-allowed}.legacy-trail-actions [data-legacy-trail-exit]{background:transparent;color:#fff}.legacy-trail-card:focus-visible,.legacy-trail-actions button:focus-visible{outline:3px solid rgba(105,179,231,.55);outline-offset:2px}
    @media(max-width:1000px){.legacy-trail-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media(max-width:760px){.legacy-trails{padding:14px}.legacy-trails-head{display:block}.legacy-trails-head p{margin-top:8px}.legacy-trail-grid{display:flex;overflow-x:auto;overscroll-behavior-inline:contain;scroll-snap-type:x proximity;padding:1px 1px 7px}.legacy-trail-card{flex:0 0 76vw;min-height:148px;scroll-snap-align:start}.legacy-trail-player{grid-template-columns:1fr}.legacy-trail-actions{display:grid;grid-template-columns:repeat(3,1fr)}.legacy-trail-actions button{min-height:46px;font-size:12px}}
    @media(max-width:430px){.legacy-trail-card{flex-basis:82vw}.legacy-trail-actions{grid-template-columns:1fr 1fr}.legacy-trail-actions [data-legacy-trail-exit]{grid-column:1/-1}.legacy-trails-head h2{font-size:24px}}
    @media(prefers-reduced-motion:reduce){.legacy-trail-progress-bar span{transition:none}.legacy-trail-grid{scroll-behavior:auto}}
    @media(forced-colors:active){.legacy-trails,.legacy-trail-card,.legacy-trail-player,.legacy-trail-actions button{border:1px solid CanvasText}.legacy-trail-card:before,.legacy-trail-progress-bar span{background:CanvasText}}
  `;
  document.head.append(style);
}

function trailMarkup(){
  return `<section class="legacy-trails" data-legacy-trails data-version="${TRAIL_VERSION}" aria-labelledby="legacy-trails-title"><div class="legacy-trails-head"><div><small>Curated museum paths</small><h2 id="legacy-trails-title">Legacy Trails</h2></div><p>Pick an era and move through connected Story, Moments, Legends, Records and Heritage stops without losing your place.</p></div><div class="legacy-trail-grid" role="group" aria-label="Choose a Legacy Trail">${trails.map(trail=>`<button type="button" class="legacy-trail-card" data-legacy-trail="${trail.id}" data-trail-tone="${trail.tone}" aria-pressed="false"><small>${trail.eyebrow}</small><strong>${trail.title}</strong><span>${trail.summary}</span><em>${trail.stops.length} stops</em></button>`).join('')}</div><div class="legacy-trail-player" data-legacy-trail-player hidden aria-live="polite"></div></section>`;
}

function playerMarkup(trail,step){
  const stop=trail.stops[step];
  const pct=Math.round(((step+1)/trail.stops.length)*100);
  return `<div><small>${trail.eyebrow} · ${trail.title}</small><h3>${stop.label}</h3><div class="legacy-trail-progress"><div class="legacy-trail-progress-bar" aria-hidden="true"><span style="width:${pct}%"></span></div><strong>STOP ${step+1} / ${trail.stops.length}</strong></div><div class="legacy-trail-stop">Showing this stop through Legacy Finder · ${stop.scope}</div></div><div class="legacy-trail-actions"><button type="button" data-legacy-trail-prev ${step===0?'disabled':''}>← Previous</button><button type="button" data-legacy-trail-next ${step===trail.stops.length-1?'disabled':''}>Next →</button><button type="button" data-legacy-trail-exit>Exit trail</button></div>`;
}

function scrollToMatch(page){
  const target=page.querySelector('.legacy-finder-match');
  if(!target)return;
  const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});
}

export function ensureLegacyTrails(page,controller){
  if(!page||!controller)return null;
  injectStyles();
  let root=page.querySelector('[data-legacy-trails]');
  if(!root){
    const finder=page.querySelector('[data-legacy-finder]');
    if(!finder)return null;
    finder.insertAdjacentHTML('afterend',trailMarkup());
    root=page.querySelector('[data-legacy-trails]');
  }
  if(!root||root.dataset.bound==='true')return root;
  root.dataset.bound='true';
  const player=root.querySelector('[data-legacy-trail-player]');
  let active=null;
  let step=0;
  let internal=false;

  const paint=()=>{
    root.querySelectorAll('[data-legacy-trail]').forEach(button=>button.setAttribute('aria-pressed',String(active&&button.dataset.legacyTrail===active.id)));
    if(!active){player.hidden=true;player.innerHTML='';return;}
    player.hidden=false;player.innerHTML=playerMarkup(active,step);
  };

  const deactivate=({clearFinder=true,syncUrl=true}={})=>{
    active=null;step=0;paint();
    if(syncUrl)writeTrailState(null,0);
    if(clearFinder){internal=true;controller.apply({q:'',scope:'all'});internal=false;}
  };

  const activate=(trailId,nextStep=0,{syncUrl=true,scroll=true}={})=>{
    const trail=trailById(trailId);
    if(!trail){deactivate({clearFinder:false,syncUrl});return;}
    active=trail;
    step=Math.min(Math.max(Number(nextStep)||0,0),trail.stops.length-1);
    paint();
    if(syncUrl)writeTrailState(active.id,step);
    const stop=active.stops[step];
    internal=true;controller.apply({q:stop.q,scope:stop.scope});internal=false;
    if(scroll)requestAnimationFrame(()=>scrollToMatch(page));
  };

  root.addEventListener('click',event=>{
    const card=event.target.closest('[data-legacy-trail]');
    if(card){activate(card.dataset.legacyTrail,0);return;}
    if(event.target.closest('[data-legacy-trail-prev]')&&active&&step>0){activate(active.id,step-1);return;}
    if(event.target.closest('[data-legacy-trail-next]')&&active&&step<active.stops.length-1){activate(active.id,step+1);return;}
    if(event.target.closest('[data-legacy-trail-exit]'))deactivate();
  });

  page.addEventListener('input',event=>{
    if(!internal&&active&&event.target?.matches?.('#legacy-finder-input'))deactivate({clearFinder:false});
  });
  page.addEventListener('click',event=>{
    if(internal||!active||event.target.closest('[data-legacy-trails]'))return;
    if(event.target.closest('[data-legacy-finder-scope],[data-legacy-finder-clear],[data-legacy-scroll],.legacy-era-filter,.archive-filter,[data-heritage-honor-filter]'))deactivate({clearFinder:false});
  },true);

  const initial=routeState();
  if(initial.trail)activate(initial.trail.id,initial.step,{syncUrl:false,scroll:false});
  else paint();
  page.dataset.legacyTrailsReady='true';
  page._legacyTrails={activate,deactivate,getState:()=>({trail:active?.id||null,step})};
  return root;
}
