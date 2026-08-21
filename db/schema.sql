-- Titans Command Center — canonical Neon/Postgres schema v0.6
-- Aligned against the live production schema on 2026-08-19.
-- Safe to run repeatedly; seed data lives in db/seed.sql.
create extension if not exists pgcrypto;

create table if not exists schema_meta (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tier text not null check (tier in ('official','media','reporter','community')),
  category text not null,
  base_url text,
  enabled boolean not null default true,
  capabilities text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists source_accounts (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id) on delete cascade,
  provider_account_id text,
  handle text,
  display_name text,
  account_type text not null default 'community',
  trust_tier text not null default 'community' check (trust_tier in ('official','media','reporter','community')),
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  unique(source_id,provider_account_id)
);
create index if not exists source_accounts_handle_idx on source_accounts(lower(handle));

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  provider_key text unique,
  abbreviation text unique not null,
  name text not null,
  city text,
  conference text,
  division text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  first_name text,
  last_name text,
  position text,
  birth_date date,
  college text,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists players_name_idx on players(lower(full_name));
create index if not exists players_position_idx on players(position);

create table if not exists player_aliases (
  id bigserial primary key,
  player_id uuid not null references players(id) on delete cascade,
  source_id uuid references sources(id) on delete cascade,
  provider_player_id text,
  alias text not null,
  unique(source_id,provider_player_id)
);
create index if not exists player_aliases_alias_idx on player_aliases(lower(alias));

create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  season int not null,
  season_type text not null,
  week int,
  kickoff timestamptz,
  home_team_id uuid references teams(id),
  away_team_id uuid references teams(id),
  venue text,
  network text,
  status text not null default 'scheduled',
  home_score int,
  away_score int,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(season,season_type,week,home_team_id,away_team_id)
);
create index if not exists games_kickoff_idx on games(kickoff);
create index if not exists games_season_idx on games(season,season_type,week);

create table if not exists provider_game_ids (
  game_id uuid not null references games(id) on delete cascade,
  source_id uuid not null references sources(id) on delete cascade,
  provider_game_id text not null,
  primary key(source_id,provider_game_id)
);

create table if not exists roster_snapshots (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id),
  player_id uuid not null references players(id),
  source_id uuid not null references sources(id),
  captured_at timestamptz not null default now(),
  jersey_number text,
  position text,
  unit text,
  roster_status text,
  depth_order int,
  experience text,
  raw_payload jsonb not null default '{}'::jsonb
);
create index if not exists roster_snapshots_lookup on roster_snapshots(team_id,captured_at desc);
create index if not exists roster_snapshots_player_idx on roster_snapshots(player_id,captured_at desc);

create table if not exists depth_chart_snapshots (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id),
  player_id uuid references players(id),
  source_id uuid not null references sources(id),
  captured_at timestamptz not null default now(),
  position_group text,
  position text,
  slot int,
  rank int,
  raw_payload jsonb not null default '{}'::jsonb
);
create index if not exists depth_chart_team_idx on depth_chart_snapshots(team_id,captured_at desc,position_group,slot,rank);

create table if not exists injury_reports (
  id uuid primary key default gen_random_uuid(),
  season int not null,
  week int,
  season_type text,
  team_id uuid not null references teams(id),
  player_id uuid references players(id),
  source_id uuid not null references sources(id),
  primary_injury text,
  secondary_injury text,
  report_status text,
  practice_status text,
  report_date date,
  captured_at timestamptz not null default now(),
  raw_payload jsonb not null default '{}'::jsonb
);
create index if not exists injury_reports_player_idx on injury_reports(player_id,captured_at desc);
create index if not exists injury_reports_team_week_idx on injury_reports(team_id,season,week,captured_at desc);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id),
  provider_transaction_id text,
  team_id uuid references teams(id),
  player_id uuid references players(id),
  transaction_type text,
  transaction_date date,
  description text,
  source_url text,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(source_id,provider_transaction_id)
);
create index if not exists transactions_team_date_idx on transactions(team_id,transaction_date desc);

create table if not exists weather_snapshots (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id) on delete cascade,
  source_id uuid references sources(id),
  observed_at timestamptz not null default now(),
  temperature_f numeric,
  wind_mph numeric,
  precipitation_probability numeric,
  condition text,
  alerts jsonb not null default '[]'::jsonb,
  raw_payload jsonb not null default '{}'::jsonb
);
create index if not exists weather_game_idx on weather_snapshots(game_id,observed_at desc);

create table if not exists standings_snapshots (
  id uuid primary key default gen_random_uuid(),
  season int not null,
  season_type text not null,
  team_id uuid not null references teams(id),
  source_id uuid not null references sources(id),
  captured_at timestamptz not null default now(),
  wins int,
  losses int,
  ties int,
  win_pct numeric,
  division_rank int,
  conference_rank int,
  points_for int,
  points_against int,
  metadata jsonb not null default '{}'::jsonb
);
create index if not exists standings_team_idx on standings_snapshots(season,season_type,team_id,captured_at desc);

create table if not exists market_snapshots (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id) on delete cascade,
  source_id uuid references sources(id),
  book text,
  captured_at timestamptz not null default now(),
  spread numeric,
  total numeric,
  moneyline_home int,
  moneyline_away int,
  raw_payload jsonb not null default '{}'::jsonb
);
create index if not exists market_game_idx on market_snapshots(game_id,captured_at desc);

create table if not exists market_odds (
  id bigserial primary key,
  game_id uuid references games(id) on delete cascade,
  source_id uuid not null references sources(id),
  provider_event_id text not null,
  provider_odd_id text not null,
  market_category text not null,
  market_name text,
  stat_id text,
  provider_entity_id text,
  entity_name text,
  player_id uuid references players(id) on delete set null,
  period_id text,
  bet_type text,
  side text,
  book text not null,
  book_id text,
  line numeric,
  price int,
  fair_line numeric,
  fair_price int,
  consensus_line numeric,
  consensus_price int,
  is_live boolean not null default false,
  is_alt boolean not null default false,
  available boolean not null default true,
  deeplink text,
  provider_updated_at timestamptz,
  captured_at timestamptz not null default now(),
  open_line numeric,
  open_price int,
  close_line numeric,
  close_price int,
  raw_payload jsonb not null default '{}'::jsonb
);
create index if not exists market_odds_game_recent_idx on market_odds(game_id,captured_at desc);
create index if not exists market_odds_provider_idx on market_odds(source_id,provider_event_id,provider_odd_id,book_id,captured_at desc);
create index if not exists market_odds_category_idx on market_odds(market_category,captured_at desc);
create index if not exists market_odds_player_idx on market_odds(player_id,captured_at desc) where player_id is not null;

create table if not exists futures_snapshots (
  id bigserial primary key,
  source_id uuid not null references sources(id),
  season int not null,
  provider_market_id text,
  market_type text not null,
  market_name text not null,
  participant_type text not null,
  participant_name text not null,
  player_id uuid references players(id) on delete set null,
  book text not null,
  book_id text,
  line numeric,
  price int,
  available boolean not null default true,
  deeplink text,
  provider_updated_at timestamptz,
  captured_at timestamptz not null default now(),
  raw_payload jsonb not null default '{}'::jsonb
);
create index if not exists futures_titans_recent_idx on futures_snapshots(season,market_type,participant_name,captured_at desc);

create table if not exists contracts (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  source_id uuid not null references sources(id),
  team_id uuid references teams(id),
  is_active boolean,
  year_signed int,
  years int,
  total_value numeric,
  apy numeric,
  guaranteed numeric,
  cap_metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  raw_payload jsonb not null default '{}'::jsonb
);
create index if not exists contracts_player_idx on contracts(player_id,captured_at desc);

create table if not exists drives (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id) on delete cascade,
  source_id uuid not null references sources(id),
  provider_drive_id text not null,
  team_id uuid references teams(id),
  drive_number int,
  started_at_game_seconds int,
  ended_at_game_seconds int,
  start_yardline text,
  end_yardline text,
  plays_count int,
  yards int,
  result text,
  raw_payload jsonb not null default '{}'::jsonb,
  unique(source_id,provider_drive_id)
);
create index if not exists drives_game_idx on drives(game_id,drive_number);

create table if not exists plays (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id) on delete cascade,
  drive_id uuid references drives(id) on delete set null,
  source_id uuid not null references sources(id),
  provider_play_id text not null,
  play_number int,
  quarter int,
  clock text,
  down int,
  ydstogo int,
  yardline text,
  posteam_id uuid references teams(id),
  defteam_id uuid references teams(id),
  description text,
  play_type text,
  yards_gained numeric,
  epa numeric,
  wp numeric,
  wpa numeric,
  success boolean,
  explosive boolean,
  raw_payload jsonb not null default '{}'::jsonb,
  unique(source_id,provider_play_id)
);
create index if not exists plays_game_number_idx on plays(game_id,play_number);
create index if not exists plays_game_epa_idx on plays(game_id,epa);
create index if not exists plays_posteam_idx on plays(posteam_id,game_id);

create table if not exists player_game_stats (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  source_id uuid references sources(id),
  stat_group text not null,
  stats jsonb not null,
  captured_at timestamptz not null default now(),
  unique(game_id,player_id,stat_group,source_id)
);
create index if not exists player_game_stats_player_idx on player_game_stats(player_id,stat_group);

create table if not exists team_game_metrics (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id) on delete cascade,
  team_id uuid not null references teams(id),
  metric_version text not null default 'v1',
  metrics jsonb not null,
  calculated_at timestamptz not null default now(),
  unique(game_id,team_id,metric_version)
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id),
  provider_event_id text,
  event_type text not null,
  headline text,
  summary text,
  source_url text,
  source_tier text not null check (source_tier in ('official','media','reporter','community')),
  is_official boolean not null default false,
  confidence numeric not null default 0.5 check (confidence >= 0 and confidence <= 1),
  topics text[] not null default '{}',
  occurred_at timestamptz,
  published_at timestamptz,
  ingested_at timestamptz not null default now(),
  raw_payload jsonb not null default '{}'::jsonb,
  unique(source_id,provider_event_id)
);
create index if not exists events_recent on events(published_at desc);
create index if not exists events_topics on events using gin(topics);
create index if not exists events_type_tier_idx on events(event_type,source_tier,published_at desc);

create table if not exists event_players (
  event_id uuid not null references events(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  primary key(event_id,player_id)
);

create table if not exists event_games (
  event_id uuid not null references events(id) on delete cascade,
  game_id uuid not null references games(id) on delete cascade,
  primary key(event_id,game_id)
);

create table if not exists sync_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id),
  job_type text not null,
  status text not null check (status in ('running','success','partial','failed')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  records_seen int not null default 0,
  records_written int not null default 0,
  error_message text,
  metadata jsonb not null default '{}'::jsonb
);
create index if not exists sync_runs_source_idx on sync_runs(source_id,started_at desc);

create table if not exists saved_filters (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  filter jsonb not null,
  alerts_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists saved_filters_user_idx on saved_filters(user_id,created_at desc);

insert into schema_meta(key,value,updated_at) values
('schema_version','0.6.0',now()),
('app_version','0.8.0',now())
on conflict(key) do update set value=excluded.value,updated_at=excluded.updated_at;
