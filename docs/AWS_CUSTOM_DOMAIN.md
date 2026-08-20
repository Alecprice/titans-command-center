# AWS custom domain: Titans Command Center

Target public hostname:

`https://titans-command-center.alecjprice.com`

Existing application origin:

`https://titans-command-center.alecjordanprice.workers.dev`

## Architecture

The public hostname stays in the existing AWS account:

`Route 53 -> CloudFront + ACM -> Cloudflare Worker -> Neon`

This deliberately does **not** move `alecjprice.com` DNS to Cloudflare. Cloudflare Workers native Custom Domains require an active Cloudflare DNS zone, so CloudFront is used as the AWS-controlled HTTPS front door instead.

CloudFront is initially configured with caching disabled for correctness. It forwards all viewer values except the viewer `Host` header. CloudFront substitutes the Worker origin hostname as `Host`, which keeps HTTPS validation against `*.workers.dev` correct.

The Worker staging hostname returns `X-Robots-Tag: noindex, nofollow`. The CloudFront response policy removes that staging-only header on the public AWS hostname while preserving the application's existing security headers.

## One-command deployment

From the repository root on a computer where the AWS CLI is authenticated to the AWS account that owns the `alecjprice.com` Route 53 hosted zone:

```bash
git pull
chmod +x scripts/deploy-aws-custom-domain.sh
./scripts/deploy-aws-custom-domain.sh
```

The script will:

1. Show the active AWS identity before making changes.
2. Locate the `alecjprice.com` Route 53 hosted-zone ID automatically.
3. Validate the CloudFormation template.
4. Create/maintain an ACM certificate for `titans-command-center.alecjprice.com` in `us-east-1`.
5. Create/maintain the CloudFront distribution.
6. Create Route 53 A and AAAA alias records.
7. Wait for the HTTPS hostname to answer.
8. Verify the custom hostname is not returning the `workers.dev` staging `noindex` header.
9. Run the repository production regression against the custom hostname when Node is available.

CloudFront and ACM provisioning can take several minutes. Do not interrupt the CloudFormation deployment while the certificate/distribution is being created.

## Required AWS permissions

The authenticated AWS principal needs permission to read the account identity and manage the resources in this stack, including:

- `sts:GetCallerIdentity`
- Route 53 hosted-zone lookup and record changes
- ACM certificate creation/description/tagging in `us-east-1`
- CloudFront distributions and response-headers policies
- CloudFormation stack create/update/read operations

No AWS access key, secret key, certificate private key, database URL, or Cloudflare token belongs in the repository or chat.

## Manual validation

After the stack completes:

```bash
curl -I https://titans-command-center.alecjprice.com/
curl -fsS https://titans-command-center.alecjprice.com/api/health
PRODUCTION_URL=https://titans-command-center.alecjprice.com node scripts/production-regression.mjs
```

Expected results:

- HTTPS certificate is valid for `titans-command-center.alecjprice.com`.
- HTTP redirects to HTTPS.
- Root page returns 200.
- `/api/health` returns a healthy application with Neon configured and healthy.
- `X-Robots-Tag: noindex` is **not** present on the custom hostname.
- Existing CSP/security headers remain present.
- Roster, Transactions, Stats Lab, Advanced Analytics, Market Pulse and player-headshot paths continue to work.

## Rollback

The existing `workers.dev` hostname remains untouched and usable as the origin/fallback.

To remove the AWS public hostname, delete the CloudFormation stack:

```bash
aws cloudformation delete-stack \
  --region us-east-1 \
  --stack-name titans-command-center-domain

aws cloudformation wait stack-delete-complete \
  --region us-east-1 \
  --stack-name titans-command-center-domain
```

This removes the CloudFront distribution, Route 53 aliases, response policy and certificate created by the stack. It does not delete the Cloudflare Worker, Neon database, GitHub repository or the `alecjprice.com` hosted zone.

## After cutover

Keep CloudFront caching disabled until the custom-domain browser/API regression is clean. Once verified, static JS/CSS/images can receive a separate cache behavior while `/api/*`, `/sw.js`, HTML navigation and build metadata remain uncached/revalidated.
