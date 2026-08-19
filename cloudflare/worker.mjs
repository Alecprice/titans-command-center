import apiHandler from '../api/index.js';

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

async function runScheduled(env){
  const secret=env.CRON_SECRET||env.INGEST_SECRET;
  if(!secret){
    console.warn('[cloudflare-cron] CRON_SECRET/INGEST_SECRET is not configured; scheduled refresh skipped.');
    return;
  }
  const request=new Request('https://internal.titans-command-center/api/cron-refresh',{
    method:'GET',
    headers:{authorization:`Bearer ${secret}`}
  });
  const response=await runApi(request);
  if(!response.ok)console.error('[cloudflare-cron] refresh failed',response.status,await response.text());
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
