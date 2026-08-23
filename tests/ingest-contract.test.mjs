import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { summarizeRefreshResults, classifySyncResult, requireAdminAuth, requireIngestAuth } from '../src/ingest.mjs';

test('cron summary does not count skipped stubs as successful refreshes',()=>{const summary=summarizeRefreshResults([{ok:true,job:'official-audit'},{ok:true,skipped:true,job:'nflverse-roster'},{ok:false,job:'broken'}]);assert.deepEqual(summary,{ok:true,partial:true,succeeded:1,skipped:1,failed:1});});
test('all-skipped source checks are not reported as a successful refresh',()=>{const summary=summarizeRefreshResults([{ok:true,skipped:true},{ok:true,skipped:true}]);assert.equal(summary.ok,false);assert.equal(summary.succeeded,0);assert.equal(summary.skipped,2);assert.equal(summary.failed,0);});
test('sync run persistence classifies outcomes without inflating skipped work',()=>{assert.equal(classifySyncResult({ok:true}),'success');assert.equal(classifySyncResult({ok:true,skipped:true}),'skipped');assert.equal(classifySyncResult({ok:false}),'failed');});
test('gateway describes scheduled work as a source check and includes official audit',()=>{const api=fs.readFileSync(new URL('../api/index.js',import.meta.url),'utf8');assert.match(api,/daily-source-check/);assert.match(api,/official-audit/);assert.match(api,/recordSyncRun/);assert.doesNotMatch(api,/daily-deep-refresh/);});
test('scheduled odds source check bypasses public runtime cache',()=>{const ingest=fs.readFileSync(new URL('../src/ingest.mjs',import.meta.url),'utf8');assert.match(ingest,/fetchFreeOdds\(env,\{maxEvents:2,bypassCache:true\}\)/);assert.match(ingest,/Fresh provider reachability fetch verified/);});
test('admin and ingest secret checks hash to fixed length before constant-time comparison',()=>{
  const ingest=fs.readFileSync(new URL('../src/ingest.mjs',import.meta.url),'utf8');
  assert.match(ingest,/createHash\('sha256'\)/);
  assert.match(ingest,/timingSafeEqual\(secretDigest\(aText\),secretDigest\(bText\)\)/);
  assert.doesNotMatch(ingest,/\.length===.*timingSafeEqual/);
  const adminEnv={INGEST_SECRET:'correct-secret-value'};
  assert.equal(requireAdminAuth({headers:{'x-ingest-secret':'correct-secret-value'}},adminEnv).ok,true);
  assert.equal(requireAdminAuth({headers:{'x-ingest-secret':'x'}},adminEnv).ok,false);
  assert.equal(requireAdminAuth({headers:{}},adminEnv).ok,false);
  const ingestEnv={INGEST_SECRET:'ingest-secret',CRON_SECRET:'cron-secret'};
  assert.equal(requireIngestAuth({headers:{authorization:'Bearer cron-secret'}},ingestEnv).ok,true);
  assert.equal(requireIngestAuth({headers:{authorization:'Bearer nope'}},ingestEnv).ok,false);
});
