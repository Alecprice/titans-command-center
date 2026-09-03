import {apiSnapshotKey,readApiSnapshot} from './d1-api-snapshot.mjs';
import {cloneWeek1OpponentIntel,opponentIntelSourceTruth} from './week1-opponent-intel-2026.mjs';

const FAN_INTEL_SNAPSHOT_KEY=apiSnapshotKey('fan-intel:v1',{season:2026});

function methodOnly(req,res){
  res.setHeader('Allow','GET');
  if(req.method!=='GET'){
    res.status(405).json({ok:false,error:'Method not allowed'});
    return true;
  }
  return false;
}

function bundledOpponentAudit(){
  const opponent=cloneWeek1OpponentIntel();
  return {
    ...opponent,
    sourceTruth:{...opponentIntelSourceTruth(opponent)}
  };
}

function withBundledOpponentAudit(payload){
  return {...payload,opponentAudit:bundledOpponentAudit()};
}

export async function fanIntelRoute(req,res,env=process.env){
  if(methodOnly(req,res))return;
  res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=300');

  const freshSnapshot=await readApiSnapshot(env,FAN_INTEL_SNAPSHOT_KEY);
  if(freshSnapshot)return res.status(200).json(withBundledOpponentAudit(freshSnapshot));

  const staleSnapshot=await readApiSnapshot(env,FAN_INTEL_SNAPSHOT_KEY,{
    allowExpired:true,
    reason:'Fresh fan intelligence snapshot unavailable; serving last D1 snapshot.'
  });
  if(staleSnapshot)return res.status(200).json(withBundledOpponentAudit(staleSnapshot));

  res.setHeader('Cache-Control','no-store');
  return res.status(503).json({
    ok:false,
    configured:false,
    error:'Fan intelligence snapshot unavailable',
    opponentAudit:bundledOpponentAudit()
  });
}
