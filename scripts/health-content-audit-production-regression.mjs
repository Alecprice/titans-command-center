import fs from 'node:fs';

const base=String(process.env.WORKER_URL||process.env.PRODUCTION_URL||'https://titans-command-center.alecjordanprice.workers.dev').replace(/\/$/,'');
function assert(condition,message){if(!condition)throw new Error(message)}
function mergeProductionReport(key,value){const path='/tmp/cloudflare-smoke.json';assert(fs.existsSync(path),'Base production regression report is missing');const report=JSON.parse(fs.readFileSync(path,'utf8'));report[key]=value;fs.writeFileSync(path,JSON.stringify(report,null,2));}
const headers={'User-Agent':'TitansCommandCenter-HealthTruthAudit/1.0','Cache-Control':'no-cache, no-store','Pragma':'no-cache'};
async function getJson(path){const response=await fetch(`${base}${path}`,{headers,signal:AbortSignal.timeout(10000)});let body=null;try{body=await response.json()}catch{}return {response,body};}
function validAuditDate(value){const raw=String(value||'').slice(0,10);return /^\d{4}-\d{2}-\d{2}$/.test(raw)&&Number.isFinite(Date.parse(`${raw}T00:00:00Z`))?raw:'';}
function dataAuditDate(data){return validAuditDate(data?.snapshot?.fetchedAt)||validAuditDate(data?.fallback?.auditedAt)||validAuditDate(data?.dataQuality?.contentAuditAt)||validAuditDate(data?.meta?.content_audit_at);}

const started=Date.now();
const healthResult=await getJson('/api/health');
const {response,body}=healthResult;
assert(response.status===200,`Health returned ${response.status}`);
const status=String(body?.status||'');
assert(status==='healthy'||status==='degraded',`Unexpected health status: ${status||'missing'}`);
assert(body?.database?.provider==='cloudflare-d1',`Health storage provider is ${body?.database?.provider||'missing'} instead of cloudflare-d1`);
assert(body?.database?.configured===true,'Health no longer reports the configured D1 binding');

const dataResult=await getJson(`/api/data?health-truth=${Date.now()}`);
assert(dataResult.response.status===200,`Data API returned ${dataResult.response.status}`);
const data=dataResult.body;
assert(data?.ok===true,'Data API did not return a usable bootstrap snapshot');
const dataAudit=dataAuditDate(data);
assert(dataAudit,'Data API is missing a dated snapshot or audited verification marker');
assert(Date.parse(`${dataAudit}T00:00:00Z`)>=Date.parse('2026-08-27T00:00:00Z'),`Data API audit regressed to ${dataAudit}`);

let result;
if(status==='healthy'){
  assert(body?.database?.ok===true,'Healthy status requires a successful D1 health check');
  assert(body?.database?.snapshotFresh===true,'Healthy status requires a fresh bootstrap snapshot');
  const contentAudit=validAuditDate(body?.contentAudit);
  assert(contentAudit,'Healthy D1 mode is missing content audit metadata');
  assert(Date.parse(`${contentAudit}T00:00:00Z`)>=Date.parse('2026-08-27T00:00:00Z'),`Health content audit regressed to ${contentAudit}`);
  assert(data?.storage==='cloudflare-d1',`Healthy D1 mode served unexpected storage: ${data?.storage||'missing'}`);
  result={ok:true,mode:'d1-snapshot',status:response.status,healthStatus:status,contentAudit,dataAudit,databaseProvider:'cloudflare-d1',snapshotFresh:true,responseMs:Date.now()-started,testedAt:new Date().toISOString()};
}else{
  assert(body?.database?.ok===false,'Degraded status must preserve the failed D1 primary signal');
  assert(body?.database?.snapshotFresh===false,'Degraded status cannot claim a fresh bootstrap snapshot');
  assert(data?.mode==='audited-fallback',`Degraded Data API mode is ${data?.mode||'missing'} instead of audited-fallback`);
  assert(data?.databaseAvailable===false,'Degraded Data API must disclose that fresh primary data is unavailable');
  assert(data?.fallback?.active===true,'Degraded Data API must expose an active fallback marker');
  result={ok:true,mode:'audited-fallback',status:response.status,healthStatus:status,contentAudit:validAuditDate(body?.contentAudit)||null,fallbackContentAudit:dataAudit,databaseProvider:'cloudflare-d1',snapshotFresh:false,responseMs:Date.now()-started,testedAt:new Date().toISOString()};
}

mergeProductionReport('healthTruth',result);
console.log(JSON.stringify(result,null,2));
