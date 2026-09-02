import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Game Day Today keeps kickoff verification inside the Game Day 3.1 shell',()=>{
  const bridge=read('gameday-today-v22.js');
  const stable=read('gameday-v16.js');

  assert.match(stable,/Game Day 3\.1 · source-aware/);
  assert.match(stable,/\$\{feedBar\(mode\)\}/);
  assert.match(stable,/data-gameday-refresh/);

  assert.match(bridge,/function verificationMarkup\(game\)/);
  assert.match(bridge,/GAME WINDOW · VERIFICATION PENDING/);
  assert.match(bridge,/will not infer a live score, clock, drive, or result until the scoreboard provider confirms game state/);
  assert.match(bridge,/phase\.insertAdjacentHTML\('beforebegin',verificationMarkup\(game\)\)/);
  assert.match(bridge,/if\(root\.dataset\.phase==='live'\)\{existing\?\.remove\(\);return false;\}/);

  assert.doesNotMatch(bridge,/root\.innerHTML\s*=\s*gameWindowMarkup/);
  assert.doesNotMatch(bridge,/data-v92-game-window/);
  assert.doesNotMatch(bridge,/Game Day 3\.0/);
  assert.doesNotMatch(bridge,/root\.remove\(\)/);
});

test('kickoff verification preserves provider-only LIVE truth',()=>{
  const stable=read('gameday-v16.js');
  const bridge=read('gameday-today-v22.js');

  assert.match(stable,/if\(eg&&\/in progress\|halftime\|end of\/i\.test\(`\$\{eg\.status\} \$\{eg\.detail\}`\)\)return\['live'/);
  assert.match(bridge,/const focus=runtime\.scheduleFocus\(games\)/);
  assert.match(bridge,/if\(focus\.state!=='game-window'\|\|!focus\.current\)/);
  assert.doesNotMatch(bridge,/5\*60\*60\*1000/);
  assert.doesNotMatch(bridge,/dataset\.phase='game-window'/);
});