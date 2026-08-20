const base=String(process.env.WORKER_URL||process.env.PRODUCTION_URL||'https://titans-command-center.alecjordanprice.workers.dev').replace(/\/$/,'');
const allowedHosts=new Set(['static.clubs.nfl.com','static.www.nfl.com','static.nfl.com','a.espncdn.com','a1.espncdn.com']);
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
assert(Number(manifest.headshotCount)>=70,`Headshot coverage too low: ${manifest.headshotCount}`);
assert(Array.isArray(manifest.players)&&manifest.players.length===manifest.headshotCount,'Headshot manifest count mismatch');
for(const player of manifest.players){const url=new URL(player.headshotUrl);assert(url.protocol==='https:',`Non-HTTPS headshot for ${player.name}`);assert(allowedHosts.has(url.hostname),`Unexpected headshot host ${url.hostname}`)}
const csp=rootResponse.headers.get('content-security-policy')||'';
for(const host of allowedHosts)assert(csp.includes(`https://${host}`),`CSP missing ${host}`);
assert(root.includes('/headshot-polish.css?v=31'),'Headshot stylesheet v31 missing from shell');
assert(root.includes('/headshot-polish.js?v=31'),'Headshot module v31 missing from shell');
assert(js.includes('/assets/data/player-headshots.json'),'Headshot module is not using generated manifest');
assert(!/postgres(?:ql)?:\/\//i.test(js),'Headshot JS leaked a database connection string');
const result={ok:true,base,season:manifest.season,rosterRows:manifest.rosterRows,headshotCount:manifest.headshotCount,allowedHosts:[...allowedHosts],durationMs:Date.now()-started,testedAt:new Date().toISOString()};
await import('node:fs').then(fs=>fs.writeFileSync('/tmp/headshot-production-smoke.json',JSON.stringify(result,null,2)));
console.log(JSON.stringify(result,null,2));
