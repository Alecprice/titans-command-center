import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(new URL('../fan-enrichment-v13.js',import.meta.url),'utf8');
const block=source.match(/function standingsView\(\)\{[\s\S]*?\n  \}\n\n  function playoffView/)?.[0]||'';

function ranked(rows){
  const south=rows.filter(row=>row.division==='AFC South');
  const rankKey=south.length?'divisionRank':'conferenceRank';
  const pool=south.length?south:rows.filter(row=>row.conference==='AFC');
  return pool.map((row,index)=>{
    const value=Number(row?.[rankKey]);
    return {row,index,rank:Number.isInteger(value)&&value>0?value:null};
  }).sort((a,b)=>(a.rank??Number.MAX_SAFE_INTEGER)-(b.rank??Number.MAX_SAFE_INTEGER)||a.index-b.index).slice(0,8);
}

test('Fan Hub standings use explicit provider rank instead of array position',()=>{
  assert.match(block,/rankKey=south\.length\?'divisionRank':'conferenceRank'/);
  assert.match(block,/rank:Number\.isInteger\(value\)&&value>0\?value:null/);
  assert.match(block,/rank\?\?'—'/);
  assert.doesNotMatch(block,/\$\{i\+1\}/);
});

test('shuffled AFC South rows render in explicit division-rank order',()=>{
  const rows=[
    {abbreviation:'TEN',division:'AFC South',conference:'AFC',divisionRank:3,conferenceRank:9},
    {abbreviation:'HOU',division:'AFC South',conference:'AFC',divisionRank:4,conferenceRank:12},
    {abbreviation:'JAX',division:'AFC South',conference:'AFC',divisionRank:1,conferenceRank:4},
    {abbreviation:'IND',division:'AFC South',conference:'AFC',divisionRank:2,conferenceRank:7}
  ];
  const result=ranked(rows);
  assert.deepEqual(result.map(item=>item.row.abbreviation),['JAX','IND','TEN','HOU']);
  assert.deepEqual(result.map(item=>item.rank),[1,2,3,4]);
});

test('missing rank remains unknown and AFC fallback honors conference rank',()=>{
  const result=ranked([
    {abbreviation:'BUF',conference:'AFC',conferenceRank:2},
    {abbreviation:'TEN',conference:'AFC'},
    {abbreviation:'KC',conference:'AFC',conferenceRank:1}
  ]);
  assert.deepEqual(result.map(item=>item.row.abbreviation),['KC','BUF','TEN']);
  assert.deepEqual(result.map(item=>item.rank),[1,2,null]);
});
