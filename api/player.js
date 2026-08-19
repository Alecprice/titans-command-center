import { getPlayerProfile } from '../src/db.mjs';
export default async function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({ok:false,error:'Method not allowed'});
  const id=String(req.query?.id||'').trim();
  if(!/^[0-9a-f-]{36}$/i.test(id))return res.status(400).json({ok:false,error:'Valid player id required'});
  try{const data=await getPlayerProfile(id,process.env);return res.status(data.ok?200:data.configured?404:503).json(data)}
  catch(error){console.error('[player]',error);return res.status(500).json({ok:false,error:'Player query failed'})}
}
