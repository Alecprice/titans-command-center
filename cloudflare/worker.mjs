import apiHandler from '../api/index.js';
import {syncTitansOfficialAudit,syncBluesky,syncEspn,syncNflverseRoster,syncNflverseStats,syncNwsNextHomeGame,syncFreeOdds,recordSyncRun} from '../src/ingest.mjs';

const API_PREFIX='/api/';

function requestHeaders(headers){
  const out={};
  for(const [key,value] of headers.entries()) out[key.toLowerCase()]=value;
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
  return {
    method:request.method,
    headers:requestHeaders(request.headers),
    query:requestQuery(url,route),
    url:`${url.pathname}${url.search}`
  };
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

async function runApi(request){
  const url=new URL(request.url);
  const route=url.pathname.slice(API_PREFIX.length).replace(/^\/+|\/+$/g,'');
  if(!route)return Response.json({ok:false,error:'API route required'},{status:404});
  const req=vercelRequest(request,route);
  const res=vercelResponse();
  try{
    await apiHandler(req,res.api);
    return res.result();
  }catch(error){
    console.error('[cloudflare-api-adapter]',route,error);
    return Response.json({ok:false,error:'API request failed'},{status:500});
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
    if(pathname.startsWith(API_PREFIX))return runApi(request);
    return env.ASSETS.fetch(request);
  },
  async scheduled(_controller,env,ctx){
    ctx.waitUntil(runScheduled(env));
  }
};
