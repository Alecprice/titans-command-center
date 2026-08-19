import { getPlayerProfile, getSql } from '../src/db.mjs';

export default async function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({ok:false,error:'Method not allowed'});
  res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=300');
  const id=String(req.query?.id||'').trim();
  if(!/^[0-9a-f-]{36}$/i.test(id))return res.status(400).json({ok:false,error:'Valid player id required'});
  try{
    const data=await getPlayerProfile(id,process.env);
    if(data.ok){
      const sql=await getSql(process.env);
      if(sql){
        const [detail]=await sql`
          select rs.raw_payload,rs.captured_at
          from roster_snapshots rs
          where rs.player_id=${id}::uuid
          order by rs.captured_at desc,rs.id desc
          limit 1
        `;
        if(detail){
          const raw=detail.raw_payload||{};
          data.player={
            ...data.player,
            college:data.player.college||raw.college||'',
            age:raw.age??null,
            height:raw.height||'',
            weight:raw.weight??null,
            sourceUrl:raw.source_url||'https://www.tennesseetitans.com/team/players-roster/',
            sourceLabel:raw.source||'Tennessee Titans official roster',
            auditedOn:raw.audited_on||null,
            rosterCapturedAt:detail.captured_at?new Date(detail.captured_at).toISOString():data.player.rosterCapturedAt||null
          };
        }
      }
    }
    return res.status(data.ok?200:data.configured?404:503).json(data);
  }catch(error){
    console.error('[player]',error);
    return res.status(500).json({ok:false,error:'Player query failed'});
  }
}
