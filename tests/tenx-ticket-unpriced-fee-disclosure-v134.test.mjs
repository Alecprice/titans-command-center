import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source=readFileSync(new URL('../tickets-compare-v125.js',import.meta.url),'utf8');

test('TENX saved ticket cards keep fee disclosure truthful when current price is unavailable',()=>{
  assert.match(source,/total!=null\?`\$\{esc\(money\(total\)\)\} <small>before fees<\/small>`:'— <small>before fees when a current price is available<\/small>'/);
  assert.match(source,/Current starting price unavailable/);
  assert.doesNotMatch(source,/\$0[^\n]*before fees/);
});

test('TENX saved ticket compare retains the global no-inference fee boundary',()=>{
  assert.match(source,/Party totals are starting price × ticket count, before fees\./);
  assert.match(source,/Seat quality and checkout fees are not inferred\./);
});
