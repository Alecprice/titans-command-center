import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Fan Hub assets are loaded and available offline',()=>{
  const html=read('index.html'),sw=read('sw.js');
  assert.match(html,/fan-enrichment-v13\.css\?v=1/);
  assert.match(html,/fan-enrichment-v13\.js\?v=1/);
  assert.match(sw,/\/fan-enrichment-v13\.css/);
  assert.match(sw,/\/fan-enrichment-v13\.js/);
});

test('Fan intelligence API is Cloudflare-wired and database-backed',()=>{
  const worker=read('cloudflare/worker.mjs'),api=read('src/fan-intel-api.mjs');
  assert.match(worker,/fanIntelRoute/);
  assert.match(worker,/route==='fan-intel'/);
  for(const token of ['standings_snapshots','injury_reports','depth_chart_snapshots','contracts','drives','plays','player_game_stats'])assert.match(api,new RegExp(token));
  assert.match(api,/Cache-Control','public, s-maxage=60, stale-while-revalidate=300'/);
});

test('Fan Hub contains the requested football, fan, offseason and history experiences',()=>{
  const js=read('fan-enrichment-v13.js');
  for(const token of ['Opponent scout','Game timeline','Your prediction','Matchup simulator',"I'm going",'Injuries','Depth chart changes','Your player trends','AFC South','Playoff picture','Records watch','Season story','Team-need signals','My draft board','Contracts & free agency','Training camp checklist','Titans Time Machine','Ask Titans Command Center','Fan pulse'])assert.match(js,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(js,/fetch\('\/api\/fan-intel'/);
  assert.match(js,/localStorage\.setItem\(KEY\.predictions/);
  assert.match(js,/localStorage\.setItem\(KEY\.draft/);
  assert.doesNotMatch(js,/DATABASE_URL|PROPLINE_API_KEY|ODDS_API_IO_KEY|VAPID_PRIVATE_KEY/);
});

test('Fan Hub defaults to plain-language mobile-first navigation',()=>{
  const js=read('fan-enrichment-v13.js'),css=read('fan-enrichment-v13.css');
  assert.match(js,/mode:localStorage\.getItem\(KEY\.mode\)\|\|'simple'/);
  for(const label of ['Today','Game','Team','Season','Offseason','History'])assert.match(js,new RegExp(`'${label}'`));
  assert.match(js,/Start simple\. Open more detail only when you want it\./);
  assert.match(css,/\.v13-tabs button\{[^}]*min-height:44px/);
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/touch-action:manipulation/);
  assert.match(css,/prefers-reduced-motion:reduce/);
});

test('injury and scenario language avoids overclaiming',()=>{
  const js=read('fan-enrichment-v13.js');
  assert.match(js,/That does not mean zero injuries/);
  assert.match(js,/official statuses/);
  assert.match(js,/scenario toy, not a prediction model/);
  assert.match(js,/Depth signal only — not a scouting grade/);
  assert.match(js,/Exact clinching scenarios will only be shown when the underlying standings and tiebreaker inputs are available/);
});
