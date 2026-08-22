import {getSql} from './db.mjs';

const AUTH_ORIGIN='https://ep-cold-moon-a6z7a2ag.neonauth.us-west-2.aws.neon.tech/neondb/auth';
const PREF_KEYS=new Set(['titans:v15MyTitans','titans:v15SmartAlerts','titans:v14CustomMediaLinks']);

function json(payload,status=200,headers={}){
  return new Response(JSON.stringify(payload),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers}});
}

async function authSession(request){
  try{
    const headers=new Headers();
    const cookie=request.headers.get('cookie');
    if(cookie)headers.set('cookie',cookie);
    const upstream=await fetch(`${AUTH_ORIGIN}/get-session`,{headers,redirect:'manual'});
    if(!upstream.ok)return null;
    const data=await upstream.json().catch(()=>null);
    return data?.user?data:data?.data?.user?data.data:null;
  }catch{return null;}
}

export async function accountAuthProxy(request,subpath){
  const safe=String(subpath||'').replace(/^\/+|\/+$/g,'');
  if(!['get-session','sign-in/email','sign-up/email','sign-out'].includes(safe))return json({ok:false,error:'Unknown account route'},404);
  if(request.method!=='GET'&&request.method!=='POST')return json({ok:false,error:'Method not allowed'},405,{Allow:'GET, POST'});
  const headers=new Headers();
  for(const key of ['cookie','content-type','accept']){const value=request.headers.get(key);if(value)headers.set(key,value);}
  const body=request.method==='GET'?undefined:await request.arrayBuffer();
  try{
    const upstream=await fetch(`${AUTH_ORIGIN}/${safe}`,{method:request.method,headers,body,redirect:'manual'});
    const outHeaders=new Headers(upstream.headers);
    outHeaders.set('Cache-Control','no-store');
    outHeaders.delete('access-control-allow-origin');
    outHeaders.delete('access-control-allow-credentials');
    return new Response(upstream.body,{status:upstream.status,headers:outHeaders});
  }catch(error){
    console.error('[account-auth-proxy]',safe,error);
    return json({ok:false,error:'Account service unavailable'},503);
  }
}

function sanitizePreferences(input){
  const source=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
  const clean={};
  for(const key of PREF_KEYS){
    if(!(key in source))continue;
    const value=source[key];
    const encoded=JSON.stringify(value);
    if(encoded.length>12000)continue;
    clean[key]=value;
  }
  return clean;
}

export async function accountPreferencesRoute(request,env){
  if(!['GET','PUT'].includes(request.method))return json({ok:false,error:'Method not allowed'},405,{Allow:'GET, PUT'});
  const session=await authSession(request);
  const user=session?.user||null;
  if(!user?.id)return json({ok:false,error:'Authentication required'},401);
  const sql=await getSql(env);
  if(!sql)return json({ok:false,error:'Database unavailable'},503);
  try{
    if(request.method==='GET'){
      const [row]=await sql`select preferences,schema_version,updated_at from fan_user_preferences where user_id=${String(user.id)} limit 1`;
      return json({ok:true,preferences:sanitizePreferences(row?.preferences||{}),schemaVersion:Number(row?.schema_version||1),updatedAt:row?.updated_at||null});
    }
    const body=await request.json().catch(()=>({}));
    const preferences=sanitizePreferences(body?.preferences);
    const encoded=JSON.stringify(preferences);
    if(encoded.length>24000)return json({ok:false,error:'Preferences too large'},413);
    const [row]=await sql`
      insert into fan_user_preferences(user_id,preferences,schema_version,updated_at)
      values(${String(user.id)},${preferences},1,now())
      on conflict(user_id) do update set preferences=excluded.preferences,schema_version=excluded.schema_version,updated_at=now()
      returning updated_at
    `;
    return json({ok:true,preferences,updatedAt:row?.updated_at||null});
  }catch(error){
    console.error('[account-preferences]',error);
    return json({ok:false,error:'Preference sync unavailable'},503);
  }
}
