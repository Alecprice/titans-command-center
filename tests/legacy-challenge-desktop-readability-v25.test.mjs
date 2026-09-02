import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(new URL('../legacy-challenge-v10.js',import.meta.url),'utf8');
const compact=value=>value.replace(/\s+/g,' ');
const oneLine=compact(source);

test('Legacy Challenge raises desktop microcopy and action text above the old 8-10px floor',()=>{
  assert.match(oneLine,/\.legacy-challenge-head small\{[^}]*font-size:10px/);
  assert.match(oneLine,/\.legacy-challenge-head p\{[^}]*font-size:12px/);
  assert.match(oneLine,/\.legacy-challenge-meta\{[^}]*font-size:10px/);
  assert.match(oneLine,/\.legacy-challenge-mode strong\{font-size:11px/);
  assert.match(oneLine,/\.legacy-challenge-mode span\{[^}]*font-size:10px/);
  assert.match(oneLine,/\.legacy-challenge-reference\{[^}]*font-size:11px/);
  assert.match(oneLine,/\.legacy-challenge-options button,.legacy-challenge-action\{min-height:44px[^}]*font-size:11px/);
  assert.match(oneLine,/\.legacy-challenge-feedback\{[^}]*font-size:12px/);
  assert.match(oneLine,/\.legacy-challenge-start\{min-height:46px[^}]*font-size:11px/);
  assert.match(oneLine,/data-legacy-challenge-state="idle"\] \.legacy-challenge-head p\{font-size:11px;line-height:1\.5\}/);
  assert.doesNotMatch(oneLine,/\.legacy-challenge-head small\{[^}]*font-size:8px/);
  assert.doesNotMatch(oneLine,/\.legacy-challenge-options button,.legacy-challenge-action\{[^}]*font-size:9px/);
});

test('Legacy Challenge preserves its stronger phone readability and interaction floors',()=>{
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-head small\{font-size:12px;line-height:1\.35\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-head p\{font-size:14px;line-height:1\.6\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-meta\{font-size:12px;line-height:1\.35\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-options button,.legacy-challenge-action,.legacy-challenge-start\{min-height:48px;font-size:12px;line-height:1\.25\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*data-legacy-challenge-state="idle"\] \.legacy-challenge-head p\{font-size:13px;line-height:1\.5\}/);
  assert.match(oneLine,/\.legacy-challenge-mode\{min-height:44px/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-mode\{min-height:48px\}/);
});

test('desktop readability pass does not add a new Challenge data or lifecycle owner',()=>{
  assert.match(source,/querySelectorAll\('\.legacy-record-card'\)/);
  assert.match(source,/querySelectorAll\('\.legacy-retired-card'\)/);
  assert.match(source,/page\._legacyFinderController/);
  const banned=[/\bfetch\s*\(/,/XMLHttpRequest/,/WebSocket/,/EventSource/,/localStorage/,/sessionStorage/,/indexedDB/,/MutationObserver/,/setInterval\s*\(/,/setTimeout\s*\(/];
  banned.forEach(pattern=>assert.doesNotMatch(source,pattern));
  assert.match(source,/button:focus-visible\{outline:3px/);
  assert.match(source,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(source,/@media\(forced-colors:active\)/);
});
