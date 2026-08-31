# AWS custom domain: Titans Command Center

Target public hostname:

`https://titans-command-center.alecjprice.com`

Existing application origin:

`https://titans-command-center.alecjordanprice.workers.dev`

## Purpose and production ownership

AWS is an **optional HTTPS/DNS front door only** for the custom hostname. It does not own application compute, application data, authentication data, scheduled ingestion, or deployment authority.

Current production ownership remains:

- GitHub `main` -> source of truth
- GitHub Actions -> quality and release gates
- Cloudflare Worker + Static Assets -> application and `/api/*`
- Cloudflare D1 `TITANS_DB` -> production persistence and materialized API snapshots
- Neon Auth -> temporary, isolated authentication HTTP service only

The retired Neon/Postgres warehouse is **not** a rollback dependency and must not be reintroduced for the AWS front door.

## Cost policy for this project

The preferred AWS path is the **CloudFront Free flat-rate plan ($0/month)**. Do not use the repository's pay-as-you-go CloudFormation fallback for normal deployment.

AWS currently documents the Free flat-rate plan as 1 million requests/month and 100 GB transfer/month with no overage charges. Usage allowances are not hard limits; sustained usage beyond the allowance can affect delivery performance. Re-check the AWS documentation before any future pricing-plan change:

- [AWS Flat-Rate Plans — available plans](https://docs.aws.amazon.com/PricingPlanManager/latest/UserGuide/plans.html)
- [CloudFront flat-rate pricing plans](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/flat-rate-pricing-plan.html)

Important safety rules:

- If the AWS console says the account is ineligible for the Free flat-rate plan, **stop**. Do not fall back to pay-as-you-go automatically.
- Do not choose Pro, Business, Premium, or pay-as-you-go unless a future change is explicitly approved with its cost impact understood.
- Do not enable Lambda@Edge, paid CAPTCHA API usage, Route 53 DNS query logging, enhanced CloudFront metrics, or other separately billed extras as part of this setup.
- Do not attach the entire `alecjprice.com` Route 53 hosted zone to the plan during the initial cutover. The existing zone can remain exactly as it is.
- Use Route 53 A/AAAA Alias records to CloudFront. AWS documents that Route 53 does not charge for alias queries to CloudFront distributions: [Route 53 routing to CloudFront](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html).
- Do not add `DATABASE_URL`, Postgres credentials, D1 credentials, or auth-provider credentials to CloudFront. The front door only forwards HTTPS requests to the Worker origin.

## Architecture

```text
GitHub main
   |
GitHub Actions
   |
Cloudflare Worker + Static Assets ----> Cloudflare D1 (TITANS_DB)
   |
   +----> Neon Auth (temporary auth HTTP service only)
   ^
   |
CloudFront Free flat-rate + ACM
   ^
   |
Route 53: titans-command-center.alecjprice.com
```

This deliberately does **not** move `alecjprice.com` DNS to Cloudflare. CloudFront is used as the AWS-controlled HTTPS front door while the existing Route 53 zone remains authoritative for the domain.

CloudFront should forward viewer values except the viewer `Host` header. The Worker must receive its own `titans-command-center.alecjordanprice.workers.dev` hostname as `Host` so TLS validation against the origin remains correct.

The Worker staging hostname returns `X-Robots-Tag: noindex, nofollow`. The public custom hostname must remove that staging-only response header while preserving the application's other security headers.

## Step 1 — read-only preflight

Before creating anything, update the repository and run the read-only account inspection:

```bash
git pull
chmod +x scripts/aws-free-plan-preflight.sh
./scripts/aws-free-plan-preflight.sh
```

This script only performs AWS read operations. It shows:

1. The active AWS account identity.
2. The public Route 53 hosted zone for `alecjprice.com`.
3. Any existing DNS records already using `titans-command-center.alecjprice.com`.
4. Existing CloudFront distributions.
5. Any existing ACM certificate for the target hostname in `us-east-1`.
6. Whether the old pay-as-you-go fallback CloudFormation stack already exists.

It does not create, update, delete, subscribe, or associate any AWS resource.

## Step 2 — create the distribution in the AWS console

Use the current CloudFront console flow rather than the metered CloudFormation fallback:

1. Open **CloudFront -> Distributions -> Create distribution**.
2. Choose **Single website or app**.
3. For the domain, use `titans-command-center.alecjprice.com` when the console offers Route 53 domain setup.
4. For the origin, enter `titans-command-center.alecjordanprice.workers.dev` as a custom HTTPS origin.
5. Ensure the origin request behavior does **not forward the viewer Host header**. The equivalent AWS managed origin request policy is **AllViewerExceptHostHeader**.
6. Start with **Caching disabled** for correctness. Cloudflare remains responsible for application caching; avoid creating a second cache policy until it has its own regression coverage.
7. Redirect HTTP viewers to HTTPS.
8. Use the normal ACM certificate generated/selected by CloudFront for the hostname. CloudFront certificates must be available in `us-east-1`.
9. On the pricing-plan step, select **Free — $0/month** only.
10. If the Free plan is not selectable or AWS says the account is ineligible, stop before creating the distribution.
11. Do **not** attach the full Route 53 hosted zone to the plan during this first cutover.
12. Leave separately billed optional features off.
13. Review the final page and confirm the selected pricing plan still says **Free / $0 per month** before choosing Create distribution.

## Step 3 — Route 53

For the target hostname, use Route 53 Alias records that point to the CloudFront distribution:

- `A` Alias -> CloudFront distribution
- `AAAA` Alias -> CloudFront distribution

If the CloudFront console creates these records automatically during domain setup, do not create duplicates manually.

## Step 4 — validate before treating it as production

After CloudFront finishes deploying and DNS resolves:

```bash
curl -I https://titans-command-center.alecjprice.com/
curl -fsS https://titans-command-center.alecjprice.com/api/health
PRODUCTION_URL=https://titans-command-center.alecjprice.com node scripts/production-regression.mjs
```

Expected results:

- HTTPS certificate is valid for `titans-command-center.alecjprice.com`.
- HTTP redirects to HTTPS.
- Root page returns 200.
- `/api/health` reports `cloudflare-d1` as the primary database provider with truthful snapshot freshness.
- The app does not require or expose a Postgres `DATABASE_URL`.
- `X-Robots-Tag: noindex` is not present on the public custom hostname.
- Existing CSP/security headers remain present.
- Roster, Transactions, Stats Lab, Advanced Analytics, Market Pulse and player-headshot paths continue to work.
- Account/Guest behavior remains guest-safe if the isolated auth provider is unavailable.

After that, run the normal desktop/mobile browser regressions against the custom hostname before treating it as the canonical production URL.

## Pay-as-you-go fallback is deliberately blocked

The files below exist only as an emergency fallback:

- `infra/aws/titans-command-center-domain.yaml`
- `scripts/deploy-aws-custom-domain.sh`

Both require an explicit `I_UNDERSTAND_CHARGES` acknowledgement before they can create metered CloudFront resources. A normal invocation stops without creating anything.

Do not bypass this interlock for the planned production setup.

## Rollback

The existing `workers.dev` hostname remains untouched and usable as the origin/fallback throughout the custom-domain setup.

If a Free-plan CloudFront distribution is created and later needs to be removed, cancel its Free pricing plan first, then disable/delete the distribution and remove only the target A/AAAA aliases if they are not removed automatically. Re-check the current AWS cancellation behavior in the console/docs before making that change.

Do not delete the `alecjprice.com` hosted zone, Cloudflare Worker, Cloudflare D1 database, or GitHub repository as part of an AWS front-door rollback. Neon Auth is a separate temporary authentication dependency and is not the application data store.
