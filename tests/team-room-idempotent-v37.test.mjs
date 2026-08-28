import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const accessibility=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');
const teamRoom=fs.readFileSync(new URL('../team-room.js',import.meta.url),'utf8');

test('Team Room owns button activation synchronously at the app boundary',()=>{
  assert.match(teamRoom,/function handleTeamRoomActivation\(event\)/);
  assert.match(teamRoom,/closest\('\.team-room-switcher \[data-team-room-view\]'\)/);
  assert.match(teamRoom,/event\.preventDefault\(\)/);
  assert.match(teamRoom,/event\.stopImmediatePropagation\(\)/);
  assert.match(teamRoom,/setRosterView\(button\.dataset\.teamRoomView\)/);
  assert.match(teamRoom,/trApp\.addEventListener\('click',handleTeamRoomActivation,true\)/);
  assert.doesNotMatch(teamRoom,/trQsa\('button',switcher\)\.forEach\(btn=>btn\.addEventListener\('click'/);
});

test('accessibility layer retries only relevant Team Room hydration or aria drift and never writes Team Room semantics',()=>{
  assert.match(accessibility,/function watchTeamRoomMutations\(records\)/);
  assert.match(accessibility,/record\.type==='childList'/);
  assert.match(accessibility,/record\.target instanceof Element&&record\.target\.matches\('\.team-room-switcher \[data-team-room-view\]'\)/);
  assert.match(accessibility,/new MutationObserver\(watchTeamRoomMutations\)\.observe\(app,\{subtree:true,childList:true,attributes:true,attributeFilter:\['aria-pressed'\]\}\)/);
  assert.match(accessibility,/if\(button&&teamRoomMismatch\(next\)\)requestTeamRoomView\(next\)/);
  assert.match(accessibility,/new CustomEvent\(TEAM_ROOM_VIEW_REQUEST/);
  assert.doesNotMatch(accessibility,/button\.click\(\)/);
  assert.doesNotMatch(accessibility,/setAttribute\('aria-pressed'/);
  assert.doesNotMatch(accessibility,/classList\.toggle\('active'/);
  assert.doesNotMatch(accessibility,/panel\.hidden=/);
  assert.doesNotMatch(accessibility,/addEventListener\('click'/);
  assert.doesNotMatch(accessibility,/attributeFilter:\['hidden','aria-pressed','data-team-room-view'\]/);
});
