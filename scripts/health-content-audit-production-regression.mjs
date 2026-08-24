import fs from 'node:fs';

const base=String(process.env.WORKER_URL||process.env.PRODUCTION_URL||'https://titans-command-center.alecjordanprice.workers.dev').replace(/\/$/,'');
function assert(condition,message){if(!condition)throw new Error(message)}
function mergeProductionReport(key,value){const path='/tmp/cloudflare-smoke.json';assert(fs.existsSync(path),'Base production regression report is missing');const report=JSON.parse(fs.readFileSync(path,'utf8'));report[key]=value;fs.writeFileSync(path,JSON.stringify(report,null,2));}

const started=Date.now();
const response=await fetch(`${base}/api/health`,{headers:{'User-Agent':'TitansCommandCenter-HealthTruthAudit/1.0','Cache-Control':'no-cache'},signal:AbortSignal.timeout(10000)});
const body=await response.json();
const contentAudit=String(body?.contentAudit||'');
const databaseAudit=String(body?.database?.content_audit_at||'');
assert(response.status===200,`Health returned ${response.status}`);
assert(body?.status==='healthy','Health is not healthy');
assert(contentAudit&&databaseAudit,'Health content audit metadata is missing');
assert(contentAudit===databaseAudit,`Health content audit drifted from Neon: health=${contentAudit||'missing'} database=${databaseAudit||'missing'}`);
assert(Date.parse(`${contentAudit}T00:00:00Z`)>=Date.parse('2026-08-24T00:00:00Z'),`Health content audit regressed to ${contentAudit}`);
const result={ok:true,status:response.status,contentAudit,databaseContentAudit:databaseAudit,responseMs:Date.now()-started,testedAt:new Date().toISOString()};
mergeProductionReport('healthTruth',result);
console.log(JSON.stringify(result,null,2));
