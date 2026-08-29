import fs from 'node:fs';

const base=String(process.env.WORKER_URL||process.env.PRODUCTION_URL||'https://titans-command-center.alecjordanprice.workers.dev').replace(/\/$/,'');
const started=Date.now();
const assert=(condition,message)=>{if(!condition)throw new Error(message)};
const finite=value=>value!=null&&Number.isFinite(Number(value));
const headers={'User-Agent':'TitansCommandCenter-AdvancedAnalyticsAudit/0.9','Cache-Control':'no-cache, no-store','Accept':'application/json'};

try{
  const [healthResponse,response]=await Promise.all([
    fetch(`${base}/api/health`,{headers,signal:AbortSignal.timeout(15000)}),
    fetch(`${base}/api/advanced-analytics?season=2026&team=TEN&audit=${Date.now()}`,{headers,signal:AbortSignal.timeout(15000)})
  ]);
  const [health,data]=await Promise.all([healthResponse.json(),response.json()]);
  assert(healthResponse.status===200,`Health API returned ${healthResponse.status}`);
  const healthStatus=String(health?.status||'');
  assert(healthStatus==='healthy'||healthStatus==='degraded',`Unexpected health status ${healthStatus||'missing'}`);

  let report={};
  try{report=JSON.parse(fs.readFileSync('/tmp/cloudflare-smoke.json','utf8'))}catch{}

  if(healthStatus==='degraded'){
    assert(health?.database?.configured===true,'Degraded analytics check lost the configured database signal');
    assert(health?.database?.ok===false,'Degraded analytics check must preserve the failed database signal');
    assert(response.status===500,`Degraded analytics API returned unexpected ${response.status}`);
    assert(data?.ok===false,'Degraded analytics response unexpectedly claims ok=true');
    assert(data?.error==='Advanced analytics query failed',`Unexpected degraded analytics error: ${data?.error||'missing'}`);
    report.analyticsStatus=response.status;
    report.analyticsMode='database-unavailable';
    report.analyticsHealthStatus=healthStatus;
    report.analyticsDatabaseAvailable=false;
    report.responseMs={...(report.responseMs||{}),analytics:Date.now()-started};
    fs.writeFileSync('/tmp/cloudflare-smoke.json',JSON.stringify(report,null,2));
    console.log(JSON.stringify({ok:true,base,mode:'database-unavailable',healthStatus,responseStatus:response.status,responseMs:Date.now()-started},null,2));
    process.exit(0);
  }

  assert(health?.database?.ok===true,'Healthy analytics check requires a healthy database');
  assert(response.status===200,`Advanced analytics API returned ${response.status}`);
  assert(data?.ok===true,'Advanced analytics API did not return ok=true');
  assert(data?.team==='TEN',`Advanced analytics returned unexpected team ${data?.team||'unknown'}`);
  assert(Number(data?.requestedSeason)===2026,'Advanced analytics did not preserve the requested 2026 season');
  assert(Number.isInteger(Number(data?.dataSeason))&&Number(data.dataSeason)>=1999&&Number(data.dataSeason)<=2026,`Advanced analytics data season is invalid: ${data?.dataSeason}`);
  assert(Boolean(data?.seasonFallback)===(Number(data.dataSeason)!==2026),'Advanced analytics seasonFallback does not match the resolved data season');
  assert(Number(data?.coverage?.plays)>1000,`Advanced analytics warehouse coverage is too small: ${data?.coverage?.plays||0} plays`);
  assert(Number(data?.coverage?.personnel_plays)>1000,`Advanced analytics personnel coverage is too small: ${data?.coverage?.personnel_plays||0} plays`);
  assert(data?.summary&&finite(data.summary.offensiveEpaPerPlay),'Offensive EPA/play is missing');
  assert(finite(data.summary.defensiveEpaPerPlayAllowed),'Defensive EPA/play allowed is missing');
  assert(finite(data.summary.paceSecondsPerPlay),'Pace seconds/play is missing');
  assert(finite(data.summary.latestRestDays),'Latest rest days is missing');
  assert(Number(data.summary.offensivePlays)>0&&Number(data.summary.defensivePlays)>0,'Team play counts are missing');
  assert(Array.isArray(data?.weeks)&&data.weeks.length>=1,'Weekly team analytics are missing');
  assert(Array.isArray(data?.byDown)&&data.byDown.length>=4,'EPA by down is incomplete');
  assert(Array.isArray(data?.personnel)&&data.personnel.length>=2,'Personnel package analytics are missing');
  assert(Array.isArray(data?.recentPlays)&&data.recentPlays.length>=20,'Recent play-by-play sample is unexpectedly small');
  const situation=data.recentPlays.find(p=>Number.isInteger(Number(p.down))&&finite(p.distance)&&(p.yardline||finite(p.yardline100))&&finite(p.scoreDifferential)&&finite(p.gameSecondsRemaining));
  assert(situation,'No recent play contains down/distance, field position, score differential and time remaining together');
  assert(data.recentPlays.some(p=>p.offensePersonnel||p.defensePersonnel),'No recent play contains a personnel package');
  assert(data.recentPlays.some(p=>p.offenseFormation),'No recent play contains an offensive formation');
  const sourceLabels=(data.sources||[]).map(source=>String(source.label||'')).join(' | ');
  assert(/nflverse/i.test(sourceLabels),'nflverse is missing from advanced analytics provenance');
  assert(/NFL Savant/i.test(sourceLabels),'NFL Savant is missing from advanced analytics cross-check provenance');
  assert(/Pro-Football-Reference/i.test(sourceLabels),'Pro-Football-Reference is missing from advanced analytics cross-check provenance');
  assert(/Kaggle/i.test(sourceLabels),'Kaggle review policy is missing from advanced analytics provenance');

  report.analyticsStatus=response.status;
  report.analyticsMode='live-database';
  report.analyticsHealthStatus=healthStatus;
  report.analyticsDatabaseAvailable=true;
  report.analyticsDataSeason=Number(data.dataSeason);
  report.analyticsSeasonFallback=Boolean(data.seasonFallback);
  report.analyticsWarehousePlays=Number(data.coverage.plays||0);
  report.analyticsPersonnelPlays=Number(data.coverage.personnel_plays||0);
  report.analyticsRecentPlays=data.recentPlays.length;
  report.analyticsPersonnelRows=data.personnel.length;
  report.analyticsOffensiveEpaPerPlay=Number(data.summary.offensiveEpaPerPlay);
  report.analyticsDefensiveEpaPerPlayAllowed=Number(data.summary.defensiveEpaPerPlayAllowed);
  report.analyticsPaceSecondsPerPlay=Number(data.summary.paceSecondsPerPlay);
  report.analyticsLatestRestDays=Number(data.summary.latestRestDays);
  report.responseMs={...(report.responseMs||{}),analytics:Date.now()-started};
  fs.writeFileSync('/tmp/cloudflare-smoke.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify({ok:true,base,mode:'live-database',dataSeason:data.dataSeason,seasonFallback:data.seasonFallback,warehousePlays:data.coverage.plays,recentPlays:data.recentPlays.length,personnelRows:data.personnel.length,responseMs:Date.now()-started},null,2));
}catch(error){
  const message=error instanceof Error?error.message:String(error);
  let report={};
  try{report=JSON.parse(fs.readFileSync('/tmp/cloudflare-smoke.json','utf8'))}catch{}
  report.ok=false;
  report.analyticsError=message;
  report.analyticsTestedAt=new Date().toISOString();
  try{fs.writeFileSync('/tmp/cloudflare-smoke.json',JSON.stringify(report,null,2))}catch{}
  console.error('[advanced-analytics-regression]',message);
  process.exit(1);
}
