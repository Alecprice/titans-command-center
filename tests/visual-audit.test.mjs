import test from 'node:test';
import assert from 'node:assert/strict';
import {legacyTimeline,visualArchive,knownVisualsNotPictured,visualSources} from '../src/visual-audit.mjs';

test('visual source registry includes official, specialist and Wikipedia cross-checks',()=>{
  assert.match(visualSources.titansBrand.url,/tennesseetitans\.com\/brand/);
  assert.match(visualSources.titansLogoHistory.url,/tennesseetitans\.com\/history\/logo-history/);
  assert.match(visualSources.sportsLogos.url,/sportslogos\.net/);
  assert.match(visualSources.wikipedia.url,/wikipedia\.org\/wiki\/Tennessee_Titans/);
});

test('active visual catalog never uses quarantined legacy aliases',()=>{
  for(const item of visualArchive){
    assert.doesNotMatch(item.image,/\/assets\/legacy\//,`${item.id} still uses a legacy alias`);
    assert.match(item.image,/^\/assets\/(archive|brand)\//);
    assert.ok(item.alt.length>=35,`${item.id} alt text is too vague`);
    assert.ok(item.description.length>=35,`${item.id} description is too vague`);
    assert.ok(item.provenance.length>=45,`${item.id} provenance is too vague`);
    assert.ok(item.sourceKeys.length>=2,`${item.id} needs at least two source references`);
  }
});

test('representative and composite art cannot masquerade as exact official logos',()=>{
  for(const item of visualArchive.filter(x=>x.verificationLevel!=='verified')){
    const text=`${item.title} ${item.alt} ${item.description} ${item.provenance}`;
    assert.match(text,/representative|reference|comparison|composite|not (?:an |a )?official|not an exact|not labeled/i,`${item.id} lacks an uncertainty label`);
  }
  assert.equal(visualArchive.some(x=>/Sword alternate|Vintage roundel|Light blue wordmark/i.test(x.title)),false);
  const sword=knownVisualsNotPictured.find(x=>x.id==='titans-sword-alternate');
  assert.ok(sword);
  assert.match(sword.copy,/real Titans secondary\/alternate mark/i);
  assert.match(sword.copy,/1999–2001/);
  assert.match(sword.copy,/2002–2025/);
  assert.match(sword.copy,/legacy-sword\.webp cannot be used as proof/i);
  assert.ok(sword.sourceKeys.includes('sportsLogosSword1999'));
  assert.ok(sword.sourceKeys.includes('sportsLogosSword'));
});

test('2018 is treated as a uniform and wordmark change, not a new primary logo',()=>{
  const era=legacyTimeline.find(x=>x.id==='2018-uniform-era');
  assert.ok(era);
  assert.match(era.copy,/uniform\/wordmark system/i);
  assert.match(era.copy,/fireball-T remained the primary mark through 2025/i);
  assert.match(era.copy,/not a separate “2018 logo”/i);
});

test('Tennessee Oilers transition preserves alternate-logo nuance',()=>{
  const era=legacyTimeline.find(x=>x.id==='tennessee-oilers');
  assert.ok(era);
  assert.match(era.copy,/Tennessee logo was added to the back of the helmet/i);
  assert.match(era.copy,/alternate mark/i);
  assert.match(era.alt,/not the exact Tennessee alternate logo/i);
});

test('current Shield receives exact current-brand treatment',()=>{
  const current=visualArchive.find(x=>x.id==='shield-primary');
  assert.equal(current?.verificationLevel,'verified');
  assert.ok(current.sourceKeys.includes('titansBrand'));
  assert.ok(current.sourceKeys.includes('titansReveal'));
});
