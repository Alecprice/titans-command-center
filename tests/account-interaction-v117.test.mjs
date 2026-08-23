import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('account interaction guard owns activation before competing click handlers',()=>{
  const source=read('account-interaction-v117.js');
  assert.match(source,/document\.addEventListener\('click',[\s\S]*,true\);/);
  assert.match(source,/event\.preventDefault\(\)/);
  assert.match(source,/event\.stopImmediatePropagation\(\)/);
  assert.match(source,/sidebar\.classList\.remove\('open'\)/);
  assert.match(source,/account\.open\(account\.guest\?'signin':'account'\)/);
});

test('account import loader includes the interaction guard',()=>{
  const source=read('account-import-v116.js');
  assert.match(source,/import '\.\/account-interaction-v117\.js\?v=1';/);
});
