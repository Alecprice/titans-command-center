import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync('tickets-mobile-trust-v129.css','utf8');
const js = fs.readFileSync('tickets-v47.js','utf8');
const html = fs.readFileSync('index.html','utf8');
const sw = fs.readFileSync('sw.js','utf8');

test('TENX ticket trust states have dedicated visual treatment',()=>{
  assert.match(js,/tickets-provider-health/);
  assert.match(js,/tickets-provider-pill/);
  assert.match(js,/tickets-stale-banner/);
  assert.match(css,/\.tickets-provider-health\{/);
  assert.match(css,/\.tickets-provider-pill\.live\{/);
  assert.match(css,/\.tickets-provider-pill\.down\{/);
  assert.match(css,/\.tickets-provider-pill\.pending\{/);
  assert.match(css,/\.tickets-stale-banner\{/);
  assert.match(css,/\.tickets-price-block em\{/);
});

test('TENX ticket phone layout keeps comparison text readable and sources scannable',()=>{
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/\.tickets-provider-health>div\{grid-template-columns:1fr\}/);
  assert.match(css,/\.tickets-toolbar button,.tickets-toolbar>a\{width:100%;min-height:48px;font-size:14px\}/);
  assert.match(css,/\.tickets-price-group>header small,.tickets-comparison-board>header small,.tickets-price-block small,.tickets-event-tags span,.tickets-event-tags b/);
  assert.match(css,/\.tickets-offer-row>div:first-child span,.tickets-offer-price span,.tickets-event-meta span/);
  assert.match(css,/\.tickets-offer-row>a\{grid-column:1\/-1;width:100%;min-height:48px;font-size:13px\}/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/\.tickets-offer-row\{grid-template-columns:1fr\}/);
});

test('ticket trust layer is loaded and available to installed/offline clients',()=>{
  const base=html.indexOf('/tickets-v47.css');
  const trust=html.indexOf('/tickets-mobile-trust-v129.css');
  assert.ok(base>=0,'primary tickets stylesheet should be present');
  assert.ok(trust>base,'ticket trust stylesheet should load after primary ticket styles');
  assert.match(sw,/titans-cc-brand-2026-v80/);
  assert.match(sw,/'\/tickets-mobile-trust-v129\.css'/);
});
