import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const js=read('smart-search-v111.js');

const block=(start,end)=>{
  const from=js.indexOf(start);
  assert.notEqual(from,-1,`missing block start: ${start}`);
  const to=js.indexOf(end,from);
  assert.notEqual(to,-1,`missing block end: ${end}`);
  return js.slice(from,to+end.length);
};

test('TENX Smart Search opens static quick jumps before player hydration on focus',()=>{
  const focus=block("input.addEventListener('focus'","input.addEventListener('input'");
  assert.doesNotMatch(focus,/async|await load\(/);
  assert.ok(focus.indexOf('open()')<focus.indexOf('hydrateActiveQuery(query)'),'focus must open before enrichment');
});

test('TENX Smart Search opens typed static matches before player hydration',()=>{
  const input=block("input.addEventListener('input'","input.addEventListener('keydown'");
  assert.doesNotMatch(input,/async|await load\(/);
  assert.ok(input.indexOf('open()')<input.indexOf('hydrateActiveQuery(query)'),'input must render static matches before enrichment');
  assert.match(input,/state\.index=-1/);
});

test('TENX async player enrichment only repaints the same active untouched query',()=>{
  const enrich=block('function hydrateActiveQuery(query)',"input.addEventListener('focus'");
  for(const guard of ['!state.open','document.activeElement!==input','state.query!==query','input.value!==query','state.index>=0']){
    assert.ok(enrich.includes(guard),`missing enrichment guard: ${guard}`);
  }
  assert.match(enrich,/load\(\)\.then/);
  assert.match(enrich,/render\(\)/);
});

test('TENX Smart Search does not move an existing keyboard highlight when roster data arrives',()=>{
  const enrich=block('function hydrateActiveQuery(query)',"input.addEventListener('focus'");
  assert.ok(enrich.indexOf('state.index>=0')<enrich.indexOf('render()'),'keyboard selection guard must run before async repaint');
  assert.match(js,/aria-activedescendant/);
  assert.match(js,/ArrowDown/);
  assert.match(js,/ArrowUp/);
});

test('TENX refresh keeps the visible palette static-first while reusing the shared API cache',()=>{
  const refresh=block('runtime.onRefresh',\n'})();');
  assert.ok(refresh.indexOf('open()')<refresh.indexOf('hydrateActiveQuery(query)'),'refresh must repaint local search before roster enrichment');
  assert.equal((js.match(/runtime\.apiJson\('\/api\/data'/g)||[]).length,1);
  assert.doesNotMatch(js,/fetch\('/);
});

test('TENX Smart Search static-first repair introduces no new lifecycle or persistence owner',()=>{
  assert.doesNotMatch(js,/setInterval\(|setTimeout\(|new MutationObserver|localStorage|sessionStorage|WebSocket|EventSource/);
  assert.equal((js.match(/runtime\.onRoute/g)||[]).length,1);
  assert.equal((js.match(/runtime\.onRefresh/g)||[]).length,1);
});
