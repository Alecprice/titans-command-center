import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const brief=read('gameday-today-v22.js');
const data=read('src/data.mjs');
const html=read('index.html');
const sw=read('sw.js');

test('next-game fast pass follows the schedule instead of one hardcoded matchup',()=>{
  assert.match(brief,/const upcoming=games=>games/);
  assert.match(brief,/kickoff>Date\.now\(\)/);
  assert.match(brief,/!\/final\|bye\/i/);
  assert.match(brief,/sort\(\(a,b\)=>Date\.parse\(a\.date\)-Date\.parse\(b\.date\)\)/);
  assert.doesNotMatch(brief,/opponentAbbr:'SEA'/);
  assert.doesNotMatch(brief,/teamDate:'2026-08-23'/);
  assert.match(brief,/runtime\.formatTeamKickoff/);
  assert.match(brief,/GAME DAY IN NASHVILLE/);
  assert.match(brief,/NEXT GAME FAST PASS/);
});

test('fast pass stays official and supports home and road games',()=>{
  assert.match(brief,/tennesseetitans\.com\/schedule/);
  assert.match(brief,/tennesseetitans\.com\/stadium\/gameday/);
  assert.match(brief,/WGFX 104\.5 FM The Zone/);
  assert.match(brief,/game\.homeAway==='home'/);
  assert.match(brief,/Road ·/);
  assert.match(brief,/Schedule facts: TennesseeTitans\.com/);
});

test('Game Day bridge preserves the kickoff matchup without inventing a live scoreboard',()=>{
  assert.match(brief,/runtime\.scheduleFocus\(games\)/);
  assert.match(brief,/focus\.state!=='game-window'/);
  assert.match(brief,/GAME WINDOW/);
  assert.match(brief,/Verification pending/);
  assert.match(brief,/trustworthy live scoreboard has not confirmed game state yet/);
  assert.match(brief,/No live score, clock, drive, or result is inferred from kickoff time alone/);
  assert.match(brief,/root\.dataset\.phase==='live'/);
  assert.match(brief,/root\.dataset\.phase==='postgame'/);
  assert.doesNotMatch(brief,/<small>LIVE<\/small>.*Verification pending/s);
});

test('game-window refresh hands control back to stable Game Day for scoreboard re-verification',()=>{
  assert.match(brief,/function refreshGameDay\(\)/);
  assert.match(brief,/v16-gameday\[data-v92-game-window\]/);
  assert.match(brief,/root\.remove\(\)/);
  assert.match(brief,/new HashChangeEvent\('hashchange'\)/);
  assert.match(brief,/runtime\.onRefresh\(refreshGameDay\)/);
});

test('fast pass mounts only inside a confirmed pregame phase',()=>{
  assert.match(brief,/function tagPregamePhase\(\)/);
  assert.match(brief,/v16-gameday\[data-phase="pregame"\]/);
  assert.match(brief,/phase\.classList\.add\('pregame'\)/);
  assert.match(brief,/const phase=tagPregamePhase\(\)/);
  assert.doesNotMatch(brief,/v16-gd-phase:not\(\.live\):not\(\.post\)\)/);
});

test('preseason fallback is final at 2-1 and the Jets are the current next-game fact',()=>{
  assert.match(data,/id:'pre2'.*status:'final'.*score:19,opponentScore:16/);
  assert.match(data,/id:'pre3'.*status:'final'.*score:15,opponentScore:24/);
  assert.match(data,/label:'Preseason',value:'2–1',delta:'L 15–24 vs CHI'/);
  assert.match(data,/label:'Next game',value:'NYJ',delta:'Sep 13 · 12 PM CDT · CBS'/);
});

test('fast pass uses shared runtime instead of another DOM observer',()=>{
  assert.match(brief,/window\.TitansRuntime/);
  assert.match(brief,/runtime\.apiJson\('\/api\/data'/);
  assert.match(brief,/runtime\.onAppRender/);
  assert.match(brief,/runtime\.onRoute/);
  assert.match(brief,/runtime\.onRefresh/);
  assert.doesNotMatch(brief,/new MutationObserver/);
});

test('fast pass stays mobile-first and accessible',()=>{
  assert.match(brief,/aria-label="Next Titans game fast pass"/);
  assert.match(brief,/@media\(max-width:759px\)/);
  assert.match(brief,/min-height:48px/);
  assert.match(brief,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(brief,/rel="noopener noreferrer"/);
});

test('fast pass loads after stable Game Day and is precached',()=>{
  const gameIndex=html.indexOf('/gameday-v16.js?v=1');
  const briefIndex=html.indexOf('/gameday-today-v22.js?v=1');
  assert.ok(gameIndex>=0&&briefIndex>gameIndex);
  assert.match(sw,/titans-cc-brand-2026-v\d+/);
  assert.match(sw,/\/gameday-today-v22\.js/);
});