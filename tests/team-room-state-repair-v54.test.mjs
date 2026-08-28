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

test('v54 asks Team Room to repair the invariant instead of becoming another semantic writer',()=>{
  assert.match(repair,/TEAM_ROOM_VIEW_REQUEST='titans:team-room-view-request'/);
  assert.match(repair,/new CustomEvent\(TEAM_ROOM_VIEW_REQUEST/);
  assert.match(repair,/if\(hasMismatch\(view\)\)requestRepair\(view\)/);
  assert.doesNotMatch(repair,/app\.dataset\.teamRoomView\s*=/);
  assert.doesNotMatch(repair,/button\.setAttribute\('aria-pressed'/);
  assert.doesNotMatch(repair,/button\.classList\.toggle/);
  assert.doesNotMatch(repair,/panel\.hidden\s*=/);
});

test('repair only requests owner reconciliation when current semantics disagree',()=>{
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
