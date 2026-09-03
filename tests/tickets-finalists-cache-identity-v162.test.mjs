import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../tickets-finalists-v127.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../tickets-finalists-v127.css',import.meta.url),'utf8');

test('finalists module requests the current touch-target stylesheet identity',()=>{
  assert.match(js,/tickets-finalists-v127\.css\?v=2/);
  assert.doesNotMatch(js,/tickets-finalists-v127\.css\?v=1/);
});

test('finalist and group-budget controls retain the 44px touch-target contract',()=>{
  assert.match(css,/\.tickets-finalists-v127 button\{[^}]*min-height:44px/);
  assert.match(css,/@media\(max-width:620px\)[^}]*[\s\S]*?\.tickets-finalists-v127 button\{[^}]*min-height:44px/);
});
