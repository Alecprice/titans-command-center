import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('media section is discoverable from common fan search terms',()=>{
  const js=read('media-search-v14.js');
  for(const term of ['listen','watch','radio','stream','streaming','tv','broadcast','kickoff','104\\.5','wgfx'])assert.match(js,new RegExp(term,'i'));
  assert.match(js,/href='#media'|href=\'#media\'|a\.href='#media'/);
  assert.match(js,/Listen \/ Watch/);
});

test('media search helper loads in the page and PWA shell',()=>{
  const html=read('index.html'),sw=read('sw.js');
  assert.match(html,/media-search-v14\.js\?v=1/);
  assert.match(sw,/media-search-v14\.js/);
});
