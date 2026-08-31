import {apiSnapshotKey,readApiSnapshot} from './d1-api-snapshot.mjs';

const FAN_INTEL_SNAPSHOT_KEY=apiSnapshotKey('fan-intel:v1',{season:2026});

function methodOnly(req,res){
  res.setHeader('Allow','GET');
  if(req.method!=='GET'){
    res.status(405).json({ok:false,error:'Method not allowed'});
    return true;
  }
  return false;
}

function unavailableFanIntel(reason='Fan intelligence snapshot unavailable'){
  return {
    ok:true,
    available:false,
    configured:false,
    mode:'database-unavailable',
    season:2026,
    standings:[],
    injuries:[],
    depthChart:{capturedAt:null,previousCapturedAt:null,changes:[]},
    contracts:[],
    opponent:null,
    gameDay:{drives:[],plays:[],teamMetrics:[]},
    playerStats:[],
    availability:{
      standings:false,
      injuries:false,
      depthChanges:false,
      contracts:false,
      opponent:false,
      drives:false,
      plays:false,
      playerStats:false
    },
    diagnostics:[reason],
    fetchedAt:new Date().toISOString()
  };
}

export async function fanIntelRoute(req,res,env=process.env){
  if(methodOnly(req,res))return;
  res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=300');

  const freshSnapshot=await readApiSnapshot(env,FAN_INTEL_SNAPSHOT_KEY);
  if(freshSnapshot)return res.status(200).json(freshSnapshot);

  const staleSnapshot=await readApiSnapshot(env,FAN_INTEL_SNAPSHOT_KEY,{
    allowExpired:true,
    reason:'Fresh fan intelligence snapshot unavailable; serving last D1 snapshot.'
  });
  if(staleSnapshot)return res.status(200).json(staleSnapshot);

  res.setHeader('Cache-Control','no-store');
  return res.status(200).json(unavailableFanIntel());
}
