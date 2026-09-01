import fs from 'node:fs';

const REPORT_PATH='/tmp/custom-domain-smoke.json';
const EXPECTED_CUSTOM_HOST='titans.alecjprice.com';
const EXPECTED_ORIGIN_HOST='titans-command-center.alecjordanprice.workers.dev';
const REVISION_CONVERGENCE_ATTEMPTS=6;
const REVISION_CONVERGENCE_DELAY_MS=2500;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const assert=(condition,message)=>{if(!condition)throw new Error(message)};

function normalizeBase(raw,label,expectedHost){
  const url=new URL(String(raw||''));
  assert(url.protocol==='https:',`${label} must use HTTPS`);
  assert(url.hostname===expectedHost,`${label} must target ${expectedHost}, got ${url.hostname||'missing host'}`);
  assert((url.pathname==='/'||url.pathname==='')&&!url.search&&!url.hash,`${label} must be an origin URL without a path, query, or hash`);
  return url.origin;
}

const canonical=normalizeBase(process.env.CUSTOM_DOMAIN_URL||`https://${EXPECTED_CUSTOM_HOST}`,'Custom domain',EXPECTED_CUSTOM_HOST);
const origin=normalizeBase(process.env.ORIGIN_URL||`https://${EXPECTED_ORIGIN_HOST}`,'Worker origin',EXPECTED_ORIGIN_HOST);
assert(canonical!==origin,'Custom domain and Worker origin must remain distinct');

async function request(base,path,{json=false,retries=4}={}){
  let lastError;
  for(let attempt=1;attempt<=retries;attempt++){
    const started=Date.now();
    try{
      const response=await fetch(`${base}${path}`,{
        cache:'no-store',
        headers:{
          'User-Agent':'TitansCommandCenter-CustomDomainAudit/1.0',
          'Cache-Control':'no-cache, no-store',
          'Pragma':'no-cache',
          'Accept':json?'application/json':'*/*'
        },
        signal:AbortSignal.timeout(15000)
      });
      const body=json?await response.json():await response.text();
      return {status:response.status,body,headers:response.headers,durationMs:Date.now()-started};
    }catch(error){
      lastError=error;
      if(attempt<retries)await wait(1500*attempt);
    }
  }
  throw lastError;
}

async function revisionPair(){
  const [canonicalMeta,originMeta]=await Promise.all([
    request(canonical,'/build-meta.json',{json:true}),
    request(origin,'/build-meta.json',{json:true})
  ]);
  assert(canonicalMeta.status===200,`Custom-domain build metadata returned ${canonicalMeta.status}`);
  assert(originMeta.status===200,`Worker-origin build metadata returned ${originMeta.status}`);
  assert(canonicalMeta.body?.commit&&originMeta.body?.commit,'Build metadata is missing a deployed commit');
  return {canonicalMeta,originMeta};
}

async function waitForRevisionConvergence(){
  let lastPair=null;
  for(let attempt=1;attempt<=REVISION_CONVERGENCE_ATTEMPTS;attempt++){
    const pair=await revisionPair();
    lastPair=pair;
    const customCommit=pair.canonicalMeta.body.commit;
    const originCommit=pair.originMeta.body.commit;
    if(customCommit===originCommit)return {...pair,attempts:attempt};
    if(attempt<REVISION_CONVERGENCE_ATTEMPTS){
      console.warn(`[custom-domain-regression] revision propagation pending (${attempt}/${REVISION_CONVERGENCE_ATTEMPTS}): custom=${customCommit}, origin=${originCommit}`);
      await wait(REVISION_CONVERGENCE_DELAY_MS);
    }
  }
  throw new Error(`CloudFront and Worker revisions did not converge after ${REVISION_CONVERGENCE_ATTEMPTS} attempts: custom=${lastPair?.canonicalMeta?.body?.commit||'unknown'}, origin=${lastPair?.originMeta?.body?.commit||'unknown'}`);
}

function securityHeaders(response){
  return {
    contentTypeOptions:(response.headers.get('x-content-type-options')||'').toLowerCase(),
    frameOptions:(response.headers.get('x-frame-options')||'').toUpperCase(),
    referrerPolicy:(response.headers.get('referrer-policy')||'').toLowerCase(),
    contentSecurityPolicy:response.headers.get('content-security-policy')||'',
    robots:(response.headers.get('x-robots-tag')||'').toLowerCase()
  };
}

function cloudFrontEvidence(response){
  return {
    requestId:response.headers.get('x-amz-cf-id')||null,
    pop:response.headers.get('x-amz-cf-pop')||null,
    via:response.headers.get('via')||null,
    cache:response.headers.get('x-cache')||null
  };
}

function writeReport(payload){
  try{fs.writeFileSync(REPORT_PATH,JSON.stringify(payload,null,2));}catch{}
}

try{
  const {canonicalMeta,originMeta,attempts:revisionAttempts}=await waitForRevisionConvergence();
  const [canonicalRoot,originRoot,health]=await Promise.all([
    request(canonical,'/'),
    request(origin,'/'),
    request(canonical,'/api/health',{json:true})
  ]);

  assert(canonicalMeta.body.commit===originMeta.body.commit,`CloudFront is not serving the current Worker revision: custom=${canonicalMeta.body.commit}, origin=${originMeta.body.commit}`);
  assert(canonicalMeta.body?.version===originMeta.body?.version,`CloudFront and Worker versions differ: custom=${canonicalMeta.body?.version||'unknown'}, origin=${originMeta.body?.version||'unknown'}`);

  assert(canonicalRoot.status===200,`Custom-domain root returned ${canonicalRoot.status}`);
  assert(originRoot.status===200,`Worker-origin root returned ${originRoot.status}`);
  const canonicalHeaders=securityHeaders(canonicalRoot);
  const originHeaders=securityHeaders(originRoot);
  assert(originHeaders.robots.includes('noindex'),'workers.dev origin must remain staging-only with X-Robots-Tag: noindex');
  assert(!canonicalHeaders.robots.includes('noindex'),'Canonical custom domain must remove the workers.dev noindex header');
  assert(canonicalHeaders.contentTypeOptions==='nosniff','Custom domain is missing X-Content-Type-Options: nosniff');
  assert(canonicalHeaders.frameOptions==='DENY','Custom domain is missing X-Frame-Options: DENY');
  assert(canonicalHeaders.referrerPolicy==='strict-origin-when-cross-origin','Custom domain has an unexpected Referrer-Policy');
  assert(canonicalHeaders.contentSecurityPolicy.includes("frame-ancestors 'none'"),'Custom domain is missing CSP frame-ancestors protection');

  const cloudFront=cloudFrontEvidence(canonicalRoot);
  const cloudFrontSeen=Boolean(cloudFront.requestId||cloudFront.pop||/cloudfront/i.test(cloudFront.via||'')||/cloudfront/i.test(cloudFront.cache||''));
  assert(cloudFrontSeen,'Canonical hostname does not expose expected CloudFront viewer evidence');

  assert(health.status===200,`Custom-domain health API returned ${health.status}`);
  assert(['healthy','degraded'].includes(health.body?.status),`Custom-domain application health is invalid: ${health.body?.status||'unknown'}`);
  assert(health.body?.database?.provider==='cloudflare-d1',`Custom-domain primary database provider is ${health.body?.database?.provider||'missing'}, expected cloudflare-d1`);
  assert(health.body?.database?.configured===true,'Custom-domain health does not report the D1 binding as configured');

  const result={
    ok:true,
    canonical,
    origin,
    deployedCommit:canonicalMeta.body.commit,
    version:canonicalMeta.body.version||null,
    revisionAttempts,
    cloudFront,
    canonicalSecurity:{...canonicalHeaders,csp:Boolean(canonicalHeaders.contentSecurityPolicy)},
    originRobots:originHeaders.robots,
    health:{status:health.body?.status||null,databaseProvider:health.body?.database?.provider||null,databaseConfigured:Boolean(health.body?.database?.configured),snapshotFresh:Boolean(health.body?.database?.snapshotFresh)},
    responseMs:{canonicalMeta:canonicalMeta.durationMs,originMeta:originMeta.durationMs,canonicalRoot:canonicalRoot.durationMs,originRoot:originRoot.durationMs,health:health.durationMs},
    testedAt:new Date().toISOString()
  };
  writeReport(result);
  console.log(JSON.stringify(result,null,2));
}catch(error){
  const message=error instanceof Error?error.message:String(error);
  writeReport({ok:false,canonical,origin,error:message,testedAt:new Date().toISOString()});
  console.error('[custom-domain-regression]',message);
  process.exitCode=1;
}
