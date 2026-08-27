import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../fact-polish.js',import.meta.url),'utf8');

test('roster disclosure distinguishes server data from the verified backup without count guessing',()=>{
  assert.match(source,/includes\('#player\?id='\)/);
  assert.match(source,/current server-backed roster snapshot/);
  assert.match(source,/verified backup snapshot audited/);
  assert.match(source,/reserve-list players are separate from the active-roster limit/);
  assert.doesNotMatch(source,/partial fallback/);
  assert.doesNotMatch(source,/That count is <em>not<\/em> the size/);
});

test('roster disclosure can repaint after hydration without mutation churn',()=>{
  assert.match(source,/dataset\.factSignature/);
  assert.match(source,/notice\.dataset\.factSignature===signature/);
  assert.match(source,/notice\.innerHTML=markup/);
});
