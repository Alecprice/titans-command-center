import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const css=await readFile(new URL('../media-alternatives-v14.css',import.meta.url),'utf8');
const media=await readFile(new URL('../media-alternatives-v14.js',import.meta.url),'utf8');

test('postgame result styling covers win loss and tie states',()=>{
  for(const result of ['WIN','LOSS','TIE']){
    assert.match(css,new RegExp(`\\.media-quickstart\\[data-result="${result}"\\]\\{`));
    assert.match(css,new RegExp(`\\.media-quickstart\\[data-result="${result}"\\] \\.media-phase-postgame\\{`));
  }
});

test('postgame outcome remains explicit text and never color-only',()=>{
  assert.match(media,/const outcome=titansScore>opponentScore\?'WIN':titansScore<opponentScore\?'LOSS':'TIE'/);
  assert.match(media,/eyebrow:`FINAL · \$\{result\.outcome\}`/);
  assert.match(media,/section\.dataset\.result=result\.outcome/);
});

test('loss and tie override the default postgame indicator while win keeps Titans lime',()=>{
  assert.match(css,/\[data-result="LOSS"\] \.media-phase-postgame i\{background:#ef3340/);
  assert.match(css,/\[data-result="TIE"\] \.media-phase-postgame i\{background:#aeb8c4/);
  assert.match(css,/\.media-phase-postgame i\{background:#c4d600/);
});

test('outcome treatment stays restrained and accessibility-friendly',()=>{
  const outcomeCss=css.slice(css.indexOf('.media-quickstart[data-result="WIN"]'),css.indexOf('.media-quick-head'));
  assert.doesNotMatch(outcomeCss,/animation:/);
  assert.doesNotMatch(outcomeCss,/transform:/);
  assert.match(css,/@media\(prefers-contrast:more\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
