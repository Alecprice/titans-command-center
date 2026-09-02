import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Legacy Trails provide five curated cross-museum journeys',()=>{
  const js=read('legacy-trails-v4.js');
  for(const id of ['afl-roots','luv-ya-blue','run-and-shoot','1999-run','rushing-kings'])assert.match(js,new RegExp(`id:'${id}'`));
  assert.match(js,/scope:'story'/);
  assert.match(js,/scope:'moments'/);
  assert.match(js,/scope:'legends'/);
  assert.match(js,/scope:'records'/);
  assert.match(js,/scope:'heritage'/);
  assert.match(js,/Legacy Trails/);
});

test('Trail state is shareable without becoming a second router',()=>{
  const js=read('legacy-trails-v4.js');
  assert.match(js,/new URLSearchParams\(hashQuery\(\)\)/);
  assert.match(js,/params\.set\('trail'/);
  assert.match(js,/params\.set\('step'/);
  assert.match(js,/params\.delete\('trail'\)/);
  assert.match(js,/history\.replaceState/);
  assert.doesNotMatch(js,/location\.hash\s*=/);
});

test('Trails delegate discovery to Legacy Finder instead of duplicating hidden-state ownership',()=>{
  const js=read('legacy-trails-v4.js');
  assert.match(js,/controller\.apply\(\{q:stop\.q,scope:stop\.scope\}\)/);
  assert.match(js,/querySelector\('\.legacy-finder-match'\)/);
  assert.match(js,/scrollIntoView/);
  assert.doesNotMatch(js,/\.hidden\s*=.*legacy-(?:story|moment|legend|record|venue|honor)/);
  assert.doesNotMatch(js,/\bfetch\s*\(/);
});

test('Trail controls remain accessible and phone safe',()=>{
  const js=read('legacy-trails-v4.js');
  assert.match(js,/aria-label="Choose a Legacy Trail"/);
  assert.match(js,/aria-pressed="false"/);
  assert.match(js,/aria-live="polite"/);
  assert.match(js,/min-height:44px/);
  assert.match(js,/min-height:46px/);
  assert.match(js,/max-width:430px/);
  assert.match(js,/prefers-reduced-motion:reduce/);
  assert.match(js,/forced-colors:active/);
});

test('Trail dependency ships through the v79 offline shell',()=>{
  const sw=read('sw.js');
  assert.match(sw,/titans-cc-brand-2026-v79/);
  assert.match(sw,/\/legacy-trails-v4\.js/);
  assert.match(sw,/\/legacy-finder-v2\.js/);
});

test('Legacy production browser smoke is syntax-gated and part of Current Experience',()=>{
  const quality=read('.github/workflows/quality.yml');
  const current=read('.github/workflows/current-experience-browser.yml');
  const smoke=read('scripts/legacy-browser-smoke.py');
  assert.match(quality,/scripts\/legacy-browser-smoke\.py/);
  assert.match(current,/Audit Legacy museum/);
  assert.match(current,/python scripts\/legacy-browser-smoke\.py/);
  assert.match(current,/LEGACY_OUTCOME/);
  assert.match(current,/legacy-browser-smoke\.json/);
  assert.match(smoke,/data-legacy-trail="1999-run"/);
  assert.match(smoke,/legacy-finder-input/);
  assert.match(smoke,/390,844/);
});
