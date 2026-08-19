import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import apiGateway from './api/index.js';

const root=path.dirname(fileURLToPath(import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const apiRoutes=new Map([
  ['/api/health','health'],['/api/provider-health','provider-health'],['/api/data','data'],['/api/player','player'],
  ['/api/analytics','analytics'],['/api/odds','odds'],['/api/bluesky-search','bluesky-search'],
  ['/api/espn-scoreboard','espn-scoreboard'],['/api/sync','sync'],['/api/cron-refresh','cron-refresh']
]);
function localRequest(req,url,route){return {method:req.method,headers:req.headers,query:{...Object.fromEntries(url.searchParams.entries()),route}}}
function localResponse(res){const facade={setHeader(k,v){res.setHeader(k,v);return facade},status(code){res.statusCode=code;return facade},json(payload){if(!res.headersSent)res.setHeader('content-type','application/json; charset=utf-8');res.end(JSON.stringify(payload));return facade}};return facade}
const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const route=apiRoutes.get(url.pathname);
  if(route){try{await apiGateway(localRequest(req,url,route),localResponse(res))}catch(error){console.error('[local-api]',url.pathname,error);if(!res.headersSent)res.setHeader('content-type','application/json; charset=utf-8');if(!res.writableEnded){res.statusCode=500;res.end(JSON.stringify({ok:false,error:'Local API handler failed'}))}}return}
  let pathname=decodeURIComponent(url.pathname);if(pathname==='/')pathname='/index.html';
  let file=path.normalize(path.join(root,pathname));
  if(!file.startsWith(root)){res.statusCode=403;return res.end('Forbidden')}
  try{if((await stat(file)).isDirectory())file=path.join(file,'index.html');const body=await readFile(file);res.setHeader('content-type',types[path.extname(file)]||'application/octet-stream');res.end(body)}catch{res.statusCode=404;res.end('Not found')}
});
const port=Number(process.env.PORT||4173);
server.listen(port,()=>console.log(`Titans Command Center http://localhost:${port}`));
