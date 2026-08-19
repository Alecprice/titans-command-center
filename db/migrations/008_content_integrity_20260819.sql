-- Content integrity corrections verified 2026-08-19.
-- Sources: TennesseeTitans.com, NFL.com, Pro Football Hall of Fame.
-- This migration is idempotent and intentionally does not freeze the full current roster;
-- roster ingestion/snapshots own that fast-changing dataset.

insert into schema_meta(key,value,updated_at) values
('app_version','0.6.1',now()),
('content_audit','2026-08-19',now())
on conflict(key) do update set value=excluded.value,updated_at=excluded.updated_at;

-- Correct known 2026 Titans schedule metadata. Week 18 remains TBD after Week 17.
update games g
set network=case
  when g.season_type='preseason' and g.week=1 then 'WKRN-TV News 2'
  when g.season_type='regular' and g.week=11 then 'FOX'
  when g.season_type='regular' and g.week=12 then 'CBS'
  when g.season_type='regular' and g.week=13 then 'CBS'
  when g.season_type='regular' and g.week=14 then 'FOX'
  when g.season_type='regular' and g.week=15 then 'CBS'
  when g.season_type='regular' and g.week=16 then 'FOX'
  when g.season_type='regular' and g.week=17 then 'CBS'
  when g.season_type='regular' and g.week=18 then 'TBD'
  else g.network end,
    kickoff=case when g.season_type='regular' and g.week=18 then null else g.kickoff end,
    updated_at=now()
from teams ht,teams at
where ht.id=g.home_team_id and at.id=g.away_team_id
  and g.season=2026 and (ht.abbreviation='TEN' or at.abbreviation='TEN');

-- Official current roster lists Peter Skoronski as G.
update players set position='G',updated_at=now() where full_name='Peter Skoronski';
with p as (select id from players where full_name='Peter Skoronski')
update roster_snapshots rs
set position='G',raw_payload=coalesce(raw_payload,'{}'::jsonb)||jsonb_build_object('verified_position','G','verified_on','2026-08-19')
from p
where rs.player_id=p.id
  and rs.captured_at=(select max(rs2.captured_at) from roster_snapshots rs2 where rs2.player_id=p.id);

-- Official Titans transactions added after the earlier production snapshot.
with src as (select id source_id from sources where slug='titans'),
ten as (select id team_id from teams where abbreviation='TEN'),
t(d,kind,description,pid) as (values
(date '2026-08-17','roster-move','Waived injured LB Sean Brown and signed free-agent CB Corey Mayfield Jr.','titans:2026-08-17'),
(date '2026-08-16','roster-move','Placed DE Jaylen Harrell and TE Jaren Kanak on injured reserve and signed free-agent TE Matt Lauter and RB Dominic Richardson.','titans:2026-08-16'),
(date '2026-08-10','injury-settlement','Waived LB Shad Banks Jr. from injured reserve with an injury settlement.','titans:2026-08-10'),
(date '2026-08-06','roster-move','Waived injured LB Shad Banks Jr. and signed free-agent LB Dominique Hampton.','titans:2026-08-06'),
(date '2026-08-02','roster-move','Waived DE David Ebuka Agoha, S Hudson Clark and DT Cam Horsley; signed free-agent DB Derrick Canteen, DT Khalen Saunders and DT Laki Tasi.','titans:2026-08-02')
)
insert into transactions(source_id,provider_transaction_id,team_id,transaction_type,transaction_date,description,source_url,raw_payload)
select src.source_id,t.pid,ten.team_id,t.kind,t.d,t.description,
       'https://www.tennesseetitans.com/team/transactions/',
       jsonb_build_object('verified_on','2026-08-19','source','Tennessee Titans official transactions page')
from t cross join src cross join ten
on conflict(source_id,provider_transaction_id) do update set
  team_id=excluded.team_id,
  transaction_type=excluded.transaction_type,
  transaction_date=excluded.transaction_date,
  description=excluded.description,
  source_url=excluded.source_url,
  raw_payload=excluded.raw_payload;
