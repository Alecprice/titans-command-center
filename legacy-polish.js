const legacyCatalog = {
  timeline: [
    {
      era: 'Aug. 14, 1959 / 1960',
      kicker: 'Franchise origin',
      title: 'Granted in 1959. Football began in 1960.',
      image: '/assets/archive/oilers-derrick.webp',
      alt: 'Houston Oilers oil derrick logo in light blue, red, and white',
      copy: 'Bud Adams was granted the AFL franchise on August 14, 1959. The Houston Oilers began play in 1960 as one of the American Football League’s eight charter clubs.',
      badge: 'Franchise origin',
      source: 'https://www.profootballhof.com/teams/tennessee-titans/team-facts'
    },
    {
      era: '1960–1996',
      kicker: 'Houston Oilers',
      title: 'The Oilers era',
      image: '/assets/archive/oilers-derrick.webp',
      alt: 'Houston Oilers oil derrick logo',
      copy: 'Houston won the first two AFL championships in 1960 and 1961. The derrick remained the franchise mark through the Oilers years, with color and helmet treatments changing over time.',
      badge: 'Houston Oilers',
      source: 'https://www.tennesseetitans.com/history/logo-history'
    },
    {
      era: '1997–1998',
      kicker: 'Tennessee Oilers',
      title: 'Two transition seasons in Tennessee',
      image: '/assets/archive/oilers-derrick.webp',
      alt: 'Oilers derrick logo used during the franchise transition to Tennessee',
      copy: 'The franchise moved to Tennessee in 1997. Home games were played at Liberty Bowl Memorial Stadium in Memphis in 1997, then at Vanderbilt Stadium in Nashville in 1998. The Tennessee Oilers name was used both seasons.',
      badge: 'Tennessee Oilers',
      source: 'https://www.tennesseetitans.com/history/historical-highlights'
    },
    {
      era: '1999–2017',
      kicker: 'Tennessee Titans',
      title: 'Titans name, fireball mark, new Nashville home',
      image: '/assets/archive/fireball-wordmark.webp',
      alt: 'Tennessee Titans fireball logo with classic Titans wordmark',
      copy: 'The Titans name was announced in November 1998 and debuted for the 1999 season as the team moved into the new downtown Nashville stadium. The fireball-T identity arrived with the name change. Tennessee won the AFC in its first Titans season and reached Super Bowl XXXIV.',
      badge: 'Original Titans identity',
      source: 'https://www.tennesseetitans.com/history/historical-highlights'
    },
    {
      era: '2018–2025',
      kicker: 'Tennessee Titans',
      title: 'New uniforms, same fireball mark',
      image: '/assets/archive/fireball-on-navy.webp',
      alt: 'Tennessee Titans fireball logo on navy',
      copy: 'Tennessee unveiled a new uniform set in 2018 with navy helmets and sword-inspired striping while retaining the fireball logo. Titans Blue returned as the primary home jersey color for 2025.',
      badge: '2018 uniform era',
      source: 'https://www.tennesseetitans.com/news/titans-switching-to-titans-blue-as-primary-home-jersey-color-in-2025'
    },
    {
      era: '2026–present',
      kicker: 'Tennessee Titans',
      title: 'The Shield era',
      image: '/assets/archive/current-shield-primary.webp',
      alt: 'Current Tennessee Titans Shield primary logo',
      copy: 'On March 12, 2026, the Titans unveiled a new logo and uniform system. The Shield became the primary helmet logo, Titans Blue became the lead color, and the Nashville-inspired 6-String Stripe was introduced across the uniform.',
      badge: 'Current identity',
      source: 'https://www.tennesseetitans.com/brand/'
    }
  ],
  archive: [
    {image:'/assets/archive/current-shield-primary.webp',title:'The Shield',subtitle:'Current primary logo · 2026–present',kind:'Current identity',alt:'Current Tennessee Titans Shield primary logo'},
    {image:'/assets/archive/logo-transition-shield-fireball.webp',title:'Shield and fireball comparison',subtitle:'Current mark beside the previous primary mark',kind:'Logo comparison',alt:'Current Titans Shield logo beside the previous Titans fireball logo'},
    {image:'/assets/archive/oilers-derrick.webp',title:'Oilers derrick',subtitle:'Franchise mark used through the Oilers era',kind:'Oilers',alt:'Houston Oilers oil derrick logo'},
    {image:'/assets/archive/fireball-wordmark.webp',title:'Fireball + Titans wordmark',subtitle:'Titans identity introduced for 1999',kind:'Fireball era',alt:'Tennessee Titans fireball logo with classic Titans wordmark'},
    {image:'/assets/archive/fireball-on-navy.webp',title:'Fireball on navy',subtitle:'Previous primary-mark treatment',kind:'Fireball era',alt:'Previous Tennessee Titans fireball logo on navy'}
  ]
};

function archiveCard(item){
  return `<figure class="archive-card" data-kind="${item.kind}"><div class="archive-image"><img src="${item.image}" alt="${item.alt}" loading="lazy"></div><figcaption><span class="archive-kind">${item.kind}</span><strong>${item.title}</strong><small>${item.subtitle}</small></figcaption></figure>`;
}

function timelineCard(item){
  return `<section class="legacy-era legacy-era-polished"><div class="legacy-era-media"><img src="${item.image}" alt="${item.alt}" loading="lazy"></div><div class="legacy-era-copy"><div class="era-year">${item.era} · ${item.kicker}</div><h3>${item.title}</h3><p>${item.copy}</p><div class="archive-source-row"><span class="archive-kind">${item.badge}</span><a href="${item.source}" target="_blank" rel="noopener noreferrer">Source ↗</a></div></div></section>`;
}

function applyLegacyPolish(){
  const legacyPage=document.querySelector('.legacy-page');
  if(legacyPage&&!legacyPage.dataset.polished){
    legacyPage.dataset.polished='true';
    legacyPage.innerHTML=`<div class="archive-note"><strong>Fact-checked franchise timeline.</strong> Current team and brand facts use TennesseeTitans.com first. NFL and Pro Football Hall of Fame records are official cross-checks; Wikipedia and Pro Football Reference are secondary historical checks.</div><div class="legacy-timeline-polished">${legacyCatalog.timeline.map(timelineCard).join('')}</div><div class="section-rivet">Verified visual archive</div><div class="archive-filters" role="group" aria-label="Filter visual archive"><button type="button" class="archive-filter active" data-filter="all">All</button><button type="button" class="archive-filter" data-filter="Current identity">Current</button><button type="button" class="archive-filter" data-filter="Oilers">Oilers</button><button type="button" class="archive-filter" data-filter="Fireball era">Fireball era</button><button type="button" class="archive-filter" data-filter="Logo comparison">Comparisons</button></div><div class="legacy-gallery archive-gallery-polished">${legacyCatalog.archive.map(archiveCard).join('')}</div><div class="legal-mark-note">Unofficial fan-built archive. Historical text is source-audited; image labels describe what is actually shown and do not imply ownership or official affiliation.</div>`;
    legacyPage.querySelectorAll('.archive-filter').forEach(button=>button.addEventListener('click',()=>{
      legacyPage.querySelectorAll('.archive-filter').forEach(x=>x.classList.toggle('active',x===button));
      const filter=button.dataset.filter;
      legacyPage.querySelectorAll('.archive-card').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.kind!==filter});
    }));
  }

  const callout=document.querySelector('.legacy-callout-art img');
  if(callout){callout.src='/assets/archive/oilers-derrick.webp';callout.alt='Houston Oilers oil derrick logo';}
  const calloutCopy=document.querySelector('.legacy-callout-copy p');
  if(calloutCopy)calloutCopy.textContent='From the Oilers derrick to the Titans fireball and today’s Shield, the franchise identity has changed several times while the team history remains continuous.';

  const strip=document.querySelector('.legacy-strip');
  if(strip&&!strip.dataset.polished){
    strip.dataset.polished='true';
    strip.innerHTML=[legacyCatalog.archive[1],legacyCatalog.archive[2],legacyCatalog.archive[3],legacyCatalog.archive[0]].map(item=>`<a class="legacy-peek" href="#legacy"><img src="${item.image}" alt="${item.alt}" loading="lazy"><span>${item.title}</span></a>`).join('');
  }
}

const observer=new MutationObserver(applyLegacyPolish);
const appRoot=document.querySelector('#app');
if(appRoot)observer.observe(appRoot,{childList:true,subtree:true});
window.addEventListener('hashchange',()=>queueMicrotask(applyLegacyPolish));
queueMicrotask(applyLegacyPolish);
