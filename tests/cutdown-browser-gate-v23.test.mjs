import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const smoke=fs.readFileSync(new URL('../scripts/player-gameday-browser-smoke.py',import.meta.url),'utf8');

test('Player/Game Day production smoke gates Cutdown Command before player navigation',()=>{
  assert.match(smoke,/stage='cutdown:desktop'/);
  assert.match(smoke,/data-team-room-view=\\\"cutdown\\\"/);
  assert.match(smoke,/data-cutdown-command/);
  assert.match(smoke,/operations\.nfl\.com\/calendar-events\/nfl-important-dates/);
  assert.match(smoke,/tennesseetitans\.com\/team\/transactions/);
  assert.match(smoke,/Final active limit/);
  assert.match(smoke,/cuts required/);
});

test('Cutdown production smoke validates 390px layout and 48px actions',()=>{
  assert.match(smoke,/stage='cutdown:mobile'/);
  assert.match(smoke,/set_window_size\(390,844\)/);
  assert.match(smoke,/no_overflow\(driver,'cutdown 390px'\)/);
  assert.match(smoke,/any\(x\['h'\]<48 for x in cutdown_mobile\['links'\]\)/);
  assert.match(smoke,/cutdownMobileTargets/);
});

test('Cutdown browser results are persisted in the existing production report',()=>{
  assert.match(smoke,/'cutdownCommand':True/);
  assert.match(smoke,/'cutdownCommandText':cutdown\['text'\]/);
  assert.match(smoke,/'cutdownMobileTargets':cutdown_mobile\['links'\]/);
});

test('Cutdown browser smoke reacquires and samples the view after activation until roster rerenders settle',()=>{
  assert.match(smoke,/def activate_cutdown_view\(driver,timeout=8\):/);
  assert.match(smoke,/if\(button\.getAttribute\('aria-pressed'\)!=='true'\|\|panel\.hidden\)button\.click\(\)/);
  assert.match(smoke,/button=document\.querySelector\('\[data-team-room-view="cutdown"\]'\)/);
  assert.match(smoke,/panel=document\.querySelector\('\[data-panel="cutdown"\]'\)/);
  assert.match(smoke,/selected:button\?\.getAttribute\('aria-pressed'\)==='true'/);
  assert.match(smoke,/visible:Boolean\(panel&&!panel\.hidden\)/);
  assert.match(smoke,/buttonConnected:Boolean\(button\?\.isConnected\)/);
  assert.match(smoke,/panelConnected:Boolean\(panel\?\.isConnected\)/);
  assert.match(smoke,/if stable>=3:return last/);
  assert.match(smoke,/cutdown_settle=activate_cutdown_view\(driver\)/);
  assert.match(smoke,/settled:Boolean\(arguments\[0\]\?\.selected&&arguments\[0\]\?\.visible\)/);
});
