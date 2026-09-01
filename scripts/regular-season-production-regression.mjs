const base=String(process.env.WORKER_URL||process.env.PRODUCTION_URL||'https://titans.alecjprice.com').replace(/\/$/,'');
const WEEK1_KICKOFF='2026-09-13T17:00:00Z';
const expectedPreseason=[
  {opponentAbbr:'SF',score:19,opponentScore:13},
  {opponentAbbr:'SEA',score:19,opponentScore:16},
  {opponentAbbr:'CHI',score:15,opponentScore:24}
];
function assert(condition,message){if(!condition)throw new Error(message)}
async function getData(){
  const response=await fetch(`${base}/api/data?regular-season-truth=${Date.now()}`,{
    cache:'no-store',
    headers:{'User-Agent':'TitansCommandCenter-RegularSeasonAudit/1.0','Cache-Control':'no-cache, no-store','Pragma':'no-cache'},
    signal:AbortSignal.timeout(15000)
  });
  assert(response.status===200,`Data API returned ${response.status}`);
  const body=await response.json();
  assert(body?.ok===true,'Data API did not return a usable bootstrap snapshot');
  return body;
}
const data=await getData();
const team=data.team||{};
const games=Array.isArray(data.games)?data.games:[];
assert(Number(team.season)===2026,`Expected 2026 season, got ${team.season??'missing'}`);
assert(String(team.phase||'')==='Regular Season',`Expected Regular Season phase, got ${team.phase||'missing'}`);
assert(Number(team.byeWeek)===9,`Expected Week 9 bye, got ${team.byeWeek??'missing'}`);
const week1=games.find(game=>Number(game?.week)===1);
assert(week1,'Week 1 is missing from the production schedule');
assert(String(week1.opponentAbbr||'')==='NYJ',`Week 1 opponent regressed to ${week1.opponentAbbr||'missing'}`);
assert(String(week1.date||'')===WEEK1_KICKOFF,`Week 1 kickoff regressed to ${week1.date||'missing'}`);
assert(String(week1.homeAway||'')==='home','Week 1 must remain a Titans home game');
assert(String(week1.venue||'')==='Nissan Stadium',`Week 1 venue regressed to ${week1.venue||'missing'}`);
assert(String(week1.network||'')==='CBS',`Week 1 network regressed to ${week1.network||'missing'}`);
if(Date.now()<Date.parse(WEEK1_KICKOFF))assert(String(week1.status||'')==='scheduled',`Week 1 pre-kickoff status is ${week1.status||'missing'} instead of scheduled`);
for(const expected of expectedPreseason){
  const game=games.find(row=>String(row?.opponentAbbr||'')===expected.opponentAbbr&&String(row?.week||'').startsWith('P'));
  assert(game,`Historical preseason game vs ${expected.opponentAbbr} is missing`);
  assert(String(game.status||'')==='final',`Historical preseason game vs ${expected.opponentAbbr} is not final`);
  assert(Number(game.score)===expected.score&&Number(game.opponentScore)===expected.opponentScore,`Historical preseason score vs ${expected.opponentAbbr} regressed`);
}
const result={ok:true,season:Number(team.season),phase:team.phase,week1:{opponent:week1.opponent,opponentAbbr:week1.opponentAbbr,kickoff:week1.date,homeAway:week1.homeAway,venue:week1.venue,network:week1.network,status:week1.status},preseasonHistory:expectedPreseason.length,testedAt:new Date().toISOString()};
console.log(JSON.stringify(result,null,2));
