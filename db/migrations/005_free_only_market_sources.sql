-- Free-only market provider policy. No billing method required for the active market stack.
update sources set enabled=false, metadata=metadata || '{"status":"Disabled by free-only policy"}'::jsonb where slug in ('sportsgameodds','sportsdataio','the-odds-api');

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
