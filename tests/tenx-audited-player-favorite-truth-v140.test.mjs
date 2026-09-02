import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const fallback=fs.readFileSync(new URL('../player-polish.js',import.meta.url),'utf8');
const uuid=fs.readFileSync(new URL('../player-intelligence-v16.js',import.meta.url),'utf8');
const account=fs.readFileSync(new URL('../account-sync-v112.js',import.meta.url),'utf8');

test('TENX audited Favorite keeps the existing My Titans profile as its only persistence authority',()=>{
  assert.match(fallback,/const PLAYER_PROFILE_KEY='titans:v15MyTitans'/);
  assert.match(fallback,/const savePlayerProfile=value=>\{try\{localStorage\.setItem\(PLAYER_PROFILE_KEY,JSON\.stringify\(value\)\);return true\}catch\{return false\}\}/);
  assert.equal((fallback.match(/localStorage\.setItem/g)||[]).length,1);
});

test('TENX audited Favorite checks persistence before changing pressed state',()=>{
  const write=fallback.indexOf('const saved=savePlayerProfile(next)');
  const failure=fallback.indexOf('if(!saved){',write);
  const failureReturn=fallback.indexOf('return;',failure);
  const pressed=fallback.indexOf("button.setAttribute('aria-pressed',String(!on))",write);
  assert.ok(write>=0,'audited Favorite must capture the save result');
  assert.ok(failure>write,'audited Favorite must test the save result');
  assert.ok(failureReturn>failure,'failed persistence must exit');
  assert.ok(pressed>failureReturn,'pressed state may change only after a successful save');
});

test('TENX failed audited Favorite persistence stays visibly retryable without inventing state',()=>{
  assert.match(fallback,/★ Favorite still saved · retry/);
  assert.match(fallback,/☆ Favorite not saved · retry/);
  assert.match(fallback,/Could not remove favorite\. Favorite is still saved\. Retry\./);
  assert.match(fallback,/Favorite was not saved on this device\. Retry\./);
  assert.doesNotMatch(fallback,/if\(!saved\)[^}]*setAttribute\('aria-pressed'/s);
});

test('TENX audited Favorite restores canonical copy only after a successful save',()=>{
  const failureReturn=fallback.indexOf('return;',fallback.indexOf('if(!saved){'));
  const clearLabel=fallback.indexOf("button.removeAttribute('aria-label')",failureReturn);
  const pressed=fallback.indexOf("button.setAttribute('aria-pressed',String(!on))",failureReturn);
  const canonical=fallback.indexOf("button.textContent=on?'☆ Make favorite':'★ Favorite'",failureReturn);
  assert.ok(clearLabel>failureReturn);
  assert.ok(pressed>clearLabel);
  assert.ok(canonical>pressed);
});

test('TENX audited and UUID Favorite controls share the same failure truth language',()=>{
  for(const copy of ['★ Favorite still saved · retry','☆ Favorite not saved · retry','Could not remove favorite. Favorite is still saved. Retry.','Favorite was not saved on this device. Retry.']){
    assert.ok(fallback.includes(copy),`fallback missing ${copy}`);
    assert.ok(uuid.includes(copy),`UUID path missing ${copy}`);
  }
  assert.match(fallback,/data-v16-favorite aria-pressed="\$\{favorite\}" aria-live="polite"/);
});

test('TENX audited Favorite preserves the established account-sync hook and audited route ownership',()=>{
  assert.match(fallback,/data-v16-favorite/);
  assert.match(account,/data-v16-favorite/);
  assert.match(fallback,/playerName=\(\)=>playerParams\(\)\.get\('name'\)\|\|''/);
  assert.match(fallback,/location\.replace\(`#player\?id=\$\{encodeURIComponent\(matched\.id\)\}`\)/);
});

test('TENX audited Favorite truth repair adds no provider timer poller or new lifecycle owner',()=>{
  assert.equal((fallback.match(/\/api\/data/g)||[]).length,1);
  assert.equal((fallback.match(/\/api\/preseason-stats/g)||[]).length,1);
  assert.equal((fallback.match(/\/api\/player/g)||[]).length,1);
  assert.equal((fallback.match(/new MutationObserver/g)||[]).length,1);
  assert.equal((fallback.match(/setInterval|setTimeout/g)||[]).length,0);
  assert.equal((fallback.match(/PLAYER_PROFILE_KEY='titans:v15MyTitans'/g)||[]).length,1);
});
