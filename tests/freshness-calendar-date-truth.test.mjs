import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../freshness-truth-v20.js',import.meta.url),'utf8');

test('verified fallback calendar dates cannot roll back a day in Nashville',()=>{
  const auditDate='2026-08-31';
  const parsed=new Date(auditDate);
  const chicago=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',timeZone:'America/Chicago'}).format(parsed);
  const calendar=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',timeZone:'UTC'}).format(parsed);
  assert.equal(chicago,'Aug 30');
  assert.equal(calendar,'Aug 31');

  assert.match(js,/function isCalendarDate\(value\)/);
  assert.match(js,/\^\\d\{4\}-\\d\{2\}-\\d\{2\}\$/);
  assert.match(js,/timeZone:isCalendarDate\(value\)\?'UTC':'America\/Chicago'/);
  assert.match(js,/return validDate\(value\)\?value:null/);
});

test('timestamp freshness still uses Nashville time while date-only audit facts stay calendar-stable',()=>{
  assert.match(js,/function shortDate\(value\)/);
  assert.match(js,/function fallbackAuditDate\(data\)/);
  assert.match(js,/data\?\.fallback\?\.auditedAt/);
  assert.match(js,/Verified backup · \$\{verified\}/);
  assert.match(js,/Roster verified \$\{verified\}/);
  assert.match(js,/rel\(fresh\.transactions\)/);
  assert.match(js,/rel\(fresh\.feed\)/);
});
