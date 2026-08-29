-- Titans Command Center — Cloudflare D1 bootstrap schema
-- Phase 1: portable account preferences + durable API snapshots.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS fan_user_preferences (
  user_id TEXT PRIMARY KEY,
  preferences TEXT NOT NULL DEFAULT '{}',
  schema_version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS fan_user_preferences_updated_idx
  ON fan_user_preferences(updated_at DESC);

CREATE TABLE IF NOT EXISTS api_snapshots (
  cache_key TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'titans-command-center',
  fetched_at TEXT NOT NULL,
  expires_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS api_snapshots_expiry_idx
  ON api_snapshots(expires_at);

CREATE TABLE IF NOT EXISTS d1_migration_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO d1_migration_meta(key,value,updated_at)
VALUES('schema_version','1',CURRENT_TIMESTAMP)
ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP;
