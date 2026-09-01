import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const responsive = fs.readFileSync(new URL('../scripts/responsive-matrix-smoke.py', import.meta.url), 'utf8');
const readability = fs.readFileSync(new URL('../scripts/readability-browser-smoke.py', import.meta.url), 'utf8');
const media = fs.readFileSync(new URL('../scripts/media-browser-smoke.py', import.meta.url), 'utf8');

const mediaReadySelector = "'listen-watch':'.media-page .media-tune-guide'";

test('broad browser audits use the same explicit media readiness contract as the dedicated media smoke', () => {
  assert.match(media, /document\.querySelector\('\.media-page'\) && document\.querySelector\('\.media-tune-guide'\)/);
  assert.ok(responsive.includes(mediaReadySelector), 'responsive matrix must wait for the rendered Listen / Watch surface');
  assert.ok(readability.includes(mediaReadySelector), 'readability audit must wait for the rendered Listen / Watch surface');
});

test('route-specific readiness remains preferred over generic page-heading detection', () => {
  for (const source of [responsive, readability]) {
    assert.match(source, /if\(selector\)return Boolean\(document\.querySelector\(selector\)\);/);
    assert.match(source, /ROUTE_READY_SELECTORS\.get\(route_name,''\)/);
  }
});
