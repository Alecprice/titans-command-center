import fs from 'node:fs';

const REPORT_PATH='/tmp/custom-domain-smoke.json';
const EXPECTED_CUSTOM_HOST='titans.alecjprice.com';
const EXPECTED_ORIGIN_HOST='titans-command-center.alecjordanprice.workers.dev';
const EXPECTED_SHA=String(process.env.EXPECTED_SHA||process.env.GITHUB_SHA||'').trim().toLowerCase();
const REVISION_CONVERGENCE_ATTEMPTS=6;
const REVISION_CONVERGENCE_DELAY_MS=2500;
const SHELL_CONVERGENCE_ATTEMPTS=8;
const SHELL_CONVERGENCE_DELAY_MS=2500;
const CRITICAL_SHELL_PATHS=[
  '/',
  '/index.html',
  '/sw.js',
  '/app.js',
  '/tickets-price-fallback-v58.js',
  '/tickets-tenx-v123.js',
  '/tickets-compare-v125.js',
  '/tickets-compare-cache-bridge-v141.js'
];
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const assert=(condition,message)=>{if(!condition)throw new Error(message)};

assert(/^[0-9a-f]{40}$/.test(EXPECTED_SHA),'Front-door verification requires the exact 40-character release SHA via EXPECTED_SHA or GITHUB_SHA');

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

function localPath(path){return path==='/'?'index.html':path.replace(/^\//,'');}
function expectedStaticBody(path){return fs.readFileSync(localPath(path),'utf8');}
function cacheControl(response){return String(response.headers.get('cache-control')||'').toLowerCase();}

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

async function revisionAt(base,label){
  const meta=await request(base,'/build-meta.json',{json:true});
  assert(meta.status===200,`${label} build metadata returned ${meta.status}`);
  const commit=String(meta.body?.commit||'').trim().toLowerCase();
  assert(/^[0-9a-f]{7,40}$/.test(commit),`${label} build metadata is missing a valid deployed commit`);
  return {...meta,commit};
}

async function waitForCanonicalRevision(){
  let lastMeta=null;
  for(let attempt=1;attempt<=REVISION_CONVERGENCE_ATTEMPTS;attempt++){
    const meta=await revisionAt(canonical,'Custom-domain');
    lastMeta=meta;
    if(meta.commit===EXPECTED_SHA)return {meta,attempts:attempt};
    if(attempt<REVISION_CONVERGENCE_ATTEMPTS){
      console.warn(`[custom-domain-regression] canonical revision propagation pending (${attempt}/${REVISION_CONVERGENCE_ATTEMPTS}): expected=${EXPECTED_SHA}, observed=${meta.commit}`);
      await wait(REVISION_CONVERGENCE_DELAY_MS);
    }
  }
  throw new Error(`Canonical hostname did not reach expected release ${EXPECTED_SHA} after ${REVISION_CONVERGENCE_ATTEMPTS} attempts: observed=${lastMeta?.commit||'unknown'}`);
}

async function shellPair(path){
  const [canonicalAsset,originAsset]=await Promise.all([
    request(canonical,path,{retries:1}),
    request(origin,path,{retries:1})
  ]);
  return {canonical:canonicalAsset,origin:originAsset};
}

async function waitForShellReadiness(){
  const expected=new Map(CRITICAL_SHELL_PATHS.map(path=>[path,expectedStaticBody(path)]));
  let lastMismatches=[];
  for(let attempt=1;attempt<=SHELL_CONVERGENCE_ATTEMPTS;attempt++){
    const entries=await Promise.all(CRITICAL_SHELL_PATHS.map(async path=>[path,await shellPair(path)]));
    const pairs=Object.fromEntries(entries);
    const mismatches=[];
    for(const path of CRITICAL_SHELL_PATHS){
      const pair=pairs[path],body=expected.get(path);
      if(pair.canonical.status!==200)mismatches.push(`${path}:canonical-status-${pair.canonical.status}`);
      else if(pair.canonical.body!==body)mismatches.push(`${path}:canonical-stale`);
      if(pair.origin.status!==200)mismatches.push(`${path}:rollback-status-${pair.origin.status}`);
    }
    if(!mismatches.length)return {pairs,attempts:attempt};
    lastMismatches=mismatches;
    if(attempt<SHELL_CONVERGENCE_ATTEMPTS){
      console.warn(`[custom-domain-regression] shell readiness pending (${attempt}/${SHELL_CONVERGENCE_ATTEMPTS}): ${mismatches.join(', ')}`);
      await wait(SHELL_CONVERGENCE_DELAY_MS);
    }
  }
  throw new Error(`Canonical shell did not match checked-out release or rollback shell was unavailable after ${SHELL_CONVERGENCE_ATTEMPTS} attempts: ${lastMismatches.join(', ')||'unknown mismatch'}`);
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

function validateHealth(result,label){
  assert(result.status===200,`${label} health API returned ${result.status}`);
  assert(['healthy','degraded'].includes(result.body?.status),`${label} application health is invalid: ${result.body?.status||'unknown'}`);
  assert(result.body?.database?.provider==='cloudflare-d1',`${label} primary database provider is ${result.body?.database?.provider||'missing'}, expected cloudflare-d1`);
  assert(result.body?.database?.configured===true,`${label} health does not report the D1 binding as configured`);
}

function writeReport(payload){
  try{fs.writeFileSync(REPORT_PATH,JSON.stringify(payload,null,2));}catch{}
}

try{
  const {meta:canonicalMeta,attempts:revisionAttempts}=await waitForCanonicalRevision();
  const originMeta=await revisionAt(origin,'Worker rollback');
  const {pairs:shellPairs,attempts:shellPropagationAttempts}=await waitForShellReadiness();
  const canonicalRoot=shellPairs['/'].canonical;
  const originRoot=shellPairs['/'].origin;
  const canonicalSw=shellPairs['/sw.js'].canonical;
  const canonicalTicketCompare=shellPairs['/tickets-compare-v125.js'].canonical;
  const [health,originHealth]=await Promise.all([
    request(canonical,'/api/health',{json:true}),
    request(origin,'/api/health',{json:true})
  ]);

  assert(canonicalMeta.commit===EXPECTED_SHA,`Canonical hostname is not serving expected release: expected=${EXPECTED_SHA}, observed=${canonicalMeta.commit}`);

  assert(canonicalRoot.status===200,`Custom-domain root returned ${canonicalRoot.status}`);
  assert(originRoot.status===200,`Worker rollback root returned ${originRoot.status}`);
  const canonicalHeaders=securityHeaders(canonicalRoot);
  const originHeaders=securityHeaders(originRoot);
  assert(originHeaders.robots.includes('noindex'),'workers.dev rollback surface must remain staging-only with X-Robots-Tag: noindex');
  assert(!canonicalHeaders.robots.includes('noindex'),'Canonical custom domain must remove the workers.dev noindex header');
  assert(canonicalHeaders.contentTypeOptions==='nosniff','Custom domain is missing X-Content-Type-Options: nosniff');
  assert(canonicalHeaders.frameOptions==='DENY','Custom domain is missing X-Frame-Options: DENY');
  assert(canonicalHeaders.referrerPolicy==='strict-origin-when-cross-origin','Custom domain has an unexpected Referrer-Policy');
  assert(canonicalHeaders.contentSecurityPolicy.includes("frame-ancestors 'none'"),'Custom domain is missing CSP frame-ancestors protection');

  assert(cacheControl(canonicalRoot).includes('no-store'),`Canonical root cache policy can retain stale shell HTML: ${cacheControl(canonicalRoot)||'missing'}`);
  assert(cacheControl(canonicalSw).includes('no-store'),`Canonical service worker cache policy can retain a stale shell generation: ${cacheControl(canonicalSw)||'missing'}`);
  assert(cacheControl(canonicalTicketCompare).includes('max-age=0')&&cacheControl(canonicalTicketCompare).includes('must-revalidate'),`Canonical Ticket runtime is not forced to revalidate: ${cacheControl(canonicalTicketCompare)||'missing'}`);

  const cloudFront=cloudFrontEvidence(canonicalRoot);
  const cloudFrontSeen=Boolean(cloudFront.requestId||cloudFront.pop||/cloudfront/i.test(cloudFront.via||'')||/cloudfront/i.test(cloudFront.cache||''));
  assert(cloudFrontSeen,'Canonical hostname does not expose expected CloudFront viewer evidence');

  validateHealth(health,'Custom-domain');
  validateHealth(originHealth,'Worker rollback');

  const shellCacheControl=Object.fromEntries(CRITICAL_SHELL_PATHS.map(path=>[path,{canonical:cacheControl(shellPairs[path].canonical),origin:cacheControl(shellPairs[path].origin)}]));
  const result={
    ok:true,
    canonical,
    origin,
    expectedCommit:EXPECTED_SHA,
    deployedCommit:canonicalMeta.commit,
    rollbackCommit:originMeta.commit,
    rollbackCurrent:originMeta.commit===EXPECTED_SHA,
    version:canonicalMeta.body?.version||null,
    rollbackVersion:originMeta.body?.version||null,
    revisionAttempts,
    shellPropagationAttempts,
    shellPaths:[...CRITICAL_SHELL_PATHS],
    shellCacheControl,
    cloudFront,
    canonicalSecurity:{...canonicalHeaders,csp:Boolean(canonicalHeaders.contentSecurityPolicy)},
    originRobots:originHeaders.robots,
    health:{status:health.body?.status||null,databaseProvider:health.body?.database?.provider||null,databaseConfigured:Boolean(health.body?.database?.configured),snapshotFresh:Boolean(health.body?.database?.snapshotFresh)},
    rollbackHealth:{status:originHealth.body?.status||null,databaseProvider:originHealth.body?.database?.provider||null,databaseConfigured:Boolean(originHealth.body?.database?.configured),snapshotFresh:Boolean(originHealth.body?.database?.snapshotFresh)},
    responseMs:{canonicalMeta:canonicalMeta.durationMs,originMeta:originMeta.durationMs,canonicalRoot:canonicalRoot.durationMs,originRoot:originRoot.durationMs,health:health.durationMs,originHealth:originHealth.durationMs},
    testedAt:new Date().toISOString()
  };
  writeReport(result);
  console.log(JSON.stringify(result,null,2));
}catch(error){
  const message=error instanceof Error?error.message:String(error);
  writeReport({ok:false,canonical,origin,expectedCommit:EXPECTED_SHA,error:message,testedAt:new Date().toISOString()});
  console.error('[custom-domain-regression]',message);
  process.exitCode=1;
}
