# Cloudflare deployment status

- Status: **deployed + canonical front door failure**
- Source commit: `5c0ea9ccad25471fb42a70cdac95b151c0d1ad86`
- Quality gate: success
- Cloudflare credentials available: true
- Source still current main: true
- Main SHA observed before deploy: `5c0ea9ccad25471fb42a70cdac95b151c0d1ad86`
- Neon warehouse deployment secret required: false (D1 primary)
- YouTube Data API configured: true
- Ticket providers staged in GitHub: SeatGeek=false, Ticketmaster=false, StubHub=false
- Fan Event secrets staged in GitHub: Eventbrite=false, Eventbrite org IDs=false, Skiddle=false
- Fan Event runtime readiness: see the production regression evidence below; direct Worker secrets may be configured even when GitHub staging is false
- Deploy outcome: success
- Canonical front door: failure
- Production regression: skipped
- Fan Events production regression: skipped
- Browser navigation regression: skipped
- Listen Watch browser regression: skipped
- Market Pulse browser regression: skipped
- Ticket Center browser regression: skipped
- Command Intelligence browser regression: skipped
- Player Intelligence / Game Day browser regression: skipped
- Ask Titans browser regression: skipped
- Change Intelligence browser regression: skipped
- Runtime / 365 Mode browser regression: skipped
- Data freshness browser regression: skipped
- Account / Guest browser regression: skipped
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Production URL: https://titans.alecjprice.com
- Rollback Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-09-09T15:19:13Z

## Canonical front door regression

```json
{
  "ok": false,
  "canonical": "https://titans.alecjprice.com",
  "origin": "https://titans-command-center.alecjordanprice.workers.dev",
  "expectedCommit": "5c0ea9ccad25471fb42a70cdac95b151c0d1ad86",
  "error": "Canonical hostname did not reach expected release 5c0ea9ccad25471fb42a70cdac95b151c0d1ad86 after 6 attempts: observed=8e954f137061b1250fe08c04dc428d3beebf4ef6",
  "testedAt": "2026-09-09T15:19:12.470Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
