import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../fan-enrichment-v13.js',import.meta.url),'utf8');

function nextHomeGame(games,now){
  return games
    .map((game,index)=>({game,index,kickoff:Date.parse(game?.date)}))
    .filter(row=>row.game?.homeAway==='home'&&Number.isFinite(row.kickoff)&&row.kickoff>now)
    .sort((a,b)=>a.kickoff-b.kickoff||a.index-b.index)[0]?.game||null;
}

test('Fan Hub chooses the nearest future home kickoff independent of snapshot order',()=>{
  const now=Date.parse('2026-09-01T17:00:00Z');
  const games=[
    {id:'late-home',homeAway:'home',date:'2026-10-18T17:00:00Z'},
    {id:'road',homeAway:'away',date:'2026-09-06T17:00:00Z'},
    {id:'invalid',homeAway:'home',date:'not-a-date'},
    {id:'past-home',homeAway:'home',date:'2026-08-30T17:00:00Z'},
    {id:'next-home',homeAway:'home',date:'2026-09-13T17:00:00Z'}
  ];
  assert.equal(nextHomeGame(games,now)?.id,'next-home');
  assert.equal(nextHomeGame([...games].reverse(),now)?.id,'next-home');
});

test('Fan Hub source keeps next-home chronology fail-closed on invalid dates',()=>{
  assert.match(js,/function nextHomeGame\(now=Date\.now\(\)\)/);
  assert.match(js,/kickoff:Date\.parse\(game\?\.date\)/);
  assert.match(js,/Number\.isFinite\(row\.kickoff\)&&row\.kickoff>now/);
  assert.match(js,/\.sort\(\(a,b\)=>a\.kickoff-b\.kickoff\|\|a\.index-b\.index\)\[0\]\?\.game\|\|null/);
  assert.match(js,/function attending\(\)\{\s*const g=nextHomeGame\(\)/);
  assert.doesNotMatch(js,/\.find\(x=>x\.homeAway==='home'&&Date\.parse\(x\.date\)>Date\.now\(\)\)/);
  assert.doesNotMatch(js,/nextHomeGame[\s\S]{0,500}LIVE/);
});
