import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const accessibility=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');
const teamRoom=fs.readFileSync(new URL('../team-room.js',import.meta.url),'utf8');

test('Team Room controller owns selected control and visible panel semantics',()=>{
  assert.match(teamRoom,/app\.dataset\.teamRoomView=next/);
  assert.match(teamRoom,/b\.setAttribute\('aria-pressed',String\(on\)\)/);
  assert.match(teamRoom,/p\.hidden=p\.dataset\.panel!==next/);
  assert.match(teamRoom,/syncRosterBaseVisibility\(app,next\)/);
});

test('accessibility repair delegates a mismatch to the real Team Room control',()=>{
  assert.match(accessibility,/TEAM_VIEWS=new Set\(\['roster','depth','staff','cutdown'\]\)/);
  assert.match(accessibility,/button\.getAttribute\('aria-pressed'\)!=='true'/);
  assert.match(accessibility,/button\.click\(\)/);
  assert.doesNotMatch(accessibility,/button\.setAttribute\('aria-pressed'/);
  assert.doesNotMatch(accessibility,/panel\.hidden=/);
  assert.match(accessibility,/addEventListener\('hashchange',scheduleTeamRoomReconcile\)/);
});
