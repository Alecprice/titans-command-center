import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');

test('Team Room semantic repair keeps the selected control and visible panel atomic',()=>{
  assert.match(js,/TEAM_VIEWS=new Set\(\['roster','depth','staff','cutdown'\]\)/);
  assert.match(js,/button\.setAttribute\('aria-pressed',String\(selected\)\)/);
  assert.match(js,/panel\.hidden=panel\.dataset\.panel!==next/);
  assert.match(js,/app\.dataset\.teamRoomView=next/);
});

test('Team Room repair survives dynamic renders and delegated clicks',()=>{
  assert.match(js,/attributeFilter:\['hidden','aria-pressed','data-team-room-view'\]/);
  assert.match(js,/closest\('\[data-team-room-view\]'\)/);
  assert.match(js,/reconcileTeamRoom\(button\.dataset\.teamRoomView,\{syncUrl:true\}\)/);
  assert.match(js,/addEventListener\('hashchange',scheduleTeamRoomReconcile\)/);
});
