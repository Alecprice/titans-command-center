let neonFactory = null;

export function hasDatabase(env = process.env) { return Boolean(env?.DATABASE_URL); }

export async function getSql(env = process.env) {
  if (!hasDatabase(env)) return null;
  if (!neonFactory) neonFactory = (await import('@neondatabase/serverless')).neon;
  return neonFactory(env.DATABASE_URL);
}

const iso = value => value ? new Date(value).toISOString() : null;
const asDateIso = value => value ? `${String(value).slice(0,10)}T00:00:00.000Z` : null;

export async function databaseHealth(env = process.env) {
  const sql = await getSql(env);
  if (!sql) return { configured:false, ok:false };
  try {
    const [row] = await sql`
      select now() as database_time,
             (select value from schema_meta where key='schema_version') as schema_version,
             (select value from schema_meta where key='app_version') as app_version,
             (select value from schema_meta where key='content_audit_at') as content_audit_at
    `;
    return {
      configured:true,
      ok:true,
      database_time:iso(row?.database_time),
      schema_version:row?.schema_version || null,
      app_version:row?.app_version || null,
      content_audit_at:row?.content_audit_at || null
    };
  } catch (error) {
    console.error('[databaseHealth]', error);
    return { configured:true, ok:false, error:'Database health check failed' };
  }
}

export async function getBootstrapData(env = process.env) {
  const sql = await getSql(env);
  if (!sql) return { configured:false, ok:false };
  try {
    const [
      metaRows,
      sourceRows,
      gameRows,
      rosterRows,
      transactionRows,
      eventRows,
      syncRows,
      coverageRows,
      weatherRows,
      marketRows,
      futuresRows
    ] = await Promise.all([
      sql`select key,value from schema_meta`,
      sql`select slug,name,tier,category,enabled,capabilities,metadata from sources order by name`,
      sql`select g.id,g.season,g.season_type,g.week,g.kickoff,g.venue,g.network,g.status,g.home_score,g.away_score,
                 ht.abbreviation home_abbr,ht.name home_name,at.abbreviation away_abbr,at.name away_name
          from games g
          join teams ht on ht.id=g.home_team_id
          join teams at on at.id=g.away_team_id
          where g.season=2026 and (ht.abbreviation='TEN' or at.abbreviation='TEN')
          order by case when g.kickoff is null then 1 else 0 end,g.kickoff,g.week`,
      sql`with latest as (
            select rs.*,row_number() over(partition by rs.player_id order by rs.captured_at desc,rs.id desc) rn
            from roster_snapshots rs
            join teams t on t.id=rs.team_id
            where t.abbreviation='TEN'
          )
          select p.id,p.full_name,coalesce(l.position,p.position) position,l.jersey_number,l.unit,
                 l.roster_status status,l.experience,l.raw_payload,l.captured_at
          from latest l
          join players p on p.id=l.player_id
          where l.rn=1 and p.active=true
          order by case coalesce(l.unit,'') when 'Offense' then 1 when 'Defense' then 2 when 'Special Teams' then 3 else 4 end,
                   coalesce(l.position,p.position),p.full_name`,
      sql`select id,transaction_date,transaction_type,description,source_url
          from transactions
          order by transaction_date desc nulls last,created_at desc
          limit 100`,
      sql`select e.id,e.event_type,e.headline,e.summary,e.source_url,e.source_tier,e.is_official,e.confidence,
                 e.topics,coalesce(e.published_at,e.occurred_at,e.ingested_at) published_at,s.name source_name,s.slug source_slug
          from events e
          join sources s on s.id=e.source_id
          where s.enabled=true
          order by coalesce(e.published_at,e.occurred_at,e.ingested_at) desc
          limit 40`,
      sql`select sr.id,s.slug source_slug,s.name source_name,sr.job_type,sr.status,sr.started_at,sr.finished_at,
                 sr.records_seen,sr.records_written,sr.error_message,sr.metadata
          from sync_runs sr
          join sources s on s.id=sr.source_id
          order by sr.started_at desc
          limit 30`,
      sql`select
            (select count(*) from plays)::int plays,
            (select count(distinct game_id) from plays)::int games_with_plays,
            (select count(*) from injury_reports)::int injury_reports,
            (select count(*) from weather_snapshots)::int weather_snapshots,
            (select count(*) from market_odds)::int market_odds,
            (select count(*) from futures_snapshots)::int futures_snapshots,
            (select count(*) from standings_snapshots)::int standings_snapshots`,
      sql`select w.id,w.game_id,w.observed_at,w.temperature_f,w.wind_mph,w.precipitation_probability,w.condition,w.alerts,
                 g.week,g.kickoff,ht.abbreviation home_abbr,at.abbreviation away_abbr
          from weather_snapshots w
          join games g on g.id=w.game_id
          join teams ht on ht.id=g.home_team_id
          join teams at on at.id=g.away_team_id
          where g.season=2026 and (ht.abbreviation='TEN' or at.abbreviation='TEN')
          order by w.observed_at desc
          limit 12`,
      sql`with ranked as (
            select mo.*,s.name source_name,
                   row_number() over(
                     partition by mo.source_id,mo.provider_event_id,mo.provider_odd_id,coalesce(mo.book_id,mo.book)
                     order by mo.captured_at desc,mo.id desc
                   ) rn
            from market_odds mo
            join sources s on s.id=mo.source_id
            where mo.available=true
          )
          select * from ranked where rn=1 order by captured_at desc limit 160`,
      sql`with ranked as (
            select fs.*,s.name source_name,
                   row_number() over(
                     partition by fs.source_id,coalesce(fs.provider_market_id,''),fs.market_type,fs.participant_name,coalesce(fs.book_id,fs.book)
                     order by fs.captured_at desc,fs.id desc
                   ) rn
            from futures_snapshots fs
            join sources s on s.id=fs.source_id
            where fs.available=true and fs.season=2026
          )
          select * from ranked where rn=1 order by captured_at desc limit 100`
    ]);

    const meta = Object.fromEntries(metaRows.map(r => [r.key,r.value]));

    const games = gameRows.map(g => {
      const home = g.home_abbr === 'TEN';
      return {
        id:String(g.id),
        week:g.season_type==='preseason'?`P${g.week}`:g.week,
        date:iso(g.kickoff),
        dateTbd:g.kickoff == null,
        opponent:home?g.away_name:g.home_name,
        opponentAbbr:home?g.away_abbr:g.home_abbr,
        homeAway:home?'home':'away',
        status:g.status,
        score:home?g.home_score:g.away_score,
        opponentScore:home?g.away_score:g.home_score,
        venue:g.venue||'',
        network:g.network||'',
        source:'Neon · Titans/NFL schedule'
      };
    });

    const roster = rosterRows.map(r => ({
      id:String(r.id),
      name:r.full_name,
      number:r.jersey_number||'',
      position:r.position||'',
      unit:r.unit||'',
      status:r.status||'Active',
      experience:r.experience||'',
      capturedAt:iso(r.captured_at),
      source:'Tennessee Titans roster snapshot'
    }));

    const sources = sourceRows.map(s => ({
      slug:s.slug,
      name:s.name,
      category:s.category,
      tier:s.tier,
      enabled:s.enabled,
      status:s.metadata?.status || (s.enabled?'Ready':'Disabled'),
      method:s.metadata?.method||'',
      cost:s.metadata?.cost||'Free',
      cadence:s.metadata?.cadence||'',
      purpose:s.metadata?.purpose||'',
      capabilities:s.capabilities||[]
    }));

    const transactions = transactionRows.map(t => ({
      id:String(t.id),
      date:asDateIso(t.transaction_date),
      type:t.transaction_type||'transaction',
      description:t.description||'',
      sourceUrl:t.source_url||''
    }));

    const feed = eventRows.map(e => ({
      id:String(e.id),
      type:e.event_type||'news',
      title:e.headline||'Titans update',
      summary:e.summary||'',
      url:e.source_url||'',
      tier:e.source_tier||'media',
      official:Boolean(e.is_official),
      confidence:e.confidence==null?null:Number(e.confidence),
      topics:e.topics||[],
      publishedAt:iso(e.published_at),
      source:e.source_name||'',
      sourceSlug:e.source_slug||''
    }));

    const syncRuns = syncRows.map(r => ({
      id:String(r.id),
      source:r.source_name||r.source_slug||'',
      sourceSlug:r.source_slug||'',
      job:r.job_type,
      status:r.status,
      startedAt:iso(r.started_at),
      finishedAt:iso(r.finished_at),
      recordsSeen:Number(r.records_seen||0),
      recordsWritten:Number(r.records_written||0),
      error:r.error_message||'',
      metadata:r.metadata||{}
    }));

    const coverage = coverageRows[0] || {};
    const weather = {
      rows:weatherRows.map(w => ({
        id:String(w.id),
        gameId:String(w.game_id),
        week:w.week,
        kickoff:iso(w.kickoff),
        observedAt:iso(w.observed_at),
        temperatureF:w.temperature_f==null?null:Number(w.temperature_f),
        windMph:w.wind_mph==null?null:Number(w.wind_mph),
        precipitationProbability:w.precipitation_probability==null?null:Number(w.precipitation_probability),
        condition:w.condition||'',
        alerts:w.alerts||[],
        homeAbbr:w.home_abbr,
        awayAbbr:w.away_abbr
      })),
      status:weatherRows.length?'available':'awaiting-ingest'
    };

    const marketRowsNormalized = marketRows.map(r => ({
      id:String(r.id),
      gameId:r.game_id?String(r.game_id):null,
      provider:r.source_name||'',
      providerEventId:r.provider_event_id,
      providerOddId:r.provider_odd_id,
      category:r.market_category,
      marketName:r.market_name||'',
      statId:r.stat_id||'',
      entityName:r.entity_name||'',
      playerId:r.player_id?String(r.player_id):null,
      periodId:r.period_id||'',
      betType:r.bet_type||'',
      side:r.side||'',
      book:r.book,
      line:r.line==null?null:Number(r.line),
      price:r.price==null?null:Number(r.price),
      isLive:Boolean(r.is_live),
      isAlt:Boolean(r.is_alt),
      capturedAt:iso(r.captured_at)
    }));

    const futures = futuresRows.map(r => ({
      id:String(r.id),
      provider:r.source_name||'',
      marketType:r.market_type,
      marketName:r.market_name,
      participantType:r.participant_type,
      participantName:r.participant_name,
      playerId:r.player_id?String(r.player_id):null,
      book:r.book,
      line:r.line==null?null:Number(r.line),
      price:r.price==null?null:Number(r.price),
      capturedAt:iso(r.captured_at)
    }));

    return {
      configured:true,
      ok:true,
      meta,
      games,
      roster,
      sources,
      transactions,
      feed,
      syncRuns,
      analytics:{coverage,efficiency:[]},
      weather,
      markets:{
        rows:marketRowsNormalized,
        futures,
        status:marketRowsNormalized.length||futures.length?'available':'awaiting-provider-sync'
      },
      dataQuality:{
        contentAuditAt:meta.content_audit_at||null,
        rosterSnapshotAt:meta.roster_snapshot_at||null,
        rosterPlayers:roster.length,
        eventRows:feed.length,
        transactionRows:transactions.length,
        coverage
      },
      fetchedAt:new Date().toISOString()
    };
  } catch (error) {
    console.error('[getBootstrapData]', error);
    return { configured:true, ok:false, error:'Database query failed' };
  }
}

export async function getPlayerProfile(playerId, env = process.env) {
  const sql = await getSql(env);
  if (!sql) return { configured:false, ok:false };
  try {
    const [players,rosterRows,statRows,injuryRows,propRows] = await Promise.all([
      sql`select id,full_name,first_name,last_name,position,college,active,metadata from players where id=${playerId}::uuid limit 1`,
      sql`select rs.jersey_number,rs.position,rs.unit,rs.roster_status,rs.experience,rs.captured_at,rs.raw_payload
          from roster_snapshots rs where rs.player_id=${playerId}::uuid order by rs.captured_at desc,rs.id desc limit 1`,
      sql`select pgs.id,pgs.stat_group,pgs.stats,pgs.captured_at,g.week,g.season_type,g.kickoff,
                 ht.abbreviation home_abbr,at.abbreviation away_abbr
          from player_game_stats pgs
          join games g on g.id=pgs.game_id
          join teams ht on ht.id=g.home_team_id
          join teams at on at.id=g.away_team_id
          where pgs.player_id=${playerId}::uuid
          order by g.kickoff desc nulls last,pgs.captured_at desc
          limit 40`,
      sql`select id,season,week,season_type,primary_injury,secondary_injury,report_status,practice_status,report_date,captured_at
          from injury_reports where player_id=${playerId}::uuid
          order by report_date desc nulls last,captured_at desc limit 30`,
      sql`with ranked as (
            select mo.*,s.name source_name,row_number() over(
              partition by mo.source_id,mo.provider_event_id,mo.provider_odd_id,coalesce(mo.book_id,mo.book)
              order by mo.captured_at desc,mo.id desc
            ) rn
            from market_odds mo join sources s on s.id=mo.source_id
            where mo.player_id=${playerId}::uuid and mo.available=true
          ) select * from ranked where rn=1 order by captured_at desc limit 50`
    ]);
    if (!players.length) return { configured:true, ok:false, error:'Player not found' };
    const p=players[0],r=rosterRows[0]||{};
    return {
      configured:true,
      ok:true,
      player:{
        id:String(p.id),
        name:p.full_name,
        firstName:p.first_name,
        lastName:p.last_name,
        position:r.position||p.position||'',
        college:p.college||'',
        active:p.active,
        number:r.jersey_number||'',
        unit:r.unit||'',
        rosterStatus:r.roster_status||'',
        experience:r.experience||'',
        rosterCapturedAt:iso(r.captured_at),
        metadata:p.metadata||{}
      },
      stats:statRows.map(s=>({
        id:String(s.id),statGroup:s.stat_group,stats:s.stats||{},capturedAt:iso(s.captured_at),week:s.week,
        seasonType:s.season_type,kickoff:iso(s.kickoff),homeAbbr:s.home_abbr,awayAbbr:s.away_abbr
      })),
      injuries:injuryRows.map(i=>({
        id:String(i.id),season:i.season,week:i.week,seasonType:i.season_type,primaryInjury:i.primary_injury||'',
        secondaryInjury:i.secondary_injury||'',reportStatus:i.report_status||'',practiceStatus:i.practice_status||'',
        reportDate:i.report_date?String(i.report_date).slice(0,10):null,capturedAt:iso(i.captured_at)
      })),
      props:propRows.map(r=>({
        id:String(r.id),provider:r.source_name||'',marketName:r.market_name||'',category:r.market_category||'',
        side:r.side||'',book:r.book,line:r.line==null?null:Number(r.line),price:r.price==null?null:Number(r.price),
        capturedAt:iso(r.captured_at)
      }))
    };
  } catch (error) {
    console.error('[getPlayerProfile]',error);
    return { configured:true,ok:false,error:'Player query failed' };
  }
}

export async function getAnalyticsExplorer(_filters = {}, env = process.env) {
  const sql = await getSql(env);
  if (!sql) return { configured:false,ok:false };
  try {
    const [row] = await sql`
      select (select count(*) from plays)::int plays,
             (select count(distinct game_id) from plays)::int games_with_plays,
             (select count(*) from team_game_metrics)::int team_metric_rows,
             (select count(*) from player_game_stats)::int player_stat_rows
    `;
    return {
      configured:true,
      ok:true,
      coverage:row||{},
      summary:{status:Number(row?.plays||0)>0?'available':'awaiting-play-by-play-import'},
      byGame:[],byDown:[],byQuarter:[],byPlayType:[]
    };
  } catch (error) {
    console.error('[getAnalyticsExplorer]',error);
    return { configured:true,ok:false,error:'Analytics query failed' };
  }
}
