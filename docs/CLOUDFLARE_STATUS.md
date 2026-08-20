# Cloudflare deployment status

- Status: **deployed + production regression failure**
- Source commit: `536caf069f56bb6c6d7498d543fd744fa7feb8b2`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: failure
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-20T16:52:30Z

## Production regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "error": "Deployed commit d1fb85fbd293150120a781682aaa88a20d28d38e does not match expected 536caf069f56bb6c6d7498d543fd744fa7feb8b2",
  "testedAt": "2026-08-20T16:52:30.283Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
