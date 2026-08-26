import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const runtime=fs.readFileSync(new URL('../blank-state-runtime.js',import.meta.url),'utf8');
const accessibility=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');

test('semantic blank-state guard is loaded by the app shell runtime',()=>{
  assert.match(accessibility,/import ['"]\.\/blank-state-runtime\.js['"]/);
});

test('schedule blanks are explicit without inventing Week 18 data',()=>{
  assert.match(runtime,/Bye week/);
  assert.match(runtime,/Venue TBD/);
  assert.match(runtime,/Venue \/ TV not announced/);
  assert.doesNotMatch(runtime,/Week 18.*(?:Jan|January|1:00|13:00)/i);
});

test('roster, source, transaction and market blanks have controlled behavior',()=>{
  assert.match(runtime,/Unit not classified/);
  assert.match(runtime,/Purpose not documented/);
  assert.match(runtime,/Method not documented/);
  assert.match(runtime,/missing-description/);
  assert.match(runtime,/descriptor\.remove\(\)/);
});

test('team-room incomplete identities and source-policy values do not render empty',()=>{
  assert.match(runtime,/Role unavailable/);
  assert.match(runtime,/Name unavailable/);
  assert.match(runtime,/Player unavailable/);
  assert.match(runtime,/No additional source-policy note is documented/);
});
