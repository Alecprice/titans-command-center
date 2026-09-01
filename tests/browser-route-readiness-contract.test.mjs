import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const responsive = fs.readFileSync(new URL('../scripts/responsive-matrix-smoke.py', import.meta.url), 'utf8');
const readability = fs.readFileSync(new URL('../scripts/readability-browser-smoke.py', import.meta.url), 'utf8');
const media = fs.readFileSync(new URL('../scripts/media-browser-smoke.py', import.meta.url), 'utf8');
const command = fs.readFileSync(new URL('../scripts/command-intelligence-browser-smoke.py', import.meta.url), 'utf8');

const mediaReadySelector = "'listen-watch':'.media-page .media-tune-guide'";
const commandReadySelector = "'command-intel':'.v15-command [data-v15-tab]'";

test('broad browser audits use the same explicit media readiness contract as the dedicated media smoke', () => {
  assert.match(media, /document\.querySelector\('\.media-page'\) && document\.querySelector\('\.media-tune-guide'\)/);
  assert.ok(responsive.includes(mediaReadySelector), 'responsive matrix must wait for the rendered Listen / Watch surface');
  assert.ok(readability.includes(mediaReadySelector), 'readability audit must wait for the rendered Listen / Watch surface');
});

test('broad browser audits wait for the mounted Command Intel tab shell', () => {
  assert.match(command, /document\.querySelector\('\.v15-command'\) && document\.querySelectorAll\('\[data-v15-tab\]'\)\.length === 7/);
  assert.ok(responsive.includes(commandReadySelector), 'responsive matrix must wait for the rendered Command Intel tab shell');
  assert.ok(readability.includes(commandReadySelector), 'readability audit must wait for the rendered Command Intel tab shell');
});

test('route-specific readiness remains preferred over generic page-heading detection', () => {
  for (const source of [responsive, readability]) {
    assert.match(source, /if\(selector\)return Boolean\(document\.querySelector\(selector\)\);/);
    assert.match(source, /ROUTE_READY_SELECTORS\.get\(route_name,''\)/);
  }
});
