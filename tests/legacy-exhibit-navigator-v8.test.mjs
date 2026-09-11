import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const finder=read('legacy-finder-v2.js');
const css=read('legacy-finder-v2.css');

test('exact exhibit walkthrough follows the existing rendered museum order',()=>{
  assert.match(finder,/const exhibitOrder=\[\.\.\.index\.byExhibit\.keys\(\)\]/);
  assert.match(finder,/const position=exhibitOrder\.indexOf\(key\)/);
  assert.match(finder,/const prevKey=position>0\?exhibitOrder\[position-1\]:''/);
  assert.match(finder,/const nextKey=position<exhibitOrder\.length-1\?exhibitOrder\[position\+1\]:''/);
  assert.match(finder,/Exhibit \$\{position\+1\} of \$\{exhibitOrder\.length\} · \$\{type\} · \$\{label\}/);
  assert.doesNotMatch(finder,/exhibitOrder\[[^\]]*%[^\]]*\]/,'walkthrough must not wrap from the last exhibit to the first');
});

test('walkthrough controls reuse exact exhibit route ownership',()=>{
  assert.match(finder,/data-legacy-exhibit-prev=/);
  assert.match(finder,/data-legacy-exhibit-next=/);
  assert.match(finder,/function moveExhibit\(button\)/);
  assert.match(finder,/focusExhibit\(targetKey,\{syncUrl:true,scroll:true\}\)/);
  assert.match(finder,/writeExhibitState\(item\.dataset\.legacyExhibitKey\)/);
  assert.match(finder,/history\.replaceState\(history\.state,'',/);
  assert.doesNotMatch(finder,/location\.hash\s*=/);
  assert.doesNotMatch(finder,/pushState\(/);
});

test('walkthrough is bounded and labels unavailable directions honestly',()=>{
  assert.match(finder,/\$\{prevKey\?'':'disabled'\}/);
  assert.match(finder,/\$\{nextKey\?'':'disabled'\}/);
  assert.match(finder,/No previous Legacy exhibit/);
  assert.match(finder,/No next Legacy exhibit/);
  assert.match(finder,/if\(!targetKey\|\|button\.disabled\)return/);
  assert.match(finder,/clearExhibitNavigator\(spotlight\)/);
});

test('walkthrough adds no persistence provider or lifecycle owner',()=>{
  const start=finder.indexOf('function clearExhibitNavigator');
  const end=finder.indexOf('function apply',start);
  const layer=finder.slice(start,end);
  assert.doesNotMatch(layer,/localStorage|sessionStorage|indexedDB|MY_MUSEUM_KEY|legacy-passport-v1/);
  assert.doesNotMatch(layer,/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|setInterval\(/);
  const observers=(finder.match(/new MutationObserver/g)||[]).length;
  assert.equal(observers,1,'walkthrough must reuse the existing Finder observer');
  const hashListeners=(finder.match(/addEventListener\('hashchange'/g)||[]).length;
  assert.equal(hashListeners,1,'walkthrough must reuse the existing Finder route listener');
});

test('walkthrough composes with Save Share and existing phone touch targets',()=>{
  assert.match(finder,/actions\.insertAdjacentHTML\('afterbegin',[\s\S]*data-legacy-exhibit-prev/);
  assert.match(finder,/actions\.insertAdjacentHTML\('beforeend',[\s\S]*data-legacy-exhibit-next/);
  assert.match(finder,/data-legacy-exhibit-save/);
  assert.match(finder,/data-legacy-exhibit-share/);
  assert.match(css,/\.legacy-exhibit-actions button,.legacy-exhibit-clear\{min-height:44px/);
  assert.match(css,/@media\(max-width:760px\)[\s\S]*\.legacy-exhibit-actions button,.legacy-exhibit-clear\{min-height:48px/);
  assert.match(css,/@media\(forced-colors:active\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});

test('walkthrough ships through the existing Finder PWA asset only',()=>{
  const sw=read('sw.js');
  assert.match(sw,/\/legacy-finder-v2\.js/);
  assert.match(sw,/\/legacy-finder-v2\.css/);
  assert.doesNotMatch(sw,/legacy-exhibit-navigator-v8/);
  assert.match(finder,/page\.dataset\.legacyExhibitNavigatorReady='true'/);
});