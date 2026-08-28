import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const js=read('media-custom-links-v14.js');
const css=read('media-custom-links-v14.css');

test('saved media priority uses authenticated account identity without publishing an email address',()=>{
  assert.match(js,/window\.TitansAccount\?\.user\?\.email/);
  assert.match(js,/crypto\.subtle\.digest\('SHA-256'/);
  assert.match(js,/PRIORITY_ACCOUNT_HASH='[a-f0-9]{64}'/);
  assert.doesNotMatch(js,/@gmail\.com/i);
  assert.match(js,/UI-order preference only, never authorization/);
});

test('saved links move above Listen and Watch content only when the priority account has links',()=>{
  assert.match(js,/const priority=priorityAccount&&links\.length>0/);
  assert.match(js,/page\?\.querySelector\('\.media-hero'\)/);
  assert.match(js,/hero\.insertAdjacentElement\('afterend',section\)/);
  assert.match(js,/else watch\.append\(section\)/);
  assert.match(js,/media-custom-links-priority/);
  assert.match(css,/\.media-custom-links-priority\{[^}]*margin:0 0 18px/);
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

test('account-specific reordering remains presentation-only and URL safety is unchanged',()=>{
  assert.match(js,/\['https:','http:'\]\.includes\(u\.protocol\)/);
  assert.match(js,/rel="noopener noreferrer"/);
  assert.match(js,/MAX_LINKS=12/);
  assert.doesNotMatch(js,/fetch\(/);
  assert.doesNotMatch(js,/document\.cookie/);
});
