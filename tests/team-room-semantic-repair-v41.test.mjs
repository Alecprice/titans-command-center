import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const runtime=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');
const teamRoom=fs.readFileSync(new URL('../team-room.js',import.meta.url),'utf8');

test('Team Room semantic repair observes only relevant aria drift plus hydration',()=>{
  assert.match(runtime,/function watchTeamRoomMutations\(records\)/);
  assert.match(runtime,/record\.type==='childList'/);
  assert.match(runtime,/record\.type==='attributes'/);
  assert.match(runtime,/record\.target\.matches\('\[data-team-room-view\]'\)/);
  assert.match(runtime,/attributeFilter:\['aria-pressed'\]/);
});

test('semantic repair delegates state ownership back to Team Room instead of writing aria itself',()=>{
  assert.match(runtime,/if\(button&&teamRoomMismatch\(next\)\)button\.click\(\)/);
  assert.doesNotMatch(runtime,/button\.setAttribute\('aria-pressed'/);
  assert.doesNotMatch(runtime,/panel\.hidden\s*=/);
  assert.match(teamRoom,/function handleTeamRoomActivation\(event\)/);
  assert.match(teamRoom,/setRosterView\(button\.dataset\.teamRoomView\)/);
});

test('requested roster deep link remains authoritative when a pressed state drifts',()=>{
  assert.match(runtime,/const next=requestedTeamView\(\)\|\|stored\|\|/);
  assert.match(runtime,/button\.getAttribute\('aria-pressed'\)!=='true'/);
  assert.match(runtime,/button\.classList\.contains\('active'\)===false/);
  assert.match(runtime,/panel&&panel\.hidden/);
});

test('repair is microtask-coalesced so its own Team Room writes do not create a mutation loop',()=>{
  assert.match(runtime,/if\(teamRoomQueued\)return/);
  assert.match(runtime,/queueMicrotask\(\(\)=>\{teamRoomQueued=false;reconcileTeamRoom\(\);\}\)/);
  assert.doesNotMatch(runtime,/setInterval/);
  assert.doesNotMatch(runtime,/setTimeout/);
});
