import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const css=await readFile(new URL('../media-center-v14.css',import.meta.url),'utf8');

test('Watch Listen hero reads like an immersive broadcast environment',()=>{
  assert.match(css,/TENX immersive broadcast pass v128/);
  assert.match(css,/\.media-page \.media-hero\{min-height:410px/);
  assert.match(css,/repeating-linear-gradient\(90deg,transparent 0 9\.6%/);
  assert.match(css,/perspective\(480px\) rotateX\(58deg\)/);
  assert.match(css,/backdrop-filter:blur\(16px\)/);
  assert.match(css,/\.media-next::before/);
});

test('broadcast atmosphere reacts to truthful game lifecycle states',()=>{
  for(const phase of ['live','pregame','today','game-window','postgame']){
    assert.match(css,new RegExp(`media-quickstart\\[data-phase=\\"${phase}\\"\\]`));
  }
  assert.match(css,/mediaBroadcastSweep/);
  assert.match(css,/media-quickstart\[data-phase="live"\]/);
  assert.match(css,/media-quickstart\[data-phase="postgame"\]/);
});

test('Titans Radio is styled as a broadcast booth without pretending scheduled audio is live',()=>{
  assert.match(css,/\.media-page \.media-radio-dial\{/);
  assert.match(css,/\.media-page \.media-radio-dial::after/);
  assert.match(css,/mediaSignalBreath/);
  assert.match(css,/\.media-page \.media-onair i\{background:#7fb9ee/);
  assert.match(css,/data-phase="live"\]\) \.media-onair i\{background:#ef3340/);
});

test('watch and listen portals add depth without external imagery',()=>{
  assert.match(css,/\.media-page \.media-quick-watch\{/);
  assert.match(css,/\.media-page \.media-quick-listen\{/);
  assert.match(css,/\.media-page \.media-provider::after/);
  assert.match(css,/translateX\(610%\) skewX\(-18deg\)/);
  assert.doesNotMatch(css,/url\(\s*["']?https?:/i);
});

test('immersive treatment remains mobile and motion accessible',()=>{
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/\.media-page \.media-hero\{min-height:360px/);
  assert.match(css,/@media\(prefers-contrast:more\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/mediaBroadcastSweep[^}]*animation:none/);
  assert.match(css,/\.media-page \.media-provider::after[^}]*display:none/);
});
