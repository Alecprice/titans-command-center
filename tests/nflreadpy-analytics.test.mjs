import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('nflreadpy analytics builder emits compact D1 API snapshots instead of a raw Postgres warehouse',()=>{
  const py=read('scripts/ingest_nflreadpy.py');
  const requirements=read('requirements-analytics.txt');
  assert.match(py,/import nflreadpy as nfl/);
  assert.match(py,/nfl\.load_pbp/);
  assert.match(py,/nfl\.load_team_stats/);
  assert.match(py,/nfl\.load_schedules/);
  assert.match(py,/nfl\.load_participation/);
  assert.match(py,/SNAPSHOT_SCOPE = "advanced-analytics:v1"/);
  assert.match(py,/SNAPSHOT_SOURCE = "nflreadpy-d1-snapshot"/);
  assert.match(py,/SNAPSHOT_TTL_HOURS = 36/);
  assert.match(py,/INSERT INTO api_snapshots/);
  assert.match(py,/BEGIN TRANSACTION/);
  assert.match(py,/ON CONFLICT\(cache_key\) DO UPDATE/);
  assert.match(py,/recentPlays/);
  assert.match(py,/byDown/);
  assert.match(py,/personnel/);
  assert.match(py,/rows\[:80\]/);
  assert.doesNotMatch(py,/psycopg|Jsonb|DATABASE_URL/);
  assert.doesNotMatch(py,/raw_payload|stage_nflverse_plays|insert into plays|insert into team_week_metrics/i);
  assert.doesNotMatch(requirements,/psycopg/i);
  assert.match(requirements,/nflreadpy==0\.1\.5/);
  assert.match(requirements,/polars/);
});

test('nflverse team-code adapter canonicalizes provider aliases before analytics calculations',()=>{
  const adapter=read('scripts/nflreadpy_d1_entrypoint.py');
  assert.match(adapter,/"LA": "LAR"/);
  assert.match(adapter,/"STL": "LAR"/);
  assert.match(adapter,/"SD": "LAC"/);
  assert.match(adapter,/"OAK": "LV"/);
  assert.match(adapter,/"JAC": "JAX"/);
  assert.match(adapter,/"WSH": "WAS"/);
  assert.match(adapter,/pl\.col\(column\)/);
  assert.match(adapter,/\.replace\(TEAM_ALIASES\)/);
  assert.match(adapter,/\("home_team", "away_team"\)/);
  assert.match(adapter,/\("team",\)/);
  assert.match(adapter,/\("posteam", "defteam", "home_team", "away_team"\)/);
  assert.match(adapter,/ingest\.main\(\)/);
});

test('Python D1 analytics keys match the shared Worker snapshot contract',()=>{
  const py=read('scripts/ingest_nflreadpy.py');
  const snapshots=read('src/d1-api-snapshot.mjs');
  const api=read('src/advanced-analytics-api.mjs');
  assert.match(py,/return f"\{SNAPSHOT_SCOPE\}:season=\{requested_season\}:team=\{team\}"/);
  assert.match(snapshots,/parts\.push\(`\$\{text\(key\)\.toLowerCase\(\)\}=\$\{encodeURIComponent\(normalized\)\}`\)/);
  assert.match(api,/apiSnapshotKey\('advanced-analytics:v1',\{season:requestedSeason,team\}\)/);
  assert.match(py,/teams = sorted\(TEAM_NAMES\)/);
  assert.match(py,/TEAM_NAMES/);
});

test('analytics snapshot builder preserves season fallback and situation metrics',()=>{
  const py=read('scripts/ingest_nflreadpy.py');
  for(const token of [
    'offensiveEpaPerPlay','defensiveEpaPerPlayAllowed','paceSecondsPerPlay','latestRestDays',
    'scoreDifferential','gameSecondsRemaining','offensePersonnel','defensePersonnel',
    'offenseFormation','defendersInBox','noHuddle','seasonFallback'
  ])assert.match(py,new RegExp(token));
  assert.match(py,/load_seasons = sorted\(set\(requested_seasons \+ \[max\(requested_seasons\) - 1\]\)\)/);
  assert.match(py,/data_season != requested_season/);
  assert.match(py,/row\.get\("season_type"\) == "regular"/);
  assert.match(py,/home_rest/);
  assert.match(py,/away_rest/);
});

test('advanced analytics API serves the materialized D1 contract instead of recomputing metrics',()=>{
  const api=read('src/advanced-analytics-api.mjs');
  const py=read('scripts/ingest_nflreadpy.py');
  for(const token of [
    'offensiveEpaPerPlay','defensiveEpaPerPlayAllowed','paceSecondsPerPlay','latestRestDays',
    'scoreDifferential','gameSecondsRemaining','offensePersonnel','defensePersonnel','offenseFormation','seasonFallback'
  ])assert.match(py,new RegExp(token));
  assert.match(api,/readApiSnapshot\(env,snapshotKey\)/);
  assert.match(api,/allowExpired:true/);
  assert.match(api,/sources:sources\(\)/);
  assert.doesNotMatch(api,/getSql|DATABASE_URL|team_week_metrics|\bfrom plays\b|writeApiSnapshot/i);
});

test('Stats Lab advanced analytics UI keeps the requested situation explorer and route guards',()=>{
  const js=read('analytics-hub.js'),css=read('analytics-hub.css');
  assert.match(js,/Offensive EPA \/ play/);
  assert.match(js,/Defensive EPA \/ play allowed/);
  assert.match(js,/Pace/);
  assert.match(js,/Rest days/);
  assert.match(js,/Down & distance/);
  assert.match(js,/Field position/);
  assert.match(js,/Score diff/);
  assert.match(js,/Time remaining/);
  assert.match(js,/Personnel/);
  assert.match(js,/Formation/);
  assert.match(js,/requestId!==ahSerial\|\|ahRoute\(\)!=='stats'/);
  assert.match(js,/observe\(ahApp,\{childList:true\}\)/);
  assert.doesNotMatch(js,/observe\(ahApp,\{childList:true,subtree:true\}\)/);
  assert.match(css,/@media\(max-width:390px\)/);
});

test('analytics workflow publishes directly to the existing D1 database without DATABASE_URL',()=>{
  const workflow=read('.github/workflows/nflreadpy-ingest.yml');
  assert.match(workflow,/cron: '25 11 \* \* \*'/);
  assert.match(workflow,/CLOUDFLARE_API_TOKEN: \$\{\{ secrets\.CLOUDFLARE_API_TOKEN \}\}/);
  assert.match(workflow,/CLOUDFLARE_ACCOUNT_ID: \$\{\{ secrets\.CLOUDFLARE_ACCOUNT_ID \}\}/);
  assert.match(workflow,/D1_DATABASE: titans-command-center/);
  assert.match(workflow,/node-version: '24'/);
  assert.match(workflow,/python scripts\/nflreadpy_d1_entrypoint\.py/);
  assert.match(workflow,/scripts\/nflreadpy_d1_entrypoint\.py/);
  assert.match(workflow,/available != snapshots/);
  assert.match(workflow,/Expected every generated analytics snapshot to be available/);
  assert.match(workflow,/npx --yes wrangler@4 d1 execute "\$D1_DATABASE" --remote --file "\$NFLREADPY_SQL_OUT"/);
  assert.match(workflow,/Verify Tennessee analytics snapshot in D1/);
  assert.match(workflow,/nflreadpy-d1-snapshot/);
  assert.match(workflow,/seasons="2026"/);
  assert.match(workflow,/seasons="2025,2026"/);
  assert.doesNotMatch(workflow,/DATABASE_URL|psycopg|Verify warehouse rows|Require database secret/);
});

test('D1 publish strips only the unsupported manual transaction wrapper before Wrangler execution',()=>{
  const workflow=read('.github/workflows/nflreadpy-ingest.yml');
  assert.match(workflow,/wrapper_statements = \{'BEGIN TRANSACTION;', 'COMMIT;'\}/);
  assert.match(workflow,/cleaned_lines = \[line for line in original_sql\.splitlines\(\) if line\.strip\(\)\.upper\(\) not in wrapper_statements\]/);
  assert.match(workflow,/unsupported manual transaction statement/);
  assert.match(workflow,/INSERT INTO api_snapshots/);
  assert.match(workflow,/ON CONFLICT\(cache_key\) DO UPDATE/);
  assert.match(workflow,/re\.fullmatch\(r'advanced-analytics:v1:season=\\d\{4\}:team=TEN', target\)/);
  assert.match(workflow,/d1SqlBytes/);
});

test('Cloudflare and browser shell route advanced analytics without exposing server code',()=>{
  const worker=read('cloudflare/worker.mjs'),html=read('index.html'),sw=read('sw.js');
  assert.match(worker,/advancedAnalyticsRoute/);
  assert.match(worker,/route==='advanced-analytics'/);
  assert.match(html,/href="\/analytics-hub\.css\?v=30"/);
  assert.match(html,/src="\/analytics-hub\.js\?v=30"/);
  assert.match(sw,/const CACHE = 'titans-cc-brand-2026-v\d+'/);
  assert.match(sw,/\/analytics-hub\.css/);
  assert.match(sw,/\/analytics-hub\.js/);
});

test('production gate validates D1 analytics API data and the real Stats Lab browser panel',()=>{
  const workflow=read('.github/workflows/cloudflare-deploy.yml');
  const production=read('scripts/advanced-analytics-regression.mjs');
  const browser=read('scripts/analytics-browser-smoke.py');
  const resilient=read('scripts/analytics-browser-smoke-resilient.py');
  assert.match(workflow,/advanced-analytics-regression\.mjs/);
  assert.match(workflow,/analytics-browser-smoke-resilient\.py/);
  assert.match(resilient,/analytics-browser-smoke\.py/);
  assert.match(workflow,/ANALYTICS_BROWSER_OUTCOME/);
  assert.match(workflow,/Advanced analytics browser regression/);
  assert.match(production,/\/api\/advanced-analytics\?season=2026&team=TEN/);
  assert.match(production,/cloudflare-d1/);
  assert.match(production,/nflreadpy-d1-snapshot/);
  assert.match(production,/Offensive EPA\/play is missing/);
  assert.match(production,/No recent play contains a personnel package/);
  assert.match(browser,/def read_analytics\(\):/);
  assert.match(browser,/advanced-analytics-hub \.ah-metrics/);
  assert.match(browser,/Down & distance/);
  assert.match(browser,/Field position/);
  assert.match(browser,/Score diff/);
  assert.match(browser,/Time remaining/);
  assert.match(browser,/Personnel/);
  assert.match(browser,/Formation/);
});
