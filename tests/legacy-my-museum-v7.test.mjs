import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const finder=read('legacy-finder-v2.js');
const css=read('legacy-finder-v2.css');

test('My Museum reuses exact exhibit identity instead of duplicating franchise history',()=>{
  assert.match(finder,/const FINDER_VERSION='2\.4\.0'/);
  assert.match(finder,/const MY_MUSEUM_KEY='titans:legacy-my-museum-v1'/);
  assert.match(finder,/const MY_MUSEUM_MAX=12/);
  assert.match(finder,/normalizeMyMuseum\(value,index\)/);
  assert.match(finder,/index\.byExhibit\.has\(key\)/);
  assert.match(finder,/JSON\.stringify\(\{version:1,keys:normalized\}\)/);
  assert.doesNotMatch(finder,/myMuseum(?:Facts|History|Copy|Sources)\s*=/i);
});

test('My Museum is bounded local-only state with truthful restricted-storage fallback',()=>{
  assert.match(finder,/\.slice\(0,MY_MUSEUM_MAX\)/);
  assert.match(finder,/localStorage\.getItem\(MY_MUSEUM_KEY\)/);
  assert.match(finder,/localStorage\.setItem\(MY_MUSEUM_KEY/);
  assert.match(finder,/let volatileMyMuseum=\[\]/);
  assert.match(finder,/Browser storage is unavailable here\. My Museum saves last for this visit only\./);
  assert.match(finder,/Saved only on this browser\. No account sync or Passport changes\./);
  assert.doesNotMatch(finder,/account-sync|preferences\/sync|titans:legacy-passport-v1/);
});

test('Save controls compose with exact exhibit Share controls and expose pressed state',()=>{
  assert.match(finder,/data-legacy-exhibit-save="\$\{key\}" aria-pressed="false"/);
  assert.match(finder,/data-legacy-exhibit-share="\$\{key\}"/);
  assert.match(finder,/button\.setAttribute\('aria-pressed',String\(isSaved\)\)/);
  assert.match(finder,/button\.textContent=isSaved\?'Saved exhibit':'Save exhibit'/);
  assert.match(finder,/My Museum is full at \$\{MY_MUSEUM_MAX\} exhibits/);
});

test('saved collection opens exact exhibits through the existing Finder controller',()=>{
  assert.match(finder,/data-legacy-my-museum-open/);
  assert.match(finder,/focusExhibit\(key,\{syncUrl:true,scroll:true\}\)/);
  assert.match(finder,/Opened from My Museum/);
  assert.match(finder,/data-legacy-my-museum-remove/);
  assert.match(finder,/myMuseum\.keys\.filter\(saved=>saved!==key\)/);
  assert.match(finder,/controller\.ensureMyMuseum\(\)/);
  assert.match(finder,/page\.dataset\.legacyMyMuseumReady='true'/);
});

test('My Museum does not earn Passport progress or add network and lifecycle ownership',()=>{
  assert.doesNotMatch(finder,/\bfetch\s*\(/);
  assert.doesNotMatch(finder,/XMLHttpRequest|WebSocket|EventSource|setInterval\(/);
  assert.doesNotMatch(finder,/stampPassport|persistPassport|visited:/);
  const hashListeners=(finder.match(/addEventListener\('hashchange'/g)||[]).length;
  assert.equal(hashListeners,1,'Finder must keep its single existing hash route listener');
  const observers=(finder.match(/new MutationObserver/g)||[]).length;
  assert.equal(observers,1,'My Museum must reuse the existing Finder observer');
});

test('My Museum keeps normal museum browsing uncluttered and supports mobile touch interaction',()=>{
  assert.match(css,/\.legacy-exhibit-actions\{display:none/);
  assert.match(css,/\.legacy-finder-active \.legacy-finder-match>\.legacy-exhibit-actions,\.legacy-exhibit-focus>\.legacy-exhibit-actions/);
  assert.match(css,/\.legacy-my-museum-list\{display:flex/);
  assert.match(css,/scroll-snap-type:x proximity/);
  assert.match(css,/\.legacy-my-museum-card button\{min-height:44px/);
  assert.match(css,/@media\(max-width:760px\)[\s\S]*\.legacy-my-museum-card button\{min-height:48px/);
  assert.match(css,/@media\(forced-colors:active\)[\s\S]*\.legacy-my-museum/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)[\s\S]*\.legacy-my-museum-list/);
});

test('My Museum continues shipping through the already-cached Finder assets',()=>{
  const sw=read('sw.js');
  assert.match(sw,/\/legacy-finder-v2\.js/);
  assert.match(sw,/\/legacy-finder-v2\.css/);
  assert.doesNotMatch(sw,/legacy-my-museum-v7/);
});