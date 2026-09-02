const STYLE_ID='legacy-heritage-v3-styles';

const heritageSources={
  stadiumHistory:{
    label:'Titans stadium history',
    url:'https://www.tennesseetitans.com/history/stadium-history',
    role:'Official Oilers/Titans venue history, years, records and stadium milestones.'
  },
  ringOfHonor:{
    label:'Titans Ring of Honor',
    url:'https://www.tennesseetitans.com/history/hall-of-fame',
    role:'Official Oilers/Titans Ring of Honor membership and induction dates.'
  },
  teamHistory:{
    label:'Pro Football Hall of Fame team history',
    url:'https://www.profootballhof.com/teams/tennessee-titans/team-history',
    role:'Independent franchise-history cross-check including the Houston and Tennessee venue transitions.'
  },
  newStadium:{
    label:'Titans new stadium project',
    url:'https://www.tennesseetitans.com/new-stadium/info',
    role:'Official current project information for the New Nissan Stadium.'
  },
  farewell:{
    label:'Titans 2026 stadium update',
    url:'https://www.tennesseetitans.com/news/checking-in-with-titans-president-and-ceo-burke-nihill-from-the-nfl-owners-meetings',
    role:'Official March 2026 update describing the current Nissan Stadium farewell season and 2027 opening timeline.'
  }
};

const venues=[
  {index:'01',city:'Houston',name:'Jeppesen Stadium',years:'1960–1964',record:'26–11',tag:'First home',copy:'The franchise opened here and won the inaugural AFL Championship on Jan. 1, 1961.',sourceKeys:['stadiumHistory','teamHistory']},
  {index:'02',city:'Houston',name:'Rice Stadium',years:'1965–1967',record:'11–10',tag:'AFL transition',copy:'A three-season stop that ended with Houston back on top of the AFL Eastern Division in 1967.',sourceKeys:['stadiumHistory']},
  {index:'03',city:'Houston',name:'Astrodome',years:'1968–1996',record:'113–103–2',tag:'Luv Ya Blue home',copy:'The Oilers moved indoors for 29 seasons, spanning Earl Campbell, Warren Moon and the Run-and-Shoot years.',sourceKeys:['stadiumHistory','teamHistory']},
  {index:'04',city:'Memphis',name:'Liberty Bowl',years:'1997',record:'6–2',tag:'First Tennessee season',copy:'The Tennessee Oilers debuted here, opening with an overtime win over Oakland and a 216-yard Eddie George game.',sourceKeys:['stadiumHistory']},
  {index:'05',city:'Nashville',name:'Dudley Field / Vanderbilt Stadium',years:'1998',record:'3–5',tag:'First Nashville home',copy:'Steve McNair found Frank Wycheck for the franchise’s first touchdown in Nashville during the one-season stay.',sourceKeys:['stadiumHistory']},
  {index:'06',city:'Nashville',name:'Nissan Stadium',years:'1999–2026',record:'Farewell season',tag:'Titans era',copy:'Opened with the new Titans identity in 1999 and became the home of the Music City Miracle. The 2026 season is the building’s farewell campaign.',sourceKeys:['stadiumHistory','farewell']},
  {index:'07',city:'Nashville · East Bank',name:'New Nissan Stadium',years:'2027',record:'Scheduled',tag:'Next home',copy:'The enclosed East Bank stadium is scheduled to open in 2027, beginning the franchise’s next Nashville home-field chapter.',sourceKeys:['newStadium','farewell']}
];

const honors=[
  {name:'K.S. “Bud” Adams, Jr.',role:'Team Owner / Founder',years:'1959–2013',inducted:'2008',group:'leadership'},
  {name:'Elvin Bethea',role:'Defensive End',years:'1968–1983',inducted:'1999',group:'player'},
  {name:'George Blanda',role:'Quarterback / Kicker',years:'1960–1966',inducted:'1999',group:'player'},
  {name:'Robert Brazile',role:'Linebacker',years:'1975–1984',inducted:'2018',group:'player'},
  {name:'Earl Campbell',role:'Running Back',years:'1978–1984',inducted:'1999',group:'player'},
  {name:'Jeff Fisher',role:'Head Coach',years:'1994–2010',inducted:'2021',group:'coach'},
  {name:'Eddie George',role:'Running Back',years:'1996–2003',inducted:'2008',group:'player'},
  {name:'Mike Holovak',role:'General Manager',years:'1981–1999',inducted:'1999',group:'leadership'},
  {name:'Ken Houston',role:'Safety',years:'1967–1972',inducted:'1999',group:'player'},
  {name:'Billy “White Shoes” Johnson',role:'Wide Receiver',years:'1974–1980',inducted:'2023',group:'player'},
  {name:'Mike Keith',role:'Voice of the Titans',years:'1998–2024',inducted:'2025',group:'broadcast'},
  {name:'Bruce Matthews',role:'Offensive Lineman',years:'1983–2002',inducted:'2002',group:'player'},
  {name:'Steve McNair',role:'Quarterback',years:'1995–2005',inducted:'2008',group:'player'},
  {name:'Warren Moon',role:'Quarterback',years:'1984–1993',inducted:'2006',group:'player'},
  {name:'Mike Munchak',role:'Guard',years:'1982–1993',inducted:'1999',group:'player'},
  {name:'Jim Norton',role:'Safety / Punter',years:'1960–1968',inducted:'1999',group:'player'},
  {name:'O.A. “Bum” Phillips',role:'Head Coach',years:'1975–1980',inducted:'2021',group:'coach'},
  {name:'Floyd Reese',role:'General Manager',years:'1986–2006',inducted:'2021',group:'leadership'},
  {name:'Frank Wycheck',role:'Tight End',years:'1995–2003',inducted:'2008',group:'player'}
];

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const initials=name=>name.replace(/[^A-Za-zÀ-ÿ\s]/g,' ').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();

function sourceLinks(keys){
  return (keys||[]).map(key=>heritageSources[key]).filter(Boolean).map(source=>`<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer" title="${esc(source.role)}">${esc(source.label)} ↗</a>`).join('');
}

function injectStyles(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
    .legacy-heritage-section{position:relative;overflow:hidden}
    .legacy-heritage-intro{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(220px,.8fr);gap:18px;margin:14px 0 18px;padding:18px;border:1px solid rgba(0,33,68,.13);background:linear-gradient(135deg,#f7f3ea 0 68%,#e7f4fb 68% 100%)}
    .legacy-heritage-intro strong{display:block;color:var(--retro-navy,#002144);font-size:20px;line-height:1.05;text-transform:uppercase}
    .legacy-heritage-intro p{margin:7px 0 0;color:#52697d;font-size:12px;line-height:1.55}
    .legacy-heritage-now{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .legacy-heritage-now div{padding:11px;border:1px solid rgba(0,33,68,.12);background:rgba(255,255,255,.82)}
    .legacy-heritage-now small,.legacy-heritage-now strong{display:block}
    .legacy-heritage-now small{color:#6b8092;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
    .legacy-heritage-now strong{margin-top:4px;font-size:16px}
    .legacy-venue-scroll-cue{margin:0 0 7px;color:#60788d;font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
    .legacy-venue-grid{display:grid;grid-template-columns:repeat(7,minmax(180px,1fr));gap:10px;overflow-x:auto;overscroll-behavior-inline:contain;scroll-snap-type:x proximity;padding:2px 1px 10px;scrollbar-width:thin}
    .legacy-venue-grid:focus-visible{outline:3px solid rgba(74,149,206,.55);outline-offset:3px}
    .legacy-venue-card{min-height:232px;scroll-snap-align:start;position:relative;padding:15px 14px 13px;border:1px solid rgba(0,33,68,.15);background:#fff;box-shadow:0 8px 20px rgba(0,33,68,.06)}
    .legacy-venue-card:before{content:"";position:absolute;left:0;right:0;top:0;height:4px;background:var(--retro-blue,#4b92db)}
    .legacy-venue-card[data-venue-future="true"]:before{background:linear-gradient(90deg,var(--retro-blue,#4b92db),var(--retro-red,#c8102e))}
    .legacy-venue-index{display:flex;justify-content:space-between;gap:8px;color:#73889b;font-size:10px;font-weight:950;letter-spacing:.1em;text-transform:uppercase}
    .legacy-venue-card h3{margin:13px 0 2px;color:var(--retro-navy,#002144);font-size:17px;line-height:1.05;text-transform:uppercase}
    .legacy-venue-city{color:var(--retro-red,#c8102e);font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.1em}
    .legacy-venue-years{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:12px 0 9px;padding:8px 0;border-top:1px solid rgba(0,33,68,.1);border-bottom:1px solid rgba(0,33,68,.1)}
    .legacy-venue-years strong{color:var(--retro-navy,#002144);font-size:12px}.legacy-venue-years span{color:#60788d;font-size:11px}
    .legacy-venue-card p{margin:0;color:#5c7184;font-size:12px;line-height:1.5}
    .legacy-heritage-sources{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
    .legacy-heritage-sources a{display:inline-flex;align-items:center;min-height:44px;padding:0 10px;border:1px solid rgba(0,33,68,.14);background:#f7fafc;color:#4f6c83;font-size:11px;font-weight:850;line-height:1.25;text-decoration:none}
    .legacy-heritage-sources a:hover{background:var(--retro-navy,#002144);border-color:var(--retro-navy,#002144);color:#fff}
    .legacy-honors-wrap{margin-top:28px;padding-top:22px;border-top:1px solid rgba(0,33,68,.15)}
    .legacy-honors-head{display:flex;justify-content:space-between;gap:20px;align-items:end}
    .legacy-honors-head small{color:var(--retro-red,#c8102e);font-size:10px;font-weight:950;letter-spacing:.13em;text-transform:uppercase}
    .legacy-honors-head h3{margin:5px 0 0;color:var(--retro-navy,#002144);font-size:24px;line-height:1;text-transform:uppercase}
    .legacy-honors-head p{max-width:560px;margin:0;color:#607487;font-size:12px;line-height:1.5}
    .legacy-honor-filters{display:flex;gap:7px;flex-wrap:wrap;margin:13px 0}
    .legacy-honor-filters button{min-height:44px;padding:0 12px;border:1px solid rgba(0,33,68,.16);background:#fff;color:var(--retro-navy,#002144);font-size:11px;font-weight:950;text-transform:uppercase;letter-spacing:.06em;cursor:pointer}
    .legacy-honor-filters button[aria-pressed="true"]{background:var(--retro-navy,#002144);border-color:var(--retro-navy,#002144);color:#fff}
    .legacy-honor-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}
    .legacy-honor-card{display:grid;grid-template-columns:46px 1fr;gap:10px;min-height:112px;padding:12px;border:1px solid rgba(0,33,68,.13);background:#fff}
    .legacy-honor-monogram{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:#e9f5fc;color:var(--retro-navy,#002144);font-size:12px;font-weight:950}
    .legacy-honor-card h4{margin:0;color:var(--retro-navy,#002144);font-size:14px;line-height:1.15}.legacy-honor-card p{margin:4px 0;color:#5f7488;font-size:11px;line-height:1.35}
    .legacy-honor-card small{display:block;color:#7a8c9b;font-size:10px}.legacy-honor-card strong{display:block;margin-top:5px;color:var(--retro-red,#c8102e);font-size:10px;text-transform:uppercase}
    .legacy-honor-source{margin-top:12px}
    .legacy-honor-card[hidden]{display:none!important}
    .legacy-honor-filters button:focus-visible,.legacy-heritage-sources a:focus-visible{outline:3px solid rgba(74,149,206,.38);outline-offset:2px}
    @media(max-width:1000px){.legacy-honor-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media(max-width:760px){.legacy-heritage-intro{grid-template-columns:1fr;padding:14px}.legacy-heritage-now{grid-template-columns:1fr 1fr}.legacy-heritage-now small{font-size:12px}.legacy-venue-scroll-cue{font-size:12px}.legacy-venue-grid{grid-template-columns:repeat(7,82vw)}.legacy-venue-card{min-height:220px}.legacy-venue-index,.legacy-venue-city{font-size:12px}.legacy-honors-head{display:block}.legacy-honors-head small{font-size:12px}.legacy-honors-head p{margin-top:8px}.legacy-heritage-sources a{min-height:48px!important;font-size:12px}.legacy-honor-filters{overflow-x:auto;flex-wrap:nowrap;padding-bottom:5px;scrollbar-width:none}.legacy-honor-filters::-webkit-scrollbar{display:none}.legacy-honor-filters button{min-height:48px;flex:0 0 auto;font-size:13px}.legacy-honor-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.legacy-honor-card p{font-size:13px}.legacy-honor-card small,.legacy-honor-card strong{font-size:12px}}
    @media(max-width:430px){.legacy-heritage-now{grid-template-columns:1fr}.legacy-venue-grid{grid-template-columns:repeat(7,86vw)}.legacy-honor-grid{grid-template-columns:1fr}.legacy-honor-card{min-height:104px}}
    @media(prefers-reduced-motion:reduce){.legacy-venue-grid{scroll-behavior:auto}.legacy-heritage-section *{transition:none!important}}
    @media(forced-colors:active){.legacy-venue-card,.legacy-honor-card,.legacy-heritage-intro,.legacy-honor-filters button,.legacy-heritage-sources a{border:1px solid CanvasText}.legacy-venue-card:before{background:CanvasText}.legacy-venue-grid:focus-visible{outline:3px solid Highlight}}
  `;
  document.head.append(style);
}

function venueCard(item){
  const future=item.name==='New Nissan Stadium';
  return `<article class="legacy-venue-card" data-venue-future="${future}">
    <div class="legacy-venue-index"><span>${esc(item.index)} · ${esc(item.tag)}</span><span>${esc(item.city)}</span></div>
    <h3>${esc(item.name)}</h3><div class="legacy-venue-city">${esc(item.city)}</div>
    <div class="legacy-venue-years"><strong>${esc(item.years)}</strong><span>${esc(item.record)}</span></div>
    <p>${esc(item.copy)}</p><div class="legacy-heritage-sources">${sourceLinks(item.sourceKeys)}</div>
  </article>`;
}

function honorCard(item){
  return `<article class="legacy-honor-card" data-heritage-role="${esc(item.group)}">
    <div class="legacy-honor-monogram" aria-hidden="true">${esc(initials(item.name))}</div>
    <div><h4>${esc(item.name)}</h4><p>${esc(item.role)} · ${esc(item.years)}</p><small>Ring of Honor</small><strong>Inducted ${esc(item.inducted)}</strong></div>
  </article>`;
}

function heritageMarkup(){
  return `<section class="legacy-museum-section legacy-heritage-section" id="legacy-heritage">
    <div class="legacy-museum-section-head"><div><small>05 · Franchise heritage</small><h2>Where the story lived</h2></div><p>Seven home-field chapters trace the franchise from Houston’s AFL launch through the 2026 Nissan Stadium farewell season and the scheduled 2027 move next door.</p></div>
    <div class="legacy-heritage-intro">
      <div><strong>Houston → Memphis → Nashville → the next East Bank home.</strong><p>The venue changes explain more than geography. They mark the AFL titles, Luv Ya Blue, the Tennessee Oilers transition, the Music City Miracle and the next stadium era.</p><div class="legacy-heritage-sources">${sourceLinks(['stadiumHistory','teamHistory'])}</div></div>
      <div class="legacy-heritage-now"><div><small>2026</small><strong>Farewell season</strong></div><div><small>2027</small><strong>New Nissan Stadium</strong></div></div>
    </div>
    <p class="legacy-venue-scroll-cue" id="legacy-venue-scroll-cue">Scroll horizontally to explore all seven home fields →</p>
    <div class="legacy-venue-grid" role="region" tabindex="0" aria-label="Oilers and Titans home stadium timeline" aria-describedby="legacy-venue-scroll-cue">${venues.map(venueCard).join('')}</div>
    <div class="legacy-honors-wrap">
      <div class="legacy-honors-head"><div><small>Franchise immortals</small><h3>Ring of Honor · 19</h3></div><p>The franchise’s Ring of Honor recognizes players, coaches, executives, its founder and the Voice of the Titans. Mike Keith became the newest member in 2025.</p></div>
      <div class="legacy-honor-filters" role="group" aria-label="Filter Ring of Honor members">
        <button type="button" data-heritage-honor-filter="all" aria-pressed="true">All 19</button>
        <button type="button" data-heritage-honor-filter="player" aria-pressed="false">Players</button>
        <button type="button" data-heritage-honor-filter="coach" aria-pressed="false">Coaches</button>
        <button type="button" data-heritage-honor-filter="leadership" aria-pressed="false">Leadership</button>
        <button type="button" data-heritage-honor-filter="broadcast" aria-pressed="false">Broadcast</button>
      </div>
      <div class="legacy-honor-grid">${honors.map(honorCard).join('')}</div>
      <div class="legacy-heritage-sources legacy-honor-source">${sourceLinks(['ringOfHonor'])}</div>
    </div>
  </section>`;
}

function bindHonorFilters(page){
  if(page.dataset.legacyHeritageBound)return;
  page.dataset.legacyHeritageBound='true';
  page.addEventListener('click',event=>{
    const button=event.target.closest('[data-heritage-honor-filter]');
    if(!button||!page.contains(button))return;
    const filter=button.dataset.heritageHonorFilter||'all';
    page.querySelectorAll('[data-heritage-honor-filter]').forEach(candidate=>{
      candidate.setAttribute('aria-pressed',String(candidate===button));
    });
    page.querySelectorAll('.legacy-honor-card').forEach(card=>{
      card.hidden=filter!=='all'&&card.dataset.heritageRole!==filter;
    });
  });
}

export function ensureLegacyHeritage(page){
  if(!page)return null;
  injectStyles();
  let section=page.querySelector('#legacy-heritage');
  if(!section){
    const identity=page.querySelector('#legacy-identity');
    if(!identity)return null;
    identity.insertAdjacentHTML('beforebegin',heritageMarkup());
    section=page.querySelector('#legacy-heritage');
    const identityKicker=identity.querySelector('.legacy-museum-section-head small');
    if(identityKicker)identityKicker.textContent='06 · Identity vault';
    const jump=page.querySelector('.legacy-museum-jump');
    const identityJump=jump?.querySelector('[data-legacy-scroll="legacy-identity"]');
    if(jump&&!jump.querySelector('[data-legacy-scroll="legacy-heritage"]')){
      const button=document.createElement('button');
      button.type='button';
      button.dataset.legacyScroll='legacy-heritage';
      button.textContent='Heritage';
      if(identityJump)jump.insertBefore(button,identityJump);else jump.append(button);
    }
  }
  bindHonorFilters(page);
  return section;
}