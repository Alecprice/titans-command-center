import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');

test('Team Room semantic repair no longer rewrites Team Room attributes itself',()=>{
  assert.doesNotMatch(js,/setAttribute\('aria-pressed'/);
  assert.doesNotMatch(js,/classList\.toggle\('active'/);
  assert.doesNotMatch(js,/panel\.hidden=/);
  assert.doesNotMatch(js,/element\.hidden=/);
  assert.match(js,/button\.click\(\)/);
});

test('Team Room repair watches hydration without observing its own semantic attributes',()=>{
  assert.match(js,/new MutationObserver\(scheduleTeamRoomReconcile\)\.observe\(app,\{subtree:true,childList:true\}\)/);
  assert.doesNotMatch(js,/attributeFilter:\['hidden','aria-pressed','data-team-room-view'\]/);
  assert.match(js,/requestedTeamView\(\)\|\|stored/);
});
