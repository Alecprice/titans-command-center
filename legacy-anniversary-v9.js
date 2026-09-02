const VERSION='9.0.0';
const MAX_ITEMS=3;
const DAY_MS=86400000;
const MONTHS=new Map([
  ['Jan',0],['Feb',1],['Mar',2],['Apr',3],['May',4],['Jun',5],
  ['Jul',6],['Aug',7],['Sep',8],['Oct',9],['Nov',10],['Dec',11]
]);

const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function parseMomentDate(value){
  const match=/^([A-Z][a-z]{2})\.\s+(\d{1,2}),\s+(\d{4})$/.exec(String(value||'').trim());
  if(!match)return null;
  const month=MONTHS.get(match[1]);
  const day=Number(match[2]);
  const year=Number(match[3]);
  if(month===undefined||!Number.isInteger(day)||day<1||day>31||!Number.isInteger(year))return null;
  const check=new Date(Date.UTC(year,month,day));
  if(check.getUTCFullYear()!==year||check.getUTCMonth()!==month||check.getUTCDate()!==day)return null;
  return {month,day,year};
}

function nextOccurrence(parsed,now=new Date()){
  const today=Date.UTC(now.getFullYear(),now.getMonth(),now.getDate());
  let occurrenceYear=now.getFullYear();
  let target=Date.UTC(occurrenceYear,parsed.month,parsed.day);
  if(target<today){occurrenceYear+=1;target=Date.UTC(occurrenceYear,parsed.month,parsed.day);}
  return {days:Math.round((target-today)/DAY_MS),occurrenceYear};
}

function proximityLabel(days){
  if(days===0)return'Today in franchise history';
  if(days===1)return'Tomorrow in franchise history';
  return `In ${days} days`;
}

function collectMoments(page,now=new Date()){
  return [...page.querySelectorAll('.legacy-moment-card')].map((card,index)=>{
    const dateText=card.querySelector('.legacy-moment-date')?.textContent?.trim()||'';
    const parsed=parseMomentDate(dateText);
    if(!parsed)return null;
    const occurrence=nextOccurrence(parsed,now);
    return {
      card,index,dateText,days:occurrence.days,
      title:card.querySelector('h3')?.textContent?.trim()||'Legacy moment',
      label:card.querySelector('small')?.textContent?.trim()||'Franchise moment'
    };
  }).filter(Boolean).sort((a,b)=>a.days-b.days||a.index-b.index).slice(0,MAX_ITEMS);
}

function ensureStyle(){
  if(document.getElementById('legacy-anniversary-v9-style'))return;
  const style=document.createElement('style');
  style.id='legacy-anniversary-v9-style';
  style.textContent=`
    .legacy-anniversary-lens{display:grid;gap:16px;padding:22px 24px;background:linear-gradient(135deg,#eef7fd,#fff 58%,#f7f3ea);border:1px solid rgba(0,33,68,.14);border-left:6px solid var(--retro-blue,#4a95ce);box-shadow:0 10px 28px rgba(0,33,68,.07)}
    .legacy-anniversary-head{display:grid;grid-template-columns:minmax(0,.72fr) minmax(300px,1.28fr);gap:20px;align-items:end}
    .legacy-anniversary-head small{display:block;margin-bottom:5px;color:var(--retro-red,#d5272c);font-size:8px;font-weight:950;letter-spacing:.16em;text-transform:uppercase}
    .legacy-anniversary-head h2{margin:0;color:var(--retro-navy,#002144);font-size:clamp(25px,2.7vw,36px);line-height:.98;letter-spacing:-.04em;text-transform:uppercase}
    .legacy-anniversary-head p{margin:0;color:#5e768b;font-size:10px;line-height:1.62}
    .legacy-anniversary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
    .legacy-anniversary-card{display:grid;grid-template-rows:auto auto 1fr auto;gap:6px;min-width:0;padding:15px;background:#fff;border:1px solid rgba(0,33,68,.12);border-top:4px solid var(--retro-blue,#4a95ce)}
    .legacy-anniversary-card:first-child{border-top-color:var(--retro-red,#d5272c)}
    .legacy-anniversary-card>small{color:#2f76ad;font-size:8px;font-weight:950;letter-spacing:.1em;text-transform:uppercase}
    .legacy-anniversary-card strong{color:var(--retro-navy,#002144);font-size:15px;line-height:1.14}
    .legacy-anniversary-card span{color:#667d91;font-size:9px;line-height:1.5}
    .legacy-anniversary-card button{min-height:44px;width:100%;border:1px solid rgba(0,33,68,.18);background:#f2f7fb;color:var(--retro-navy,#002144);padding:9px 11px;font-size:8px;font-weight:950;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
    .legacy-anniversary-card button:hover{background:var(--retro-navy,#002144);color:#fff}
    .legacy-anniversary-card button:focus-visible{outline:3px solid var(--titans-red,#c8102e);outline-offset:3px}
    @media(max-width:760px){.legacy-anniversary-head{grid-template-columns:1fr}.legacy-anniversary-head small{font-size:12px;line-height:1.35}.legacy-anniversary-head p{font-size:14px;line-height:1.6}.legacy-anniversary-grid{grid-template-columns:1fr}.legacy-anniversary-card>small{font-size:12px;line-height:1.35}.legacy-anniversary-card strong{font-size:16px;line-height:1.2}.legacy-anniversary-card span{font-size:13px;line-height:1.5}.legacy-anniversary-card button{min-height:48px;font-size:12px;line-height:1.25}}
    @media(prefers-reduced-motion:reduce){.legacy-anniversary-card button{transition:none}}
    @media(forced-colors:active){.legacy-anniversary-lens,.legacy-anniversary-card,.legacy-anniversary-card button{border:1px solid CanvasText}.legacy-anniversary-card button:focus-visible{outline:3px solid Highlight}}
  `;
  document.head.append(style);
}

function markup(items){
  return `<section class="legacy-anniversary-lens" data-legacy-anniversary data-version="${VERSION}" aria-labelledby="legacy-anniversary-title">
    <div class="legacy-anniversary-head">
      <div><small>Calendar lens · rendered museum dates only</small><h2 id="legacy-anniversary-title">Next in Titans history</h2></div>
      <p>Upcoming calendar reminders are calculated only from exact dates already shown in Iconic Moments. Season-only entries are not converted into made-up dates.</p>
    </div>
    <div class="legacy-anniversary-grid">${items.map(item=>`<article class="legacy-anniversary-card"><small>${esc(proximityLabel(item.days))} · ${esc(item.dateText)}</small><strong>${esc(item.title)}</strong><span>${esc(item.label)}</span><button type="button" data-legacy-anniversary-open="${item.index}" aria-label="Open Legacy exhibit: ${esc(item.title)}">Open exhibit</button></article>`).join('')}</div>
  </section>`;
}

function openMoment(button){
  const page=button.closest('.legacy-page');
  if(!page)return;
  const index=Number(button.dataset.legacyAnniversaryOpen);
  const cards=[...page.querySelectorAll('.legacy-moment-card')];
  const card=Number.isInteger(index)?cards[index]:null;
  if(!card)return;
  const key=card.dataset.legacyExhibitKey||'';
  const controller=page._legacyFinderController;
  if(key&&controller?.focusExhibit){controller.focusExhibit(key,{syncUrl:true,scroll:true});return;}
  const reduced=matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  card.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});
  if(!card.hasAttribute('tabindex'))card.setAttribute('tabindex','-1');
  try{card.focus({preventScroll:true});}catch{card.focus();}
}

function ensureAnniversary(){
  if(route()!=='legacy')return false;
  const page=document.querySelector('.legacy-page[data-polished="true"]');
  if(!page)return false;
  if(page.querySelector('[data-legacy-anniversary]'))return true;
  const moments=page.querySelector('#legacy-moments');
  if(!moments)return false;
  const items=collectMoments(page);
  if(!items.length)return false;
  ensureStyle();
  moments.insertAdjacentHTML('beforebegin',markup(items));
  page.dataset.legacyAnniversaryReady='true';
  return true;
}

function scheduleEnsure(){
  let frame=0;
  const tick=()=>{
    if(ensureAnniversary()||frame++>=12)return;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

document.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-legacy-anniversary-open]');
  if(button){event.preventDefault();openMoment(button);}
});
addEventListener('hashchange',scheduleEnsure);
scheduleEnsure();
