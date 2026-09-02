import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {scheduleFocus} from '../src/core.mjs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const js=read('fantasy-weekly-command-v42.js');
const runtime=read('accessibility-runtime.js');
const sw=read('sw.js');

test('Fantasy This Week loads through the shared runtime and offline shell',()=>{
  assert.match(runtime,/import '\.\/fantasy-weekly-command-v42\.js';/);
  assert.match(sw,/'\/fantasy-weekly-command-v42\.js'/);
  assert.match(js,/data-fantasy-weekly-v42/);
  assert.match(js,/FANTASY THIS WEEK/);
});

test('Fantasy weekly context is source-backed and does not invent projections',()=>{
  assert.match(js,/runtime\.apiJson\('\/api\/data'/);
  assert.match(js,/runtime\.apiJson\('\/api\/fan-intel'/);
  assert.match(js,/intel\?\.injuries/);
  assert.match(js,/data\?\.transactions/);
  assert.match(js,/does not create projections/i);
  assert.doesNotMatch(js,/projectedPoints|projection\s*[:=]\s*\d|predictedPoints/i);
});

test('Fantasy weekly next game uses shared chronological future-only schedule truth',()=>{
  assert.match(js,/runtime\.scheduleFocus\(games,new Date\(\)\)\?\.next\|\|null/);
  assert.doesNotMatch(js,/runtime\.scheduleFocus\(games,new Date\(\)\)\?\.game/);
  const current={id:'current',date:'2026-09-02T11:00:00Z',status:'scheduled'};
  const next={id:'next',date:'2026-09-10T17:00:00Z',status:'scheduled'};
  const later={id:'later',date:'2026-09-20T17:00:00Z',status:'scheduled'};
  const focus=scheduleFocus([
    later,
    {id:'bye',date:'2026-09-06T17:00:00Z',status:'bye'},
    current,
    {id:'final',date:'2026-09-05T17:00:00Z',status:'final'},
    next
  ],new Date('2026-09-02T12:00:00Z'));
  assert.equal(focus.game,current);
  assert.equal(focus.next,next);
});

test('Fantasy weekly no-runtime fallback still sorts future schedule rows instead of trusting provider order',()=>{
  assert.match(js,/games\.map\(game=>\(\{game,at:Date\.parse\(game\?\.date\)\}\)\)/);
  assert.match(js,/row\.at>now&&!\/final\|bye\/i\.test\(String\(row\.game\?\.status\|\|''\)\)/);
  assert.match(js,/\.sort\(\(a,b\)=>a\.at-b\.at\)\[0\]\?\.game\|\|null/);
  assert.doesNotMatch(js,/\(data\?\.games\|\|\[\]\)\.find\(/);
});

test('Fantasy weekly command reuses existing Fantasy state instead of another preference silo',()=>{
  assert.match(js,/STORE='titans-fantasy-v1'/);
  assert.match(js,/data-fw42-tab="my"/);
  assert.match(js,/data-fw42-tab="sleeper"/);
  assert.match(js,/data-fw42-startsit/);
  assert.match(js,/data-fw42-calc/);
  assert.doesNotMatch(js,/localStorage\.setItem/);
});

test('Fantasy weekly command is mobile-first high contrast and touch safe',()=>{
  assert.match(js,/@media\(max-width:560px\)/);
  assert.match(js,/min-height:48px/);
  assert.match(js,/grid-template-columns:1fr/);
  assert.match(js,/button:focus-visible\{outline:3px solid #fff/);
  assert.match(js,/#cfe0ef/i);
  assert.match(js,/@media\(prefers-contrast:more\)/);
});

test('availability watch treats missing injury rows honestly',()=>{
  assert.match(js,/No matching injury rows loaded/);
  assert.match(js,/not medical clearance/i);
  assert.match(js,/\['QB','RB','FB','WR','TE','K'\]/);
});
