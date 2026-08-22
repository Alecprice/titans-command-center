import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {formatCalendarDate,formatTeamKickoff,TEAM_TIME_LABEL,TEAM_TIME_ZONE} from '../team-time-v21.js';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('team schedule time is pinned to Nashville rather than host runtime timezone',()=>{
  assert.equal(TEAM_TIME_ZONE,'America/Chicago');
  assert.equal(TEAM_TIME_LABEL,'Nashville time');
  const value=formatTeamKickoff('2026-08-24T00:00:00.000Z');
  assert.match(value,/Sun, Aug 23/);
  assert.match(value,/7:00 PM/);
  assert.match(value,/CDT/);
  assert.doesNotMatch(value,/UTC/);
});

test('calendar-only transaction dates do not shift to the prior Nashville day',()=>{
  assert.equal(formatCalendarDate('2026-08-24T00:00:00.000Z'),'Aug 24, 2026');
  assert.equal(formatCalendarDate('not-a-date'),'Date not loaded');
  assert.equal(formatTeamKickoff('not-a-date'),'Time TBD');
});

test('365 Mode and Ask Titans share the team-time contract',()=>{
  const runtime=read('runtime-v19.js');
  const mode=read('mode-365-v19.js');
  const ask=read('ask-titans-v17.js');
  assert.match(runtime,/from '\.\/team-time-v21\.js'/);
  assert.match(runtime,/formatTeamKickoff/);
  assert.match(runtime,/teamTimeZone:TEAM_TIME_ZONE/);
  assert.match(runtime,/teamTimeLabel:TEAM_TIME_LABEL/);
  assert.match(mode,/runtime\.formatTeamKickoff\(value\)/);
  assert.match(ask,/formatTeamKickoff/);
  assert.match(ask,/TEAM_TIME_LABEL/);
  assert.match(ask,/formatCalendarDate\(x\.date\)/);
  assert.doesNotMatch(mode,/new Intl\.DateTimeFormat\(undefined/);
  assert.doesNotMatch(ask,/new Intl\.DateTimeFormat\(undefined/);
});

test('production browser gates verify Nashville schedule time rather than UTC host defaults',()=>{
  const askSmoke=read('scripts/ask-titans-browser-smoke.py');
  const runtimeSmoke=read('scripts/runtime-365-browser-smoke.py');
  assert.match(askSmoke,/stage='kickoff-timezone'/);
  assert.match(askSmoke,/Nashville time/);
  assert.match(askSmoke,/teamTimeVerified/);
  assert.match(askSmoke,/CDT/);
  assert.match(askSmoke,/CST/);
  assert.match(runtimeSmoke,/teamTimeZone/);
  assert.match(runtimeSmoke,/America\/Chicago/);
  assert.match(runtimeSmoke,/Nashville time/);
  assert.match(runtimeSmoke,/365 Mode kickoff is not rendered in Nashville time/);
});

test('shared team-time module is available to the offline PWA shell',()=>{
  const sw=read('sw.js');
  assert.match(sw,/\/team-time-v21\.js/);
});
