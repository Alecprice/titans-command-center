import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const guard=read('roster-filter-guard-v40.js');
const runtime=read('accessibility-runtime.js');
const sw=read('sw.js');

test('roster clear guard owns the live clear click before stale element handlers',()=>{
  assert.match(guard,/document\.addEventListener\('click',[\s\S]*\},true\);/);
  assert.match(guard,/closest\('\[data-roster-clear\]'\)/);
  assert.match(guard,/document\.querySelector\('\.roster-status-filters'\)/);
  assert.match(guard,/document\.querySelector\('\.filterbar'\)/);
});

test('roster clear guard re-queries and resets every visible filter contract',()=>{
  assert.match(guard,/search\.value=''/);
  assert.match(guard,/unit\.value='all'/);
  assert.match(guard,/search\.dispatchEvent\(new Event\('input',\{bubbles:true\}\)\)/);
  assert.match(guard,/unit\.dispatchEvent\(new Event\('input',\{bubbles:true\}\)\)/);
  assert.match(guard,/unit\.dispatchEvent\(new Event\('change',\{bubbles:true\}\)\)/);
  assert.match(guard,/button\.dataset\.rosterStatus==='all'/);
  assert.match(guard,/button\.setAttribute\('aria-pressed',String\(active\)\)/);
});

test('roster clear guard retries only if the live unit did not settle to all',()=>{
  assert.match(guard,/queueMicrotask\(\(\)=>\{/);
  assert.match(guard,/if\(unit&&unit\.value!=='all'\)resetLiveRosterFilters\(\)/);
  assert.doesNotMatch(guard,/MutationObserver/);
  assert.doesNotMatch(guard,/setTimeout/);
});

test('roster reset guard ships through the stable runtime and offline shell',()=>{
  assert.match(runtime,/import '\.\/roster-filter-guard-v40\.js';/);
  assert.match(sw,/'\/roster-filter-guard-v40\.js'/);
});
