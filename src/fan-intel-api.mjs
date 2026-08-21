import {getSql} from './db.mjs';

const iso=value=>value?new Date(value).toISOString():null;
const num=value=>value==null?null:Number(value);
const text=value=>String(value??'').trim();

function methodOnly(req,res){
  res.setHeader('Allow','GET');
  if(req.method!=='GET'){
    res.status(405).json({ok:false,error:'Method not allowed'});
    return true;
  }
  return false;
}

function recordOf(row){
  if(!row)return null;
  const wins=Number(row.wins||0),losses=Number(row.losses||0),ties=Number(row.ties||0);
  return `${wins}-${losses}${ties?`-${ties}`:''}`;
}

function gameResult(row,teamAbbr){
  const home=row.home_abbr===teamAbbr;
  const score=home?row.home_score:row.away_score;
  const opponentScore=home?row.away_score:row.home_score;
  if(score==null||opponentScore==null)return null;
  return score===opponentScore?'T':score>opponentScore?'W':'L';
}

function depthChanges(currentRows,previousRows){
  if(!currentRows.length||!previousRows.length)return [];
  const previous=new Map(previousRows.map(row=>[String(row.player_id),row]));
  const changes=[];
  for(const row of currentRows){
    const old=previous.get(String(row.player_id));
    if(!old){
      changes.push({type:'added',playerId:String(row.player_id),name:row.full_name,position:row.position,unit:row.position_group,from:null,to:Number(row.rank||0)});
      continue;
    }
    const oldRank=Number(old.rank||0),newRank=Number(row.rank||0),oldSlot=Number(old.slot||0),newSlot=Number(row.slot||0);
    if(oldRank!==newRank||oldSlot!==newSlot||old.position!==row.position){
      changes.push({type:newRank<oldRank?'up':newRank>oldRank?'down':'changed',playerId:String(row.player_id),name:row.full_name,position:row.position,unit:row.position_group,from:oldRank||null,to:newRank||null});
    }
  }
  return changes.slice(0,24);
}

export async function fanIntelRoute(req,res,env=process.env){
  if(methodOnly(req,res))return;
  res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=300');
  const sql=await getSql(env);
  if(!sql)return res.status(503).json({ok:false,configured:false,error:'Database not configured'});

  try{
    const [standingsRows,injuryRows,depthRows,contractRows,opponentRows,driveRows,playRows,teamMetricRows,statRows]=await Promise.all([
      sql`with ranked as (
            select ss.*,t.abbreviation,t.name,t.city,t.conference,t.division,s.name source_name,
                   row_number() over(partition by ss.team_id order by ss.captured_at desc,ss.id desc) rn
            from standings_snapshots ss
            join teams t on t.id=ss.team_id
            join sources s on s.id=ss.source_id
            where ss.season=2026 and lower(ss.season_type) not like '%pre%'
          )
          select * from ranked where rn=1
          order by case when division='AFC South' then 0 else 1 end,conference_rank nulls last,division_rank nulls last,name`,
      sql`with ranked as (
            select ir.*,p.full_name,p.position,rs.jersey_number,s.name source_name,
                   row_number() over(partition by ir.player_id order by ir.report_date desc nulls last,ir.captured_at desc,ir.id desc) rn
            from injury_reports ir
            join teams t on t.id=ir.team_id and t.abbreviation='TEN'
            left join players p on p.id=ir.player_id
            left join lateral (
              select r.jersey_number from roster_snapshots r where r.player_id=ir.player_id order by r.captured_at desc,r.id desc limit 1
            ) rs on true
            join sources s on s.id=ir.source_id
            where ir.season=2026
          )
          select * from ranked where rn=1 order by report_date desc nulls last,full_name`,
      sql`with stamps as (
            select distinct d.captured_at
            from depth_chart_snapshots d join teams t on t.id=d.team_id
            where t.abbreviation='TEN'
            order by d.captured_at desc limit 2
          )
          select d.captured_at,d.position_group,d.position,d.slot,d.rank,d.player_id,p.full_name
          from depth_chart_snapshots d
          join teams t on t.id=d.team_id and t.abbreviation='TEN'
          join stamps x on x.captured_at=d.captured_at
          left join players p on p.id=d.player_id
          order by d.captured_at desc,d.position_group,d.slot,d.rank,p.full_name`,
      sql`with ranked as (
            select c.*,p.full_name,p.position,s.name source_name,
                   row_number() over(partition by c.player_id order by c.captured_at desc,c.id desc) rn
            from contracts c
            join teams t on t.id=c.team_id and t.abbreviation='TEN'
            join players p on p.id=c.player_id
            join sources s on s.id=c.source_id
          )
          select * from ranked where rn=1 and coalesce(is_active,true)=true order by apy desc nulls last,total_value desc nulls last limit 80`,
      sql`with ten as (select id from teams where abbreviation='TEN'),
          next_game as (
            select g.*,case when g.home_team_id=(select id from ten) then g.away_team_id else g.home_team_id end opponent_id
            from games g
            where g.season=2026 and (g.home_team_id=(select id from ten) or g.away_team_id=(select id from ten))
              and g.kickoff>now() and lower(g.status) not like '%final%'
            order by g.kickoff limit 1
          )
          select g.id,g.week,g.season_type,g.kickoff,g.status,g.home_score,g.away_score,
                 ht.abbreviation home_abbr,ht.name home_name,at.abbreviation away_abbr,at.name away_name,
                 o.abbreviation opponent_abbr,o.name opponent_name,o.conference,o.division
          from next_game ng
          join teams o on o.id=ng.opponent_id
          join games g on g.season=2026 and (g.home_team_id=o.id or g.away_team_id=o.id)
          join teams ht on ht.id=g.home_team_id join teams at on at.id=g.away_team_id
          order by g.kickoff desc nulls last limit 8`,
      sql`with ten as (select id from teams where abbreviation='TEN')
          select d.id,d.game_id,d.drive_number,d.start_yardline,d.end_yardline,d.plays_count,d.yards,d.result,
                 g.week,g.kickoff,t.abbreviation team_abbr
          from drives d join games g on g.id=d.game_id left join teams t on t.id=d.team_id
          where g.season=2026 and (g.home_team_id=(select id from ten) or g.away_team_id=(select id from ten))
          order by g.kickoff desc nulls last,d.drive_number desc limit 24`,
      sql`with ten as (select id from teams where abbreviation='TEN')
          select p.id,p.game_id,p.play_number,p.quarter,p.clock,p.down,p.ydstogo,p.yardline,p.description,p.play_type,
                 p.yards_gained,p.epa,p.wp,p.wpa,p.success,p.explosive,g.week,g.kickoff,pt.abbreviation posteam_abbr
          from plays p join games g on g.id=p.game_id left join teams pt on pt.id=p.posteam_id
          where g.season=2026 and (g.home_team_id=(select id from ten) or g.away_team_id=(select id from ten))
          order by g.kickoff desc nulls last,p.play_number desc limit 80`,
      sql`with ten as (select id from teams where abbreviation='TEN')
          select tgm.game_id,tgm.metrics,tgm.calculated_at,g.week,g.kickoff
          from team_game_metrics tgm join games g on g.id=tgm.game_id
          where tgm.team_id=(select id from ten) order by g.kickoff desc nulls last limit 8`,
      sql`with ten as (select id from teams where abbreviation='TEN')
          select pgs.player_id,p.full_name,p.position,pgs.stat_group,pgs.stats,pgs.captured_at,g.week,g.kickoff
          from player_game_stats pgs join players p on p.id=pgs.player_id join games g on g.id=pgs.game_id
          where g.season=2026 and (g.home_team_id=(select id from ten) or g.away_team_id=(select id from ten))
          order by g.kickoff desc nulls last,pgs.captured_at desc limit 180`
    ]);

    const standings=standingsRows.map(row=>({
      team:row.name,abbreviation:row.abbreviation,conference:row.conference,division:row.division,record:recordOf(row),wins:Number(row.wins||0),losses:Number(row.losses||0),ties:Number(row.ties||0),winPct:num(row.win_pct),divisionRank:num(row.division_rank),conferenceRank:num(row.conference_rank),pointsFor:num(row.points_for),pointsAgainst:num(row.points_against),capturedAt:iso(row.captured_at),source:row.source_name||''
    }));

    const injuries=injuryRows.map(row=>({
      id:String(row.id),playerId:row.player_id?String(row.player_id):null,name:row.full_name||'Player',number:row.jersey_number||'',position:row.position||'',primaryInjury:row.primary_injury||'',secondaryInjury:row.secondary_injury||'',reportStatus:row.report_status||'',practiceStatus:row.practice_status||'',reportDate:row.report_date?String(row.report_date).slice(0,10):null,capturedAt:iso(row.captured_at),source:row.source_name||''
    }));

    const stamps=[...new Set(depthRows.map(row=>iso(row.captured_at)).filter(Boolean))];
    const currentDepth=depthRows.filter(row=>iso(row.captured_at)===stamps[0]);
    const previousDepth=depthRows.filter(row=>iso(row.captured_at)===stamps[1]);
    const depthChart={capturedAt:stamps[0]||null,previousCapturedAt:stamps[1]||null,changes:depthChanges(currentDepth,previousDepth)};

    const contracts=contractRows.map(row=>({
      playerId:String(row.player_id),name:row.full_name,position:row.position||'',yearSigned:num(row.year_signed),years:num(row.years),totalValue:num(row.total_value),apy:num(row.apy),guaranteed:num(row.guaranteed),capturedAt:iso(row.captured_at),source:row.source_name||''
    }));

    const opponent=opponentRows.length?{
      name:opponentRows[0].opponent_name,abbreviation:opponentRows[0].opponent_abbr,conference:opponentRows[0].conference,division:opponentRows[0].division,
      recent:opponentRows.map(row=>({week:row.week,seasonType:row.season_type,kickoff:iso(row.kickoff),status:row.status,home:row.home_name,away:row.away_name,result:gameResult(row,row.opponent_abbr),score:row.home_score==null||row.away_score==null?null:`${row.home_score}-${row.away_score}`}))
    }:null;

    const drives=driveRows.map(row=>({id:String(row.id),gameId:String(row.game_id),drive:Number(row.drive_number||0),start:row.start_yardline||'',end:row.end_yardline||'',plays:num(row.plays_count),yards:num(row.yards),result:row.result||'',week:row.week,kickoff:iso(row.kickoff),team:row.team_abbr||''}));
    const plays=playRows.map(row=>({id:String(row.id),gameId:String(row.game_id),play:Number(row.play_number||0),quarter:num(row.quarter),clock:row.clock||'',down:num(row.down),yardsToGo:num(row.ydstogo),yardline:row.yardline||'',description:row.description||'',type:row.play_type||'',yards:num(row.yards_gained),epa:num(row.epa),winProbability:num(row.wp),winProbabilityAdded:num(row.wpa),success:Boolean(row.success),explosive:Boolean(row.explosive),week:row.week,kickoff:iso(row.kickoff),possession:row.posteam_abbr||''}));
    const teamMetrics=teamMetricRows.map(row=>({gameId:String(row.game_id),week:row.week,kickoff:iso(row.kickoff),metrics:row.metrics||{},calculatedAt:iso(row.calculated_at)}));
    const playerStats=statRows.map(row=>({playerId:String(row.player_id),name:row.full_name,position:row.position||'',statGroup:row.stat_group,stats:row.stats||{},week:row.week,kickoff:iso(row.kickoff),capturedAt:iso(row.captured_at)}));

    return res.status(200).json({
      ok:true,season:2026,standings,injuries,depthChart,contracts,opponent,gameDay:{drives,plays,teamMetrics},playerStats,
      availability:{standings:Boolean(standings.length),injuries:Boolean(injuries.length),depthChanges:Boolean(depthChart.changes.length),contracts:Boolean(contracts.length),opponent:Boolean(opponent),drives:Boolean(drives.length),plays:Boolean(plays.length),playerStats:Boolean(playerStats.length)},
      fetchedAt:new Date().toISOString()
    });
  }catch(error){
    console.error('[fan-intel-api]',error);
    return res.status(500).json({ok:false,error:'Fan intelligence query failed'});
  }
}
