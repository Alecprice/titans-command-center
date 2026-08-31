# AWS custom domain: Titans Command Center

Canonical public hostname:

`https://titans.alecjprice.com`

Existing application origin:

`https://titans-command-center.alecjordanprice.workers.dev`

## Cost policy for this project

The preferred public front door is the **CloudFront Free flat-rate plan ($0/month)**. The application itself remains on Cloudflare Workers + D1; CloudFront is only the HTTPS/DNS front door for the clean subdomain.

Important safety rules:

- If the AWS console says the account is ineligible for the Free flat-rate plan, **stop**. Do not fall back to pay-as-you-go automatically.
- Do not choose Pro, Business, Premium, or pay-as-you-go for the normal production path.
- Do not enable Lambda@Edge, paid CAPTCHA API usage, Route 53 DNS query logging, enhanced CloudFront metrics, or other separately billed extras.
- Do not attach the entire `alecjprice.com` Route 53 hosted zone to the plan during the initial cutover.
- The existing Cloudflare Worker and D1 database remain the application origin and production data authority. AWS does not receive D1 credentials.
- Neon Auth remains a separate, isolated account-authentication dependency behind the Worker's same-origin account proxy. It is not the application data plane and is not part of the AWS front door.

## Architecture

Primary application/data path:

`titans.alecjprice.com -> Route 53 -> CloudFront Free flat-rate + ACM -> Cloudflare Worker -> D1`

Isolated account-auth path:

`Browser -> CloudFront -> Cloudflare Worker account proxy -> Neon Auth`

This deliberately does **not** move `alecjprice.com` DNS to Cloudflare. CloudFront provides the clean hostname while the existing Route 53 zone stays authoritative.

CloudFront should forward viewer values except the viewer `Host` header. The Worker must receive `titans-command-center.alecjordanprice.workers.dev` as `Host` so origin TLS validation stays correct.

The AWS layer is only a public HTTPS/DNS front door. D1 stays bound directly to the Worker, scheduled materialization stays in Cloudflare/GitHub automation, and account authentication continues through the isolated Neon Auth proxy. No database connection string or D1 credential belongs in CloudFront, Route 53, ACM, or the AWS deployment helper.

The Worker staging hostname returns `X-Robots-Tag: noindex, nofollow`. The public `titans.alecjprice.com` hostname must remove that staging-only response header while preserving the application's other security headers.

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
3. Any existing DNS records already using `titans.alecjprice.com`.
4. Existing CloudFront distributions.
5. Any existing ACM certificate for `titans.alecjprice.com` in `us-east-1`.
6. Whether the old pay-as-you-go fallback CloudFormation stack already exists.

It does not create, update, delete, subscribe, or associate any AWS resource.

## Step 2 — create the distribution in the AWS console

Use the current CloudFront console flow rather than the metered CloudFormation fallback:

1. Open **CloudFront -> Distributions -> Create distribution**.
2. Choose **Single website or app**.
3. For the public domain, use `titans.alecjprice.com`.
4. For the origin, enter `titans-command-center.alecjordanprice.workers.dev` as a custom HTTPS origin.
5. Ensure the origin request behavior does **not forward the viewer Host header**. The equivalent AWS managed origin request policy is **AllViewerExceptHostHeader**.
6. Start with **Caching disabled** for correctness. Optimize static caching only after the custom-domain regression is green.
7. Redirect HTTP viewers to HTTPS.
8. Use the ACM certificate generated/selected for `titans.alecjprice.com`. CloudFront certificates must be available in `us-east-1`.
9. On the pricing-plan step, select **Free — $0/month** only.
10. If the Free plan is not selectable or AWS says the account is ineligible, stop before creating the distribution.
11. Do **not** attach the full Route 53 hosted zone to the plan during this first cutover.
12. Leave separately billed optional features off.
13. Confirm the selected pricing plan still says **Free / $0 per month** before choosing Create distribution.

## Step 3 — Route 53

For `titans.alecjprice.com`, use Route 53 Alias records that point to the CloudFront distribution:

- `A` Alias -> CloudFront distribution
- `AAAA` Alias -> CloudFront distribution

If the CloudFront console creates these records automatically during domain setup, do not create duplicates manually.

## Step 4 — validate before treating it as canonical

After CloudFront finishes deploying and DNS resolves:

```bash
curl -I https://titans.alecjprice.com/
curl -fsS https://titans.alecjprice.com/api/health
PRODUCTION_URL=https://titans.alecjprice.com node scripts/production-regression.mjs
```

Expected results:

- HTTPS certificate is valid for `titans.alecjprice.com`.
- HTTP redirects to HTTPS.
- Root page returns 200.
- `/api/health` reports Cloudflare D1 as the primary storage provider and reports bootstrap freshness truthfully.
- Account/guest behavior remains usable; an optional Neon Auth outage must not turn public fan routes into an application outage.
- `X-Robots-Tag: noindex` is not present on the public custom hostname.
- Existing CSP/security headers remain present.
- Roster, Transactions, Stats Lab, Advanced Analytics, Market Pulse, account flows, and player-headshot paths continue to work.

After that, run the normal desktop/mobile browser regressions against `titans.alecjprice.com` before treating it as the canonical production URL.

## Transition compatibility

The Worker may temporarily continue trusting the prior `titans-command-center.alecjprice.com` account origin during cutover so existing sessions or bookmarks do not fail abruptly. New DNS, certificates, docs, and canonical links should use `titans.alecjprice.com`. Retire the old custom hostname only after the new hostname is production-proven.

## Pay-as-you-go fallback is deliberately blocked

The files below exist only as an emergency fallback:

- `infra/aws/titans-command-center-domain.yaml`
- `scripts/deploy-aws-custom-domain.sh`

Both require an explicit `I_UNDERSTAND_CHARGES` acknowledgement before they can create metered CloudFront resources. A normal invocation stops without creating anything.

Do not bypass this interlock for the planned production setup.

## Rollback

The existing `workers.dev` hostname remains untouched and usable as the origin/fallback throughout the custom-domain setup.

If a Free-plan CloudFront distribution is created and later needs to be removed, cancel its Free pricing plan first, then disable/delete the distribution and remove only the `titans.alecjprice.com` A/AAAA aliases if they are not removed automatically.

Do not delete the `alecjprice.com` hosted zone, Cloudflare Worker, D1 database, Neon Auth project, or GitHub repository as part of an AWS front-door rollback.
