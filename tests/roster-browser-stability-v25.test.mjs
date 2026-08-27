import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const smoke=fs.readFileSync(new URL('../scripts/player-gameday-browser-smoke.py',import.meta.url),'utf8');
const teamRoom=fs.readFileSync(new URL('../team-room.js',import.meta.url),'utf8');

test('production browser smoke requires exactly one roster enhancement set',()=>{
  assert.match(smoke,/stage='roster:stability'/);
  assert.match(smoke,/official-injury-state'\)\.length === 1/);
  assert.match(smoke,/injuryBanners/);
  assert.match(smoke,/switchers/);
  assert.match(smoke,/cutdownButtons/);
  assert.match(smoke,/cutdownPanels/);
  assert.match(smoke,/Roster enhancement duplicated or missing/);
});

test('injury-state enhancement re-queries the live roster head after async hydration',()=>{
  assert.match(teamRoom,/const data=await loadTeamRoom\(\),inj=data\.teamContext\?\.injuryReport,currentApp=trQs\('#app'\),head=trQs\('\.page-head',currentApp\)/);
  assert.match(teamRoom,/trQs\('\.official-injury-state',currentApp\)/);
  assert.match(teamRoom,/head\.insertAdjacentElement\('afterend',el\)/);
});

test('production browser smoke exercises My 53 local add and remove persistence',()=>{
  assert.match(smoke,/stage='my53:interaction'/);
  assert.match(smoke,/data-my53-clear/);
  assert.match(smoke,/data-my53-count/);
  assert.match(smoke,/titans:my53:v1/);
  assert.match(smoke,/My 53 add\/persist failed/);
  assert.match(smoke,/My 53 remove\/persist failed/);
  assert.match(smoke,/'my53Interaction'/);
});

test('production browser smoke checks My 53 touch targets at 390px',()=>{
  assert.match(smoke,/set_window_size\(390,844\)/);
  assert.match(smoke,/my53Targets/);
  assert.match(smoke,/any\(x\['h'\]<48 for x in cutdown_mobile\['my53Targets'\]\)/);
  assert.match(smoke,/'my53MobileTargets'/);
});