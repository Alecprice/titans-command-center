import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../player-intelligence-v16.js',import.meta.url),'utf8');

test('TENX favorite setter keeps the existing storage write as the only persistence authority',()=>{
  assert.match(source,/const setJson=\(key,value\)=>\{try\{localStorage\.setItem\(key,JSON\.stringify\(value\)\);return true\}catch\{return false\}\}/);
  assert.match(source,/const saved=setJson\(PROFILE_KEY,next\)/);
  assert.equal((source.match(/PROFILE_KEY='titans:v15MyTitans'/g)||[]).length,1);
});

test('TENX favorite UI changes state only after persistence succeeds',()=>{
  const write=source.indexOf('const saved=setJson(PROFILE_KEY,next)');
  const failure=source.indexOf('if(!saved){',write);
  const failureReturn=source.indexOf('return}',failure);
  const pressed=source.indexOf("favoriteButton.setAttribute('aria-pressed',String(!isFavorite))",write);
  assert.ok(write>=0,'favorite write result must be captured');
  assert.ok(failure>write,'write failure must be checked');
  assert.ok(failureReturn>failure,'failed persistence must exit before claiming new state');
  assert.ok(pressed>failureReturn,'aria-pressed may change only after a successful write');
});

test('TENX failed favorite persistence stays visibly and accessibly truthful',()=>{
  assert.match(source,/aria-live=\\"polite\\"/);
  assert.match(source,/★ Favorite still saved · retry/);
  assert.match(source,/☆ Favorite not saved · retry/);
  assert.match(source,/Could not remove favorite\. Favorite is still saved\. Retry\./);
  assert.match(source,/Favorite was not saved on this device\. Retry\./);
});

test('TENX successful favorite persistence restores the canonical control copy',()=>{
  assert.match(source,/favoriteButton\.removeAttribute\('aria-label'\)/);
  assert.match(source,/favoriteButton\.textContent=isFavorite\?'☆ Make favorite':'★ Favorite'/);
  assert.match(source,/favoriteButton\.setAttribute\('aria-pressed',String\(!isFavorite\)\)/);
});

test('TENX favorite truth repair does not add another preference, provider, or route owner',()=>{
  assert.equal((source.match(/localStorage\.setItem/g)||[]).length,1,'favorite persistence must keep one local write helper');
  assert.equal((source.match(/\/api\/player/g)||[]).length,1,'player profile endpoint ownership must remain unchanged');
  assert.equal((source.match(/\/api\/fan-intel/g)||[]).length,1,'fan-intel endpoint ownership must remain unchanged');
  assert.equal((source.match(/\/api\/data/g)||[]).length,1,'site-data endpoint ownership must remain unchanged');
  assert.equal((source.match(/\/api\/preseason-stats/g)||[]).length,1,'preseason endpoint ownership must remain unchanged');
});

test('TENX failed save remains retryable without inventing a successful preference state',()=>{
  assert.match(source,/const isFavorite=favoriteButton\.getAttribute\('aria-pressed'\)==='true'/);
  assert.match(source,/if\(!saved\)\{favoriteButton\.textContent=isFavorite\?/);
  assert.doesNotMatch(source,/if\(!saved\)[^}]*setAttribute\('aria-pressed'/s);
});
