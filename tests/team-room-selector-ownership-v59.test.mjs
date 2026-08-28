import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const teamRoom=fs.readFileSync(new URL('../team-room.js',import.meta.url),'utf8');
const accessibility=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');
const repair=fs.readFileSync(new URL('../team-room-state-repair-v54.js',import.meta.url),'utf8');

test('Team Room reserves data-team-room-view for switcher controls only',()=>{
  assert.match(teamRoom,/app\.dataset\.teamRoomActiveView=next/);
  assert.doesNotMatch(teamRoom,/app\.dataset\.teamRoomView=/);
  assert.match(teamRoom,/function teamRoomControls\(app\)\{return trQsa\('\.team-room-switcher \[data-team-room-view\]',app\);\}/);
  assert.match(teamRoom,/closest\('\.team-room-switcher \[data-team-room-view\]'\)/);
});

test('all Team Room recovery layers read the dedicated root-state attribute',()=>{
  assert.match(accessibility,/app\.dataset\.teamRoomActiveView/);
  assert.doesNotMatch(accessibility,/app\.dataset\.teamRoomView/);
  assert.match(repair,/app\.dataset\.teamRoomActiveView/);
  assert.doesNotMatch(repair,/app\.dataset\.teamRoomView/);
});

test('recovery mutation filters only treat switcher controls as Team Room view controls',()=>{
  assert.match(accessibility,/matches\('\.team-room-switcher \[data-team-room-view\]'\)/);
  assert.match(repair,/matches\('\.team-room-switcher \[data-team-room-view\]'\)/);
});
