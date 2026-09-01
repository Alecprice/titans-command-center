import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../premium-experience-v14.js',import.meta.url),'utf8');

test('premium experience reuses shared schedule and completed-game truth',()=>{
  assert.match(js,/import \{scheduleFocus,latestCompletedGame\} from '\.\/src\/core\.mjs';/);
  assert.match(js,/const gameFocus=\(\)=>scheduleFocus\(state\.data\?\.games\|\|\[\]\);/);
  assert.match(js,/const latestFinal=\(\)=>latestCompletedGame\(state\.data\?\.games\|\|\[\]\);/);
  assert.doesNotMatch(js,/const nextGame=\(\)=>/);
  assert.doesNotMatch(js,/\.reverse\(\)\.find\(g=>\/final/i);
});

test('What matters right now keeps the kickoff matchup with truthful copy',()=>{
  assert.match(js,/const focus=gameFocus\(\),g=focus\.game,current=focus\.state==='game-window'/);
  assert.match(js,/current\?'CURRENT MATCHUP':'NEXT GAME'/);
  assert.match(js,/current\?'Game window open':`Starts in \$\{countdown\(g\)\}`/);
});

test('premium Quick Read does not call schedule time live',()=>{
  assert.match(js,/Kickoff has passed\. Open Game Day for verified game status/);
  assert.doesNotMatch(js,/current\?'LIVE'/);
  assert.doesNotMatch(js,/Date\.parse\(g\.date\).*return.*live/is);
});

test('premium January lifecycle stays neutral without verified playoff state',()=>{
  assert.match(js,/if\(m===1\)return'POSTSEASON WINDOW'/);
  assert.doesNotMatch(js,/PLAYOFF PUSH/);
});
