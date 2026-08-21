import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('iPhone home-screen helper is loaded and available offline',()=>{
  const html=read('index.html'),sw=read('sw.js');
  assert.match(html,/src="\/ios-home-screen\.js\?v=1"/);
  assert.match(sw,/\/ios-home-screen\.js/);
});

test('iPhone setup button opens an actionable Safari guide instead of relying on beforeinstallprompt',()=>{
  const js=read('ios-home-screen.js');
  assert.match(js,/data-onboard-install/);
  assert.match(js,/iPad\|iPhone\|iPod/);
  assert.match(js,/display-mode: standalone/);
  assert.match(js,/Tap Share/);
  assert.match(js,/Add to Home Screen/);
  assert.match(js,/Tap “Add”/);
  assert.match(js,/stopImmediatePropagation/);
  assert.match(js,/addEventListener\('click',[\s\S]*true\);/);
});

test('iPhone setup guide remains mobile-friendly and accessible',()=>{
  const js=read('ios-home-screen.js');
  assert.match(js,/role="dialog"/);
  assert.match(js,/aria-modal="true"/);
  assert.match(js,/aria-labelledby="ios-home-screen-title"/);
  assert.match(js,/min-height:48px/);
  assert.match(js,/safe-area-inset-top/);
});
