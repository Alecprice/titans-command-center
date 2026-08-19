const timeoutSignal = ms => typeof AbortSignal?.timeout === 'function' ? AbortSignal.timeout(ms) : undefined;
const num = value => value === '' || value == null || Number.isNaN(Number(value)) ? null : Number(value);

export function formatAmerican(value) {
  const n=num(value); if(n==null)return '—'; return n>0?`+${Math.round(n)}`:`${Math.round(n)}`;
}
export function americanToImplied(value) {
  const n=num(value); if(n==null||n===0)return null; return n>0?100/(n+100):(-n)/((-n)+100);
}
export function decimalToAmerican(value) {
  const d=num(value); if(d==null||d<=1)return null; return d>=2?Math.round((d-1)*100):Math.round(-100/(d-1));
}

async function getJson(url, options={}) {
  const res=await fetch(url,{...options,signal:timeoutSignal(7000)});
  if(!res.ok) throw new Error(`Provider returned ${res.status}`);
  return {json:await res.json(),headers:res.headers};
}
const titanText = value => /tennessee|titans|\bTEN\b/i.test(JSON.stringify(value));
const arr = value => Array.isArray(value)?value:Array.isArray(value?.data)?value.data:Array.isArray(value?.events)?value.events:Array.isArray(value?.results)?value.results:[];

function genericOddsRows(payload, provider, event={}) {
  const rows=[]; const seen=new Set();
  const walk=(node,path=[])=>{
    if(!node||typeof node!=='object')return;
    if(Array.isArray(node)){node.forEach((v,i)=>walk(v,[...path,String(i)]));return;}
    const rawPrice=node.price ?? node.americanOdds ?? node.american ?? node.odds ?? node.decimalOdds;
    let price=num(rawPrice);
    if(price!=null && price>1 && price<20) price=decimalToAmerican(price);
    const line=num(node.line ?? node.point ?? node.handicap ?? node.total);
    const book=node.book ?? node.bookmaker ?? node.sportsbook ?? node.bookName ?? node.book_id;
    const side=node.side ?? node.outcome ?? node.name ?? node.label;
    const market=node.market ?? node.marketName ?? node.market_name ?? node.key ?? path.slice(-2,-1)[0];
    if(price!=null && (book||side||market)){
      const key=[event.id||event.eventId||'',market,side,line,book,price].join('|');
      if(!seen.has(key)){seen.add(key);rows.push({provider,providerEventId:String(event.id||event.eventId||event.key||''),providerOddId:key,category:/player|passing|rushing|receiv|touchdown|sack/i.test(String(market))?'player_prop':'game_line',marketName:String(market||'Market'),statId:String(node.statId??node.stat_id??''),entityName:String(node.playerName??node.player??node.participant??''),periodId:String(node.period??node.periodId??'game'),betType:String(node.betType??node.type??''),side:String(side??''),book:String(book??provider),bookId:String(node.bookId??node.book_id??''),line,price,live:Boolean(node.live??event.live),alt:Boolean(node.alt??node.isAlt),available:node.available!==false,deeplink:node.deeplink??node.url??null,capturedAt:new Date().toISOString()});}
    }
    for(const [k,v] of Object.entries(node)) if(typeof v==='object') walk(v,[...path,k]);
  };
  walk(payload); return rows.slice(0,600);
}

async function fetchPropLine(env,{maxEvents=2}={}) {
  if(!env.PROPLINE_API_KEY) return {ok:false,configured:false,provider:'PropLine',odds:[],events:[]};
  const base='https://api.prop-line.com/v1/sports/football_nfl';
  const headers={'X-API-Key':env.PROPLINE_API_KEY};
  const {json,headers:rh}=await getJson(`${base}/events`,{headers});
  const events=arr(json).filter(titanText).slice(0,maxEvents);
  const odds=[];
  for(const event of events){const id=event.id??event.eventId??event.key;if(!id)continue;try{const out=await getJson(`${base}/events/${encodeURIComponent(id)}/odds`,{headers});odds.push(...genericOddsRows(out.json,'PropLine',event));}catch{}}
  return {ok:true,configured:true,provider:'PropLine',events,odds,futures:[],quota:{remaining:rh.get('x-ratelimit-remaining')||rh.get('ratelimit-remaining')||null,limit:rh.get('x-ratelimit-limit')||rh.get('ratelimit-limit')||null},fetchedAt:new Date().toISOString()};
}

async function fetchOddsApiIo(env,{maxEvents=2}={}) {
  if(!env.ODDS_API_IO_KEY) return {ok:false,configured:false,provider:'Odds-API.io',odds:[],events:[]};
  const key=encodeURIComponent(env.ODDS_API_IO_KEY);
  const {json}=await getJson(`https://api.odds-api.io/v3/events?apiKey=${key}&sport=nfl&limit=100`);
  const events=arr(json).filter(titanText).slice(0,maxEvents); const odds=[];
  for(const event of events){const id=event.id??event.eventId??event.key;if(!id)continue;try{const out=await getJson(`https://api.odds-api.io/v3/odds?apiKey=${key}&eventId=${encodeURIComponent(id)}`);odds.push(...genericOddsRows(out.json,'Odds-API.io',event));}catch{}}
  return {ok:true,configured:true,provider:'Odds-API.io',events,odds,futures:[],fetchedAt:new Date().toISOString()};
}

export async function fetchFreeOdds(env=process.env, options={}) {
  const diagnostics=[];
  if(env.PROPLINE_API_KEY){try{const r=await fetchPropLine(env,options);diagnostics.push({provider:'PropLine',ok:r.ok,rows:r.odds.length});if(r.ok&&(r.odds.length||r.events.length))return {...r,diagnostics};}catch(e){diagnostics.push({provider:'PropLine',ok:false,error:e.message});}}
  if(env.ODDS_API_IO_KEY){try{const r=await fetchOddsApiIo(env,options);diagnostics.push({provider:'Odds-API.io',ok:r.ok,rows:r.odds.length});if(r.ok)return {...r,diagnostics};}catch(e){diagnostics.push({provider:'Odds-API.io',ok:false,error:e.message});}}
  return {ok:false,provider:'free-odds-stack',events:[],odds:[],futures:[],diagnostics,error:'No configured free odds provider returned data',fetchedAt:new Date().toISOString()};
}

export async function probeFreeOddsProviders(env=process.env,{compare=true}={}) {
  const providers=[];
  if(env.PROPLINE_API_KEY){try{const r=await fetchPropLine(env,{maxEvents:1});providers.push({provider:'PropLine',configured:true,ok:r.ok,eventCount:r.events.length,rowCount:r.odds.length,quota:r.quota||null});}catch(e){providers.push({provider:'PropLine',configured:true,ok:false,error:e.message});}} else providers.push({provider:'PropLine',configured:false,ok:false});
  if(compare){if(env.ODDS_API_IO_KEY){try{const r=await fetchOddsApiIo(env,{maxEvents:1});providers.push({provider:'Odds-API.io',configured:true,ok:r.ok,eventCount:r.events.length,rowCount:r.odds.length});}catch(e){providers.push({provider:'Odds-API.io',configured:true,ok:false,error:e.message});}} else providers.push({provider:'Odds-API.io',configured:false,ok:false});}
  return {ok:providers.some(p=>p.configured&&p.ok),checkedAt:new Date().toISOString(),providers,note:'Credential values are never returned.'};
}
