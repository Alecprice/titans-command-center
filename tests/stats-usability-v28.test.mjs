import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildLeaders} from '../src/preseason-model.mjs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const api=read('src/preseason-api.mjs');
const hub=read('stats-hub.js');
const css=read('stats-hub.css');
const readability=read('readability-v28.css');

test('zero-value leader stats remain real data instead of disappearing',()=>{
  const players=[{name:'Zero Defender',number:'50',position:'LB',seasonStats:[{category:'Defense',fields:[{label:'SACK',value:'0'}]}]}];
  const leaders=buildLeaders(players);
  const sacks=leaders.find(row=>row.title==='Sacks');
  assert.ok(sacks,'Sacks leader should exist when the verified value is zero');
  assert.equal(sacks.value,0);
  assert.equal(sacks.name,'Zero Defender');
});

test('preseason API uses the current audited roster and exposes coverage',()=>{
  assert.match(api,/roster-audit-20260826\.mjs/);
  assert.match(api,/auditedRoster20260826/);
  assert.match(api,/95-player Aug\. 26 audited roster snapshot/);
  assert.doesNotMatch(api,/auditedRoster20260824/);
  assert.doesNotMatch(api,/96-player Aug\. 24 audited roster snapshot/);
  assert.match(api,/coverageFor\(/);
  assert.match(api,/completedGamesMissingPlayerStats/);
  assert.match(api,/playersWithoutStats/);
  assert.match(api,/expectedLowBoxPositions/);
  assert.match(api,/statsAvailable:Boolean\(statsGame\)/);
});

test('Stats Lab distinguishes missing fields from legitimate zeroes',()=>{
  assert.match(hub,/Not loaded/);
  assert.match(hub,/value!=null/);
  assert.match(hub,/A real zero stays visible as 0/);
  assert.match(hub,/STAT COVERAGE/);
  assert.match(hub,/box stats pending/);
  assert.match(hub,/Individual box-score production is not normally published for this position/);
});

test('Stats Lab typography removes the old 7-10px readability floor',()=>{
  assert.doesNotMatch(css,/font-size:(?:7|8|9|10)px/);
  assert.match(css,/\.ps-player-id small\{[^}]*font-size:12px/);
  assert.match(css,/\.ps-stat-line span\{[^}]*font-size:13px/);
  assert.match(css,/\.ps-no-stats\{[^}]*font-size:13px/);
  assert.match(css,/\.ps-control-fields input,.ps-control-fields select\{[^}]*min-height:44px/);
  assert.match(css,/@media\(max-width:760px\)[\s\S]*min-height:48px/);
});

test('site-wide readability overlay raises tiny metadata and mobile form text',()=>{
  assert.match(css,/@import url\('\/readability-v28\.css\?v=1'\)/);
  assert.match(readability,/font-size:max\(12px,.75rem\)/);
  assert.match(readability,/\.mh-row small/);
  assert.match(readability,/\.player-card small/);
  assert.match(readability,/font-size:16px!important/);
  assert.match(readability,/@media\(prefers-contrast:more\)/);
});
