import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const repair=fs.readFileSync(new URL('../team-room-state-repair-v54.js',import.meta.url),'utf8');
const guard=fs.readFileSync(new URL('../roster-filter-guard-v40.js',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');

test('post-hydration Team Room repair is loaded through the stable roster runtime',()=>{
  assert.match(guard,/import '\.\/team-room-state-repair-v54\.js'/);
  assert.match(sw,/team-room-state-repair-v54\.js/);
});

test('requested roster deep link remains authoritative during semantic drift',()=>{
  assert.match(repair,/const targetView=\(\)=>requested\(\)\|\|selected\(\)/);
  assert.match(repair,/location\.hash\.split\('\?'\)/);
  assert.match(repair,/VIEWS\.has\(view\)/);
});

test('repair restores button panel and base visibility as one invariant',()=>{
  assert.match(repair,/app\.dataset\.teamRoomView=view/);
  assert.match(repair,/button\.setAttribute\('aria-pressed',String\(active\)\)/);
  assert.match(repair,/button\.classList\.toggle\('active',active\)/);
  assert.match(repair,/panel\.hidden=panel\.dataset\.panel!==view/);
  assert.match(repair,/element\.hidden=hideBase/);
});

test('repair only writes when current Team Room semantics actually disagree',()=>{
  assert.match(repair,/if\(!hasMismatch\(view\)\)return/);
  assert.match(repair,/button\.getAttribute\('aria-pressed'\)!=='true'/);
  assert.match(repair,/!button\.classList\.contains\('active'\)/);
  assert.match(repair,/panel&&panel\.hidden/);
  assert.match(repair,/baseMismatch/);
});

test('repair is mutation-driven and coalesced rather than polling',()=>{
  assert.match(repair,/new MutationObserver/);
  assert.match(repair,/attributeFilter:\['aria-pressed','class','hidden'\]/);
  assert.match(repair,/if\(queued\)return/);
  assert.match(repair,/queueMicrotask\(repair\)/);
  assert.doesNotMatch(repair,/setInterval/);
  assert.doesNotMatch(repair,/setTimeout/);
});
