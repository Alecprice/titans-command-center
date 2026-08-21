import apiHandler from '../api/index.js';
import {databaseHealth,getBootstrapData,getSql} from '../src/db.mjs';
import {getAuditedTeamContext} from '../src/team-context.mjs';
import {preseasonStatsRoute} from '../src/preseason-api.mjs';
import {marketDataRoute} from '../src/market-api.mjs';
import {advancedAnalyticsRoute} from '../src/advanced-analytics-api.mjs';
import {fanIntelRoute} from '../src/fan-intel-api.mjs';
import {syncTitansOfficialAudit,syncBluesky,syncEspn,syncNflverseRoster,syncNflverseStats,syncNwsNextHomeGame,syncFreeOdds,recordSyncRun} from '../src/ingest.mjs';

const API_PREFIX='/api/';
const APP_VERSION='1.0.0';
const SERVER_BINDINGS=['DATABASE_URL','INGEST_SECRET','CRON_SECRET','PROPLINE_API_KEY','ODDS_API_IO_KEY','PROPLINE_BOOKS','PROPLINE_EXTRA_MARKETS','ODDS_API_IO_BOOKS','ODDS_CACHE_SECONDS','TITANS_HISTORY_START','TITANS_HISTORY_END','CONTINUE_ON_IMPORT_ERROR'];

function applyRuntimeEnv(env){
  for(const key of SERVER_BINDINGS){
    const value=env?.[key];
    if(value!==undefined&&value!==null)process.env[key]=String(value);
  }
}

function requestHeaders(headers){
  const out={};
  for(const [key,value] of headers.entries())out[key.toLowerCase()]=value;
  return out;
}

function requestQuery(url,route){
  const query={route};
  for(const [key,value] of url.searchParams.entries()){
    if(key==='route')continue;
    const current=query[key];
    if(current===undefined)query[key]=value;
    else if(Array.isArray(current))current.push(value);
    else query[key]=[current,value];
  }
  return query;
}

function vercelRequest(request,route){
  const url=new URL(request.url);
  return {method:request.method,headers:requestHeaders(request.headers),query:requestQuery(url,route),url:`${url.pathname}${url.search}`};
}

function vercelResponse(){
  let statusCode=200;
  let response=null;
  const headers=new Headers();
  const api={
    setHeader(name,value){
      if(Array.isArray(value)){
        headers.delete(name);
        for(const item of value)headers.append(name,String(item));
      }else headers.set(name,String(value));
      return api;
    },
    getHeader(name){return headers.get(name)},
    status(code){statusCode=Number(code)||200;return api},
    json(payload){
      if(!headers.has('Content-Type'))headers.set('Content-Type','application/json; charset=utf-8');
      response=new Response(JSON.stringify(payload),{status:statusCode,headers});
      return response;
    },
    send(payload=''){
      const body=typeof payload==='string'||payload instanceof ArrayBuffer?payload:JSON.stringify(payload);
      response=new Response(body,{status:statusCode,headers});
      return response;
    },
    end(payload=''){
      response=new Response(payload,{status:statusCode,headers});
      return response;
    }
  };
  return {api,result:()=>response||new Response(null,{status:statusCode,headers})};
}

function jsonResponse(payload,status=200,headers={}){
  return new Response(JSON.stringify(payload),{status,headers:{'Content-Type':'application/json; charset=utf-8',...headers}});
}

async function nativeHealth(request,env){
  if(request.method!=='GET')return jsonResponse({ok:false,error:'Method not allowed'},405,{Allow:'GET','Cache-Control':'no-store'});
  const db=await databaseHealth(env);
  return jsonResponse({
    ok:true,status:db.ok?'healthy':'degraded',app:'titans-command-center',version:APP_VERSION,contentAudit:'2026-08-19',time:new Date().toISOString(),database:db,
    providers:{propLine:Boolean(env?.PROPLINE_API_KEY),oddsApiIo:Boolean(env?.ODDS_API_IO_KEY),espnFallback:true,nws:true},
    fallbacks:{auditedRoster:true,officialPreseasonGamebook:true,marketReference:true}
  },200,{'Cache-Control':'no-store'});
}

async function nativeData(request,env){
  if(request.method!=='GET')return jsonResponse({ok:false,error:'Method not allowed'},405,{Allow:'GET'});
  const headers={'Cache-Control':'public, s-maxage=30, stale-while-revalidate=120'};
  const data=await getBootstrapData(env);
  if(!data.configured)return jsonResponse({ok:false,configured:false,error:'DATABASE_URL is not configured'},503,headers);
  if(!data.ok)return jsonResponse(data,503,headers);
  const sql=await getSql(env);
  const teamContext=await getAuditedTeamContext(sql);
  return jsonResponse({...data,teamContext},200,headers);
}

async function adapterRoute(request,route,handler,env){
  const req=vercelRequest(request,route);
  const res=vercelResponse();
  await handler(req,res.api,env);
  return res.result();
}

async function runApi(request,env){
  const url=new URL(request.url);
  const route=url.pathname.slice(API_PREFIX.length).replace(/^\/+|\/+$/g,'');
  if(!route)return jsonResponse({ok:false,error:'API route required'},404);
  try{
    if(route==='health')return await nativeHealth(request,env);
    if(route==='data')return await nativeData(request,env);
    if(route==='preseason-stats')return await adapterRoute(request,route,preseasonStatsRoute,env);
    if(route==='market-data')return await adapterRoute(request,route,marketDataRoute,env);
    if(route==='advanced-analytics')return await adapterRoute(request,route,advancedAnalyticsRoute,env);
    if(route==='fan-intel')return await adapterRoute(request,route,fanIntelRoute,env);

    // Legacy routes still share the Vercel-compatible gateway. Mirror bindings for
    // those routes until the remaining handlers are migrated to explicit env args.
    applyRuntimeEnv(env);
    const req=vercelRequest(request,route);
    const res=vercelResponse();
    await apiHandler(req,res.api);
    return res.result();
  }catch(error){
    console.error('[cloudflare-api-adapter]',route,error);
    return jsonResponse({ok:false,error:'API request failed'},500);
  }
}

async function executeScheduledJob(env,job,run){
  const started=new Date();
  let result;
  try{result={job,...(await run())};}
  catch(error){console.error('[cloudflare-cron]',job,error);result={job,ok:false,error:'Sync job failed'};}
  const stored=await recordSyncRun(env,job,result,started);
  return {...result,auditStored:Boolean(stored.stored)};
}

async function runScheduled(env){
  const jobs=[
    ['official-audit',()=>syncTitansOfficialAudit(env)],
    ['espn',()=>syncEspn(env)],
    ['nflverse-roster',()=>syncNflverseRoster(env,2026)],
    ['nflverse-stats',()=>syncNflverseStats(env,2026)],
    ['nws-weather',()=>syncNwsNextHomeGame(env)],
    ['bluesky',()=>syncBluesky(env,'Tennessee Titans',30)],
    ['odds',()=>env.PROPLINE_API_KEY||env.ODDS_API_IO_KEY?syncFreeOdds(env):Promise.resolve({ok:true,skipped:true,source:'titans-cc',error:'No free odds API key configured'})]
  ];
  const results=await Promise.all(jobs.map(([job,run])=>executeScheduledJob(env,job,run)));
  const succeeded=results.filter(r=>r?.ok&&!r?.skipped).length;
  const failed=results.filter(r=>!r?.ok&&!r?.skipped).length;
  console.log('[cloudflare-cron]',{succeeded,failed,results:results.map(r=>({job:r.job,ok:r.ok,skipped:Boolean(r.skipped),auditStored:Boolean(r.auditStored)}))});
}

export default {
  async fetch(request,env){
    const pathname=new URL(request.url).pathname;
    if(pathname.startsWith(API_PREFIX))return runApi(request,env);
    return env.ASSETS.fetch(request);
  },
  async scheduled(_controller,env,ctx){
    ctx.waitUntil(runScheduled(env));
  }
};