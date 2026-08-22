# Database migrations

Titans Command Center database migrations are reviewed SQL artifacts. They are **not** executed automatically by the Cloudflare deployment workflow or application runtime.

## Account preference storage

Migration: `20260822_fan_user_preferences.sql`

Purpose: stores the small allowlisted preference payload used by signed-in Titans accounts. Guest preferences remain browser-local.

### Apply manually

Use an authenticated database administration session against the intended Neon branch/database and run the migration file exactly once. The migration is written to be safe to re-run (`create table/index if not exists`).

Do not point a test command at production by accident. Confirm the project, branch, database, and role before executing SQL.

### Verify

After applying, verify the contract without writing user data:

```sql
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'fan_user_preferences'
order by ordinal_position;

select indexname, indexdef
from pg_indexes
where schemaname = 'public'
  and tablename = 'fan_user_preferences'
order by indexname;
```

Expected application-facing columns include `user_id`, `preferences`, `schema_version`, and `updated_at`. `preferences` must remain JSONB and constrained to a JSON object.

### Roll back

Rollback file: `20260822_fan_user_preferences.rollback.sql`

Rollback is destructive and deletes synchronized preference rows. Run it only as an explicit operator decision. Application guest mode does not require this table and should continue to function if preference sync is unavailable.
