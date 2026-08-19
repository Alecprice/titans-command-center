-- Titans Command Center - Neon/Postgres schema
-- Safe to run repeatedly on a fresh or existing database.
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
  unique(source_id, provider_account_id)
);
create index if not exists source_accounts_handle_idx on source_accounts(lower(handle));

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  provider_key text unique,
  abbreviation text not null,
  name text not null,
  city text,
  conference text,
  division text,
  metadata jsonb not null default '{}'::jsonb,
  unique(abbreviation)
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
  unique(source_id, provider_player_id)
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
  unique(season, season_type, week, home_team_id, away_team_id)
);
create index if not exists games_kickoff_idx on games(kickoff);
create index if not exists games_season_idx on games(season, season_type, week);

create table if not exists provider_game_ids (
  game_id uuid not null references games(id) on delete cascade,
  source_id uuid not null references sources(id) on delete cascade,
  provider_game_id text not null,
  primary key(source_id, provider_game_id)
);

create table if not exists roster_snapshots (
  id bigserial primary key,
  team_id uuid not null references teams(id),
  player_id uuid not null references players(id),
  source_id uuid not null references sources(id),
  snapshot_at timestamptz not null default now(),
  season int,
  jersey_number text,
  position text,
  depth_role text,
  status text,
  experience text,
  height text,
  weight int,
  raw_payload jsonb not null default '{}'::jsonb
);
create index if not exists roster_snapshots_current_idx on roster_snapshots(team_id, snapshot_at desc);
create index if not exists roster_snapshots_player_idx on roster_snapshots(player_id, snapshot_at desc);

create table if not exists depth_chart_snapshots (
  id bigserial primary key,
  team_id uuid not null references teams(id),
  source_id uuid not null references sources(id),
  snapshot_at timestamptz not null default now(),
  unit text not null,
  position_group text not null,
  rank int not null,
  player_id uuid references players(id),
  player_name_raw text,
  raw_payload jsonb not null default '{}'::jsonb
);
create index if not exists depth_chart_current_idx on depth_chart_snapshots(team_id, snapshot_at desc);

create table if not exists injury_reports (
  id bigserial primary key,
  game_id uuid references games(id) on delete set null,
  player_id uuid references players(id) on delete set null,
  source_id uuid not null references sources(id),
  reported_at timestamptz not null,
  practice_status text,
  game_status text,
  body_part text,
  description text,
  raw_payload jsonb not null default '{}'::jsonb
);
create index if not exists injury_player_idx on injury_reports(player_id, reported_at desc);
create index if not exists injury_game_idx on injury_reports(game_id, reported_at desc);

create table if not exists transactions (
  id bigserial primary key,
  source_id uuid not null references sources(id),
  provider_event_id text,
  transacted_at timestamptz not null,
  transaction_type text not null,
  description text not null,
  raw_payload jsonb not null default '{}'::jsonb,
  unique(source_id, provider_event_id)
);
create index if not exists transactions_at_idx on transactions(transacted_at desc);

create table if not exists transaction_players (
  transaction_id bigint not null references transactions(id) on delete cascade,
  player_id uuid references players(id) on delete set null,
  player_name_raw text,
  role text,
  primary key(transaction_id, player_name_raw)
);

create table if not exists weather_snapshots (
  id bigserial primary key,
  game_id uuid not null references games(id) on delete cascade,
  source_id uuid not null references sources(id),
  observed_for timestamptz not null,
  fetched_at timestamptz not null default now(),
  temperature_f numeric,
  precipitation_probability numeric,
  wind_mph numeric,
  wind_direction text,
  short_forecast text,
  raw_payload jsonb not null default '{}'::jsonb
);
create index if not exists weather_game_idx on weather_snapshots(game_id, fetched_at desc);

create table if not exists standings_snapshots (
  id bigserial primary key,
  team_id uuid not null references teams(id),
  source_id uuid not null references sources(id),
  season int not null,
  week int,
  fetched_at timestamptz not null default now(),
  wins int,
  losses int,
  ties int,
  conference_rank int,
  division_rank int,
  playoff_seed int,
  raw_payload jsonb not null default '{}'::jsonb
);
create index if not exists standings_team_idx on standings_snapshots(team_id, fetched_at desc);

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
create index if not exists market_odds_game_recent_idx on market_odds(game_id, captured_at desc);
create index if not exists market_odds_provider_idx on market_odds(source_id, provider_event_id, provider_odd_id, book_id, captured_at desc);
create index if not exists market_odds_category_idx on market_odds(market_category, captured_at desc);
create index if not exists market_odds_player_idx on market_odds(player_id, captured_at desc) where player_id is not null;

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
create index if not exists futures_titans_recent_idx on futures_snapshots(season, market_type, participant_name, captured_at desc);

create table if not exists drives (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id) on delete cascade,
  source_id uuid not null references sources(id),
  provider_drive_id text not null,
  drive_number int,
  offense_team_id uuid references teams(id),
  defense_team_id uuid references teams(id),
  start_period int,
  start_clock text,
  end_period int,
  end_clock text,
  plays int,
  yards int,
  result text,
  raw_payload jsonb not null default '{}'::jsonb,
  unique(source_id, game_id, provider_drive_id)
);
create index if not exists drives_game_idx on drives(game_id, drive_number);

create table if not exists plays (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id) on delete cascade,
  drive_id uuid references drives(id) on delete set null,
  source_id uuid not null references sources(id),
  provider_play_id text not null,
  sequence int,
  period int,
  game_clock text,
  down int,
  distance int,
  yard_line text,
  offense_team_id uuid references teams(id),
  defense_team_id uuid references teams(id),
  play_type text,
  description text,
  yards_gained numeric,
  epa numeric,
  wp numeric,
  wpa numeric,
  success boolean,
  explosive boolean,
  cpoe numeric,
  pressure boolean,
  sack boolean,
  turnover boolean,
  raw_payload jsonb not null default '{}'::jsonb,
  unique(source_id, provider_play_id)
);
create index if not exists plays_game_seq_idx on plays(game_id, sequence);
create index if not exists plays_offense_idx on plays(offense_team_id, game_id, play_type);
create index if not exists plays_defense_idx on plays(defense_team_id, game_id, play_type);

create table if not exists play_players (
  play_id uuid not null references plays(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  role text not null,
  primary key(play_id, player_id, role)
);

create table if not exists player_game_stats (
  id bigserial primary key,
  game_id uuid not null references games(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  source_id uuid not null references sources(id),
  stat_group text not null,
  stats jsonb not null,
  raw_payload jsonb not null default '{}'::jsonb,
  unique(game_id, player_id, source_id, stat_group)
);
create index if not exists player_game_stats_player_idx on player_game_stats(player_id, game_id);

create table if not exists team_game_metrics (
  id bigserial primary key,
  game_id uuid not null references games(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  metric_group text not null,
  metrics jsonb not null,
  derived_from text[] not null default '{}',
  calculated_at timestamptz not null default now(),
  unique(game_id, team_id, metric_group)
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id),
  source_account_id uuid references source_accounts(id) on delete set null,
  provider_event_id text,
  event_type text not null,
  trust_tier text not null check (trust_tier in ('official','media','reporter','community')),
  title text not null,
  summary text,
  url text,
  published_at timestamptz not null,
  topics text[] not null default '{}',
  importance smallint not null default 0,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(source_id, provider_event_id)
);
create index if not exists events_published_idx on events(published_at desc);
create index if not exists events_topics_gin on events using gin(topics);

create table if not exists event_players (
  event_id uuid not null references events(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  primary key(event_id, player_id)
);

create table if not exists event_games (
  event_id uuid not null references events(id) on delete cascade,
  game_id uuid not null references games(id) on delete cascade,
  primary key(event_id, game_id)
);

create table if not exists sync_runs (
  id bigserial primary key,
  source_id uuid references sources(id),
  job_type text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running',
  records_seen int not null default 0,
  records_written int not null default 0,
  error_message text,
  metadata jsonb not null default '{}'::jsonb
);
create index if not exists sync_runs_started_idx on sync_runs(started_at desc);

create table if not exists saved_filters (
  id uuid primary key default gen_random_uuid(),
  owner_key text not null,
  name text not null,
  filter jsonb not null,
  created_at timestamptz not null default now(),
  unique(owner_key, name)
);

insert into schema_meta(key,value) values ('schema_version','0.6.0')
on conflict (key) do update set value=excluded.value,updated_at=now();
