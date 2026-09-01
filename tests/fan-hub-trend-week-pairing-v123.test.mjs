import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(new URL('../fan-enrichment-v13.js',import.meta.url),'utf8');
const block=source.match(/function playerTrends\(\)\{[\s\S]*?\n  \}\n\n  function teamView/)?.[0]||'';

const aliases=['passing_yards','pass_yds','rushing_yards','rush_yds','receiving_yards','rec_yds','total_tackles','tackles','sacks'];
function statValue(stats){for(const key of aliases)if(stats&&stats[key]!=null&&Number.isFinite(Number(stats[key])))return Number(stats[key]);return null}
function points(rows){return rows.slice(0,5).map(row=>({week:row.week,value:statValue(row.stats)})).filter(point=>point.value!=null)}

test('Fan Hub trend bars keep week and value on the same point',()=>{
  assert.match(block,/points=list\.slice\(0,5\)\.map\(r=>\(\{week:r\.week,value:statValue\(r\.stats,/);
  assert.match(block,/filter\(point=>point\.value!=null\)/);
  assert.match(block,/points\.map\(point=>/);
  assert.match(block,/esc\(point\.week\?\?''\)/);
  assert.doesNotMatch(block,/list\[i\]\?\.week/);
});

test('discarding an unsupported stat row cannot relabel the next value',()=>{
  const result=points([
    {week:1,stats:{targets:7}},
    {week:2,stats:{rushing_yards:100}},
    {week:3,stats:{rushing_yards:64}}
  ]);
  assert.deepEqual(result,[{week:2,value:100},{week:3,value:64}]);
});
