import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const trails=read('legacy-trails-v4.js');

test('Museum Passport derives progress only from the five existing guided trails',()=>{
  assert.match(trails,/const TOTAL_STOPS=trails\.reduce\(\(sum,trail\)=>sum\+trail\.stops\.length,0\)/);
  assert.match(trails,/Museum Passport/);
  assert.match(trails,/\$\{stamps\} \/ \$\{TOTAL_STOPS\} stamps/);
  assert.match(trails,/completedTrailCount\(passport\)/);
  assert.match(trails,/trailStampCount\(passport,trail\)/);
  assert.doesNotMatch(trails,/passport.*(?:championship|yards|record|score)/i);
});

test('Museum Passport persistence is browser-local bounded and validates every stored stop',()=>{
  assert.match(trails,/const PASSPORT_KEY='titans:legacy-passport-v1'/);
  assert.match(trails,/function validStopKey\(value\)/);
  assert.match(trails,/trail&&Number\.isInteger\(step\)&&step>=0&&step<trail\.stops\.length/);
  assert.match(trails,/new Set\(\(Array\.isArray\(value\?\.visited\)\?value\.visited:\[\]\)\.map\(validStopKey\)\.filter\(Boolean\)\)/);
  assert.match(trails,/\.slice\(0,TOTAL_STOPS\)/);
  assert.match(trails,/localStorage\.getItem\(PASSPORT_KEY\)/);
  assert.match(trails,/localStorage\.setItem\(PASSPORT_KEY,JSON\.stringify\(normalized\)\)/);
  assert.match(trails,/localStorage\.removeItem\(PASSPORT_KEY\)/);
  assert.doesNotMatch(trails,/sessionStorage/);
});

test('only guided Trail activation earns a stamp and normal Finder use leaves Passport progress alone',()=>{
  assert.match(trails,/if\(record\)passport=stampPassport\(passport,active,step\)/);
  assert.match(trails,/controller\.apply\(\{q:stop\.q,scope:stop\.scope\}\)/);
  assert.match(trails,/Guided Trail stamps only · normal Legacy searches never change progress\./);
  assert.doesNotMatch(trails,/page\.addEventListener\('input',[\s\S]{0,300}stampPassport/);
  assert.doesNotMatch(trails,/data-legacy-finder-scope[\s\S]{0,300}stampPassport/);
});

test('returning fans can continue at the next unvisited guided stop',()=>{
  assert.match(trails,/function nextPassportStop\(passport\)/);
  assert.match(trails,/preferred\?\[preferred,\.\.\.trails\.filter\(trail=>trail!==preferred\)\]:trails/);
  assert.match(trails,/!passport\.visited\.includes\(stopKey\(trail\.id,index\)\)/);
  assert.match(trails,/data-legacy-passport-continue/);
  assert.match(trails,/Continue \$\{next\.trail\.title\}/);
  assert.match(trails,/activate\(continueButton\.dataset\.trail,Number\.parseInt\(continueButton\.dataset\.step\|\|'0',10\)\)/);
});

test('Passport copy is truthful when storage is unavailable and reset is explicit',()=>{
  assert.match(trails,/Saved on this browser only/);
  assert.match(trails,/Storage unavailable · progress lasts this visit only/);
  assert.match(trails,/data-legacy-passport-reset/);
  assert.match(trails,/globalThis\.confirm\?\.\('Reset your Legacy Museum Passport on this browser\?'\)/);
  assert.match(trails,/passport=resetPassport\(\);\s*paint\(\);\s*focusPassportPrimary\(passportHost\)/);
});

test('Passport adds no provider traffic remote preference sync or lifecycle owner',()=>{
  assert.doesNotMatch(trails,/\bfetch\s*\(/);
  assert.doesNotMatch(trails,/XMLHttpRequest|WebSocket/);
  assert.doesNotMatch(trails,/account-sync-v|accountSync|syncPreferences|savePreferences|remotePreferences|TitansAccount/i);
  assert.doesNotMatch(trails,/new MutationObserver/);
  assert.doesNotMatch(trails,/setInterval/);
  assert.doesNotMatch(trails,/addEventListener\('hashchange'/);
});

test('Passport controls are accessible readable and phone safe',()=>{
  assert.match(trails,/data-legacy-passport aria-live="polite"/);
  assert.match(trails,/button\.setAttribute\('aria-label',`\$\{trail\.title\}, \$\{count\} of \$\{trail\.stops\.length\} stops stamped`\)/);
  assert.match(trails,/legacy-passport-actions button\{min-height:44px/);
  assert.match(trails,/legacy-passport-actions button\{min-height:48px/);
  assert.match(trails,/font-size:12px/);
  assert.match(trails,/prefers-reduced-motion:reduce/);
  assert.match(trails,/forced-colors:active/);
});

test('Passport ships through the existing Trails offline dependency without another shell asset',()=>{
  const sw=read('sw.js');
  assert.match(sw,/titans-cc-brand-2026-v\d+/);
  assert.match(sw,/\/legacy-trails-v4\.js/);
  assert.doesNotMatch(sw,/legacy-passport-v5\.js/);
});
