import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const raw=await readFile(new URL('../media-search-v14.js',import.meta.url),'utf8');
const source=raw
  .replace(/^import .*?;\n\n/,'')
  .replace("  window.addEventListener('hashchange'","  globalThis.__mediaSearchTest={mediaIntent,affiliateHandoff,callsignHandoff};\n  window.addEventListener('hashchange'");
const sandbox={
  document:{querySelector:()=>null},
  location:{hash:'#search'},
  URLSearchParams,
  window:{addEventListener(){}},
  MutationObserver:class{observe(){}},
  queueMicrotask(){},
  setTimeout(){return 0},
  history:{replaceState(){}},
  requestAnimationFrame(){return 0},
  Event:class{},
  encodeURIComponent
};
vm.createContext(sandbox);
vm.runInContext(source,sandbox);
const {mediaIntent,affiliateHandoff,callsignHandoff}=sandbox.__mediaSearchTest;

test('bare callsigns stay case-insensitive and normalize to uppercase',()=>{
  assert.equal(mediaIntent('wikq'),true);
  assert.equal(mediaIntent('WIKQ'),true);
  assert.equal(callsignHandoff('Wikq'),'WIKQ');
  assert.equal(affiliateHandoff('wikq'),'WIKQ');
});

test('ordinary football phrases no longer become embedded radio callsigns',()=>{
  assert.equal(callsignHandoff('week 1'),'');
  assert.equal(callsignHandoff('wide receiver'),'');
  assert.equal(mediaIntent('week 1'),false);
  assert.equal(mediaIntent('wide receiver'),false);
});

test('embedded callsigns remain valid with explicit radio or frequency context',()=>{
  assert.equal(callsignHandoff('radio wikq Greeneville'),'WIKQ');
  assert.equal(callsignHandoff('WIKQ 103.1'),'WIKQ');
  assert.equal(affiliateHandoff('WIKQ 103.1'),'WIKQ');
  assert.equal(mediaIntent('station wikq Greeneville'),true);
});

test('non-radio media searches still surface Media without creating an affiliate filter',()=>{
  assert.equal(mediaIntent('watch CBS'),true);
  assert.equal(affiliateHandoff('watch CBS'),'');
});
