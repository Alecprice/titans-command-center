import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {games} from '../src/data.mjs';

const source=await readFile(new URL('../fan-enrichment-v13.js',import.meta.url),'utf8');

function dated(rows){
  return rows
    .map(row=>({row,sortAt:Date.parse(row.date)}))
    .filter(item=>Number.isFinite(item.sortAt))
    .sort((a,b)=>a.sortAt-b.sortAt)
    .map(item=>item.row);
}

test('Season Story admits only events with real timestamps',()=>{
  assert.match(source,/for\(const g of games\)\{const sortAt=Date\.parse\(g\.date\);if\(!Number\.isFinite\(sortAt\)\)continue;/);
  assert.match(source,/for\(const m of moves\.slice\(0,12\)\)\{const sortAt=Date\.parse\(m\.date\);if\(!Number\.isFinite\(sortAt\)\)continue;/);
  assert.match(source,/items\.sort\(\(a,b\)=>a\.sortAt-b\.sortAt\)/);
  assert.doesNotMatch(source,/Date\.parse\(a\.at\|\|0\)/);
});

test('TBD and bye schedule rows cannot consume chronological story slots',()=>{
  const week18=games.find(game=>game.id==='wk18');
  const bye=games.find(game=>game.status==='bye');
  assert.equal(week18?.date,null);
  assert.equal(week18?.dateTbd,true);
  assert.equal(bye?.date,null);

  const visible=dated(games);
  assert.ok(visible.length>0);
  assert.equal(visible.some(game=>game.id==='wk18'),false);
  assert.equal(visible.some(game=>game.status==='bye'),false);
  assert.ok(visible.every(game=>Number.isFinite(Date.parse(game.date))));
});
