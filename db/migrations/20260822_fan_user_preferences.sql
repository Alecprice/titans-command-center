-- Titans Command Center account preference storage.
-- Safe to re-run: table and index creation are idempotent.
-- This file is versioned here for review; deployment does not execute it automatically.

create table if not exists fan_user_preferences (
  user_id text primary key,
  preferences jsonb not null default '{}'::jsonb,
  schema_version integer not null default 1 check (schema_version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fan_user_preferences_object check (jsonb_typeof(preferences) = 'object')
);

create index if not exists fan_user_preferences_updated_at_idx
  on fan_user_preferences (updated_at desc);

comment on table fan_user_preferences is
  'Optional Titans Command Center account-synced preferences. Guest preferences remain browser-local.';
