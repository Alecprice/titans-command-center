import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ui=fs.readFileSync(new URL('../fan-events-v145.js',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const headers=fs.readFileSync(new URL('../_headers',import.meta.url),'utf8');
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');

test('Fan Event Radar loads only through shared same-origin runtime API',()=>{
  assert.match(ui,/api\('\/api\/fan-events'/);
  assert.match(ui,/TitansRuntime/);
  assert.doesNotMatch(ui,/fetch\(['"]https?:\/\//);
  assert.doesNotMatch(ui,/ticketmaster\.com\/discovery|eventbriteapi\.com|api\.bandsintown\.com|skiddle\.com\/api/i);
});

test('event radar reuses shared route render refresh lifecycle without another observer or poller',()=>{
  assert.match(ui,/onRoute/);
  assert.match(ui,/onAppRender/);
  assert.match(ui,/titans:refresh/);
  assert.doesNotMatch(ui,/new MutationObserver|setInterval|setTimeout/);
});

test('fan event links preserve provider identity and external-link safety',()=>{
  assert.match(ui,/target="_blank" rel="noopener noreferrer"/);
  assert.match(ui,/data-fan-events-source/);
  assert.match(ui,/Ticketmaster/);
  assert.match(ui,/Eventbrite/);
  assert.match(ui,/Skiddle/);
  assert.doesNotMatch(ui,/Bandsintown/);
});

test('Skiddle results carry required official logo attribution and direct source action',()=>{
  assert.match(ui,/d1plawd8huk6hh\.cloudfront\.net\/assets\/logo\/png\/skiddle-logo-white-landscape\.png/);
  assert.match(ui,/<img src="\$\{SKIDDLE_LOGO\}" alt="Skiddle"/);
  assert.match(ui,/View on Skiddle/);
  assert.match(ui,/padding:19px/);
  assert.match(headers,/https:\/\/d1plawd8huk6hh\.cloudfront\.net/);
});

test('Fan Hub surface is compact, mobile touch safe, and horizontally browseable',()=>{
  assert.match(ui,/grid-auto-flow:column/);
  assert.match(ui,/overflow-x:auto/);
  assert.match(ui,/min-height:44px/);
  assert.match(ui,/@media\(max-width:640px\)/);
  assert.match(ui,/min-height:48px/);
  assert.match(ui,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(ui,/@media\(forced-colors:active\)/);
  assert.match(ui,/focus-visible/);
});

 test('empty and degraded states keep Fan Hub usable when providers are quiet',()=>{
  assert.match(ui,/No upcoming events returned in the current window/);
  assert.match(ui,/Event discovery is temporarily unavailable/);
  assert.match(ui,/Titans Command Center can keep running without it/);
  assert.match(ui,/providerResults/);
  assert.match(ui,/temporarily unavailable|Unavailable/);
});

 test('runtime dependency remains packaged by the network-first PWA shell',()=>{
  assert.match(sw,/titans-cc-brand-2026-v84/);
  assert.match(sw,/['"]\/fan-events-v145\.js['"]/);
  assert.match(sw,/NETWORK_FIRST/);
});