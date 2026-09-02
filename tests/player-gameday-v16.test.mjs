import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('v1.6 player and Game Day assets are loaded and precached',()=>{
  const html=read('index.html'),sw=read('sw.js');
  for(const asset of ['player-intelligence-v16.css','gameday-v16.css','player-intelligence-v16.js','gameday-v16.js']){
    assert.match(html,new RegExp(asset.replaceAll('.','\\.')));
    assert.match(sw,new RegExp(asset.replaceAll('.','\\.')));
  }
  assert.match(sw,/titans-cc-brand-2026-v\d+/);
});

test('player command center is quick-answer first with five deeper sections',()=>{
  const js=read('player-intelligence-v16.js');
  assert.match(js,/PLAYER COMMAND CENTER/);
  assert.match(js,/Quick answer first/);
  for(const label of ['Overview','Game Log','Trends','Career + Contract','Timeline'])assert.match(js,new RegExp(label.replace(/[+]/g,'\\+')));
  assert.match(js,/WHAT CHANGED\?/);
  assert.match(js,/SEASON SNAPSHOT/);
  assert.match(js,/ROLE \+ AVAILABILITY/);
});

test('player intelligence uses loaded API data and refuses fake zero or film claims',()=>{
  const js=read('player-intelligence-v16.js');
  assert.match(js,/fetch\(`\/api\/player\?id=/);
  assert.match(js,/fetch\('\/api\/fan-intel'/);
  assert.match(js,/fetch\('\/api\/data'/);
  assert.match(js,/This is an ingest gap, not a zero-stat claim/);
  assert.match(js,/They do not infer film grades/);
  assert.match(js,/No salary\/cap values are inferred/);
  assert.match(js,/Cap savings\/dead-money outcomes are not estimated/);
});

test('player intelligence integrates My Titans favorite state and supports repeat toggles',()=>{
  const js=read('player-intelligence-v16.js');
  assert.match(js,/titans:v15MyTitans/);
  assert.match(js,/data-v16-favorite/);
  assert.match(js,/Make favorite/);
  assert.match(js,/favoriteButton\.getAttribute\('aria-pressed'\)==='true'/);
  assert.match(js,/favoriteButton\.setAttribute\('aria-pressed',String\(!isFavorite\)\)/);
});

test('player timeline can include verified site transactions without a browser global',()=>{
  const js=read('player-intelligence-v16.js');
  assert.match(js,/siteData\(\)/);
  assert.match(js,/arr\(site\?\.transactions\)/);
  assert.doesNotMatch(js,/__titansBootstrap/);
});

test('player trends are generated from numeric warehouse fields only',()=>{
  const js=read('player-intelligence-v16.js');
  assert.match(js,/function flattenStats/);
  assert.match(js,/Number\.isFinite\(Number\(value\)\)/);
  assert.match(js,/function spark/);
  assert.match(js,/player-game warehouse/);
});

test('Game Day 3.0 has pregame live and postgame state models',()=>{
  const js=read('gameday-v16.js');
  assert.match(js,/\['live'/);
  assert.match(js,/\['pregame'/);
  assert.match(js,/\['postgame'/);
  assert.match(js,/POSTGAME_WINDOW_MS=18\*3600000/);
  assert.match(js,/const justFinished=recentFinal\(\);if\(justFinished\)return\['postgame'/);
  assert.match(js,/PREGAME COMMAND/);
  assert.match(js,/WHAT JUST HAPPENED/);
  assert.match(js,/CURRENT DRIVE/);
  assert.match(js,/POSTGAME COMMAND/);
  assert.match(js,/TURNING POINTS/);
  assert.match(js,/WHAT CHANGED\?/);
});

test('Game Day kickoff-window bridge annotates the scoreboard-gap state without claiming live',()=>{
  const bridge=read('gameday-today-v22.js');
  assert.match(bridge,/runtime\.scheduleFocus/);
  assert.match(bridge,/focus\.state!=='game-window'/);
  assert.match(bridge,/root\.dataset\.phase==='live'/);
  assert.doesNotMatch(bridge,/root\.dataset\.phase==='postgame'/);
  assert.match(bridge,/v22-verification-note/);
  assert.match(bridge,/GAME WINDOW · VERIFICATION PENDING/);
  assert.match(bridge,/will not infer a live score, clock, drive, or result until the scoreboard provider confirms game state/);
  assert.doesNotMatch(bridge,/root\.dataset\.phase='game-window'/);
  assert.doesNotMatch(bridge,/<small>LIVE<\/small>.*VERIFICATION PENDING/s);
});

test('Game Day live state is sourced and model labels are transparent',()=>{
  const js=read('gameday-v16.js');
  assert.match(js,/const json=url=>fetch\(url,\{cache:'no-store'\}\)/);
  assert.match(js,/sharedJson\('\/api\/espn-scoreboard',\{ttl:LIVE_DATA_TTL_MS/);
  assert.match(js,/sharedJson\('\/api\/fan-intel',\{ttl:LIVE_DATA_TTL_MS/);
  assert.match(js,/sharedJson\('\/api\/data',\{ttl:BOOTSTRAP_TTL_MS\}\)/);
  assert.match(js,/EPA\/WPA are model-derived football metrics/);
  assert.match(js,/No live leader is guessed/);
  assert.match(js,/No trustworthy turning-point data is available yet/);
  assert.doesNotMatch(js,/fetch\(['"]https:\/\/site\.api\.espn\.com/);
});

test('Game Day keeps Listen Watch integrated across states',()=>{
  const js=read('gameday-v16.js');
  const bridge=read('gameday-today-v22.js');
  assert.match(js,/TUNE IN/);
  assert.match(js,/href="#media"/);
  assert.match(js,/Plan how to watch/);
  assert.match(bridge,/Open Listen \/ Watch/);
  assert.match(bridge,/href="#media"/);
  assert.doesNotMatch(bridge,/root\.innerHTML\s*=/);
});

test('v1.6 remains mobile first and reduced-motion friendly',()=>{
  for(const path of ['player-intelligence-v16.css','gameday-v16.css']){
    const css=read(path);
    assert.match(css,/@media\(max-width:759px\)/);
    assert.match(css,/@media\(max-width:390px\)/);
    assert.match(css,/min-height:48px/);
    assert.match(css,/prefers-reduced-motion:reduce/);
  }
});

test('Cloudflare cannot report full success without v1.6 browser health',()=>{
  const workflow=read('.github/workflows/cloudflare-deploy.yml');
  const runner=read('scripts/player-gameday-browser-smoke-resilient.py');
  assert.match(workflow,/id: player_gameday_browser/);
  assert.match(workflow,/python scripts\/player-gameday-browser-smoke-resilient\.py/);
  assert.match(runner,/player-gameday-browser-smoke\.py/);
  assert.match(workflow,/if: steps\.player_gameday_browser\.outcome == 'success'/);
  assert.match(workflow,/PLAYER_GAMEDAY_BROWSER_OUTCOME/);
  assert.match(workflow,/Player Intelligence \/ Game Day browser regression/);
  assert.match(workflow,/player-gameday-browser-smoke\.json/);
});
