import test from 'node:test';
import assert from 'node:assert/strict';
import {latestTransaction,sortTransactionsLatestFirst} from '../src/core.mjs';

test('transaction chronology drops malformed rows without disturbing valid ordering',()=>{
  const older={id:'older',date:'2026-09-01T12:00:00Z'};
  const newer={id:'newer',date:'2026-09-02T12:00:00Z'};
  const undated={id:'undated',date:'not-a-date'};
  const result=sortTransactionsLatestFirst([null,'bad',[],older,42,newer,undated]);
  assert.deepEqual(result,[newer,older,undated]);
});

test('latest transaction ignores malformed and undated values',()=>{
  const valid={id:'valid',date:'2026-09-02T12:00:00Z'};
  assert.equal(latestTransaction([null,[],{date:'bad'},valid]),valid);
  assert.equal(latestTransaction([null,'bad',[],{date:'bad'}]),null);
});
