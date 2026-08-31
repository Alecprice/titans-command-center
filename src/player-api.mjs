import {apiSnapshotKey,readApiSnapshot} from './d1-api-snapshot.mjs';

const queryOf=req=>req?.query||{};

export async function playerProfileRoute(req,res,env=process.env){
  if(req.method!=='GET'){
    res.setHeader('Allow','GET');
    return res.status(405).json({ok:false,error:'Method not allowed'});
  }
  res.setHeader('Cache-Control','public, s-maxage=900, stale-while-revalidate=21600');
  const id=String(queryOf(req).id||'').trim();
  if(!/^[0-9a-f-]{36}$/i.test(id))return res.status(400).json({ok:false,error:'Valid player id required'});

  const normalizedId=id.toLowerCase();
  const snapshotKey=apiSnapshotKey('player-profile:v1',{id:normalizedId});
  const freshSnapshot=await readApiSnapshot(env,snapshotKey);
  if(freshSnapshot)return res.status(200).json(freshSnapshot);

  const staleSnapshot=await readApiSnapshot(env,snapshotKey,{
    allowExpired:true,
    reason:'Fresh player snapshot unavailable; serving last D1 snapshot.'
  });
  if(staleSnapshot)return res.status(200).json(staleSnapshot);

  res.setHeader('Cache-Control','no-store');
  return res.status(503).json({
    ok:false,
    available:false,
    configured:Boolean(env?.TITANS_DB),
    mode:'player-snapshot-unavailable',
    id:normalizedId,
    error:'Player snapshot unavailable'
  });
}
