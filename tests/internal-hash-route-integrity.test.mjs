import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ROOT=new URL('../',import.meta.url);
const allowed=new Set(['home','live','games','roster','transactions','stats','fantasy','markets','feed','legacy','sources','fan','media','command','player']);
const browserFiles=['index.html',...fs.readdirSync(ROOT).filter(name=>name.endsWith('.js'))];

test('literal browser hash links target routes owned by the app',()=>{
  const found=[];
  for(const file of browserFiles){
    const source=fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
    for(const match of source.matchAll(/href=["']#([a-z0-9-]+)/gi))found.push({file,route:match[1]});
  }
  assert.ok(found.length>20,`expected broad internal-link coverage, found only ${found.length}`);
  const invalid=found.filter(({route})=>!allowed.has(route));
  assert.deepEqual(invalid,[],`dead internal hash routes found: ${invalid.map(x=>`${x.file} -> #${x.route}`).join(', ')}`);
});

test('route allowlist covers every primary navigation destination',()=>{
  const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const nav=[...html.matchAll(/data-route="([a-z0-9-]+)"/gi)].map(x=>x[1]);
  assert.ok(nav.length>=14,`expected primary/mobile route coverage, found ${nav.length}`);
  for(const route of nav)assert.ok(allowed.has(route),`navigation route #${route} is not owned by route integrity allowlist`);
});
