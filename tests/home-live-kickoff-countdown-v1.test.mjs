import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source=readFileSync(new URL('../home-command-v123.js',import.meta.url),'utf8');

test('Home kickoff countdown stays live without adding another data owner',()=>{
  assert.ok(source.includes(`'"':'&quot;'`),'Home escaping must preserve the complete &quot; entity');
  assert.match(source,/let clockTimer=null;/);
  assert.match(source,/const minutes=Math\.ceil\(diff\/60000\);/);
  assert.match(source,/if\(minutes<60\)return `\$\{minutes\}m to kickoff`;/);
  assert.match(source,/countdown\(game,focus\.state\|\|'none'\)/,'the countdown bucket must participate in the render signature');
  assert.match(source,/if\(route\(\)!=='home'\)return;/,'the clock must stop owning work off the Home route');
  assert.match(source,/clockTimer=setTimeout\(\(\)=>\{[\s\S]*?mount\(\);[\s\S]*?syncClock\(\);[\s\S]*?\},60000\);/,'Home should reevaluate the clock once per minute');
  assert.doesNotMatch(source,/setInterval\(/,'the Home countdown should not create an unbounded interval owner');
  assert.doesNotMatch(source,/fetch\([^)]*countdown|countdown[^\n]*fetch\(/i,'clock refresh must not create provider traffic');
});
