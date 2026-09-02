import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const moduleSource=await readFile(new URL('../legacy-anniversary-v9.js',import.meta.url),'utf8');
const indexSource=await readFile(new URL('../index.html',import.meta.url),'utf8');

const compact=value=>value.replace(/\s+/g,' ');

test('Legacy anniversary lens is wired after the existing Legacy museum owners',()=>{
  assert.match(indexSource,/legacy-polish\.js\?v=21[\s\S]*legacy-finder-v2\.js\?v=1[\s\S]*legacy-anniversary-v9\.js\?v=1/);
});

test('anniversary dates are derived from rendered Iconic Moments instead of a duplicate history registry',()=>{
  assert.match(moduleSource,/querySelectorAll\('\.legacy-moment-card'\)/);
  assert.match(moduleSource,/querySelector\('\.legacy-moment-date'\)/);
  assert.match(moduleSource,/parseMomentDate\(dateText\)/);
  assert.doesNotMatch(moduleSource,/Music City Miracle|AFC Championship|Super Bowl XXXIV|Derrick Henry|George Blanda/);
});

test('only explicit month-day-year museum dates qualify and season-only text cannot be invented into a date',()=>{
  assert.match(moduleSource,/^function parseMomentDate/mi);
  assert.match(moduleSource,/\^\(\[A-Z\]\[a-z\]\{2\}\)\\\.\\s\+\(\\d\{1,2\}\),\\s\+\(\\d\{4\}\)\$/);
  assert.doesNotMatch(moduleSource,/Date\.parse\(/);
  assert.match(moduleSource,/if\(!match\)return null/);
  assert.match(moduleSource,/Season-only entries are not converted into made-up dates/);
});

test('calendar distance uses civil-date UTC arithmetic so DST cannot skew the day count',()=>{
  assert.match(moduleSource,/Date\.UTC\(now\.getFullYear\(\),now\.getMonth\(\),now\.getDate\(\)\)/);
  assert.match(moduleSource,/Date\.UTC\(occurrenceYear,parsed\.month,parsed\.day\)/);
  assert.match(moduleSource,/Math\.round\(\(target-today\)\/DAY_MS\)/);
  assert.match(moduleSource,/if\(target<today\)\{occurrenceYear\+=1/);
});

test('lens remains compact and ranks the three nearest exact-date museum moments',()=>{
  assert.match(moduleSource,/const MAX_ITEMS=3/);
  assert.match(moduleSource,/sort\(\(a,b\)=>a\.days-b\.days\|\|a\.index-b\.index\)\.slice\(0,MAX_ITEMS\)/);
  assert.match(moduleSource,/Next in Titans history/);
  assert.match(moduleSource,/Today in franchise history/);
  assert.match(moduleSource,/Tomorrow in franchise history/);
});

test('open exhibit delegates to the existing Finder exact-exhibit controller and has a fail-soft focus fallback',()=>{
  assert.match(moduleSource,/page\._legacyFinderController/);
  assert.match(moduleSource,/controller\?\.focusExhibit/);
  assert.match(moduleSource,/controller\.focusExhibit\(key,\{syncUrl:true,scroll:true\}\)/);
  assert.match(moduleSource,/card\.scrollIntoView/);
  assert.match(moduleSource,/card\.focus/);
  assert.doesNotMatch(moduleSource,/location\.hash\s*=/);
  assert.doesNotMatch(moduleSource,/history\.(?:pushState|replaceState)/);
});

test('anniversary lens adds no network, persistence, polling, timer, or mutation-observer owner',()=>{
  const banned=[
    /\bfetch\s*\(/,/XMLHttpRequest/,/WebSocket/,/EventSource/,
    /localStorage/,/sessionStorage/,/indexedDB/,/setInterval\s*\(/,/setTimeout\s*\(/,/MutationObserver/
  ];
  banned.forEach(pattern=>assert.doesNotMatch(moduleSource,pattern));
  assert.match(moduleSource,/frame\+\+>=12/);
  assert.match(moduleSource,/requestAnimationFrame\(tick\)/);
});

test('mobile and accessibility contracts keep the anniversary controls usable',()=>{
  const source=compact(moduleSource);
  assert.match(source,/\.legacy-anniversary-card button\{min-height:44px/);
  assert.match(source,/@media\(max-width:760px\).*\.legacy-anniversary-card button\{min-height:48px/);
  assert.match(source,/button:focus-visible\{outline:3px/);
  assert.match(source,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(source,/@media\(forced-colors:active\)/);
  assert.match(moduleSource,/aria-labelledby="legacy-anniversary-title"/);
  assert.match(moduleSource,/aria-label="Open Legacy exhibit:/);
});
