# Cloudflare deployment status

- Status: **deployed + canonical front door failure**
- Source commit: `d8f444767965b372cc21d3d669ee39fac0dad0dd`
- Quality gate: success
- Cloudflare credentials available: true
- Neon warehouse deployment secret required: false (D1 primary)
- YouTube Data API configured: true
- Ticket providers configured: SeatGeek=false, Ticketmaster=false, StubHub=false
- Deploy outcome: success
- Canonical front door: failure
- Production regression: skipped
- Browser navigation regression: skipped
- Listen Watch browser regression: skipped
- Market Pulse browser regression: skipped
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
- Recorded: 2026-09-01T12:12:19Z

## Canonical front door regression

```json
{
  "ok": false,
  "canonical": "https://titans.alecjprice.com",
  "origin": "https://titans-command-center.alecjordanprice.workers.dev",
  "error": "CloudFront is not serving the current Worker revision: custom=d8f444767965b372cc21d3d669ee39fac0dad0dd, origin=5ae955291dd9663eb6367cb085a9ebfd7445a763",
  "testedAt": "2026-09-01T12:12:18.680Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
