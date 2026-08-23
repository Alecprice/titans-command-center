import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../transactions-hub.js',import.meta.url),'utf8');

test('transaction calendar dates preserve the supplied date instead of browser-local rollover',()=>{
  const value='2026-08-19';
  const preserved=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(value));
  const nashville=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'America/Chicago'}).format(new Date(value));
  assert.equal(preserved,'Aug 19, 2026');
  assert.equal(nashville,'Aug 18, 2026','date-only midnight UTC rolls back in Nashville and must not be used for transaction calendar dates');
  assert.match(source,/const thDate=.*timeZone:'UTC'/);
});

test('transaction feed refresh timestamp is explicitly Nashville time',()=>{
  assert.match(source,/const thStamp=.*timeZone:'America\/Chicago'.*timeZoneName:'short'/);
  assert.match(source,/Updated \$\{thEsc\(thStamp\(data\.fetchedAt\)\)\} · Nashville time/);
});

test('transaction calendar formatter keeps invalid and missing dates safe',()=>{
  assert.match(source,/if\(!value\)return'TBD'/);
  assert.match(source,/Number\.isNaN\(date\.getTime\(\)\)\?'TBD'/);
});
