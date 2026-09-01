import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const source=fs.readFileSync(new URL('../player-intelligence-v16.js',import.meta.url),'utf8');
const deployWorkflow=fs.readFileSync(new URL('../.github/workflows/cloudflare-deploy.yml',import.meta.url),'utf8');
const fallbackWorkflow=fs.readFileSync(new URL('../.github/workflows/player-preseason-fallback-production.yml',import.meta.url),'utf8');
const browserSmoke=fs.readFileSync(new URL('../scripts/player-preseason-fallback-browser-smoke.py',import.meta.url),'utf8');
const resilientRunner=fs.readFileSync(new URL('../scripts/player-gameday-browser-smoke-resilient.py',import.meta.url),'utf8');

test('Player Intelligence loads the verified preseason feed only as a missing-warehouse fallback',()=>{
  assert.match(source,/preseasonPromise/);
  assert.match(source,/fetch\('\/api\/preseason-stats'/);
  assert.match(source,/function applyPreseasonFallback\(profile,preseason\)/);
  assert.match(source,/arr\(profile\.stats\)\.length\|\|!preseason\?\.ok/);
  assert.match(source,/String\(item\?\.id\|\|''\).*String\(player\.id\|\|''\)/s);
  assert.match(source,/slug\(item\?\.name\)===slug\(player\.name\)/);
  assert.match(source,/mode:'official-preseason-fallback'/);
  assert.match(source,/seasonType:'preseason'/);
  assert.match(source,/renderLayer\(applyPreseasonFallback\(profile,preseason\)/);
});

test('preseason fallback keeps source and season context explicit',()=>{
  assert.match(source,/\$\{context\.season\|\|2026\} Preseason · official fallback/);
  assert.match(source,/They are not regular-season totals\./);
  assert.match(source,/Official fallback/);
  assert.match(source,/verified official preseason rows/i);
  assert.match(source,/source:row\.source\|\|preseason\.statsSource/);
  assert.match(source,/sourceUrl:row\.sourceUrl\|\|''/);
  assert.match(source,/fallback:true/);
});

test('preseason adapter only maps fields actually present and does not invent targets',()=>{
  assert.match(source,/for\(const item of arr\(row\?\.fields\)\)/);
  assert.match(source,/const label=String\(item\?\.label\|\|''\)\.toUpperCase\(\),raw=String\(item\?\.value\?\?''\)\.trim\(\)/);
  assert.doesNotMatch(source,/targets\s*:\s*0/);
  assert.doesNotMatch(source,/TAR.*0/);
});

test('fallback shares the existing Player Intelligence lifecycle rather than adding observer churn',()=>{
  assert.equal((source.match(/new MutationObserver/g)||[]).length,1);
  assert.match(source,/const \[profile,fan,site,preseason\]=await Promise\.all/);
  assert.match(source,/preseasonData\(\)/);
});

test('normal Cloudflare release still gates the established Player Intelligence and Game Day smoke',()=>{
  assert.match(deployWorkflow,/Run Player Intelligence and Game Day browser regression[\s\S]*python scripts\/player-gameday-browser-smoke-resilient\.py/);
  assert.match(resilientRunner,/player-gameday-browser-smoke\.py/);
});

test('post-deploy fallback gate checks the exact successful Cloudflare revision before browser validation',()=>{
  assert.match(fallbackWorkflow,/workflow_run:/);
  assert.match(fallbackWorkflow,/workflows: \['Titans Cloudflare Deploy'\]/);
  assert.match(fallbackWorkflow,/github\.event\.workflow_run\.conclusion == 'success'/);
  assert.match(fallbackWorkflow,/EXPECTED_SHA: \$\{\{ github\.event\.workflow_run\.head_sha \}\}/);
  assert.match(fallbackWorkflow,/ref: \$\{\{ github\.event\.workflow_run\.head_sha \}\}/);
  assert.match(fallbackWorkflow,/python scripts\/player-preseason-fallback-browser-smoke\.py/);
  assert.match(fallbackWorkflow,/persist-credentials: false/);
});

test('preseason fallback production gate and manual smoke target the canonical public host',()=>{
  assert.match(fallbackWorkflow,/WORKER_URL: https:\/\/titans\.alecjprice\.com/);
  assert.doesNotMatch(fallbackWorkflow,/WORKER_URL: https:\/\/titans-command-center\.alecjordanprice\.workers\.dev/);
  assert.match(browserSmoke,/BASE=os\.environ\.get\('WORKER_URL','https:\/\/titans\.alecjprice\.com'\)/);
});

test('exact revision probe uses the same production-safe Node fetch contract as the main release audit',()=>{
  assert.match(fallbackWorkflow,/name: Use Node 24/);
  assert.match(fallbackWorkflow,/actions\/setup-node@820762786026740c76f36085b0efc47a31fe5020/);
  assert.match(fallbackWorkflow,/node-version: 24/);
  assert.match(fallbackWorkflow,/await fetch\(`\$\{base\}\/build-meta\.json\?expected=/);
  assert.match(fallbackWorkflow,/'User-Agent':'TitansCommandCenter-ProductionAudit\/1\.0'/);
  assert.match(fallbackWorkflow,/'Cache-Control':'no-cache, no-store'/);
  assert.match(fallbackWorkflow,/cache:'no-store'/);
  assert.match(fallbackWorkflow,/AbortSignal\.timeout\(15000\)/);
  assert.match(fallbackWorkflow,/lastCommit===expected/);
  assert.doesNotMatch(fallbackWorkflow,/urllib\.request/);
  assert.doesNotMatch(fallbackWorkflow,/urllib\.request\.urlopen/);
});

test('new production browser smoke compiles with SyntaxWarning promoted to failure',()=>{
  assert.doesNotThrow(()=>execFileSync('python',['-W','error::SyntaxWarning','-m','py_compile','scripts/player-preseason-fallback-browser-smoke.py'],{stdio:'pipe'}));
});

test('player route parser accepts either a database UUID or the audited-name route',()=>{
  assert.match(browserSmoke,/def player_query_value\(href,key\):/);
  assert.match(browserSmoke,/return parse_qs\(query\)\.get\(key,\[''\]\)\[0\]/);
  assert.match(browserSmoke,/def player_id_from_href\(href\):/);
  assert.match(browserSmoke,/def player_name_from_href\(href\):/);
  assert.match(browserSmoke,/return '#player\?id=' in raw or '#player\?name=' in raw/);
  assert.match(browserSmoke,/\.player-card\[href\*=\\"#player\?id=\\"\],\.player-card\[href\*=\\"#player\?name=\\"\]/);
  assert.match(browserSmoke,/player_route_mode='database-uuid'/);
  assert.match(browserSmoke,/player_route_mode='audited-name'/);
  assert.doesNotMatch(browserSmoke,/replace\('#','\?',1\)/);
  assert.doesNotMatch(browserSmoke,/urlparse\(/);
});

test('live fallback smoke validates explicit disclosure and visible Game Log rows',()=>{
  assert.match(browserSmoke,/Cam Ward/);
  assert.match(browserSmoke,/warehouseRows/);
  assert.match(browserSmoke,/fallback_required=player_route_mode=='audited-name' or api_context\.get\('warehouseRows',0\)==0/);
  assert.match(browserSmoke,/preseasonRows/);
  assert.match(browserSmoke,/completedGamesWithPlayerStats/);
  assert.match(browserSmoke,/completedGamesMissingPlayerStats/);
  assert.match(browserSmoke,/2026 Preseason · official fallback/);
  assert.match(browserSmoke,/They are not regular-season totals\./);
  assert.match(browserSmoke,/These are not regular-season totals\./);
  assert.match(browserSmoke,/data-v16-player-tab=\\"games\\"/);
  assert.match(browserSmoke,/data-v16-pane=\\"games\\"/);
  assert.match(browserSmoke,/getAttribute\('aria-selected'\)==='true'/);
  assert.match(browserSmoke,/fallbackRows:rows\.filter\(x=>\(x\.innerText\|\|''\)\.includes\('Official fallback'\)\)\.length/);
  assert.match(browserSmoke,/Season production is awaiting ingest\./);
  assert.match(browserSmoke,/any\(x\['h'\]<44 for x in mobile\['tabs'\]\)/);
});
