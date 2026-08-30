import {apiSnapshotKey,readApiSnapshot} from './d1-api-snapshot.mjs';
import {hasD1} from './d1-store.mjs';

const queryOf=req=>req?.query||{};
const cleanTeam=value=>/^[A-Z]{2,3}$/.test(String(value||'').toUpperCase())?String(value).toUpperCase():'TEN';
const cleanSeason=value=>{const n=Number(value);return Number.isInteger(n)&&n>=1999&&n<=2100?n:2026};

function methodOnly(req,res){
  if(req.method==='GET')return false;
  res.setHeader('Allow','GET');
  res.status(405).json({ok:false,error:'Method not allowed'});
  return true;
}

const sources=()=>[
  {label:'nflverse / nflfastR via nflreadpy',role:'Primary team stats + play-by-play + EPA/WPA',url:'https://nflreadpy.nflverse.com/'},
  {label:'nflverse participation',role:'Historical offense/defense personnel and formation',url:'https://nflreadr.nflverse.com/articles/dictionary_participation.html'},
  {label:'NFL Savant',role:'Secondary processed PBP cross-check',url:'https://nflsavant.com/'},
  {label:'Pro-Football-Reference',role:'Historical/advanced-stat cross-check',url:'https://www.pro-football-reference.com/'},
  {label:'Kaggle',role:'Optional reviewed historical datasets; disabled by default',url:'https://www.kaggle.com/datasets'}
];

export async function advancedAnalyticsRoute(req,res,env=process.env){
  if(methodOnly(req,res))return;
  res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=900');
  const requestedSeason=cleanSeason(queryOf(req).season),team=cleanTeam(queryOf(req).team);
  const snapshotKey=apiSnapshotKey('advanced-analytics:v1',{season:requestedSeason,team});

  const freshSnapshot=await readApiSnapshot(env,snapshotKey);
  if(freshSnapshot)return res.status(200).json(freshSnapshot);

  const staleSnapshot=await readApiSnapshot(env,snapshotKey,{
    allowExpired:true,
    reason:'Fresh analytics snapshot unavailable; serving last D1 snapshot.'
  });
  if(staleSnapshot)return res.status(200).json(staleSnapshot);

  res.setHeader('Cache-Control','no-store');
  return res.status(200).json({
    ok:false,
    available:false,
    status:'database-unavailable',
    configured:hasD1(env),
    requestedSeason,
    dataSeason:null,
    team,
    seasonFallback:false,
    coverage:null,
    summary:null,
    weeks:[],
    league:[],
    recentPlays:[],
    byDown:[],
    personnel:[],
    sources:sources(),
    error:'Advanced analytics query failed',
    fetchedAt:new Date().toISOString()
  });
}
