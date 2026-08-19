-- Align checked-in metadata with the live Titans Command Center database.
-- This migration does not add/remove tables; it records the production app,
-- free-only market policy, and schema metadata version.
insert into schema_meta(key,value) values
('production_app','titans-command-center'),
('market_policy','free-only-no-card'),
('schema_version','0.6.0')
on conflict (key) do update set value=excluded.value,updated_at=now();
