const legacyCatalog = {
  timeline: [
    {
      era: '1960–1996',
      kicker: 'Houston Oilers',
      title: 'The derrick era',
      image: '/assets/archive/oilers-derrick.webp',
      alt: 'Houston Oilers oil derrick logo in light blue, red, and white',
      copy: 'The franchise began in Houston in 1960. The oil derrick and powder-blue identity defined the club for decades before the move to Tennessee.',
      badge: 'Classic franchise mark'
    },
    {
      era: '1997–1998',
      kicker: 'Tennessee Oilers',
      title: 'The Tennessee transition',
      image: '/assets/archive/oilers-derrick-roundel-art.webp',
      alt: 'Decorative Houston Oilers derrick roundel in light blue and red',
      copy: 'The franchise played two seasons as the Tennessee Oilers before adopting the Titans name in 1999. This roundel is a decorative reference image, not an official period logo lockup.',
      badge: 'Reference artwork'
    },
    {
      era: '1999–2025',
      kicker: 'Tennessee Titans',
      title: 'The fireball generation',
      image: '/assets/archive/fireball-wordmark.webp',
      alt: 'Tennessee Titans fireball logo beside the classic Titans wordmark',
      copy: 'The Titans name arrived in 1999 with the flaming-T mark and a navy-heavy identity that carried the franchise through more than a quarter century in Tennessee.',
      badge: 'Classic Titans identity'
    },
    {
      era: '2026–present',
      kicker: 'Tennessee Titans',
      title: 'The Shield',
      image: '/assets/archive/current-shield-wordmark.webp',
      alt: 'Current Tennessee Titans Shield logo above the Tennessee Titans wordmark',
      copy: 'The 2026 identity removes the flames, makes Titans Blue the visual lead, and centers the redesigned Shield and Nashville-inspired 6-String Stripe.',
      badge: 'Current identity'
    }
  ],
  archive: [
    {image:'/assets/archive/current-shield-primary.webp',title:'The Shield — primary mark',subtitle:'2026–present',kind:'Current identity',alt:'Current Tennessee Titans Shield primary logo'},
    {image:'/assets/archive/current-shield-blue-field.webp',title:'Shield on Titans Blue',subtitle:'Current-color treatment',kind:'Current identity',alt:'Current Tennessee Titans Shield outlined in white on a Titans Blue background'},
    {image:'/assets/archive/logo-transition-shield-fireball.webp',title:'Logo transition: Shield + fireball',subtitle:'2026 / 1999–2025 comparison',kind:'Logo comparison',alt:'Current Titans Shield logo beside the previous Titans fireball logo'},
    {image:'/assets/archive/current-shield-wordmark.webp',title:'Current Shield + wordmark',subtitle:'2026 identity lockup reference',kind:'Current identity',alt:'Current Tennessee Titans Shield logo with Tennessee Titans wordmark'},
    {image:'/assets/archive/oilers-derrick.webp',title:'Houston Oilers derrick',subtitle:'Classic Oilers mark',kind:'Classic franchise mark',alt:'Houston Oilers oil derrick logo'},
    {image:'/assets/archive/fireball-wordmark.webp',title:'Fireball + classic wordmark',subtitle:'Titans identity used before 2026',kind:'Classic Titans identity',alt:'Previous Tennessee Titans fireball logo with classic Titans wordmark'},
    {image:'/assets/archive/fireball-on-navy.webp',title:'Fireball mark on navy',subtitle:'Previous Titans primary-logo treatment',kind:'Classic Titans identity',alt:'Previous Tennessee Titans fireball logo on a navy background'},
    {image:'/assets/archive/titans-lightblue-wordmark.webp',title:'Light-blue Titans wordmark',subtitle:'Wordmark reference',kind:'Wordmark',alt:'Tennessee Titans wordmark in light blue'},
    {image:'/assets/archive/fireball-classic-banner.webp',title:'Fireball + classic banner lockup',subtitle:'Previous-era graphic treatment',kind:'Classic Titans identity',alt:'Previous Tennessee Titans fireball logo with classic Titans wordmark in a vertical banner'},
    {image:'/assets/archive/vintage-titans-roundel-art.webp',title:'Distressed Titans roundel',subtitle:'Vintage-style decorative artwork',kind:'Fan-art/reference',alt:'Distressed vintage-style Tennessee Titans roundel artwork'},
    {image:'/assets/archive/oilers-derrick-roundel-art.webp',title:'Oilers derrick roundel',subtitle:'Decorative throwback artwork',kind:'Fan-art/reference',alt:'Decorative Houston Oilers derrick roundel artwork'},
    {image:'/assets/archive/shield-outline-art.webp',title:'Shield outline artwork',subtitle:'Alternate decorative treatment',kind:'Fan-art/reference',alt:'Decorative outlined Tennessee Titans Shield artwork'}
  ]
};
function archiveCard(item){return `<figure class="archive-card" data-kind="${item.kind}"><div class="archive-image"><img src="${item.image}" alt="${item.alt}" loading="lazy"></div><figcaption><span class="archive-kind">${item.kind}</span><strong>${item.title}</strong><small>${item.subtitle}</small></figcaption></figure>`}
function timelineCard(item){return `<section class="legacy-era legacy-era-polished"><div class="legacy-era-media"><img src="${item.image}" alt="${item.alt}" loading="lazy"></div><div class="legacy-era-copy"><div class="era-year">${item.era} · ${item.kicker}</div><h3>${item.title}</h3><p>${item.copy}</p><span class="archive-kind">${item.badge}</span></div></section>`}
function applyLegacyPolish(){
 const legacyPage=document.querySelector('.legacy-page');
 if(legacyPage&&!legacyPage.dataset.polished){legacyPage.dataset.polished='true';legacyPage.innerHTML=`<div class="archive-note"><strong>Image labels corrected.</strong> Current marks, classic franchise marks, and decorative reference artwork are identified separately so the archive does not imply every supplied graphic was an official team logo.</div><div class="legacy-timeline-polished">${legacyCatalog.timeline.map(timelineCard).join('')}</div><div class="section-rivet">Visual archive</div><div class="archive-filters" role="group" aria-label="Filter visual archive"><button type="button" class="archive-filter active" data-filter="all">All</button><button type="button" class="archive-filter" data-filter="Current identity">Current</button><button type="button" class="archive-filter" data-filter="Classic franchise mark">Oilers</button><button type="button" class="archive-filter" data-filter="Classic Titans identity">Fireball era</button><button type="button" class="archive-filter" data-filter="Fan-art/reference">Reference art</button></div><div class="legacy-gallery archive-gallery-polished">${legacyCatalog.archive.map(archiveCard).join('')}</div><div class="legal-mark-note">Unofficial fan-built archive. Current-brand history is cross-checked against TennesseeTitans.com. Decorative reference images supplied for this project are labeled separately from official franchise marks.</div>`;legacyPage.querySelectorAll('.archive-filter').forEach(button=>button.addEventListener('click',()=>{legacyPage.querySelectorAll('.archive-filter').forEach(x=>x.classList.toggle('active',x===button));const filter=button.dataset.filter;legacyPage.querySelectorAll('.archive-card').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.kind!==filter})}))}
 const callout=document.querySelector('.legacy-callout-art img');if(callout){callout.src='/assets/archive/oilers-derrick.webp';callout.alt='Houston Oilers oil derrick logo'}
 const hero=document.querySelector('.fan-hero-brand img');if(hero){hero.src='/assets/archive/current-shield-wordmark.webp';hero.alt='Current Tennessee Titans Shield logo and wordmark'}
 const strip=document.querySelector('.legacy-strip');if(strip&&!strip.dataset.polished){strip.dataset.polished='true';strip.innerHTML=[legacyCatalog.archive[2],legacyCatalog.archive[4],legacyCatalog.archive[5],legacyCatalog.archive[0]].map(item=>`<a class="legacy-peek" href="#legacy"><img src="${item.image}" alt="${item.alt}" loading="lazy"><span>${item.title}</span></a>`).join('')}
}
const observer=new MutationObserver(applyLegacyPolish);const appRoot=document.querySelector('#app');if(appRoot)observer.observe(appRoot,{childList:true,subtree:true});window.addEventListener('hashchange',()=>queueMicrotask(applyLegacyPolish));queueMicrotask(applyLegacyPolish);
