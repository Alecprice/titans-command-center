import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');

test('Team Room semantic repair keeps the selected control and visible panel atomic',()=>{
  assert.match(js,/TEAM_VIEWS=new Set\(\['roster','depth','staff','cutdown'\]\)/);
  assert.match(js,/if\(button\.getAttribute\('aria-pressed'\)!==pressedValue\)button\.setAttribute\('aria-pressed',pressedValue\)/);
  assert.match(js,/const hidden=panel\.dataset\.panel!==next/);
  assert.match(js,/if\(panel\.hidden!==hidden\)panel\.hidden=hidden/);
  assert.match(js,/if\(app\.dataset\.teamRoomView!==next\)app\.dataset\.teamRoomView=next/);
});

test('Team Room repair survives dynamic renders and delegated clicks',()=>{
  assert.match(js,/attributeFilter:\['hidden','aria-pressed','data-team-room-view'\]/);
  assert.match(js,/closest\('\[data-team-room-view\]'\)/);
  assert.match(js,/reconcileTeamRoom\(button\.dataset\.teamRoomView,\{syncUrl:true\}\)/);
  assert.match(js,/addEventListener\('hashchange',scheduleTeamRoomReconcile\)/);
});
