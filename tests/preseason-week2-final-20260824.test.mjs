import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const sql=fs.readFileSync(new URL('../db/migrations/013_preseason_week2_final_20260824.sql',import.meta.url),'utf8');

test('Aug 24 preseason result correction targets exactly Titans-Seahawks Week 2',()=>{
  assert.match(sql,/g\.season = 2026/);
  assert.match(sql,/g\.season_type = 'preseason'/);
  assert.match(sql,/g\.week = 2/);
  assert.match(sql,/abbreviation = 'TEN'/);
  assert.match(sql,/abbreviation = 'SEA'/);
  assert.match(sql,/status = 'final'/);
  assert.match(sql,/home_score = 19/);
  assert.match(sql,/away_score = 16/);
  assert.match(sql,/GET DIAGNOSTICS affected = ROW_COUNT/);
  assert.match(sql,/affected <> 1/);
});

test('result correction preserves official provenance and advances content audit',()=>{
  assert.match(sql,/Tennessee Titans official postgame notes/);
  assert.match(sql,/titans-seahawks-preseason-week-2-postgame-notes/);
  assert.match(sql,/result_audited_at', '2026-08-24'/);
  assert.match(sql,/content_audit_at', '2026-08-24'/);
  assert.doesNotMatch(sql,/\bDROP\b|\bDELETE\b/i);
});
