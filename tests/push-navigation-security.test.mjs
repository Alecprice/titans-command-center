import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');

test('push notification navigation is restricted to the app origin',()=>{
  assert.match(sw,/const notificationTarget=value=>/);
  assert.match(sw,/target\.origin===self\.location\.origin\?target\.href:fallback/);
  assert.match(sw,/new URL\('\/#home',self\.location\.origin\)\.href/);
  assert.match(sw,/data:\{url:notificationTarget\(payload\.url\)\}/);
  assert.match(sw,/const target=notificationTarget\(event\.notification\.data\?\.url\)/);
});

test('notification clicks never navigate directly from untrusted payload URL data',()=>{
  assert.doesNotMatch(sw,/const target=new URL\(event\.notification\.data\?\.url/);
  assert.doesNotMatch(sw,/openWindow\(event\.notification\.data\?\.url/);
  assert.doesNotMatch(sw,/navigate\(event\.notification\.data\?\.url/);
});
