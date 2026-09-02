import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const feature=read('continue-command-v35.js');
const account=read('account-sync-v112.js');

test('TENX Continue Command treats stored href as input and revalidates it on every read',()=>{
  assert.match(feature,/const href=safeHref\(value\.href\)/);
  assert.match(feature,/const current=routeOf\(href\)/);
  assert.match(feature,/current!=='home'&&labels\[current\]\?href:''/);
  assert.match(feature,/if\(!href\|\|!Number\.isFinite\(savedAt\)/);
  assert.doesNotMatch(feature,/saved\.label/);
  assert.doesNotMatch(feature,/saved\.section/);
});

test('TENX Continue Command preserves Player Intelligence as a legitimate resume destination',()=>{
  assert.match(feature,/player:'Player Intelligence'/);
  assert.match(feature,/player:'Return to Player Intelligence'/);
  assert.match(feature,/const href=safeHref\(location\.hash\|\|`#\$\{current\}`\)/);
  assert.match(feature,/storageSet\(\{href,savedAt:new Date\(\)\.toISOString\(\)\}\)/);
  assert.doesNotMatch(feature,/pageTitle/);
});

test('TENX Continue Command expires device-local resume history after fourteen days',()=>{
  assert.match(feature,/MAX_AGE_MS=14\*24\*60\*60\*1000/);
  assert.match(feature,/FUTURE_SKEW_MS=5\*60\*1000/);
  assert.match(feature,/const age=Date\.now\(\)-savedAt/);
  assert.match(feature,/age>MAX_AGE_MS\|\|age< -FUTURE_SKEW_MS/);
  assert.match(feature,/clear\(\);\s*return null/s);
  assert.match(feature,/saved on this device for up to 14 days/);
});

test('TENX Continue Command stays below Launchpad and the custom deck when those owners exist',()=>{
  assert.match(feature,/const deck=app\?\.querySelector\('\[data-v10-home\]'\)/);
  assert.match(feature,/if\(deck\)return \{anchor:deck,state:'after-deck'\}/);
  assert.match(feature,/const launchpad=app\?\.querySelector\('\.home-command-v123'\)/);
  assert.match(feature,/if\(launchpad\)return \{anchor:launchpad,state:'after-launchpad'\}/);
  assert.match(feature,/return hero\?\{anchor:hero,state:'after-hero'\}:null/);
  assert.match(feature,/card\.dataset\.placement=place\.state/);
});

test('TENX Continue Command visible copy is canonical rather than persisted DOM text',()=>{
  assert.match(feature,/const label=labels\[current\]/);
  assert.match(feature,/const detail=details\[current\]\|\|'Pick up where you left off'/);
  assert.match(feature,/esc\(label\)/);
  assert.match(feature,/esc\(detail\)/);
  assert.doesNotMatch(feature,/label:String\(/);
  assert.doesNotMatch(feature,/section:labels\[/);
});

test('TENX Continue Command reuses runtime and adds no independent observer polling or network owner',()=>{
  assert.match(feature,/const runtime=window\.TitansRuntime/);
  assert.match(feature,/runtime\.onRoute/);
  assert.match(feature,/runtime\.onAppRender/);
  assert.doesNotMatch(feature,/new MutationObserver/);
  assert.doesNotMatch(feature,/setTimeout\(/);
  assert.doesNotMatch(feature,/setInterval\(/);
  assert.doesNotMatch(feature,/fetch\(/);
  assert.doesNotMatch(feature,/apiJson/);
});

test('TENX Continue Command remains intentionally device-local and outside account preference sync',()=>{
  assert.match(feature,/STORE='titans:v35ContinueCommand'/);
  assert.doesNotMatch(account,/titans:v35ContinueCommand/);
  assert.doesNotMatch(feature,/titans:preferences-synced/);
  assert.doesNotMatch(feature,/TitansAccount/);
  assert.match(feature,/data-clear-continue/);
  assert.match(feature,/min-height:44px/);
});
