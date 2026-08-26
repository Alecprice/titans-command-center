# Cloudflare deployment status

- Status: **deployed + production regression failure**
- Source commit: `bdadaeeb2a7ac4d19426ccfdb1d10090b2d82ced`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: failure
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
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-26T19:55:57Z

## Production regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "error": "Expected deploy bdadaeeb2a7ac4d19426ccfdb1d10090b2d82ced did not propagate; last observed commit 47e202cf43438ea6b91eeb54aaf53a16d1853855",
  "testedAt": "2026-08-26T19:55:57.441Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
