import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const workflow=read('.github/workflows/current-experience-browser.yml');
const runtime=read('smart-search-v111.js');
const smoke=read('scripts/smart-search-browser-smoke.py');

test('Current Experience audit exercises the canonical production front door',()=>{
  assert.match(workflow,/WORKER_URL: https:\/\/titans\.alecjprice\.com/);
  assert.doesNotMatch(workflow,/WORKER_URL: https:\/\/titans-command-center\.alecjordanprice\.workers\.dev/);
  assert.match(workflow,/EXPECTED_SHA: \$\{\{ github\.event\.workflow_run\.head_sha \}\}/);
});

test('Smart Search preserves Player Intelligence routing for database and audited fallback players',()=>{
  assert.match(runtime,/const playerHref=p=>p\?\.id\?`#player\?id=\$\{encodeURIComponent\(p\.id\)\}`:p\?\.name\?`#player\?name=\$\{encodeURIComponent\(p\.name\)\}`:'#roster'/);
  assert.match(runtime,/href:playerHref\(p\)/);
});

test('Smart Search production smoke accepts both player route modes and verifies Player Intelligence hydration',()=>{
  assert.match(smoke,/BASE=os\.environ\.get\('WORKER_URL','https:\/\/titans\.alecjprice\.com'\)/);
  assert.match(smoke,/return raw\.startswith\('#player\?id='\) or raw\.startswith\('#player\?name='\)/);
  assert.match(smoke,/location\.hash\.startsWith\('#player\?id='\)\|\|location\.hash\.startsWith\('#player\?name='\)/);
  assert.match(smoke,/audited_player_name\(player_route\)!='Cam Ward'/);
  assert.match(smoke,/document\.querySelector\('\.player-profile-rich'\)&&document\.querySelector\('\.v16-player-intel'\)/);
});

test('Smart Search production smoke records actionable failure stages and state',()=>{
  assert.match(smoke,/result=\{'ok':False,'base':BASE,'stage':'starting'/);
  for(const stage of ['desktop:geometry','desktop:player-search','desktop:player-open','desktop:player-hydration','mobile:search','console'])assert.ok(smoke.includes(`result['stage']='${stage}'`),`missing Smart Search failure stage ${stage}`);
  assert.match(smoke,/result\['hash'\]=active\.execute_script\('return location\.hash'\)/);
  assert.match(smoke,/result\['pageText'\]=active\.execute_script/);
});
