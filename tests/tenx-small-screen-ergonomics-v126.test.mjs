import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const runtime=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');

test('small-screen dock never drops below 12px labels',()=>{
  assert.match(runtime,/\.mobile-nav a,\.mobile-nav button\{/);
  assert.match(runtime,/font-size:12px!important;/);
  assert.doesNotMatch(runtime,/\.mobile-nav a,\.mobile-nav button\{font-size:10px!important\}/);
});

test('small-screen controls wrap instead of forcing horizontal overflow',()=>{
  assert.match(runtime,/white-space:normal;/);
  assert.match(runtime,/overflow-wrap:anywhere;/);
  assert.match(runtime,/min-width:0!important;/);
});

test('forms and binary choices remain phone-friendly',()=>{
  assert.match(runtime,/max-width:100%!important;/);
  assert.match(runtime,/box-sizing:border-box!important;/);
  assert.match(runtime,/label:has\(input\[type="checkbox"\]\)/);
  assert.match(runtime,/label:has\(input\[type="radio"\]\)/);
  assert.match(runtime,/min-height:44px;/);
});

test('keyboard focus and wide content stay usable on phones',()=>{
  assert.match(runtime,/:focus-visible\{/);
  assert.match(runtime,/outline:3px solid currentColor!important;/);
  assert.match(runtime,/#app table\{/);
  assert.match(runtime,/overflow-x:auto;/);
  assert.match(runtime,/overscroll-behavior-inline:contain;/);
  assert.match(runtime,/@media \(max-width:340px\)/);
});
