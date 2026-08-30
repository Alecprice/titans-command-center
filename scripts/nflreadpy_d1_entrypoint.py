#!/usr/bin/env python3
"""Normalize nflverse team abbreviations before building D1 analytics snapshots."""
from __future__ import annotations

import polars as pl

import ingest_nflreadpy as ingest

# Titans Command Center uses current public team IDs. nflverse/nflfastR uses a
# few different current or historical abbreviations, most notably LA for the
# Rams. Normalize only known provider aliases at the source boundary so the
# existing analytics builder and API contract stay unchanged.
TEAM_ALIASES = {
    "LA": "LAR",
    "STL": "LAR",
    "SD": "LAC",
    "OAK": "LV",
    "JAC": "JAX",
    "WSH": "WAS",
}


def normalize_team_frame(frame, columns):
    if frame is None or frame.is_empty():
        return frame
    expressions = []
    for column in columns:
        if column in frame.columns:
            expressions.append(
                pl.col(column)
                .cast(pl.Utf8)
                .replace(TEAM_ALIASES)
                .alias(column)
            )
    return frame.with_columns(expressions) if expressions else frame


def normalized_loader(loader, columns):
    def wrapped(*args, **kwargs):
        return normalize_team_frame(loader(*args, **kwargs), columns)

    return wrapped


def install_team_code_adapter():
    ingest.nfl.load_schedules = normalized_loader(
        ingest.nfl.load_schedules,
        ("home_team", "away_team"),
    )
    ingest.nfl.load_team_stats = normalized_loader(
        ingest.nfl.load_team_stats,
        ("team",),
    )
    ingest.nfl.load_pbp = normalized_loader(
        ingest.nfl.load_pbp,
        ("posteam", "defteam", "home_team", "away_team"),
    )


def main():
    install_team_code_adapter()
    ingest.main()


if __name__ == "__main__":
    main()
