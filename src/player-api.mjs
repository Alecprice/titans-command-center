import {getPlayerProfile,getSql} from './db.mjs';
import {apiSnapshotKey,readApiSnapshot,writeApiSnapshot} from './d1-api-snapshot.mjs';

const numberOrNull=value=>{if(value==null||value==='')return null;const parsed=Number(value);return Number.isFinite(parsed)?parsed:null;};
const queryOf=req=>req?.query||{};
const PLAYER_SNAPSHOT_TTL_SECONDS=21600;

export async function playerProfileRoute(req,res,env=process.env){
  if(req.method!=='GET'){
    res.setHeader('Allow','GET');
    return res.status(405).json({ok:false,error:'Method not allowed'});
  }
  res.setHeader('Cache-Control','public, s-maxage=900, stale-while-revalidate=21600');
  const id=String(queryOf(req).id||'').trim();
  if(!/^[0-9a-f-]{36}$/i.test(id))return res.status(400).json({ok:false,error:'Valid player id required'});

  const snapshotKey=apiSnapshotKey('player-profile:v1',{id:id.toLowerCase()});
  const freshSnapshot=await readApiSnapshot(env,snapshotKey);
  if(freshSnapshot)return res.status(200).json(freshSnapshot);

  try{
    const data=await getPlayerProfile(id,env);
    if(data.ok){
      const sql=await getSql(env);
      if(sql){
        const [detail]=await sql`
          select rs.raw_payload->>'college' college,
                 rs.raw_payload->>'age' age,
                 rs.raw_payload->>'height' height,
                 rs.raw_payload->>'weight' weight,
                 rs.raw_payload->>'source_url' source_url,
                 rs.raw_payload->>'source' source,
                 rs.raw_payload->>'audited_on' audited_on,
                 rs.captured_at
          from roster_snapshots rs
          where rs.player_id=${id}::uuid
          order by rs.captured_at desc,rs.id desc
          limit 1`;
        if(detail){
          data.player={
            ...data.player,
            college:data.player.college||detail.college||'',
            age:numberOrNull(detail.age),
            height:detail.height||'',
            weight:numberOrNull(detail.weight),
            sourceUrl:detail.source_url||'https://www.tennesseetitans.com/team/players-roster/',
            sourceLabel:detail.source||'Tennessee Titans official roster',
            auditedOn:detail.audited_on||null,
            rosterCapturedAt:detail.captured_at?new Date(detail.captured_at).toISOString():data.player.rosterCapturedAt||null
          };
        }
      }
      await writeApiSnapshot(env,snapshotKey,data,{source:'neon-player-profile',ttlSeconds:PLAYER_SNAPSHOT_TTL_SECONDS});
      return res.status(200).json(data);
    }

    if(!data.configured||data.error==='Player query failed'){
      const staleSnapshot=await readApiSnapshot(env,snapshotKey,{allowExpired:true,reason:'Live player warehouse unavailable'});
      if(staleSnapshot)return res.status(200).json(staleSnapshot);
    }
    return res.status(data.configured?404:503).json(data);
  }catch(error){
    console.error('[playerProfileRoute]',error);
    const staleSnapshot=await readApiSnapshot(env,snapshotKey,{allowExpired:true,reason:'Live player warehouse unavailable'});
    if(staleSnapshot)return res.status(200).json(staleSnapshot);
    return res.status(503).json({ok:false,configured:Boolean(env?.DATABASE_URL),error:'Player query failed'});
  }
}
