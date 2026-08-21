# Cloudflare deployment status

- Status: **deployed + production regression failure**
- Source commit: `3fca1356e905d79b668c136dbea674d5611853c6`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: failure
- Browser navigation regression: skipped
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-21T16:14:16Z

## Production regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "error": "Unexpected API application version",
  "testedAt": "2026-08-21T16:14:16.068Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
