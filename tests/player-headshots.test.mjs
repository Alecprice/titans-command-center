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

test('headshot release is CSP-scoped and PWA packaged',()=>{
  const html=read('index.html'),headers=read('_headers'),vercel=read('vercel.json'),sw=read('sw.js');
  assert.match(html,/href="\/headshot-polish\.css\?v=31"/);
  assert.match(html,/src="\/headshot-polish\.js\?v=31"/);
  for(const host of allowedHosts){
    assert.match(headers,new RegExp(host.replace(/\./g,'\\.')));
    assert.match(vercel,new RegExp(host.replace(/\./g,'\\.')));
  }
  assert.doesNotMatch(headers,/img-src[^;]*\shttps:\s/);
  assert.match(sw,/titans-cc-brand-2026-v31/);
  assert.match(sw,/\/headshot-polish\.css/);
  assert.match(sw,/\/headshot-polish\.js/);
  assert.doesNotMatch(sw,/\/assets\/data\/player-headshots\.json/);
});
