import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../gameday-today-v22.js',import.meta.url),'utf8');

test('Game Day live mode adds a bounded drive and play sequence without another provider',()=>{
  assert.match(js,/function gameFlowMarkup\(game,fan\)/);
  assert.match(js,/fan\?\.gameDay\?\.drives/);
  assert.match(js,/fan\?\.gameDay\?\.plays/);
  assert.match(js,/slice\(-6\)/);
  assert.match(js,/slice\(-8\)\.reverse\(\)/);
  assert.match(js,/runtime\.apiJson\('\/api\/fan-intel',\{ttl:15000\}\)/);
  assert.doesNotMatch(js,/site\.api\.espn\.com|nfl\.com\/scores/);
});

test('Game Flow mounts only for confirmed live Game Day and never promotes schedule time to live',()=>{
  assert.match(js,/app\.querySelector\('\.v16-gameday\[data-phase="live"\]'\)/);
  assert.match(js,/if\(root\.dataset\.phase==='live'\)/);
  assert.match(js,/focus\.state!=='game-window'/);
  assert.match(js,/will not infer a live score, clock, drive, or result/);
  assert.doesNotMatch(js,/dataset\.phase\s*=\s*['"]live['"]/);
});

test('Game Flow renders recent drives and plays truthfully with explicit empty states',()=>{
  assert.match(js,/How the game got here/);
  assert.match(js,/CURRENT \/ LATEST DRIVE/);
  assert.match(js,/Drive sequence is not loaded yet\. Gameday will not manufacture drive results\./);
  assert.match(js,/Play-by-play sequence is awaiting structured data\. No play description is guessed\./);
  assert.match(js,/Math\.abs\(wpa\|\|0\)>=\.08\|\|play\.explosive/);
  assert.match(js,/WPA \$\{wpa>=0\?'\+':''\}/);
  assert.match(js,/EPA \$\{epa>=0\?'\+':''\}/);
});

test('Game Flow stays phone-safe and reduced-motion friendly',()=>{
  assert.match(js,/\.v22-flow-drives\{[^}]*overflow-x:auto/);
  assert.match(js,/@media\(max-width:759px\)[\s\S]*\.v22-flow-drives\{grid-auto-columns:minmax\(78vw,1fr\)/);
  assert.match(js,/\.v22-flow-play\{display:grid;grid-template-columns:76px minmax\(0,1fr\) auto/);
  assert.match(js,/@media\(prefers-reduced-motion:reduce\)[\s\S]*\.v22-gameflow \*/);
});
