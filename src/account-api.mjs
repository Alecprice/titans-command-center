import {getSql} from './db.mjs';

const AUTH_ORIGIN='https://ep-cold-moon-a6z7a2ag.neonauth.us-west-2.aws.neon.tech/neondb/auth';
const V10_PREF_KEY='titans:v10Prefs';
const PREF_KEYS=new Set(['titans:v15MyTitans','titans:v15SmartAlerts','titans:v14CustomMediaLinks',V10_PREF_KEY,'titans-fantasy-v1']);
const HOME_KEYS=['game','favorites','moves','intel','markets','freshness'];
const HOME_KEY_SET=new Set(HOME_KEYS);
const V10_THEMES=new Set(['system','dark','light']);
const V10_DENSITIES=new Set(['comfortable','compact']);
const V10_NOTIFICATION_KEYS=['kickoff','final','transactions','news'];
const MAX_AUTH_BODY_BYTES=32*1024;
const MAX_PREFERENCE_BODY_BYTES=32*1024;

function json(payload,status=200,headers={}){
  return new Response(JSON.stringify(payload),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers}});
}

function authHeaders(request){
  const headers=new Headers();
  for(const key of ['cookie','content-type','accept']){const value=request.headers.get(key);if(value)headers.set(key,value);}
  headers.set('origin',new URL(AUTH_ORIGIN).origin);
  return headers;
}

function mutationIsCrossSite(request){
  if(String(request.headers.get('sec-fetch-site')||'').toLowerCase()==='cross-site')return true;
  const origin=request.headers.get('origin');
  if(!origin)return false;
  try{return new URL(origin).origin!==new URL(request.url).origin;}catch{return true;}
}

function declaredBodyTooLarge(request,maxBytes){
  const raw=request.headers.get('content-length');
  if(raw===null)return false;
  const length=Number(raw);
  return Number.isFinite(length)&&length>maxBytes;
}

async function limitedBody(request,maxBytes){
  if(declaredBodyTooLarge(request,maxBytes))return {ok:false,status:413,error:'Request body too large'};
  const body=await request.arrayBuffer();
  if(body.byteLength>maxBytes)return {ok:false,status:413,error:'Request body too large'};
  return {ok:true,body};
}

async function authSession(request){
  try{
    const upstream=await fetch(`${AUTH_ORIGIN}/get-session`,{headers:authHeaders(request),redirect:'manual'});
    if(!upstream.ok)return null;
    const data=await upstream.json().catch(()=>null);
    return data?.user?data:data?.data?.user?data.data:null;
  }catch{return null;}
}

export async function accountAuthProxy(request,subpath){
  const safe=String(subpath||'').replace(/^\/+|\/+$/g,'');
  if(!['get-session','sign-in/email','sign-up/email','sign-out'].includes(safe))return json({ok:false,error:'Unknown account route'},404);
  const allowedMethod=safe==='get-session'?'GET':'POST';
  if(request.method!==allowedMethod)return json({ok:false,error:'Method not allowed'},405,{Allow:allowedMethod});
  if(request.method==='POST'&&mutationIsCrossSite(request))return json({ok:false,error:'Cross-site account request rejected'},403);
  let body;
  if(request.method!=='GET'){
    const limited=await limitedBody(request,MAX_AUTH_BODY_BYTES);
    if(!limited.ok)return json({ok:false,error:limited.error},limited.status);
    body=limited.body;
  }
  try{
    const upstream=await fetch(`${AUTH_ORIGIN}/${safe}`,{method:request.method,headers:authHeaders(request),body,redirect:'manual'});
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

function uniqueHomeKeys(value){
  if(!Array.isArray(value))return null;
  const seen=new Set(),clean=[];
  for(const entry of value){
    const key=String(entry||'');
    if(!HOME_KEY_SET.has(key)||seen.has(key))continue;
    seen.add(key);clean.push(key);
  }
  return clean;
}

function sanitizeV10Prefs(value){
  if(!value||typeof value!=='object'||Array.isArray(value))return null;
  const clean={};
  if(V10_THEMES.has(value.theme))clean.theme=value.theme;
  if(V10_DENSITIES.has(value.density))clean.density=value.density;
  if(typeof value.reducedMotion==='boolean')clean.reducedMotion=value.reducedMotion;
  if(typeof value.showMarkets==='boolean')clean.showMarkets=value.showMarkets;
  const order=uniqueHomeKeys(value.homeOrder);
  if(order)clean.homeOrder=[...order,...HOME_KEYS.filter(key=>!order.includes(key))];
  const hidden=uniqueHomeKeys(value.homeHidden);
  if(hidden)clean.homeHidden=hidden;
  if(value.notifications&&typeof value.notifications==='object'&&!Array.isArray(value.notifications)){
    const notifications={};
    for(const key of V10_NOTIFICATION_KEYS){if(typeof value.notifications[key]==='boolean')notifications[key]=value.notifications[key];}
    if(Object.keys(notifications).length)clean.notifications=notifications;
  }
  return clean;
}

function sanitizePreferences(input){
  const source=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
  const clean={};
  for(const key of PREF_KEYS){
    if(!(key in source))continue;
    let value=source[key];
    if(key===V10_PREF_KEY){
      value=sanitizeV10Prefs(value);
      if(!value||!Object.keys(value).length)continue;
    }
    const encoded=JSON.stringify(value);
    if(typeof encoded!=='string'||encoded.length>12000)continue;
    clean[key]=value;
  }
  return clean;
}

function preferenceStorageNotReady(error){
  const code=String(error?.code||'').toUpperCase();
  const message=String(error?.message||'').toLowerCase();
  return code==='42P01'||(message.includes('fan_user_preferences')&&message.includes('does not exist'));
}

function preferenceFailure(error){
  if(preferenceStorageNotReady(error))return json({ok:false,error:'Account preference storage is not provisioned yet.',code:'PREFERENCE_STORAGE_NOT_READY',localOnly:true},503);
  return json({ok:false,error:'Preference sync unavailable',code:'PREFERENCE_SYNC_UNAVAILABLE',localOnly:true},503);
}

export async function accountPreferencesRoute(request,env){
  if(!['GET','PUT'].includes(request.method))return json({ok:false,error:'Method not allowed'},405,{Allow:'GET, PUT'});
  if(request.method==='PUT'&&mutationIsCrossSite(request))return json({ok:false,error:'Cross-site account request rejected'},403);
  const session=await authSession(request);
  const user=session?.user||null;
  if(!user?.id)return json({ok:false,error:'Authentication required'},401);
  const sql=await getSql(env);
  if(!sql)return json({ok:false,error:'Database unavailable',code:'DATABASE_UNAVAILABLE',localOnly:true},503);
  try{
    if(request.method==='GET'){
      const [row]=await sql`select preferences,schema_version,updated_at from fan_user_preferences where user_id=${String(user.id)} limit 1`;
      return json({ok:true,preferences:sanitizePreferences(row?.preferences||{}),schemaVersion:Number(row?.schema_version||1),updatedAt:row?.updated_at||null});
    }
    const limited=await limitedBody(request,MAX_PREFERENCE_BODY_BYTES);
    if(!limited.ok)return json({ok:false,error:limited.error},limited.status);
    let body={};
    try{body=JSON.parse(new TextDecoder().decode(limited.body)||'{}');}catch{return json({ok:false,error:'Invalid JSON body'},400);}
    const preferences=sanitizePreferences(body?.preferences);
    const encoded=JSON.stringify(preferences);
    if(encoded.length>24000)return json({ok:false,error:'Preferences too large'},413);
    const [row]=await sql`
      insert into fan_user_preferences(user_id,preferences,schema_version,updated_at)
      values(${String(user.id)},${encoded}::jsonb,1,now())
      on conflict(user_id) do update set preferences=excluded.preferences,schema_version=excluded.schema_version,updated_at=now()
      returning updated_at
    `;
    return json({ok:true,preferences,updatedAt:row?.updated_at||null});
  }catch(error){
    console.error('[account-preferences]',error);
    return preferenceFailure(error);
  }
}
