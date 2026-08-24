-- Audited 2026 preseason Week 2 result correction.
-- Source: Tennessee Titans official postgame notes / recap, 2026-08-23.
-- This migration is intentionally not auto-run by deployment.

DO $$
DECLARE
  affected integer;
BEGIN
  UPDATE games g
  SET status = 'final',
      home_score = 19,
      away_score = 16,
      metadata = COALESCE(g.metadata, '{}'::jsonb) || jsonb_build_object(
        'result_source', 'Tennessee Titans official postgame notes',
        'result_source_url', 'https://www.tennesseetitans.com/news/titans-seahawks-preseason-week-2-postgame-notes',
        'result_audited_at', '2026-08-24'
      ),
      updated_at = now()
  WHERE g.season = 2026
    AND g.season_type = 'preseason'
    AND g.week = 2
    AND g.home_team_id = (SELECT id FROM teams WHERE abbreviation = 'TEN')
    AND g.away_team_id = (SELECT id FROM teams WHERE abbreviation = 'SEA');

  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 1 THEN
    RAISE EXCEPTION 'Expected exactly one 2026 preseason Week 2 TEN-SEA game row, updated %', affected;
  END IF;
END $$;

INSERT INTO schema_meta(key, value, updated_at)
VALUES ('content_audit_at', '2026-08-24', now())
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    updated_at = EXCLUDED.updated_at;
