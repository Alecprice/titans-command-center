-- Titans Command Center 0.4.x market-data expansion
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

insert into sources(slug,name,tier,category,base_url,enabled,capabilities,metadata) values
('propline','PropLine','media','Market','https://prop-line.com',true,
 ARRAY['live-odds','pregame-odds','spreads','moneyline','totals','player-props','period-lines','futures']::text[],
 '{"status":"Needs free API key","method":"PropLine v1","cost":"Free / no credit card","cadence":"Quota-aware","purpose":"Primary free Titans market feed"}'::jsonb),
('odds-api-io','Odds-API.io','media','Market','https://odds-api.io',true,
 ARRAY['live-odds','pregame-odds','spreads','moneyline','totals','player-props','team-props','futures']::text[],
 '{"status":"Optional free API key","method":"Odds-API.io v3","cost":"Free / no credit card","cadence":"Quota-aware","purpose":"Secondary free NFL odds source"}'::jsonb)
on conflict (slug) do update set name=excluded.name,category=excluded.category,base_url=excluded.base_url,enabled=excluded.enabled,capabilities=excluded.capabilities,metadata=excluded.metadata,updated_at=now();

insert into schema_meta(key,value) values ('schema_version','0.4.1')
on conflict (key) do update set value=excluded.value,updated_at=now();
