import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../gameday-v16.js',import.meta.url),'utf8');

test('explicit matched provider Final can promote the focused Titans game to postgame',()=>{
  assert.match(js,/function providerFinalGame\(eg,focus\)/);
  assert.match(js,/\/\\bfinal\\b\/i\.test\(`\$\{eg\.status\} \$\{eg\.detail\}`\)/);
  assert.match(js,/eg\.score==null\|\|eg\.opponentScore==null/);
  assert.match(js,/!providerMatchesGame\(eg,game\)/);
  assert.match(js,/const providerFinal=providerFinalGame\(eg,focus\);if\(providerFinal\)return\['postgame',providerFinal,eg\]/);
});

test('provider Final is matched to the current schedule game by opponent and kickoff proximity',()=>{
  assert.match(js,/function providerMatchesGame\(eg,g\)/);
  assert.match(js,/eg\.opponentAbbr&&g\.opponentAbbr&&eg\.opponentAbbr!==g\.opponentAbbr/);
  assert.match(js,/Math\.abs\(providerKickoff-scheduleKickoff\)<12\*3600000/);
  assert.match(js,/Number\.isFinite\(providerKickoff\)&&Number\.isFinite\(scheduleKickoff\)/);
});

test('provider Final carries verified scoreboard result into postgame while schedule data catches up',()=>{
  assert.match(js,/\.\.\.game,score:eg\.score,opponentScore:eg\.opponentScore/);
  assert.match(js,/opponentAbbr:eg\.opponentAbbr\|\|game\.opponentAbbr/);
  assert.match(js,/status:'Final'/);
  assert.match(js,/const result=g&&g\.score!=null&&g\.opponentScore!=null/);
});

test('provider Final cannot weaken provider-only LIVE or kickoff-window truth',()=>{
  assert.match(js,/const providerLiveStatus=eg=>Boolean\(eg&&\/in progress\|halftime\|end of\/i\.test/);
  const liveIndex=js.indexOf('if(providerLiveStatus(eg))');
  const finalIndex=js.indexOf('const providerFinal=providerFinalGame(eg,focus)');
  const pregameIndex=js.indexOf("if(focus.game)return['pregame',focus.game,eg]");
  assert.ok(liveIndex>=0&&finalIndex>liveIndex&&pregameIndex>finalIndex);
  assert.doesNotMatch(js,/focus\.state==='game-window'.*\['live'/s);
  assert.doesNotMatch(js,/focus\.state==='game-window'.*\['postgame'/s);
});

test('provider Final transition adds no new data or lifecycle owner',()=>{
  assert.equal((js.match(/setInterval\(/g)||[]).length,1);
  assert.equal((js.match(/new MutationObserver\(/g)||[]).length,1);
  assert.equal((js.match(/sharedJson\('\/api\/espn-scoreboard'/g)||[]).length,2);
  assert.equal((js.match(/sharedJson\('\/api\/fan-intel'/g)||[]).length,2);
  assert.doesNotMatch(js,/fetch\(['"]https?:\/\//);
});
