import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('legacy heritage adds the complete official home-field journey',()=>{
  const js=read('legacy-heritage-v3.js');
  for(const venue of ['Jeppesen Stadium','Rice Stadium','Astrodome','Liberty Bowl','Dudley Field / Vanderbilt Stadium','Nissan Stadium','New Nissan Stadium']){
    assert.match(js,new RegExp(venue.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  }
  assert.match(js,/1960–1964/);
  assert.match(js,/1999–2026/);
  assert.match(js,/scheduled to open in 2027/i);
  assert.match(js,/tennesseetitans\.com\/history\/stadium-history/);
  assert.match(js,/tennesseetitans\.com\/new-stadium\/info/);
});

test('legacy heritage carries all 19 current Ring of Honor members',()=>{
  const js=read('legacy-heritage-v3.js');
  const names=['K.S.','Elvin Bethea','George Blanda','Robert Brazile','Earl Campbell','Jeff Fisher','Eddie George','Mike Holovak','Ken Houston','White Shoes','Mike Keith','Bruce Matthews','Steve McNair','Warren Moon','Mike Munchak','Jim Norton','Bum','Floyd Reese','Frank Wycheck'];
  for(const name of names)assert.match(js,new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(js,/Ring of Honor · 19/);
  assert.match(js,/Mike Keith[\s\S]*inducted:'2025'/);
  assert.match(js,/tennesseetitans\.com\/history\/hall-of-fame/);
});

test('heritage is progressive, source-safe and does not add a data fetch',()=>{
  const js=read('legacy-heritage-v3.js');
  assert.match(js,/const esc=/);
  assert.match(js,/rel="noopener noreferrer"/);
  assert.match(js,/ensureLegacyHeritage/);
  assert.doesNotMatch(js,/\bfetch\s*\(/);
});

test('heritage honors filter is accessible and mobile ready',()=>{
  const js=read('legacy-heritage-v3.js');
  assert.match(js,/aria-label="Filter Ring of Honor members"/);
  assert.match(js,/aria-pressed/);
  assert.match(js,/data-heritage-honor-filter/);
  assert.match(js,/min-height:46px/);
  assert.match(js,/max-width:430px/);
  assert.match(js,/prefers-reduced-motion:reduce/);
  assert.match(js,/forced-colors:active/);
});

test('Legacy Finder indexes Heritage and coordinates native filters',()=>{
  const js=read('legacy-finder-v2.js');
  assert.match(js,/ensureLegacyHeritage/);
  assert.match(js,/heritage:\{id:'legacy-heritage',label:'Heritage'/);
  assert.match(js,/\.legacy-venue-card/);
  assert.match(js,/\.legacy-honor-card/);
  assert.match(js,/heritage:0/);
  assert.match(js,/\.legacy-heritage-sources/);
  assert.match(js,/\[data-heritage-honor-filter\]/);
  assert.match(js,/ensureLegacyHeritage\(page\);\s*const index=indexMuseum\(page\)/);
});

test('heritage section keeps route-safe navigation and renumbers Identity',()=>{
  const js=read('legacy-heritage-v3.js');
  assert.match(js,/dataset\.legacyScroll='legacy-heritage'/);
  assert.doesNotMatch(js,/href="#legacy-heritage"/);
  assert.match(js,/06 · Identity vault/);
});

test('heritage dependency is part of the offline shell',()=>{
  const sw=read('sw.js');
  assert.match(sw,/titans-cc-brand-2026-v80/);
  assert.match(sw,/\/legacy-finder-v2\.js/);
  assert.match(sw,/\/legacy-heritage-v3\.js/);
});
