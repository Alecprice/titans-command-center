import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');
const loader=await readFile(new URL('../media-search-v14.js',import.meta.url),'utf8');
const affiliates=await readFile(new URL('../media-affiliates-v14.js',import.meta.url),'utf8');

test('installed shell explicitly precaches the full Titans Radio affiliate experience',()=>{
  assert.match(sw,/['"]\/media-search-v14\.js['"]/);
  assert.match(sw,/['"]\/media-affiliates-v14\.js['"]/);
  assert.match(sw,/['"]\/media-affiliates-v14\.css['"]/);
  assert.match(loader,/import '\.\/media-affiliates-v14\.js';/);
});

test('affiliate stylesheet cache fallback survives its versioned runtime request',()=>{
  assert.match(affiliates,/style\.href='\/media-affiliates-v14\.css\?v=3'/);
  assert.match(sw,/const SHELL_PATHS=new Set\(SHELL\.map\(path=>new URL\(path,self\.location\.origin\)\.pathname\)\)/);
  assert.match(sw,/caches\.match\(event\.request\)\.then\(cached=>cached\|\|caches\.match\(url\.pathname\)\)/);
});

test('offline media packaging does not cache live Titans API data',()=>{
  assert.match(sw,/if\(url\.pathname\.startsWith\('\/api\/'\)\)return/);
  assert.doesNotMatch(sw,/['"]\/api\/data['"]/);
  assert.doesNotMatch(sw,/['"]\/api\/scoreboard['"]/);
  assert.match(sw,/const NETWORK_FIRST=\/\\\.\(\?:js\|mjs\|css\|webmanifest\)\$\/i/);
});

test('affiliate offline support reuses the existing shell lifecycle instead of a second cache owner',()=>{
  assert.equal((sw.match(/self\.addEventListener\('install'/g)||[]).length,1);
  assert.equal((sw.match(/self\.addEventListener\('fetch'/g)||[]).length,1);
  assert.equal((sw.match(/cache\.addAll\(SHELL\)/g)||[]).length,1);
  assert.doesNotMatch(affiliates,/caches\./);
  assert.doesNotMatch(affiliates,/serviceWorker/);
});
