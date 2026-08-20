-- nflreadpy / nflverse analytics warehouse expansion.
-- Additive and idempotent: safe to run against the existing v0.6 schema.

alter table plays add column if not exists yardline_100 numeric;
alter table plays add column if not exists score_differential numeric;
alter table plays add column if not exists game_seconds_remaining int;
alter table plays add column if not exists offense_personnel text;
alter table plays add column if not exists defense_personnel text;
alter table plays add column if not exists offense_formation text;
alter table plays add column if not exists defenders_in_box numeric;
alter table plays add column if not exists no_huddle boolean;

create index if not exists plays_team_situation_idx
  on plays(posteam_id,down,ydstogo,game_seconds_remaining);
create index if not exists plays_defteam_situation_idx
  on plays(defteam_id,down,ydstogo,game_seconds_remaining);

create table if not exists team_week_metrics (
  id uuid primary key default gen_random_uuid(),
  season int not null,
  season_type text not null,
  week int not null,
  game_id uuid not null references games(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  source_id uuid not null references sources(id),
  offensive_epa_per_play numeric,
  defensive_epa_per_play_allowed numeric,
  pace_seconds_per_play numeric,
  offensive_plays int,
  defensive_plays int,
  rest_days int,
  raw_team_stats jsonb not null default '{}'::jsonb,
  calculated_at timestamptz not null default now(),
  unique(source_id,game_id,team_id)
);
create index if not exists team_week_metrics_team_idx
  on team_week_metrics(team_id,season,season_type,week);
create index if not exists team_week_metrics_season_idx
  on team_week_metrics(season,season_type,week);

insert into sources(slug,name,tier,category,base_url,enabled,capabilities,metadata) values
('nfl-savant','NFL Savant','media','Historical cross-check','https://nflsavant.com',true,
 ARRAY['pbp-csv','historical-cross-check']::text[],
 '{"status":"Secondary cross-check","method":"Season CSV downloads","purpose":"Validate selected historical play-by-play fields against an independent processed export"}'::jsonb),
('pro-football-reference','Pro-Football-Reference','media','Historical cross-check','https://www.pro-football-reference.com',true,
 ARRAY['box-scores','career-logs','advanced-stats','draft-history']::text[],
 '{"status":"Secondary cross-check","method":"nflreadpy PFR advanced-stat loader / permitted table exports","purpose":"Historical and advanced-stat cross-check; nflverse remains primary play-by-play source"}'::jsonb),
('kaggle-nfl','Kaggle NFL datasets','community','Historical cross-check','https://www.kaggle.com/datasets',false,
 ARRAY['historical-games','player-stats','combine']::text[],
 '{"status":"Dataset approval required","method":"Manual/versioned dataset import","purpose":"Optional historical cross-check only; dataset provenance and license must be reviewed before enabling"}'::jsonb)
on conflict(slug) do update set
  name=excluded.name,
  tier=excluded.tier,
  category=excluded.category,
  base_url=excluded.base_url,
  enabled=excluded.enabled,
  capabilities=excluded.capabilities,
  metadata=excluded.metadata,
  updated_at=now();

update sources
set capabilities = array(select distinct unnest(capabilities || ARRAY['team-stats','pbp','epa','wpa','schedules','rest-days','participation','personnel']::text[])),
    metadata = metadata || '{"analytics_role":"Primary open-data analytics source","python_client":"nflreadpy"}'::jsonb,
    updated_at = now()
where slug='nflverse';

insert into schema_meta(key,value,updated_at) values
('analytics_schema','nflreadpy-v1',now()),
('analytics_primary_source','nflverse/nflfastR via nflreadpy',now())
on conflict(key) do update set value=excluded.value,updated_at=excluded.updated_at;
