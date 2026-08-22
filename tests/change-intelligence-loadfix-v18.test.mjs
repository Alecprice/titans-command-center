import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Change Intelligence host bridge loads after v1.8 and is available offline',()=>{
  const html=read('index.html'),sw=read('sw.js');
  const base=html.indexOf('/change-intelligence-v18.js?v=1');
  const fix=html.indexOf('/change-intelligence-loadfix-v18.js?v=2');
  assert.ok(base>=0&&fix>base);
  assert.match(sw,/change-intelligence-loadfix-v18\.js/);
});

test('host bridge maps the real Command pane to the Change Intelligence compatibility host',()=>{
  const command=read('command-intelligence-v15.js');
  const base=read('change-intelligence-v18.js');
  const fix=read('change-intelligence-loadfix-v18.js');
  assert.match(command,/class="v15-pane"/);
  assert.doesNotMatch(command,/v15-command-view/);
  assert.match(base,/document\.querySelector\('\.v15-command-view'\)/);
  assert.match(fix,/document\.querySelector\('\.v15-command > \.v15-pane'\)/);
  assert.match(fix,/classList\.add\('v15-command-view'\)/);
  assert.match(fix,/window\.TitansChangeIntelligence\?\.wake\?\.\(\)/);
  assert.match(fix,/observe\(app,\{childList:true,subtree:false\}\)/);
  assert.doesNotMatch(fix,/dispatchEvent/);
  assert.doesNotMatch(fix,/createComment/);
  assert.doesNotMatch(fix,/setInterval/);
});
