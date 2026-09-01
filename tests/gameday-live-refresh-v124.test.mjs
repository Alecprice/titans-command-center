import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Game Day 3.1 refreshes live state every 30 seconds without hammering hidden tabs',()=>{
  const js=read('gameday-v16.js');
  assert.match(js,/const LIVE_REFRESH_MS=30000/);
  assert.match(js,/setInterval\(\(\)=>\{if\(route\(\)==='live'&&!document\.hidden\)void refresh\(\)\},LIVE_REFRESH_MS\)/);
  assert.match(js,/document\.addEventListener\('visibilitychange'/);
  assert.match(js,/if\(route\(\)!=='live'\|\|document\.hidden\|\|!state\.data\)return/);
});

test('Game Day refresh preserves the last known good snapshot when either live source fails',()=>{
  const js=read('gameday-v16.js');
  assert.match(js,/Promise\.all\(\[json\('\/api\/fan-intel'\),json\('\/api\/espn-scoreboard'\)\]\)/);
  assert.match(js,/if\(fanOk\)state\.fan=fan/);
  assert.match(js,/if\(espnOk\)state\.espn=espn/);
  assert.match(js,/Fan intel retrying · showing last good snapshot/);
  assert.match(js,/Live scoreboard delayed/);
});

test('Game Day exposes source freshness and a mobile-safe manual refresh control',()=>{
  const js=read('gameday-v16.js');
  const css=read('gameday-v16.css');
  assert.match(js,/state\.espn\?\.fetchedAt/);
  assert.match(js,/state\.espn\.provider\|\|'ESPN'/);
  assert.match(js,/30s auto-refresh while open/);
  assert.match(js,/data-gameday-refresh>Refresh now<\/button>/);
  assert.match(css,/\.v16-gd-feed button\{min-height:44px/);
  assert.match(css,/@media\(max-width:759px\)[\s\S]*\.v16-gd-feed button\{min-height:48px;width:100%/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
