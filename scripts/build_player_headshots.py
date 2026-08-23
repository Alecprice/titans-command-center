#!/usr/bin/env python3
"""Build a current Titans player-headshot manifest from nflverse via nflreadpy."""
from __future__ import annotations

import json
import re
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

import nflreadpy as nfl

OUT = Path("assets/data/player-headshots.json")
ALLOWED_HOSTS = {
    "static.clubs.nfl.com",
    "static.www.nfl.com",
    "static.nfl.com",
    "a.espncdn.com",
    "a1.espncdn.com",
}


def clean_text(value):
    return "" if value is None else str(value).strip()


def normalize_name(value):
    text = unicodedata.normalize("NFKD", clean_text(value)).encode("ascii", "ignore").decode("ascii").lower()
    text = re.sub(r"\b(jr|sr|ii|iii|iv|v)\b", "", text)
    return re.sub(r"[^a-z0-9]+", "", text)


def safe_headshot(value):
    raw = clean_text(value)
    if not raw:
        return ""
    try:
        parsed = urlparse(raw)
    except ValueError:
        return ""
    if parsed.scheme != "https" or parsed.hostname not in ALLOWED_HOSTS:
        return ""
    return raw


def player_identity(row, player_row):
    name = clean_text(row.get("full_name") or player_row.get("display_name") or player_row.get("full_name"))
    return {
        "name": name or None,
        "normalizedName": normalize_name(name) or None,
        "number": clean_text(row.get("jersey_number")),
        "position": clean_text(row.get("position")),
        "status": clean_text(row.get("status")),
        "gsisId": clean_text(row.get("gsis_id")) or None,
        "espnId": clean_text(row.get("espn_id") or player_row.get("espn_id")) or None,
    }


def main():
    season = int(nfl.get_current_season(roster=True))
    rosters = nfl.load_rosters(season)
    players = nfl.load_players()

    players_by_gsis = {}
    if players is not None and players.height:
        for row in players.to_dicts():
            gsis = clean_text(row.get("gsis_id"))
            if gsis:
                players_by_gsis[gsis] = row

    entries = []
    omitted = []
    team_rows = [row for row in rosters.to_dicts() if clean_text(row.get("team")).upper() == "TEN"]
    for row in team_rows:
        gsis = clean_text(row.get("gsis_id"))
        player_row = players_by_gsis.get(gsis, {})
        identity = player_identity(row, player_row)
        url = safe_headshot(row.get("headshot_url")) or safe_headshot(player_row.get("headshot_url"))
        if not identity["name"]:
            omitted.append({**identity, "reason": "missing-player-name"})
            continue
        if not url:
            omitted.append({**identity, "reason": "no-approved-headshot-url"})
            continue
        entries.append({
            **identity,
            "headshotUrl": url,
            "imageHost": urlparse(url).hostname,
            "source": "nflverse roster headshot (NFL/ESPN)",
        })

    entries.sort(key=lambda row: (row["position"], row["name"]))
    omitted.sort(key=lambda row: (row["reason"], row.get("position") or "", row.get("name") or ""))
    roster_count = len(team_rows)
    headshot_count = len(entries)
    coverage_pct = round((headshot_count / roster_count) * 100, 1) if roster_count else 0.0
    omission_reasons = {}
    for row in omitted:
        reason = row["reason"]
        omission_reasons[reason] = omission_reasons.get(reason, 0) + 1

    payload = {
        "ok": True,
        "team": "TEN",
        "season": season,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "rosterRows": roster_count,
        "headshotCount": headshot_count,
        "coveragePct": coverage_pct,
        "omittedCount": len(omitted),
        "omissionReasons": omission_reasons,
        "omittedPlayers": omitted,
        "source": "nflreadpy.load_rosters + nflreadpy.load_players",
        "sourceDocs": "https://nflreadpy.nflverse.com/api/load_functions/",
        "players": entries,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2, sort_keys=False) + "\n", encoding="utf-8")
    print(json.dumps({
        "season": season,
        "rosterRows": roster_count,
        "headshotCount": headshot_count,
        "coveragePct": coverage_pct,
        "omittedCount": len(omitted),
        "omissionReasons": omission_reasons,
    }))
    if headshot_count < 60:
        raise SystemExit(f"Headshot coverage unexpectedly low: {headshot_count}")


if __name__ == "__main__":
    main()
