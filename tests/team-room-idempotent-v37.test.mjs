import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');

test('Team Room semantic repair does not continuously rewrite observer-owned state',()=>{
  assert.match(js,/if\(app\.dataset\.teamRoomView!==next\)app\.dataset\.teamRoomView=next/);
  assert.match(js,/if\(button\.classList\.contains\('active'\)!==selected\)button\.classList\.toggle\('active',selected\)/);
  assert.match(js,/if\(button\.getAttribute\('aria-pressed'\)!==pressedValue\)button\.setAttribute\('aria-pressed',pressedValue\)/);
  assert.match(js,/if\(panel\.hidden!==hidden\)panel\.hidden=hidden/);
  assert.match(js,/if\(element\.hidden!==hideRoster\)element\.hidden=hideRoster/);
});

test('Team Room repair still watches hydration and dynamic view changes',()=>{
  assert.match(js,/attributeFilter:\['hidden','aria-pressed','data-team-room-view'\]/);
  assert.match(js,/new MutationObserver\(scheduleTeamRoomReconcile\)/);
  assert.match(js,/reconcileTeamRoom\(button\.dataset\.teamRoomView,\{syncUrl:true\}\)/);
});
