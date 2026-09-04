import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../media-alternatives-v14.js',import.meta.url),'utf8');

test('Quick Start reacts immediately to shared media data refreshes',()=>{
  assert.match(js,/const refreshTouchesMediaData=event=>/);
  assert.match(js,/Array\.isArray\(event\?\.urls\)\?event\.urls:null/);
  assert.match(js,/return !urls\|\|urls\.includes\('\/api\/data'\)/);
  assert.match(js,/typeof runtime\?\.onRefresh==='function'/);
  assert.match(js,/runtime\.onRefresh\(event=>/);
  assert.match(js,/route\(\)==='media'&&refreshTouchesMediaData\(event\)/);
});

test('Quick Start rejects stale overlapping async renders',()=>{
  assert.match(js,/let quickStartEpoch=0/);
  assert.match(js,/const epoch=\+\+quickStartEpoch/);
  assert.match(js,/const context=await mediaContext\(\)/);
  assert.match(js,/if\(epoch!==quickStartEpoch\|\|route\(\)!=='media'\|\|!document\.body\.contains\(hero\)\)return/);
});

test('Quick Start keeps one phase timer and one existing app observer',()=>{
  assert.match(js,/const REFRESH_INTERVAL=60\*1000/);
  assert.equal((js.match(/setInterval\(/g)||[]).length,1);
  assert.equal((js.match(/new MutationObserver\(/g)||[]).length,1);
  assert.match(js,/runtime\.apiJson\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(js,/fetch\('\/api\/data',\{cache:'no-store'\}\)/);
});
