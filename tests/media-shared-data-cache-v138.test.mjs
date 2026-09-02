import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const media=await readFile(new URL('../media-center-v14.js',import.meta.url),'utf8');
const timecodes=await readFile(new URL('../media-timecodes-v14.js',import.meta.url),'utf8');
const runtime=await readFile(new URL('../runtime-v19.js',import.meta.url),'utf8');

test('core Watch Listen data loader prefers the shared Titans runtime cache',()=>{
  assert.match(media,/const runtime=window\.TitansRuntime;/);
  assert.match(media,/typeof runtime\?\.apiJson==='function'\?runtime\.apiJson\('\/api\/data',\{ttl:30000\}\):fetch/);
  assert.match(runtime,/async function apiJson\(url,\{ttl=30000,force=false\}=\{\}\)/);
  assert.match(runtime,/if\(entry\?\.inflight\)return entry\.inflight/);
});

test('core and timecode media layers share the same 30 second data contract',()=>{
  const shared=/runtime\.apiJson\('\/api\/data',\{ttl:30000\}\)/;
  assert.match(media,shared);
  assert.match(timecodes,shared);
  assert.equal((media.match(/fetch\('\/api\/data'/g)||[]).length,1,'core media keeps only one direct fetch, as a runtime-unavailable fallback');
});

test('core media remains fail soft when the shared runtime is unavailable',()=>{
  assert.match(media,/fetch\('\/api\/data',\{cache:'no-store',headers:\{Accept:'application\/json'\}\}\)/);
  assert.match(media,/\.catch\(\(\)=>null\)/);
  assert.match(media,/if\(state\.loading\)return state\.loading/);
  assert.match(media,/state\.data=d\?\.ok\?d:null/);
});

test('shared-cache consolidation preserves media HTML escaping',()=>{
  assert.match(media,/['"]&quot;['"]/);
  assert.match(media,/['"]&amp;['"]/);
  assert.match(media,/['"]&#39;['"]/);
});
