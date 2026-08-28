import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const accessibility=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');
const teamRoom=fs.readFileSync(new URL('../team-room.js',import.meta.url),'utf8');

test('Team Room controller owns selected control visible panel base visibility and URL state',()=>{
  assert.match(teamRoom,/app\.dataset\.teamRoomActiveView=next/);
  assert.match(teamRoom,/b\.setAttribute\('aria-pressed',String\(on\)\)/);
  assert.match(teamRoom,/p\.hidden=p\.dataset\.panel!==next/);
  assert.match(teamRoom,/syncRosterBaseVisibility\(app,next\)/);
  assert.match(teamRoom,/syncRosterViewUrl\(next\)/);
});

test('explicit Team Room activation cannot fall through to competing click-state writers',()=>{
  assert.match(teamRoom,/trApp\.addEventListener\('click',handleTeamRoomActivation,true\)/);
  assert.match(teamRoom,/event\.stopImmediatePropagation\(\)/);
  assert.match(teamRoom,/setRosterView\(button\.dataset\.teamRoomView\)/);
  assert.doesNotMatch(accessibility,/setAttribute\('aria-pressed'/);
});

test('async repair routes through Team Room owner instead of synthetic clicks',()=>{
  assert.match(teamRoom,/TEAM_ROOM_VIEW_REQUEST='titans:team-room-view-request'/);
  assert.match(teamRoom,/function handleTeamRoomViewRequest\(event\)/);
  assert.match(teamRoom,/trApp\.addEventListener\(TEAM_ROOM_VIEW_REQUEST,handleTeamRoomViewRequest\)/);
  assert.match(accessibility,/new CustomEvent\(TEAM_ROOM_VIEW_REQUEST/);
  assert.doesNotMatch(accessibility,/button\.click\(\)/);
});
