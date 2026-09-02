import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const weekly=fs.readFileSync(new URL('../fantasy-weekly-command-v42.js',import.meta.url),'utf8');

test('weekly workspace only trusts Sleeper roster context for the active saved connection',()=>{
  assert.match(weekly,/const sleeperKey=state=>/);
  assert.match(weekly,/username=String\(state\?\.sleeperUser\|\|''\)\.trim\(\)\.toLowerCase\(\)/);
  assert.match(weekly,/\^\\d\{6,32\}\$/);
  assert.match(weekly,/const context=window\.TitansFantasyRosterContext/);
  assert.match(weekly,/context\.connectionKey!==key/);
  assert.match(weekly,/context\.matched!==true/);
});

test('matched Sleeper workspace uses published starter and bench counts instead of manual counts',()=>{
  assert.match(weekly,/status:'matched',starters,bench/);
  assert.match(weekly,/title:'Sleeper roster matched'/);
  assert.match(weekly,/\$\{state\.roster\.starters\} starters · \$\{state\.roster\.bench\} bench from Sleeper/);
  assert.match(weekly,/\$\{state\.watch\} manual watchlist/);
});

test('pending and unmatched Sleeper states stay explicit instead of displaying fake roster totals',()=>{
  assert.match(weekly,/status:'pending',starters:null,bench:null/);
  assert.match(weekly,/status:'unmatched',starters:null,bench:null/);
  assert.match(weekly,/title:'Sleeper roster not matched'/);
  assert.match(weekly,/connected user is not matched to a roster in the selected league/i);
  assert.match(weekly,/Sleeper roster counts appear after the read-only roster match finishes/);
  assert.match(weekly,/Manual board:/);
});

test('weekly badge describes the selected workspace week without claiming an unverified Sleeper source',()=>{
  assert.match(weekly,/Selected week \$\{state\.week\}/);
  assert.doesNotMatch(weekly,/Sleeper week \$\{state\.week\}/);
});

test('published roster updates rerender from existing weekly caches without adding provider traffic',()=>{
  assert.match(weekly,/const rerender=\(\)=>\{document\.querySelector\('\[data-fantasy-weekly-v42\]'\)\?\.remove\(\);queueMicrotask\(mount\)\}/);
  assert.match(weekly,/addEventListener\('titans:fantasy-roster-context',rerender\)/);
  assert.match(weekly,/if\(data&&intel\)return \{data,intel\}/);
  assert.match(weekly,/const refresh=\(\)=>\{data=null;intel=null;loading=null;rerender\(\)\}/);
  assert.doesNotMatch(weekly,/api\.sleeper\.app/);
  assert.doesNotMatch(weekly,/localStorage\.setItem/);
});
