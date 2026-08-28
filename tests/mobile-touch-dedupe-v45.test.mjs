import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');

test('mobile app controls get a real 44px touch-height floor',()=>{
  assert.match(source,/#app button,/);
  assert.match(source,/#app select,/);
  assert.match(source,/input:not\(\[type="hidden"\]\):not\(\[type="checkbox"\]\):not\(\[type="radio"\]\)/);
  assert.match(source,/min-height:44px!important/);
});

test('Home enhancement races cannot leave duplicate visible command surfaces',()=>{
  assert.match(source,/function dedupeHomeEnhancements\(\)/);
  assert.ok(source.includes('.fan-today[data-fan-v09="today"]'));
  assert.ok(source.includes('.v10-home[data-v10-home]'));
  assert.match(source,/matches\.slice\(1\)\.forEach\(node=>node\.remove\(\)\)/);
  assert.match(source,/function syncAsyncRegions\(\)[\s\S]*dedupeHomeEnhancements\(\)/);
});
