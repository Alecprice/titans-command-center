import fs from 'node:fs';

const base=String(process.env.WORKER_URL||process.env.PRODUCTION_URL||'https://titans-command-center.alecjordanprice.workers.dev').replace(/\/$/,'');
const expectedSha=String(process.env.EXPECTED_SHA||'').trim();
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function recordFailure(error){
  const message=error instanceof Error?error.message:String(error);
  try{fs.writeFileSync('/tmp/cloudflare-smoke.json',JSON.stringify({ok:false,base,error:message,testedAt:new Date().toISOString()},null,2));}catch{}
  console.error('[production-regression]',message);
}
process.on('uncaughtException',error=>{recordFailure(error);process.exit(1)});
process.on('unhandledRejection',error=>{recordFailure(error);process.exit(1)});

function assert(condition,message){if(!condition)throw new Error(message)}

async function request(path,{json=false,text=false,retries=4}={}){
  let lastError;
  for(let attempt=1;attempt<=retries;attempt++){
    const started=Date.now();
    try{
      const response=await fetch(`${base}${path}`,{
        headers:{'User-Agent':'TitansCommandCenter-ProductionAudit/0.8','Cache-Control':'no-cache'},
        signal:AbortSignal.timeout(15000)
      });
      let body;
      if(json)body=await response.json();
      else if(text)body=await response.text();
      else body=await response.arrayBuffer();
      return {status:response.status,body,headers:response.headers,durationMs:Date.now()-started};
    }catch(error){
      lastError=error;
      if(attempt<retries)await wait(1800*attempt);
    }
  }
  throw lastError;
}

function expectedContentType(path){
  if(path==='/'||path.endsWith('.html'))return'text/html';
  if(path.endsWith('.css'))return'text/css';
  if(path.endsWith('.js')||path.endsWith('.mjs'))return'javascript';
  if(path.endsWith('.webp'))return'image/webp';
  if(path.endsWith('.png'))return'image/png';
  if(path.endsWith('.webmanifest'))return'application/manifest+json';
  return null;
}

const root=await request('/',{text:true});
const manifest=await request('/manifest.webmanifest',{json:true});
const sw=await request('/sw.js',{text:true});
const shield=await request('/assets/archive/current-shield-primary.webp');
const app=await request('/app.js',{text:true});
const statsJs=await request('/stats-hub.js',{text:true});
const marketJs=await request('/market-hub.js',{text:true});
const health=await request('/api/health',{json:true});
const data=await request('/api/data',{json:true});
const stats=await request('/api/preseason-stats',{json:true});
const market=await request('/api/market-data',{json:true});

assert(root.status===200,`Root returned ${root.status}`);
assert(/<meta name="viewport"[^>]*viewport-fit=cover/.test(root.body),'Viewport metadata is missing safe-area support');
assert(/class="skip-link" href="#app"/.test(root.body),'Skip navigation is missing from app shell');
assert(/id="menu-button"[^>]*aria-controls="sidebar"[^>]*aria-expanded="false"/.test(root.body),'Menu accessibility state is missing from app shell');
assert(/rel="manifest" href="\/manifest\.webmanifest"/.test(root.body),'Manifest link missing from app shell');
assert(/src="\/app\.js"/.test(root.body),'Main app module missing from app shell');
assert(/src="\/accessibility-runtime\.js"/.test(root.body),'Accessibility runtime missing from app shell');
assert(!/postgres(?:ql)?:\/\//i.test(root.body),'Database connection string leaked into HTML');
const rootHeaders={
  contentTypeOptions:(root.headers.get('x-content-type-options')||'').toLowerCase(),
  frameOptions:(root.headers.get('x-frame-options')||'').toUpperCase(),
  referrerPolicy:(root.headers.get('referrer-policy')||'').toLowerCase(),
  contentSecurityPolicy:root.headers.get('content-security-policy')||'',
  robots:(root.headers.get('x-robots-tag')||'').toLowerCase()
};
assert(rootHeaders.contentTypeOptions==='nosniff','Static assets are missing X-Content-Type-Options: nosniff');
assert(rootHeaders.frameOptions==='DENY','Static assets are missing X-Frame-Options: DENY');
assert(rootHeaders.referrerPolicy==='strict-origin-when-cross-origin','Static assets have an unexpected Referrer-Policy');
assert(rootHeaders.contentSecurityPolicy.includes("frame-ancestors 'none'"),'Static assets are missing CSP frame-ancestors protection');
if(new URL(base).hostname.endsWith('.workers.dev'))assert(rootHeaders.robots.includes('noindex'),'workers.dev staging hostname is not marked noindex');

assert(manifest.status===200,'Web manifest is unavailable');
assert(manifest.body?.name==='Titans Command Center','Unexpected PWA name');
assert(manifest.body?.start_url==='/#home','Unexpected PWA start URL');
assert(manifest.body?.display==='standalone','PWA must use standalone display mode');
assert(Array.isArray(manifest.body?.icons)&&manifest.body.icons.some(icon=>icon.sizes==='192x192')&&manifest.body.icons.some(icon=>icon.sizes==='512x512'),'PWA icons are incomplete');

assert(sw.status===200,'Service worker is unavailable');
assert(/const CACHE\s*=\s*['"]titans-cc-brand-2026-v\d+['"]/.test(sw.body),'Service worker cache is not versioned');
assert(!sw.body.includes('/src/preseason-p1-20260813.mjs'),'Service worker still references the server-only preseason gamebook module');
const shellBlock=sw.body.match(/const SHELL\s*=\s*\[([\s\S]*?)\];/);
assert(shellBlock,'Unable to parse service-worker precache shell');
const shellPaths=[...shellBlock[1].matchAll(/['"]([^'"]+)['"]/g)].map(match=>match[1]);
assert(shellPaths.length>=20,'PWA precache shell is unexpectedly small');
const shellFailures=[];
for(const path of shellPaths){
  const response=await request(path);
  if(response.status!==200){shellFailures.push(`${path}=${response.status}`);continue;}
  const expected=expectedContentType(path),actual=(response.headers.get('content-type')||'').toLowerCase();
  if(expected&&!actual.includes(expected))shellFailures.push(`${path}=content-type:${actual||'missing'}`);
}
assert(shellFailures.length===0,`PWA precache paths failed: ${shellFailures.join(', ')}`);

assert(shield.status===200,'Current Shield asset is unavailable');
assert((shield.headers.get('content-type')||'').startsWith('image/'),'Current Shield did not return an image content type');
for(const [label,response] of [['app.js',app],['stats-hub.js',statsJs],['market-hub.js',marketJs]]){
  assert(response.status===200,`${label} is unavailable`);
  assert(!/postgres(?:ql)?:\/\//i.test(response.body),`${label} leaked a database connection string`);
  assert(!/npg_[A-Za-z0-9_-]{8,}/.test(response.body),`${label} leaked a Neon credential`);
}

assert(health.status===200,`Health API returned ${health.status}`);
assert(health.body?.status==='healthy','Application health is not healthy');
assert(health.body?.database?.configured===true,'Neon is not configured in production');
assert(health.body?.database?.ok===true,'Neon health check failed');
assert(health.body?.version==='0.8.0','Unexpected API application version');

assert(data.status===200&&data.body?.ok===true,`Data API failed with ${data.status}`);
assert(Array.isArray(data.body?.roster)&&data.body.roster.length===95,`Expected 95 Neon roster players, received ${data.body?.roster?.length??0}`);
assert(stats.status===200&&stats.body?.ok===true,`Stats API failed with ${stats.status}`);
assert(Number(stats.body?.rosterCount)===95,`Expected 95 Stats Lab roster players, received ${stats.body?.rosterCount??0}`);
assert(/Neon/i.test(stats.body?.rosterSource||''),`Stats Lab is not Neon-backed: ${stats.body?.rosterSource||'unknown source'}`);
assert(Array.isArray(stats.body?.completedGames)&&stats.body.completedGames.length>=1,'No completed preseason gamebook is available');
assert(market.status===200&&market.body?.ok===true,`Market API failed with ${market.status}`);

let buildMeta=null;
try{
  const meta=await request('/build-meta.json',{json:true,retries:2});
  if(meta.status===200)buildMeta=meta.body;
}catch{}
if(expectedSha){
  assert(buildMeta?.commit,`Build metadata is missing while expecting deploy ${expectedSha}`);
  assert(buildMeta.commit===expectedSha,`Deployed commit ${buildMeta.commit} does not match expected ${expectedSha}`);
}

const result={
  ok:true,
  base,
  rootStatus:root.status,
  securityHeaders:{...rootHeaders,csp:Boolean(rootHeaders.contentSecurityPolicy)},
  manifestStatus:manifest.status,
  serviceWorkerStatus:sw.status,
  serviceWorkerCache:sw.body.match(/const CACHE\s*=\s*['"]([^'"]+)/)?.[1]||null,
  precachePaths:shellPaths.length,
  healthStatus:health.status,
  appStatus:health.body?.status||null,
  databaseConfigured:Boolean(health.body?.database?.configured),
  databaseOk:Boolean(health.body?.database?.ok),
  dataStatus:data.status,
  dataRosterCount:data.body?.roster?.length||0,
  statsStatus:stats.status,
  statsRosterCount:Number(stats.body?.rosterCount||0),
  statsRosterSource:stats.body?.rosterSource||null,
  completedPreseasonGames:stats.body?.completedGames?.length||0,
  marketStatus:market.status,
  marketRows:Array.isArray(market.body?.odds)?market.body.odds.length:0,
  marketMode:market.body?.sourceMode||null,
  buildMeta,
  responseMs:{root:root.durationMs,health:health.durationMs,data:data.durationMs,stats:stats.durationMs,market:market.durationMs},
  testedAt:new Date().toISOString()
};

fs.writeFileSync('/tmp/cloudflare-smoke.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
