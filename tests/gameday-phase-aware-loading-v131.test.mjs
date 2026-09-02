import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../gameday-today-v22.js',import.meta.url),'utf8');

test('Gameday addon only requests Fan Intel when stable Game Day is already confirmed live',()=>{
  assert.match(source,/const liveAtStart=root\.dataset\.phase==='live';/);
  assert.match(source,/const dataPromise=runtime\.apiJson\('\/api\/data',\{ttl:30000\}\);/);
  assert.match(source,/liveAtStart\s*\?await Promise\.all\(\[dataPromise,runtime\.apiJson\('\/api\/fan-intel',\{ttl:15000\}\)\]\)\s*:\[await dataPromise,null\]/s);
  assert.doesNotMatch(source,/Promise\.all\(\[runtime\.apiJson\('\/api\/data'.*runtime\.apiJson\('\/api\/fan-intel'/s);
});

test('pregame and kickoff verification stay on the lightweight schedule-data path',()=>{
  const mount=source.slice(source.indexOf('async function mount()'),source.indexOf('function refreshGameDay()'));
  const fanIndex=mount.indexOf("runtime.apiJson('/api/fan-intel'");
  const conditionalIndex=mount.indexOf('?await Promise.all');
  assert.ok(fanIndex>conditionalIndex);
  assert.match(mount,/if\(applyGameWindow\(data\)\)/);
  assert.match(mount,/const phase=tagPregamePhase\(\)/);
});

test('a phase transition to live remounts before Game Flow instead of using a missing fan payload',()=>{
  assert.match(source,/if\(root\.dataset\.phase==='live'\)\{\s*if\(!liveAtStart\)\{queueMicrotask\(mount\);return;\}/s);
  assert.match(source,/mountGameFlow\(data,fan\)/);
});

test('phase-aware loading adds no new polling or DOM observer ownership',()=>{
  assert.doesNotMatch(source,/new MutationObserver/);
  assert.doesNotMatch(source,/setInterval\(/);
  assert.doesNotMatch(source,/setTimeout\(/);
  assert.match(source,/runtime\.onAppRender/);
  assert.match(source,/runtime\.onRoute/);
  assert.match(source,/runtime\.onRefresh/);
});