import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../ask-titans-v17.js',import.meta.url),'utf8');

test('Ask Titans reuses shared runtime cache for base structured data',()=>{
  assert.match(js,/const runtime=window\.TitansRuntime/);
  assert.match(js,/runtime\.apiJson\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(js,/runtime\.apiJson\('\/api\/fan-intel',\{ttl:30000\}\)/);
  assert.match(js,/fetch\('\/api\/data',\{cache:'no-store'\}\)/);
  assert.match(js,/fetch\('\/api\/fan-intel',\{cache:'no-store'\}\)/);
});

test('scoreboard loading is separate, short cached, and retryable',()=>{
  assert.match(js,/scoreLoading:null/);
  assert.match(js,/async function loadScoreboard\(\)/);
  assert.match(js,/if\(state\.scoreLoading\)return state\.scoreLoading/);
  assert.match(js,/runtime\.apiJson\('\/api\/espn-scoreboard',\{ttl:5000\}\)/);
  assert.match(js,/fetch\('\/api\/espn-scoreboard',\{cache:'no-store'\}\)/);
  assert.match(js,/state\.score=score\?\.ok\?score:null/);
  assert.match(js,/finally\(\(\)=>state\.scoreLoading=null\)/);
  assert.doesNotMatch(js,/if\(state\.score\)return/);
});

test('Ask only requests scoreboard for live-score intents',()=>{
  assert.match(js,/function needsScoreboard\(query\)/);
  assert.match(js,/watch\|listen\|radio\|stream\|broadcast\|channel\|network\|what time/);
  assert.match(js,/live\|score\|clock\|quarter\|game status/);
  assert.match(js,/await load\(\);\s*if\(needsScoreboard\(query\)\)await loadScoreboard\(\)/);
  const baseLoad=js.slice(js.indexOf('async function load(){'),js.indexOf('async function loadScoreboard(){'));
  assert.doesNotMatch(baseLoad,/espn-scoreboard/);
});

test('score recovery does not add observer or interval ownership',()=>{
  assert.equal((js.match(/new MutationObserver/g)||[]).length,2);
  assert.doesNotMatch(js,/setInterval\(/);
});
