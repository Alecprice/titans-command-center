# Cloudflare D1 migration

## Goal

Move Titans Command Center persistence away from Neon so frequent refreshes do not consume an external Postgres data-transfer quota. Cloudflare D1 is the primary target because the production Worker already runs on Cloudflare and D1 has no data-transfer/egress charge for data read from D1.

## Rollout plan

### Phase 1 — D1 foundation (this branch)

- Add `TITANS_DB` D1 storage adapter.
- Move signed-in preference reads/writes to D1 whenever the binding exists.
- Add durable `api_snapshots` storage for the upcoming bootstrap/fan-intel cutover.
- Keep Neon preference storage as a temporary fallback until D1 is bound.
- Keep Neon Auth temporarily so authentication and persistence are not replaced in one release.

### Phase 2 — read path cutover

- Materialize `/api/data`, fan intelligence, player and analytics responses into D1.
- Refresh those snapshots centrally from scheduled Worker jobs instead of allowing every browser/device to trigger database work.
- Use Cloudflare Cache in front of D1.
- Remove large/unused Neon reads from the request path.

### Phase 3 — authentication cutover

- Replace Neon Auth with Better Auth backed by D1.
- Preserve the existing frontend account endpoint contract (`get-session`, `sign-in/email`, `sign-up/email`, `sign-out`).
- Migrate or intentionally reset existing development accounts after confirming the desired account migration policy.
- Remove `DATABASE_URL` and `@neondatabase/serverless` only after all production routes are D1-backed.

## One-time D1 bootstrap

The repository includes a manual GitHub Actions workflow named **Titans D1 Bootstrap**. It uses the existing `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets to:

1. Find or create a D1 database named `titans-command-center` in eastern North America.
2. Configure the Worker binding as `TITANS_DB`.
3. Apply `db/d1/migrations` remotely.
4. Run the complete repository quality gate.
5. Commit only the generated `wrangler.jsonc` binding back to the branch that ran the workflow.

The Cloudflare token must include D1 read/write permission in addition to the Worker deployment permissions already used by the production workflow.

## Local alternative

If the workflow token cannot create D1, run:

```bash
npx wrangler@4 d1 create titans-command-center --location enam
npm run d1:configure
npm run check
```

`npm run d1:configure` discovers the database UUID from Cloudflare, updates `wrangler.jsonc`, and applies the D1 migrations. It never prints Cloudflare tokens or database credentials.

## Free-tier budget

D1 Free currently allows 5 million rows read per day, 100,000 rows written per day, up to 500 MB per individual database, and 5 GB total storage across the account. D1 data reads do not have separate egress charges.

The application should therefore use **central refresh + cached snapshots**, not per-user 1-minute database polling. The intended pattern is:

```text
external sources
      ↓
Cloudflare scheduled Worker
      ↓
normalize / compare / write changes
      ↓
Cloudflare D1
      ↓
Cloudflare Cache
      ↓
web + mobile clients
```

During game windows, selected upstream checks can run every 1–3 minutes. Slow-moving roster, transaction, source-audit and historical data should run less frequently.

## Rollback

Phase 1 is reversible. If `TITANS_DB` is not bound, account preferences automatically continue using the existing Neon storage path. No production read path is forced onto D1 until the later snapshot cutover is explicitly merged.
