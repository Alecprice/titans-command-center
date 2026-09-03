import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {games} from '../src/data.mjs';

const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');

const byWeek=week=>games.find(game=>Number(game.week)===week);

test('schedule page cites the current official 2026 NFL flex procedures',()=>{
  assert.match(app,/const SCHEDULE_FLEX_URL='https:\/\/www\.nfl\.com\/international\/ways-to-watch\/flexible-scheduling-procedures'/);
  assert.match(app,/target="_blank" rel="noopener noreferrer">NFL flex rules ↗<\/a>/);
  assert.match(app,/Weeks 5–10 can be flexed to Sunday night up to twice/);
  assert.match(app,/Weeks 11–17 have broader Sunday-night flex/);
  assert.match(app,/Monday-night flex begins Week 12/);
  assert.match(app,/Thursday-night flex begins Week 13/);
  assert.match(app,/Sunday-afternoon kickoff windows can also move/);
});

test('only scheduled regular-season Weeks 5 through 17 receive the flex qualifier',()=>{
  assert.match(app,/g\?\.status==='scheduled'/);
  assert.match(app,/week>=5&&week<=17/);
  assert.match(app,/return scheduleFlexEligible\(g\)\?'Subject to NFL flex scheduling':''/);

  for(const week of [1,2,3,4])assert.equal(byWeek(week)?.status,'scheduled');
  assert.equal(byWeek(9)?.status,'bye');
  for(const week of [5,6,7,8,10,11,12,13,14,15,16,17])assert.equal(byWeek(week)?.status,'scheduled');
});

test('Week 18 remains a separate TBD scheduling state instead of being described as an ordinary flex game',()=>{
  const week18=byWeek(18);
  assert.ok(week18);
  assert.equal(week18.date,null);
  assert.equal(week18.network,'TBD');
  assert.equal(week18.dateTbd,true);
  assert.match(app,/if\(week===18\)return 'Date, kickoff and TV set after Week 17'/);
  assert.match(app,/Week 18 date, kickoff and network are assigned after Week 17/);
});

test('schedule rows surface timing truth beside the currently loaded kickoff without changing matchup data',()=>{
  assert.match(app,/function scheduleRow\(g\)\{const timing=scheduleTimingNote\(g\)/);
  assert.match(app,/\$\{gameTime\(g\.date\)\}\$\{timing\?` · \$\{esc\(timing\)\}`:''\}/);
  assert.match(app,/games\.map\(scheduleRow\)\.join\(''\)/);
  assert.doesNotMatch(app,/flexed to primetime|will be flexed|expected to flex/i);
});

test('schedule truth adds no new network, persistence, polling, or observer owner',()=>{
  const start=app.indexOf("const SCHEDULE_FLEX_URL=");
  const end=app.indexOf("const safeUrl=",start);
  assert.ok(start>=0&&end>start);
  const policyBlock=app.slice(start,end);
  assert.doesNotMatch(policyBlock,/fetch\(|XMLHttpRequest|WebSocket|EventSource|localStorage|sessionStorage|setInterval|setTimeout|MutationObserver/);
});
