# Cloudflare deployment status

- Status: **deployed + canonical front door failure**
- Source commit: `610838819167cace6fb1e8f4e7bd5a2f7549ec7d`
- Quality gate: success
- Cloudflare credentials available: true
- Source still current main: true
- Main SHA observed before deploy: `610838819167cace6fb1e8f4e7bd5a2f7549ec7d`
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
- Recorded: 2026-09-28T18:44:56Z

## Canonical front door regression

```json
{
  "ok": false,
  "canonical": "https://titans.alecjprice.com",
  "origin": "https://titans-command-center.alecjordanprice.workers.dev",
  "expectedCommit": "610838819167cace6fb1e8f4e7bd5a2f7549ec7d",
  "error": "Canonical hostname did not reach expected release 610838819167cace6fb1e8f4e7bd5a2f7549ec7d after 6 attempts: observed=8497286f84198f458ae82d928a6db4551cede926",
  "testedAt": "2026-09-28T18:44:56.063Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
