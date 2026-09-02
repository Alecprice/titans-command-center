import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../media-timecodes-v14.js',import.meta.url),'utf8');

test('media time guide reuses the shared runtime data cache',()=>{
  assert.match(js,/const runtime=window\.TitansRuntime/);
  assert.match(js,/runtime\.apiJson\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(js,/typeof runtime\?\.apiJson==='function'/);
  assert.match(js,/fetch\('\/api\/data',\{cache:'no-store'\}\)/);
});

test('shared payload handling only rejects an explicit failed API response',()=>{
  assert.match(js,/data=d\?\.ok===false\?null:d/);
});

test('countdown work is skipped while hidden and catches up when visible',()=>{
  assert.match(js,/document\.visibilityState==='hidden'/);
  assert.match(js,/document\.addEventListener\('visibilitychange'/);
  assert.match(js,/document\.visibilityState==='visible'&&route\(\)==='media'/);
  assert.match(js,/if\(g\)updateCountdown\(g\)/);
});

test('countdown timer remains display-only and does not poll the API',()=>{
  assert.match(js,/timer=setInterval\(\(\)=>updateCountdown\(g\),30000\)/);
  const timerBody=js.match(/timer=setInterval\(\(\)=>([^,]+),30000\)/)?.[1]||'';
  assert.doesNotMatch(timerBody,/apiJson|fetch/);
});

test('HTML escaping remains intact for dynamic time-guide labels',()=>{
  assert.match(js,/['"]&quot;['"]/);
  assert.match(js,/['"]&#39;['"]/);
});
