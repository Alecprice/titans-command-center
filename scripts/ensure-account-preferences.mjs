import {getSql} from '../src/db.mjs';

const sql=await getSql(process.env);
if(!sql){
  console.error('DATABASE_URL is not configured; account preference storage was not provisioned.');
  process.exit(1);
}

await sql`
  create table if not exists fan_user_preferences (
    user_id text primary key,
    preferences jsonb not null default '{}'::jsonb,
    schema_version integer not null default 1 check (schema_version > 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fan_user_preferences_object check (jsonb_typeof(preferences) = 'object')
  )
`;

await sql`
  create index if not exists fan_user_preferences_updated_at_idx
  on fan_user_preferences (updated_at desc)
`;

await sql`
  comment on table fan_user_preferences is
  'Optional Titans Command Center account-synced preferences. Guest preferences remain browser-local.'
`;

const [row]=await sql`select to_regclass('public.fan_user_preferences')::text as table_name`;
if(row?.table_name!=='fan_user_preferences'){
  console.error('Account preference storage verification failed.');
  process.exit(1);
}

console.log('Account preference storage ready.');
