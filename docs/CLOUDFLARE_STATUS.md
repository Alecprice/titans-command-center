# Cloudflare deployment status

- Status: **deployed + production regression failure**
- Source commit: `eb13b79b290d5d66906430c089c388e3e1e28f0a`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: failure
- Browser navigation regression: skipped
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-20T18:04:08Z

## Production regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "error": "Transactions API returned 26 invalid date value(s)",
  "testedAt": "2026-08-20T18:04:08.739Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
