import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const accessibility=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');
const teamRoom=fs.readFileSync(new URL('../team-room.js',import.meta.url),'utf8');

test('Team Room owns button activation synchronously at the app boundary',()=>{
  assert.match(teamRoom,/function handleTeamRoomActivation\(event\)/);
  assert.match(teamRoom,/closest\('\[data-team-room-view\]'\)/);
  assert.match(teamRoom,/event\.preventDefault\(\)/);
  assert.match(teamRoom,/event\.stopImmediatePropagation\(\)/);
  assert.match(teamRoom,/setRosterView\(button\.dataset\.teamRoomView\)/);
  assert.match(teamRoom,/trApp\.addEventListener\('click',handleTeamRoomActivation,true\)/);
  assert.doesNotMatch(teamRoom,/trQsa\('button',switcher\)\.forEach\(btn=>btn\.addEventListener\('click'/);
});

test('accessibility layer only retries after hydration and never writes Team Room semantics',()=>{
  assert.match(accessibility,/new MutationObserver\(scheduleTeamRoomReconcile\)\.observe\(app,\{subtree:true,childList:true\}\)/);
  assert.match(accessibility,/if\(button&&teamRoomMismatch\(next\)\)button\.click\(\)/);
  assert.doesNotMatch(accessibility,/setAttribute\('aria-pressed'/);
  assert.doesNotMatch(accessibility,/classList\.toggle\('active'/);
  assert.doesNotMatch(accessibility,/panel\.hidden=/);
  assert.doesNotMatch(accessibility,/addEventListener\('click'/);
  assert.doesNotMatch(accessibility,/attributeFilter:\['hidden','aria-pressed','data-team-room-view'\]/);
});
