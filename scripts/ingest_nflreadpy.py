#!/usr/bin/env python3
"""Build compact nflverse advanced-analytics snapshots for Cloudflare D1."""
from __future__ import annotations

import json
import math
import os
import sys
from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

import nflreadpy as nfl
import polars as pl

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
TEAM_STAT_KEYS = (
    "completions","attempts","passing_yards","passing_tds","passing_interceptions","passing_epa",
    "passing_cpoe","carries","rushing_yards","rushing_tds","rushing_epa","receptions",
    "receiving_yards","sacks_suffered","sack_yards_lost",
)
SNAPSHOT_SCOPE = "advanced-analytics:v1"
SNAPSHOT_SOURCE = "nflreadpy-d1-snapshot"
SNAPSHOT_TTL_HOURS = 36
SQL_OUT = Path(os.environ.get("NFLREADPY_SQL_OUT", "/tmp/nflreadpy-d1.sql"))
SUMMARY_OUT = Path(os.environ.get("NFLREADPY_SUMMARY_OUT", "/tmp/nflreadpy-d1-summary.json"))


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
        return False
    if isinstance(value, bool):
        return value
    n = as_int(value)
    if n is not None:
        return bool(n)
    return str(value).strip().lower() in {"true", "yes", "y"}


def iso(value):
    if value is None:
        return None
    if isinstance(value, str):
        raw = value.strip()
        if not raw:
            return None
        try:
            value = datetime.fromisoformat(raw.replace("Z", "+00:00"))
        except ValueError:
            return raw
    if isinstance(value, date) and not isinstance(value, datetime):
        value = datetime(value.year, value.month, value.day, tzinfo=timezone.utc)
    if isinstance(value, datetime):
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
    return str(value)


def season_type(value):
    value = str(value or "REG").upper()
    if value == "REG":
        return "regular"
    if value in POST_TYPES:
        return "postseason"
    return value.lower()


def safe_scalar(value):
    if isinstance(value, (date, datetime)):
        return iso(value)
    if isinstance(value, float):
        return value if math.isfinite(value) else None
    return value


def parse_seasons():
    raw = os.environ.get("NFLREADPY_SEASONS", "").strip()
    if raw:
        seasons = sorted({int(v.strip()) for v in raw.split(",") if v.strip()})
    else:
        current = int(nfl.get_current_season(roster=True))
        seasons = [current - 1, current]
    seasons = [season for season in seasons if season >= 1999]
    if not seasons:
        raise SystemExit("No valid NFLREADPY_SEASONS were requested")
    return seasons


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
        local = datetime.fromisoformat(f"{str(gameday)[:10]}T{gametime}:00").replace(
            tzinfo=ZoneInfo("America/New_York")
        )
        return iso(local.astimezone(timezone.utc))
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
    return (
        as_int(row.get("pass")) == 1
        or as_int(row.get("rush")) == 1
        or str(row.get("play_type") or "").lower() in {"pass", "run"}
    )


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


def schedule_map(schedule_rows):
    result = {}
    for row in schedule_rows:
        game_id = str(row.get("game_id") or "")
        if not game_id:
            continue
        result[game_id] = {
            "season": as_int(row.get("season")),
            "season_type": season_type(row.get("game_type")),
            "week": as_int(row.get("week")),
            "kickoff": kickoff_utc(row),
            "home_team": str(row.get("home_team") or ""),
            "away_team": str(row.get("away_team") or ""),
            "home_rest": as_int(row.get("home_rest")),
            "away_rest": as_int(row.get("away_rest")),
        }
    return result


def build_metrics(pbp_rows, team_stats_rows, schedule_rows):
    schedule = schedule_map(schedule_rows)
    team_stats = {}
    offense_epa = defaultdict(list)
    defense_epa = defaultdict(list)
    clocks = defaultdict(list)

    for row in team_stats_rows:
        game_id = str(row.get("game_id") or "")
        team = str(row.get("team") or "")
        if game_id and team:
            team_stats[(game_id, team)] = {key: safe_scalar(value) for key, value in row.items()}

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
        deltas = [
            previous - current
            for (_, previous), (_, current) in zip(rows, rows[1:])
            if 1 <= previous - current <= 60
        ]
        paces[key] = deltas

    metrics = []
    for game_id, team in sorted(set(offense_epa) | set(defense_epa) | set(team_stats)):
        info = schedule.get(game_id, {})
        raw = team_stats.get((game_id, team), {})
        off = offense_epa.get((game_id, team), [])
        deff = defense_epa.get((game_id, team), [])
        pace = paces.get((game_id, team), [])
        home = info.get("home_team") == team
        metrics.append({
            "game_id": game_id,
            "team": team,
            "season": info.get("season") or as_int(raw.get("season")),
            "season_type": info.get("season_type") or season_type(raw.get("season_type")),
            "week": info.get("week") or as_int(raw.get("week")),
            "kickoff": info.get("kickoff"),
            "opponent": info.get("away_team") if home else info.get("home_team"),
            "home_away": "home" if home else "away",
            "offensive_epa_per_play": sum(off) / len(off) if off else None,
            "defensive_epa_per_play_allowed": sum(deff) / len(deff) if deff else None,
            "pace_seconds_per_play": sum(pace) / len(pace) if pace else None,
            "offensive_plays": len(off),
            "defensive_plays": len(deff),
            "rest_days": info.get("home_rest") if home else info.get("away_rest"),
            "raw_team_stats": raw,
        })
    return metrics


def weighted(rows, value_key, weight_key):
    pairs = [
        (as_float(row.get(value_key)), as_int(row.get(weight_key)) or 0)
        for row in rows
        if as_float(row.get(value_key)) is not None and (as_int(row.get(weight_key)) or 0) > 0
    ]
    total = sum(weight for _, weight in pairs)
    return sum(value * weight for value, weight in pairs) / total if total else None


def rank_map(values, reverse=False):
    present = [(team, value) for team, value in values.items() if value is not None]
    present.sort(key=lambda item: item[1], reverse=reverse)
    ranks = {}
    previous = object()
    rank = 0
    for index, (team, value) in enumerate(present, start=1):
        if value != previous:
            rank = index
            previous = value
        ranks[team] = rank
    return ranks


def aggregate_league(metrics, data_season):
    grouped = defaultdict(list)
    for row in metrics:
        if row.get("season") == data_season and row.get("season_type") == "regular":
            grouped[row["team"]].append(row)

    aggregates = {}
    for team, rows in grouped.items():
        offensive_plays = sum(as_int(row.get("offensive_plays")) or 0 for row in rows)
        aggregates[team] = {
            "team": team,
            "offensiveEpaPerPlay": weighted(rows, "offensive_epa_per_play", "offensive_plays"),
            "defensiveEpaPerPlayAllowed": weighted(rows, "defensive_epa_per_play_allowed", "defensive_plays"),
            "paceSecondsPerPlay": weighted(rows, "pace_seconds_per_play", "offensive_plays"),
            "plays": offensive_plays,
        }

    offense_ranks = rank_map({team: row["offensiveEpaPerPlay"] for team, row in aggregates.items()}, reverse=True)
    defense_ranks = rank_map({team: row["defensiveEpaPerPlayAllowed"] for team, row in aggregates.items()})
    pace_ranks = rank_map({team: row["paceSecondsPerPlay"] for team, row in aggregates.items()})
    team_count = len(aggregates)

    league = []
    for team in sorted(aggregates):
        row = aggregates[team]
        league.append({
            **row,
            "offenseRank": offense_ranks.get(team),
            "defenseRank": defense_ranks.get(team),
            "paceRank": pace_ranks.get(team),
            "teamCount": team_count,
        })
    return league


def team_stat_subset(raw):
    return {key: safe_scalar(raw[key]) for key in TEAM_STAT_KEYS if raw.get(key) is not None}


def data_season_for(metrics, requested_season):
    seasons = {
        as_int(row.get("season"))
        for row in metrics
        if row.get("season_type") == "regular"
        and (as_int(row.get("offensive_plays")) or 0) + (as_int(row.get("defensive_plays")) or 0) > 0
        and as_int(row.get("season")) is not None
        and as_int(row.get("season")) <= requested_season
    }
    return max(seasons) if seasons else None


def recent_plays_for(team, data_season, pbp_rows, schedules, personnel):
    rows = []
    for row in pbp_rows:
        game_id = str(row.get("game_id") or "")
        info = schedules.get(game_id, {})
        if info.get("season") != data_season or info.get("season_type") != "regular":
            continue
        post = str(row.get("posteam") or "")
        deff = str(row.get("defteam") or "")
        if team not in {post, deff}:
            continue
        part = personnel.get((game_id, play_key(row.get("play_id"))), {})
        side = "offense" if post == team else "defense"
        raw_diff = as_float(row.get("score_differential"))
        rows.append({
            "_week": info.get("week") or as_int(row.get("week")) or 0,
            "_play": as_int(row.get("play_id")) or 0,
            "week": info.get("week") or as_int(row.get("week")),
            "kickoff": info.get("kickoff"),
            "playNumber": as_int(row.get("play_id")),
            "quarter": as_int(row.get("qtr")),
            "clock": str(row.get("time") or ""),
            "down": as_int(row.get("down")),
            "distance": as_int(row.get("ydstogo")),
            "yardline": str(row.get("yrdln") or ""),
            "yardline100": as_float(row.get("yardline_100")),
            "scoreDifferential": None if raw_diff is None else (raw_diff if side == "offense" else -raw_diff),
            "offenseScoreDifferential": raw_diff,
            "gameSecondsRemaining": as_int(row.get("game_seconds_remaining")),
            "offensePersonnel": str(part.get("offense_personnel") or row.get("offense_personnel") or ""),
            "defensePersonnel": str(part.get("defense_personnel") or row.get("defense_personnel") or ""),
            "offenseFormation": str(part.get("offense_formation") or row.get("offense_formation") or ""),
            "defendersInBox": as_float(part.get("defenders_in_box") if part.get("defenders_in_box") is not None else row.get("defenders_in_box")),
            "noHuddle": as_bool(row.get("no_huddle")),
            "description": str(row.get("desc") or ""),
            "playType": str(row.get("play_type") or ""),
            "yardsGained": as_float(row.get("yards_gained")),
            "epa": as_float(row.get("epa")),
            "wp": as_float(row.get("wp")),
            "wpa": as_float(row.get("wpa")),
            "posteam": post,
            "defteam": deff,
            "homeTeam": info.get("home_team") or "",
            "awayTeam": info.get("away_team") or "",
            "side": side,
        })
    rows.sort(key=lambda row: (row["_week"], row["_play"]), reverse=True)
    for row in rows:
        row.pop("_week", None)
        row.pop("_play", None)
    return rows[:80]


def down_splits_for(team, data_season, pbp_rows, schedules):
    buckets = {down: {"offense": [], "defense": []} for down in range(1, 5)}
    for row in pbp_rows:
        game_id = str(row.get("game_id") or "")
        info = schedules.get(game_id, {})
        if info.get("season") != data_season or info.get("season_type") != "regular" or not designed_play(row):
            continue
        down = as_int(row.get("down"))
        if down not in buckets:
            continue
        epa = as_float(row.get("epa"))
        post = str(row.get("posteam") or "")
        deff = str(row.get("defteam") or "")
        if post == team and epa is not None:
            buckets[down]["offense"].append(epa)
        if deff == team and epa is not None:
            buckets[down]["defense"].append(epa)

    result = []
    for down, values in buckets.items():
        if not values["offense"] and not values["defense"]:
            continue
        result.append({
            "down": down,
            "offensePlays": len(values["offense"]),
            "offensiveEpaPerPlay": sum(values["offense"]) / len(values["offense"]) if values["offense"] else None,
            "defensePlays": len(values["defense"]),
            "defensiveEpaPerPlayAllowed": sum(values["defense"]) / len(values["defense"]) if values["defense"] else None,
        })
    return result


def personnel_splits_for(team, data_season, pbp_rows, schedules, personnel):
    buckets = defaultdict(list)
    for row in pbp_rows:
        game_id = str(row.get("game_id") or "")
        info = schedules.get(game_id, {})
        if info.get("season") != data_season or info.get("season_type") != "regular" or not designed_play(row):
            continue
        epa = as_float(row.get("epa"))
        if epa is None:
            continue
        part = personnel.get((game_id, play_key(row.get("play_id"))), {})
        post = str(row.get("posteam") or "")
        deff = str(row.get("defteam") or "")
        if post == team:
            package = str(part.get("offense_personnel") or row.get("offense_personnel") or "").strip()
            if package:
                buckets[("Offense", package)].append(epa)
        if deff == team:
            package = str(part.get("defense_personnel") or row.get("defense_personnel") or "").strip()
            if package:
                buckets[("Defense", package)].append(epa)

    result = [
        {"side": side, "package": package, "plays": len(values), "epaPerPlay": sum(values) / len(values)}
        for (side, package), values in buckets.items()
    ]
    result.sort(key=lambda row: (row["side"], -row["plays"], row["package"]))
    return result[:20]


def sources():
    return [
        {"label":"nflverse / nflfastR via nflreadpy","role":"Primary team stats + play-by-play + EPA/WPA","url":"https://nflreadpy.nflverse.com/"},
        {"label":"nflverse participation","role":"Historical offense/defense personnel and formation","url":"https://nflreadr.nflverse.com/articles/dictionary_participation.html"},
        {"label":"NFL Savant","role":"Secondary processed PBP cross-check","url":"https://nflsavant.com/"},
        {"label":"Pro-Football-Reference","role":"Historical/advanced-stat cross-check","url":"https://www.pro-football-reference.com/"},
        {"label":"Kaggle","role":"Optional reviewed historical datasets; disabled by default","url":"https://www.kaggle.com/datasets"},
    ]


def snapshot_key(requested_season, team):
    # Matches apiSnapshotKey('advanced-analytics:v1',{season,team}) in src/d1-api-snapshot.mjs.
    return f"{SNAPSHOT_SCOPE}:season={requested_season}:team={team}"


def build_payload(requested_season, team, metrics, pbp_rows, schedules, personnel, coverage, generated_at):
    data_season = data_season_for(metrics, requested_season)
    if data_season is None:
        return {
            "ok": True, "status": "awaiting-nflreadpy-ingest", "requestedSeason": requested_season,
            "dataSeason": None, "team": team, "seasonFallback": False, "coverage": coverage,
            "summary": None, "weeks": [], "league": [], "recentPlays": [], "byDown": [], "personnel": [],
            "sources": sources(), "fetchedAt": generated_at,
        }

    league = aggregate_league(metrics, data_season)
    selected_league = next((row for row in league if row["team"] == team), None)
    team_rows = [
        row for row in metrics
        if row.get("season") == data_season and row.get("season_type") == "regular" and row.get("team") == team
    ]
    team_rows.sort(key=lambda row: as_int(row.get("week")) or 0)
    offensive_plays = sum(as_int(row.get("offensive_plays")) or 0 for row in team_rows)
    defensive_plays = sum(as_int(row.get("defensive_plays")) or 0 for row in team_rows)
    rest_values = [
        (as_int(row.get("week")) or 0, as_int(row.get("rest_days")))
        for row in team_rows if as_int(row.get("rest_days")) is not None
    ]
    latest_rest = max(rest_values)[1] if rest_values else None
    latest_week = max((as_int(row.get("week")) or 0 for row in team_rows), default=None)

    summary = None
    if team_rows:
        summary = {
            "team": team,
            "offensiveEpaPerPlay": weighted(team_rows, "offensive_epa_per_play", "offensive_plays"),
            "defensiveEpaPerPlayAllowed": weighted(team_rows, "defensive_epa_per_play_allowed", "defensive_plays"),
            "paceSecondsPerPlay": weighted(team_rows, "pace_seconds_per_play", "offensive_plays"),
            "offensivePlays": offensive_plays,
            "defensivePlays": defensive_plays,
            "latestRestDays": latest_rest,
            "latestWeek": latest_week,
            "calculatedAt": generated_at,
            "offenseRank": selected_league.get("offenseRank") if selected_league else None,
            "defenseRank": selected_league.get("defenseRank") if selected_league else None,
            "paceRank": selected_league.get("paceRank") if selected_league else None,
            "teamCount": selected_league.get("teamCount") if selected_league else len(league),
        }

    weeks = [{
        "week": as_int(row.get("week")),
        "opponent": row.get("opponent") or "",
        "homeAway": row.get("home_away") or "",
        "kickoff": row.get("kickoff"),
        "offensiveEpaPerPlay": as_float(row.get("offensive_epa_per_play")),
        "defensiveEpaPerPlayAllowed": as_float(row.get("defensive_epa_per_play_allowed")),
        "paceSecondsPerPlay": as_float(row.get("pace_seconds_per_play")),
        "offensivePlays": as_int(row.get("offensive_plays")),
        "defensivePlays": as_int(row.get("defensive_plays")),
        "restDays": as_int(row.get("rest_days")),
        "teamStats": team_stat_subset(row.get("raw_team_stats") or {}),
    } for row in team_rows]

    return {
        "ok": True,
        "status": "available" if summary else "awaiting-nflreadpy-ingest",
        "requestedSeason": requested_season,
        "dataSeason": data_season,
        "team": team,
        "seasonFallback": data_season != requested_season,
        "coverage": coverage,
        "summary": summary,
        "weeks": weeks,
        "league": league,
        "recentPlays": recent_plays_for(team, data_season, pbp_rows, schedules, personnel),
        "byDown": down_splits_for(team, data_season, pbp_rows, schedules),
        "personnel": personnel_splits_for(team, data_season, pbp_rows, schedules, personnel),
        "sources": sources(),
        "fetchedAt": generated_at,
    }


def sql_quote(value):
    return "'" + str(value).replace("'", "''") + "'"


def write_sql(snapshots, generated_at):
    generated = datetime.fromisoformat(generated_at.replace("Z", "+00:00"))
    expires_at = iso(generated + timedelta(hours=SNAPSHOT_TTL_HOURS))
    lines = ["BEGIN TRANSACTION;"]
    for key, payload in snapshots:
        encoded = json.dumps(payload, separators=(",", ":"), ensure_ascii=False, allow_nan=False)
        lines.append(
            "INSERT INTO api_snapshots(cache_key,payload,source,fetched_at,expires_at,updated_at) VALUES("
            f"{sql_quote(key)},{sql_quote(encoded)},{sql_quote(SNAPSHOT_SOURCE)},"
            f"{sql_quote(generated_at)},{sql_quote(expires_at)},{sql_quote(generated_at)}) "
            "ON CONFLICT(cache_key) DO UPDATE SET "
            "payload=excluded.payload,source=excluded.source,fetched_at=excluded.fetched_at,"
            "expires_at=excluded.expires_at,updated_at=excluded.updated_at;"
        )
    lines.append("COMMIT;")
    SQL_OUT.parent.mkdir(parents=True, exist_ok=True)
    SQL_OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return expires_at


def main():
    requested_seasons = parse_seasons()
    load_seasons = sorted(set(requested_seasons + [max(requested_seasons) - 1]))
    load_seasons = [season for season in load_seasons if season >= 1999]
    print(f"[nflreadpy] requested seasons={requested_seasons}; load seasons={load_seasons}")

    schedules_frame = load_each("schedules", nfl.load_schedules, load_seasons)
    team_stats_frame = load_each("team-stats", nfl.load_team_stats, load_seasons, summary_level="week")
    pbp_frame = load_each("pbp", nfl.load_pbp, load_seasons)

    roster_year = int(nfl.get_current_season(roster=True))
    participation_seasons = [season for season in load_seasons if 2016 <= season < roster_year]
    participation_frame = (
        load_each("participation", nfl.load_participation, participation_seasons)
        if participation_seasons else pl.DataFrame()
    )

    schedule_rows = [] if schedules_frame.is_empty() else schedules_frame.to_dicts()
    team_stats_rows = [] if team_stats_frame.is_empty() else team_stats_frame.to_dicts()
    pbp_rows = [] if pbp_frame.is_empty() else pbp_frame.to_dicts()
    personnel = personnel_map(participation_frame)
    schedules = schedule_map(schedule_rows)
    metrics = build_metrics(pbp_rows, team_stats_rows, schedule_rows)
    generated_at = iso(datetime.now(timezone.utc))

    personnel_plays = 0
    for row in pbp_rows:
        game_id = str(row.get("game_id") or "")
        part = personnel.get((game_id, play_key(row.get("play_id"))), {})
        if (
            part.get("offense_personnel") or part.get("defense_personnel")
            or row.get("offense_personnel") or row.get("defense_personnel")
        ):
            personnel_plays += 1

    coverage = {
        "plays": len(pbp_rows),
        "games": len({str(row.get("game_id")) for row in pbp_rows if row.get("game_id")}),
        "team_week_metrics": len(metrics),
        "personnel_plays": personnel_plays,
        "analytics_last_ingest_at": generated_at,
    }

    snapshots = []
    teams = sorted(TEAM_NAMES)
    for requested_season in requested_seasons:
        for team in teams:
            payload = build_payload(
                requested_season, team, metrics, pbp_rows, schedules, personnel, coverage, generated_at
            )
            snapshots.append((snapshot_key(requested_season, team), payload))

    available = sum(1 for _, payload in snapshots if payload.get("status") == "available")
    if not snapshots or available < 1:
        raise SystemExit("nflreadpy did not produce any available advanced-analytics snapshots")

    expires_at = write_sql(snapshots, generated_at)
    ten_keys = [key for key, payload in snapshots if payload.get("team") == "TEN"]
    summary = {
        "ok": True,
        "requestedSeasons": requested_seasons,
        "loadedSeasons": load_seasons,
        "teams": len(teams),
        "snapshots": len(snapshots),
        "availableSnapshots": available,
        "tennesseeKeys": ten_keys,
        "generatedAt": generated_at,
        "expiresAt": expires_at,
        "sqlFile": str(SQL_OUT),
        "source": SNAPSHOT_SOURCE,
        "coverage": coverage,
    }
    SUMMARY_OUT.parent.mkdir(parents=True, exist_ok=True)
    SUMMARY_OUT.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
