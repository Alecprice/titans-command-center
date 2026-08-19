let neonFactory = null;

export function hasDatabase(env = process.env) { return Boolean(env?.DATABASE_URL); }

export async function getSql(env = process.env) {
  if (!hasDatabase(env)) return null;
  if (!neonFactory) neonFactory = (await import('@neondatabase/serverless')).neon;
  return neonFactory(env.DATABASE_URL);
}

const iso = value => value ? new Date(value).toISOString() : null;

export async function databaseHealth(env = process.env) {
  const sql = await getSql(env);
  if (!sql) return { configured:false, ok:false };
  try {
    const rows = await sql`select now() as database_time, (select value from schema_meta where key='schema_version') as schema_version`;
    return { configured:true, ok:true, database_time:iso(rows[0]?.database_time), schema_version:rows[0]?.schema_version || null };
  } catch (error) {
    console.error('[databaseHealth]', error);
    return { configured:true, ok:false, error:'Database health check failed' };
  }
}

export async function getBootstrapData(env = process.env) {
  const sql = await getSql(env);
  if (!sql) return { configured:false, ok:false };
  try {
    const [metaRows, sourceRows, gameRows, rosterRows, transactionRows] = await Promise.all([
      sql`select key,value from schema_meta`,
      sql`select slug,name,tier,category,enabled,capabilities,metadata from sources order by name`,
      sql`select g.id,g.season,g.season_type,g.week,g.kickoff,g.venue,g.network,g.status,g.home_score,g.away_score, ht.abbreviation home_abbr,ht.name home_name,at.abbreviation away_abbr,at.name away_name from games g join teams ht on ht.id=g.home_team_id join teams at on at.id=g.away_team_id where g.season=2026 and (ht.abbreviation='TEN' or at.abbreviation='TEN') order by g.kickoff`,
      sql`with latest as (select rs.*,row_number() over(partition by rs.player_id order by rs.snapshot_at desc) rn from roster_snapshots rs join teams t on t.id=rs.team_id where t.abbreviation='TEN') select p.id,p.full_name,coalesce(l.position,p.position) position,l.jersey_number,l.status,l.experience,l.raw_payload from latest l join players p on p.id=l.player_id where l.rn=1 and p.active=true order by l.position,p.full_name`,
      sql`select id,transacted_at,transaction_type,description from transactions order by transacted_at desc limit 100`
    ]);
    const meta = Object.fromEntries(metaRows.map(r => [r.key,r.value]));
    const games = gameRows.map(g => {
      const home = g.home_abbr === 'TEN';
      return { id:String(g.id), week:g.season_type==='preseason'?`P${g.week}`:g.week, date:iso(g.kickoff), opponent:home?g.away_name:g.home_name, opponentAbbr:home?g.away_abbr:g.home_abbr, homeAway:home?'home':'away', status:g.status, score:home?g.home_score:g.away_score, opponentScore:home?g.away_score:g.home_score, venue:g.venue||'', network:g.network||'', source:'Neon' };
    });
    const roster = rosterRows.map(r => ({ id:String(r.id), name:r.full_name, number:r.jersey_number||'', position:r.position||'', unit:r.raw_payload?.unit||'', status:r.status||'Active', experience:r.experience||'', tag:r.raw_payload?.tag||'' }));
    const sources = sourceRows.map(s => ({ name:s.name, category:s.category, tier:s.tier, enabled:s.enabled, status:s.metadata?.status || (s.enabled?'Ready':'Disabled'), method:s.metadata?.method||'', cost:s.metadata?.cost||'Free', cadence:s.metadata?.cadence||'', purpose:s.metadata?.purpose||'', capabilities:s.capabilities||[] }));
    const transactions = transactionRows.map(t => ({ id:String(t.id), date:iso(t.transacted_at), type:t.transaction_type, description:t.description }));
    return { configured:true, ok:true, meta, games, roster, sources, transactions, feed:[], syncRuns:[], analytics:{coverage:{},efficiency:[]}, weather:{}, markets:{rows:[],futures:[]}, fetchedAt:new Date().toISOString() };
  } catch (error) {
    console.error('[getBootstrapData]', error);
    return { configured:true, ok:false, error:'Database query failed' };
  }
}

export async function getPlayerProfile(playerId, env = process.env) {
  const sql = await getSql(env);
  if (!sql) return { configured:false, ok:false };
  try {
    const rows = await sql`select id,full_name,first_name,last_name,position,college,active,metadata from players where id=${playerId}::uuid limit 1`;
    if (!rows.length) return { configured:true, ok:false, error:'Player not found' };
    const p=rows[0];
    return { configured:true,ok:true,player:{id:String(p.id),name:p.full_name,firstName:p.first_name,lastName:p.last_name,position:p.position||'',college:p.college||'',active:p.active,metadata:p.metadata||{}},stats:[],injuries:[],props:[] };
  } catch (error) { console.error('[getPlayerProfile]',error); return { configured:true,ok:false,error:'Player query failed' }; }
}

export async function getAnalyticsExplorer(_filters = {}, env = process.env) {
  const sql = await getSql(env);
  if (!sql) return { configured:false,ok:false };
  try {
    const [row] = await sql`select (select count(*) from plays)::int plays,(select count(distinct game_id) from plays)::int games_with_plays`;
    return { configured:true,ok:true,coverage:row||{},summary:{},byGame:[],byDown:[],byQuarter:[],byPlayType:[] };
  } catch (error) { console.error('[getAnalyticsExplorer]',error); return { configured:true,ok:false,error:'Analytics query failed' }; }
}
