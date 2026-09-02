import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const fallback=fs.readFileSync(new URL('../player-polish.js',import.meta.url),'utf8');
const uuid=fs.readFileSync(new URL('../player-intelligence-v16.js',import.meta.url),'utf8');

test('TENX audited Player keeps roster data as the required identity authority',()=>{
  const load=fallback.slice(fallback.indexOf('async function loadAuditedPlayer'),fallback.indexOf('async function loadRichPlayer'));
  assert.match(load,/site=await siteResponse\.json\(\)/);
  assert.match(load,/if\(!siteResponse\.ok\|\|!site\?\.ok\)throw new Error\(site\?\.error\|\|'Audited roster unavailable'\)/);
  assert.match(load,/const matched=\(site\.roster\|\|\[\]\)\.find/);
});

test('TENX audited Player does not parse a non-OK optional preseason response',()=>{
  const load=fallback.slice(fallback.indexOf('async function loadAuditedPlayer'),fallback.indexOf('async function loadRichPlayer'));
  assert.match(load,/preseason=preseasonResponse\.ok\?await preseasonResponse\.json\(\)\.catch\(\(\)=>null\):null/);
  assert.doesNotMatch(load,/preseason=await preseasonResponse\.json\(\)/);
});

test('TENX malformed optional preseason JSON fails soft instead of erasing the audited profile',()=>{
  const load=fallback.slice(fallback.indexOf('async function loadAuditedPlayer'),fallback.indexOf('async function loadRichPlayer'));
  assert.match(load,/preseasonResponse\.json\(\)\.catch\(\(\)=>null\)/);
  assert.match(load,/auditedProfile\(site,preseasonResponse\.ok&&preseason\?\.ok\?preseason:\{\},name\)/);
  assert.match(load,/renderAuditedIntelligence\([^\n]+preseasonResponse\.ok&&preseason\?\.ok\?preseason:\{\},site\)/);
});

test('TENX audited Player retains truthful missing-stat states when optional detail is absent',()=>{
  assert.match(fallback,/Verified production is awaiting source coverage\./);
  assert.match(fallback,/No zeroes are invented\./);
  assert.match(fallback,/No verified player-game rows loaded\./);
  assert.match(fallback,/This is a source-coverage gap, not a zero-stat claim\./);
});

test('TENX UUID Player keeps the same fail-soft optional preseason boundary',()=>{
  assert.match(uuid,/fetch\('\/api\/preseason-stats',\{cache:'no-store'\}\)\.then\(r=>r\.ok\?r\.json\(\):null\)\.catch\(\(\)=>null\)/);
});

test('TENX audited Player still fails closed when required roster truth is unavailable',()=>{
  const load=fallback.slice(fallback.indexOf('async function loadAuditedPlayer'),fallback.indexOf('async function loadRichPlayer'));
  const requiredFail=load.indexOf("if(!siteResponse.ok||!site?.ok)throw new Error(site?.error||'Audited roster unavailable')");
  const profile=load.indexOf('const profile=auditedProfile');
  assert.ok(requiredFail>=0,'required roster response must remain a hard gate');
  assert.ok(profile>requiredFail,'profile construction must happen only after required roster validation');
});

test('TENX audited preseason resilience adds no provider persistence timer poller or lifecycle owner',()=>{
  assert.equal((fallback.match(/\/api\/data/g)||[]).length,1);
  assert.equal((fallback.match(/\/api\/preseason-stats/g)||[]).length,1);
  assert.equal((fallback.match(/\/api\/player/g)||[]).length,1);
  assert.equal((fallback.match(/new MutationObserver/g)||[]).length,1);
  assert.equal((fallback.match(/setInterval|setTimeout/g)||[]).length,0);
  assert.equal((fallback.match(/localStorage\.setItem/g)||[]).length,1);
  assert.match(fallback,/data-v16-favorite/);
  assert.match(fallback,/data-v16-player-tab="overview"/);
  assert.match(fallback,/data-v16-player-tab="games"/);
  assert.match(fallback,/data-v16-player-tab="trends"/);
  assert.match(fallback,/data-v16-player-tab="career"/);
  assert.match(fallback,/data-v16-player-tab="timeline"/);
});
