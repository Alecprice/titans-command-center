import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../legacy-trails-v4.js',import.meta.url),'utf8');

test('Legacy Trails move keyboard focus with the visual destination',()=>{
  assert.match(js,/const TRAIL_VERSION='4\.2\.0'/);
  assert.match(js,/function focusTrailDestination\(page,target\)/);
  assert.match(js,/target\.dataset\.legacyTrailFocus='true'/);
  assert.match(js,/if\(!target\.hasAttribute\('tabindex'\)\)/);
  assert.match(js,/target\.setAttribute\('tabindex','-1'\)/);
  assert.match(js,/target\.focus\(\{preventScroll:true\}\)/);
  assert.match(js,/catch\{target\.focus\(\);\}/);
  assert.match(js,/target\.scrollIntoView\(\{behavior:reduced\?'auto':'smooth',block:'center'\}\);\s*focusTrailDestination\(page,target\)/);
});

test('Trail destination focus is temporary and visibly accessible',()=>{
  assert.match(js,/function clearTrailDestinationFocus\(page\)/);
  assert.match(js,/page\.querySelectorAll\('\[data-legacy-trail-focus\]'\)/);
  assert.match(js,/node\.removeAttribute\('tabindex'\)/);
  assert.match(js,/delete node\.dataset\.legacyTrailTabindexAdded/);
  assert.match(js,/const deactivate=\([^]*?clearTrailDestinationFocus\(page\)/);
  assert.match(js,/\.legacy-finder-match\[data-legacy-trail-focus\]:focus-visible\{outline:3px solid/);
  assert.match(js,/forced-colors:active[^\n]*\.legacy-finder-match\[data-legacy-trail-focus\]:focus-visible\{outline:3px solid Highlight\}/);
});

test('Trail focus handoff does not create another data or lifecycle owner',()=>{
  assert.doesNotMatch(js,/\bfetch\s*\(/);
  assert.doesNotMatch(js,/\bsetTimeout\s*\(/);
  assert.doesNotMatch(js,/\bsetInterval\s*\(/);
  assert.doesNotMatch(js,/\bMutationObserver\b/);
  assert.doesNotMatch(js,/\bIntersectionObserver\b/);
  assert.doesNotMatch(js,/addEventListener\('hashchange'/);
  assert.match(js,/requestAnimationFrame\(\(\)=>scrollToMatch\(page\)\)/);
  assert.match(js,/controller\.apply\(\{q:stop\.q,scope:stop\.scope\}\)/);
  assert.match(js,/const PASSPORT_KEY='titans:legacy-passport-v1'/);
});
