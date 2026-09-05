import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const trails=readFileSync(new URL('../legacy-trails-v4.js',import.meta.url),'utf8');
const smoke=readFileSync(new URL('../scripts/legacy-browser-smoke.py',import.meta.url),'utf8');

test('Legacy Trails can shrink as a grid item on phone layouts',()=>{
  assert.match(trails,/\.legacy-trails\{min-width:0;width:100%;max-width:100%;box-sizing:border-box;/);
  assert.match(trails,/@media\(max-width:760px\)\{\.legacy-trails\{padding:14px\}/);
});

test('Legacy Trails keeps the internal card rail scrollable without widening its parent',()=>{
  assert.match(trails,/\.legacy-trail-grid\{min-width:0;max-width:100%;display:flex;overflow-x:auto;/);
  assert.doesNotMatch(trails,/\.legacy-trails\{[^}]*overflow-x:hidden/);
});

test('production smoke keeps exact mobile containment and touch contracts',()=>{
  assert.match(smoke,/Legacy Trails outside mobile viewport/);
  assert.match(smoke,/mobile\['overflow'\]/);
  assert.match(smoke,/a\['h'\]<44 or a\['w'\]<44/);
  assert.match(smoke,/driver_for\(390,844\)/);
});
