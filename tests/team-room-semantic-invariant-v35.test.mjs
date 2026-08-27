import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const accessibility=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');
const teamRoom=fs.readFileSync(new URL('../team-room.js',import.meta.url),'utf8');

test('Team Room controller remains the primary owner of selected control and visible panel semantics',()=>{
  assert.match(teamRoom,/app\.dataset\.teamRoomView=next/);
  assert.match(teamRoom,/b\.setAttribute\('aria-pressed',String\(on\)\)/);
  assert.match(teamRoom,/p\.hidden=p\.dataset\.panel!==next/);
  assert.match(teamRoom,/syncRosterBaseVisibility\(app,next\)/);
});

test('accessibility repair retries the real control then applies one bounded fallback only if still mismatched',()=>{
  assert.match(accessibility,/TEAM_VIEWS=new Set\(\['roster','depth','staff','cutdown'\]\)/);
  assert.match(accessibility,/teamRoomMismatch\(next\)/);
  assert.match(accessibility,/button\.click\(\)/);
  assert.match(accessibility,/if\(teamRoomMismatch\(next\)\)applyTeamRoomFallback\(next\)/);
  assert.match(accessibility,/app\.dataset\.teamRoomView=next/);
  assert.match(accessibility,/button\.setAttribute\('aria-pressed',String\(selected\)\)/);
  assert.match(accessibility,/panel\.hidden=panel\.dataset\.panel!==next/);
  assert.match(accessibility,/addEventListener\('hashchange',scheduleTeamRoomReconcile\)/);
});
