import {getSql} from './db.mjs';

const num=value=>value==null?null:Number(value);
const integer=value=>value==null?null:Number.parseInt(value,10);
const queryOf=req=>req?.query||{};
const cleanTeam=value=>/^[A-Z]{2,3}$/.test(String(value||'').toUpperCase())?String(value).toUpperCase():'TEN';
const cleanSeason=value=>{const n=Number(value);return Number.isInteger(n)&&n>=1999&&n<=2100?n:2026};

function methodOnly(req,res){
  if(req.method==='GET')return false;
  res.setHeader('Allow','GET');
  res.status(405).json({ok:false,error:'Method not allowed'});
  return true;
}

function teamStatSubset(raw={}){
  const keys=['completions','attempts','passing_yards','passing_tds','passing_interceptions','passing_epa','passing_cpoe','carries','rushing_yards','rushing_tds','rushing_epa','receptions','receiving_yards','sacks_suffered','sack_yards_lost'];
  return Object.fromEntries(keys.filter(key=>raw?.[key]!=null).map(key=>[key,raw[key]]));
}

const sources=()=>[
  {label:'nflverse / nflfastR via nflreadpy',role:'Primary team stats + play-by-play + EPA/WPA',url:'https://nflreadpy.nflverse.com/'},
  {label:'nflverse participation',role:'Historical offense/defense personnel and formation',url:'https://nflreadr.nflverse.com/articles/dictionary_participation.html'},
  {label:'NFL Savant',role:'Secondary processed PBP cross-check',url:'https://nflsavant.com/'},
  {label:'Pro-Football-Reference',role:'Historical/advanced-stat cross-check',url:'https://www.pro-football-reference.com/'},
  {label:'Kaggle',role:'Optional reviewed historical datasets; disabled by default',url:'https://www.kaggle.com/datasets'}
];

export async function advancedAnalyticsRoute(req,res,env=process.env){
  if(methodOnly(req,res))return;
  res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=900');
  const requestedSeason=cleanSeason(queryOf(req).season),team=cleanTeam(queryOf(req).team);
  const sql=await getSql(env);
  if(!sql)return res.status(503).json({ok:false,configured:false,error:'Database not configured'});
  try{
    const [available]=await sql`
      select max(twm.season)::int season
      from team_week_metrics twm
      join teams t on t.id=twm.team_id
      where t.abbreviation=${team} and twm.season<=${requestedSeason}
        and (coalesce(twm.offensive_plays,0)>0 or coalesce(twm.defensive_plays,0)>0)`;
    const dataSeason=integer(available?.season);
    const [coverage]=await sql`
      select (select count(*) from plays)::int plays,
             (select count(distinct game_id) from plays)::int games,
             (select count(*) from team_week_metrics)::int team_week_metrics,
             (select count(*) from plays where offense_personnel is not null or defense_personnel is not null)::int personnel_plays,
             (select value from schema_meta where key='analytics_last_ingest_at') analytics_last_ingest_at`;

    if(!dataSeason){
      return res.status(200).json({
        ok:true,status:'awaiting-nflreadpy-ingest',requestedSeason,dataSeason:null,team,seasonFallback:false,coverage,
        summary:null,weeks:[],league:[],recentPlays:[],byDown:[],personnel:[],sources:sources(),fetchedAt:new Date().toISOString()
      });
    }

    const [summaryRows,weekRows,leagueRows,playRows,downRows,personnelRows]=await Promise.all([
      sql`
        select t.abbreviation,
          sum(twm.offensive_epa_per_play*twm.offensive_plays)/nullif(sum(twm.offensive_plays),0) offensive_epa_per_play,
          sum(twm.defensive_epa_per_play_allowed*twm.defensive_plays)/nullif(sum(twm.defensive_plays),0) defensive_epa_per_play_allowed,
          sum(twm.pace_seconds_per_play*twm.offensive_plays)/nullif(sum(twm.offensive_plays),0) pace_seconds_per_play,
          sum(twm.offensive_plays)::int offensive_plays,sum(twm.defensive_plays)::int defensive_plays,
          (array_agg(twm.rest_days order by twm.week desc) filter(where twm.rest_days is not null))[1]::int latest_rest_days,
          max(twm.week)::int latest_week,max(twm.calculated_at) calculated_at
        from team_week_metrics twm join teams t on t.id=twm.team_id
        where twm.season=${dataSeason} and twm.season_type='regular' and t.abbreviation=${team}
        group by t.abbreviation`,
      sql`
        select twm.week,twm.season_type,twm.offensive_epa_per_play,twm.defensive_epa_per_play_allowed,
          twm.pace_seconds_per_play,twm.offensive_plays,twm.defensive_plays,twm.rest_days,twm.raw_team_stats,
          case when ht.abbreviation=${team} then at.abbreviation else ht.abbreviation end opponent,
          case when ht.abbreviation=${team} then 'home' else 'away' end home_away,g.kickoff
        from team_week_metrics twm
        join teams t on t.id=twm.team_id join games g on g.id=twm.game_id
        join teams ht on ht.id=g.home_team_id join teams at on at.id=g.away_team_id
        where twm.season=${dataSeason} and twm.season_type='regular' and t.abbreviation=${team}
        order by twm.week`,
      sql`
        with agg as (
          select t.abbreviation,
            sum(twm.offensive_epa_per_play*twm.offensive_plays)/nullif(sum(twm.offensive_plays),0) off_epa,
            sum(twm.defensive_epa_per_play_allowed*twm.defensive_plays)/nullif(sum(twm.defensive_plays),0) def_epa_allowed,
            sum(twm.pace_seconds_per_play*twm.offensive_plays)/nullif(sum(twm.offensive_plays),0) pace,
            sum(twm.offensive_plays)::int plays
          from team_week_metrics twm join teams t on t.id=twm.team_id
          where twm.season=${dataSeason} and twm.season_type='regular'
          group by t.abbreviation
        )
        select abbreviation,off_epa,def_epa_allowed,pace,plays,
          rank() over(order by off_epa desc nulls last)::int offense_rank,
          rank() over(order by def_epa_allowed asc nulls last)::int defense_rank,
          rank() over(order by pace asc nulls last)::int pace_rank,
          count(*) over()::int team_count
        from agg order by abbreviation`,
      sql`
        select g.week,g.kickoff,p.play_number,p.quarter,p.clock,p.down,p.ydstogo,p.yardline,p.yardline_100,
          p.score_differential,p.game_seconds_remaining,p.offense_personnel,p.defense_personnel,p.offense_formation,
          p.defenders_in_box,p.no_huddle,p.description,p.play_type,p.yards_gained,p.epa,p.wp,p.wpa,
          pt.abbreviation posteam,dt.abbreviation defteam,ht.abbreviation home_team,at.abbreviation away_team
        from plays p join games g on g.id=p.game_id
        left join teams pt on pt.id=p.posteam_id left join teams dt on dt.id=p.defteam_id
        join teams ht on ht.id=g.home_team_id join teams at on at.id=g.away_team_id
        where g.season=${dataSeason} and g.season_type='regular' and (pt.abbreviation=${team} or dt.abbreviation=${team})
        order by g.week desc,p.play_number desc nulls last limit 80`,
      sql`
        select p.down,
          count(*) filter(where pt.abbreviation=${team})::int offense_plays,
          avg(p.epa) filter(where pt.abbreviation=${team}) offense_epa,
          count(*) filter(where dt.abbreviation=${team})::int defense_plays,
          avg(p.epa) filter(where dt.abbreviation=${team}) defense_epa_allowed
        from plays p join games g on g.id=p.game_id
        left join teams pt on pt.id=p.posteam_id left join teams dt on dt.id=p.defteam_id
        where g.season=${dataSeason} and g.season_type='regular' and p.epa is not null and p.down between 1 and 4
          and p.play_type in ('pass','run') and (pt.abbreviation=${team} or dt.abbreviation=${team})
        group by p.down order by p.down`,
      sql`
        select side,package,plays,epa from (
          select 'Offense' side,p.offense_personnel package,count(*)::int plays,avg(p.epa) epa
          from plays p join games g on g.id=p.game_id join teams pt on pt.id=p.posteam_id
          where g.season=${dataSeason} and g.season_type='regular' and pt.abbreviation=${team}
            and p.offense_personnel is not null and p.epa is not null and p.play_type in ('pass','run')
          group by p.offense_personnel
          union all
          select 'Defense' side,p.defense_personnel package,count(*)::int plays,avg(p.epa) epa
          from plays p join games g on g.id=p.game_id join teams dt on dt.id=p.defteam_id
          where g.season=${dataSeason} and g.season_type='regular' and dt.abbreviation=${team}
            and p.defense_personnel is not null and p.epa is not null and p.play_type in ('pass','run')
          group by p.defense_personnel
        ) x order by side,plays desc limit 20`
    ]);

    const league=leagueRows.map(r=>({
      team:r.abbreviation,offensiveEpaPerPlay:num(r.off_epa),defensiveEpaPerPlayAllowed:num(r.def_epa_allowed),paceSecondsPerPlay:num(r.pace),
      plays:integer(r.plays),offenseRank:integer(r.offense_rank),defenseRank:integer(r.defense_rank),paceRank:integer(r.pace_rank),teamCount:integer(r.team_count)
    }));
    const selectedLeague=league.find(r=>r.team===team)||null;
    const row=summaryRows[0]||null;
    const summary=row?{
      team,offensiveEpaPerPlay:num(row.offensive_epa_per_play),defensiveEpaPerPlayAllowed:num(row.defensive_epa_per_play_allowed),
      paceSecondsPerPlay:num(row.pace_seconds_per_play),offensivePlays:integer(row.offensive_plays),defensivePlays:integer(row.defensive_plays),
      latestRestDays:integer(row.latest_rest_days),latestWeek:integer(row.latest_week),calculatedAt:row.calculated_at?new Date(row.calculated_at).toISOString():null,
      offenseRank:selectedLeague?.offenseRank??null,defenseRank:selectedLeague?.defenseRank??null,paceRank:selectedLeague?.paceRank??null,teamCount:selectedLeague?.teamCount??league.length
    }:null;

    const weeks=weekRows.map(r=>({
      week:integer(r.week),opponent:r.opponent,homeAway:r.home_away,kickoff:r.kickoff?new Date(r.kickoff).toISOString():null,
      offensiveEpaPerPlay:num(r.offensive_epa_per_play),defensiveEpaPerPlayAllowed:num(r.defensive_epa_per_play_allowed),
      paceSecondsPerPlay:num(r.pace_seconds_per_play),offensivePlays:integer(r.offensive_plays),defensivePlays:integer(r.defensive_plays),
      restDays:integer(r.rest_days),teamStats:teamStatSubset(r.raw_team_stats||{})
    }));
    const recentPlays=playRows.map(r=>{
      const side=r.posteam===team?'offense':'defense',rawDiff=num(r.score_differential);
      return {
        week:integer(r.week),kickoff:r.kickoff?new Date(r.kickoff).toISOString():null,playNumber:integer(r.play_number),quarter:integer(r.quarter),clock:r.clock||'',
        down:integer(r.down),distance:integer(r.ydstogo),yardline:r.yardline||'',yardline100:num(r.yardline_100),
        scoreDifferential:rawDiff==null?null:(side==='offense'?rawDiff:-rawDiff),offenseScoreDifferential:rawDiff,
        gameSecondsRemaining:integer(r.game_seconds_remaining),offensePersonnel:r.offense_personnel||'',defensePersonnel:r.defense_personnel||'',
        offenseFormation:r.offense_formation||'',defendersInBox:num(r.defenders_in_box),noHuddle:Boolean(r.no_huddle),description:r.description||'',
        playType:r.play_type||'',yardsGained:num(r.yards_gained),epa:num(r.epa),wp:num(r.wp),wpa:num(r.wpa),posteam:r.posteam||'',defteam:r.defteam||'',
        homeTeam:r.home_team,awayTeam:r.away_team,side
      };
    });
    const byDown=downRows.map(r=>({down:integer(r.down),offensePlays:integer(r.offense_plays),offensiveEpaPerPlay:num(r.offense_epa),defensePlays:integer(r.defense_plays),defensiveEpaPerPlayAllowed:num(r.defense_epa_allowed)}));
    const personnel=personnelRows.map(r=>({side:r.side,package:r.package,plays:integer(r.plays),epaPerPlay:num(r.epa)}));

    return res.status(200).json({
      ok:true,status:'available',requestedSeason,dataSeason,team,seasonFallback:dataSeason!==requestedSeason,coverage,summary,weeks,league,recentPlays,byDown,personnel,
      sources:sources(),fetchedAt:new Date().toISOString()
    });
  }catch(error){
    console.error('[advancedAnalyticsRoute]',error);
    res.setHeader('Cache-Control','no-store');
    return res.status(200).json({
      ok:false,available:false,status:'database-unavailable',configured:true,requestedSeason,dataSeason:null,team,seasonFallback:false,
      coverage:null,summary:null,weeks:[],league:[],recentPlays:[],byDown:[],personnel:[],sources:sources(),
      error:'Advanced analytics query failed',fetchedAt:new Date().toISOString()
    });
  }
}
