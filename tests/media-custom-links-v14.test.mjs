import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('custom media links remain user-managed with guest-local and optional account sync behavior',()=>{
  const js=read('media-custom-links-v14.js');
  assert.match(js,/titans:v14CustomMediaLinks/);
  assert.match(js,/localStorage\.getItem/);
  assert.match(js,/localStorage\.setItem/);
  assert.match(js,/Guest links stay on this device/);
  assert.match(js,/signed-in users can sync saved links/);
  assert.match(js,/not verified or endorsed by the Command Center/);
  assert.doesNotMatch(js,/fetch\(/);
  assert.doesNotMatch(js,/XMLHttpRequest/);
});

test('custom media links accept only normal web protocols and remain removable',()=>{
  const js=read('media-custom-links-v14.js');
  assert.match(js,/\['https:','http:'\]\.includes\(u\.protocol\)/);
  assert.match(js,/data-custom-remove/);
  assert.match(js,/links\.splice\(index,1\)/);
  assert.match(js,/MAX_LINKS=12/);
  assert.match(js,/rel="noopener noreferrer"/);
});

test('custom media UI is mobile friendly and precached',()=>{
  const js=read('media-alternatives-v14.js'),css=read('media-custom-links-v14.css'),sw=read('sw.js');
  assert.match(js,/import '\.\/media-custom-links-v14\.js'/);
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/min-height:46px/);
  assert.match(sw,/media-custom-links-v14\.js/);
  assert.match(sw,/media-custom-links-v14\.css/);
  assert.match(sw,/const CACHE = 'titans-cc-brand-2026-v\d+'/);
});