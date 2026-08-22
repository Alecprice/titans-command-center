-- Titans Command Center account preference storage
-- Safe to run repeatedly. Stores only allowlisted UI preferences; auth identity stays in Neon Auth.

create table if not exists fan_user_preferences (
  user_id text primary key,
  preferences jsonb not null default '{}'::jsonb,
  schema_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table fan_user_preferences
  add column if not exists preferences jsonb not null default '{}'::jsonb,
  add column if not exists schema_version integer not null default 1,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists fan_user_preferences_updated_at_idx
  on fan_user_preferences(updated_at desc);

comment on table fan_user_preferences is
  'Allowlisted Titans Command Center personalization keyed to managed-auth user id.';
comment on column fan_user_preferences.preferences is
  'JSONB containing only server-sanitized preference keys; never passwords, session tokens, or auth cookies.';
