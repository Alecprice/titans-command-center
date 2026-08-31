import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const headshots=JSON.parse(read('assets/data/player-headshots.json'));
const allowedHosts=new Set(['static.clubs.nfl.com','static.www.nfl.com','static.nfl.com','a.espncdn.com','a1.espncdn.com']);

test('nflreadpy headshot manifest has useful current Titans coverage',()=>{
  assert.equal(headshots.ok,true);
  assert.equal(headshots.team,'TEN');
  assert.ok(Number(headshots.season)>=2026);
  assert.ok(Number(headshots.rosterRows)>=80,`only ${headshots.rosterRows} roster rows`);
  assert.ok(Number(headshots.headshotCount)>=70,`only ${headshots.headshotCount} headshots`);
  assert.equal(headshots.players.length,headshots.headshotCount);
  assert.ok(Number(headshots.coveragePct)>=0&&Number(headshots.coveragePct)<=100,`invalid coverage ${headshots.coveragePct}`);
  assert.equal(headshots.players.length+(headshots.omittedPlayers||[]).length,headshots.rosterRows);
  assert.equal(Number(headshots.omittedCount),(headshots.omittedPlayers||[]).length);
  assert.equal(Object.values(headshots.omissionReasons||{}).reduce((sum,value)=>sum+Number(value||0),0),Number(headshots.omittedCount));
  const names=new Set();
  for(const player of headshots.players){
    assert.ok(player.name);
    assert.ok(player.normalizedName);
    assert.ok(!names.has(player.normalizedName),`duplicate normalized player ${player.normalizedName}`);
    names.add(player.normalizedName);
    const url=new URL(player.headshotUrl);
    assert.equal(url.protocol,'https:');
    assert.ok(allowedHosts.has(url.hostname),`unexpected headshot host ${url.hostname}`);
  }
  assert.ok(names.has('amanihooker'));
  assert.ok(names.has('jefferysimmons'));
});

test('headshot generator reports upstream coverage gaps instead of fabricating image URLs',()=>{
  const generator=read('scripts/build_player_headshots.py');
  const workflow=read('.github/workflows/player-headshots.yml');
  assert.match(generator,/omitted = \[\]/);
  assert.match(generator,/"reason": "missing-player-name"/);
  assert.match(generator,/"reason": "no-approved-headshot-url"/);
  assert.match(generator,/"coveragePct": coverage_pct/);
  assert.match(generator,/"omittedCount": len\(omitted\)/);
  assert.match(generator,/"omissionReasons": omission_reasons/);
  assert.match(generator,/"omittedPlayers": omitted/);
  assert.match(generator,/if headshot_count < 60/);
  assert.match(workflow,/headshots\+omitted_count==roster_rows/);
  assert.match(workflow,/sum\(int\(value\) for value in reasons\.values\(\)\)==omitted_count/);
  assert.match(workflow,/no-approved-headshot-url/);
  assert.match(workflow,/missing-player-name/);
});

test('headshot production regression surfaces and reconciles upstream coverage context',()=>{
  const production=read('scripts/headshot-production-regression.mjs');
  assert.match(production,/headshotCount\+omittedCount===rosterRows/);
  assert.match(production,/omittedPlayers\.length===omittedCount/);
  assert.match(production,/Object\.values\(omissionReasons\)/);
  assert.match(production,/coveragePct,/);
  assert.match(production,/omissionReasons,/);
  assert.match(production,/omittedPlayers:omittedPlayers\.map/);
  assert.match(production,/allowedOmissionReasons/);
});

test('headshot decorator covers roster, Stats Lab and rich player views without broad recursive observation',()=>{
  const js=read('headshot-polish.js');
  assert.match(js,/\.player-card/);
  assert.match(js,/\.ps-player/);
  assert.match(js,/\.player-rich-number/);
  assert.match(js,/player-photo-number/);
  assert.match(js,/image\.addEventListener\('error'/);
  assert.match(js,/static\.www\.nfl\.com/);
  assert.match(js,/observe\(hsApp,\{childList:true\}\)/);
  assert.doesNotMatch(js,/observe\(hsApp,\{childList:true,subtree:true\}\)/);
});

test('headshot browser regression isolates onboarding and follows a real roster player interaction',()=>{
  const smoke=read('scripts/headshot-browser-smoke.py');
  assert.match(smoke,/from selenium\.webdriver\.common\.by import By/);
  assert.match(smoke,/def prepare_returning_user\(driver\):/);
  assert.match(smoke,/localStorage\.setItem\('titans:v10Onboarded','1'\)/);
  assert.match(smoke,/prepare_returning_user\(driver\)/);
  assert.match(smoke,/find_element\(By\.CSS_SELECTOR,'\.player-card:has\(\.jersey\.has-headshot img\)'\)/);
  assert.match(smoke,/player_link\.click\(\)/);
  assert.match(smoke,/location\.hash\.startsWith\('#player'\)/);
  assert.match(smoke,/onboarding:Boolean\(document\.querySelector\('#v10-onboarding'\)\)/);
  assert.doesNotMatch(smoke,/location\.hash=arguments\[0\]/);
});

test('headshot release is CSP-scoped and PWA packaged',()=>{
  const html=read('index.html'),headers=read('_headers'),sw=read('sw.js');
  assert.match(html,/href="\/headshot-polish\.css\?v=31"/);
  assert.match(html,/src="\/headshot-polish\.js\?v=31"/);
  for(const host of allowedHosts){
    assert.match(headers,new RegExp(host.replace(/\./g,'\\.')));
  }
  assert.doesNotMatch(headers,/img-src[^;]*\shttps:\s/);
  assert.match(sw,/const CACHE = 'titans-cc-brand-2026-v\d+'/);
  assert.match(sw,/\/headshot-polish\.css/);
  assert.match(sw,/\/headshot-polish\.js/);
  assert.doesNotMatch(sw,/\/assets\/data\/player-headshots\.json/);
});