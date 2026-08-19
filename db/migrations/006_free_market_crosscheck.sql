update sources set metadata=metadata || '{"status":"Credential available; configure in server environment","purpose":"Primary free Titans market feed with player props, period markets and futures"}'::jsonb where slug='propline';
update sources set metadata=metadata || '{"status":"Credential available; configure in server environment","purpose":"Secondary free NFL odds cross-check and fallback"}'::jsonb where slug='odds-api-io';
insert into schema_meta(key,value) values ('schema_version','0.5.0')
on conflict (key) do update set value=excluded.value,updated_at=now();
