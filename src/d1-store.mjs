const jsonColumns=new Set(['preferences','payload','metadata']);

export function hasD1(env={}){
  return Boolean(env?.TITANS_DB&&typeof env.TITANS_DB.prepare==='function');
}

function parseJson(value,fallback={}){
  if(value==null)return fallback;
  if(typeof value==='object')return value;
  try{return JSON.parse(String(value));}catch{return fallback;}
}

function normalizeRow(row){
  if(!row||typeof row!=='object')return row;
  const out={...row};
  for(const key of jsonColumns){if(key in out)out[key]=parseJson(out[key],key==='payload'?null:{});}
  return out;
}

export async function d1Health(env={}){
  if(!hasD1(env))return {configured:false,ok:false,provider:'cloudflare-d1'};
  try{
    const row=await env.TITANS_DB.prepare('select 1 as ok').first();
    return {configured:true,ok:Number(row?.ok)===1,provider:'cloudflare-d1'};
  }catch(error){
    console.error('[d1-health]',error);
    return {configured:true,ok:false,provider:'cloudflare-d1',error:'D1 health check failed'};
  }
}

export async function getD1Preferences(env,userId){
  if(!hasD1(env))return null;
  const row=await env.TITANS_DB.prepare('select preferences,schema_version,updated_at from fan_user_preferences where user_id=? limit 1').bind(String(userId)).first();
  return normalizeRow(row);
}

export async function putD1Preferences(env,userId,preferences,schemaVersion=1){
  if(!hasD1(env))return null;
  const encoded=JSON.stringify(preferences&&typeof preferences==='object'?preferences:{});
  await env.TITANS_DB.prepare(`
    insert into fan_user_preferences(user_id,preferences,schema_version,updated_at)
    values(?,?,?,CURRENT_TIMESTAMP)
    on conflict(user_id) do update set
      preferences=excluded.preferences,
      schema_version=excluded.schema_version,
      updated_at=CURRENT_TIMESTAMP
  `).bind(String(userId),encoded,Number(schemaVersion)||1).run();
  return getD1Preferences(env,userId);
}

export async function getD1Snapshot(env,key,{allowExpired=false}={}){
  if(!hasD1(env))return null;
  const row=await env.TITANS_DB.prepare(`
    select cache_key,payload,source,fetched_at,expires_at,updated_at
    from api_snapshots
    where cache_key=?
      and (?=1 or expires_at is null or datetime(expires_at)>CURRENT_TIMESTAMP)
    limit 1
  `).bind(String(key),allowExpired?1:0).first();
  return normalizeRow(row);
}

export async function putD1Snapshot(env,key,payload,{source='titans-command-center',fetchedAt=new Date(),ttlSeconds=900}={}){
  if(!hasD1(env))return null;
  const fetched=fetchedAt instanceof Date?fetchedAt.toISOString():new Date(fetchedAt).toISOString();
  const expires=new Date(new Date(fetched).getTime()+Math.max(0,Number(ttlSeconds)||0)*1000).toISOString();
  await env.TITANS_DB.prepare(`
    insert into api_snapshots(cache_key,payload,source,fetched_at,expires_at,updated_at)
    values(?,?,?,?,?,CURRENT_TIMESTAMP)
    on conflict(cache_key) do update set
      payload=excluded.payload,
      source=excluded.source,
      fetched_at=excluded.fetched_at,
      expires_at=excluded.expires_at,
      updated_at=CURRENT_TIMESTAMP
  `).bind(String(key),JSON.stringify(payload??null),String(source||''),fetched,expires).run();
  return getD1Snapshot(env,key,{allowExpired:true});
}

export async function deleteD1Snapshot(env,key){
  if(!hasD1(env))return false;
  await env.TITANS_DB.prepare('delete from api_snapshots where cache_key=?').bind(String(key)).run();
  return true;
}
