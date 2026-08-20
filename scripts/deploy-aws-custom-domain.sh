#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${DOMAIN:-titans-command-center.alecjprice.com}"
ZONE="${ZONE:-alecjprice.com}"
ORIGIN="${ORIGIN:-titans-command-center.alecjordanprice.workers.dev}"
STACK="${STACK:-titans-command-center-domain}"
REGION="us-east-1"
TEMPLATE="infra/aws/titans-command-center-domain.yaml"
PAYG_OVERRIDE="${ALLOW_PAY_AS_YOU_GO_CLOUDFRONT:-}"

command -v aws >/dev/null 2>&1 || { echo 'ERROR: AWS CLI is not installed.' >&2; exit 1; }
command -v curl >/dev/null 2>&1 || { echo 'ERROR: curl is required.' >&2; exit 1; }
[[ -f "$TEMPLATE" ]] || { echo "ERROR: run this from the repository root; missing $TEMPLATE" >&2; exit 1; }

# COST SAFETY: This CloudFormation template creates a standard pay-as-you-go
# CloudFront distribution. AWS has a separate $0/month CloudFront flat-rate
# Free plan with no overage charges, but subscription to that plan is managed
# separately from this template. Fail closed so a normal invocation cannot
# accidentally create a metered distribution.
if [[ "$PAYG_OVERRIDE" != "I_UNDERSTAND_CHARGES" ]]; then
  cat >&2 <<'EOF'
COST SAFETY STOP

This helper is intentionally blocked because the CloudFormation stack creates
PAY-AS-YOU-GO CloudFront. That pricing mode can incur charges if usage exceeds
AWS free-tier allowances.

For this project, use the CloudFront $0/month FLAT-RATE FREE PLAN instead and
verify the distribution is subscribed to that plan before sending production
traffic to it.

No AWS resources were created by this invocation.

Only if you intentionally accept pay-as-you-go billing may you override this
safety with:
  ALLOW_PAY_AS_YOU_GO_CLOUDFRONT=I_UNDERSTAND_CHARGES ./scripts/deploy-aws-custom-domain.sh
EOF
  exit 64
fi

printf 'WARNING: explicit pay-as-you-go override accepted.\n'
printf 'Checking AWS identity...\n'
aws sts get-caller-identity --output table

printf '\nResolving Route 53 hosted zone for %s...\n' "$ZONE"
HOSTED_ZONE_ID="$(aws route53 list-hosted-zones-by-name \
  --dns-name "$ZONE" \
  --query "HostedZones[?Name=='${ZONE}.'].Id | [0]" \
  --output text)"
HOSTED_ZONE_ID="${HOSTED_ZONE_ID##*/}"
if [[ -z "$HOSTED_ZONE_ID" || "$HOSTED_ZONE_ID" == "None" ]]; then
  echo "ERROR: Could not find a Route 53 hosted zone named ${ZONE}. in the current AWS account." >&2
  exit 1
fi
printf 'Hosted zone: %s\n' "$HOSTED_ZONE_ID"

printf '\nValidating CloudFormation template...\n'
aws cloudformation validate-template \
  --region "$REGION" \
  --template-body "file://${TEMPLATE}" >/dev/null

printf '\nDeploying %s in %s...\n' "$STACK" "$REGION"
printf 'Public domain: %s\nOrigin: %s\n\n' "$DOMAIN" "$ORIGIN"
aws cloudformation deploy \
  --region "$REGION" \
  --stack-name "$STACK" \
  --template-file "$TEMPLATE" \
  --parameter-overrides \
    DomainName="$DOMAIN" \
    HostedZoneId="$HOSTED_ZONE_ID" \
    OriginDomainName="$ORIGIN" \
  --no-fail-on-empty-changeset

printf '\nStack outputs:\n'
aws cloudformation describe-stacks \
  --region "$REGION" \
  --stack-name "$STACK" \
  --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
  --output table

printf '\nWaiting for HTTPS on https://%s ...\n' "$DOMAIN"
READY=false
for attempt in $(seq 1 40); do
  if curl --silent --show-error --fail --head --max-time 12 "https://${DOMAIN}/" >/tmp/titans-domain-head.txt 2>/dev/null; then
    READY=true
    break
  fi
  printf '  attempt %s/40: not ready yet\n' "$attempt"
  sleep 15
done

if [[ "$READY" != "true" ]]; then
  echo "CloudFront stack completed, but ${DOMAIN} did not answer HTTPS during the validation window." >&2
  echo "Check CloudFront distribution status and Route 53 propagation, then rerun the validation commands in docs/AWS_CUSTOM_DOMAIN.md." >&2
  exit 2
fi

printf '\nHTTPS is responding. Checking staging-only noindex header is removed...\n'
HEADERS="$(curl --silent --show-error --fail --head --max-time 15 "https://${DOMAIN}/")"
if printf '%s\n' "$HEADERS" | grep -qi '^x-robots-tag:.*noindex'; then
  echo 'ERROR: Public custom domain is still returning X-Robots-Tag: noindex.' >&2
  exit 3
fi

printf '\nRunning application regression against the custom domain...\n'
if command -v node >/dev/null 2>&1 && [[ -f scripts/production-regression.mjs ]]; then
  PRODUCTION_URL="https://${DOMAIN}" node scripts/production-regression.mjs
else
  echo 'Node is unavailable; skipping repository production-regression.mjs.'
fi

printf '\nSUCCESS: https://%s is routed through Route 53 + CloudFront to the Cloudflare Worker.\n' "$DOMAIN"
