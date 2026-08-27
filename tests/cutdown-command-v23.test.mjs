import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const js=read('cutdown-command-v23.js');
const css=read('cutdown-command-v23.css');
const teamRoom=read('team-room.js');
const html=read('index.html');
const sw=read('sw.js');

test('Cutdown Command uses the official 2026 final roster deadline and limit',()=>{
  assert.match(js,/DEADLINE='2026-08-30T22:00:00Z'/);
  assert.match(js,/FINAL_LIMIT=53/);
  assert.match(js,/operations\.nfl\.com\/calendar-events\/nfl-important-dates/);
  assert.match(js,/timeZone:'America\/New_York'/);
  assert.match(js,/NFL limit applies to the Active\/Inactive List/);
});

test('Cutdown Command reports loaded roster facts without predicting cuts',()=>{
  assert.match(js,/String\(p\.status\|\|'\'\)\.toLowerCase\(\)==='active'/);
  assert.match(js,/active\.length-FINAL_LIMIT/);
  assert.match(js,/does <strong>not<\/strong> rank bubble players or predict cuts/);
  assert.match(js,/rows above 53.*not the same thing as.*cuts required/);
  assert.doesNotMatch(js,/cut probability|roster probability|safe player|bubble score|projected cut/i);
});

test('Cutdown is a keyboard-compatible Team Room view',()=>{
  assert.match(teamRoom,/teamRoomButton\('cutdown','Cutdown',view==='cutdown'\)/);
  assert.match(teamRoom,/cutdown\.dataset\.panel='cutdown'/);
  assert.match(teamRoom,/wireTeamRoomSwitcher\(switcher\)/);
  assert.match(teamRoom,/setRosterView\(target\.dataset\.teamRoomView,\{focus:true\}\)/);
});

test('Cutdown uses the shared runtime and stays observer-light',()=>{
  assert.match(js,/window\.TitansRuntime/);
  assert.match(js,/runtime\.apiJson\('\/api\/data'/);
  assert.match(js,/runtime\.onAppRender/);
  assert.match(js,/runtime\.onRoute/);
  assert.match(js,/runtime\.onRefresh/);
  assert.doesNotMatch(js,/new MutationObserver/);
});

test('Cutdown is loaded, offline packaged, and mobile touch-safe',()=>{
  assert.match(html,/cutdown-command-v23\.css\?v=1/);
  assert.match(html,/cutdown-command-v23\.js\?v=1/);
  assert.match(sw,/'\/cutdown-command-v23\.css'/);
  assert.match(sw,/'\/cutdown-command-v23\.js'/);
  assert.match(sw,/titans-cc-brand-2026-v\d+/);
  assert.match(css,/@media\(max-width:720px\)/);
  assert.match(css,/min-height:48px/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});

test('Home card deep-links directly into the Team Room-owned Cutdown view',()=>{
  assert.match(js,/href="#roster\?view=cutdown"/);
  assert.match(teamRoom,/const requestedRosterView=\(\)=>/);
  assert.match(teamRoom,/TR_VIEWS=new Set\(\['roster','depth','staff','cutdown'\]\)/);
  assert.match(teamRoom,/const initialView=requestedRosterView\(\)\|\|trPreferredRosterView/);
  assert.match(teamRoom,/setRosterView\(initialView,\{persist:false\}\)/);
  assert.doesNotMatch(js,/syncCutdownView/);
});