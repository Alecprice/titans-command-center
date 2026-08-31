# AWS custom domain: Titans Command Center

Target public hostname:

`https://titans-command-center.alecjprice.com`

Existing application origin:

`https://titans-command-center.alecjordanprice.workers.dev`

## Cost policy for this project

The preferred production path is the **CloudFront Free flat-rate plan ($0/month)**. Do not use the repository's pay-as-you-go CloudFormation fallback for normal deployment.

AWS's flat-rate Free plan currently includes 1 million requests/month and 100 GB transfer/month with no overage charges. If usage substantially exceeds the allowance for a sustained period, AWS may adjust delivery performance instead of charging overages.

Important safety rules:

- If the AWS console says the account is ineligible for the Free flat-rate plan, **stop**. Do not fall back to pay-as-you-go automatically.
- Do not choose Pro, Business, Premium, or pay-as-you-go.
- Do not enable Lambda@Edge, paid CAPTCHA API usage, Route 53 DNS query logging, enhanced CloudFront metrics, or other separately billed extras.
- Do not attach the entire `alecjprice.com` Route 53 hosted zone to the plan during the initial cutover. The existing zone can remain exactly as it is. Route 53 A/AAAA Alias queries to CloudFront are not billed as DNS queries; the existing hosted-zone fee remains unchanged.
- The existing Cloudflare Worker and D1 database remain the application origin and production data authority. The AWS front door does not replace either one and does not receive D1 credentials.
- Neon Auth remains a separate, isolated account-authentication dependency behind the Worker's same-origin account proxy. It is not the application data plane and is not part of the AWS front door.

## Architecture

Primary application/data path:

`Route 53 -> CloudFront Free flat-rate + ACM -> Cloudflare Worker -> D1`

Isolated account-auth path:

`Browser -> CloudFront -> Cloudflare Worker account proxy -> Neon Auth`

This deliberately does **not** move `alecjprice.com` DNS to Cloudflare. Cloudflare Workers native Custom Domains require an active Cloudflare DNS zone, so CloudFront is used as the AWS-controlled HTTPS front door instead.

CloudFront should forward viewer values except the viewer `Host` header. The Worker must receive its own `titans-command-center.alecjordanprice.workers.dev` hostname as `Host` so TLS validation against the origin remains correct.

The AWS layer is only a public HTTPS/DNS front door. D1 stays bound directly to the Worker, scheduled materialization stays in Cloudflare/GitHub automation, and account authentication continues through the isolated Neon Auth proxy. No database connection string or D1 credential belongs in CloudFront, Route 53, ACM, or the AWS deployment helper.

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
6. Start with **Caching disabled** for correctness. We can optimize static caching later after the custom-domain regression is green.
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

Alias A/AAAA queries mapped to CloudFront do not incur Route 53 DNS-query charges.

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
- `/api/health` reports Cloudflare D1 as the primary storage provider and reports the bootstrap snapshot truthfully as healthy or degraded.
- Account/guest behavior remains usable independently of the D1 health result; an optional Neon Auth outage must not turn public fan routes into an application outage.
- `X-Robots-Tag: noindex` is not present on the public custom hostname.
- Existing CSP/security headers remain present.
- Roster, Transactions, Stats Lab, Advanced Analytics, Market Pulse and player-headshot paths continue to work.

After that, run the normal desktop/mobile browser regressions against the custom hostname before treating it as the canonical production URL.

## Pay-as-you-go fallback is deliberately blocked

The files below exist only as an emergency fallback:

- `infra/aws/titans-command-center-domain.yaml`
- `scripts/deploy-aws-custom-domain.sh`

Both now require an explicit `I_UNDERSTAND_CHARGES` acknowledgement before they can create metered CloudFront resources. A normal invocation stops without creating anything.

Do not bypass this interlock for the planned production setup.

## Rollback

The existing `workers.dev` hostname remains untouched and usable as the origin/fallback throughout the custom-domain setup.

If a Free-plan CloudFront distribution is created and later needs to be removed, cancel its Free pricing plan first (Free plan cancellation is immediate), then disable/delete the distribution and remove only the target A/AAAA aliases if they are not removed automatically.

Do not delete the `alecjprice.com` hosted zone, Cloudflare Worker, D1 database, Neon Auth project, or GitHub repository as part of an AWS front-door rollback.
