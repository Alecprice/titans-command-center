import { VISUAL_AUDIT_DATE, legacyTimeline, visualArchive, knownVisualsNotPictured, visualSources, sourcesFor } from './src/visual-audit.mjs';

const lEsc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function sourceLinks(keys){
  return sourcesFor(keys).map(source=>`<a href="${lEsc(source.url)}" target="_blank" rel="noopener noreferrer" title="${lEsc(source.role)}">${lEsc(source.label)} ↗</a>`).join('');
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

function applyLegacyPolish(){
  const page=document.querySelector('.legacy-page');
  if(page&&!page.dataset.polished){
    page.dataset.polished='true';
    page.innerHTML=`${auditSourceSummary()}
      <div class="archive-note"><strong>Reading the timeline:</strong> logo chronology and uniform chronology are not treated as the same thing. In particular, 2018 changed the helmet, uniforms and wordmark system while the fireball-T primary logo remained in use through 2025.</div>
      <div class="legacy-timeline-polished">${legacyTimeline.map(timelineCard).join('')}</div>
      <div class="section-rivet">Audited visual archive</div>
      <div class="archive-note"><strong>Image rule:</strong> a historical graphic gets an exact year/title only when the asset itself is verified to that identity. Otherwise it is labeled <em>representative</em> or <em>reference</em>. This prevents one Oilers derrick rendering from being called every Oilers logo, and prevents a 2018 uniform treatment from being mislabeled as a new primary logo.</div>
      <div class="archive-filters" role="group" aria-label="Filter visual archive">
        <button type="button" class="archive-filter active" data-filter="all">All</button>
        <button type="button" class="archive-filter" data-filter="Current identity">Current</button>
        <button type="button" class="archive-filter" data-filter="Oilers reference">Oilers</button>
        <button type="button" class="archive-filter" data-filter="Fireball era">Fireball era</button>
        <button type="button" class="archive-filter" data-filter="Reference graphic">Reference</button>
      </div>
      <div class="legacy-gallery archive-gallery-polished">${visualArchive.map(archiveCard).join('')}</div>
      <div class="section-rivet">Documented identities not pictured</div>
      <div class="visual-gap-grid">${knownVisualsNotPictured.map(item=>`<article class="visual-gap-card"><small>${lEsc(item.status)}</small><strong>${lEsc(item.title)}</strong><p>${lEsc(item.copy)}</p><div class="archive-source-list">${sourceLinks(item.sourceKeys)}</div></article>`).join('')}</div>
      <div class="legal-mark-note">Unofficial fan-built archive. Historical text and visual labels are source-audited; team/NFL marks remain the property of their respective rights holders.</div>`;
    page.removeAttribute('aria-busy');
    page.querySelectorAll('.archive-filter').forEach(button=>button.addEventListener('click',()=>{
      page.querySelectorAll('.archive-filter').forEach(x=>x.classList.toggle('active',x===button));
      const filter=button.dataset.filter;
      page.querySelectorAll('.archive-card').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.kind!==filter});
    }));
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
    const desired='From the Oilers derrick and its many year-specific treatments, to the fireball-T, the sword-inspired details of the 2018 uniform system, and today’s Shield, the franchise identity changed in distinct, documented stages.';
    if(calloutCopy&&calloutCopy.textContent!==desired)calloutCopy.textContent=desired;
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
