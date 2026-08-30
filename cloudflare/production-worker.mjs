import worker from './worker.mjs';
import {d1Health,getD1Snapshot} from '../src/d1-store.mjs';

const enabled=value=>/^(1|true|yes|on)$/i.test(String(value??'').trim());
const BOOTSTRAP_SNAPSHOT_KEY='bootstrap:v1';

export function neonWarehouseDisabled(env={}){
  return enabled(env?.NEON_WAREHOUSE_DISABLED);
}

export function productionDataEnv(env={}){
  if(!neonWarehouseDisabled(env))return env;
  return new Proxy(env,{
    get(target,property,receiver){
      if(property==='DATABASE_URL')return undefined;
      return Reflect.get(target,property,receiver);
    },
    has(target,property){
      if(property==='DATABASE_URL')return false;
      return Reflect.has(target,property);
    },
    getOwnPropertyDescriptor(target,property){
      if(property==='DATABASE_URL')return undefined;
      return Reflect.getOwnPropertyDescriptor(target,property);
    }
  });
}

function contentAuditFromSnapshot(row){
  const payload=row?.payload;
  if(!payload||typeof payload!=='object')return null;
  return payload?.dataQuality?.contentAuditAt||payload?.meta?.content_audit_at||payload?.meta?.contentAuditAt||payload?.contentAudit||null;
}

export async function d1AuthoritativeHealth(request,env,ctx){
  const sanitized=productionDataEnv(env);
  const baseline=await worker.fetch(request,sanitized,ctx);
  if(!neonWarehouseDisabled(env)||new URL(request.url).pathname!=='/api/health'||request.method!=='GET')return baseline;

  let body={};
  try{body=await baseline.clone().json();}catch{}
  const [d1,snapshot]=await Promise.all([
    d1Health(env),
    getD1Snapshot(env,BOOTSTRAP_SNAPSHOT_KEY).catch(()=>null)
  ]);
  const primaryReady=Boolean(d1.ok&&snapshot?.payload?.ok===true);
  const database={
    configured:Boolean(d1.configured),
    ok:primaryReady,
    provider:'cloudflare-d1',
    snapshotFresh:Boolean(snapshot),
    warehouse:{configured:Boolean(env?.DATABASE_URL),disabled:true,provider:'neon'}
  };
  const responseBody={
    ...body,
    ok:true,
    status:primaryReady?'healthy':'degraded',
    contentAudit:contentAuditFromSnapshot(snapshot)||body?.contentAudit||null,
    database,
    storage:{...(body?.storage||{}),primary:'cloudflare-d1',d1},
    fallbacks:{...(body?.fallbacks||{}),d1Snapshot:true}
  };
  const headers=new Headers(baseline.headers);
  headers.set('content-type','application/json; charset=utf-8');
  headers.set('cache-control','no-store');
  return new Response(JSON.stringify(responseBody),{status:200,headers});
}

export async function d1WarehouseFallback(request,env,ctx){
  const response=await worker.fetch(request,productionDataEnv(env),ctx);
  if(!neonWarehouseDisabled(env)||new URL(request.url).pathname!=='/api/advanced-analytics'||response.status!==503)return response;
  let body={};
  try{body=await response.clone().json();}catch{}
  if(body?.error!=='Database not configured')return response;

  const url=new URL(request.url);
  const requestedSeason=Number.parseInt(url.searchParams.get('season')||'2026',10);
  const team=String(url.searchParams.get('team')||'TEN').toUpperCase();
  const payload={
    ok:false,
    available:false,
    status:'database-unavailable',
    configured:false,
    requestedSeason:Number.isInteger(requestedSeason)?requestedSeason:2026,
    dataSeason:null,
    team:/^[A-Z]{2,3}$/.test(team)?team:'TEN',
    seasonFallback:false,
    coverage:null,
    summary:null,
    weeks:[],
    league:[],
    recentPlays:[],
    byDown:[],
    personnel:[],
    sources:[],
    error:'Advanced analytics query failed',
    fetchedAt:new Date().toISOString()
  };
  return new Response(JSON.stringify(payload),{status:200,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
}

export default {
  fetch(request,env,ctx){
    const pathname=new URL(request.url).pathname;
    if(neonWarehouseDisabled(env)&&pathname==='/api/health')return d1AuthoritativeHealth(request,env,ctx);
    if(neonWarehouseDisabled(env)&&pathname==='/api/advanced-analytics')return d1WarehouseFallback(request,env,ctx);
    return worker.fetch(request,productionDataEnv(env),ctx);
  },
  scheduled(controller,env,ctx){
    return worker.scheduled(controller,productionDataEnv(env),ctx);
  }
};
