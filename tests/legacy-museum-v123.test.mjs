import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('legacy route is upgraded from visual catalog to five-part fan museum',()=>{
  const js=read('legacy-polish.js');
  for(const token of ['Franchise story','Games that became franchise memory','Names stitched into the franchise','The numbers that still lead the franchise','Oilers derrick → fireball-T → The Shield'])assert.match(js,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  for(const id of ['legacy-story','legacy-moments','legacy-legends','legacy-records','legacy-identity'])assert.match(js,new RegExp(`id=\\"${id}\\"`));
  for(const name of ['George Blanda','Earl Campbell','Warren Moon','Bruce Matthews','Steve McNair','Eddie George','Chris Johnson','Derrick Henry'])assert.match(js,new RegExp(name));
});

test('legacy facts remain source-linked and preserve visual provenance audit',()=>{
  const js=read('legacy-polish.js');
  assert.match(js,/tennesseetitans\.com\/history\/historical-highlights/);
  assert.match(js,/profootballhof\.com\/teams\/tennessee-titans\/team-facts/);
  assert.match(js,/Music City Miracle/);
  assert.match(js,/2,027/);
  assert.match(js,/retiredNumbers/);
  assert.match(js,/VISUAL_AUDIT_DATE/);
  assert.match(js,/knownVisualsNotPictured/);
  assert.match(js,/Exact when verified\. Representative when it is not\./);
  assert.match(js,/rel="noopener noreferrer"/);
});

test('legacy in-page navigation is router-safe and accessible',()=>{
  const js=read('legacy-polish.js');
  assert.match(js,/data-legacy-scroll="legacy-story"/);
  assert.match(js,/scrollIntoView/);
  assert.match(js,/prefers-reduced-motion: reduce/);
  assert.match(js,/aria-pressed/);
  assert.match(js,/CSS\.escape/);
  assert.doesNotMatch(js,/href="#legacy-(?:story|moments|legends|records|identity)"/);
});

test('legacy responsive layer protects touch targets, reduced motion and phone layouts',()=>{
  const css=read('legacy-polish.css');
  assert.match(css,/\.legacy-museum-jump button\{min-height:44px/);
  assert.match(css,/\.legacy-era-filter\{min-height:44px/);
  assert.match(css,/\.archive-filter\{min-height:44px/);
  assert.match(css,/@media\(max-width:760px\)[\s\S]*\.legacy-museum-jump button\{min-height:48px\}[\s\S]*\.legacy-era-filter\{min-height:48px\}[\s\S]*\.archive-filter\{min-height:48px/);
  assert.doesNotMatch(css,/\.legacy-museum-jump button\{min-height:40px/);
  assert.doesNotMatch(css,/\.legacy-era-filter\{min-height:42px/);
  assert.doesNotMatch(css,/\.archive-filter\{min-height:40px/);
  assert.match(css,/@media\(max-width:900px\)/);
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/@media\(max-width:430px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/\.legacy-story-card\[hidden\]\{display:none\}/);
  assert.match(css,/\.archive-card\[hidden\]\{display:none\}/);
});

test('browser shell continues to load the legacy enhancement layer',()=>{
  const html=read('index.html');
  assert.match(html,/href="\/legacy-polish\.css/);
  assert.match(html,/src="\/legacy-polish\.js/);
  assert.match(html,/href="#legacy" data-route="legacy"/);
});
