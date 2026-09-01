import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../fan-enrichment-addons-v13.js',import.meta.url),'utf8');

test('Fan picks latest final is selected by game date rather than snapshot array order',()=>{
  assert.match(js,/function latestFinal\(\)\{return \(state\.base\?\.games\|\|\[\]\)\.filter\(g=>\/final\/i\.test/);
  assert.match(js,/time:Date\.parse\(game\.date\)/);
  assert.match(js,/return bt-at\|\|b\.index-a\.index/);
  assert.match(js,/const latest=latestFinal\(\)/);
  assert.doesNotMatch(js,/\[\.\.\.\(state\.base\?\.games\|\|\[\]\)\]\.reverse\(\)\.find\(g=>\/final\/i/);
});
