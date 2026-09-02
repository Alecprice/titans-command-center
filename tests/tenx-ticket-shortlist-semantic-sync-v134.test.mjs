import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const tenx=fs.readFileSync(new URL('../tickets-tenx-v123.js',import.meta.url),'utf8');
const compare=fs.readFileSync(new URL('../tickets-compare-v125.js',import.meta.url),'utf8');
const finalists=fs.readFileSync(new URL('../tickets-finalists-v127.js',import.meta.url),'utf8');

test('ticket shortlist owner exposes stable semantic saved state',()=>{
  assert.match(tenx,/const SHORTLIST_CHANGE='titans:ticket-shortlist-change'/);
  assert.match(tenx,/data-ticket-tenx-saved-count="\$\{saved\.length\}"/);
  assert.match(tenx,/tray\.dataset\.ticketTenxSavedCount=String\(saved\.length\)/);
  assert.match(tenx,/center\.dataset\.ticketTenxSavedCount=String\(saved\.length\)/);
});

test('ticket shortlist owner announces saves only after storage and tray agree',()=>{
  assert.match(tenx,/function announceSaved\(center,saved=readSaved\(\)\)/);
  assert.match(tenx,/center\.dispatchEvent\(new CustomEvent\(SHORTLIST_CHANGE,\{bubbles:true,detail:\{count,keys:\[\.\.\.keys\]\}\}\)\)/);
  assert.match(tenx,/window\.dispatchEvent\(new StorageEvent\('storage',\{key:STORAGE_KEY,newValue:JSON\.stringify\(items\)\}\)\)/);
  assert.match(tenx,/decorate\(items\);\s*savedTray\(center,items\);\s*announceSaved\(center,saved\);/s);
});

test('clear emits the same semantic handoff as save and remove',()=>{
  assert.match(tenx,/const saved=\[\];writeSaved\(saved\);decorate\(records\(center\)\);savedTray\(center,records\(center\)\);announceSaved\(center,saved\);/);
});

test('same-tab compatibility signal reaches existing compare and finalists consumers',()=>{
  assert.match(compare,/addEventListener\('storage',event=>\{if\(event\.key===SHORTLIST_KEY\|\|event\.key===MEMORY_KEY\)schedule\(\);\}\)/);
  assert.match(finalists,/addEventListener\('storage',event=>\{if\(event\.key===SHORTLIST_KEY\)schedule\(\);\}\)/);
});

test('ticket escaping contract remains intact during synchronization change',()=>{
  assert.match(tenx,/'"':'&quot;'/);
  assert.match(tenx,/"'":'&#39;'/);
});