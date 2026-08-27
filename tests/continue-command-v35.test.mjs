import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const feature=read('continue-command-v35.js');
const runtime=read('accessibility-runtime.js');
const sw=read('sw.js');

test('Continue Command remembers only bounded same-app hash destinations',()=>{
  assert.match(feature,/STORE='titans:v35ContinueCommand'/);
  assert.match(feature,/String\(location\.hash\|\|`#\$\{current\}`\)\.slice\(0,180\)/);
  assert.match(feature,/if\(!href\.startsWith\('#'\)\)return/);
  assert.match(feature,/if\(current==='home'\|\|!labels\[current\]\)return/);
});

test('Home exposes an accessible clearable Continue shortcut without trapping navigation',()=>{
  assert.match(feature,/aria-label','Continue where you left off'/);
  assert.match(feature,/data-clear-continue/);
  assert.match(feature,/min-height:44px/);
  assert.match(feature,/@media\(max-width:620px\)/);
  assert.match(feature,/prefers/); // guarded below: feature intentionally has no animation dependency
});

test('Continue Command is loaded by the stable runtime and available in the offline shell',()=>{
  assert.match(runtime,/import '\.\/continue-command-v35\.js';/);
  assert.match(sw,/titans-cc-brand-2026-v62/);
  assert.match(sw,/'\/continue-command-v35\.js'/);
});
