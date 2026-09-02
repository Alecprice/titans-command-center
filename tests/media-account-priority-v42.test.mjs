import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const js=read('media-custom-links-v14.js');
const css=read('media-custom-links-v14.css');

test('saved media bookmarks no longer inspect account identity for presentation order',()=>{
  assert.doesNotMatch(js,/window\.TitansAccount\?\.user\?\.email/);
  assert.doesNotMatch(js,/crypto\.subtle\.digest\('SHA-256'/);
  assert.doesNotMatch(js,/PRIORITY_ACCOUNT_HASH/);
  assert.doesNotMatch(js,/priorityAccount/);
  assert.doesNotMatch(js,/titans:account/);
});

test('saved bookmarks remain below the authorized Watch content for every user',()=>{
  assert.match(js,/watch\.append\(section\)/);
  assert.doesNotMatch(js,/page\?\.querySelector\('\.media-hero'\)/);
  assert.doesNotMatch(js,/hero\.insertAdjacentElement\('afterend',section\)/);
  assert.doesNotMatch(js,/media-custom-links-priority/);
  assert.doesNotMatch(css,/media-custom-links-priority/);
});

test('permanent saved-link storage mirrors the existing account-sync alias and adopts remote changes',()=>{
  assert.match(js,/STORAGE_KEY='titans:customMediaLinks'/);
  assert.match(js,/SYNC_STORAGE_KEY='titans:v14CustomMediaLinks'/);
  assert.match(js,/localStorage\.setItem\(SYNC_STORAGE_KEY,payload\)/);
  assert.match(js,/function adoptSyncedLinks\(\)/);
  assert.match(js,/titans:preferences-synced/);
  assert.match(js,/titans:preferences-imported/);
  assert.match(js,/titans:preferences-reset/);
});

test('bookmark safety is HTTPS-only and remains presentation plus preference storage only',()=>{
  assert.match(js,/u\.protocol==='https:'\?u\.href:null/);
  assert.match(js,/rel="noopener noreferrer"/);
  assert.match(js,/MAX_LINKS=12/);
  assert.doesNotMatch(js,/fetch\(/);
  assert.doesNotMatch(js,/document\.cookie/);
});
