import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ui=fs.readFileSync(new URL('../market-hub.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../market-hub.css',import.meta.url),'utf8');

test('live market hub understands configured-provider event fields',()=>{
  assert.match(ui,/away_team/);
  assert.match(ui,/home_team/);
  assert.match(ui,/commence_time/);
  assert.match(ui,/providerEventId/);
  assert.match(ui,/eventName\(event\)/);
});

test('alternate lines are hidden by default and can be revealed',()=>{
  assert.match(ui,/showAlt:false/);
  assert.match(ui,/marketUi\.showAlt\|\|!r\.alt/);
  assert.match(ui,/id="mh-alt-toggle"/);
  assert.match(ui,/aria-pressed=/);
  assert.match(ui,/Show.*alternate lines/s);
});

test('sportsbook and market-type filters are present',()=>{
  assert.match(ui,/id="mh-book-filter"/);
  assert.match(ui,/All sportsbooks/);
  assert.match(ui,/id="mh-category-filter"/);
  assert.match(ui,/Game lines/);
  assert.match(ui,/Player props/);
  assert.match(ui,/Showing <b>/);
});

test('book click-out links remain protocol-safe',()=>{
  assert.match(ui,/safeUrl\(r\.deeplink\)/);
  assert.match(ui,/class="mh-book-link"/);
  assert.match(ui,/rel="noopener noreferrer"/);
});

test('market controls remain responsive on phone layouts',()=>{
  assert.match(css,/\.mh-controls/);
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/@media\(max-width:430px\)/);
  assert.match(css,/\.mh-row\.is-alt/);
});
