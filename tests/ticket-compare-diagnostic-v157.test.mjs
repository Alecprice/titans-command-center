import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const script=fs.readFileSync(new URL('../scripts/ticket-compare-diagnostic-v157.py',import.meta.url),'utf8');
const workflow=fs.readFileSync(new URL('../.github/workflows/ticket-compare-diagnostic-production-v157.yml',import.meta.url),'utf8');
const releaseSmoke=fs.readFileSync(new URL('../scripts/tickets-browser-smoke.py',import.meta.url),'utf8');

test('v157 diagnostic captures the owners needed to explain Saved Compare failure',()=>{
  for(const token of [
    '__TitansTicketTenxV123',
    '__TitansTicketCompareV125',
    '__TitansTicketDecisionSettleV149',
    '__TitansTicketDecisionRehydrateV155',
    'ticketCompareAuthorityV156',
    'ticketCompareSavedV156',
    'shortlistRaw',
    'runtimeSaved',
    'compareCardCount',
    "get_log('browser')"
  ]) assert.ok(script.includes(token),`missing diagnostic token ${token}`);
});

test('diagnostic reproduces two real saves and keeps the eight-second compare deadline',()=>{
  assert.match(script,/\.slice\(0,2\)/);
  assert.match(script,/button\.click\(\)/);
  assert.match(script,/WebDriverWait\(driver,8,poll_frequency=\.1\)\.until\(lambda d:d\.execute_script\("return document\.querySelectorAll\('\[data-ticket-compare-v125\] \.tickets-compare-v125-card'\)\.length>=2"\)\)/);
  assert.doesNotMatch(script,/setTimeout/);
  assert.doesNotMatch(script,/setInterval/);
});

test('diagnostic is exact-revision aware and does not misdiagnose a superseded deploy',()=>{
  assert.match(script,/EXPECTED_SHA=os\.environ\.get\('EXPECTED_SHA',''\)\.strip\(\)/);
  assert.match(script,/production moved: expected/);
  assert.match(workflow,/EXPECTED_SHA: \$\{\{ steps\.deployed\.outputs\.source_sha \}\}/);
  assert.match(workflow,/select\(\.name == "Deploy to Cloudflare"\)/);
});

test('diagnostic workflow is read-only, bounded, and checks out the deployed source',()=>{
  assert.match(workflow,/contents: read/);
  assert.match(workflow,/actions: read/);
  assert.match(workflow,/timeout-minutes: 10/);
  assert.match(workflow,/ref: \$\{\{ steps\.deployed\.outputs\.source_sha \}\}/);
  assert.match(workflow,/persist-credentials: false/);
  assert.match(workflow,/actions\/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1/);
});

test('main Ticket production contract remains unchanged at eight seconds',()=>{
  const start=releaseSmoke.indexOf('def exercise_saved_compare');
  const compareWait=releaseSmoke.indexOf("document.querySelectorAll('[data-ticket-compare-v125] .tickets-compare-v125-card').length",start);
  const wait=releaseSmoke.lastIndexOf('WebDriverWait(driver,8,poll_frequency=.1)',compareWait);
  assert.ok(start>=0&&compareWait>start&&wait>start&&wait<compareWait);
});
