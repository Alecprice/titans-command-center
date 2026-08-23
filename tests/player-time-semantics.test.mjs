import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../player-intelligence-v16.js',import.meta.url),'utf8');

test('Player Intelligence separates calendar facts from team-time event dates',()=>{
  assert.match(source,/const calendarDate=.*timeZone:'UTC'/);
  assert.match(source,/const teamDate=.*timeZone:'America\/Chicago'/);
  assert.doesNotMatch(source,/Intl\.DateTimeFormat\(undefined/);
});

test('date-only injury and transaction facts cannot roll back a day in Nashville',()=>{
  const value='2026-08-19';
  const calendar=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(value));
  const central=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'America/Chicago'}).format(new Date(value));
  assert.equal(calendar,'Aug 19, 2026');
  assert.equal(central,'Aug 18, 2026');
  assert.match(source,/reportDate\?calendarDate\(currentInjury\.reportDate\):teamDate\(currentInjury\.capturedAt\)/);
  assert.match(source,/transaction\.date\?calendarDate\(transaction\.date\):teamDate\(transaction\.publishedAt\)/);
});

test('player-game event dates use Nashville team time',()=>{
  const kickoff='2026-08-24T00:00:00Z';
  const formatted=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'America/Chicago'}).format(new Date(kickoff));
  assert.equal(formatted,'Aug 23, 2026');
  assert.match(source,/teamDate\(row\.kickoff\)/);
  assert.match(source,/last\?teamDate\(last\.kickoff\)/);
  assert.match(source,/meta:teamDate\(item\.kickoff\)/);
});
