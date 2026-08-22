import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Change Intelligence late-mount recovery loads after v1.8 and is available offline',()=>{
  const html=read('index.html'),sw=read('sw.js');
  const base=html.indexOf('/change-intelligence-v18.js?v=1');
  const fix=html.indexOf('/change-intelligence-loadfix-v18.js?v=1');
  assert.ok(base>=0&&fix>base);
  assert.match(sw,/change-intelligence-loadfix-v18\.js/);
});

test('late-mount recovery is bounded and wakes the existing route lifecycle directly',()=>{
  const js=read('change-intelligence-loadfix-v18.js');
  assert.match(js,/\[120,360,900,1800,3200\]/);
  assert.match(js,/document\.querySelector\('\.v15-command-view'\)/);
  assert.match(js,/document\.querySelector\('\.v18-change-intel'\)/);
  assert.match(js,/dispatchEvent\(new Event\('hashchange'\)\)/);
  assert.doesNotMatch(js,/createComment/);
  assert.doesNotMatch(js,/MutationObserver/);
  assert.doesNotMatch(js,/setInterval/);
});
