# Cloudflare deployment status

- Status: **deployed + production regression failure**
- Source commit: `72df71a8fc246ff8937dd493295d92426434a10d`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: failure
- Browser navigation regression: skipped
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-20T18:01:00Z

## Production regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "error": "Transactions API returned 26 invalid date value(s)",
  "testedAt": "2026-08-20T18:01:00.230Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
