import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const src=fs.readFileSync(new URL('../player-favorite-sync-v168.js',import.meta.url),'utf8');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');

test('TENX Player Favorite reconciles from the existing My Titans profile only',()=>{
  assert.match(src,/const PROFILE_KEY='titans:v15MyTitans'/);
  assert.match(src,/localStorage\.getItem\(PROFILE_KEY\)/);
  assert.doesNotMatch(src,/localStorage\.(?:setItem|removeItem)/);
});

test('TENX Player Favorite follows existing sync, import, reset, and cross-tab preference events',()=>{
  for(const event of ['titans:preferences-synced','titans:preferences-imported','titans:preferences-reset','storage'])assert.ok(src.includes(event),event);
  assert.match(src,/Array\.isArray\(keys\)&&!keys\.includes\(PROFILE_KEY\)/);
});

test('TENX Player Favorite repaints the current control from persisted favorite identity',()=>{
  assert.match(src,/route\(\)!=='player'/);
  assert.match(src,/\.v16-player-command/);
  assert.match(src,/\[data-v16-favorite\]/);
  assert.match(src,/slug\(profile\(\)\?\.favorite\)===slug\(playerName\)/);
  assert.match(src,/aria-pressed/);
  assert.match(src,/★ Favorite/);
  assert.match(src,/☆ Make favorite/);
});

test('TENX Player Favorite clears stale failure labels only when persisted truth is reconciled',()=>{
  assert.match(src,/button\.removeAttribute\('aria-label'\)/);
  assert.match(src,/button\.textContent=favorite\?'★ Favorite':'☆ Make favorite'/);
});

test('TENX Player Favorite adds no network or background lifecycle owner',()=>{
  assert.doesNotMatch(src,/\bfetch\s*\(/);
  assert.doesNotMatch(src,/XMLHttpRequest|WebSocket|EventSource|MutationObserver|setInterval|setTimeout|requestAnimationFrame/);
});

test('TENX Player Favorite is loaded by the shell and packaged offline',()=>{
  assert.match(index,/player-favorite-sync-v168\.js\?v=1/);
  assert.match(sw,/'\/player-favorite-sync-v168\.js'/);
  assert.match(sw,/titans-cc-brand-2026-v84/);
});
