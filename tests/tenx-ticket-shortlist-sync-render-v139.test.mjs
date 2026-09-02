import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const compare=readFileSync(new URL('../tickets-compare-v125.js',import.meta.url),'utf8');
const smoke=readFileSync(new URL('../scripts/tickets-browser-smoke.py',import.meta.url),'utf8');

test('Saved Compare consumes the settled shortlist handoff without another microtask hop',()=>{
  assert.match(compare,/function syncFromShortlist\(\)\{queued=false;enhance\(\);\}/);
  assert.match(compare,/app\.addEventListener\(SHORTLIST_CHANGE,syncFromShortlist\)/);
  assert.doesNotMatch(compare,/app\.addEventListener\(SHORTLIST_CHANGE,schedule\)/);

  const sync=compare.slice(compare.indexOf('function syncFromShortlist'),compare.indexOf("app.addEventListener('click'"));
  assert.doesNotMatch(sync,/queueMicrotask|requestAnimationFrame|setTimeout|setInterval/);
});

test('non-shortlist lifecycle work stays coalesced through the existing scheduler',()=>{
  assert.match(compare,/function schedule\(\)\{if\(queued\)return;queued=true;queueMicrotask\(enhance\);\}/);
  assert.match(compare,/addEventListener\('storage',event=>\{if\(event\.key===SHORTLIST_KEY\|\|event\.key===MEMORY_KEY\)schedule\(\);\}\)/);
  assert.match(compare,/new MutationObserver\(schedule\)/);
  assert.match(compare,/runtime\?\.onRoute\?\.\(schedule,\{immediate:true\}\)/);
  assert.match(compare,/runtime\?\.onAppRender\?\.\(schedule,\{immediate:true\}\)/);
});

test('direct shortlist rendering adds no polling, provider traffic, or new persistence state',()=>{
  assert.doesNotMatch(compare,/setInterval\s*\(/);
  assert.doesNotMatch(compare,/\bfetch\s*\(/);
  assert.doesNotMatch(compare,/XMLHttpRequest|WebSocket/);
  assert.equal((compare.match(/titans:tickets-shortlist-v123/g)||[]).length,1);
});

test('production Ticket compare lifecycle remains an unchanged eight-second requirement',()=>{
  assert.match(smoke,/WebDriverWait\(driver,8,poll_frequency=\.1\)\.until\(\s*lambda d:d\.execute_script\("return document\.querySelectorAll\('\[data-ticket-compare-v125\] \.tickets-compare-v125-card'\)\.length"\)>=2\s*\)/s);
});
