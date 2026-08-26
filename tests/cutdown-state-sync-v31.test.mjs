import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const cutdown=read('cutdown-command-v23.js');
const teamRoom=read('team-room.js');

test('Team Room exclusively owns URL-selected Cutdown accessibility and panel state',()=>{
  assert.match(teamRoom,/const requestedRosterView=\(\)=>/);
  assert.match(teamRoom,/TR_VIEWS=new Set\(\['roster','depth','staff','cutdown'\]\)/);
  assert.match(teamRoom,/function setRosterView\(view,\{focus=false,persist=true\}=\{\}\)/);
  assert.match(teamRoom,/b\.setAttribute\('aria-pressed',String\(on\)\)/);
  assert.match(teamRoom,/p\.hidden=p\.dataset\.panel!==next/);
  assert.match(teamRoom,/setRosterView\(requestedRosterView\(\)\|\|trPreferredRosterView,\{persist:false\}\)/);
  assert.match(teamRoom,/setRosterView\(requestedRosterView\(\)\|\|app\.dataset\.teamRoomView\|\|trPreferredRosterView,\{persist:false\}\)/);
  assert.doesNotMatch(cutdown,/function syncCutdownView/);
  assert.doesNotMatch(cutdown,/dataset\.teamRoomView/);
  assert.doesNotMatch(cutdown,/querySelectorAll\('\[data-team-room-view\]'\)/);
});

test('Cutdown refreshes only its panel content and leaves Team Room selection untouched',()=>{
  assert.match(cutdown,/const panel=app\.querySelector\('\.team-room-panel\[data-panel="cutdown"\]'\)/);
  assert.match(cutdown,/panel\.innerHTML=rosterPanel\(\)/);
  assert.match(cutdown,/wireMy53\(panel,snapshot\(\)\.roster\)/);
  assert.doesNotMatch(cutdown,/const switcher=app\.querySelector\('\.team-room-switcher'\)/);
  assert.doesNotMatch(cutdown,/button\.click\(\)/);
});

test('Cutdown remains observer-light and keeps shared runtime lifecycle',()=>{
  assert.match(cutdown,/runtime\.onAppRender/);
  assert.match(cutdown,/runtime\.onRoute/);
  assert.match(cutdown,/runtime\.onRefresh/);
  assert.doesNotMatch(cutdown,/MutationObserver/);
});