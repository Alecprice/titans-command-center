# Titans Command Center — Content Integrity Policy

Last full audit: **2026-08-19**

Current-team roster fallback audit: **2026-09-02** — 53 Active players plus 7 reserve-list players; the 17-player practice squad is tracked separately.

The site is a fan-built product, but factual team information should be held to a newsroom/data-product standard. A polished UI is not permission to make an uncertain fact look definitive.

## Source hierarchy

### Current and fast-changing facts

For current roster, jersey numbers, coaching staff, front office, transactions, schedule, game status, depth chart and current brand details:

1. **TennesseeTitans.com** — primary source of truth.
2. **NFL.com / official NFL records** — schedule and league-status cross-check.
3. Structured free data sources such as nflverse — analytics/data enrichment after identity/date checks.
4. Reputable secondary references — context only.
5. Wikipedia — useful cross-check, not authoritative for live roster/personnel.

### Stable historical facts

1. Tennessee Titans official history/logo-history pages.
2. Pro Football Hall of Fame team facts and records.
3. NFL historical records.
4. Pro Football Reference.
5. Wikipedia as a secondary cross-check and discovery source.

When reliable sources use different conventions, preserve the nuance instead of forcing one answer. Example: the franchise was **granted Aug. 14, 1959** and **began play in 1960**.

### Historical visual identity

1. Tennessee Titans current brand and logo/helmet history.
2. SportsLogos.net for specialist logo/wordmark chronology.
3. Pro Football Hall of Fame for stable era milestones.
4. Wikipedia and Pro Football Reference as secondary historical cross-checks.

The active visual metadata catalog is `src/visual-audit.mjs`; see `docs/VISUAL_AUDIT.md`.

## Display rules

- A fallback subset must be explicitly labeled **sample**, **subset**, or **players loaded**; its count must not be shown as the size of the Titans roster.
- TBD dates/times/networks remain **TBD**. Do not create placeholder timestamps that look official.
- Bye weeks are represented as bye weeks, not as an opponent named “BYE.”
- Current news fallback items must link to a verifiable source and must not contain invented reporter/social placeholders.
- Subjective tags such as “leader,” “core,” “watch,” or “new” are editorial labels, not roster facts. Do not display them as factual metadata unless the label is explicitly defined and sourced.
- Historical images must be labeled by what the image actually depicts. Decorative/fan artwork must not be presented as an official period logo.
- Historical visuals use one of three verification classes: **verified**, **representative**, or **reference composite**.
- An exact year/title is permitted only when the asset itself is verified to that identity. Era relevance alone is not enough.
- A filename is not evidence. Multiple filenames pointing to the same binary cannot support several contradictory identities.
- A uniform redesign year is not automatically a primary-logo redesign year. In particular, 2018 changed the Titans’ helmet/uniform/wordmark system while the fireball-T primary mark remained in use through 2025.
- The Titans’ sword secondary/alternate mark is historically documented, but an image may receive that label only when the file itself is verified to depict it. The separate 2018 uniform redesign also used sword-inspired helmet, jersey and pant details.
- UI colors may approximate official brand colors, but implementation HEX values are not described as official Pantone/HEX standards unless the team publishes them as such.
- Every historical era claim in the Legacy timeline should have visible source links.
- Every active archive card should provide accessible alt text, a human-readable description, a verification class and provenance/source links.

## Freshness rules

- Schedule/current roster/front office/coaching: re-check whenever the app is materially updated and before game-week releases.
- Transactions/injuries/depth chart: live ingestion is preferred; static fallback is only a clearly dated snapshot.
- Historical franchise milestones: re-check when adding new history content; otherwise stable.
- Branding: current official team brand page wins over old assets or third-party color sites.
- Historical image labels: re-audit whenever a new image is introduced or an existing archive file is replaced.

## Conflict policy

- Current official team source overrides Wikipedia for current personnel and current branding.
- NFL schedule overrides stale secondary schedules.
- Pro Football Hall of Fame is preferred for formal franchise-grant and championship facts.
- SportsLogos chronology is used to cross-check visual year ranges, but it does not override a current official Titans brand announcement.
- If two authoritative sources describe different milestones (for example “founded” vs. “first season”), display both precise milestones.
- If an image cannot be matched confidently to an exact variant, downgrade the label to representative rather than guessing.

## Core audited references

- https://www.tennesseetitans.com/
- https://www.tennesseetitans.com/brand/
- https://www.tennesseetitans.com/history/
- https://www.tennesseetitans.com/history/historical-highlights
- https://www.tennesseetitans.com/history/logo-history
- https://www.tennesseetitans.com/schedule/
- https://www.tennesseetitans.com/team/players-roster/
- https://www.nfl.com/schedules/2026/by-team/tennessee-titans
- https://www.profootballhof.com/teams/tennessee-titans/team-facts
- https://www.sportslogos.net/logos/list_by_team/160/Tennessee-Titans-Logos/
- https://www.pro-football-reference.com/teams/oti/
- https://en.wikipedia.org/wiki/Tennessee_Titans

## Audit notes from 2026-08-19

Corrections included:

- Added the Week 9 bye to fallback schedule data.
- Removed an invented Week 18 kickoff date/time; Week 18 at Houston remains TBD.
- Filled verified TV networks for late-season games.
- Reframed the 17-player fallback list as a verified sample, not a full roster.
- Corrected Peter Skoronski’s fallback position to G.
- Replaced speculative fallback-feed entries with sourced official-team items.
- Rebuilt Legacy wording around the franchise grant in 1959, first season in 1960, Tennessee Oilers transition, 1999 Titans launch, 2018 uniform change and 2026 Shield identity.
- Corrected an earlier chronology shortcut: 2018 is now described as a uniform/helmet/wordmark redesign, **not** as a new primary-logo era; the fireball-T remained the primary mark through 2025.
- Audited the legacy image directory and found multiple differently named `assets/legacy/*` files resolving to the same repository blob. Those aliases are quarantined and no longer drive the polished visual archive.
- Removed unsupported assignments such as labeling the duplicate `legacy-sword.webp` alias as the Titans sword alternate. The sword mark itself is real and is now acknowledged separately as a documented identity that is not pictured until a verified distinct asset is added. “Vintage roundel” and other unsupported labels were removed from the active catalog.
- Added comprehensive alt text, descriptions, verification classes, provenance explanations and per-image source links to the Legacy archive.
- Corrected current team-color wording: Titans blue, red, white and navy blue. Neutral silver/gray remains an interface accent only.