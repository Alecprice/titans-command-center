-- Align live Titans roster persistence with the official Aug. 21, 2026 roster moves.
-- Idempotent DML: safe to re-run. Deployment does not execute migrations automatically.

update players
set active=false,
    metadata=metadata || jsonb_build_object(
      'official_roster_audit','2026-08-22',
      'released_on','2026-08-21',
      'source_url','https://www.tennesseetitans.com/news/titans-sign-de-tanoh-kpassagnon-and-lb-milo-eifler-while-releasing-te-matt-lauter-and-placing-db-nazeeh-johnson-on-reserve-injured'
    ),
    updated_at=now()
where full_name='Matt Lauter';

insert into players(full_name,first_name,last_name,position,active,metadata)
select 'Tanoh Kpassagnon','Tanoh','Kpassagnon','DE',true,
       jsonb_build_object(
         'official_roster_audit','2026-08-22',
         'source_url','https://www.tennesseetitans.com/team/players-roster/'
       )
where not exists (select 1 from players where full_name='Tanoh Kpassagnon');

update players
set position='DE',
    active=true,
    metadata=metadata || jsonb_build_object(
      'official_roster_audit','2026-08-22',
      'source_url','https://www.tennesseetitans.com/team/players-roster/'
    ),
    updated_at=now()
where full_name='Tanoh Kpassagnon';

update players
set position='LB',
    active=true,
    metadata=metadata || jsonb_build_object(
      'official_roster_audit','2026-08-22',
      'source_url','https://www.tennesseetitans.com/team/players-roster/'
    ),
    updated_at=now()
where full_name='Milo Eifler';

update players
set active=true,
    metadata=metadata || jsonb_build_object(
      'official_roster_audit','2026-08-22',
      'source_url','https://www.tennesseetitans.com/team/players-roster/'
    ),
    updated_at=now()
where full_name='Nazeeh Johnson';

insert into roster_snapshots(
  team_id,player_id,source_id,captured_at,jersey_number,position,unit,
  roster_status,experience,raw_payload
)
select t.id,p.id,s.id,'2026-08-23T10:58:00Z'::timestamptz,
       '58','DE','Defense','Active','8',
       jsonb_build_object(
         'audit','2026-08-22',
         'source_url','https://www.tennesseetitans.com/team/players-roster/'
       )
from teams t,players p,sources s
where t.abbreviation='TEN'
  and p.full_name='Tanoh Kpassagnon'
  and s.slug='titans'
  and not exists (
    select 1
    from roster_snapshots rs
    where rs.team_id=t.id
      and rs.player_id=p.id
      and rs.source_id=s.id
      and rs.captured_at='2026-08-23T10:58:00Z'::timestamptz
  );

update roster_snapshots
set jersey_number='45',
    position='LB',
    unit='Defense',
    roster_status='Active',
    experience='3',
    raw_payload=raw_payload || jsonb_build_object(
      'official_roster_audit','2026-08-22',
      'source_url','https://www.tennesseetitans.com/team/players-roster/'
    )
where id=(
  select rs.id
  from roster_snapshots rs
  join players p on p.id=rs.player_id
  where p.full_name='Milo Eifler'
  order by rs.captured_at desc,rs.id desc
  limit 1
);

update roster_snapshots
set jersey_number='36',
    position='DB',
    unit='Defense',
    roster_status='Reserve/Injured',
    experience='5',
    raw_payload=raw_payload || jsonb_build_object(
      'official_roster_audit','2026-08-22',
      'source_url','https://www.tennesseetitans.com/team/players-roster/',
      'transaction_url','https://www.tennesseetitans.com/news/titans-sign-de-tanoh-kpassagnon-and-lb-milo-eifler-while-releasing-te-matt-lauter-and-placing-db-nazeeh-johnson-on-reserve-injured'
    )
where id=(
  select rs.id
  from roster_snapshots rs
  join players p on p.id=rs.player_id
  where p.full_name='Nazeeh Johnson'
  order by rs.captured_at desc,rs.id desc
  limit 1
);

insert into transactions(
  source_id,provider_transaction_id,team_id,transaction_type,transaction_date,
  description,source_url,raw_payload
)
select s.id,'titans:2026-08-21',t.id,'roster_move','2026-08-21',
       'Signed DE Tanoh Kpassagnon and LB Milo Eifler, released TE Matt Lauter, and placed DB Nazeeh Johnson on Reserve/Injured.',
       'https://www.tennesseetitans.com/news/titans-sign-de-tanoh-kpassagnon-and-lb-milo-eifler-while-releasing-te-matt-lauter-and-placing-db-nazeeh-johnson-on-reserve-injured',
       jsonb_build_object('audit','2026-08-22','official',true)
from sources s,teams t
where s.slug='titans' and t.abbreviation='TEN'
on conflict(source_id,provider_transaction_id) do update
set team_id=excluded.team_id,
    transaction_type=excluded.transaction_type,
    transaction_date=excluded.transaction_date,
    description=excluded.description,
    source_url=excluded.source_url,
    raw_payload=excluded.raw_payload;

insert into schema_meta(key,value,updated_at)
values
  ('content_audit_at','2026-08-22',now()),
  ('roster_snapshot_at','2026-08-23',now())
on conflict(key) do update
set value=excluded.value,
    updated_at=excluded.updated_at;
