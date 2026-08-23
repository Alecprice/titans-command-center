import fs from 'node:fs';

const base=String(process.env.WORKER_URL||process.env.PRODUCTION_URL||'https://titans-command-center.alecjordanprice.workers.dev').replace(/\/$/,'');
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function assert(condition,message){if(!condition)throw new Error(message)}
function mergeProductionReport(key,value){const path='/tmp/cloudflare-smoke.json';assert(fs.existsSync(path),'Base production regression report is missing');const report=JSON.parse(fs.readFileSync(path,'utf8'));report[key]=value;fs.writeFileSync(path,JSON.stringify(report,null,2));}
async function fetchMarket(){
  const started=Date.now();
  const response=await fetch(`${base}/api/market-data`,{
    headers:{'User-Agent':'TitansCommandCenter-MarketCacheAudit/1.0','Cache-Control':'no-cache'},
    signal:AbortSignal.timeout(15000)
  });
  const body=await response.json();
  return {status:response.status,ok:body?.ok===true,edgeCache:(response.headers.get('x-titans-edge-cache')||'').toUpperCase(),durationMs:Date.now()-started,rows:Array.isArray(body?.odds)?body.odds.length:0};
}

const attempts=[];
let current=await fetchMarket();
attempts.push(current);
assert(current.status===200&&current.ok,`Initial market request failed: ${current.status}`);
assert(['HIT','MISS'].includes(current.edgeCache),`Initial market cache status is ${current.edgeCache||'missing'}; expected HIT or MISS`);
for(let attempt=2;current.edgeCache!=='HIT'&&attempt<=4;attempt++){
  await wait(350);
  current=await fetchMarket();
  attempts.push(current);
  assert(current.status===200&&current.ok,`Warm market request ${attempt} failed: ${current.status}`);
}
assert(current.edgeCache==='HIT',`Market edge cache never warmed; statuses: ${attempts.map(item=>item.edgeCache||'missing').join(' -> ')}`);
const result={ok:true,base,initialStatus:attempts[0].edgeCache,finalStatus:current.edgeCache,attempts:attempts.length,coldOrInitialMs:attempts[0].durationMs,warmHitMs:current.durationMs,rows:current.rows,sequence:attempts.map(item=>({status:item.edgeCache,durationMs:item.durationMs,rows:item.rows})),testedAt:new Date().toISOString()};
fs.writeFileSync('/tmp/market-cache-production-smoke.json',JSON.stringify(result,null,2));
mergeProductionReport('marketEdgeCache',result);
console.log(JSON.stringify(result,null,2));
