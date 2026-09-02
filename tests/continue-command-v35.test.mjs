import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const feature=read('continue-command-v35.js');
const runtime=read('accessibility-runtime.js');
const sw=read('sw.js');

test('Continue Command remembers only bounded canonical same-app destinations',()=>{
  assert.match(feature,/STORE='titans:v35ContinueCommand'/);
  assert.match(feature,/MAX_HREF=180/);
  assert.match(feature,/const safeHref=value=>/);
  assert.match(feature,/!href\.startsWith\('#'\)/);
  assert.match(feature,/current!=='home'&&labels\[current\]\?href:''/);
  assert.match(feature,/player:'Player Intelligence'/);
  assert.match(feature,/const href=safeHref\(value\.href\)/);
});

test('Home exposes a compact accessible clearable resume strip after the fan command hierarchy',()=>{
  assert.match(feature,/setAttribute\('aria-label','Continue where you left off'\)/);
  assert.match(feature,/querySelector\('\[data-v10-home\]'\)/);
  assert.match(feature,/querySelector\('\.home-command-v123'\)/);
  assert.match(feature,/insertAdjacentElement\('afterend',card\)/);
  assert.match(feature,/data-clear-continue/);
  assert.match(feature,/min-height:44px/);
  assert.match(feature,/@media\(max-width:620px\)/);
  assert.doesNotMatch(feature,/animation:/);
});

test('Continue Command uses the shared runtime lifecycle and remains available offline',()=>{
  assert.match(feature,/runtime\.onRoute\(sync,\{immediate:true\}\)/);
  assert.match(feature,/runtime\.onAppRender\(\(\)=>queueMicrotask\(mount\),\{immediate:true\}\)/);
  assert.doesNotMatch(feature,/new MutationObserver/);
  assert.doesNotMatch(feature,/setInterval\(/);
  assert.doesNotMatch(feature,/setTimeout\(/);
  assert.match(runtime,/import '\.\/continue-command-v35\.js';/);
  assert.match(sw,/titans-cc-brand-2026-v\d+/);
  assert.match(sw,/'\/continue-command-v35\.js'/);
});
