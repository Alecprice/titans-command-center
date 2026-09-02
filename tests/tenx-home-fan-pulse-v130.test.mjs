import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const client=read('titans-social-v49.js');
const css=read('titans-social-v49.css');
const api=read('src/x-social-api.mjs');

test('TENX Home Fan Pulse caps the digest at three items instead of another feed wall',()=>{
  assert.match(client,/const HOME_ITEM_LIMIT=3/);
  assert.match(client,/return \[official\[0\],\.\.\.publicItems,\.\.\.official\.slice\(1\)\]\.slice\(0,HOME_ITEM_LIMIT\)/);
  assert.doesNotMatch(client,/slice\(0,8\)/);
  assert.match(css,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
});

test('TENX Home Fan Pulse keeps one official update first while representing public conversation when available',()=>{
  assert.match(client,/const official=safe\.filter\(item=>Boolean\(item\?\.official\)\)/);
  assert.match(client,/const publicItems=safe\.filter\(item=>!item\?\.official\)/);
  assert.match(client,/if\(!official\.length\)return publicItems\.slice\(0,HOME_ITEM_LIMIT\)/);
  assert.match(client,/official\[0\],\.\.\.publicItems/);
  assert.match(client,/Three quick source-backed updates: official Titans coverage first/);
});

test('TENX Home Fan Pulse reports source availability without claiming social feeds are live',()=>{
  assert.match(client,/free sources responding/);
  assert.match(client,/All checked feeds responded/);
  assert.match(client,/temporarily unavailable/);
  assert.match(client,/data-social-freshness/);
  assert.doesNotMatch(client,/Official updates \+ Titans fan conversation/);
  assert.doesNotMatch(client,/class=\"is-live\"/);
});

test('TENX Home Fan Pulse preserves the existing free cached provider boundary',()=>{
  assert.match(client,/runtime\.apiJson\('\/api\/social-pulse',\{ttl:10\*60\*1000,force\}\)/);
  assert.match(api,/freeOnly:true/);
  assert.match(api,/Promise\.allSettled/);
  assert.doesNotMatch(client,/fetch\(/);
  assert.doesNotMatch(client,/new MutationObserver/);
  assert.doesNotMatch(client,/setInterval\(/);
  assert.doesNotMatch(client,/localStorage|sessionStorage/);
});

test('TENX Home Fan Pulse keeps external destinations protocol and host constrained',()=>{
  assert.match(client,/url\.protocol==='https:'/);
  assert.match(client,/allowedHosts\.some/);
  assert.match(client,/rel=\"noopener noreferrer\"/);
  assert.match(client,/esc\(title\)/);
  assert.match(client,/esc\(text\)/);
  assert.match(client,/esc\(author\|\|'Public source'\)/);
});

test('TENX Home Fan Pulse turns phone density into a swipeable digest rather than three stacked panels',()=>{
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/grid-auto-flow:column/);
  assert.match(css,/grid-auto-columns:minmax\(255px,84vw\)/);
  assert.match(css,/overflow-x:auto/);
  assert.match(css,/scroll-snap-type:x proximity/);
  assert.match(css,/min-height:44px/);
});

test('TENX Home Fan Pulse keeps source shortcuts and manual refresh available without another route or state silo',()=>{
  assert.match(client,/aria-label=\"Free Titans source shortcuts\"/);
  assert.match(client,/data-social-refresh/);
  assert.match(client,/Official news ↗/);
  assert.doesNotMatch(client,/history\.pushState|history\.replaceState/);
  assert.doesNotMatch(client,/TitansAccount|preferences-synced/);
});
