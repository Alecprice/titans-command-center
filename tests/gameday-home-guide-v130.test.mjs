import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../gameday-today-v22.js',import.meta.url),'utf8');

test('home Gameday adds a Know Before You Go utility without touching road games',()=>{
  assert.match(js,/function homeGuideMarkup\(game\)/);
  assert.match(js,/if\(game\?\.homeAway!=='home'\)return''/);
  assert.match(js,/KNOW BEFORE YOU GO/);
  assert.match(js,/Nissan Stadium home-game essentials/);
  assert.match(js,/mountHomeGuide\(phase,game\)/);
});

test('home utility surfaces the current official entry and parking gotchas',()=>{
  assert.match(js,/tickets are mobile-only\. Screenshots and PDF printouts are not accepted/i);
  assert.match(js,/12 × 12 × 6 inches or smaller/);
  assert.match(js,/4\.5 × 6\.5 inches or smaller/);
  assert.match(js,/Stadium lots require a Titans-issued mobile parking pass/);
  assert.match(js,/Do not arrive expecting a stadium cash lot/);
  assert.match(js,/credit card and mobile payment at vendors, concessions, parking and retail/);
});

test('home utility routes into existing Tickets and current official Titans stadium guidance',()=>{
  assert.match(js,/href="#tickets">Open Tickets/);
  assert.match(js,/https:\/\/www\.tennesseetitans\.com\/stadium\/gameday\//);
  assert.match(js,/https:\/\/www\.tennesseetitans\.com\/stadium\/policies/);
  assert.match(js,/https:\/\/www\.tennesseetitans\.com\/stadium\/bag-policy/);
  assert.match(js,/https:\/\/www\.tennesseetitans\.com\/stadium\/seating-guide/);
  assert.match(js,/target="_blank" rel="noopener noreferrer"/);
});

test('home utility avoids stale game-specific event times and remains phase-safe',()=>{
  assert.doesNotMatch(js,/Parking Lots Open:|Stadium Gates Open:|Ticket Office Opens:|Tailgate:|Alcohol Sales End:/);
  assert.match(js,/if\(existing\?\.dataset\.gameId===id\)\{mountHomeGuide\(phase,game\);return true;\}/);
  assert.match(js,/root\.querySelector\('\.v22-home-guide'\)\?\.remove\(\)/);
  assert.match(js,/phase\.querySelector\('\.v22-home-guide'\)\?\.remove\(\)/);
});

test('Know Before You Go is mobile and accessibility safe',()=>{
  assert.match(js,/@media\(max-width:759px\)[\s\S]*\.v22-home-grid\{grid-template-columns:1fr\}/);
  assert.match(js,/\.v22-home-actions a\{min-height:48px;width:100%\}/);
  assert.match(js,/\.v22-home-card a\{min-height:48px\}/);
  assert.match(js,/@media\(prefers-reduced-motion:reduce\)[\s\S]*\.v22-home-guide \*/);
  assert.match(js,/focus-visible/);
});