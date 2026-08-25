import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('custom media links use a stable device key and migrate legacy versioned keys',()=>{
  const js=read('media-custom-links-v14.js');
  assert.match(js,/STORAGE_KEY='titans:customMediaLinks'/);
  assert.match(js,/STORAGE_VERSION=1/);
  assert.match(js,/LEGACY_STORAGE_RE=\/\^titans:v\\d\+CustomMediaLinks\$\/i/);
  assert.match(js,/localStorage\.getItem/);
  assert.match(js,/localStorage\.setItem/);
  assert.match(js,/localStorage\.key/);
  assert.match(js,/localStorage\.removeItem/);
  assert.match(js,/version:STORAGE_VERSION,links/);
  assert.match(js,/Saved links stay on this device through normal app and PWA updates/);
  assert.doesNotMatch(js,/localStorage\.clear/);
  assert.doesNotMatch(js,/fetch\(/);
  assert.doesNotMatch(js,/XMLHttpRequest/);
});

test('custom media module is idempotent even when imported and loaded directly',()=>{
  const js=read('media-custom-links-v14.js');
  assert.match(js,/__titansCustomMediaLinksLoaded/);
  assert.match(js,/if\(globalThis\.__titansCustomMediaLinksLoaded\)return/);
});

test('custom media links accept only normal web protocols and remain removable',()=>{
  const js=read('media-custom-links-v14.js');
  assert.match(js,/\['https:','http:'\]\.includes\(u\.protocol\)/);
  assert.match(js,/data-custom-remove/);
  assert.match(js,/links\.splice\(index,1\)/);
  assert.match(js,/MAX_LINKS=12/);
  assert.match(js,/rel="noopener noreferrer"/);
});

test('stored media links are revalidated and deduplicated before rendering',()=>{
  const js=read('media-custom-links-v14.js');
  assert.match(js,/const seen=new Set\(\)/);
  assert.match(js,/seen\.has\(url\)/);
  assert.match(js,/label:label\.slice\(0,50\),url/);
  assert.match(js,/\.slice\(0,MAX_LINKS\)/);
});

test('saved-link form reports cap duplicate and storage failures instead of silently doing nothing',()=>{
  const js=read('media-custom-links-v14.js');
  assert.match(js,/links\.length>=MAX_LINKS/);
  assert.match(js,/Remove one before adding another/);
  assert.match(js,/links\.some\(item=>item\.url===url\)/);
  assert.match(js,/That website is already saved/);
  assert.match(js,/if\(!writeLinks\(links\)\)/);
  assert.match(js,/could not be saved on this device/);
});

test('saved-link removal rejects invalid indexes and reports persistence failures',()=>{
  const js=read('media-custom-links-v14.js');
  assert.match(js,/Number\.isInteger\(index\)/);
  assert.match(js,/index<0\|\|index>=links\.length/);
  assert.match(js,/could not be removed from this device/);
});

test('custom URL form uses high-contrast Titans Red and remains mobile friendly',()=>{
  const css=read('media-custom-links-v14.css'),sw=read('sw.js');
  assert.match(css,/--titans-red:#C8102E/i);
  assert.match(css,/\.media-custom-form input\{[^}]*background:#fff[^}]*color:var\(--titans-red\)[^}]*caret-color:var\(--titans-red\)/);
  assert.match(css,/\.media-custom-form label span\{[^}]*background:#fff[^}]*color:var\(--titans-red\)/);
  assert.match(css,/\.media-custom-form button\{[^}]*background:var\(--titans-red\)[^}]*color:#fff/);
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/min-height:48px/);
  assert.match(sw,/media-custom-links-v14\.js/);
  assert.match(sw,/media-custom-links-v14\.css/);
  assert.match(sw,/const CACHE = 'titans-cc-brand-2026-v\d+'/);
});
