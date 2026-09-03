import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../media-center-v14.js',import.meta.url),'utf8');

test('Home media card updates an existing card when matchup data changes',()=>{
  assert.match(js,/const signature=\[g\?\.id\|\|g\?\.date\|\|'none',g\?\.opponent\|\|g\?\.opponentAbbr\|\|'Opponent',g\?\.network\|\|'Network TBD'\]\.join\('\|'\)/);
  assert.match(js,/let card=document\.querySelector\('\.media-home-card'\)/);
  assert.match(js,/if\(card\?\.dataset\.signature===signature\)return/);
  assert.match(js,/if\(!card\)\{card=document\.createElement\('section'\);card\.className='media-home-card';hero\.insertAdjacentElement\('afterend',card\)\}/);
  assert.match(js,/card\.dataset\.signature=signature/);
  assert.doesNotMatch(js,/route\(\)!=='home'\|\|document\.querySelector\('\.media-home-card'\)/);
});

test('shared data refresh rerenders Home and Media but ignores unrelated targeted APIs',()=>{
  assert.match(js,/if\(Array\.isArray\(urls\)&&urls\.length&&!urls\.includes\('\/api\/data'\)\)return/);
  assert.match(js,/state\.loadEpoch\+=1/);
  assert.match(js,/state\.data=null/);
  assert.match(js,/state\.loading=null/);
  assert.match(js,/if\(route\(\)==='media'\|\|route\(\)==='home'\)queueMicrotask\(render\)/);
});

test('Home refresh reuses the existing shared data lifecycle without new polling',()=>{
  assert.match(js,/runtime\.apiJson\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(js,/fetch\('\/api\/data',\{cache:'no-store'/);
  assert.equal((js.match(/setInterval\(/g)||[]).length,0);
  assert.equal((js.match(/new MutationObserver\(/g)||[]).length,1);
  assert.match(js,/if\(epoch!==state\.loadEpoch\)return state\.data/);
});
