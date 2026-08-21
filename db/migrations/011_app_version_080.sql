insert into schema_meta(key,value,updated_at)
values ('app_version','0.8.0',now())
on conflict(key) do update
set value=excluded.value,
    updated_at=excluded.updated_at;
