import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync('gameday-entry-ready-v185.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');

test('home-game entry readiness uses current official Titans destinations and durable policy truth',()=>{
  assert.match(js,/https:\/\/www\.tennesseetitans\.com\/tickets\/mobile-tickets\//);
  assert.match(js,/https:\/\/www\.tennesseetitans\.com\/fans\/mobile-app\//);
  assert.match(js,/https:\/\/www\.tennesseetitans\.com\/stadium\/policies/);
  assert.match(js,/gates open two hours before kickoff/i);
  assert.match(js,/Screenshots and PDF printouts are not accepted/i);
  assert.match(js,/Gate 1 ticket windows/i);
});

test('entry readiness augments only the existing home-game guide',()=>{
  assert.match(js,/runtime\.route\(\)!=='live'/);
  assert.match(js,/querySelector\('\.v22-home-guide'\)/);
  assert.match(js,/querySelector\('\.v185-entry-ready'\)/);
  assert.doesNotMatch(js,/fetch\(|XMLHttpRequest|WebSocket|EventSource|localStorage|sessionStorage|setInterval/);
});

test('entry actions remain accessible on phone and use safe external links',()=>{
  assert.match(js,/min-height:44px/);
  assert.match(js,/@media\(max-width:759px\)[\s\S]*min-height:48px/);
  assert.match(js,/target="_blank" rel="noopener noreferrer"/);
  assert.match(js,/aria-label="Nissan Stadium mobile entry readiness"/);
});

test('new Game Day asset is loaded and packaged by the current network-first PWA shell',()=>{
  assert.match(html,/gameday-entry-ready-v185\.js\?v=1/);
  assert.match(sw,/titans-cc-brand-2026-v(?:8[6-9]|9\d|[1-9]\d{2,})/);
  assert.match(sw,/'\/gameday-entry-ready-v185\.js'/);
});
