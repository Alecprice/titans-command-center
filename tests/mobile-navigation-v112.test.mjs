import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('mobile navigation polish is loaded and packaged offline',()=>{
  const html=read('index.html'),sw=read('sw.js'),runtime=read('usability-runtime.js');
  assert.match(html,/mobile-navigation-v112\.css\?v=1/);
  assert.match(sw,/titans-cc-brand-2026-v\d+/);
  assert.match(sw,/mobile-navigation-v112\.css/);
  assert.match(sw,/mobile-navigation-v112\.js/);
  assert.match(runtime,/import '\.\/mobile-navigation-v112\.js';/);
});

test('mobile top menu is safe-area aware and thumb reachable',()=>{
  const css=read('mobile-navigation-v112.css');
  assert.match(css,/top:calc\(env\(safe-area-inset-top\) \+ 8px\)/);
  assert.match(css,/left:max\(10px,env\(safe-area-inset-left\)\)/);
  assert.match(css,/width:46px!important/);
  assert.match(css,/height:46px!important/);
  assert.match(css,/z-index:65!important/);
  assert.match(css,/\.menu-button\[aria-expanded=true\]/);
});

test('bottom navigation is a six-slot floating dock with professional active states',()=>{
  const html=read('index.html'),css=read('mobile-navigation-v112.css');
  assert.match(css,/grid-template-columns:repeat\(6,minmax\(0,1fr\)\)/);
  assert.match(css,/border-radius:22px/);
  assert.match(css,/backdrop-filter:blur\(20px\)/);
  assert.match(css,/min-height:56px!important/);
  assert.match(css,/\.mobile-nav svg/);
  assert.match(css,/\.mobile-nav a\.active span/);
  assert.equal((html.match(/<svg viewBox="0 0 24 24">/g)||[]).length,6);
});

test('mobile sidebar becomes a draggable bottom sheet above the dock',()=>{
  const css=read('mobile-navigation-v112.css'),js=read('mobile-navigation-v112.js');
  assert.match(css,/bottom:calc\(var\(--pwa-dock-h\) \+ 18px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(css,/max-height:min\(72dvh,660px,var\(--pwa-viewport-h,100dvh\)\)/);
  assert.match(css,/\.sidebar\.open\{transform:translateY\(var\(--pwa-sheet-drag,0\)\)!important/);
  assert.match(css,/overscroll-behavior:contain/);
  assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(js,/pointerdown/);
  assert.match(js,/pointermove/);
  assert.match(js,/dy>=72\|\|velocity>\.55/);
  assert.match(js,/visualViewport/);
});

test('small phone and reduced-motion contracts are explicit',()=>{
  const css=read('mobile-navigation-v112.css');
  assert.match(css,/@media\(max-width:430px\)/);
  assert.match(css,/@media\(max-width:360px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
