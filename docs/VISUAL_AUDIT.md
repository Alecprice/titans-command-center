# Titans Command Center — Visual Asset Audit

Last full visual-label audit: **2026-08-19**

This audit exists because a filename is not evidence. A graphic named `legacy-sword.webp` is not automatically a sword logo, and a single Oilers derrick rendering is not automatically the exact logo for every season from 1960 through 1998.

## Verification classes

- **Verified/current:** the identity and label can be matched to a current or exact source-backed mark.
- **Representative:** the graphic is useful for an era or motif, but the exact year/version of the file has not been established. It must not receive an exact logo-year claim.
- **Reference composite:** the project intentionally combines or compares marks. It is not an official standalone primary, alternate, anniversary, or helmet logo.

The live catalog is defined in [`src/visual-audit.mjs`](../src/visual-audit.mjs). UI captions, alt text, provenance text and source links should come from that catalog rather than from image filenames.

## Source hierarchy for image labels

1. Tennessee Titans current brand materials for the current identity.
2. Tennessee Titans logo/helmet history for franchise visual changes.
3. Pro Football Hall of Fame for stable franchise-era milestones.
4. SportsLogos.net as the specialist logo/wordmark chronology cross-check.
5. Wikipedia and Pro Football Reference as secondary historical cross-checks.

Wikipedia is deliberately a cross-check rather than the authority for current branding. It is especially useful for spotting historical nuances that deserve verification, such as the Tennessee Oilers alternate mark that combined Tennessee-flag elements with the derrick.

## Duplicate legacy-alias finding

The files under `assets/legacy/` were previously named as if they depicted several different things — including a derrick, fireball, sword alternate, vintage roundel and multiple wordmarks. During the Aug. 19 audit those aliases were found to share the same Git blob and byte size. They therefore cannot support those separate descriptions.

**Policy:** `assets/legacy/` is quarantined compatibility material. The polished UI does not use those aliases. Active historical visuals come from `assets/archive/` and `assets/brand/`, with labels supplied by `src/visual-audit.mjs`.

## Active audited assets

| File | Display classification | Label rule |
| --- | --- | --- |
| `assets/archive/current-shield-primary.webp` | Verified current identity | May be called **The Shield**, the current primary Titans logo. |
| `assets/brand/current-lockup.webp` | Current-brand reference | May be described as a current Shield + wordmark lockup; do not imply a licensing package. |
| `assets/archive/logo-transition-shield-fireball.webp` | Reference composite | Comparison graphic only; never call it an official standalone logo. |
| `assets/archive/oilers-derrick.webp` | Representative Oilers reference | Oil-derrick motif only unless an exact historical variant is independently established. |
| `assets/archive/fireball-wordmark.webp` | Representative pre-2018 wordmark-era reference | Describes the combined elements; not “the official 1999–2017 primary logo.” |
| `assets/archive/fireball-on-navy.webp` | Representative pre-2026 fireball presentation | Fireball primary continued through 2025; navy helmet began with the 2018 uniform redesign. This file is not verified as the separate Titans sword alternate. |

## Chronology corrections captured by this audit

### Oilers

The oil derrick was a long-running identity, but the team’s official helmet history documents repeated changes to shell color, stripe treatment, facemask and the derrick itself. SportsLogos also splits the primary-logo chronology into multiple Oilers periods. One file therefore cannot be labeled “the 1960–1996 logo” without additional evidence.

### Tennessee Oilers, 1997–1998

The Oilers name remained during the first two Tennessee seasons. The official helmet history notes a Tennessee logo added to the back of the helmet in 1997, while Wikipedia documents a separate Tennessee-themed alternate mark. A generic derrick image is not that exact alternate and is labeled representative.

### Titans, 1999–2017

The Titans name and fireball-T arrived for 1999. SportsLogos distinguishes 1999–2001 and 2002–2025 versions of the primary logo, while the pre-2018 wordmark is cataloged separately. The archive therefore avoids pretending a combined fireball/wordmark graphic is one unchanged exact primary mark for 19 seasons.

### 2018–2025

This is the most important chronology correction. **2018 changed the uniforms, navy helmet and wordmark system; it did not replace the primary fireball-T logo.** The fireball remained the primary mark through 2025. The 2018 system used sword-inspired details that referenced the team’s sword identity. Separately, the Titans do have a documented sword secondary/alternate mark; however, the repo’s old `legacy-sword.webp` alias is not a verified image of it.

### 2026–present

The Titans unveiled the current identity on March 12, 2026. The official team calls the primary mark **The Shield** and pairs it with the Nashville-inspired 6-String Stripe.

## Documented identities intentionally not pictured

- **Titans sword secondary/alternate:** real and documented by both the Titans and SportsLogos, but no distinct provenance-checked project asset is currently available. The old `legacy-sword.webp` alias is a duplicate binary and remains quarantined.
- **Tennessee Oilers Tennessee-flag / derrick alternate:** documented in secondary historical sources and consistent with the official team’s 1997 Tennessee-branding note, but the current Oilers project image is not verified as that exact alternate.

This is intentional: the archive should admit a missing picture rather than attach the wrong picture to a correct historical label.

## Core references

- https://www.tennesseetitans.com/brand/
- https://www.tennesseetitans.com/history/logo-history
- https://www.tennesseetitans.com/news/titans-unveil-new-uniforms-logo-to-represent-the-next-chapter-of-franchise-history
- https://www.profootballhof.com/teams/tennessee-titans/team-facts
- https://www.sportslogos.net/logos/list_by_team/160/Tennessee-Titans-Logos/
- https://www.sportslogos.net/logos/view/16038902002/Tennessee-Titans-Logo/2002/Alternate-Logo
- https://www.tennesseetitans.com/news/titans-unveil-fans-choice-of-15th-season-logo-9948081
- https://www.tennesseetitans.com/news/the-story-behind-titans-new-uniforms-and-helmet-20512660
- https://en.wikipedia.org/wiki/Tennessee_Titans
- https://www.pro-football-reference.com/teams/oti/
