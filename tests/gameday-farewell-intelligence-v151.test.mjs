import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../gameday-farewell-v151.js',import.meta.url),'utf8');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('Farewell Season intelligence is loaded after the core Game Day enhancer',()=>{
  const core=index.indexOf('/gameday-today-v22.js?v=1');
  const farewell=index.indexOf('/gameday-farewell-v151.js?v=1');
  assert.ok(core>=0,'core Game Day enhancer must remain loaded');
  assert.ok(farewell>core,'Farewell Season enhancer should load after core Game Day');
});

test('Farewell Season copy is grounded in official Titans sources',()=>{
  assert.match(source,/NISSAN STADIUM · 2026 FAREWELL SEASON/);
  assert.match(source,/The Titans are recognizing 2026 as the Farewell Season at the current stadium\./);
  assert.match(source,/The New Nissan Stadium is scheduled to open in 2027\./);
  assert.match(source,/https:\/\/www\.tennesseetitans\.com\/new-stadium\//);
  assert.match(source,/https:\/\/www\.tennesseetitans\.com\/schedule\//);
});

test('dynamic stadium intelligence fails closed unless the 2026 regular-season schedule is complete',()=>{
  assert.match(source,/Number\(data\?\.team\?\.season\)!==SEASON/);
  assert.match(source,/regular\.length>=17&&home\.length>=8&&home\.length<=9&&home\.every\(validKickoff\)/);
  assert.match(source,/if\(!completeSchedule\)return \{completeSchedule:false\}/);
  assert.match(source,/week>=1&&week<=18/);
  assert.match(source,/game\?\.homeAway!=='bye'/);
});

test('remaining and final home context is derived from schedule data, not a duplicated opponent list',()=>{
  assert.match(source,/const remaining=ordered\.filter\(game=>teamDay\(game\.date\)>=today\)/);
  assert.match(source,/finalHome:ordered\[ordered\.length-1\]\|\|null/);
  assert.match(source,/vs\. \$\{esc\(next\.opponent\|\|'Opponent'\)\}/);
  assert.match(source,/vs\. \$\{esc\(final\.opponent\|\|'Opponent'\)\}/);
  for(const opponent of ['New York Jets','Philadelphia Eagles','Pittsburgh Steelers','Houston Texans']){
    assert.equal(source.includes(opponent),false,`frontend must not hard-code ${opponent} into Farewell intelligence`);
  }
});

test('Farewell intelligence stays truth-safe and does not compete with live game state',()=>{
  assert.match(source,/if\(root\.dataset\.phase==='live'\)/);
  assert.match(source,/root\.querySelector\('\.v151-farewell'\)\?\.remove\(\)/);
  assert.match(source,/Postseason games are not assumed\./);
  assert.match(source,/runtime\.apiJson\('\/api\/data',\{ttl:30000\}\)/);
  assert.doesNotMatch(source,/\bfetch\s*\(/);
  assert.doesNotMatch(source,/setInterval\s*\(/);
  assert.doesNotMatch(source,/geolocation/i);
});

test('dynamic opponent and date content is escaped and mobile actions preserve large tap targets',()=>{
  assert.match(source,/esc\(next\.opponent/);
  assert.match(source,/esc\(final\.opponent/);
  assert.match(source,/esc\(shortDate\(next\.date\)\)/);
  assert.match(source,/esc\(shortDate\(final\.date\)\)/);
  assert.match(source,/@media\(max-width:759px\)/);
  assert.match(source,/\.v151-farewell-actions a\{min-height:48px;width:100%\}/);
});
