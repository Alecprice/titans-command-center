import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const smoke=fs.readFileSync(new URL('../scripts/browser-navigation-smoke.py',import.meta.url),'utf8');
const teamRoom=fs.readFileSync(new URL('../team-room.js',import.meta.url),'utf8');

test('browser navigation smoke reads the canonical Team Room active-view state',()=>{
  assert.match(teamRoom,/app\.dataset\.teamRoomActiveView=next/);
  assert.match(smoke,/dataset\.teamRoomActiveView === 'depth'/);
  assert.match(smoke,/dataset\.teamRoomActiveView === 'staff'/);
  assert.match(smoke,/dataset\.teamRoomActiveView === 'roster'/);
  assert.match(smoke,/teamRoomView:app\?\.dataset\?\.teamRoomActiveView\|\|null/);
  assert.doesNotMatch(smoke,/dataset\.teamRoomView/);
});

test('navigation smoke still verifies visible Team Room semantics in addition to root state',()=>{
  assert.match(smoke,/data-team-room-view=\\"depth\\".*aria-pressed/);
  assert.match(smoke,/data-panel=\\"depth\\".*hidden === false/);
  assert.match(smoke,/data-team-room-view=\\"staff\\".*aria-pressed/);
  assert.match(smoke,/rosterGridHidden:grid\?\.hidden/);
});
