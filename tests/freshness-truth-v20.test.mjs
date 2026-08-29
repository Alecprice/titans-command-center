import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('freshness truth layer is isolated non-blocking and narrowly observed',()=>{
  const runtime=read('usability-runtime.js');
  const js=read('freshness-truth-v20.js');
  assert.match(runtime,/import\('\.\/freshness-truth-v20\.js'\)\.catch\(\(\)=>\{\}\)/);
  assert.match(js,/const STALE_AFTER_MS=48\*60\*60\*1000/);
  assert.match(js,/fetch\('\/api\/data',\{cache:'no-store'/);
  assert.match(js,/observe\(app,\{childList:true\}\)/);
  assert.doesNotMatch(js,/observe\(app,\{childList:true,subtree:true\}\)/);
  assert.doesNotMatch(js,/DATABASE_URL|PROPLINE_API_KEY|ODDS_API_IO_KEY/);
});

test('home freshness reflects capture age instead of API reachability',()=>{
  const js=read('freshness-truth-v20.js');
  assert.match(js,/DATA FRESHNESS/);
  assert.match(js,/Roster snapshot needs review/);
  assert.match(js,/Recent server snapshot/);
  assert.match(js,/Freshness unknown/);
  assert.match(js,/Checking snapshot age…/);
  assert.match(js,/Snapshot age unavailable/);
  assert.match(js,/data\?\.roster\|\|\[\]/);
  assert.match(js,/player=>player\.capturedAt/);
  assert.match(js,/Date\.now\(\)-rosterDate\.getTime\(\)>STALE_AFTER_MS\?'stale':'recent'/);
  assert.doesNotMatch(js,/Live source check/);
});

test('audited fallback freshness uses its verified audit date instead of epoch coercion',()=>{
  const js=read('freshness-truth-v20.js');
  assert.match(js,/if\(value==null\|\|value===' '\.trim\(\)\)return null|if\(value==null\|\|value==='\'\)return null/);
  assert.match(js,/data\?\.mode==='audited-fallback'/);
  assert.match(js,/data\?\.fallback\?\.active===true/);
  assert.match(js,/data\?\.fallback\?\.auditedAt/);
  assert.match(js,/data\?\.dataQuality\?\.rosterSnapshotAt/);
  assert.match(js,/Verified backup · \$\{verified\}/);
  assert.match(js,/Roster verified \$\{verified\}/);
  assert.match(js,/verified roster backup audited \$\{verified\}/);
  assert.match(js,/const state=fallback\?'fallback':rosterState/);
  assert.doesNotMatch(js,/Neon|database degraded/i);
});

test('freshness detail prioritizes roster moves and intel timestamps',()=>{
  const js=read('freshness-truth-v20.js');
  assert.match(js,/transactions:latestDate/);
  assert.match(js,/feed:latestDate/);
  assert.match(js,/Roster \$\{rel\(fresh\.roster\)\} · Moves \$\{rel\(fresh\.transactions\)\} · Intel \$\{rel\(fresh\.feed\)\}/);
  assert.match(js,/more than 48 hours old/);
  assert.match(js,/captured within the last 48 hours/);
});

test('offline saved snapshot language is preserved',()=>{
  const js=read('freshness-truth-v20.js');
  assert.match(js,/strong\?\.textContent\?\.trim\(\)==='Saved snapshot'/);
  assert.match(js,/if\(strong\?\.textContent\?\.trim\(\)==='Saved snapshot'\)return/);
  assert.match(js,/addEventListener\('online'/);
});
