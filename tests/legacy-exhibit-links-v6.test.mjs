import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const finder=read('legacy-finder-v2.js');
const css=read('legacy-finder-v2.css');

test('Legacy exact links derive semantic exhibit keys from already-rendered museum cards',()=>{
  assert.match(finder,/const FINDER_VERSION='2\.4\.0'/);
  for(const type of ['story','moment','legend','record','retired','venue','honor'])assert.match(finder,new RegExp(`type:'${type}'`));
  assert.match(finder,/const slug=value=>normalize\(value\).*slice\(0,72\)/);
  assert.match(finder,/item\.dataset\.legacyExhibitKey=key/);
  assert.match(finder,/item\.dataset\.legacyExhibitLabel=label/);
  assert.match(finder,/const byExhibit=new Map\(\),usedKeys=new Set\(\)/);
  assert.doesNotMatch(finder,/legacyExhibit(?:Data|Registry|Facts)\s*=/i);
});

test('exhibit deep links use the existing Legacy hash route and preserve single-router ownership',()=>{
  assert.match(finder,/params\.set\('exhibit',key\)/);
  assert.match(finder,/params\.delete\('q'\);params\.delete\('scope'\);params\.delete\('trail'\);params\.delete\('step'\)/);
  assert.match(finder,/history\.replaceState\(history\.state,'',/);
  assert.match(finder,/exactExhibitUrl\(key\)/);
  assert.match(finder,/#\$\{ROUTE\}\?exhibit=\$\{encodeURIComponent\(clean\)\}/);
  assert.doesNotMatch(finder,/location\.hash\s*=/);
  assert.doesNotMatch(finder,/pushState\(/);
});

test('Finder and Trail actions clear stale exhibit state instead of creating mixed URL modes',()=>{
  assert.match(finder,/params\.delete\('exhibit'\)/);
  assert.match(finder,/if\(!preserveSpotlight&&spotlight\)clearSpotlight/);
  assert.match(finder,/if\(jump\|\|nativeFilter\)/);
  assert.match(finder,/if\(spotlight\)clearSpotlight\(\)/);
  assert.match(finder,/ensureLegacyTrails\(page,controller\)/);
});

test('deep-linked exhibits restore native museum visibility then focus only the exact card',()=>{
  assert.match(finder,/const item=index\.byExhibit\.get\(String\(key\|\|''\)\)/);
  assert.match(finder,/resetMuseumNativeFilters\(page\)/);
  assert.match(finder,/item\.classList\.add\('legacy-exhibit-focus'\)/);
  assert.match(finder,/item\.scrollIntoView\(\{behavior:reduced\?'auto':'smooth',block:'center'\}\)/);
  assert.match(finder,/item\.focus\(\{preventScroll:true\}\)/);
  assert.match(finder,/That exhibit link is no longer available\./);
  assert.match(finder,/writeExhibitState\(''\)/);
});

test('each share action sends only its semantic label and exact app URL with safe fallbacks',()=>{
  assert.match(finder,/data-legacy-exhibit-share/);
  assert.match(finder,/title:`Titans Legacy · \$\{label\}`/);
  assert.match(finder,/text:`Tennessee Titans Legacy exhibit: \$\{label\}`/);
  assert.match(finder,/if\(navigator\.share\)\{await navigator\.share\(payload\)/);
  assert.match(finder,/navigator\.clipboard\?\.writeText/);
  assert.match(finder,/navigator\.clipboard\.writeText\(url\)/);
  assert.match(finder,/error\?\.name!=='AbortError'/);
});

test('exact exhibit links add no data provider persistence or lifecycle owner',()=>{
  assert.doesNotMatch(finder,/\bfetch\s*\(/);
  assert.doesNotMatch(finder,/XMLHttpRequest|WebSocket|EventSource|sessionStorage|indexedDB/);
  assert.doesNotMatch(finder,/setInterval\(/);
  assert.doesNotMatch(finder,/legacy-passport-v1/);
  const routeLayer=finder.slice(finder.indexOf('function writeExhibitState'),finder.indexOf('function normalizeMyMuseum'));
  const shareStart=finder.indexOf('async function shareExhibit');
  const shareLayer=finder.slice(shareStart,finder.indexOf("\n  finder.addEventListener",shareStart));
  assert.doesNotMatch(routeLayer,/localStorage|MY_MUSEUM_KEY/,'exact-link URL state must remain storage-free');
  assert.doesNotMatch(shareLayer,/localStorage|MY_MUSEUM_KEY/,'exact-link sharing must remain storage-free');
  assert.match(finder,/localStorage\.getItem\(MY_MUSEUM_KEY\)/,'My Museum may own its bounded local collection');
  assert.match(finder,/localStorage\.setItem\(MY_MUSEUM_KEY/,'My Museum may own its bounded local collection');
  const hashListeners=(finder.match(/addEventListener\('hashchange'/g)||[]).length;
  assert.equal(hashListeners,1,'Finder must retain its single existing route listener');
});

test('share actions stay contextual while spotlight controls remain phone safe and accessible',()=>{
  assert.match(css,/\.legacy-exhibit-actions\{display:none/);
  assert.match(css,/\.legacy-finder-active \.legacy-finder-match>\.legacy-exhibit-actions,\.legacy-exhibit-focus>\.legacy-exhibit-actions\{display:flex\}/);
  assert.match(css,/legacy-exhibit-actions button,.legacy-exhibit-clear\{min-height:44px/);
  assert.match(css,/@media\(max-width:760px\)[\s\S]*legacy-exhibit-actions button,.legacy-exhibit-clear\{min-height:48px/);
  assert.match(css,/legacy-exhibit-focus:focus-visible/);
  assert.match(css,/@media\(forced-colors:active\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(finder,/data-legacy-exhibit-clear hidden>Back to full museum<\/button>/);
  assert.match(finder,/aria-label="Share Legacy exhibit:/);
});

test('exact exhibit links continue to ship through the existing Finder PWA asset',()=>{
  const sw=read('sw.js');
  assert.match(sw,/\/legacy-finder-v2\.js/);
  assert.match(sw,/\/legacy-finder-v2\.css/);
  assert.doesNotMatch(sw,/legacy-exhibit-links-v6/);
});
