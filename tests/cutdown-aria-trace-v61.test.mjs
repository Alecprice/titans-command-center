import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(new URL('../scripts/player-gameday-browser-smoke.py',import.meta.url),'utf8');

test('production Cutdown smoke records the actual aria writer stack on failure',()=>{
  assert.match(source,/def install_cutdown_aria_trace\(driver\):/);
  assert.match(source,/Element\.prototype\.setAttribute/);
  assert.match(source,/data-team-room-view=\\?"cutdown\\?"/);
  assert.match(source,/new Error\('cutdown aria write'\)\.stack/);
  assert.match(source,/cutdownAriaTrace/);
});

test('diagnostic distinguishes direct aria writes from selector replacement',()=>{
  assert.match(source,/kind:'button-replaced'/);
  assert.match(source,/sameButton/);
  assert.match(source,/MutationObserver/);
});
