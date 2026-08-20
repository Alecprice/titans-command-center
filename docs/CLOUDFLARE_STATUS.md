# Cloudflare deployment status

- Status: **deployed + production regression failure**
- Source commit: `1cfa4502ed8819ea80c56406362753643799a4fa`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: failure
- Browser navigation regression: skipped
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-20T20:38:35Z

## Production regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "error": "Stats Lab is not Neon-backed: Tennessee Titans official roster · latest audited snapshot",
  "testedAt": "2026-08-20T20:38:35.264Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
