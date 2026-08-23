import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../scripts/player-gameday-browser-smoke.py',import.meta.url),'utf8');

test('Player Intelligence smoke reacquires and re-clicks tabs until the selected pane settles',()=>{
  assert.match(source,/def activate_player_tab\(driver,tab,timeout=8\):/);
  assert.match(source,/document\.querySelector\(`\[data-v16-player-tab=/);
  assert.match(source,/document\.querySelector\(`\[data-v16-pane=/);
  assert.match(source,/if\(!selected\|\|!visible\)tab\.click\(\)/);
  assert.match(source,/tabConnected:tab\.isConnected/);
  assert.match(source,/paneConnected:pane\.isConnected/);
  assert.match(source,/stable>=3/);
  assert.match(source,/Player tab did not settle after DOM refresh/);
});

test('Player Intelligence smoke still validates every tab and the full Game Day contract',()=>{
  assert.match(source,/for tab in \['overview','games','trends','career','timeline'\]:/);
  assert.match(source,/activate_player_tab\(driver,tab\)/);
  assert.match(source,/Favorite did not toggle/);
  assert.match(source,/Player mobile tab targets invalid/);
  assert.match(source,/Game Day source\/tune contract failed/);
  assert.match(source,/Game Day mobile media target too small/);
  assert.match(source,/v1\.6 browser console has severe errors/);
});
