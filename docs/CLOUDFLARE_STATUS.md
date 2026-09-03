# Cloudflare deployment status

- Status: **deployed + canonical front door failure**
- Source commit: `19816464d2619589131a1802dd207ea6ada116c0`
- Quality gate: success
- Cloudflare credentials available: true
- Source still current main: true
- Main SHA observed before deploy: `19816464d2619589131a1802dd207ea6ada116c0`
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
- Recorded: 2026-09-03T14:36:36Z

## Canonical front door regression

```json
{
  "ok": false,
  "canonical": "https://titans.alecjprice.com",
  "origin": "https://titans-command-center.alecjordanprice.workers.dev",
  "error": "CloudFront and Worker revisions did not converge after 6 attempts: custom=19816464d2619589131a1802dd207ea6ada116c0, origin=4b08c3d89a523a7ab92f3ff02c5a3d097012625a",
  "testedAt": "2026-09-03T14:36:35.738Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
