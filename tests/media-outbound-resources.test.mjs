import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../media-center-v14.js',import.meta.url),'utf8');

test('Titans media center uses the current indexed TuneIn Titans page',()=>{
  assert.match(source,/https:\/\/tunein\.com\/radio\/Stream-Tennessee-Titans-a37485\//);
  assert.doesNotMatch(source,/Tennessee-Titans-s252150/);
});

test('local affiliate subset is labeled honestly and links to the complete official 2026 list',()=>{
  assert.match(source,/Selected terrestrial Titans Radio affiliates/);
  assert.match(source,/This is a selected local subset/);
  assert.match(source,/https:\/\/www\.tennesseetitans\.com\/broadcast\/titans-radio\/titans-radio-affiliates/);
  assert.match(source,/View the complete official 2026 affiliate list/);
  assert.match(source,/target="_blank" rel="noopener noreferrer"/);
});
