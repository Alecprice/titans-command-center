# Titans Command Center — Multi-Source Audit (2026-08-19)

This audit prevents a polished UI from making stale or conflicting football data look authoritative.

## Source arbitration

### Current roster, schedule, transactions, staff, depth chart, injury-report status, current brand
1. TennesseeTitans.com
2. NFL.com / official NFL records
3. Structured enrichment (nflverse) after identity/date validation
4. Pro Football Reference / reputable media
5. Wikipedia / community context

### Franchise history and records
1. Tennessee Titans official history
2. Pro Football Hall of Fame
3. NFL historical records
4. Pro Football Reference
5. Wikipedia

### Visual/logo history
1. Tennessee Titans current brand and logo-history pages
2. SportsLogos.net as a secondary era/variant cross-check
3. User-supplied graphics only after their subject/era is verified

A secondary source never overrides a current official team/league source simply because it is easier to parse.

## Conflicts discovered

- **2026 preseason opener:** Tennessee Titans/NFL schedule = Aug. 13, 2026. Pro Football Reference currently shows Aug. 15. App uses Aug. 13.
- **Franchise origin:** Hall of Fame = franchise granted Aug. 14, 1959; first season 1960. Some summaries say only “Est. 1960.” App displays both milestones.
- **Week 18:** official current schedule time is TBD. Do not infer or fabricate Jan. 10 kickoff time from secondary schedule templates.
- **Injuries:** official Titans injury-report page says weekly injury reports begin in the regular season. A zero-row injury table during preseason means **not published**, not “no injuries.” Reserve/Injured roster status is separate.

## Current verified personnel snapshot
- Controlling Owner: Amy Adams Strunk
- General Manager: Mike Borgonzi
- President & CEO: Burke Nihill
- Head Coach: Robert Saleh
- Offensive Coordinator: Brian Daboll
- Defensive Coordinator: Gus Bradley
- Assistant Head Coach / Special Teams Coordinator: John Fassel

## Depth chart
The warehouse contains the official **UNOFFICIAL depth chart as of 2026-08-09**.
- Offense: 45 assignments / 11 position groups
- Defense: 43 assignments / 12 position groups
- Special Teams: 13 assignments / 7 position groups
- 101 total assignments

Players sharing the same depth rank remain tied. The UI must never flatten ties into invented starter/backup ordering. The date and “UNOFFICIAL” label must remain visible.

## Statistics rules
- Current 2026 regular-season totals are not displayed before the regular season begins.
- 2025 data may be shown only in a visually separate **2025 verified baseline** block.
- Verified examples cross-checked with NFL.com/PFR:
  - Cam Ward: 323/540, 3,169 passing yards, 15 TD, 7 INT, 80.2 rating.
  - Tony Pollard: 242 carries, 1,082 rushing yards, 4.5 yards/attempt, 5 rushing TD.
  - Jeffery Simmons: 15 games, 65 total tackles, 11 sacks, 1 safety.

## Visual archive rules
- “The Shield” is the current 2026 primary mark.
- The Oilers derrick changed color/helmet treatments repeatedly; one graphic cannot be labeled as every 1960–98 year-specific logo.
- Era-spanning assets are labeled **representative visual** unless the exact year variant is verified.
- Comparison graphics are labeled **reference graphic**, not official standalone logos.
- SportsLogos is used for year-range cross-checking; TennesseeTitans.com wins for current branding.

## Responsive product contract
### Desktop (>= 1200px)
- Permanent information rail where space permits.
- Multi-column roster/source/depth-chart layouts.
- Full provenance and utility metadata visible.

### Tablet (760–1199px)
- Two-column content where readable.
- Collapsible navigation.
- Depth chart reduces from three unit columns to two/stacked.

### Mobile (<= 759px)
- Single-column reading order.
- Off-canvas side navigation + bottom navigation.
- 44px minimum coarse-pointer touch targets.
- Schedule becomes stacked cards instead of a squeezed desktop row.
- Roster/depth/staff switcher is compact and horizontally safe.
- Depth positions render as cards, never a wide table.
- Safe-area insets and 100dvh behavior for installed PWA use.

### Small mobile (<= 480px)
- Player cards and stat blocks stack further.
- Secondary metadata is condensed rather than horizontally overflowing.
