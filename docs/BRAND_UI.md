# Titans Command Center — Brand/UI direction

## Current identity (2026)

Primary source of truth: Tennessee Titans official brand pages.

- Primary logo: **The Shield**.
- Primary visual color: **Titans Blue**.
- Official current team colors: **Titans blue, red, white, navy blue**.
- The primary helmet mark is The Shield and the Nashville-inspired **6-String Stripe** runs on the helmet and uniform.
- Official brand presentation makes Titans Blue the visual lead, with white, red and navy supporting it.
- The main UI may use neutral silver/gray for borders, shadows, data visualization and dimensional contrast. **That neutral UI accent is not presented as an additional official team color.**
- The site does not redistribute proprietary/custom team font files.

### Practical web palette

These values are implementation colors chosen to visually match the current identity; they are not presented as an official published HEX/Pantone specification unless an official source explicitly provides one.

- Titans Blue UI match: `#4B92DB`
- Navy UI match: `#0C2340`
- Red UI match: `#C8102E`
- White: `#FFFFFF`
- Neutral UI silver: `#8A8D8F` — interface accent only

## Legacy / throwback treatment

The Legacy area intentionally changes tone so it feels like a franchise archive rather than another dashboard page.

- Oilers / powder-blue UI match: `#4A95CE`
- Throwback-red UI match: `#D5272C`
- Old-navy UI match: `#002144`
- Archive cream: `#F7F3EA`

### Logo chronology is not uniform chronology

The UI must not use uniform redesign years as if they automatically represent new primary-logo years.

1. **Aug. 14, 1959 / 1960** — AFL franchise granted in 1959; Houston Oilers begin play in 1960.
2. **1960–1996** — Houston Oilers. The oil derrick is the long-running motif, but its exact rendering and helmet presentation changed multiple times.
3. **1997–1998** — Tennessee Oilers transition seasons. The Oilers identity remained; Tennessee-specific visual elements were also introduced.
4. **1999–2001** — first Titans/fireball primary-logo period.
5. **2002–2017** — revised fireball primary mark with the pre-2018 Titans wordmark/uniform system.
6. **2018–2025** — new navy-helmet, uniform and wordmark system **while the fireball-T primary logo remained in use through 2025**.
7. **2026–present** — The Shield becomes the primary logo; the 6-String Stripe is part of the new uniform/helmet system.

The Titans also have a historically documented **sword secondary/alternate mark**. That is separate from the sword-inspired helmet/uniform treatment introduced in 2018. The project must not label an image as the sword alternate unless the file itself is verified to depict that mark; the old `legacy-sword.webp` alias does not pass that test.

The site does not describe every graphic supplied for the project as an official historical logo. Decorative art, composites and era references must be explicitly labeled as such before they are displayed. The canonical labels live in [`src/visual-audit.mjs`](../src/visual-audit.mjs); see [`docs/VISUAL_AUDIT.md`](VISUAL_AUDIT.md).

## Content/source policy

For current branding, roster, front-office, coaching, schedule and transactions, **TennesseeTitans.com is the first source of truth**. NFL.com and official league records are used for cross-checking. Pro Football Hall of Fame records are preferred for stable franchise facts such as the franchise grant date and championships. SportsLogos.net is the specialist visual chronology cross-check. Wikipedia and Pro Football Reference are useful secondary historical cross-checks but should not override a current official team source.

## UX rules

- Do not use one generic rounded card style everywhere.
- Current-brand pages use sharp/chamfered athletic geometry, blue fields, white information surfaces and red impact accents.
- Legacy sections use cream/powder-blue archival surfaces and accurately labeled throwback imagery.
- Every archive card should expose its verification class and a “Why this label” provenance explanation.
- Mobile bottom navigation prioritizes Home, Game Day, Roster, Stats, Intel and Legacy.
- Team marks are used for an unofficial fan experience and are not presented as ownership or official affiliation.
