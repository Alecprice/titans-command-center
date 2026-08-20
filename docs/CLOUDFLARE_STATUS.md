# Cloudflare deployment status

- Status: **deployed + production regression failure**
- Source commit: `1f77bdfaf1e0b240c952d5798bf46b96a8a98f76`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: failure
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-20T16:55:27Z

## Production regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "error": "Deployed commit 471d097f88467ccee49cc5d7840e8aa1d409fc43 does not match expected 1f77bdfaf1e0b240c952d5798bf46b96a8a98f76",
  "testedAt": "2026-08-20T16:55:27.964Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
