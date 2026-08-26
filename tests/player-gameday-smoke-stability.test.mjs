import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../scripts/player-gameday-browser-smoke.py',import.meta.url),'utf8');

test('Player Intelligence smoke re-queries controls after click before judging settled state',()=>{
  assert.match(source,/def activate_cutdown_view\(driver,timeout=8\):/);
  assert.match(source,/if\(button\.getAttribute\('aria-pressed'\)!=='true'\|\|panel\.hidden\)button\.click\(\)/);
  assert.match(source,/button=document\.querySelector\('\[data-team-room-view="cutdown"\]'\)/);
  assert.match(source,/panel=document\.querySelector\('\[data-panel="cutdown"\]'\)/);
  assert.match(source,/selected:button\?\.getAttribute\('aria-pressed'\)==='true'/);
  assert.match(source,/visible:Boolean\(panel&&!panel\.hidden\)/);
  assert.match(source,/def activate_player_tab\(driver,tab,timeout=8\):/);
  assert.match(source,/if\(tab\.getAttribute\('aria-selected'\)!=='true'\|\|pane\.hidden\)tab\.click\(\)/);
  assert.match(source,/tab=document\.querySelector\(`/);
  assert.match(source,/pane=document\.querySelector\(`/);
  assert.match(source,/selected:tab\?\.getAttribute\('aria-selected'\)==='true'/);
  assert.match(source,/visible:Boolean\(pane&&!pane\.hidden\)/);
  assert.match(source,/stable>=3/);
  assert.match(source,/Player tab did not settle after DOM refresh/);
});

test('Player Intelligence smoke still validates every tab and the full Game Day contract',()=>{
  assert.match(source,/for tab in \['overview','games','trends','career','timeline'\]:/);
  assert.match(source,/activate_player_tab\(driver,tab\)/);
  assert.match(source,/Favorite did not toggle/);
  assert.match(source,/Player mobile tab targets invalid/);
  assert.match(source,/Game Day source\/tune contract failed/);
  assert.match(source,/\.v22-today-brief\[data-game-id\]/);
  assert.match(source,/Next-game fast pass missing or incomplete during pregame/);
  assert.match(source,/gameDayFastPassGameId/);
  assert.match(source,/Next-game fast pass mobile targets invalid/);
  assert.match(source,/Game Day mobile media target too small/);
  assert.match(source,/v1\.6 browser console has severe errors/);
});
