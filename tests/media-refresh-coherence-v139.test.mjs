import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const media=await readFile(new URL('../media-center-v14.js',import.meta.url),'utf8');
const runtime=await readFile(new URL('../runtime-v19.js',import.meta.url),'utf8');

test('core Watch Listen follows the existing shared refresh bus',()=>{
  assert.match(media,/const runtime=window\.TitansRuntime;/);
  assert.match(media,/typeof runtime\?\.onRefresh==='function'/);
  assert.match(media,/runtime\.onRefresh\(event=>/);
  assert.match(media,/if\(Array\.isArray\(urls\)&&urls\.length&&!urls\.includes\('\/api\/data'\)\)return/);
  assert.match(media,/if\(route\(\)==='media'\|\|route\(\)==='home'\)queueMicrotask\(render\)/);
});

test('refresh clears only the media snapshot while preserving runtime network ownership',()=>{
  assert.match(media,/state\.loadEpoch\+=1/);
  assert.match(media,/state\.data=null/);
  assert.match(media,/state\.loading=null/);
  assert.match(media,/runtime\.apiJson\('\/api\/data',\{ttl:30000\}\)/);
  assert.equal((media.match(/setInterval\(/g)||[]).length,0,'core media adds no refresh poller');
  assert.equal((media.match(/new MutationObserver\(/g)||[]).length,1,'core media keeps its existing root observer only');
});

test('a pre-refresh media response cannot overwrite the refreshed snapshot',()=>{
  assert.match(media,/const runtime=window\.TitansRuntime,epoch=state\.loadEpoch/);
  assert.match(media,/if\(epoch!==state\.loadEpoch\)return state\.data/);
  assert.match(media,/if\(state\.loading===pending\)state\.loading=null/);
  assert.match(media,/state\.loading=pending/);
});

test('shared runtime invalidates API cache before publishing refresh events',()=>{
  const invalidate=runtime.indexOf("if(targets?.length)for(const url of targets)invalidateApi(url);else invalidateApi();");
  const publish=runtime.indexOf('for(const listener of [...refreshListeners])safeCall(listener,event);');
  assert.ok(invalidate>=0,'runtime cache invalidation contract exists');
  assert.ok(publish>invalidate,'refresh listeners run only after runtime cache invalidation');
});
