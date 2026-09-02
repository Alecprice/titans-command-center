import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('saved Ticket compare exposes one explicit share action',async()=>{
  const source=await read('tickets-compare-v125.js');
  assert.ok(source.includes('data-ticket-compare-share'));
  assert.ok(source.includes('aria-label="Share saved ticket plan"'));
  assert.ok(source.includes('Share plan'));
  assert.ok(source.includes("if(share){void sharePlan(center);return;}"));
});

test('shared plan contains only visible factual decision fields',async()=>{
  const source=await read('tickets-compare-v125.js');
  assert.ok(source.includes('Tennessee Titans ticket shortlist'));
  assert.ok(source.includes('Current start: ${money(item.price)}'));
  assert.ok(source.includes("${money(total)} before fees"));
  assert.ok(source.includes('Browser-observed movement: ${item.movement.label}'));
  assert.ok(source.includes('Party totals are starting price × ticket count, before fees. Seat quality and checkout fees are not inferred.'));
  assert.ok(source.includes("Source coverage not current"));
});

test('share uses the native share sheet first and clipboard only as a fallback',async()=>{
  const source=await read('tickets-compare-v125.js');
  assert.ok(source.includes("typeof navigator.share==='function'"));
  assert.ok(source.includes("await navigator.share({title:'Titans ticket shortlist',text,url})"));
  assert.ok(source.includes('navigator.clipboard?.writeText'));
  assert.ok(source.includes('Open Ticket Center: ${url}'));
  assert.ok(source.includes("error?.name==='AbortError'"));
  assert.ok(source.includes('Share canceled. Your shortlist is unchanged.'));
});

test('share stays read-only against Ticket providers and persisted fan state',async()=>{
  const source=await read('tickets-compare-v125.js');
  assert.doesNotMatch(source,/\bfetch\s*\(/);
  assert.doesNotMatch(source,/XMLHttpRequest|WebSocket/);
  assert.doesNotMatch(source,/storage\?\.setJSON|localStorage\.setItem|sessionStorage\.setItem/);
  assert.ok(source.includes("runtime?.storage?.getJSON?.(SHORTLIST_KEY,[])"));
  assert.ok(source.includes("runtime?.storage?.getJSON?.(MEMORY_KEY,{events:{}})"));
});

test('share action is phone-safe keyboard-visible and high-contrast friendly',async()=>{
  const css=await read('tickets-compare-v125.css');
  assert.match(css,/\.tickets-compare-v125>footer button\{[^}]*min-height:46px/);
  assert.match(css,/@media\(max-width:620px\)[\s\S]*\.tickets-compare-v125>footer button\{width:100%;min-height:48px\}/);
  assert.match(css,/\.tickets-compare-v125>footer button:focus-visible\{outline:3px solid/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/@media\(forced-colors:active\)[\s\S]*\.tickets-compare-v125>footer button/);
});
