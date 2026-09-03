const STYLE_ID='legacy-trails-v4-styles';
const TRAIL_VERSION='4.2.0';
const PASSPORT_KEY='titans:legacy-passport-v1';
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

const TOTAL_STOPS=trails.reduce((sum,trail)=>sum+trail.stops.length,0);
const trailById=id=>trails.find(trail=>trail.id===id)||null;
const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
const hashQuery=()=>location.hash.replace(/^#/,'').split('?')[1]||'';
const stopKey=(trailId,step)=>`${trailId}:${step}`;

function validStopKey(value){
  const [trailId,rawStep]=String(value||'').split(':');
  const trail=trailById(trailId);
  const step=Number.parseInt(rawStep,10);
  return trail&&Number.isInteger(step)&&step>=0&&step<trail.stops.length?stopKey(trail.id,step):null;
}

function normalizePassport(value={}){
  const visited=[...new Set((Array.isArray(value?.visited)?value.visited:[]).map(validStopKey).filter(Boolean))].slice(0,TOTAL_STOPS);
  const trail=trailById(value?.last?.trail);
  const rawStep=Number.parseInt(value?.last?.step,10);
  const last=trail&&Number.isInteger(rawStep)&&rawStep>=0&&rawStep<trail.stops.length?{trail:trail.id,step:rawStep}:null;
  return {visited,last};
}

function readPassport(){
  const empty=normalizePassport();
  try{
    const parsed=JSON.parse(localStorage.getItem(PASSPORT_KEY)||'null')||{};
    return {...normalizePassport(parsed),available:true};
  }catch{return {...empty,available:false};}
}

function persistPassport(value){
  const normalized=normalizePassport(value);
  try{localStorage.setItem(PASSPORT_KEY,JSON.stringify(normalized));return {...normalized,available:true};}
  catch{return {...normalized,available:false};}
}

function stampPassport(passport,trail,step){
  const key=stopKey(trail.id,step);
  if(passport.visited.includes(key)&&passport.last?.trail===trail.id&&passport.last?.step===step)return passport;
  return persistPassport({visited:[...passport.visited,key],last:{trail:trail.id,step}});
}

function resetPassport(){
  const empty=normalizePassport();
  try{localStorage.removeItem(PASSPORT_KEY);return {...empty,available:true};}
  catch{return {...empty,available:false};}
}

function trailStampCount(passport,trail){
  return trail.stops.reduce((count,_stop,index)=>count+(passport.visited.includes(stopKey(trail.id,index))?1:0),0);
}

function completedTrailCount(passport){
  return trails.reduce((count,trail)=>count+(trailStampCount(passport,trail)===trail.stops.length?1:0),0);
}

function nextPassportStop(passport){
  const preferred=passport.last?.trail?trailById(passport.last.trail):null;
  const ordered=preferred?[preferred,...trails.filter(trail=>trail!==preferred)]:trails;
  for(const trail of ordered){
    const start=preferred===trail?Math.min((passport.last?.step??-1)+1,trail.stops.length):0;
    for(let index=start;index<trail.stops.length;index++)if(!passport.visited.includes(stopKey(trail.id,index)))return {trail,index};
    for(let index=0;index<start;index++)if(!passport.visited.includes(stopKey(trail.id,index)))return {trail,index};
  }
  return null;
}

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
    .legacy-passport{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;margin-top:14px;padding:14px;border:1px dashed rgba(0,33,68,.34);background:rgba(255,255,255,.84);color:var(--retro-navy,#002144)}.legacy-passport small,.legacy-passport strong,.legacy-passport span{display:block}.legacy-passport small{font-size:11px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:var(--retro-red,#c8102e)}.legacy-passport strong{margin-top:4px;font-size:18px;line-height:1.05;text-transform:uppercase}.legacy-passport span{margin-top:5px;color:#526b80;font-size:12px;line-height:1.4}.legacy-passport-meter{height:6px;margin-top:9px;background:rgba(0,33,68,.12);overflow:hidden}.legacy-passport-meter span{display:block;height:100%;margin:0;background:#69b3e7;transition:width .2s ease}.legacy-passport-actions{display:flex;gap:7px;align-items:center}.legacy-passport-actions button{min-height:44px;padding:0 12px;border:1px solid rgba(0,33,68,.26);background:var(--retro-navy,#002144);color:#fff;font-size:11px;font-weight:950;letter-spacing:.05em;text-transform:uppercase;cursor:pointer}.legacy-passport-actions [data-legacy-passport-reset]{background:#fff;color:var(--retro-navy,#002144)}.legacy-passport-actions button:focus-visible{outline:3px solid rgba(75,146,219,.45);outline-offset:2px}
    .legacy-trail-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px;margin-top:14px}.legacy-trail-card{position:relative;min-height:152px;padding:14px;border:1px solid rgba(0,33,68,.14);background:#fff;color:var(--retro-navy,#002144);text-align:left;cursor:pointer;overflow:hidden}.legacy-trail-card:before{content:"";position:absolute;inset:0 auto 0 0;width:4px;background:var(--retro-blue,#4b92db)}.legacy-trail-card[data-trail-tone="oilers"]:before{background:#69b3e7}.legacy-trail-card[data-trail-tone="red"]:before{background:var(--retro-red,#c8102e)}.legacy-trail-card[data-trail-tone="midnight"]:before{background:#002a5c}.legacy-trail-card[aria-pressed="true"]{border-color:rgba(0,33,68,.45);box-shadow:0 0 0 2px rgba(75,146,219,.18)}.legacy-trail-card[data-passport-complete="true"]{border-color:rgba(0,89,63,.36);background:linear-gradient(180deg,#fff,#f2fbf7)}
    .legacy-trail-card small,.legacy-trail-card strong,.legacy-trail-card span{display:block}.legacy-trail-card small{font-size:11px;font-weight:950;letter-spacing:.1em;text-transform:uppercase;color:#5b7388}.legacy-trail-card strong{margin-top:7px;font-size:15px;line-height:1.1;text-transform:uppercase}.legacy-trail-card span{margin-top:8px;color:#526b80;font-size:12px;line-height:1.45}.legacy-trail-card em{position:absolute;right:10px;bottom:8px;font-style:normal;font-size:11px;font-weight:900;color:#637b8f}
    .legacy-trail-player{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;margin-top:13px;padding:14px;border:1px solid rgba(0,33,68,.16);background:var(--retro-navy,#002144);color:#fff}.legacy-trail-player[hidden]{display:none!important}.legacy-trail-player small{display:block;color:#bfe1f6;font-size:11px;font-weight:950;letter-spacing:.12em;text-transform:uppercase}.legacy-trail-player h3{margin:5px 0 0;font-size:19px;line-height:1.05;text-transform:uppercase}.legacy-trail-progress{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;margin-top:9px}.legacy-trail-progress-bar{height:5px;background:rgba(255,255,255,.2);overflow:hidden}.legacy-trail-progress-bar span{display:block;height:100%;background:#69b3e7;transition:width .2s ease}.legacy-trail-progress strong{font-size:11px;letter-spacing:.08em}.legacy-trail-stop{margin-top:8px;color:#e3f0f8;font-size:12px}.legacy-trail-actions{display:flex;gap:7px;align-items:center}.legacy-trail-actions button{min-height:44px;padding:0 12px;border:1px solid rgba(255,255,255,.32);background:#fff;color:var(--retro-navy,#002144);font-size:11px;font-weight:950;text-transform:uppercase;letter-spacing:.05em;cursor:pointer}.legacy-trail-actions button:disabled{opacity:.42;cursor:not-allowed}.legacy-trail-actions [data-legacy-trail-exit]{background:transparent;color:#fff}.legacy-trail-card:focus-visible,.legacy-trail-actions button:focus-visible{outline:3px solid rgba(105,179,231,.55);outline-offset:2px}.legacy-finder-match[data-legacy-trail-focus]:focus-visible{outline:3px solid rgba(105,179,231,.72);outline-offset:4px}
    @media(max-width:1000px){.legacy-trail-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media(max-width:760px){.legacy-trails{padding:14px}.legacy-trails-head{display:block}.legacy-trails-head p{margin-top:8px}.legacy-passport{grid-template-columns:1fr}.legacy-passport-actions{display:grid;grid-template-columns:1fr 1fr}.legacy-passport-actions button{min-height:48px;font-size:12px}.legacy-passport-actions button:only-child{grid-column:1/-1}.legacy-trail-grid{display:flex;overflow-x:auto;overscroll-behavior-inline:contain;scroll-snap-type:x proximity;padding:1px 1px 7px}.legacy-trail-card{flex:0 0 76vw;min-height:148px;scroll-snap-align:start}.legacy-trail-player{grid-template-columns:1fr}.legacy-trail-actions{display:grid;grid-template-columns:repeat(3,1fr)}.legacy-trail-actions button{min-height:48px;font-size:12px}}
    @media(max-width:430px){.legacy-trail-card{flex-basis:82vw}.legacy-trail-actions{grid-template-columns:1fr 1fr}.legacy-trail-actions [data-legacy-trail-exit]{grid-column:1/-1}.legacy-trails-head h2{font-size:24px}.legacy-passport-actions{grid-template-columns:1fr}}
    @media(prefers-reduced-motion:reduce){.legacy-trail-progress-bar span,.legacy-passport-meter span{transition:none}.legacy-trail-grid{scroll-behavior:auto}}
    @media(forced-colors:active){.legacy-trails,.legacy-passport,.legacy-trail-card,.legacy-trail-player,.legacy-passport-actions button,.legacy-trail-actions button{border:1px solid CanvasText}.legacy-trail-card:before,.legacy-trail-progress-bar span,.legacy-passport-meter span{background:CanvasText}.legacy-finder-match[data-legacy-trail-focus]:focus-visible{outline:3px solid Highlight}}
  `;
  document.head.append(style);
}

function trailMarkup(){
  return `<section class="legacy-trails" data-legacy-trails data-version="${TRAIL_VERSION}" aria-labelledby="legacy-trails-title"><div class="legacy-trails-head"><div><small>Curated museum paths</small><h2 id="legacy-trails-title">Legacy Trails</h2></div><p>Pick an era and move through connected Story, Moments, Legends, Records and Heritage stops without losing your place.</p></div><div data-legacy-passport aria-live="polite"></div><div class="legacy-trail-grid" role="group" aria-label="Choose a Legacy Trail">${trails.map(trail=>`<button type="button" class="legacy-trail-card" data-legacy-trail="${trail.id}" data-trail-tone="${trail.tone}" aria-pressed="false"><small>${trail.eyebrow}</small><strong>${trail.title}</strong><span>${trail.summary}</span><em>${trail.stops.length} stops</em></button>`).join('')}</div><div class="legacy-trail-player" data-legacy-trail-player hidden aria-live="polite"></div></section>`;
}

function passportMarkup(passport){
  const stamps=passport.visited.length;
  const completed=completedTrailCount(passport);
  const next=nextPassportStop(passport);
  const pct=Math.round((stamps/TOTAL_STOPS)*100);
  const storage=passport.available?'Saved on this browser only':'Storage unavailable · progress lasts this visit only';
  const helper='Guided Trail stamps only · normal Legacy searches never change progress.';
  const actions=`${next?`<button type="button" data-legacy-passport-continue data-trail="${next.trail.id}" data-step="${next.index}">Continue ${next.trail.title}</button>`:''}${stamps?'<button type="button" data-legacy-passport-reset>Reset passport</button>':''}`;
  return `<div class="legacy-passport"><div><small>Museum Passport</small><strong>${stamps} / ${TOTAL_STOPS} stamps</strong><span>${completed} / ${trails.length} trails complete · ${storage}</span><span>${helper}</span><div class="legacy-passport-meter" aria-hidden="true"><span style="width:${pct}%"></span></div></div>${actions?`<div class="legacy-passport-actions">${actions}</div>`:''}</div>`;
}

function playerMarkup(trail,step){
  const stop=trail.stops[step];
  const pct=Math.round(((step+1)/trail.stops.length)*100);
  const nextAction=step===trail.stops.length-1?'<button type="button" data-legacy-trail-finish>Finish trail</button>':'<button type="button" data-legacy-trail-next>Next →</button>';
  return `<div><small>${trail.eyebrow} · ${trail.title}</small><h3>${stop.label}</h3><div class="legacy-trail-progress"><div class="legacy-trail-progress-bar" aria-hidden="true"><span style="width:${pct}%"></span></div><strong>STOP ${step+1} / ${trail.stops.length}</strong></div><div class="legacy-trail-stop">Showing this stop through Legacy Finder · ${stop.scope}</div></div><div class="legacy-trail-actions"><button type="button" data-legacy-trail-prev ${step===0?'disabled':''}>← Previous</button>${nextAction}<button type="button" data-legacy-trail-exit>Exit trail</button></div>`;
}

function clearTrailDestinationFocus(page){
  page.querySelectorAll('[data-legacy-trail-focus]').forEach(node=>{
    delete node.dataset.legacyTrailFocus;
    if(node.dataset.legacyTrailTabindexAdded==='true'){
      node.removeAttribute('tabindex');
      delete node.dataset.legacyTrailTabindexAdded;
    }
  });
}

function focusTrailDestination(page,target){
  clearTrailDestinationFocus(page);
  target.dataset.legacyTrailFocus='true';
  if(!target.hasAttribute('tabindex')){
    target.setAttribute('tabindex','-1');
    target.dataset.legacyTrailTabindexAdded='true';
  }
  try{target.focus({preventScroll:true});}catch{target.focus();}
}

function focusTrailChooser(root,trailId){
  if(!trailId)return;
  const chooser=root.querySelector(`[data-legacy-trail="${trailId}"]`);
  if(!chooser)return;
  try{chooser.focus({preventScroll:true});}catch{chooser.focus();}
}

function focusPassportPrimary(passportHost){
  const target=passportHost.querySelector('[data-legacy-passport-continue]');
  if(!target)return;
  try{target.focus({preventScroll:true});}catch{target.focus();}
}

function scrollToMatch(page){
  const target=page.querySelector('.legacy-finder-match');
  if(!target)return;
  const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});
  focusTrailDestination(page,target);
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
  const passportHost=root.querySelector('[data-legacy-passport]');
  let active=null;
  let step=0;
  let internal=false;
  let passport=readPassport();

  const paint=()=>{
    passportHost.innerHTML=passportMarkup(passport);
    root.querySelectorAll('[data-legacy-trail]').forEach(button=>{
      const trail=trailById(button.dataset.legacyTrail);
      const count=trail?trailStampCount(passport,trail):0;
      const complete=Boolean(trail&&count===trail.stops.length);
      button.setAttribute('aria-pressed',String(active&&button.dataset.legacyTrail===active.id));
      button.dataset.passportComplete=String(complete);
      if(trail)button.setAttribute('aria-label',`${trail.title}, ${count} of ${trail.stops.length} stops stamped`);
      const marker=button.querySelector('em');
      if(marker&&trail)marker.textContent=complete?'Complete':`${count}/${trail.stops.length} stamped`;
    });
    if(!active){player.hidden=true;player.innerHTML='';return;}
    player.hidden=false;player.innerHTML=playerMarkup(active,step);
  };

  const deactivate=({clearFinder=true,syncUrl=true}={})=>{
    clearTrailDestinationFocus(page);
    active=null;step=0;paint();
    if(syncUrl)writeTrailState(null,0);
    if(clearFinder){internal=true;controller.apply({q:'',scope:'all'});internal=false;}
  };

  const activate=(trailId,nextStep=0,{syncUrl=true,scroll=true,record=true}={})=>{
    const trail=trailById(trailId);
    if(!trail){deactivate({clearFinder:false,syncUrl});return;}
    active=trail;
    step=Math.min(Math.max(Number(nextStep)||0,0),trail.stops.length-1);
    if(record)passport=stampPassport(passport,active,step);
    paint();
    if(syncUrl)writeTrailState(active.id,step);
    const stop=active.stops[step];
    internal=true;controller.apply({q:stop.q,scope:stop.scope});internal=false;
    if(scroll)requestAnimationFrame(()=>scrollToMatch(page));
  };

  root.addEventListener('click',event=>{
    const continueButton=event.target.closest('[data-legacy-passport-continue]');
    if(continueButton){activate(continueButton.dataset.trail,Number.parseInt(continueButton.dataset.step||'0',10));return;}
    if(event.target.closest('[data-legacy-passport-reset]')){
      if(globalThis.confirm?.('Reset your Legacy Museum Passport on this browser?')){
        passport=resetPassport();
        paint();
        focusPassportPrimary(passportHost);
      }
      return;
    }
    const card=event.target.closest('[data-legacy-trail]');
    if(card){activate(card.dataset.legacyTrail,0);return;}
    if(event.target.closest('[data-legacy-trail-prev]')&&active&&step>0){activate(active.id,step-1);return;}
    if(event.target.closest('[data-legacy-trail-next]')&&active&&step<active.stops.length-1){activate(active.id,step+1);return;}
    if(event.target.closest('[data-legacy-trail-finish]')&&active&&step===active.stops.length-1){
      const trailId=active.id;
      deactivate();
      focusTrailChooser(root,trailId);
      return;
    }
    if(event.target.closest('[data-legacy-trail-exit]')){
      const trailId=active?.id||null;
      deactivate();
      focusTrailChooser(root,trailId);
    }
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
  page.dataset.legacyPassportReady='true';
  page._legacyTrails={activate,deactivate,getState:()=>({trail:active?.id||null,step}),getPassport:()=>({...passport,visited:[...passport.visited]})};
  return root;
}
