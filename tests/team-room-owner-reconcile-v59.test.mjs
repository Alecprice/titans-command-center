import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../team-room.js',import.meta.url),'utf8');

test('Team Room owner detects complete selected-state drift instead of only panel visibility',()=>{
  assert.match(source,/function rosterViewInvariantMismatch\(app,view\)/);
  assert.match(source,/button\.getAttribute\('aria-pressed'\)!==String\(on\)/);
  assert.match(source,/button\.classList\.contains\('active'\)!==on/);
  assert.match(source,/panel\.hidden!==\(panel\.dataset\.panel!==view\)/);
  assert.match(source,/app\.dataset\.teamRoomView!==view/);
});

test('Team Room owner self-heals semantic drift through its canonical setter',()=>{
  assert.match(source,/function reconcileRosterViewInvariant\(\)/);
  assert.match(source,/const view=requestedRosterView\(\)\|\|app\.dataset\.teamRoomView\|\|trPreferredRosterView/);
  assert.match(source,/if\(rosterViewInvariantMismatch\(app,view\)\)setRosterView\(view,\{persist:false\}\)/);
  assert.doesNotMatch(source,/setInterval/);
});

test('owner reconciliation is mutation-driven and microtask-coalesced',()=>{
  assert.match(source,/function scheduleRosterViewInvariant\(\)/);
  assert.match(source,/if\(trInvariantQueued\)return/);
  assert.match(source,/queueMicrotask\(reconcileRosterViewInvariant\)/);
  assert.match(source,/new MutationObserver\(handleTeamRoomOwnerMutations\)/);
  assert.match(source,/attributeFilter:\['aria-pressed','class','hidden'\]/);
});
