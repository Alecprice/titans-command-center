import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { summarizeRefreshResults } from '../src/ingest.mjs';

test('cron summary does not count skipped stubs as successful refreshes',()=>{const summary=summarizeRefreshResults([{ok:true,job:'official-audit'},{ok:true,skipped:true,job:'nflverse-roster'},{ok:false,job:'broken'}]);assert.deepEqual(summary,{ok:true,partial:true,succeeded:1,skipped:1,failed:1});});
test('all-skipped source checks are not reported as a successful refresh',()=>{const summary=summarizeRefreshResults([{ok:true,skipped:true},{ok:true,skipped:true}]);assert.equal(summary.ok,false);assert.equal(summary.succeeded,0);assert.equal(summary.skipped,2);assert.equal(summary.failed,0);});
test('clean successful source checks are not partial',()=>{assert.deepEqual(summarizeRefreshResults([{ok:true},{ok:true}]),{ok:true,partial:false,succeeded:2,skipped:0,failed:0});});
test('gateway describes scheduled work as a source check and includes official audit',()=>{const api=fs.readFileSync(new URL('../api/index.js',import.meta.url),'utf8');assert.match(api,/daily-source-check/);assert.match(api,/official-audit/);assert.doesNotMatch(api,/daily-deep-refresh/);});
