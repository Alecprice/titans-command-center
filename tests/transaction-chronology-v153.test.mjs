import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {latestTransaction,sortTransactionsLatestFirst} from '../src/core.mjs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const app=read('app.js');
const runtime=read('runtime-v19.js');
const transactionsHub=read('transactions-hub.js');
const fantasy=read('fantasy-weekly-command-v42.js');

test('transaction chronology is newest-first without trusting provider order',()=>{
  const rows=[
    {id:'older',date:'2026-08-20',description:'Older'},
    {id:'undated-a',date:null,description:'Undated A'},
    {id:'newest',date:'2026-09-01',description:'Newest'},
    {id:'invalid',date:'not-a-date',description:'Invalid'},
    {id:'middle',date:'2026-08-31',description:'Middle'},
    {id:'undated-b',description:'Undated B'}
  ];
  const sorted=sortTransactionsLatestFirst(rows);
  assert.deepEqual(sorted.map(row=>row.id),['newest','middle','older','undated-a','invalid','undated-b']);
  assert.deepEqual(rows.map(row=>row.id),['older','undated-a','newest','invalid','middle','undated-b']);
});

test('equal transaction dates keep source order stable',()=>{
  const rows=[
    {id:'first',date:'2026-08-31'},
    {id:'older',date:'2026-08-30'},
    {id:'second',date:'2026-08-31'}
  ];
  assert.deepEqual(sortTransactionsLatestFirst(rows).map(row=>row.id),['first','second','older']);
});

test('latest transaction requires a real date instead of promoting an undated row',()=>{
  const newest={id:'newest',date:'2026-09-01'};
  assert.equal(latestTransaction([{id:'undated'}, {id:'older',date:'2026-08-31'}, newest]),newest);
  assert.equal(latestTransaction([{id:'undated'}, {id:'invalid',date:'bad-date'}]),null);
  assert.equal(latestTransaction(null),null);
});

test('shared runtime publishes the canonical transaction chronology helpers',()=>{
  assert.match(runtime,/sortTransactionsLatestFirst,\s*latestTransaction/);
  assert.match(runtime,/\n\s*sortTransactionsLatestFirst,\n\s*latestTransaction,/);
});

test('base Home and Transactions normalize transaction truth through core ownership',()=>{
  assert.match(app,/scheduleFocus,sortTransactionsLatestFirst,latestTransaction/);
  assert.match(app,/move=latestTransaction\(transactions\)\?\.description\|\|'No dated roster movement is loaded\.'/);
  assert.match(app,/transactions=sortTransactionsLatestFirst\(d\.transactions\)/);
  assert.doesNotMatch(app,/move=transactions\[0\]/);
});

test('Transactions enhancement sorts rows before rendering while preserving fail-soft behavior',()=>{
  assert.match(transactionsHub,/window\.TitansRuntime\?\.sortTransactionsLatestFirst/);
  assert.match(transactionsHub,/const rows=thSortTransactions\(data\.transactions\)/);
  assert.match(transactionsHub,/if\(aDated\)return-1;if\(bDated\)return 1;return a\.index-b\.index/);
  assert.match(transactionsHub,/No transaction rows are available yet/);
});

test('Fantasy latest move uses shared chronology and only dated fallback rows',()=>{
  assert.match(fantasy,/runtime\?\.latestTransaction/);
  assert.match(fantasy,/runtime\.latestTransaction\(rows\)/);
  assert.match(fantasy,/\.filter\(row=>Number\.isFinite\(row\.time\)\)\.sort\(\(a,b\)=>b\.time-a\.time\|\|a\.index-b\.index\)\[0\]\?\.move\|\|null/);
  assert.match(fantasy,/move=latestMove\(\)/);
  assert.match(fantasy,/No dated roster move is loaded\./);
  assert.doesNotMatch(fantasy,/transactions\?\.\[0\]|transactions\[0\]/);
});

test('transaction chronology repair adds no provider persistence or lifecycle owner',()=>{
  const core=read('src/core.mjs');
  assert.doesNotMatch(core,/fetch\(|localStorage|sessionStorage|MutationObserver|setInterval|setTimeout/);
  assert.doesNotMatch(transactionsHub,/localStorage|sessionStorage|setInterval|WebSocket/);
  assert.doesNotMatch(fantasy,/localStorage\.setItem|sessionStorage|setInterval|WebSocket/);
});
