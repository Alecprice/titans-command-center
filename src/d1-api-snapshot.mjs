import {getD1Snapshot,hasD1,putD1Snapshot} from './d1-store.mjs';

const text=value=>String(value??'').trim();

export function apiSnapshotKey(scope,dimensions={}){
  const base=text(scope).replace(/[^a-z0-9:_-]/gi,'-').toLowerCase();
  const parts=[base||'api-snapshot'];
  for(const [key,value] of Object.entries(dimensions).sort(([a],[b])=>a.localeCompare(b))){
    const normalized=text(value);
    if(!normalized)continue;
    parts.push(`${text(key).toLowerCase()}=${encodeURIComponent(normalized)}`);
  }
  return parts.join(':');
}

function snapshotPayload(row,{stale=false,reason=''}={}){
  const payload=row?.payload;
  if(!payload||typeof payload!=='object'||Array.isArray(payload))return null;
  return {
    ...payload,
    storage:'cloudflare-d1',
    snapshot:{
      key:row.cache_key||null,
      source:row.source||'unknown',
      fetchedAt:row.fetched_at||payload.fetchedAt||null,
      expiresAt:row.expires_at||null,
      stale:Boolean(stale),
      reason:reason||null
    }
  };
}

export async function readApiSnapshot(env,key,{allowExpired=false,reason=''}={}){
  if(!hasD1(env))return null;
  try{
    const row=await getD1Snapshot(env,key,{allowExpired});
    return snapshotPayload(row,{stale:allowExpired,reason});
  }catch(error){
    console.warn('[d1-api-snapshot-read]',key,error);
    return null;
  }
}

export async function writeApiSnapshot(env,key,payload,{source='neon-read-plane',ttlSeconds=900}={}){
  if(!hasD1(env)||!payload||typeof payload!=='object'||Array.isArray(payload))return false;
  try{
    await putD1Snapshot(env,key,payload,{source,ttlSeconds});
    return true;
  }catch(error){
    console.warn('[d1-api-snapshot-write]',key,error);
    return false;
  }
}
