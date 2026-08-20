# Cloudflare deployment status

- Status: **deployed + production regression failure**
- Source commit: `33ce7c8bab3154945eeaa731dc490398273f7dff`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: failure
- Browser navigation regression: skipped
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-20T18:06:26Z

## Production regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "error": "Transactions API returned 26 invalid date value(s); samples: [\"Wed Aug 19T00:00:00.000Z\",\"Mon Aug 17T00:00:00.000Z\",\"Sun Aug 16T00:00:00.000Z\"]",
  "testedAt": "2026-08-20T18:06:26.476Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
