import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../cutdown-command-v23.js',import.meta.url),'utf8');

test('Cutdown URL state synchronizes switcher accessibility without synthetic clicks',()=>{
  assert.match(source,/function syncCutdownView\(app,switcher,panel\)/);
  assert.match(source,/get\('view'\)!=='cutdown'/);
  assert.match(source,/app\.dataset\.teamRoomView='cutdown'/);
  assert.match(source,/button\.classList\.toggle\('active',selected\)/);
  assert.match(source,/button\.setAttribute\('aria-pressed',String\(selected\)\)/);
  assert.match(source,/item\.hidden=item!==panel/);
  assert.match(source,/\.roster-summary-strip,.filterbar,.roster-status-filters,#rg/);
  assert.match(source,/syncCutdownView\(app,switcher,panel\)/);
  assert.doesNotMatch(source,/button&&button\.getAttribute\('aria-pressed'\)!=='true'\)button\.click\(\)/);
});

test('Cutdown state sync remains observer-light and keeps shared runtime lifecycle',()=>{
  assert.match(source,/runtime\.onAppRender/);
  assert.match(source,/runtime\.onRoute/);
  assert.match(source,/runtime\.onRefresh/);
  assert.doesNotMatch(source,/MutationObserver/);
});
