# Cloudflare D1 migration

## Goal

Move Titans Command Center persistence away from Neon so frequent refreshes do not consume an external Postgres data-transfer quota. Cloudflare D1 is the primary target because the production Worker already runs on Cloudflare and D1 has no data-transfer/egress charge for data read from D1.

## Rollout plan

### Phase 1 — D1 foundation and shared snapshots

- Add the `TITANS_DB` D1 storage adapter.
- Move signed-in preference reads/writes to D1 whenever the binding exists.
- Add durable `api_snapshots` storage.
- Serve `/api/data` from the shared D1 snapshot before attempting another Neon bootstrap read.
- Seed D1 from a successful Neon bootstrap when Neon is available.
- If Neon is unavailable, serve the last D1 snapshot; if no snapshot exists yet, use the audited bundled fallback and seed that into D1.
- Refresh the ESPN scoreboard centrally every three minutes into D1 instead of having every browser act as an independent poller.
- Keep the existing daily source-audit job for slower-changing sources.
- Keep Neon preference storage as a temporary fallback until D1 is bound.
- Keep Neon Auth temporarily so authentication and persistence are not replaced in one release.

### Phase 2 — remaining read-path cutover

- Materialize fan intelligence, player and analytics responses into D1.
- Move normalized roster, transaction, source and historical data into D1-native tables where row-level querying is more useful than a shared snapshot.
- Continue using Cloudflare Cache in front of D1.
- Remove large/unused Neon reads from the request path.
- Reduce daily Neon jobs as each source receives a D1-native ingestion path.

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
6. Allow the normal production workflow to deploy that tested binding commit.

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

The application therefore uses **central refresh + cached snapshots**, not per-user 1-minute database polling. The intended pattern is:

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

The first near-live job updates the public ESPN scoreboard snapshot every three minutes. That is about 480 D1 upserts per day, leaving substantial free-tier headroom. Slow-moving roster, transaction, source-audit and historical data remain on slower cadences until their D1-native ingestion paths are added.

## Rollback

Phase 1 remains reversible. If `TITANS_DB` is not bound, account preferences automatically continue using the existing Neon storage path, `/api/data` continues through the existing Neon/audited fallback logic, and the three-minute near-live job exits without polling. Removing the D1 binding therefore returns the application to the pre-D1 persistence behavior without deleting the D1 database.
