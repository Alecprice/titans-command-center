import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ui=fs.readFileSync(new URL('../fan-events-v145.js',import.meta.url),'utf8');
const runtime=fs.readFileSync(new URL('../runtime-v19.js',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');

 test('Fan Event Radar loads only through shared same-origin runtime API',()=>{
  assert.match(runtime,/import\('\.\/fan-events-v145\.js'\)/);
  assert.match(ui,/const API='\/api\/fan-events'/);
  assert.match(ui,/runtime\.apiJson\(API,\{ttl:600000,force\}\)/);
  assert.doesNotMatch(ui,/\bfetch\s*\(/);
  assert.doesNotMatch(ui,/eventbriteapi\.com|skiddle\.com\/api|rest\.bandsintown\.com|app\.ticketmaster\.com/);
  for(const key of ['EVENTBRITE_PRIVATE_TOKEN','EVENTBRITE_OAUTH_TOKEN','SKIDDLE_API_KEY','BANDSINTOWN_API_KEY','TICKETMASTER_API_KEY'])assert.doesNotMatch(ui,new RegExp(key));
});

 test('event radar reuses shared route/render/refresh lifecycle without another observer or poller',()=>{
  assert.match(ui,/runtime\.onRoute\(schedule,\{immediate:true\}\)/);
  assert.match(ui,/runtime\.onAppRender\(schedule\)/);
  assert.match(ui,/runtime\.onRefresh/);
  assert.doesNotMatch(ui,/MutationObserver/);
  assert.doesNotMatch(ui,/setInterval/);
  assert.doesNotMatch(ui,/setTimeout/);
  assert.doesNotMatch(ui,/WebSocket|EventSource/);
});

 test('fan event links preserve provider identity and external-link safety',()=>{
  for(const provider of ['Skiddle','Bandsintown','Eventbrite','Ticketmaster'])assert.match(ui,new RegExp(provider));
  assert.match(ui,/target=\\"_blank\\" rel=\\"noopener noreferrer\\"/);
  assert.match(ui,/data-fan-events-source/);
  assert.match(ui,/Listings are discovery links, not Titans-affiliated events/);
  assert.match(ui,/source availability can differ by provider/);
});

 test('Fan Hub surface is compact, mobile touch safe, and horizontally browseable',()=>{
  assert.match(ui,/grid-auto-flow:column/);
  assert.match(ui,/scroll-snap-type:x proximity/);
  assert.match(ui,/min-height:44px/);
  assert.match(ui,/@media\(max-width:759px\)/);
  assert.match(ui,/min-height:48px/);
  assert.match(ui,/grid-auto-columns:minmax\(82vw,1fr\)/);
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

 test('new runtime dependency is packaged by the network-first PWA shell',()=>{
  assert.match(sw,/titans-cc-brand-2026-v81/);
  assert.match(sw,/['"]\/fan-events-v145\.js['"]/);
  assert.match(sw,/NETWORK_FIRST/);
});
