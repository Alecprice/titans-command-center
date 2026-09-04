import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const feature=fs.readFileSync(new URL('../gameday-week1-availability-v172.js',import.meta.url),'utf8');
const runtime=fs.readFileSync(new URL('../runtime-v19.js',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const data=fs.readFileSync(new URL('../src/data.mjs',import.meta.url),'utf8');

test('Week 1 availability context consumes the existing audited Titans feed instead of owning another provider',()=>{
  assert.match(feature,/import \{feed,games\} from '\.\/src\/data\.mjs'/);
  assert.doesNotMatch(feature,/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource/);
  assert.doesNotMatch(feature,/localStorage|sessionStorage|indexedDB/);
});

test('availability context is attached only to the exact Jets opener and hands off before formal game-week reporting',()=>{
  assert.match(feature,/Number\(game\.week\)===1/);
  assert.match(feature,/opponentAbbr\|\|''\)\.toUpperCase\(\)==='NYJ'/);
  assert.match(feature,/2026-09-13T17:00:00Z/);
  assert.match(feature,/REPORTING_WINDOW_START=Date\.parse\('2026-09-09T00:00:00-05:00'\)/);
  assert.match(feature,/now<REPORTING_WINDOW_START/);
  assert.match(feature,/MAX_LEAD_MS=21\*24\*60\*60\*1000/);
});

test('practice and coach evidence remain explicitly separate from formal game-status designations',()=>{
  assert.match(feature,/practice-observation/);
  assert.match(feature,/coach-confirmed/);
  assert.match(feature,/PRACTICE CONTEXT · NOT GAME STATUS/);
  assert.match(feature,/not formal Week 1 game-status designations/);
  assert.match(feature,/does not infer Questionable, Doubtful, or Out/);
  assert.match(data,/evidence:'practice-observation'/);
  assert.match(data,/evidence:'coach-confirmed'/);
  assert.match(data,/Carnell Tate and David Martin-Robinson/);
  assert.match(data,/Keldric Faulk returned/);
  assert.match(data,/Fernando Carmona named Week 1 starting right guard/);
});

test('all source actions are constrained to official Titans or NFL operations hosts',()=>{
  assert.match(feature,/www\.tennesseetitans\.com/);
  assert.match(feature,/operations\.nfl\.com/);
  assert.match(feature,/url\.protocol==='https:'/);
  assert.match(feature,/target="_blank" rel="noopener noreferrer"/);
  assert.match(feature,/NFL reporting calendar/);
});

test('feature reuses shared route/render lifecycle with bounded frame settlement and no observer or timer owner',()=>{
  assert.match(feature,/runtime\.onRoute\(schedule,\{immediate:true\}\)/);
  assert.match(feature,/runtime\.onAppRender\(schedule,\{immediate:true\}\)/);
  assert.match(feature,/MAX_SETTLE_FRAMES=10/);
  assert.match(feature,/requestAnimationFrame\(settle\)/);
  assert.doesNotMatch(feature,/MutationObserver|setInterval|setTimeout/);
});

test('Game Day availability context inherits mobile touch, focus, reduced-motion, and forced-colors safeguards',()=>{
  assert.match(feature,/min-height:44px/);
  assert.match(feature,/@media\(max-width:759px\)/);
  assert.match(feature,/min-height:48px/);
  assert.match(feature,/focus-visible/);
  assert.match(feature,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(feature,/@media\(forced-colors:active\)/);
});

test('shared runtime loads the feature and the current network-first PWA shell packages it without rolling back newer shell assets',()=>{
  assert.match(runtime,/import\('\.\/gameday-week1-availability-v172\.js'\)/);
  assert.match(sw,/titans-cc-brand-2026-v(?:8[6-9]|9\d|[1-9]\d{2,})/);
  assert.match(sw,/'\/account-interaction-v117\.js'/);
  assert.match(sw,/'\/gameday-week1-availability-v172\.js'/);
  assert.match(sw,/NETWORK_FIRST/);
});
