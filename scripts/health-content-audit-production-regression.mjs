import fs from 'node:fs';

const base=String(process.env.WORKER_URL||process.env.PRODUCTION_URL||'https://titans-command-center.alecjordanprice.workers.dev').replace(/\/$/,'');
function assert(condition,message){if(!condition)throw new Error(message)}
function mergeProductionReport(key,value){const path='/tmp/cloudflare-smoke.json';assert(fs.existsSync(path),'Base production regression report is missing');const report=JSON.parse(fs.readFileSync(path,'utf8'));report[key]=value;fs.writeFileSync(path,JSON.stringify(report,null,2));}
const headers={'User-Agent':'TitansCommandCenter-HealthTruthAudit/1.0','Cache-Control':'no-cache, no-store','Pragma':'no-cache'};
async function getJson(path){const response=await fetch(`${base}${path}`,{headers,signal:AbortSignal.timeout(10000)});let body=null;try{body=await response.json()}catch{}return {response,body};}
function validAuditDate(value){const raw=String(value||'').slice(0,10);return /^\d{4}-\d{2}-\d{2}$/.test(raw)&&Number.isFinite(Date.parse(`${raw}T00:00:00Z`))?raw:'';}

const started=Date.now();
const healthResult=await getJson('/api/health');
const {response,body}=healthResult;
assert(response.status===200,`Health returned ${response.status}`);
const status=String(body?.status||'');
assert(status==='healthy'||status==='degraded',`Unexpected health status: ${status||'missing'}`);
assert(body?.database?.configured===true,'Health no longer reports the configured Neon dependency');

let result;
if(status==='healthy'){
  assert(body?.database?.ok===true,'Healthy status requires a successful Neon health check');
  const contentAudit=validAuditDate(body?.contentAudit);
  const databaseAudit=validAuditDate(body?.database?.content_audit_at);
  assert(contentAudit&&databaseAudit,'Healthy mode is missing database-backed content audit metadata');
  assert(contentAudit===databaseAudit,`Health content audit drifted from Neon: health=${contentAudit||'missing'} database=${databaseAudit||'missing'}`);
  assert(Date.parse(`${contentAudit}T00:00:00Z`)>=Date.parse('2026-08-24T00:00:00Z'),`Health content audit regressed to ${contentAudit}`);
  result={ok:true,mode:'live-database',status:response.status,healthStatus:status,contentAudit,databaseContentAudit:databaseAudit,databaseAvailable:true,responseMs:Date.now()-started,testedAt:new Date().toISOString()};
}else{
  assert(body?.database?.ok===false,'Degraded status must preserve the failed Neon health check');
  const dataResult=await getJson(`/api/data?health-truth=${Date.now()}`);
  assert(dataResult.response.status===200,`Degraded Data API returned ${dataResult.response.status}`);
  const data=dataResult.body;
  assert(data?.ok===true,'Degraded Data API did not return a usable audited snapshot');
  assert(data?.mode==='audited-fallback',`Degraded Data API mode is ${data?.mode||'missing'} instead of audited-fallback`);
  assert(data?.databaseAvailable===false,'Degraded Data API must disclose that the live database is unavailable');
  assert(data?.fallback?.active===true,'Degraded Data API must expose an active fallback marker');
  const fallbackAudit=validAuditDate(data?.fallback?.auditedAt||data?.dataQuality?.contentAuditAt||data?.meta?.content_audit_at);
  assert(fallbackAudit,'Audited fallback is missing a dated verification marker');
  assert(Date.parse(`${fallbackAudit}T00:00:00Z`)>=Date.parse('2026-08-27T00:00:00Z'),`Audited fallback regressed to ${fallbackAudit}`);
  const healthContentAudit=validAuditDate(body?.contentAudit);
  const databaseAudit=validAuditDate(body?.database?.content_audit_at);
  assert(!healthContentAudit&&!databaseAudit,'Degraded health must not present stale database audit metadata as current');
  result={ok:true,mode:'audited-fallback',status:response.status,healthStatus:status,contentAudit:null,databaseContentAudit:null,fallbackContentAudit:fallbackAudit,databaseAvailable:false,responseMs:Date.now()-started,testedAt:new Date().toISOString()};
}

mergeProductionReport('healthTruth',result);
console.log(JSON.stringify(result,null,2));
