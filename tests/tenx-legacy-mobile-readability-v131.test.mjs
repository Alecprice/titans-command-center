import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css=fs.readFileSync('legacy-finder-v2.css','utf8');
const heritage=fs.readFileSync('legacy-heritage-v3.js','utf8');
const html=fs.readFileSync('index.html','utf8');

test('TENX Legacy finder keeps phone search and controls readable',()=>{
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/\.legacy-finder-search input\{font-size:16px\}/);
  assert.match(css,/\.legacy-finder-clear,.legacy-finder-share,.legacy-finder-scopes button,.legacy-finder-empty button\{font-size:13px;line-height:1\.25\}/);
  assert.match(css,/\.legacy-finder-scopes button\{min-height:48px;flex:0 0 auto;scroll-snap-align:start\}/);
  assert.match(css,/\.legacy-finder-feedback\{[^}]*font-size:12px/);
});

test('TENX Legacy museum raises narrative and metadata floors on phones',()=>{
  assert.match(css,/\.legacy-page \.legacy-museum-kicker,[^}]*font-size:12px/);
  assert.match(css,/\.legacy-page \.legacy-museum-hero-copy>p,[^}]*font-size:14px;line-height:1\.6/);
  assert.match(css,/\.legacy-page \.legacy-museum-actions button,[^}]*min-height:48px;font-size:13px/);
  assert.match(css,/\.legacy-page \.legacy-history-sources a,[^}]*min-height:44px;font-size:12px/);
  assert.match(css,/\.legacy-page \.legacy-story-tags span,[^}]*font-size:12px/);
});

test('TENX Legacy heritage cards and filters keep the effective mobile floors',()=>{
  assert.match(css,/\.legacy-page \.legacy-heritage-intro p\{font-size:14px!important/);
  assert.match(css,/\.legacy-page \.legacy-venue-index,[^}]*font-size:12px!important/);
  assert.match(css,/\.legacy-page \.legacy-venue-card p,[^}]*font-size:13px!important/);
  assert.match(css,/\.legacy-page \.legacy-heritage-sources a\{[^}]*font-size:12px!important/);
  assert.match(heritage,/@media\(max-width:760px\)[\s\S]*\.legacy-heritage-sources a\{min-height:48px!important;font-size:12px/);
  assert.doesNotMatch(heritage,/@media\(max-width:760px\)[\s\S]*\.legacy-heritage-sources a\{min-height:(?:4[0-7])px!important/);
  assert.match(css,/\.legacy-page \.legacy-honor-filters button\{min-height:48px!important;font-size:13px!important;scroll-snap-align:start\}/);
  assert.match(css,/\.legacy-page \.legacy-honor-card h4\{font-size:15px!important/);
});

test('Legacy finder stylesheet still loads after the base museum stylesheet',()=>{
  const base=html.indexOf('/legacy-polish.css');
  const finder=html.indexOf('/legacy-finder-v2.css');
  assert.ok(base>=0,'legacy base stylesheet should be loaded');
  assert.ok(finder>base,'Legacy finder/readability layer should load after base museum styles');
});
