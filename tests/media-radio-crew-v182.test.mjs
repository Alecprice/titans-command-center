import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const media=readFileSync(new URL('../media-center-v14.js',import.meta.url),'utf8');

test('Listen Watch identifies the current 2026 Titans Radio core crew',()=>{
  assert.match(media,/Taylor Zarzour/);
  assert.match(media,/Play-by-play/);
  assert.match(media,/Ramon Foster/);
  assert.match(media,/Analyst/);
  assert.match(media,/Will Boling/);
  assert.match(media,/Gameday host/);
});

test('sideline coverage is described as an alumni rotation instead of one fixed reporter',()=>{
  assert.match(media,/Titans alumni/);
  assert.match(media,/Sideline rotation/);
  assert.match(media,/Kevin Dyson/);
  assert.match(media,/Brad Hopkins/);
  assert.match(media,/Marc Mariani/);
  assert.match(media,/Ben Jones/);
  assert.match(media,/rotating cast of alumni/);
});

test('broadcast-team context links to the official Titans 2026 announcement safely',()=>{
  assert.match(media,/https:\/\/www\.tennesseetitans\.com\/news\/titans-announce-2026-titans-radio-broadcast-team/);
  assert.match(media,/Read the official 2026 broadcast-team announcement/);
  assert.match(media,/target="_blank" rel="noopener noreferrer"/);
});

test('crew context reuses the existing media lifecycle and does not create another data owner',()=>{
  const crewBlock=media.match(/function radioCrew\(\)[\s\S]*?\n  }/i)?.[0]||'';
  assert.ok(crewBlock,'radioCrew helper should exist');
  assert.doesNotMatch(crewBlock,/fetch\s*\(|XMLHttpRequest|WebSocket|EventSource|setInterval\s*\(|localStorage/);
  assert.match(media,/\$\{radioCrew\(\)\}/);
});
