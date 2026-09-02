import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(new URL('../legacy-heritage-v3.js',import.meta.url),'utf8');
const compact=value=>value.replace(/\s+/g,' ');

test('Legacy Heritage removes desktop microtype from stadium and Ring of Honor surfaces',()=>{
  const oneLine=compact(source);
  assert.match(oneLine,/\.legacy-heritage-intro p\{[^}]*font-size:12px/);
  assert.match(oneLine,/\.legacy-heritage-now small\{[^}]*font-size:10px/);
  assert.match(oneLine,/\.legacy-venue-scroll-cue\{[^}]*font-size:10px/);
  assert.match(oneLine,/\.legacy-venue-index\{[^}]*font-size:10px/);
  assert.match(oneLine,/\.legacy-venue-city\{[^}]*font-size:10px/);
  assert.match(oneLine,/\.legacy-venue-years strong\{[^}]*font-size:12px\}\.legacy-venue-years span\{[^}]*font-size:11px/);
  assert.match(oneLine,/\.legacy-venue-card p\{[^}]*font-size:12px/);
  assert.match(oneLine,/\.legacy-heritage-sources a\{[^}]*min-height:44px[^}]*font-size:11px/);
  assert.match(oneLine,/\.legacy-honors-head small\{[^}]*font-size:10px/);
  assert.match(oneLine,/\.legacy-honors-head p\{[^}]*font-size:12px/);
  assert.match(oneLine,/\.legacy-honor-filters button\{min-height:44px[^}]*font-size:11px/);
  assert.match(oneLine,/\.legacy-honor-card h4\{[^}]*font-size:14px[^}]*\}\.legacy-honor-card p\{[^}]*font-size:11px/);
  assert.match(oneLine,/\.legacy-honor-card small\{[^}]*font-size:10px\}\.legacy-honor-card strong\{[^}]*font-size:10px/);
  assert.doesNotMatch(oneLine,/\.legacy-heritage-now small\{[^}]*font-size:7px/);
  assert.doesNotMatch(oneLine,/\.legacy-heritage-sources a\{[^}]*font-size:8px/);
  assert.doesNotMatch(oneLine,/\.legacy-honor-filters button\{[^}]*font-size:8px/);
});

test('Legacy Heritage phone typography remains stronger than the desktop floor',()=>{
  const oneLine=compact(source);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-heritage-now small\{font-size:12px\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-venue-scroll-cue\{font-size:12px\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-venue-index,.legacy-venue-city\{font-size:12px\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-honors-head small\{font-size:12px\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-heritage-sources a\{min-height:48px!important;font-size:12px\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-honor-filters button\{min-height:48px;flex:0 0 auto;font-size:13px\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-honor-card p\{font-size:13px\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-honor-card small,.legacy-honor-card strong\{font-size:12px\}/);
});

test('Heritage readability pass keeps truth, interaction, and lifecycle boundaries intact',()=>{
  assert.match(source,/const venues=\[/);
  assert.match(source,/const honors=\[/);
  assert.match(source,/Ring of Honor · 19/);
  assert.match(source,/role="region" tabindex="0" aria-label="Oilers and Titans home stadium timeline"/);
  assert.match(source,/aria-label="Filter Ring of Honor members"/);
  assert.match(source,/\.legacy-venue-grid:focus-visible\{outline:3px solid/);
  assert.match(source,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(source,/@media\(forced-colors:active\)/);
  assert.doesNotMatch(source,/\bfetch\s*\(/);
  assert.doesNotMatch(source,/XMLHttpRequest|WebSocket|EventSource|localStorage|sessionStorage|indexedDB|setInterval\s*\(|setTimeout\s*\(|MutationObserver/);
});
