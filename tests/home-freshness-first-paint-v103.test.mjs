import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const fan=read('fan-platform-v10.js');
const truth=read('freshness-truth-v20.js');

test('Fan Platform makes no live-data claim before freshness truth resolves',()=>{
  assert.match(fan,/state\.fromCache\?'Saved snapshot':'Checking snapshot age…'/);
  assert.doesNotMatch(fan,/Live source check/);
  assert.doesNotMatch(fan,/function isAuditedFallback/);
});

test('dedicated freshness layer remains authoritative for server and fallback state',()=>{
  assert.match(truth,/function isAuditedFallback\(data\)/);
  assert.match(truth,/Verified backup · \$\{verified\}/);
  assert.match(truth,/Recent server snapshot/);
  assert.match(truth,/Roster snapshot needs review/);
  assert.match(truth,/Freshness unknown/);
});

test('freshness resolution stays observer-light and reuses the existing data endpoint',()=>{
  assert.match(truth,/fetch\('\/api\/data'/);
  assert.match(truth,/new MutationObserver\(queue\)\.observe\(app,\{childList:true\}\)/);
  assert.doesNotMatch(truth,/observe\(app,\{childList:true,subtree:true\}\)/);
});
