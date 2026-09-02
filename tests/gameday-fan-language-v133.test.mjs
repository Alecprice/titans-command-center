import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('stable Game Day presents source truth in fan language instead of backend jargon',()=>{
  const js=read('gameday-v16.js');
  for(const copy of [
    'Game Day 3.1 · verified updates',
    'Fan intel retrying · showing the last confirmed update',
    'Game leaders so far',
    'Available stats only',
    'Player leader stats are not available yet.',
    'Biggest available swings',
    'Final game leaders',
    'This section updates automatically when verified stats arrive.'
  ])assert.match(js,new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.doesNotMatch(js,/awaiting ingest|warehouse has them|Structured stats only|source-aware|last good snapshot|Weather snapshot is not loaded|Loaded game leaders|Final loaded leaders|Biggest loaded swings|loaded play data/);
});

test('Game Flow empty states stay truthful without exposing data-pipeline terminology',()=>{
  const js=read('gameday-today-v22.js');
  assert.match(js,/Drive sequence is not available yet\. Gameday will not manufacture drive results\./);
  assert.match(js,/Play-by-play is not available yet\. No play description is guessed\./);
  assert.match(js,/play\.description\|\|play\.type\|\|'Latest play'/);
  assert.doesNotMatch(js,/Drive sequence is not loaded yet|awaiting structured data|Loaded play/);
});

test('fan-first copy does not weaken Game Day evidence boundaries',()=>{
  const stable=read('gameday-v16.js'),bridge=read('gameday-today-v22.js');
  assert.match(stable,/EPA\/WPA are model-derived football metrics from available play-by-play, not official league win-probability labels/);
  assert.match(stable,/No live leader is guessed/);
  assert.match(stable,/No trustworthy turning-point data is available yet/);
  assert.match(stable,/state\.espn\?\.snapshot\?\.stale!==true/);
  assert.match(bridge,/will not infer a live score, clock, drive, or result until the scoreboard provider confirms game state/);
  assert.doesNotMatch(bridge,/dataset\.phase\s*=\s*['"]live['"]/);
});

test('Gameday fan surfaces do not name retired storage implementations',()=>{
  const stable=read('gameday-v16.js'),bridge=read('gameday-today-v22.js'),personal=read('gameday-personal-v37.js');
  for(const js of [stable,bridge,personal])assert.doesNotMatch(js,/\bNeon\b|\bD1\b|\bdatabase\b/i);
});
