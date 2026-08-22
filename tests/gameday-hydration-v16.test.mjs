import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Game Day 3.0 does not render before its data promises hydrate',()=>{
  const js=read('gameday-v16.js');
  assert.match(js,/if\(route\(\)!=='live'\|\|!state\.data\|\|!state\.fan\)return/);
  assert.match(js,/await load\(\)/);
  assert.match(js,/if\(current!==state\.serial\|\|route\(\)!=='live'\)return;render\(\)/);
});

test('Game Day hydration fix remains packaged in a versioned PWA cache',()=>{
  const sw=read('sw.js');
  assert.match(sw,/const CACHE = 'titans-cc-brand-2026-v\d+'/);
  assert.match(sw,/\/gameday-v16\.js/);
});
