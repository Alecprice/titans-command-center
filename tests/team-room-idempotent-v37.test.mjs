import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');

test('Team Room fallback only writes semantic state after the real controller fails to settle',()=>{
  assert.match(js,/function applyTeamRoomFallback\(next\)/);
  assert.match(js,/if\(!button\|\|!teamRoomMismatch\(next\)\)return/);
  assert.match(js,/button\.click\(\)/);
  assert.match(js,/queueMicrotask\(\(\)=>\{if\(teamRoomMismatch\(next\)\)applyTeamRoomFallback\(next\);\}\)/);
  assert.match(js,/button\.setAttribute\('aria-pressed',String\(selected\)\)/);
  assert.match(js,/panel\.hidden=panel\.dataset\.panel!==next/);
});

test('Team Room repair watches hydration and explicit clicks without observing semantic attributes',()=>{
  assert.match(js,/new MutationObserver\(scheduleTeamRoomReconcile\)\.observe\(app,\{subtree:true,childList:true\}\)/);
  assert.doesNotMatch(js,/attributeFilter:\['hidden','aria-pressed','data-team-room-view'\]/);
  assert.match(js,/closest\('\[data-team-room-view\]'\)/);
  assert.match(js,/scheduleTeamRoomReconcile\(\)/);
  assert.match(js,/requestedTeamView\(\)\|\|stored/);
});
