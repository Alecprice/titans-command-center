-- Titans Command Center — audited bootstrap seed for schema v0.6
-- Last factual audit: 2026-08-19
--
-- This seed is intentionally small. It must never pretend to be a live roster,
-- live transaction feed, or complete schedule. Current ingestion should replace
-- and extend these dated fallback snapshots.

insert into schema_meta(key,value,updated_at) values
('schema_version','0.6.0',now()),
('app_version','0.8.0',now()),
('content_audit','2026-08-19',now()),
('market_policy','free-only-no-card',now()),
('production_app','titans-command-center',now())
on conflict(key) do update set value=excluded.value,updated_at=excluded.updated_at;

insert into sources(slug,name,tier,category,base_url,enabled,capabilities,metadata) values
('titans','Tennessee Titans','official','Official','https://www.tennesseetitans.com',true,ARRAY['roster','schedule','transactions','news','depth-chart','brand','history']::text[],'{"status":"Primary source","method":"Official team web/pages","cadence":"5-15m on game/roster days","content_audit":"2026-08-19"}'::jsonb),
('nfl','NFL','official','Official league','https://www.nfl.com',true,ARRAY['schedule','game-status','league-reference']::text[],'{"status":"Official cross-check","method":"NFL public pages","cadence":"Schedule/game updates"}'::jsonb),
('nflverse','nflverse','media','Stats','https://github.com/nflverse',true,ARRAY['rosters','schedules','player-stats','snap-counts','pbp','advanced']::text[],'{"status":"Core open-data source","method":"GitHub releases/CDN parquet-csv","cadence":"Daily/release-driven"}'::jsonb),
('nws','National Weather Service','official','Weather','https://api.weather.gov',true,ARRAY['forecast','alerts','hourly']::text[],'{"status":"Free; no key","method":"api.weather.gov","cadence":"15-30m near game"}'::jsonb),
('bluesky','Bluesky public API','community','Social','https://public.api.bsky.app',true,ARRAY['search-posts']::text[],'{"status":"Free; no key","method":"Public API","cadence":"Near live"}'::jsonb),
('espn','ESPN consumer JSON','media','Score/Reference','https://site.api.espn.com',true,ARRAY['scoreboard','game-state','basic-odds']::text[],'{"status":"Undocumented; adapter isolated","method":"Consumer JSON","cadence":"Live windows"}'::jsonb),
('propline','PropLine','media','Market','https://prop-line.com',true,ARRAY['live-odds','pregame-odds','spreads','moneyline','totals','player-props','period-lines','futures']::text[],'{"status":"Server key optional","method":"PropLine v1","cost":"Free / no credit card","cadence":"Quota-aware"}'::jsonb),
('odds-api-io','Odds-API.io','media','Market','https://odds-api.io',true,ARRAY['live-odds','pregame-odds','spreads','moneyline','totals','player-props','team-props','futures']::text[],'{"status":"Server key optional","method":"Odds-API.io v3","cost":"Free / no credit card","cadence":"Quota-aware"}'::jsonb)
on conflict(slug) do update set name=excluded.name,tier=excluded.tier,category=excluded.category,base_url=excluded.base_url,enabled=excluded.enabled,capabilities=excluded.capabilities,metadata=excluded.metadata,updated_at=now();

insert into teams(provider_key,abbreviation,name,city,conference,division,metadata)
values('TEN','TEN','Tennessee Titans','Nashville','AFC','South','{"venue":"Nissan Stadium","content_audit":"2026-08-19"}'::jsonb)
on conflict(abbreviation) do update set name=excluded.name,city=excluded.city,conference=excluded.conference,division=excluded.division,metadata=excluded.metadata;

-- Verified featured roster sample, NOT the complete roster.
-- Current official roster had 91 active players at the 2026-08-19 audit.
with p(full_name,first_name,last_name,position,jersey,unit,experience,college) as (values
('Cam Ward','Cam','Ward','QB','1','Offense','2','Miami'),
('Tony Pollard','Tony','Pollard','RB','20','Offense','8','Memphis'),
('Tyjae Spears','Tyjae','Spears','RB','2','Offense','4','Tulane'),
('Nicholas Singleton','Nicholas','Singleton','RB','32','Offense','R','Penn State'),
('Calvin Ridley','Calvin','Ridley','WR','0','Offense','8','Alabama'),
('Wan''Dale Robinson','Wan''Dale','Robinson','WR','4','Offense','5','Kentucky'),
('Elic Ayomanor','Elic','Ayomanor','WR','5','Offense','2','Stanford'),
('Carnell Tate','Carnell','Tate','WR','14','Offense','R','Ohio State'),
('Daniel Bellinger','Daniel','Bellinger','TE','82','Offense','5','San Diego State'),
('Peter Skoronski','Peter','Skoronski','G','77','Offense','4','Northwestern'),
('Jeffery Simmons','Jeffery','Simmons','DT','98','Defense','8','Mississippi State'),
('Jermaine Johnson II','Jermaine','Johnson II','DE','11','Defense','5','Florida State'),
('Cody Barton','Cody','Barton','LB','50','Defense','8','Utah'),
('Alontae Taylor','Alontae','Taylor','CB','24','Defense','5','Tennessee'),
('Tony Adams','Tony','Adams','S','38','Defense','5','Illinois'),
('Kevin Winston Jr.','Kevin','Winston Jr.','S','23','Defense','2','Penn State'),
('Joey Slye','Joey','Slye','K','6','Special Teams','8','Virginia Tech')
), ins as (
  insert into players(full_name,first_name,last_name,position,college,active,metadata)
  select p.full_name,p.first_name,p.last_name,p.position,p.college,true,jsonb_build_object('seed','verified-featured-sample','audited_on','2026-08-19')
  from p
  where not exists(select 1 from players existing where lower(existing.full_name)=lower(p.full_name))
  returning id
)
select count(*) from ins;

with ten as (select id team_id from teams where abbreviation='TEN'),
src as (select id source_id from sources where slug='titans'),
p(full_name,position,jersey,unit,experience) as (values
('Cam Ward','QB','1','Offense','2'),('Tony Pollard','RB','20','Offense','8'),('Tyjae Spears','RB','2','Offense','4'),
('Nicholas Singleton','RB','32','Offense','R'),('Calvin Ridley','WR','0','Offense','8'),('Wan''Dale Robinson','WR','4','Offense','5'),
('Elic Ayomanor','WR','5','Offense','2'),('Carnell Tate','WR','14','Offense','R'),('Daniel Bellinger','TE','82','Offense','5'),
('Peter Skoronski','G','77','Offense','4'),('Jeffery Simmons','DT','98','Defense','8'),('Jermaine Johnson II','DE','11','Defense','5'),
('Cody Barton','LB','50','Defense','8'),('Alontae Taylor','CB','24','Defense','5'),('Tony Adams','S','38','Defense','5'),
('Kevin Winston Jr.','S','23','Defense','2'),('Joey Slye','K','6','Special Teams','8')
)
insert into roster_snapshots(team_id,player_id,source_id,captured_at,jersey_number,position,unit,roster_status,experience,raw_payload)
select ten.team_id,pl.id,src.source_id,now(),p.jersey,p.position,p.unit,'Active',p.experience,
       jsonb_build_object('source','verified featured roster sample','audited_on','2026-08-19','coverage','subset')
from p cross join ten cross join src join players pl on lower(pl.full_name)=lower(p.full_name)
where not exists(
  select 1 from roster_snapshots rs
  where rs.team_id=ten.team_id and rs.player_id=pl.id and rs.source_id=src.source_id
    and rs.raw_payload->>'audited_on'='2026-08-19'
);

-- Dated official transaction snapshot. Ingestion should append newer official rows.
with src as (select id source_id from sources where slug='titans'),
ten as (select id team_id from teams where abbreviation='TEN'),
t(d,kind,description,pid) as (values
(date '2026-08-17','roster-move','Waived injured LB Sean Brown and signed free-agent CB Corey Mayfield Jr.','titans:2026-08-17'),
(date '2026-08-16','roster-move','Placed DE Jaylen Harrell and TE Jaren Kanak on injured reserve and signed free-agent TE Matt Lauter and RB Dominic Richardson.','titans:2026-08-16'),
(date '2026-08-10','injury-settlement','Waived LB Shad Banks Jr. from injured reserve with an injury settlement.','titans:2026-08-10'),
(date '2026-08-06','roster-move','Waived injured LB Shad Banks Jr. and signed free-agent LB Dominique Hampton.','titans:2026-08-06'),
(date '2026-08-02','roster-move','Waived DE David Ebuka Agoha, S Hudson Clark and DT Cam Horsley; signed free-agent DB Derrick Canteen, DT Khalen Saunders and DT Laki Tasi.','titans:2026-08-02'),
(date '2026-08-01','roster-move','Waived CB Jeadyn Lukus and signed free-agent CB Mario Goodrich.','titans:2026-08-01')
)
insert into transactions(source_id,provider_transaction_id,team_id,transaction_type,transaction_date,description,source_url,raw_payload)
select src.source_id,t.pid,ten.team_id,t.kind,t.d,t.description,'https://www.tennesseetitans.com/team/transactions/',
       jsonb_build_object('source','Tennessee Titans official transactions page','audited_on','2026-08-19')
from t cross join src cross join ten
on conflict(source_id,provider_transaction_id) do update set team_id=excluded.team_id,transaction_type=excluded.transaction_type,
transaction_date=excluded.transaction_date,description=excluded.description,source_url=excluded.source_url,raw_payload=excluded.raw_payload;
