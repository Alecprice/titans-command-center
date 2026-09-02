import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../media-custom-links-v14.js',import.meta.url),'utf8');
const css=await readFile(new URL('../media-custom-links-v14.css',import.meta.url),'utf8');

test('personal media bookmarks accept secure https URLs only',()=>{
  assert.match(js,/return u\.protocol==='https:'\?u\.href:null/);
  assert.match(js,/secure https:\/\/ website/);
  assert.doesNotMatch(js,/\['https:','http:'\]/);
});

test('unverified bookmarks never receive account-specific priority placement',()=>{
  assert.doesNotMatch(js,/PRIORITY_ACCOUNT_HASH/);
  assert.doesNotMatch(js,/crypto\.subtle/);
  assert.doesNotMatch(js,/priorityAccount/);
  assert.doesNotMatch(js,/media-custom-links-priority/);
  assert.doesNotMatch(css,/media-custom-links-priority/);
  assert.match(js,/watch\.append\(section\)/);
  assert.doesNotMatch(js,/hero\.insertAdjacentElement\('afterend',section\)/);
});

test('bookmark copy keeps authorized Watch Listen routes primary',()=>{
  assert.match(js,/PERSONAL BOOKMARKS/);
  assert.match(js,/Your saved media sites/);
  assert.match(js,/never replace the authorized Watch \/ Listen routes above/);
  assert.match(js,/Sites are not verified or endorsed by the Command Center/);
  assert.doesNotMatch(js,/OTHER STREAMING OPTIONS/);
});

test('device and account preference sync remains available without reading account identity',()=>{
  assert.match(js,/titans:customMediaLinks/);
  assert.match(js,/titans:v14CustomMediaLinks/);
  assert.match(js,/titans:preferences-synced/);
  assert.match(js,/titans:preferences-imported/);
  assert.match(js,/adoptSyncedLinks/);
  assert.doesNotMatch(js,/TitansAccount\?\.user\?\.email/);
});

test('changed bookmark stylesheet is cache-busted by its runtime loader',()=>{
  assert.match(js,/media-custom-links-v14\.css\?v=3/);
});
