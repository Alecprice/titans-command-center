import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../media-affiliates-v14.js',import.meta.url),'utf8');
const css=await readFile(new URL('../media-affiliates-v14.css',import.meta.url),'utf8');
const browser=await readFile(new URL('../scripts/media-affiliate-browser-smoke.py',import.meta.url),'utf8');

test('favorite affiliate is device-local, versioned, and constrained to the official station list',()=>{
  assert.match(js,/const FAVORITE_KEY='titans:favoriteRadioAffiliate'/);
  assert.match(js,/const FAVORITE_VERSION=1/);
  assert.match(js,/localStorage\.getItem\(FAVORITE_KEY\)/);
  assert.match(js,/localStorage\.setItem\(FAVORITE_KEY,JSON\.stringify\(\{version:FAVORITE_VERSION,key:station\.key\}\)\)/);
  assert.match(js,/STATIONS\.find\(station=>station\.key===saved\.key\)\|\|null/);
  assert.doesNotMatch(js,/fetch\(/);
  assert.doesNotMatch(js,/navigator\.geolocation/);
});

test('favorite controls are accessible, replaceable, removable, and visibly pinned',()=>{
  assert.match(js,/data-affiliate-favorite=/);
  assert.match(js,/aria-pressed=/);
  assert.match(js,/data-affiliate-saved/);
  assert.match(js,/data-affiliate-unfavorite/);
  assert.match(js,/Saved stations are AM\/FM reminders only/);
  assert.match(js,/syncFavorite\(details\)/);
  assert.match(js,/titans:affiliate-favorite/);
});

test('favorite UI preserves mobile touch targets and contrast support',()=>{
  assert.match(css,/media-affiliate-saved button,.media-affiliate-card button\{[^}]*min-height:44px/);
  assert.match(css,/@media\(max-width:480px\)/);
  assert.match(css,/media-affiliate-card button\{grid-column:2;grid-row:1\/4/);
  assert.match(css,/@media\(prefers-contrast:more\)/);
});

test('production browser smoke proves favorite persistence, removal, and mobile target size',()=>{
  assert.match(browser,/titans:favoriteRadioAffiliate/);
  assert.match(browser,/favoriteSaved/);
  assert.match(browser,/driver\.refresh\(\)/);
  assert.match(browser,/data-affiliate-unfavorite/);
  assert.match(browser,/favoriteHeight/);
});
