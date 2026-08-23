const base=String(process.env.WORKER_URL||process.env.PRODUCTION_URL||'https://titans-command-center.alecjordanprice.workers.dev').replace(/\/$/,'');
const allowedHosts=new Set(['static.clubs.nfl.com','static.www.nfl.com','static.nfl.com','a.espncdn.com','a1.espncdn.com']);
const allowedOmissionReasons=new Set(['no-approved-headshot-url','missing-player-name']);
const assert=(condition,message)=>{if(!condition)throw new Error(message)};
const started=Date.now();

const [manifestResponse,rootResponse,jsResponse,cssResponse]=await Promise.all([
  fetch(`${base}/assets/data/player-headshots.json?audit=${Date.now()}`,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)}),
  fetch(`${base}/`,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)}),
  fetch(`${base}/headshot-polish.js?v=31`,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)}),
  fetch(`${base}/headshot-polish.css?v=31`,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)})
]);
assert(manifestResponse.ok,`Headshot manifest returned ${manifestResponse.status}`);
assert(rootResponse.ok,`Root returned ${rootResponse.status}`);
assert(jsResponse.ok,`Headshot JS returned ${jsResponse.status}`);
assert(cssResponse.ok,`Headshot CSS returned ${cssResponse.status}`);
const manifest=await manifestResponse.json(),root=await rootResponse.text(),js=await jsResponse.text();
assert(manifest.team==='TEN','Headshot manifest is not scoped to TEN');
const rosterRows=Number(manifest.rosterRows),headshotCount=Number(manifest.headshotCount),omittedCount=Number(manifest.omittedCount),coveragePct=Number(manifest.coveragePct);
const omittedPlayers=Array.isArray(manifest.omittedPlayers)?manifest.omittedPlayers:[];
const omissionReasons=manifest.omissionReasons&&typeof manifest.omissionReasons==='object'?manifest.omissionReasons:{};
assert(headshotCount>=70,`Headshot coverage too low: ${manifest.headshotCount}`);
assert(Number.isFinite(rosterRows)&&rosterRows>=headshotCount,'Headshot upstream roster count is invalid');
assert(Number.isFinite(omittedCount)&&omittedCount>=0,'Headshot omitted count is invalid');
assert(Number.isFinite(coveragePct)&&coveragePct>=0&&coveragePct<=100,'Headshot coverage percentage is invalid');
assert(Array.isArray(manifest.players)&&manifest.players.length===headshotCount,'Headshot manifest count mismatch');
assert(omittedPlayers.length===omittedCount,'Headshot omitted-player count mismatch');
assert(headshotCount+omittedCount===rosterRows,'Headshot coverage accounting does not reconcile');
assert(Object.values(omissionReasons).reduce((sum,value)=>sum+Number(value||0),0)===omittedCount,'Headshot omission reason counts do not reconcile');
for(const omitted of omittedPlayers)assert(allowedOmissionReasons.has(omitted.reason),`Unknown headshot omission reason: ${omitted.reason}`);
for(const player of manifest.players){const url=new URL(player.headshotUrl);assert(url.protocol==='https:',`Non-HTTPS headshot for ${player.name}`);assert(allowedHosts.has(url.hostname),`Unexpected headshot host ${url.hostname}`)}
const csp=rootResponse.headers.get('content-security-policy')||'';
for(const host of allowedHosts)assert(csp.includes(`https://${host}`),`CSP missing ${host}`);
assert(root.includes('/headshot-polish.css?v=31'),'Headshot stylesheet v31 missing from shell');
assert(root.includes('/headshot-polish.js?v=31'),'Headshot module v31 missing from shell');
assert(js.includes('/assets/data/player-headshots.json'),'Headshot module is not using generated manifest');
assert(!/postgres(?:ql)?:\/\//i.test(js),'Headshot JS leaked a database connection string');
const result={
  ok:true,
  base,
  season:manifest.season,
  generatedAt:manifest.generatedAt||null,
  rosterRows,
  headshotCount,
  coveragePct,
  omittedCount,
  omissionReasons,
  omittedPlayers:omittedPlayers.map(({name,number,position,status,reason})=>({name,number,position,status,reason})),
  allowedHosts:[...allowedHosts],
  durationMs:Date.now()-started,
  testedAt:new Date().toISOString()
};
await import('node:fs').then(fs=>fs.writeFileSync('/tmp/headshot-production-smoke.json',JSON.stringify(result,null,2)));
console.log(JSON.stringify(result,null,2));
