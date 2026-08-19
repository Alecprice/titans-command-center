-- 0.6.5 current-fact audit, 2026-08-19.
-- Reproducible corrections already verified against TennesseeTitans.com.
-- Designed not to overwrite a newer roster audit if this migration is replayed later.

update games g
set venue='Reliant Stadium'
from teams ht,teams at
where g.home_team_id=ht.id and g.away_team_id=at.id
  and g.season=2026 and g.season_type='regular' and g.week=18
  and ht.abbreviation='HOU' and at.abbreviation='TEN'
  and coalesce(g.venue,'') in ('','NRG Stadium');

update players
set active=false,
    updated_at=now(),
    metadata=metadata||jsonb_build_object(
      'official_roster_departure','2026-08-19',
      'departure_source','https://www.tennesseetitans.com/team/transactions/'
    )
where full_name='Dominic Richardson'
  and coalesce(metadata->>'official_roster_audit','') <= '2026-08-19';

insert into players(full_name,first_name,last_name,position,college,active,metadata)
select 'D''Ernest Johnson','D''Ernest','Johnson','RB','South Florida',true,
       jsonb_build_object(
         'source_url','https://www.tennesseetitans.com/team/players-roster/',
         'official_roster_audit','2026-08-19'
       )
where not exists(select 1 from players where full_name='D''Ernest Johnson');

update players
set active=true,
    position='RB',
    college='South Florida',
    updated_at=now(),
    metadata=metadata||jsonb_build_object(
      'source_url','https://www.tennesseetitans.com/team/players-roster/',
      'official_roster_audit','2026-08-19'
    )
where full_name='D''Ernest Johnson'
  and coalesce(metadata->>'official_roster_audit','') <= '2026-08-19';

insert into roster_snapshots(
  team_id,player_id,source_id,captured_at,jersey_number,position,unit,
  roster_status,experience,raw_payload
)
select t.id,p.id,s.id,'2026-08-19T16:00:00Z','21','RB','Offense','Active','7',
       jsonb_build_object(
         'height','5-11','weight',205,'college','South Florida',
         'source','Tennessee Titans official roster',
         'coverage','official-change-snapshot','audited_on','2026-08-19',
         'source_url','https://www.tennesseetitans.com/team/players-roster/'
       )
from teams t,players p,sources s
where t.abbreviation='TEN' and p.full_name='D''Ernest Johnson' and s.slug='titans'
  and not exists(
    select 1 from roster_snapshots rs
    where rs.player_id=p.id and rs.captured_at::date='2026-08-19'::date
      and rs.jersey_number='21'
  );

insert into transactions(
  source_id,provider_transaction_id,team_id,player_id,transaction_type,
  transaction_date,description,source_url,raw_payload
)
select s.id,'titans:2026-08-19',t.id,p.id,'roster-move','2026-08-19',
       'Waived RB Dominic Richardson and signed free-agent RB D''Ernest Johnson.',
       'https://www.tennesseetitans.com/team/transactions/',
       jsonb_build_object('source','Tennessee Titans official transactions page','verified_on','2026-08-19')
from sources s,teams t,players p
where s.slug='titans' and t.abbreviation='TEN' and p.full_name='D''Ernest Johnson'
  and not exists(select 1 from transactions where provider_transaction_id='titans:2026-08-19');

update sources
set metadata=metadata||jsonb_build_object(
      'status','Free dataset available; warehouse importer pending',
      'purpose','Play-by-play, rosters, snaps and advanced data source; not currently a live persisted refresh job'
    ),updated_at=now()
where slug='nflverse'
  and coalesce(metadata->>'status','') in ('Ready','Free dataset available; warehouse importer pending');

update sources
set metadata=metadata||jsonb_build_object(
      'status','API available; forecast persistence pending',
      'purpose','Official game-day forecast/alerts source; warehouse persistence not yet active'
    ),updated_at=now()
where slug='nws'
  and coalesce(metadata->>'status','') in ('Ready','API available; forecast persistence pending');

update sources
set metadata=metadata||jsonb_build_object(
      'status','Near-live scoreboard fallback; no warehouse persistence',
      'purpose','Near-live game state/basic fallback only; not authoritative roster or injury data'
    ),updated_at=now()
where slug='espn';

update sources
set metadata=metadata||jsonb_build_object(
      'status','Public API reachable; feed persistence pending',
      'purpose','Community chatter source; not authoritative for team facts'
    ),updated_at=now()
where slug='bluesky';

insert into schema_meta(key,value) values
  ('app_version','0.6.5'),
  ('content_audit_at','2026-08-19'),
  ('roster_snapshot_at','2026-08-19')
on conflict(key) do update set value=excluded.value;
