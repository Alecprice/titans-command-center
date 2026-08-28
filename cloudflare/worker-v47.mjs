import baseWorker from './worker.mjs';
import {ticketsRoute} from '../src/tickets-api.mjs';

function requestHeaders(headers){const out={};for(const [key,value] of headers.entries())out[key.toLowerCase()]=value;return out;}
function requestQuery(url){const query={route:'tickets'};for(const [key,value] of url.searchParams.entries()){const current=query[key];if(current===undefined)query[key]=value;else if(Array.isArray(current))current.push(value);else query[key]=[current,value];}return query;}
function vercelResponse(){
  let statusCode=200,response=null;const headers=new Headers();
  const api={
    setHeader(name,value){if(Array.isArray(value)){headers.delete(name);for(const item of value)headers.append(name,String(item));}else headers.set(name,String(value));return api;},
    status(code){statusCode=Number(code)||200;return api;},
    json(payload){if(!headers.has('Content-Type'))headers.set('Content-Type','application/json; charset=utf-8');response=new Response(JSON.stringify(payload),{status:statusCode,headers});return response;},
  };
  return {api,result:()=>response||new Response(null,{status:statusCode,headers})};
}
async function ticketResponse(request,env){
  const url=new URL(request.url);
  const req={method:request.method,headers:requestHeaders(request.headers),query:requestQuery(url),url:`${url.pathname}${url.search}`};
  const res=vercelResponse();
  await ticketsRoute(req,res.api,env);
  return res.result();
}

export default {
  async fetch(request,env,ctx){
    if(new URL(request.url).pathname==='/api/tickets'){
      try{return await ticketResponse(request,env);}catch(error){console.error('[cloudflare-tickets]',error);return new Response(JSON.stringify({ok:false,error:'Ticket inventory request failed'}),{status:500,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});}
    }
    return baseWorker.fetch(request,env,ctx);
  },
  async scheduled(controller,env,ctx){return baseWorker.scheduled?.(controller,env,ctx);},
};
