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
const eventTime = event => {const raw=event?.commence_time??event?.commenceTime??event?.start_time??event?.startTime??event?.date??event?.start;const t=raw?new Date(raw).getTime():NaN;return Number.isFinite(t)?t:null};
export function selectTitansEvents(values=[],maxEvents=2,{now=Date.now(),graceMs=45*60*1000}={}){
  const limit=Math.max(1,Math.floor(Number(maxEvents)||2));
  return arr(values).filter(titanText).filter(event=>{
    if(event?.live===true)return true;
    if(/final|finished|complete|completed|ended|closed/i.test(String(event?.status??event?.state??'')))return false;
    const t=eventTime(event);return t==null||t>=now-graceMs;
  }).sort((a,b)=>{
    if(Boolean(a?.live)!==Boolean(b?.live))return a?.live?-1:1;
    const at=eventTime(a),bt=eventTime(b);if(at==null&&bt==null)return String(a?.id??'').localeCompare(String(b?.id??''));if(at==null)return 1;if(bt==null)return -1;return at-bt;
  }).slice(0,limit);
}
const PLAYER_MARKET_RE = /(^player_|^pitcher_|^batter_|^goalie_|passing|rushing|receiv|touchdown|sack|tackle|interception|field_goal|kicking)/i;
const MARKET_LABELS = new Map([
  ['h2h','Moneyline'],
  ['spreads','Spread'],
  ['totals','Total'],
  ['team_totals','Team Total']
]);
const humanizeMarket = value => String(value||'Market').replace(/^player_/,'').replace(/_/g,' ').replace(/\b\w/g,m=>m.toUpperCase());
const marketLabel = market => String(market?.description||market?.title||MARKET_LABELS.get(String(market?.key||''))||humanizeMarket(market?.key));
const rowTime = (...values) => {
  for(const value of values){if(!value)continue;const d=new Date(value);if(!Number.isNaN(d.getTime()))return d.toISOString();}
  return new Date().toISOString();
};
const cacheSeconds = env => {const raw=Number(env?.ODDS_CACHE_SECONDS||300);return Number.isFinite(raw)?Math.max(300,Math.min(900,raw)):300};
let runtimeOddsCache={key:'',expiresAt:0,value:null,inflight:null};
export function resetOddsRuntimeCache(){runtimeOddsCache={key:'',expiresAt:0,value:null,inflight:null}}

function inferAlternateLines(rows) {
  const groups=new Map();
  for(const row of rows){
    if(row.line==null||row.marketKey==='h2h')continue;
    const key=[row.providerEventId,row.bookId||row.book,row.marketKey,row.entityName,row.periodId].join('|');
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push(row);
  }
  for(const group of groups.values()){
    const byLine=new Map();
    for(const row of group){
      const lineKey=row.marketKey==='spreads'?Math.abs(row.line):row.line;
      if(!byLine.has(lineKey))byLine.set(lineKey,[]);
      byLine.get(lineKey).push(row);
    }
    if(byLine.size<2)continue;
    let primary=null,best=Infinity;
    for(const [lineKey,candidates] of byLine){
      const priced=candidates.map(row=>americanToImplied(row.price)).filter(v=>v!=null);
      if(priced.length<2)continue;
      const score=priced.reduce((sum,p)=>sum+Math.abs(p-.5),0)/priced.length;
      if(score<best){best=score;primary=lineKey;}
    }
    if(primary==null)continue;
    for(const row of group){
      const lineKey=row.marketKey==='spreads'?Math.abs(row.line):row.line;
      if(lineKey!==primary)row.alt=true;
    }
  }
  return rows;
}

function structuredOddsRows(payload, provider, event={}) {
  if(!Array.isArray(payload?.bookmakers)||!payload.bookmakers.length)return null;
  const rows=[]; const seen=new Set();
  const providerEventId=String(payload.id??payload.eventId??event.id??event.eventId??event.key??'');
  for(const bookmaker of payload.bookmakers){
    const bookId=String(bookmaker.key??bookmaker.id??bookmaker.book_id??'');
    const book=String(bookmaker.title??bookmaker.name??bookmaker.bookmaker_title??bookId)||provider;
    for(const market of Array.isArray(bookmaker.markets)?bookmaker.markets:[]){
      const marketKey=String(market.key??market.market_key??market.name??'market');
      const category=PLAYER_MARKET_RE.test(marketKey)?'player_prop':'game_line';
      const periodId=String(market.period??payload.period??'game');
      const explicitAlt=Boolean(market.alt??market.isAlt??market.alternate)||/\balt(?:ernate)?\b/i.test(`${marketKey} ${market.description||''}`);
      for(const outcome of Array.isArray(market.outcomes)?market.outcomes:[]){
        const rawPrice=outcome.price??outcome.americanOdds??outcome.american??outcome.odds??outcome.decimalOdds;
        let price=num(rawPrice); if(price!=null&&price>1&&price<20)price=decimalToAmerican(price);
        if(price==null)continue;
        const line=num(outcome.point??outcome.line??outcome.handicap??outcome.total);
        const side=String(outcome.name??outcome.side??outcome.outcome??outcome.label??'');
        const entityName=String(outcome.playerName??outcome.player??outcome.participant??(category==='player_prop'?outcome.description:'')??'');
        const key=[providerEventId,bookId||book,marketKey,periodId,entityName,side,line,price].join('|');
        if(seen.has(key))continue;
        seen.add(key);
        rows.push({
          provider,
          providerEventId,
          providerOddId:key,
          category,
          marketKey,
          marketName:marketLabel(market),
          statId:String(outcome.statId??outcome.stat_id??(category==='player_prop'?marketKey:'')),
          entityName,
          periodId,
          betType:String(outcome.betType??outcome.type??marketKey),
          side,
          book,
          bookId,
          line,
          price,
          live:Boolean(outcome.live??market.live??payload.live??event.live),
          alt:Boolean(outcome.alt??outcome.isAlt??outcome.alternate)||explicitAlt,
          available:outcome.available!==false&&market.available!==false&&bookmaker.available!==false,
          deeplink:outcome.deeplink??outcome.url??outcome.link??market.link??market.url??bookmaker.link??bookmaker.url??null,
          capturedAt:rowTime(outcome.last_update,outcome.book_updated_at,outcome.last_change_at,market.last_update,bookmaker.last_update,payload.last_update)
        });
      }
    }
  }
  return inferAlternateLines(rows).slice(0,600);
}

function recursiveOddsRows(payload, provider, event={}) {
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
      if(!seen.has(key)){seen.add(key);rows.push({provider,providerEventId:String(event.id||event.eventId||event.key||''),providerOddId:key,category:PLAYER_MARKET_RE.test(String(market))?'player_prop':'game_line',marketKey:String(market||''),marketName:String(market||'Market'),statId:String(node.statId??node.stat_id??''),entityName:String(node.playerName??node.player??node.participant??''),periodId:String(node.period??node.periodId??'game'),betType:String(node.betType??node.type??''),side:String(side??''),book:String(book??provider),bookId:String(node.bookId??node.book_id??''),line,price,live:Boolean(node.live??event.live),alt:Boolean(node.alt??node.isAlt),available:node.available!==false,deeplink:node.deeplink??node.url??null,capturedAt:new Date().toISOString()});}
    }
    for(const [k,v] of Object.entries(node)) if(typeof v==='object') walk(v,[...path,k]);
  };
  walk(payload); return rows.slice(0,600);
}

export function normalizeOddsRows(payload, provider, event={}) {
  return structuredOddsRows(payload,provider,event)??recursiveOddsRows(payload,provider,event);
}

async function fetchPropLine(env,{maxEvents=2}={}) {
  if(!env.PROPLINE_API_KEY) return {ok:false,configured:false,provider:'PropLine',odds:[],events:[]};
  const base='https://api.prop-line.com/v1/sports/football_nfl';
  const headers={'X-API-Key':env.PROPLINE_API_KEY};
  const {json,headers:rh}=await getJson(`${base}/events`,{headers});
  const events=selectTitansEvents(json,maxEvents);
  const odds=[];
  for(const event of events){const id=event.id??event.eventId??event.key;if(!id)continue;try{const out=await getJson(`${base}/events/${encodeURIComponent(id)}/odds?includeLinks=true`,{headers});odds.push(...normalizeOddsRows(out.json,'PropLine',event));}catch{}}
  return {ok:true,configured:true,provider:'PropLine',events,odds,futures:[],quota:{remaining:rh.get('x-ratelimit-remaining')||rh.get('ratelimit-remaining')||null,limit:rh.get('x-ratelimit-limit')||rh.get('ratelimit-limit')||null},fetchedAt:new Date().toISOString()};
}

async function fetchOddsApiIo(env,{maxEvents=2}={}) {
  if(!env.ODDS_API_IO_KEY) return {ok:false,configured:false,provider:'Odds-API.io',odds:[],events:[]};
  const key=encodeURIComponent(env.ODDS_API_IO_KEY);
  const {json}=await getJson(`https://api.odds-api.io/v3/events?apiKey=${key}&sport=nfl&limit=100`);
  const events=selectTitansEvents(json,maxEvents); const odds=[];
  for(const event of events){const id=event.id??event.eventId??event.key;if(!id)continue;try{const out=await getJson(`https://api.odds-api.io/v3/odds?apiKey=${key}&eventId=${encodeURIComponent(id)}`);odds.push(...normalizeOddsRows(out.json,'Odds-API.io',event));}catch{}}
  return {ok:true,configured:true,provider:'Odds-API.io',events,odds,futures:[],fetchedAt:new Date().toISOString()};
}

async function loadProviderOdds(env,options){
  const diagnostics=[];
  if(env.PROPLINE_API_KEY){try{const r=await fetchPropLine(env,options);diagnostics.push({provider:'PropLine',ok:r.ok,rows:r.odds.length});if(r.ok&&(r.odds.length||r.events.length))return {...r,diagnostics,cache:'provider'};}catch(e){diagnostics.push({provider:'PropLine',ok:false,error:e.message});}}
  if(env.ODDS_API_IO_KEY){try{const r=await fetchOddsApiIo(env,options);diagnostics.push({provider:'Odds-API.io',ok:r.ok,rows:r.odds.length});if(r.ok)return {...r,diagnostics,cache:'provider'};}catch(e){diagnostics.push({provider:'Odds-API.io',ok:false,error:e.message});}}
  return {ok:false,provider:'free-odds-stack',events:[],odds:[],futures:[],diagnostics,error:'No configured free odds provider returned data',fetchedAt:new Date().toISOString(),cache:'provider'};
}

export async function fetchFreeOdds(env=process.env, options={}) {
  const maxEvents=Math.min(2,Math.max(1,Number(options.maxEvents||2)||2));
  const requestOptions={...options,maxEvents};
  const useCache=options.bypassCache!==true;
  const providerKey=`${env.PROPLINE_API_KEY?'propline':''}|${env.ODDS_API_IO_KEY?'oddsapiio':''}|${maxEvents}`;
  const now=Date.now();
  if(useCache&&runtimeOddsCache.key===providerKey&&runtimeOddsCache.value&&now<runtimeOddsCache.expiresAt)return {...runtimeOddsCache.value,cache:'runtime-memory'};
  if(useCache&&runtimeOddsCache.key===providerKey&&runtimeOddsCache.inflight)return runtimeOddsCache.inflight;
  if(!useCache)return loadProviderOdds(env,requestOptions);
  let pending;
  pending=loadProviderOdds(env,requestOptions).then(result=>{
    if(result.ok&&runtimeOddsCache.key===providerKey&&runtimeOddsCache.inflight===pending){runtimeOddsCache.value=result;runtimeOddsCache.expiresAt=Date.now()+cacheSeconds(env)*1000;}
    return result;
  });
  runtimeOddsCache={key:providerKey,expiresAt:runtimeOddsCache.key===providerKey?runtimeOddsCache.expiresAt:0,value:runtimeOddsCache.key===providerKey?runtimeOddsCache.value:null,inflight:pending};
  try{return await pending}finally{if(runtimeOddsCache.key===providerKey&&runtimeOddsCache.inflight===pending)runtimeOddsCache.inflight=null}
}

export async function probeFreeOddsProviders(env=process.env,{compare=true}={}) {
  const providers=[];
  if(env.PROPLINE_API_KEY){try{const r=await fetchPropLine(env,{maxEvents:1});providers.push({provider:'PropLine',configured:true,ok:r.ok,eventCount:r.events.length,rowCount:r.odds.length,quota:r.quota||null});}catch(e){providers.push({provider:'PropLine',configured:true,ok:false,error:e.message});}} else providers.push({provider:'PropLine',configured:false,ok:false});
  if(compare){if(env.ODDS_API_IO_KEY){try{const r=await fetchOddsApiIo(env,{maxEvents:1});providers.push({provider:'Odds-API.io',configured:true,ok:r.ok,eventCount:r.events.length,rowCount:r.odds.length});}catch(e){providers.push({provider:'Odds-API.io',configured:true,ok:false,error:e.message});}} else providers.push({provider:'Odds-API.io',configured:false,ok:false});}
  return {ok:providers.some(p=>p.configured&&p.ok),checkedAt:new Date().toISOString(),providers,note:'Credential values are never returned.'};
}
