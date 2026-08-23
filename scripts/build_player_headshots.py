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
        "name": name,
        "normalizedName": normalize_name(name),
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
    missing = []
    team_rows = [row for row in rosters.to_dicts() if clean_text(row.get("team")).upper() == "TEN"]
    for row in team_rows:
        gsis = clean_text(row.get("gsis_id"))
        player_row = players_by_gsis.get(gsis, {})
        identity = player_identity(row, player_row)
        if not identity["name"]:
            continue
        url = safe_headshot(row.get("headshot_url")) or safe_headshot(player_row.get("headshot_url"))
        if not url:
            missing.append({**identity, "reason": "No trusted NFL/ESPN HTTPS headshot supplied by nflverse"})
            continue
        entries.append({
            **identity,
            "headshotUrl": url,
            "imageHost": urlparse(url).hostname,
            "source": "nflverse roster headshot (NFL/ESPN)",
        })

    entries.sort(key=lambda row: (row["position"], row["name"]))
    missing.sort(key=lambda row: (row["position"], row["name"]))
    payload = {
        "ok": True,
        "team": "TEN",
        "season": season,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "rosterRows": len(team_rows),
        "headshotCount": len(entries),
        "missingHeadshotCount": len(missing),
        "missingPlayers": missing,
        "source": "nflreadpy.load_rosters + nflreadpy.load_players",
        "sourceDocs": "https://nflreadpy.nflverse.com/api/load_functions/",
        "imagePolicy": "Only trusted NFL/ESPN HTTPS hosts are accepted; missing players keep the app's jersey-number fallback.",
        "players": entries,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2, sort_keys=False) + "\n", encoding="utf-8")
    print(json.dumps({"season": season, "rosterRows": len(team_rows), "headshotCount": len(entries), "missingHeadshotCount": len(missing), "missingPlayers": [row["name"] for row in missing]}))
    if len(entries) < 60:
        raise SystemExit(f"Headshot coverage unexpectedly low: {len(entries)}")


if __name__ == "__main__":
    main()
