import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const bridge=read('fantasy-roster-props-v134.js');
const trends=read('fantasy-prop-trends-v133.js');

test('Fantasy roster prop bridge loads from the existing live-prop enhancement chain',()=>{
  assert.match(trends,/import\('\.\/fantasy-roster-props-v134\.js'\)\.catch/);
});

test('Sleeper roster context is read-only, bounded, and reuses the shared one-day player cache',()=>{
  assert.match(bridge,/PLAYER_KEY='titans-fantasy-sleeper-player-index-v1'/);
  assert.match(bridge,/PLAYER_TTL=24\*60\*60\*1000/);
  assert.match(bridge,/CONTEXT_TTL=5\*60\*1000/);
  assert.match(bridge,/\/user\/\$\{encodeURIComponent\(current\.username\)\}/);
  assert.match(bridge,/\/league\/\$\{current\.leagueId\}\/rosters/);
  assert.match(bridge,/players\/nfl\?position=\$\{position\}&active=true/);
  assert.doesNotMatch(bridge,/method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)/i);
});

test('player prop personalization uses deterministic normalized-name matching rather than fuzzy guesses',()=>{
  assert.match(bridge,/const normName=/);
  assert.match(bridge,/state\.context\.byName\?\.\[normName\(name\)\]/);
  assert.match(bridge,/if\(key&&!byName\[key\]\)byName\[key\]=player/);
  assert.doesNotMatch(bridge,/levenshtein|similarity|fuzzy|closest/i);
});

test('connected roster marks starter and bench props and supports a reversible roster-only filter',()=>{
  assert.match(bridge,/MY STARTER/);
  assert.match(bridge,/MY BENCH/);
  assert.match(bridge,/My roster only/);
  assert.match(bridge,/Show all props/);
  assert.match(bridge,/aria-pressed/);
  assert.match(bridge,/row\.hidden=Boolean\(state\.rosterOnly&&canFilter&&!matched\)/);
  assert.match(bridge,/Open Sleeper Connect/);
});

test('missing or failed Sleeper context never hides or fabricates prop rows',()=>{
  assert.match(bridge,/No prop rows were guessed or hidden/);
  assert.match(bridge,/if\(!state\.context\?\.matched\)return null/);
  assert.match(bridge,/state\.rosterOnly=false/);
  assert.doesNotMatch(bridge,/recommend|best bet|edge score|lock/i);
});

test('roster prop decorator avoids recursive MutationObserver churn',()=>{
  assert.match(bridge,/observer\?\.disconnect\(\)/);
  assert.match(bridge,/finally\{resumeObserver\(\)\}/);
  assert.match(bridge,/observer=new MutationObserver\(queue\)/);
  assert.match(bridge,/dataset\.signature/);
});

test('roster controls are mobile and high-contrast safe',()=>{
  assert.match(bridge,/min-height:44px/);
  assert.match(bridge,/@media\(max-width:620px\)/);
  assert.match(bridge,/@media\(max-width:390px\)/);
  assert.match(bridge,/@media\(forced-colors:active\)/);
  assert.match(bridge,/focus-visible/);
});
