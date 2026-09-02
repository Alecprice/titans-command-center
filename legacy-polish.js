import { VISUAL_AUDIT_DATE, legacyTimeline, visualArchive, knownVisualsNotPictured, visualSources, sourcesFor } from './src/visual-audit.mjs';

const lEsc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const legacyHistorySources={
  titansHistory:{
    label:'Titans franchise history',
    url:'https://www.tennesseetitans.com/history/',
    role:'Official Titans overview of the Houston Oilers and Tennessee Titans franchise.'
  },
  historicalHighlights:{
    label:'Titans historical highlights',
    url:'https://www.tennesseetitans.com/history/historical-highlights',
    role:'Official season-by-season milestone chronology.'
  },
  retiredNumbers:{
    label:'Titans retired numbers',
    url:'https://www.tennesseetitans.com/history/retired-jersey-numbers',
    role:'Official player biographies and retired-number records.'
  },
  hallFacts:{
    label:'Pro Football Hall of Fame team facts',
    url:'https://www.profootballhof.com/teams/tennessee-titans/team-facts',
    role:'Stable franchise facts, championships and career record leaders.'
  },
  hallHistory:{
    label:'Pro Football Hall of Fame team history',
    url:'https://www.profootballhof.com/teams/tennessee-titans/team-history',
    role:'Independent historical cross-check of franchise eras and postseason runs.'
  },
  musicCityMiracle:{
    label:'Titans — Music City Miracle',
    url:'https://www.tennesseetitans.com/news/former-bills-coaches-haunted-by-music-city-miracle-16786892',
    role:'Official Titans account of the Jan. 8, 2000 Wild Card finish.'
  },
  henry2020:{
    label:'Titans — Henry 2,027 yards',
    url:'https://www.tennesseetitans.com/news/titans-rb-derrick-henry-named-first-team-ap-all-pro',
    role:'Official Titans record of Derrick Henry’s 2,027-yard 2020 season.'
  },
  oilersEras:{
    label:'Titans — Oilers eras',
    url:'https://www.tennesseetitans.com/news/franchise-legend-dan-pastorini-inducted-into-houston-sports-hall-of-fame',
    role:'Official Titans overview of the AFL-title, Luv Ya Blue and Run-and-Shoot Oilers eras.'
  }
};

const legacyQuickFacts=[
  {value:'1960',label:'First season',note:'Houston Oilers'},
  {value:'2',label:'AFL titles',note:'1960 · 1961'},
  {value:'1999',label:'AFC champions',note:'First Super Bowl berth'},
  {value:'8',label:'Retired numbers',note:'Franchise greats'}
];

const legacyStory=[
  {
    id:'afl-foundation',range:'1960–1961',group:'houston',eyebrow:'The beginning',title:'The AFL started with Houston on top.',
    copy:'The Oilers were a charter AFL franchise and became the league’s first champions. Houston won the 1960 AFL Championship and repeated in 1961, giving the franchise its two league titles in its first two seasons.',
    tags:['George Blanda','Billy Cannon','Back-to-back champions'],sourceKeys:['hallFacts','historicalHighlights']
  },
  {
    id:'luv-ya-blue',range:'1975–1980',group:'houston',eyebrow:'Luv Ya Blue',title:'Bum, Earl and one of Houston’s defining football eras.',
    copy:'The late-1970s Oilers became a fan-culture phenomenon under Bum Phillips. Earl Campbell powered the identity on the field, leading the NFL in rushing in each of his first three seasons from 1978 through 1980.',
    tags:['Bum Phillips','Earl Campbell','Houston Astrodome'],sourceKeys:['oilersEras','retiredNumbers']
  },
  {
    id:'moon-run-shoot',range:'1984–1993',group:'houston',eyebrow:'Run-and-Shoot years',title:'Warren Moon took the Oilers into a seven-year playoff run.',
    copy:'Moon’s 33,685 passing yards remain the franchise career record. Houston reached the postseason seven consecutive seasons from 1987 through 1993, the longest playoff streak in franchise history.',
    tags:['Warren Moon','Seven straight playoffs','Run-and-Shoot'],sourceKeys:['retiredNumbers','oilersEras']
  },
  {
    id:'tennessee-oilers',range:'1997–1998',group:'tennessee',eyebrow:'The move',title:'The franchise arrived in Tennessee before the Titans name did.',
    copy:'The organization relocated from Houston in 1997 and played two seasons as the Tennessee Oilers. That transition is part of the same franchise lineage—not a separate expansion story.',
    tags:['Tennessee Oilers','1997 relocation','Franchise continuity'],sourceKeys:['hallFacts','hallHistory']
  },
  {
    id:'titans-arrive',range:'1999–2003',group:'tennessee',eyebrow:'Titans era begins',title:'New name. New stadium. An immediate run to the Super Bowl.',
    copy:'The Titans identity debuted in 1999. The first playoff game under the new name produced the Music City Miracle, and Tennessee then beat Jacksonville for the AFC championship before finishing one yard short in Super Bowl XXXIV.',
    tags:['Steve McNair','Eddie George','Music City Miracle','AFC champions'],sourceKeys:['historicalHighlights','musicCityMiracle','hallFacts']
  },
  {
    id:'rushing-kings',range:'2009–2020',group:'modern',eyebrow:'2K club',title:'Two Titans backs reset the franchise rushing ceiling.',
    copy:'Chris Johnson rushed for 2,006 yards in 2009. Derrick Henry surpassed that franchise mark with 2,027 yards in 2020, becoming the eighth player in NFL history at the time to reach 2,000 rushing yards in a season.',
    tags:['Chris Johnson','CJ2K','Derrick Henry','2,027 yards'],sourceKeys:['henry2020','hallFacts']
  },
  {
    id:'division-run',range:'2020–2021',group:'modern',eyebrow:'AFC South run',title:'Back-to-back division titles returned Tennessee to the top of the South.',
    copy:'The Titans won the AFC South in 2020 and 2021, adding to division championships in 2002 and 2008 and extending a Tennessee-era history built across multiple competitive windows.',
    tags:['AFC South','2020 champions','2021 champions'],sourceKeys:['hallFacts']
  }
];

const legacyMoments=[
  {date:'Jan. 1, 1961',label:'1960 AFL Championship',title:'The first champions',score:'HOU 24 · LA 16',copy:'Houston beat the Los Angeles Chargers to win the inaugural AFL championship.',sourceKeys:['historicalHighlights','hallFacts']},
  {date:'Dec. 24, 1961',label:'1961 AFL Championship',title:'Back-to-back',score:'HOU 10 · SD 3',copy:'The Oilers defended their title by beating the Chargers again, this time in San Diego.',sourceKeys:['historicalHighlights','hallFacts']},
  {date:'Jan. 8, 2000',label:'AFC Wild Card',title:'Music City Miracle',score:'TEN 22 · BUF 16',copy:'Frank Wycheck’s lateral found Kevin Dyson, who went 75 yards for the winning touchdown with three seconds left.',sourceKeys:['musicCityMiracle','historicalHighlights']},
  {date:'Jan. 23, 2000',label:'AFC Championship',title:'Tennessee punches its Super Bowl ticket',score:'TEN 33 · JAX 14',copy:'The Titans beat Jacksonville for the third time that season and reached the first Super Bowl in franchise history.',sourceKeys:['historicalHighlights','hallFacts']},
  {date:'Jan. 30, 2000',label:'Super Bowl XXXIV',title:'One yard short',score:'STL 23 · TEN 16',copy:'Tennessee erased a 16-point deficit, but Kevin Dyson was stopped at the one-yard line on the final play.',sourceKeys:['historicalHighlights']},
  {date:'2020 season',label:'Rushing history',title:'King Henry reaches 2,027',score:'2,027 YDS',copy:'Derrick Henry set the franchise single-season rushing record and became the eighth 2,000-yard rusher in NFL history at the time.',sourceKeys:['henry2020']}
];

const legacyLegends=[
  {monogram:'GB',name:'George Blanda',role:'QB / K · 1960–1966',badge:'Foundation',copy:'Quarterback and kicker for the first two AFL championship teams; the first Oiler/Titan elected to the Pro Football Hall of Fame.',sourceKeys:['hallFacts']},
  {monogram:'EC',name:'Earl Campbell',role:'RB · 1978–1984',badge:'#34 retired',copy:'The centerpiece of Luv Ya Blue and a Hall of Famer who led the NFL in rushing in each of his first three seasons.',sourceKeys:['retiredNumbers']},
  {monogram:'WM',name:'Warren Moon',role:'QB · 1984–1993',badge:'#1 retired',copy:'Franchise career leader in passing yards and touchdown passes, and the quarterback of seven consecutive playoff teams.',sourceKeys:['retiredNumbers','hallFacts']},
  {monogram:'BM',name:'Bruce Matthews',role:'OL · 1983–2002',badge:'#74 retired',copy:'Played 296 games, earned 14 Pro Bowl selections and lined up at every offensive-line position across his Hall of Fame career.',sourceKeys:['retiredNumbers']},
  {monogram:'SM',name:'Steve McNair',role:'QB · 1995–2005',badge:'#9 retired',copy:'Air McNair led the 1999 Super Bowl run and shared the 2003 AP NFL MVP award after leading the league in passer rating.',sourceKeys:['retiredNumbers']},
  {monogram:'EG',name:'Eddie George',role:'RB · 1996–2003',badge:'#27 retired',copy:'The franchise’s career rushing leader with 10,009 yards and the durable engine of the first great Titans teams.',sourceKeys:['retiredNumbers','hallFacts']},
  {monogram:'CJ',name:'Chris Johnson',role:'RB · 2008–2013',badge:'CJ2K',copy:'Exploded for 2,006 rushing yards in 2009, setting the franchise single-season record that stood until Henry passed it in 2020.',sourceKeys:['henry2020']},
  {monogram:'DH',name:'Derrick Henry',role:'RB · 2016–2023',badge:'2,027 in 2020',copy:'The King set the current franchise single-season rushing record and powered another era of Titans football.',sourceKeys:['henry2020']}
];

const legacyRecords=[
  {value:'33,685',label:'Career passing yards',holder:'Warren Moon',note:'1984–1993'},
  {value:'10,009',label:'Career rushing yards',holder:'Eddie George',note:'1996–2003'},
  {value:'542',label:'Career receptions',holder:'Ernest Givins',note:'1986–1994'},
  {value:'1,060',label:'Career points',holder:'Al Del Greco',note:'1991–2000'},
  {value:'2,027',label:'Single-season rush yards',holder:'Derrick Henry',note:'2020'},
  {value:'296',label:'Games played',holder:'Bruce Matthews',note:'1983–2002'}
];

const retiredNumbers=[
  {number:'1',name:'Warren Moon',position:'QB'},
  {number:'9',name:'Steve McNair',position:'QB'},
  {number:'27',name:'Eddie George',position:'RB'},
  {number:'34',name:'Earl Campbell',position:'RB'},
  {number:'43',name:'Jim Norton',position:'S / P'},
  {number:'63',name:'Mike Munchak',position:'G'},
  {number:'65',name:'Elvin Bethea',position:'DE'},
  {number:'74',name:'Bruce Matthews',position:'OL'}
];

function sourceLinks(keys){
  return sourcesFor(keys).map(source=>`<a href="${lEsc(source.url)}" target="_blank" rel="noopener noreferrer" title="${lEsc(source.role)}">${lEsc(source.label)} ↗</a>`).join('');
}

function historySourceLinks(keys){
  return (keys||[]).map(key=>legacyHistorySources[key]).filter(Boolean).map(source=>`<a href="${lEsc(source.url)}" target="_blank" rel="noopener noreferrer" title="${lEsc(source.role)}">${lEsc(source.label)} ↗</a>`).join('');
}

function sectionHead(kicker,title,copy){
  return `<div class="legacy-museum-section-head"><div><small>${lEsc(kicker)}</small><h2>${lEsc(title)}</h2></div><p>${lEsc(copy)}</p></div>`;
}

function legacyHero(){
  return `<section class="legacy-museum-hero" aria-labelledby="legacy-museum-title">
    <div class="legacy-museum-hero-copy">
      <div class="legacy-museum-kicker">Houston roots · Tennessee home · 1960–present</div>
      <h2 id="legacy-museum-title">One franchise.<br><em>Every era.</em></h2>
      <p>This is the football story behind the marks: championships, heartbreak, cult heroes, retired numbers, record setters and the moments Titans fans still quote from memory.</p>
      <div class="legacy-museum-actions"><button type="button" class="legacy-museum-primary" data-legacy-scroll="legacy-story">Start the story ↓</button><a href="${lEsc(legacyHistorySources.titansHistory.url)}" target="_blank" rel="noopener noreferrer">Official franchise history ↗</a></div>
    </div>
    <div class="legacy-museum-hero-art" aria-label="Franchise identity transition from Oilers to the current Titans Shield">
      <div class="legacy-museum-mark legacy-museum-mark-oilers"><span>HOUSTON ROOTS</span><img src="/assets/archive/oilers-derrick.webp" alt="Representative Houston Oilers derrick reference" loading="eager" decoding="async"></div>
      <div class="legacy-museum-arrow" aria-hidden="true">→</div>
      <div class="legacy-museum-mark legacy-museum-mark-titans"><span>TENNESSEE NOW</span><img src="/assets/archive/current-shield-primary.webp" alt="Tennessee Titans current Shield logo" loading="eager" decoding="async"></div>
    </div>
    <div class="legacy-museum-facts" aria-label="Franchise legacy quick facts">${legacyQuickFacts.map(item=>`<div><strong>${lEsc(item.value)}</strong><span>${lEsc(item.label)}</span><small>${lEsc(item.note)}</small></div>`).join('')}</div>
  </section>`;
}

function legacyJumpNav(){
  return `<nav class="legacy-museum-jump" aria-label="Legacy section navigation">
    <span>Explore</span>
    <button type="button" data-legacy-scroll="legacy-story">Story</button>
    <button type="button" data-legacy-scroll="legacy-moments">Moments</button>
    <button type="button" data-legacy-scroll="legacy-legends">Legends</button>
    <button type="button" data-legacy-scroll="legacy-records">Records</button>
    <button type="button" data-legacy-scroll="legacy-identity">Identity vault</button>
  </nav>`;
}

function storyCard(item,index){
  return `<article class="legacy-story-card" data-legacy-era-group="${lEsc(item.group)}">
    <div class="legacy-story-index" aria-hidden="true">${String(index+1).padStart(2,'0')}</div>
    <div class="legacy-story-years">${lEsc(item.range)}</div>
    <div class="legacy-story-copy"><small>${lEsc(item.eyebrow)}</small><h3>${lEsc(item.title)}</h3><p>${lEsc(item.copy)}</p><div class="legacy-story-tags">${item.tags.map(tag=>`<span>${lEsc(tag)}</span>`).join('')}</div><div class="legacy-history-sources">${historySourceLinks(item.sourceKeys)}</div></div>
  </article>`;
}

function storySection(){
  return `<section class="legacy-museum-section" id="legacy-story">${sectionHead('01 · Franchise story','From the AFL’s first champions to Titans blue','Filter by era or read straight through. Every factual card links back to the source used to verify it.')}
    <div class="legacy-era-filters" role="group" aria-label="Filter franchise story by era">
      <button type="button" class="legacy-era-filter active" data-era-filter="all" aria-pressed="true">All eras</button>
      <button type="button" class="legacy-era-filter" data-era-filter="houston" aria-pressed="false">Houston</button>
      <button type="button" class="legacy-era-filter" data-era-filter="tennessee" aria-pressed="false">Tennessee arrival</button>
      <button type="button" class="legacy-era-filter" data-era-filter="modern" aria-pressed="false">Modern</button>
    </div>
    <div class="legacy-story-list">${legacyStory.map(storyCard).join('')}</div>
  </section>`;
}

function momentCard(item,index){
  return `<article class="legacy-moment-card"><div class="legacy-moment-number" aria-hidden="true">${String(index+1).padStart(2,'0')}</div><div class="legacy-moment-date">${lEsc(item.date)}</div><small>${lEsc(item.label)}</small><h3>${lEsc(item.title)}</h3><strong class="legacy-moment-score">${lEsc(item.score)}</strong><p>${lEsc(item.copy)}</p><div class="legacy-history-sources">${historySourceLinks(item.sourceKeys)}</div></article>`;
}

function momentsSection(){
  return `<section class="legacy-museum-section legacy-moments-section" id="legacy-moments">${sectionHead('02 · Moments','Games that became franchise memory','Not every defining moment ended with confetti. These are the dates that still explain what this fanbase remembers.')}
    <div class="legacy-moment-grid">${legacyMoments.map(momentCard).join('')}</div>
  </section>`;
}

function legendCard(item){
  return `<article class="legacy-legend-card"><div class="legacy-legend-monogram" aria-hidden="true">${lEsc(item.monogram)}</div><div class="legacy-legend-top"><div><h3>${lEsc(item.name)}</h3><small>${lEsc(item.role)}</small></div><span>${lEsc(item.badge)}</span></div><p>${lEsc(item.copy)}</p><div class="legacy-history-sources">${historySourceLinks(item.sourceKeys)}</div></article>`;
}

function legendsSection(){
  return `<section class="legacy-museum-section" id="legacy-legends">${sectionHead('03 · Legends','Names stitched into the franchise','A cross-era starting point—not a ranking. The goal is to connect each football era to the players who defined it.')}
    <div class="legacy-legend-grid">${legacyLegends.map(legendCard).join('')}</div>
  </section>`;
}

function recordsSection(){
  return `<section class="legacy-museum-section legacy-records-section" id="legacy-records">${sectionHead('04 · Record book','The numbers that still lead the franchise','Career leaders are sourced to the Pro Football Hall of Fame’s current Titans team facts; Henry’s 2020 mark is also checked against the team.')}
    <div class="legacy-record-grid">${legacyRecords.map(item=>`<article class="legacy-record-card"><strong>${lEsc(item.value)}</strong><span>${lEsc(item.label)}</span><h3>${lEsc(item.holder)}</h3><small>${lEsc(item.note)}</small></article>`).join('')}</div>
    <div class="legacy-record-source">${historySourceLinks(['hallFacts','henry2020'])}</div>
    <div class="legacy-retired-wrap"><div class="legacy-retired-copy"><small>Forever on the wall</small><h3>Retired numbers</h3><p>Eight uniform numbers are retired by the Oilers/Titans franchise.</p><div class="legacy-history-sources">${historySourceLinks(['retiredNumbers','hallFacts'])}</div></div><div class="legacy-retired-grid">${retiredNumbers.map(item=>`<article class="legacy-retired-card"><strong>${lEsc(item.number)}</strong><div><span>${lEsc(item.name)}</span><small>${lEsc(item.position)}</small></div></article>`).join('')}</div></div>
  </section>`;
}

function archiveCard(item){
  return `<figure class="archive-card" data-kind="${lEsc(item.kind)}" data-verification="${lEsc(item.verificationLevel)}">
    <div class="archive-image"><img src="${lEsc(item.image)}" alt="${lEsc(item.alt)}" loading="lazy"></div>
    <figcaption>
      <div class="archive-card-meta"><span class="archive-kind">${lEsc(item.kind)}</span><span class="archive-verification">${lEsc(item.verification)}</span></div>
      <strong>${lEsc(item.title)}</strong>
      <small class="archive-era">${lEsc(item.era)}</small>
      <p class="archive-description">${lEsc(item.description)}</p>
      <details class="archive-audit-detail">
        <summary>Why this label</summary>
        <p>${lEsc(item.provenance)}</p>
        <div class="archive-source-list">${sourceLinks(item.sourceKeys)}</div>
      </details>
    </figcaption>
  </figure>`;
}

function timelineCard(item){
  const media=item.image
    ? `<div class="legacy-era-media"><img src="${lEsc(item.image)}" alt="${lEsc(item.alt)}" loading="lazy"></div>`
    : `<div class="legacy-era-media legacy-era-origin" aria-hidden="true"><strong>1959</strong><span>FRANCHISE GRANTED</span><i>→</i><strong>1960</strong><span>FIRST SEASON</span></div>`;
  return `<section class="legacy-era legacy-era-polished" data-era="${lEsc(item.id)}">
    ${media}
    <div class="legacy-era-copy">
      <div class="era-year">${lEsc(item.era)} · ${lEsc(item.kicker)}</div>
      <h3>${lEsc(item.title)}</h3>
      <p>${lEsc(item.copy)}</p>
      <div class="archive-source-row">
        <span class="archive-kind">${lEsc(item.verification)}</span>
        <div class="archive-inline-sources">${sourceLinks(item.sourceKeys)}</div>
      </div>
    </div>
  </section>`;
}

function auditSourceSummary(){
  const ordered=['titansBrand','titansLogoHistory','hallOfFame','sportsLogos','wikipedia'];
  return `<section class="visual-audit-banner">
    <div>
      <small>Visual-label audit · ${lEsc(VISUAL_AUDIT_DATE)}</small>
      <strong>Exact when verified. Representative when it is not.</strong>
      <p>Current branding is checked against the Tennessee Titans first. Historical image labels are then cross-checked against the official logo/helmet history, the Pro Football Hall of Fame, SportsLogos.net and Wikipedia. A project composite is never promoted into an “official logo” just because it looks plausible.</p>
    </div>
    <div class="visual-audit-source-chips">${ordered.map(key=>{const source=visualSources[key];return `<a href="${lEsc(source.url)}" target="_blank" rel="noopener noreferrer">${lEsc(source.label.replace(/^Tennessee Titans — /,'Titans ').replace(/^Pro Football Hall of Fame — /,'HOF ').replace(/^SportsLogos\.net — /,'SportsLogos ').replace(/^Wikipedia — /,'Wikipedia '))}</a>`}).join('')}</div>
  </section>`;
}

function identitySection(){
  return `<section class="legacy-museum-section legacy-identity-section" id="legacy-identity">${sectionHead('05 · Identity vault','Oilers derrick → fireball-T → The Shield','The visual archive stays deliberately stricter than the fan-history layer: exact labels only when the asset itself is verified.')}
    ${auditSourceSummary()}
    <div class="archive-note"><strong>Reading the identity timeline:</strong> logo chronology and uniform chronology are not treated as the same thing. In particular, 2018 changed the helmet, uniforms and wordmark system while the fireball-T primary logo remained in use through 2025.</div>
    <div class="legacy-timeline-polished">${legacyTimeline.map(timelineCard).join('')}</div>
    <div class="section-rivet">Audited visual archive</div>
    <div class="archive-note"><strong>Image rule:</strong> a historical graphic gets an exact year/title only when the asset itself is verified to that identity. Otherwise it is labeled <em>representative</em> or <em>reference</em>.</div>
    <div class="archive-filters" role="group" aria-label="Filter visual archive">
      <button type="button" class="archive-filter active" data-filter="all" aria-pressed="true">All</button>
      <button type="button" class="archive-filter" data-filter="Current identity" aria-pressed="false">Current</button>
      <button type="button" class="archive-filter" data-filter="Oilers reference" aria-pressed="false">Oilers</button>
      <button type="button" class="archive-filter" data-filter="Fireball era" aria-pressed="false">Fireball era</button>
      <button type="button" class="archive-filter" data-filter="Reference graphic" aria-pressed="false">Reference</button>
    </div>
    <div class="legacy-gallery archive-gallery-polished">${visualArchive.map(archiveCard).join('')}</div>
    <div class="section-rivet">Documented identities not pictured</div>
    <div class="visual-gap-grid">${knownVisualsNotPictured.map(item=>`<article class="visual-gap-card"><small>${lEsc(item.status)}</small><strong>${lEsc(item.title)}</strong><p>${lEsc(item.copy)}</p><div class="archive-source-list">${sourceLinks(item.sourceKeys)}</div></article>`).join('')}</div>
  </section>`;
}

function updateLegacyHeader(page){
  const header=page.previousElementSibling;
  if(!header?.classList?.contains('page-head'))return;
  const eyebrow=header.querySelector('.eyebrow');
  const description=header.querySelector('p');
  const official=header.querySelector('a.button');
  if(eyebrow)eyebrow.textContent='Oilers → Titans · Franchise museum';
  if(description)description.textContent='Explore the people, games, records, eras and visual identities that built the Oilers/Titans franchise.';
  if(official)official.textContent='Official history ↗';
}

function bindLegacyInteraction(page){
  page.addEventListener('click',event=>{
    const jump=event.target.closest('[data-legacy-scroll]');
    if(jump){
      const target=page.querySelector(`#${CSS.escape(jump.dataset.legacyScroll||'')}`);
      if(target){
        const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
        const heading=target.querySelector('h2');
        if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
      }
      return;
    }

    const eraButton=event.target.closest('.legacy-era-filter');
    if(eraButton){
      const filter=eraButton.dataset.eraFilter;
      page.querySelectorAll('.legacy-era-filter').forEach(button=>{
        const active=button===eraButton;
        button.classList.toggle('active',active);
        button.setAttribute('aria-pressed',String(active));
      });
      page.querySelectorAll('.legacy-story-card').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.legacyEraGroup!==filter;});
      return;
    }

    const archiveButton=event.target.closest('.archive-filter');
    if(archiveButton){
      const filter=archiveButton.dataset.filter;
      page.querySelectorAll('.archive-filter').forEach(button=>{
        const active=button===archiveButton;
        button.classList.toggle('active',active);
        button.setAttribute('aria-pressed',String(active));
      });
      page.querySelectorAll('.archive-card').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.kind!==filter;});
    }
  });
}

function applyLegacyPolish(){
  const page=document.querySelector('.legacy-page');
  if(page&&!page.dataset.polished){
    page.dataset.polished='true';
    updateLegacyHeader(page);
    page.innerHTML=`${legacyHero()}${legacyJumpNav()}${storySection()}${momentsSection()}${legendsSection()}${recordsSection()}${identitySection()}<div class="legal-mark-note">Unofficial fan-built archive. Historical text and visual labels are source-audited; team/NFL marks remain the property of their respective rights holders.</div>`;
    bindLegacyInteraction(page);
    page.removeAttribute('aria-busy');
  }

  const callout=document.querySelector('.legacy-callout');
  if(callout){
    callout.dataset.visualAudited='true';
    const calloutImage=callout.querySelector('.legacy-callout-art img');
    if(calloutImage){
      const oilers=visualArchive.find(item=>item.id==='oilers-derrick');
      if(oilers&&calloutImage.getAttribute('src')!==oilers.image)calloutImage.src=oilers.image;
      if(oilers&&calloutImage.alt!==oilers.alt)calloutImage.alt=oilers.alt;
    }
    const calloutCopy=callout.querySelector('.legacy-callout-copy p');
    const desired='From Houston’s AFL titles and Luv Ya Blue to the Music City Miracle, McNair, George, Henry and today’s Shield, the franchise story is bigger than a logo timeline.';
    if(calloutCopy&&calloutCopy.textContent!==desired)calloutCopy.textContent=desired;
    const calloutLink=callout.querySelector('.legacy-callout-copy a[href="#legacy"]');
    if(calloutLink)calloutLink.textContent='Enter the legacy museum →';
  }

  const strip=document.querySelector('.legacy-strip');
  if(strip&&!strip.dataset.polished){
    strip.dataset.polished='true';
    const ids=['oilers-derrick','fireball-wordmark','fireball-on-navy','shield-primary'];
    strip.innerHTML=ids.map(id=>visualArchive.find(item=>item.id===id)).filter(Boolean).map(item=>`<a class="legacy-peek" href="#legacy"><img src="${lEsc(item.image)}" alt="${lEsc(item.alt)}" loading="lazy"><span>${lEsc(item.title)}</span></a>`).join('');
  }
}

const observer=new MutationObserver(()=>queueMicrotask(applyLegacyPolish));
const appRoot=document.querySelector('#app');
if(appRoot)observer.observe(appRoot,{childList:true});
addEventListener('hashchange',()=>queueMicrotask(applyLegacyPolish));
queueMicrotask(applyLegacyPolish);
