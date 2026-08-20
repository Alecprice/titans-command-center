#!/usr/bin/env python3
"""Load nflverse team and play-by-play analytics into Neon with nflreadpy."""
from __future__ import annotations

import json
import math
import os
import sys
from collections import defaultdict
from datetime import date, datetime, timezone
from zoneinfo import ZoneInfo

import nflreadpy as nfl
import polars as pl
import psycopg
from psycopg.types.json import Jsonb

DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
if not DATABASE_URL:
    raise SystemExit("DATABASE_URL is required")

TEAM_NAMES = {
    "ARI":"Arizona Cardinals","ATL":"Atlanta Falcons","BAL":"Baltimore Ravens","BUF":"Buffalo Bills",
    "CAR":"Carolina Panthers","CHI":"Chicago Bears","CIN":"Cincinnati Bengals","CLE":"Cleveland Browns",
    "DAL":"Dallas Cowboys","DEN":"Denver Broncos","DET":"Detroit Lions","GB":"Green Bay Packers",
    "HOU":"Houston Texans","IND":"Indianapolis Colts","JAX":"Jacksonville Jaguars","KC":"Kansas City Chiefs",
    "LV":"Las Vegas Raiders","LAC":"Los Angeles Chargers","LAR":"Los Angeles Rams","MIA":"Miami Dolphins",
    "MIN":"Minnesota Vikings","NE":"New England Patriots","NO":"New Orleans Saints","NYG":"New York Giants",
    "NYJ":"New York Jets","PHI":"Philadelphia Eagles","PIT":"Pittsburgh Steelers","SEA":"Seattle Seahawks",
    "SF":"San Francisco 49ers","TB":"Tampa Bay Buccaneers","TEN":"Tennessee Titans","WAS":"Washington Commanders",
}
POST_TYPES = {"WC", "DIV", "CON", "SB", "POST"}


def as_int(value):
    try:
        if value is None:
            return None
        n = float(value)
        return int(n) if math.isfinite(n) else None
    except (TypeError, ValueError, OverflowError):
        return None


def as_float(value):
    try:
        if value is None:
            return None
        n = float(value)
        return n if math.isfinite(n) else None
    except (TypeError, ValueError, OverflowError):
        return None


def as_bool(value):
    if value is None:
        return None
    if isinstance(value, bool):
        return value
    n = as_int(value)
    if n is not None:
        return bool(n)
    return str(value).strip().lower() in {"true", "yes", "y"}


def season_type(value):
    value = str(value or "REG").upper()
    if value == "REG":
        return "regular"
    if value in POST_TYPES:
        return "postseason"
    return value.lower()


def json_safe(row):
    clean = {}
    for key, value in row.items():
        if isinstance(value, (date, datetime)):
            clean[key] = value.isoformat()
        elif isinstance(value, float) and not math.isfinite(value):
            clean[key] = None
        else:
            clean[key] = value
    return clean


def parse_seasons():
    raw = os.environ.get("NFLREADPY_SEASONS", "").strip()
    if raw:
        seasons = sorted({int(v.strip()) for v in raw.split(",") if v.strip()})
    else:
        current = int(nfl.get_current_season(roster=True))
        seasons = [current - 1, current]
    return [season for season in seasons if season >= 1999]


def load_each(label, loader, seasons, **kwargs):
    frames = []
    for season in seasons:
        try:
            frame = loader(season, **kwargs)
            if frame is not None and frame.height:
                frames.append(frame)
                print(f"[nflreadpy] {label} {season}: {frame.height:,} rows")
            else:
                print(f"[nflreadpy] {label} {season}: no rows")
        except Exception as exc:
            print(f"[nflreadpy] {label} {season}: skipped ({type(exc).__name__}: {exc})", file=sys.stderr)
    return pl.concat(frames, how="diagonal_relaxed") if frames else pl.DataFrame()


def kickoff_utc(row):
    gameday = row.get("gameday") or row.get("game_date")
    if not gameday:
        return None
    gametime = str(row.get("gametime") or "12:00")[:5]
    try:
        local = datetime.fromisoformat(f"{str(gameday)[:10]}T{gametime}:00").replace(tzinfo=ZoneInfo("America/New_York"))
        return local.astimezone(timezone.utc)
    except ValueError:
        return None


def play_key(value):
    n = as_int(value)
    return str(n) if n is not None else str(value or "").strip()


def designed_play(row):
    if as_int(row.get("qb_kneel")) == 1 or as_int(row.get("qb_spike")) == 1:
        return False
    if as_float(row.get("epa")) is None:
        return False
    return as_int(row.get("pass")) == 1 or as_int(row.get("rush")) == 1 or str(row.get("play_type") or "").lower() in {"pass", "run"}


def personnel_map(frame):
    result = {}
    if frame.is_empty():
        return result
    for row in frame.to_dicts():
        game_id = str(row.get("nflverse_game_id") or row.get("game_id") or "")
        pid = play_key(row.get("play_id"))
        if game_id and pid:
            result[(game_id, pid)] = row
    return result


def build_metrics(pbp_rows, team_stats_rows, schedule_rows):
    schedule = {}
    team_stats = {}
    offense_epa = defaultdict(list)
    defense_epa = defaultdict(list)
    clocks = defaultdict(list)

    for row in schedule_rows:
        game_id = str(row.get("game_id") or "")
        if not game_id:
            continue
        for side, rest_field in (("home", "home_rest"), ("away", "away_rest")):
            team = str(row.get(f"{side}_team") or "")
            if team:
                schedule[(game_id, team)] = {
                    "season": as_int(row.get("season")),
                    "week": as_int(row.get("week")),
                    "season_type": season_type(row.get("game_type")),
                    "rest_days": as_int(row.get(rest_field)),
                }

    for row in team_stats_rows:
        game_id = str(row.get("game_id") or "")
        team = str(row.get("team") or "")
        if game_id and team:
            team_stats[(game_id, team)] = json_safe(row)

    for row in pbp_rows:
        if not designed_play(row):
            continue
        game_id = str(row.get("game_id") or "")
        post = str(row.get("posteam") or "")
        deff = str(row.get("defteam") or "")
        epa = as_float(row.get("epa"))
        if game_id and post and epa is not None:
            offense_epa[(game_id, post)].append(epa)
            seconds = as_int(row.get("game_seconds_remaining"))
            if seconds is not None:
                clocks[(game_id, post)].append((as_int(row.get("play_id")) or 0, seconds))
        if game_id and deff and epa is not None:
            defense_epa[(game_id, deff)].append(epa)

    paces = {}
    for key, rows in clocks.items():
        rows.sort(key=lambda item: item[0])
        deltas = [previous - current for (_, previous), (_, current) in zip(rows, rows[1:]) if 1 <= previous - current <= 60]
        paces[key] = deltas

    metrics = []
    for game_id, team in sorted(set(offense_epa) | set(defense_epa) | set(team_stats)):
        info = schedule.get((game_id, team), {})
        raw = team_stats.get((game_id, team), {})
        off = offense_epa.get((game_id, team), [])
        deff = defense_epa.get((game_id, team), [])
        pace = paces.get((game_id, team), [])
        metrics.append({
            "game_id": game_id,
            "team": team,
            "season": info.get("season") or as_int(raw.get("season")),
            "season_type": info.get("season_type") or season_type(raw.get("season_type")),
            "week": info.get("week") or as_int(raw.get("week")),
            "offensive_epa_per_play": sum(off) / len(off) if off else None,
            "defensive_epa_per_play_allowed": sum(deff) / len(deff) if deff else None,
            "pace_seconds_per_play": sum(pace) / len(pace) if pace else None,
            "offensive_plays": len(off),
            "defensive_plays": len(deff),
            "rest_days": info.get("rest_days"),
            "raw_team_stats": raw,
        })
    return metrics


def main():
    seasons = parse_seasons()
    print(f"[nflreadpy] seasons={seasons}")

    schedules = load_each("schedules", nfl.load_schedules, seasons)
    team_stats = load_each("team-stats", nfl.load_team_stats, seasons, summary_level="week")
    pbp = load_each("pbp", nfl.load_pbp, seasons)

    roster_year = int(nfl.get_current_season(roster=True))
    participation_seasons = [season for season in seasons if 2016 <= season < roster_year]
    participation = load_each("participation", nfl.load_participation, participation_seasons) if participation_seasons else pl.DataFrame()

    schedule_rows = [] if schedules.is_empty() else schedules.to_dicts()
    team_stats_rows = [] if team_stats.is_empty() else team_stats.to_dicts()
    pbp_rows = [] if pbp.is_empty() else pbp.to_dicts()
    personnel = personnel_map(participation)
    metrics = build_metrics(pbp_rows, team_stats_rows, schedule_rows)

    abbreviations = set()
    for row in schedule_rows:
        abbreviations.update(v for v in (row.get("home_team"), row.get("away_team")) if v)
    for row in pbp_rows:
        abbreviations.update(v for v in (row.get("posteam"), row.get("defteam")) if v)
    for row in team_stats_rows:
        if row.get("team"):
            abbreviations.add(row["team"])

    with psycopg.connect(DATABASE_URL, autocommit=False) as conn:
        with conn.cursor() as cur:
            cur.execute("select id from sources where slug='nflverse' limit 1")
            source = cur.fetchone()
            if not source:
                raise RuntimeError("nflverse source missing; apply migration 010 first")
            source_id = source[0]

            for abbreviation in sorted(str(v) for v in abbreviations):
                cur.execute(
                    """insert into teams(provider_key,abbreviation,name,metadata)
                       values(%s,%s,%s,%s)
                       on conflict(abbreviation) do update set
                         provider_key=coalesce(teams.provider_key,excluded.provider_key),
                         name=case when teams.name is null or teams.name=teams.abbreviation then excluded.name else teams.name end,
                         metadata=teams.metadata || excluded.metadata""",
                    (abbreviation, abbreviation, TEAM_NAMES.get(abbreviation, abbreviation), Jsonb({"analytics_source":"nflverse"})),
                )
            cur.execute("select abbreviation,id from teams")
            team_ids = dict(cur.fetchall())

            game_ids = {}
            for row in schedule_rows:
                nflverse_id = str(row.get("game_id") or "")
                home, away = str(row.get("home_team") or ""), str(row.get("away_team") or "")
                season, week = as_int(row.get("season")), as_int(row.get("week"))
                if not nflverse_id or home not in team_ids or away not in team_ids or season is None or week is None:
                    continue
                stype = season_type(row.get("game_type"))
                final = row.get("home_score") is not None and row.get("away_score") is not None
                cur.execute(
                    """insert into games(season,season_type,week,kickoff,home_team_id,away_team_id,venue,network,status,home_score,away_score,metadata)
                       values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                       on conflict(season,season_type,week,home_team_id,away_team_id) do update set
                         kickoff=coalesce(excluded.kickoff,games.kickoff),status=excluded.status,
                         home_score=excluded.home_score,away_score=excluded.away_score,metadata=games.metadata || excluded.metadata
                       returning id""",
                    (season, stype, week, kickoff_utc(row), team_ids[home], team_ids[away], row.get("stadium"), None,
                     "final" if final else "scheduled", as_int(row.get("home_score")), as_int(row.get("away_score")), Jsonb({"nflverse_game_id":nflverse_id})),
                )
                internal_game_id = cur.fetchone()[0]
                game_ids[nflverse_id] = internal_game_id
                cur.execute(
                    """insert into provider_game_ids(game_id,source_id,provider_game_id) values(%s,%s,%s)
                       on conflict(source_id,provider_game_id) do update set game_id=excluded.game_id""",
                    (internal_game_id, source_id, nflverse_id),
                )

            cur.execute("""create temporary table stage_nflverse_plays(
                game_id uuid,source_id uuid,provider_play_id text,play_number int,quarter int,clock text,down int,ydstogo int,
                yardline text,yardline_100 numeric,posteam_id uuid,defteam_id uuid,description text,play_type text,yards_gained numeric,
                epa numeric,wp numeric,wpa numeric,success boolean,explosive boolean,score_differential numeric,game_seconds_remaining int,
                offense_personnel text,defense_personnel text,offense_formation text,defenders_in_box numeric,no_huddle boolean,raw_payload jsonb
            ) on commit drop""")

            staged = 0
            with cur.copy("""copy stage_nflverse_plays(
                game_id,source_id,provider_play_id,play_number,quarter,clock,down,ydstogo,yardline,yardline_100,posteam_id,defteam_id,
                description,play_type,yards_gained,epa,wp,wpa,success,explosive,score_differential,game_seconds_remaining,
                offense_personnel,defense_personnel,offense_formation,defenders_in_box,no_huddle,raw_payload) from stdin""") as copy:
                for row in pbp_rows:
                    nflverse_id = str(row.get("game_id") or "")
                    pid = play_key(row.get("play_id"))
                    if nflverse_id not in game_ids or not pid:
                        continue
                    post, deff = str(row.get("posteam") or ""), str(row.get("defteam") or "")
                    part = personnel.get((nflverse_id, pid), {})
                    yards = as_float(row.get("yards_gained"))
                    copy.write_row((
                        game_ids[nflverse_id], source_id, f"{nflverse_id}:{pid}", as_int(row.get("play_id")), as_int(row.get("qtr")), row.get("time"),
                        as_int(row.get("down")), as_int(row.get("ydstogo")), row.get("yrdln"), as_float(row.get("yardline_100")),
                        team_ids.get(post), team_ids.get(deff), row.get("desc"), row.get("play_type"), yards, as_float(row.get("epa")),
                        as_float(row.get("wp")), as_float(row.get("wpa")), as_bool(row.get("success")), bool(yards is not None and yards >= 20),
                        as_float(row.get("score_differential")), as_int(row.get("game_seconds_remaining")),
                        part.get("offense_personnel") or row.get("offense_personnel"), part.get("defense_personnel") or row.get("defense_personnel"),
                        part.get("offense_formation") or row.get("offense_formation"), as_float(part.get("defenders_in_box") or row.get("defenders_in_box")),
                        as_bool(row.get("no_huddle")), Jsonb({"game_id":nflverse_id,"play_id":pid,"season":as_int(row.get("season")),"week":as_int(row.get("week")),"side_of_field":row.get("side_of_field"),"goal_to_go":as_bool(row.get("goal_to_go")),"shotgun":as_bool(row.get("shotgun"))}),
                    ))
                    staged += 1

            cur.execute("""insert into plays(
                game_id,source_id,provider_play_id,play_number,quarter,clock,down,ydstogo,yardline,yardline_100,posteam_id,defteam_id,
                description,play_type,yards_gained,epa,wp,wpa,success,explosive,score_differential,game_seconds_remaining,
                offense_personnel,defense_personnel,offense_formation,defenders_in_box,no_huddle,raw_payload)
              select game_id,source_id,provider_play_id,play_number,quarter,clock,down,ydstogo,yardline,yardline_100,posteam_id,defteam_id,
                description,play_type,yards_gained,epa,wp,wpa,success,explosive,score_differential,game_seconds_remaining,
                offense_personnel,defense_personnel,offense_formation,defenders_in_box,no_huddle,raw_payload from stage_nflverse_plays
              on conflict(source_id,provider_play_id) do update set
                game_id=excluded.game_id,play_number=excluded.play_number,quarter=excluded.quarter,clock=excluded.clock,down=excluded.down,
                ydstogo=excluded.ydstogo,yardline=excluded.yardline,yardline_100=excluded.yardline_100,posteam_id=excluded.posteam_id,
                defteam_id=excluded.defteam_id,description=excluded.description,play_type=excluded.play_type,yards_gained=excluded.yards_gained,
                epa=excluded.epa,wp=excluded.wp,wpa=excluded.wpa,success=excluded.success,explosive=excluded.explosive,
                score_differential=excluded.score_differential,game_seconds_remaining=excluded.game_seconds_remaining,
                offense_personnel=excluded.offense_personnel,defense_personnel=excluded.defense_personnel,offense_formation=excluded.offense_formation,
                defenders_in_box=excluded.defenders_in_box,no_huddle=excluded.no_huddle,raw_payload=excluded.raw_payload""")

            metric_rows = 0
            for item in metrics:
                if item["game_id"] not in game_ids or item["team"] not in team_ids or item["season"] is None or item["week"] is None:
                    continue
                cur.execute(
                    """insert into team_week_metrics(season,season_type,week,game_id,team_id,source_id,offensive_epa_per_play,
                         defensive_epa_per_play_allowed,pace_seconds_per_play,offensive_plays,defensive_plays,rest_days,raw_team_stats,calculated_at)
                       values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,now())
                       on conflict(source_id,game_id,team_id) do update set season=excluded.season,season_type=excluded.season_type,week=excluded.week,
                         offensive_epa_per_play=excluded.offensive_epa_per_play,defensive_epa_per_play_allowed=excluded.defensive_epa_per_play_allowed,
                         pace_seconds_per_play=excluded.pace_seconds_per_play,offensive_plays=excluded.offensive_plays,defensive_plays=excluded.defensive_plays,
                         rest_days=excluded.rest_days,raw_team_stats=excluded.raw_team_stats,calculated_at=now()""",
                    (item["season"],item["season_type"],item["week"],game_ids[item["game_id"]],team_ids[item["team"]],source_id,
                     item["offensive_epa_per_play"],item["defensive_epa_per_play_allowed"],item["pace_seconds_per_play"],item["offensive_plays"],
                     item["defensive_plays"],item["rest_days"],Jsonb(item["raw_team_stats"])),
                )
                metric_rows += 1

            metadata = {"seasons":seasons,"pbp_rows":len(pbp_rows),"team_stats_rows":len(team_stats_rows),"schedule_rows":len(schedule_rows),
                        "participation_rows":0 if participation.is_empty() else participation.height,"personnel_seasons":participation_seasons,"client":"nflreadpy 0.1.5"}
            cur.execute("""insert into sync_runs(source_id,job_type,status,started_at,finished_at,records_seen,records_written,metadata)
                           values(%s,'nflreadpy-analytics','success',now(),now(),%s,%s,%s)""",
                        (source_id,len(pbp_rows)+len(team_stats_rows),staged+metric_rows,Jsonb(metadata)))
            cur.execute("""insert into schema_meta(key,value,updated_at) values('analytics_last_ingest_at',%s,now())
                           on conflict(key) do update set value=excluded.value,updated_at=excluded.updated_at""",
                        (datetime.now(timezone.utc).isoformat(),))
        conn.commit()

    print(json.dumps({"ok":True,"seasons":seasons,"scheduleRows":len(schedule_rows),"teamStatsRows":len(team_stats_rows),
                      "pbpRows":len(pbp_rows),"participationRows":0 if participation.is_empty() else participation.height,
                      "playsStaged":staged,"teamMetricRows":metric_rows}, indent=2))


if __name__ == "__main__":
    main()
