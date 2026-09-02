import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../media-alternatives-v14.js',import.meta.url),'utf8');

test('Watch Listen only promotes a final result when both scores are trustworthy',()=>{
  assert.match(js,/const scoreValue=value=>\{if\(value===null\|\|value===undefined\|\|String\(value\)\.trim\(\)===''\)return null/);
  assert.match(js,/if\(!game\|\|!\/final\/i\.test\(String\(game\.status\|\|''\)\)\)return null/);
  assert.match(js,/if\(titansScore===null\|\|opponentScore===null\)return null/);
  assert.match(js,/const outcome=titansScore>opponentScore\?'WIN':titansScore<opponentScore\?'LOSS':'TIE'/);
  assert.match(js,/label:`TEN \$\{titansScore\} · \$\{opponentAbbr\} \$\{opponentScore\}`/);
});

test('postgame phase turns verified scores into fan-readable win loss or tie copy',()=>{
  assert.match(js,/function postgamePhase\(game\)\{\s*const result=finalResult\(game\)/);
  assert.match(js,/`Titans win \$\{result\.titansScore\}–\$\{result\.opponentScore\}`/);
  assert.match(js,/`Titans fall \$\{result\.titansScore\}–\$\{result\.opponentScore\}`/);
  assert.match(js,/`Titans tie \$\{result\.titansScore\}–\$\{result\.opponentScore\}`/);
  assert.match(js,/eyebrow:`FINAL · \$\{result\.outcome\}`/);
});

test('score-missing finals fail closed to the existing truthful postgame state',()=>{
  assert.match(js,/return\{key:'postgame',eyebrow:'FINAL · POSTGAME',title:`Postgame: \$\{gameLabel\(game\)\}`/);
  assert.match(js,/const statusLabel=result\?\.label\|\|\(postgame\?'Final':game\?\.network\|\|'Network TBD'\)/);
  assert.doesNotMatch(js,/scoreValue=.*\|\|0/);
});

test('quick-start exposes deterministic result state and accessible action names',()=>{
  assert.match(js,/if\(result\)section\.dataset\.result=result\.outcome;else delete section\.dataset\.result/);
  assert.match(js,/result\?\.label\|\|'no-score'/);
  assert.match(js,/aria-label="Watch Titans coverage: \$\{esc\(watchAction\)\}"/);
  assert.match(js,/aria-label="Listen to Titans coverage: \$\{esc\(listen\.title\)\}"/);
});
