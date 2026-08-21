import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Fan Hub assets are loaded and available offline',()=>{
  const html=read('index.html'),sw=read('sw.js');
  for(const name of ['fan-enrichment-v13.css','fan-enrichment-v13.js','fan-enrichment-addons-v13.css','fan-enrichment-addons-v13.js','fan-enrichment-tabfix-v13.js']){
    assert.match(html,new RegExp(name.replaceAll('.','\\.')+'\\?v=1'));
    assert.match(sw,new RegExp('/'+name.replaceAll('.','\\.')));
  }
  assert.match(html,/href="#fan" data-route="fan"/);
});

test('Fan intelligence API is Cloudflare-wired and database-backed',()=>{
  const worker=read('cloudflare/worker.mjs'),api=read('src/fan-intel-api.mjs');
  assert.match(worker,/fanIntelRoute/);
  assert.match(worker,/route==='fan-intel'/);
  for(const token of ['standings_snapshots','injury_reports','depth_chart_snapshots','contracts','drives','plays','player_game_stats'])assert.match(api,new RegExp(token));
  assert.match(api,/s-maxage=60, stale-while-revalidate=300/);
});

test('Fan Hub contains the requested football, fan, offseason and history experiences',()=>{
  const js=read('fan-enrichment-v13.js');
  for(const token of ['Opponent scout','Game timeline','Your prediction','Matchup simulator',"I'm going",'Injuries','Depth chart changes','Your player trends','AFC South','Playoff picture','Records watch','Season story','Team-need signals','My draft board','Contracts & free agency','Training camp checklist','Titans Time Machine','Ask Titans Command Center','Fan pulse'])assert.match(js,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(js,/fetch\('\/api\/fan-intel'/);
  assert.match(js,/localStorage\.setItem\(KEY\.predictions/);
  assert.match(js,/localStorage\.setItem\(KEY\.draft/);
  assert.doesNotMatch(js,/DATABASE_URL|PROPLINE_API_KEY|ODDS_API_IO_KEY|VAPID_PRIVATE_KEY/);
});

test('Fan Hub addon layer covers fan picks, roster timelines, scouting, momentum, what-if standings and year comparison',()=>{
  const js=read('fan-enrichment-addons-v13.js'),css=read('fan-enrichment-addons-v13.css');
  for(const token of ['Fan picks','Season MVP','Player of the game','My starting skill group','Quick Titans trivia','Roster movement tracker','What to watch','Game momentum','What-if standings','2025 vs 2026'])assert.match(js,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(js,/Private to this device\. No account needed\./);
  assert.match(js,/does <strong>not<\/strong> replace official NFL tiebreakers/);
  assert.match(js,/model output, not certainty/);
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/min-height:44px/);
});

test('Fan Hub addon enrichment resets when switching tabs',()=>{
  const bridge=read('fan-enrichment-tabfix-v13.js');
  assert.match(bridge,/closest\('\[data-tab\]'\)/);
  assert.match(bridge,/removeAttribute\('data-v13-addons'\)/);
  assert.match(bridge,/true\);/);
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
