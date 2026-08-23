import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const js=read('fantasy-sleeper-intelligence-v2.js');
const search=read('smart-search-v111.js');
const sw=read('sw.js');

test('Sleeper intelligence add-on loads through the stable browser bootstrap and PWA shell',()=>{
  assert.match(search,/import\('\.\/fantasy-sleeper-intelligence-v2\.js'\)\.catch/);
  assert.match(sw,/'\/fantasy-sleeper-intelligence-v2\.js'/);
});

test('Sleeper player metadata is slim position-filtered and cached for one day',()=>{
  assert.match(js,/PLAYER_TTL=24\*60\*60\*1000/);
  assert.match(js,/POSITIONS=\['QB','RB','WR','TE','K'\]/);
  assert.match(js,/players\/nfl\?position=\$\{position\}&active=true/);
  assert.match(js,/PLAYER_KEY='titans-fantasy-sleeper-player-index-v1'/);
  assert.match(js,/Date\.now\(\)-Number\(cached\.savedAt\)<PLAYER_TTL/);
  assert.doesNotMatch(js,/sleeper\('\/players\/nfl'\)/);
});

test('Sleeper intelligence resolves the connected owner lineup without mutating the league',()=>{
  assert.match(js,/ownerTeam=\(user,rosters\)/);
  assert.match(js,/starters=new Set/);
  assert.match(js,/bench=all\.filter\(id=>!starters\.has\(id\)\)/);
  assert.match(js,/MY SLEEPER LINEUP/);
  assert.match(js,/Starters & bench/);
  assert.doesNotMatch(js,/method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)/i);
});

test('Waiver Pulse uses official trends and filters against every selected-league roster',()=>{
  assert.match(js,/players\/nfl\/trending\/add\?lookback_hours=24&limit=25/);
  assert.match(js,/players\/nfl\/trending\/drop\?lookback_hours=24&limit=15/);
  assert.match(js,/rosteredIds=rosters=>new Set/);
  assert.match(js,/!occupied\.has\(String\(row\.player_id\)\)/);
  assert.match(js,/Trending data: Sleeper/);
  assert.match(js,/unrostered here—not universally available/);
});

test('League scoring maps only exact standard half-PPR or PPR presets and keeps custom scoring honest',()=>{
  assert.match(js,/rec===1\?'ppr':rec===0\.5\?'half':rec===0\?'standard':'custom'/);
  assert.match(js,/Use \$\{scoringLabel\(mode\)\} preset/);
  assert.match(js,/custom scoring/i);
  assert.match(js,/rather than pretending to reproduce every custom rule/i);
});

test('Sleeper intelligence remains bounded and mobile-safe',()=>{
  assert.match(js,/setTimeout\(\(\)=>controller\.abort\(\),7000\)/);
  assert.match(js,/slice\(0,10\)/);
  assert.match(js,/slice\(0,6\)/);
  assert.match(js,/@media\(max-width:560px\)/);
  assert.match(js,/min-height:44px/);
});
