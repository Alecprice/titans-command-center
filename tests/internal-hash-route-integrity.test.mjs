import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ROOT=new URL('../',import.meta.url);
const allowedRoutes=new Set(['home','live','games','tickets','roster','transactions','stats','fantasy','markets','feed','legacy','sources','fan','media','command','player']);
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const documentAnchors=new Set([...html.matchAll(/\sid=["']([a-z0-9_-]+)["']/gi)].map(x=>x[1]));
const browserFiles=['index.html',...fs.readdirSync(ROOT).filter(name=>name.endsWith('.js'))];

test('literal browser hash links target an owned route or a real in-page anchor',()=>{
  const found=[];
  for(const file of browserFiles){
    const source=fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
    for(const match of source.matchAll(/href=["']#([a-z0-9_-]+)/gi))found.push({file,target:match[1]});
  }
  assert.ok(found.length>20,`expected broad internal-link coverage, found only ${found.length}`);
  const invalid=found.filter(({target})=>!allowedRoutes.has(target)&&!documentAnchors.has(target));
  assert.deepEqual(invalid,[],`dead internal hash targets found: ${invalid.map(x=>`${x.file} -> #${x.target}`).join(', ')}`);
  assert.ok(documentAnchors.has('app'),'#app skip target must remain a real document anchor');
});

test('route allowlist covers every primary navigation destination',()=>{
  const nav=[...html.matchAll(/data-route="([a-z0-9-]+)"/gi)].map(x=>x[1]);
  assert.ok(nav.length>=14,`expected primary/mobile route coverage, found ${nav.length}`);
  for(const route of nav)assert.ok(allowedRoutes.has(route),`navigation route #${route} is not owned by route integrity allowlist`);
});
