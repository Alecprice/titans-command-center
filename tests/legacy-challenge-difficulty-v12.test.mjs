import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(new URL('../legacy-challenge-v10.js',import.meta.url),'utf8');
const compact=value=>value.replace(/\s+/g,' ');
const diehardStart=source.indexOf('function collectDiehardQuestionBank(page){');
const diehardEnd=source.indexOf('function ensureStyle(){',diehardStart);
const diehardSource=diehardStart>=0&&diehardEnd>diehardStart?source.slice(diehardStart,diehardEnd):'';

test('Legacy Challenge exposes explicit Fan and Diehard difficulty controls',()=>{
  assert.match(source,/const MODE_META=\{/);
  assert.match(source,/fan:\{label:'Fan',description:'Standard museum clues'\}/);
  assert.match(source,/diehard:\{label:'Diehard',description:'Reverse-direction clues'\}/);
  assert.match(source,/role="group" aria-label="Challenge difficulty"/);
  assert.match(source,/data-legacy-challenge-mode="fan" aria-pressed="true"/);
  assert.match(source,/data-legacy-challenge-mode="diehard" aria-pressed="false"/);
});

test('Fan mode keeps the established museum-derived question generator unchanged',()=>{
  assert.match(source,/function collectQuestionBank\(page\)/);
  assert.match(source,/Who holds the franchise record for \$\{label\.toLowerCase\(\)\}\?/);
  assert.match(source,/Which retired number belongs to \$\{name\}\?/);
  assert.match(source,/record:\[\.\.\.new Set\(records\.map\(item=>item\.answer\)\)\]/);
  assert.match(source,/retired:\[\.\.\.new Set\(retired\.map\(item=>item\.answer\)\)\]/);
});

test('Diehard reverses only rendered Record Book and Retired Numbers facts',()=>{
  assert.match(diehardSource,/querySelectorAll\('\.legacy-record-card'\)/);
  assert.match(diehardSource,/querySelectorAll\('\.legacy-retired-card'\)/);
  assert.match(diehardSource,/What is the franchise record for \$\{label\.toLowerCase\(\)\}, held by \$\{holder\}\?/);
  assert.match(diehardSource,/Who wore retired number #\$\{number\}\?/);
  assert.match(diehardSource,/answer=clean\(card\.querySelector\(':scope>strong'\)\?\.textContent\)/);
  assert.match(diehardSource,/answer=clean\(card\.querySelector\('span'\)\?\.textContent\)/);
  assert.doesNotMatch(diehardSource,/Warren Moon|Eddie George|Derrick Henry|Steve McNair|Earl Campbell|Bruce Matthews/);
});

test('both modes require a valid five-question bank and preserve same-kind four-choice distractors',()=>{
  assert.match(source,/const diehardBank=collectDiehardQuestionBank\(page\)/);
  assert.match(source,/if\(bank\.length<ROUND_SIZE\|\|diehardBank\.length<ROUND_SIZE\)return false/);
  assert.match(diehardSource,/pools\[item\.kind\]\.filter\(value=>value!==item\.answer\)/);
  assert.match(diehardSource,/slice\(0,OPTION_COUNT-1\)/);
  assert.match(diehardSource,/shuffle\(\[item\.answer,\.\.\.distractors\]\)/);
});

test('difficulty is locked during a live round and can be selected again after completion',()=>{
  assert.match(source,/if\(round\.length&&!completed\)return/);
  assert.match(source,/button\.disabled=disabled/);
  assert.match(source,/updateModeControls\(true\)/);
  assert.match(source,/function finish\(\)\{\s*completed=true/);
  assert.match(source,/updateModeControls\(false\)/);
  assert.match(source,/roundMode=mode/);
});

test('completed score sharing keeps the mode from the completed round',()=>{
  assert.match(source,/let mode='fan',roundMode='fan'/);
  assert.match(source,/Think you can beat it\? — \$\{modeLabel\(roundMode\)\} mode\./);
  assert.match(source,/Your completed \$\{modeLabel\(roundMode\)\} score is still available to share/);
  assert.doesNotMatch(source,/localStorage|sessionStorage|indexedDB|leaderboard|global score|account sync/i);
});

test('difficulty controls remain touch friendly and accessible without a new lifecycle owner',()=>{
  const oneLine=compact(source);
  assert.match(oneLine,/\.legacy-challenge-mode\{min-height:44px/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-mode\{min-height:48px\}/);
  assert.match(source,/aria-pressed/);
  assert.match(source,/button:focus-visible\{outline:3px/);
  assert.doesNotMatch(source,/MutationObserver|setInterval\s*\(|setTimeout\s*\(/);
  assert.match(source,/addEventListener\('hashchange',scheduleEnsure\)/);
});
