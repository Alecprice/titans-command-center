import apiHandler from '../api/index.js';
import {databaseHealth,getBootstrapData,getSql} from '../src/db.mjs';
import {d1Health,getD1Snapshot,hasD1,putD1Snapshot} from '../src/d1-store.mjs';
import {getAuditedTeamContext} from '../src/team-context.mjs';
import {team as fallbackTeam,games as fallbackGames,roster as fallbackRoster,feed as fallbackFeed,sources as fallbackSources} from '../src/data.mjs';
import {preseasonStatsRoute} from '../src/preseason-api.mjs';
import {marketDataRoute} from '../src/market-api.mjs';
import {advancedAnalyticsRoute} from '../src/advanced-analytics-api.mjs';
import {playerProfileRoute} from '../src/player-api.mjs';
import {fanIntelRoute} from '../src/fan-intel-api.mjs';
import {ticketsRoute} from '../src/tickets-api.mjs';
import {xSocialRoute} from '../src/x-social-api.mjs';
import {youtubeMediaRoute} from '../src/youtube-media-api.mjs';
import {accountAuthProxy,accountPreferencesRoute} from '../src/account-api.mjs';
import {syncTitansOfficialAudit,syncBluesky,syncEspn,syncNflverseRoster,syncNflverseStats,syncNwsNextHomeGame,syncFreeOdds,recordSyncRun} from '../src/ingest.mjs';

const API_PREFIX='/api/';
const APP_VERSION='1.0.0';
const SCOREBOARD_URL='https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';
const BOOTSTRAP_CACHE_CONTROL='public, s-maxage=900, stale-while-revalidate=21600';
const QUERY_CACHE_CONTROL='public, s-maxage=900, stale-while-revalidate=21600';
const BOOTSTRAP_SNAPSHOT_KEY='bootstrap:v1';
const BOOTSTRAP_SNAPSHOT_TTL_SECONDS=900;

function requestHeaders(headers){const out={};for(const [key,value] of headers.entries())out[key.toLowerCase()]=value;return out;}
function requestQuery(url,route){const query={route};for(const [key,value] of url.searchParams.entries()){if(key==='route')continue;const current=query[key];if(current===undefined)query[key]=value;else if(Array.isArray(current))current.push(value);else query[key]=[current,value];}return query;}
function vercelRequest(request,route){const url=new URL(request.url);return {method:request.method,headers:requestHeaders(request.headers),query:requestQuery(url,route),url:`${url.pathname}${url.search}`};}
function vercelResponse(){
  let statusCode=200,response=null;const headers=new Headers();
  const api={setHeader(name,value){if(Array.isArray(value)){headers.delete(name);for(const item of value)headers.append(name,String(value));}else headers.set(name,String(value));return api;},getHeader(name){return headers.get(name)},status(code){statusCode=Number(code)||200;return api},json(payload){if(!headers.has('Content-Type'))headers.set('Content-Type','application/json; charset=utf-8');response=new Response(JSON.stringify(payload),{status:statusCode,headers});return response;},send(payload=''){const body=typeof payload==='string'||payload instanceof ArrayBuffer?payload:JSON.stringify(payload);response=new Response(body,{status:statusCode,headers});return response;},end(payload=''){response=new Response(payload,{status:statusCode,headers});return response;}};
  return {api,result:()=>response||new Response(null,{status:statusCode,headers})};
}
function jsonResponse(payload,status=200,headers={}){return new Response(JSON.stringify(payload),{status,headers:{'Content-Type':'application/json; charset=utf-8',...headers}});}
function withEdgeCacheStatus(response,status){const headers=new Headers(response.headers);headers.set('X-Titans-Edge-Cache',status);return new Response(response.body,{status:response.status,statusText:response.statusText,headers});}
function withCacheControl(response,value){const headers=new Headers(response.headers);headers.set('Cache-Control',value);return new Response(response.body,{status:response.status,statusText:response.statusText,headers});}
function marketCacheKey(request){const url=new URL(request.url);url.search='';return new Request(url.toString(),{method:'GET',headers:{Accept:'application/json'}});}
function apiCacheKey(request){const url=new URL(request.url);url.search='';return new Request(url.toString(),{method:'GET',headers:{Accept:'application/json'}});}
function queryAwareApiCacheKey(request,keys=[]){const input=new URL(request.url),url=new URL(`${input.origin}${input.pathname}`);for(const key of [...keys].sort()){const value=input.searchParams.get(key);if(value!=null&&value!=='')url.searchParams.set(key,value);}return new Request(url.toString(),{method:'GET',headers:{Accept:'application/json'}});}
function edgeResponseCacheable(response){const policy=String(response.headers.get('Cache-Control')||'').toLowerCase();return response.ok&&!policy.includes('no-store')&&!policy.includes('private');}
function auditedBootstrapFallback(reason='Live database unavailable'){
  const transactions=fallbackFeed.filter(row=>row.type==='transaction').map(row=>({id:String(row.id||''),date:row.publishedAt||null,type:'transaction',description:row.summary||row.title||'',sourceUrl:row.url||''}));
  const coverage={};
  return {
    configured:true,ok:true,mode:'audited-fallback',databaseAvailable:false,
    fallback:{active:true,reason,auditedAt:fallbackTeam.auditedAt||fallbackTeam.rosterCoverage?.asOf||null},
    meta:{app_version:APP_VERSION,content_audit_at:fallbackTeam.rosterCoverage?.asOf||null,roster_snapshot_at:fallbackTeam.auditedAt||null},
    games:fallbackGames.map(game=>({...game})),
    roster:fallbackRoster.map(player=>({...player,id:String(player.id||'')})),
    sources:fallbackSources.map(source=>({...source})),transactions,feed:fallbackFeed.map(row=>({...row})),syncRuns:[],
    analytics:{coverage,efficiency:[]},weather:{rows:[],status:'database-unavailable'},markets:{rows:[],futures:[],status:'database-unavailable'},
    dataQuality:{contentAuditAt:fallbackTeam.rosterCoverage?.asOf||null,rosterSnapshotAt:fallbackTeam.auditedAt||null,rosterPlayers:fallbackRoster.length,eventRows:fallbackFeed.length,transactionRows:transactions.length,coverage},
    fetchedAt:new Date().toISOString()
  };
}
function unavailableFanIntel(env,reason='Live fan intelligence warehouse unavailable'){
  return {
    ok:true,available:false,configured:Boolean(env?.DATABASE_URL),mode:'database-unavailable',season:2026,
    standings:[],injuries:[],depthChart:{capturedAt:null,previousCapturedAt:null,changes:[]},contracts:[],opponent:null,
    gameDay:{drives:[],plays:[],teamMetrics:[]},playerStats:[],
    availability:{standings:false,injuries:false,depthChanges:false,contracts:false,opponent:false,drives:false,plays:false,playerStats:false},
    diagnostics:[reason],fetchedAt:new Date().toISOString()
  };
}
function guestSessionUnavailable(){return jsonResponse({ok:true,user:null,session:null,guest:true,available:false,code:'ACCOUNT_SERVICE_UNAVAILABLE'},200,{'Cache-Control':'no-store'});}
function accountInfrastructureFailure(status){return status===402||status===429||status>=500;}
function accountServiceUnavailable(status=503){return jsonResponse({ok:false,error:'Account service is temporarily unavailable. You can keep using Titans Command Center as a guest, and settings already saved on this device are safe.',code:'ACCOUNT_SERVICE_UNAVAILABLE',localOnly:true},status,{'Cache-Control':'no-store'});}
function d1SnapshotPayload(row,{stale=false,reason=''}={}){
  const payload=row?.payload;
  if(!payload||typeof payload!=='object'||payload.ok!==true)return null;
  const originalMode=payload.mode||'live-database';
  return {
    ...payload,
    mode:'d1-snapshot',
    databaseAvailable:stale?false:null,
    storage:'cloudflare-d1',
    snapshot:{
      key:row.cache_key||BOOTSTRAP_SNAPSHOT_KEY,
      source:row.source||'unknown',
      fetchedAt:row.fetched_at||payload.fetchedAt||null,
      expiresAt:row.expires_at||null,
      stale:Boolean(stale),
      originalMode,
      reason:reason||null
    }
  };
}
async function readD1Bootstrap(env,{allowExpired=false,reason=''}={}){
  if(!hasD1(env))return null;
  try{
    const row=await getD1Snapshot(env,BOOTSTRAP_SNAPSHOT_KEY,{allowExpired});
    return d1SnapshotPayload(row,{stale:allowExpired,reason});
  }catch(error){console.warn('[d1-bootstrap-read]',error);return null;}
}
async function writeD1Bootstrap(env,payload,{source='neon-bootstrap',ttlSeconds=BOOTSTRAP_SNAPSHOT_TTL_SECONDS}={}){
  if(!hasD1(env)||!payload?.ok)return false;
  try{await putD1Snapshot(env,BOOTSTRAP_SNAPSHOT_KEY,payload,{source,ttlSeconds});return true;}catch(error){console.warn('[d1-bootstrap-write]',error);return false;}
}
async function nativeHealth(request,env){
  if(request.method!=='GET')return jsonResponse({ok:false,error:'Method not allowed'},405,{Allow:'GET','Cache-Control':'no-store'});
  const [db,d1]=await Promise.all([databaseHealth(env),d1Health(env)]);
  return jsonResponse({ok:true,status:db.ok?'healthy':'degraded',app:'titans-command-center',version:APP_VERSION,contentAudit:db.content_audit_at||null,time:new Date().toISOString(),database:db,storage:{primary:hasD1(env)?'cloudflare-d1':'neon',d1},providers:{propLine:Boolean(env?.PROPLINE_API_KEY),oddsApiIo:Boolean(env?.ODDS_API_IO_KEY),youtubeData:Boolean(env?.YOUTUBE_API_KEY),espnFallback:true,nws:true},fallbacks:{auditedRoster:true,officialPreseasonGamebook:true,marketReference:true,d1Snapshot:hasD1(env)}},200,{'Cache-Control':'no-store'});
}
async function nativeData(request,env){
  if(request.method!=='GET')return jsonResponse({ok:false,error:'Method not allowed'},405,{Allow:'GET'});
  const headers={'Cache-Control':BOOTSTRAP_CACHE_CONTROL};
  const snapshot=await readD1Bootstrap(env);
  if(snapshot)return jsonResponse(snapshot,200,headers);
  let data={configured:Boolean(env?.DATABASE_URL),ok:false,error:env?.DATABASE_URL?'Database query failed':'DATABASE_URL is not configured'};
  if(env?.DATABASE_URL){
    try{data=await getBootstrapData(env);}catch(error){console.error('[native-data-bootstrap]',error);}
  }
  if(data?.ok){
    const sql=await getSql(env);let teamContext;
    try{teamContext=await getAuditedTeamContext(sql);}catch(error){console.warn('[team-context-fallback]',error);teamContext=await getAuditedTeamContext(null);}
    const payload={...data,mode:'live-database',databaseAvailable:true,storage:'neon',teamContext};
    await writeD1Bootstrap(env,payload,{source:'neon-bootstrap'});
    return jsonResponse(payload,200,headers);
  }
  const staleSnapshot=await readD1Bootstrap(env,{allowExpired:true,reason:data?.error||'Live database unavailable'});
  if(staleSnapshot)return jsonResponse(staleSnapshot,200,headers);
  const fallback={...auditedBootstrapFallback(data?.error||'Live database unavailable'),teamContext:await getAuditedTeamContext(null),storage:'bundled-audited-data'};
  await writeD1Bootstrap(env,fallback,{source:'audited-fallback',ttlSeconds:BOOTSTRAP_SNAPSHOT_TTL_SECONDS});
  return jsonResponse(fallback,200,headers);
}
async function cachedNativeData(request,env,ctx){
  if(request.method!=='GET')return withEdgeCacheStatus(await nativeData(request,env),'BYPASS');
  const cache=globalThis.caches?.default;
  if(!cache)return withEdgeCacheStatus(await nativeData(request,env),'UNAVAILABLE');
  const key=apiCacheKey(request),hit=await cache.match(key);
  if(hit)return withEdgeCacheStatus(hit,'HIT');
  const fresh=await nativeData(request,env);
  if(fresh.ok){
    const write=cache.put(key,fresh.clone()).catch(error=>console.warn('[data-edge-cache]',error));
    if(ctx?.waitUntil)ctx.waitUntil(write);else await write;
  }
  return withEdgeCacheStatus(fresh,'MISS');
}
async function nativeScoreboard(request){if(request.method!=='GET')return jsonResponse({ok:false,error:'Method not allowed'},405,{Allow:'GET','Cache-Control':'no-store'});const headers={'Cache-Control':'public, s-maxage=15, stale-while-revalidate=30'};try{const upstream=await fetch(SCOREBOARD_URL,{headers:{'User-Agent':`TitansCommandCenter/${APP_VERSION}`},signal:AbortSignal.timeout(4500)});if(!upstream.ok)throw new Error(`ESPN ${upstream.status}`);return jsonResponse({ok:true,provider:'ESPN',unofficial:true,available:true,fetchedAt:new Date().toISOString(),payload:await upstream.json()},200,headers);}catch(error){console.error('[cloudflare-scoreboard]',error);return jsonResponse({ok:false,provider:'ESPN',unofficial:true,available:false,error:'Live scoreboard provider unavailable',fetchedAt:new Date().toISOString(),payload:{events:[]}},200,headers);}}
async function adapterRoute(request,route,handler,env){const req=vercelRequest(request,route);const res=vercelResponse();await handler(req,res.api,env);return res.result();}
async function cachedMarketData(request,env,ctx){
  const url=new URL(request.url);
  if(request.method!=='GET'||url.searchParams.size)return withEdgeCacheStatus(await adapterRoute(request,'market-data',marketDataRoute,env),'BYPASS');
  const cache=globalThis.caches?.default;
  if(!cache)return withEdgeCacheStatus(await adapterRoute(request,'market-data',marketDataRoute,env),'UNAVAILABLE');
  const key=marketCacheKey(request),hit=await cache.match(key);
  if(hit)return withEdgeCacheStatus(hit,'HIT');
  const fresh=await adapterRoute(request,'market-data',marketDataRoute,env);
  if(fresh.ok){const write=cache.put(key,fresh.clone()).catch(error=>console.warn('[market-edge-cache]',error));if(ctx?.waitUntil)ctx.waitUntil(write);else await write;}
  return withEdgeCacheStatus(fresh,'MISS');
}
async function cachedAdapterData(request,route,handler,env,ctx){
  const url=new URL(request.url);
  if(request.method!=='GET'||url.searchParams.size)return withEdgeCacheStatus(await adapterRoute(request,route,handler,env),'BYPASS');
  const cache=globalThis.caches?.default;
  if(!cache)return withEdgeCacheStatus(await adapterRoute(request,route,handler,env),'UNAVAILABLE');
  const key=apiCacheKey(request),hit=await cache.match(key);
  if(hit)return withEdgeCacheStatus(hit,'HIT');
  const fresh=await adapterRoute(request,route,handler,env);
  if(fresh.ok){const write=cache.put(key,fresh.clone()).catch(error=>console.warn(`[${route}-edge-cache]`,error));if(ctx?.waitUntil)ctx.waitUntil(write);else await write;}
  return withEdgeCacheStatus(fresh,'MISS');
}
async function cachedQueryAdapterData(request,route,handler,env,ctx,keys){
  if(request.method!=='GET')return withEdgeCacheStatus(await adapterRoute(request,route,handler,env),'BYPASS');
  const cache=globalThis.caches?.default;
  if(!cache)return withEdgeCacheStatus(await adapterRoute(request,route,handler,env),'UNAVAILABLE');
  const key=queryAwareApiCacheKey(request,keys),hit=await cache.match(key);
  if(hit)return withEdgeCacheStatus(hit,'HIT');
  let fresh=await adapterRoute(request,route,handler,env);
  if(edgeResponseCacheable(fresh)){
    fresh=withCacheControl(fresh,QUERY_CACHE_CONTROL);
    const write=cache.put(key,fresh.clone()).catch(error=>console.warn(`[${route}-query-edge-cache]`,error));
    if(ctx?.waitUntil)ctx.waitUntil(write);else await write;
  }
  return withEdgeCacheStatus(fresh,'MISS');
}
async function resilientAccountAuth(request,subpath){
  const response=await accountAuthProxy(request,subpath);
  if(!accountInfrastructureFailure(response.status))return response;
  try{await response.body?.cancel();}catch{}
  return subpath==='get-session'?guestSessionUnavailable():accountServiceUnavailable(response.status);
}
async function resilientFanIntel(request,env,ctx){
  const response=await cachedAdapterData(request,'fan-intel',fanIntelRoute,env,ctx);
  if(response.status<500)return response;
  try{await response.body?.cancel();}catch{}
  return withEdgeCacheStatus(jsonResponse(unavailableFanIntel(env),200,{'Cache-Control':'no-store'}),'BYPASS');
}
async function runApi(request,env,ctx){
  const url=new URL(request.url);const route=url.pathname.slice(API_PREFIX.length).replace(/^\/+|\/+$/g,'');if(!route)return jsonResponse({ok:false,error:'API route required'},404);
  try{
    if(route==='health')return await nativeHealth(request,env);
    if(route==='data')return await cachedNativeData(request,env,ctx);
    if(route==='espn-scoreboard')return await nativeScoreboard(request);
    if(route.startsWith('account/auth/'))return await resilientAccountAuth(request,route.slice('account/auth/'.length));
    if(route==='account/preferences')return await accountPreferencesRoute(request,env);
    if(route==='player')return await cachedQueryAdapterData(request,route,playerProfileRoute,env,ctx,['id']);
    if(route==='preseason-stats')return await adapterRoute(request,route,preseasonStatsRoute,env);
    if(route==='market-data')return await cachedMarketData(request,env,ctx);
    if(route==='advanced-analytics')return await cachedQueryAdapterData(request,route,advancedAnalyticsRoute,env,ctx,['season','team']);
    if(route==='fan-intel')return await resilientFanIntel(request,env,ctx);
    if(route==='tickets')return await cachedAdapterData(request,route,ticketsRoute,env,ctx);
    if(route==='social-pulse')return await cachedAdapterData(request,route,xSocialRoute,env,ctx);
    if(route==='media-videos')return await cachedAdapterData(request,route,youtubeMediaRoute,env,ctx);
    const req=vercelRequest(request,route);const res=vercelResponse();await apiHandler(req,res.api,env);return res.result();
  }catch(error){console.error('[cloudflare-api-adapter]',route,error);return jsonResponse({ok:false,error:'API request failed'},500);}
}
async function executeScheduledJob(env,job,run){const started=new Date();let result;try{result={job,...(await run())};}catch(error){console.error('[cloudflare-cron]',job,error);result={job,ok:false,error:'Sync job failed'};}const stored=await recordSyncRun(env,job,result,started);return {...result,auditStored:Boolean(stored.stored)};}
async function runScheduled(env){const jobs=[['official-audit',()=>syncTitansOfficialAudit(env)],['espn',()=>syncEspn(env)],['nflverse-roster',()=>syncNflverseRoster(env,2026)],['nflverse-stats',()=>syncNflverseStats(env,2026)],['nws-weather',()=>syncNwsNextHomeGame(env)],['bluesky',()=>syncBluesky(env,'Tennessee Titans',30)],['odds',()=>env.PROPLINE_API_KEY||env.ODDS_API_IO_KEY?syncFreeOdds(env):Promise.resolve({ok:true,skipped:true,source:'titans-cc',error:'No free odds API key configured'})]];const results=await Promise.all(jobs.map(([job,run])=>executeScheduledJob(env,job,run)));const succeeded=results.filter(r=>r?.ok&&!r?.skipped).length;const failed=results.filter(r=>!r?.ok&&!r?.skipped).length;console.log('[cloudflare-cron]',{succeeded,failed,results:results.map(r=>({job:r.job,ok:r.ok,skipped:Boolean(r.skipped),auditStored:Boolean(r.auditStored)}))});}
export default {async fetch(request,env,ctx){const pathname=new URL(request.url).pathname;if(pathname.startsWith(API_PREFIX))return runApi(request,env,ctx);return env.ASSETS.fetch(request);},async scheduled(_controller,env,ctx){ctx.waitUntil(runScheduled(env));}};
