import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const runtime=await readFile(new URL('../runtime-v19.js',import.meta.url),'utf8');

test('runtime tracks API invalidation generations separately from cached values',()=>{
  assert.match(runtime,/const apiCache=new Map\(\);\s*const apiGeneration=new Map\(\);/);
  assert.match(runtime,/const apiGenerationFor=key=>apiGeneration\.get\(key\)\|\|0/);
  assert.match(runtime,/const bumpApiGeneration=key=>\{const next=apiGenerationFor\(key\)\+1;apiGeneration\.set\(key,next\);return next\}/);
});

test('an invalidated in-flight success cannot refill the shared cache',()=>{
  const capture=runtime.indexOf('const generation=apiGenerationFor(key);');
  const staleGuard=runtime.indexOf('if(apiGenerationFor(key)!==generation){');
  const write=runtime.indexOf('apiCache.set(key,{value,expiresAt:Date.now()');
  assert.ok(capture>=0,'request captures its API generation');
  assert.ok(staleGuard>capture,'request checks whether it was invalidated');
  assert.ok(write>staleGuard,'cache write occurs only after the stale-generation guard');
  assert.match(runtime,/if\(apiGenerationFor\(key\)!==generation\)\{\s*const current=apiCache\.get\(key\);\s*return current\?\.value\|\|null;\s*\}/);
});

test('an invalidated failed request also yields to the current generation',()=>{
  assert.match(runtime,/\.catch\(error=>\{\s*const current=apiCache\.get\(key\);\s*if\(apiGenerationFor\(key\)!==generation\)return current\?\.value\|\|null;/);
  assert.match(runtime,/if\(current\?\.value\)return current\.value;\s*console\.warn\('\[titans-runtime-api\]'/);
});

test('targeted and global invalidation bump generations before deleting cache entries',()=>{
  const targetedBump=runtime.indexOf('bumpApiGeneration(key);');
  const targetedDelete=runtime.indexOf('apiCache.delete(key);');
  assert.ok(targetedBump>=0&&targetedDelete>targetedBump);
  assert.match(runtime,/const keys=new Set\(\[\.\.\.apiCache\.keys\(\),\.\.\.apiGeneration\.keys\(\)\]\);/);
  assert.match(runtime,/for\(const key of keys\)bumpApiGeneration\(key\);\s*apiCache\.clear\(\);/);
});

test('refresh delegates invalidation through the generation-safe owner',()=>{
  const invalidate=runtime.indexOf("if(targets?.length)for(const url of targets)invalidateApi(url);else invalidateApi();");
  const publish=runtime.indexOf('for(const listener of [...refreshListeners])safeCall(listener,event);');
  assert.ok(invalidate>=0);
  assert.ok(publish>invalidate);
  assert.equal((runtime.match(/fetch\(key,\{cache:'no-store'\}\)/g)||[]).length,1,'runtime keeps one API fetch implementation');
});
