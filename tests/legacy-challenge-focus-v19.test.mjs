import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync('legacy-challenge-v10.js','utf8');

test('Legacy Challenge v10.5 moves focus to the updated question heading',()=>{
  assert.match(js,/const VERSION='10\.5\.0'/);
  assert.match(js,/const focusQuestion=\(\)=>\{/);
  assert.match(js,/questionNode\.hasAttribute\('tabindex'\)/);
  assert.match(js,/questionNode\.setAttribute\('tabindex','-1'\)/);
  assert.match(js,/questionNode\.focus\(\{preventScroll:true\}\)/);
  assert.match(js,/catch\{questionNode\.focus\(\);\}/);
});

test('new questions and the final score restore focus after hiding Next',()=>{
  assert.match(js,/function renderQuestion\(\)[\s\S]*updateModeControls\(true\);\s*focusQuestion\(\);/);
  assert.match(js,/function finish\(\)[\s\S]*updateModeControls\(false\);\s*focusQuestion\(\);/);
  assert.match(js,/nextButton\.hidden=true/);
  assert.match(js,/nextButton\.focus\(\)/);
});

test('focus continuity adds no tab stop, timer, observer, storage, or network owner',()=>{
  assert.doesNotMatch(js,/setAttribute\('tabindex','(?:0|[1-9]\d*)'\)/);
  assert.doesNotMatch(js,/localStorage|sessionStorage|indexedDB/);
  assert.doesNotMatch(js,/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource/);
  assert.doesNotMatch(js,/setInterval\s*\(|setTimeout\s*\(|MutationObserver/);
  assert.match(js,/frame\+\+>=12/);
  assert.match(js,/addEventListener\('hashchange',scheduleEnsure\)/);
});