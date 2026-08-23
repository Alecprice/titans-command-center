import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const js=read('fantasy-command-v1.js');
const css=read('fantasy-command-v1.css');
const html=read('index.html');
const sw=read('sw.js');
const manifest=JSON.parse(read('manifest.webmanifest'));
const search=read('smart-search-v111.js');

test('Fantasy Command is a first-class discoverable app route',()=>{
  assert.match(html,/href="#fantasy" data-route="fantasy"/);
  assert.match(html,/fantasy-command-v1\.css\?v=1/);
  assert.match(html,/fantasy-command-v1\.js\?v=1/);
  assert.match(search,/\['#fantasy','Fantasy Command'/);
  assert.ok(manifest.shortcuts.some(item=>item.url==='/#fantasy'));
  assert.ok(manifest.shortcuts.some(item=>item.url==='/#transactions'&&item.short_name==='Moves'));
});

test('Fantasy Command stays available in the offline PWA shell',()=>{
  assert.match(sw,/titans-cc-brand-2026-v59/);
  assert.match(sw,/'\/fantasy-command-v1\.css'/);
  assert.match(sw,/'\/fantasy-command-v1\.js'/);
});

test('Fantasy scoring supports standard half-PPR and PPR without invented projections',()=>{
  assert.match(js,/\['standard','half','ppr'\]/);
  assert.match(js,/n\('passYds'\)\/25/);
  assert.match(js,/n\('passTd'\)\*4/);
  assert.match(js,/n\('rec'\)\*rec/);
  assert.match(js,/the app does not invent one for you/i);
  assert.doesNotMatch(js,/projectedPoints\s*[:=]\s*\d/i);
});

test('My Fantasy is local-first and bounded',()=>{
  assert.match(js,/STORE='titans-fantasy-v1'/);
  assert.match(js,/raw\.manual\.slice\(0,40\)/);
  assert.match(js,/state\.manual\.length>=40/);
  assert.match(js,/crypto\.randomUUID\(\)/);
  assert.match(js,/localStorage\.setItem\(STORE/);
});

test('Sleeper integration is read-only bounded and season-scoped',()=>{
  assert.match(js,/https:\/\/api\.sleeper\.app\/v1/);
  assert.match(js,/SEASON='2026'/);
  assert.match(js,/setTimeout\(\(\)=>controller\.abort\(\),6500\)/);
  assert.match(js,/\/user\/\$\{encodeURIComponent\(user\.user_id\)\}\/leagues\/nfl\/\$\{SEASON\}/);
  assert.match(js,/\/league\/\$\{leagueId\}\/matchups\/\$\{state\.week\}/);
  assert.match(js,/\/draft\/\$\{encodeURIComponent\(draft\.draft_id\)\}\/picks/);
  assert.match(js,/^\\d\{6,32\}\$/m);
  assert.doesNotMatch(js,/fetch\([^\n]*(?:POST|PUT|PATCH|DELETE)/i);
  assert.match(js,/Sleeper integration is read-only/i);
});

test('Fantasy UI is mobile-first and touch safe',()=>{
  assert.match(css,/@media\(max-width:560px\)/);
  assert.match(css,/min-height:44px/);
  assert.match(css,/grid-template-columns:1fr/);
  assert.match(css,/focus-visible/);
});
