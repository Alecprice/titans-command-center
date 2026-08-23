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

test('stored media links are revalidated before rendering',()=>{
  const js=read('media-custom-links-v14.js');
  assert.match(js,/const label=item\.label\.trim\(\),url=normalizeUrl\(item\.url\)/);
  assert.match(js,/label&&url\?\[\{label:label\.slice\(0,50\),url\}\]:\[\]/);
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
