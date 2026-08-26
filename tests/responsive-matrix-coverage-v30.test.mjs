import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const smoke=fs.readFileSync(new URL('../scripts/responsive-matrix-smoke.py',import.meta.url),'utf8');

const required=[
  "('home','home')",
  "('game-day','live')",
  "('schedule','games')",
  "('roster','roster')",
  "('depth-chart','roster?view=depth')",
  "('staff','roster?view=staff')",
  "('cutdown','roster?view=cutdown')",
  "('transactions','transactions')",
  "('stats','stats')",
  "('fantasy','fantasy')",
  "('markets','markets')",
  "('intel','feed')",
  "('legacy','legacy')",
  "('sources','sources')",
  "('fan-hub','fan')",
  "('listen-watch','media')",
  "('command-intel','command')",
];

test('responsive production matrix covers every primary fan surface and Team Room subview',()=>{
  for(const route of required) assert.ok(smoke.includes(route),`missing responsive route ${route}`);
});

test('responsive matrix waits for dynamic remounts before sampling layout',()=>{
  assert.match(smoke,/def settle\(driver,timeout=4\):/);
  assert.match(smoke,/stable>=2/);
  assert.match(smoke,/current\['busy'\]!='true'/);
});

test('responsive matrix records suspicious tiny rendered text for readability triage',()=>{
  assert.match(smoke,/font<9\.5/);
  assert.match(smoke,/suspiciousTiny/);
  assert.match(smoke,/tinyTextSurfaces/);
});
