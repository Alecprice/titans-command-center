import {getPlayerProfile,getSql} from './db.mjs';

const numberOrNull=value=>{if(value==null||value==='')return null;const parsed=Number(value);return Number.isFinite(parsed)?parsed:null;};
const queryOf=req=>req?.query||{};

export async function playerProfileRoute(req,res,env=process.env){
  if(req.method!=='GET'){
    res.setHeader('Allow','GET');
    return res.status(405).json({ok:false,error:'Method not allowed'});
  }
  res.setHeader('Cache-Control','public, s-maxage=900, stale-while-revalidate=21600');
  const id=String(queryOf(req).id||'').trim();
  if(!/^[0-9a-f-]{36}$/i.test(id))return res.status(400).json({ok:false,error:'Valid player id required'});
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
  }
  return res.status(data.ok?200:data.configured?404:503).json(data);
}
