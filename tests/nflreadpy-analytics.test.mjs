import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('nflreadpy migration stores requested situation and team metrics',()=>{
  const sql=read('db/migrations/010_nflreadpy_analytics.sql');
  for(const column of ['yardline_100','score_differential','game_seconds_remaining','offense_personnel','defense_personnel','offense_formation','defenders_in_box','no_huddle'])assert.match(sql,new RegExp(column));
  for(const metric of ['offensive_epa_per_play','defensive_epa_per_play_allowed','pace_seconds_per_play','rest_days','raw_team_stats'])assert.match(sql,new RegExp(metric));
  assert.match(sql,/create table if not exists team_week_metrics/i);
  assert.match(sql,/kaggle-nfl[\s\S]*false/i);
  assert.match(sql,/nfl-savant/);
  assert.match(sql,/pro-football-reference/);
});

test('Python analytics ingest uses nflreadpy as the primary nflverse client',()=>{
  const py=read('scripts/ingest_nflreadpy.py');
  assert.match(py,/import nflreadpy as nfl/);
  assert.match(py,/nfl\.load_pbp/);
  assert.match(py,/nfl\.load_team_stats/);
  assert.match(py,/nfl\.load_schedules/);
  assert.match(py,/nfl\.load_participation/);
  assert.match(py,/home_rest/);
  assert.match(py,/away_rest/);
  assert.match(py,/score_differential/);
  assert.match(py,/game_seconds_remaining/);
  assert.match(py,/offense_personnel/);
  assert.match(py,/defense_personnel/);
  assert.match(py,/offense_formation/);
  assert.match(py,/get_current_season\(roster=True\)/);
  assert.match(py,/set\(offense_epa\) \| set\(defense_epa\) \| set\(team_stats\)/);
  assert.doesNotMatch(py,/postgres(?:ql)?:\/\//i);
});

test('advanced analytics API exposes EPA pace rest and play situations safely',()=>{
  const api=read('src/advanced-analytics-api.mjs');
  assert.match(api,/offensiveEpaPerPlay/);
  assert.match(api,/defensiveEpaPerPlayAllowed/);
  assert.match(api,/paceSecondsPerPlay/);
  assert.match(api,/latestRestDays/);
  assert.match(api,/scoreDifferential/);
  assert.match(api,/gameSecondsRemaining/);
  assert.match(api,/offensePersonnel/);
  assert.match(api,/defensePersonnel/);
  assert.match(api,/offenseFormation/);
  assert.match(api,/coalesce\(twm\.offensive_plays,0\)>0/);
  assert.match(api,/seasonFallback/);
});

test('Stats Lab advanced analytics UI has requested situation explorer and route guards',()=>{
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

test('analytics workflow is secret-safe and scheduled',()=>{
  const workflow=read('.github/workflows/nflreadpy-ingest.yml');
  assert.match(workflow,/cron: '25 11 \* \* \*'/);
  assert.match(workflow,/DATABASE_URL: \$\{\{ secrets\.DATABASE_URL \}\}/);
  assert.match(workflow,/python scripts\/ingest_nflreadpy\.py/);
  assert.match(workflow,/requirements-analytics\.txt/);
  assert.match(workflow,/seasons="2026"/);
  assert.match(workflow,/seasons="2025,2026"/);
});

test('Cloudflare and browser shell route advanced analytics without exposing server code',()=>{
  const worker=read('cloudflare/worker.mjs'),html=read('index.html');
  assert.match(worker,/advancedAnalyticsRoute/);
  assert.match(worker,/route==='advanced-analytics'/);
  assert.match(html,/href="\/analytics-hub\.css"/);
  assert.match(html,/src="\/analytics-hub\.js"/);
});
