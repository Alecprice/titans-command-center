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

test('late-mount recovery is bounded and wakes only Change Intelligence',()=>{
  const base=read('change-intelligence-v18.js');
  const fix=read('change-intelligence-loadfix-v18.js');
  assert.match(base,/window\.TitansChangeIntelligence=Object\.freeze\(\{wake\(\)/);
  assert.match(base,/queueMicrotask\(watchView\)/);
  assert.match(fix,/\[120,360,900,1800,3200\]/);
  assert.match(fix,/document\.querySelector\('\.v15-command-view'\)/);
  assert.match(fix,/document\.querySelector\('\.v18-change-intel'\)/);
  assert.match(fix,/window\.TitansChangeIntelligence\?\.wake\?\.\(\)/);
  assert.doesNotMatch(fix,/dispatchEvent/);
  assert.doesNotMatch(fix,/createComment/);
  assert.doesNotMatch(fix,/MutationObserver/);
  assert.doesNotMatch(fix,/setInterval/);
});
