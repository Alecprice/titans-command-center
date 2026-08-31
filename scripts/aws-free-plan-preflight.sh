#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${DOMAIN:-titans.alecjprice.com}"
ZONE="${ZONE:-alecjprice.com}"
STACK="${STACK:-titans-command-center-domain}"
REGION="us-east-1"

command -v aws >/dev/null 2>&1 || { echo 'ERROR: AWS CLI is not installed.' >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo 'ERROR: python3 is required for read-only JSON formatting.' >&2; exit 1; }

cat <<'EOF'
AWS COST-SAFE PREFLIGHT
-----------------------
This script is READ ONLY. It does not create, update, delete, subscribe, or
associate any AWS resource. Its purpose is to inspect the account before the
CloudFront $0/month flat-rate Free plan is selected in the AWS console.
EOF

printf '\n1) Active AWS identity\n'
AWS_PAGER="" aws sts get-caller-identity --output table

printf '\n2) Route 53 public hosted zone for %s\n' "$ZONE"
ZONE_ROWS="$(AWS_PAGER="" aws route53 list-hosted-zones-by-name --dns-name "$ZONE" --output json)"
HOSTED_ZONE_ID="$(printf '%s' "$ZONE_ROWS" | python3 -c "import json,sys; d=json.load(sys.stdin); z=next((x for x in d.get('HostedZones',[]) if x.get('Name')=='${ZONE}.'),None); print((z or {}).get('Id',''))")"
HOSTED_ZONE_ID="${HOSTED_ZONE_ID##*/}"
if [[ -z "$HOSTED_ZONE_ID" ]]; then
  echo "ERROR: ${ZONE}. was not found in this AWS account." >&2
  exit 2
fi
PRIVATE="$(AWS_PAGER="" aws route53 get-hosted-zone --id "$HOSTED_ZONE_ID" --query 'HostedZone.Config.PrivateZone' --output text)"
if [[ "$PRIVATE" == "True" || "$PRIVATE" == "true" ]]; then
  echo "ERROR: ${ZONE}. resolved to a private hosted zone; CloudFront public DNS needs a public zone." >&2
  exit 3
fi
printf 'Hosted zone ID: %s (public)\n' "$HOSTED_ZONE_ID"

printf '\n3) Existing DNS records for %s\n' "$DOMAIN"
MATCHES="$(AWS_PAGER="" aws route53 list-resource-record-sets --hosted-zone-id "$HOSTED_ZONE_ID" --query "ResourceRecordSets[?Name=='${DOMAIN}.']" --output json)"
printf '%s\n' "$MATCHES" | python3 -m json.tool

RECORD_COUNT="$(AWS_PAGER="" aws route53 list-resource-record-sets --hosted-zone-id "$HOSTED_ZONE_ID" --query 'length(ResourceRecordSets)' --output text)"
printf 'Hosted-zone record count: %s\n' "$RECORD_COUNT"
printf 'Note: we will NOT attach the whole alecjprice.com zone to the CloudFront plan initially.\n'
printf 'That keeps your existing Route 53 setup unchanged; A/AAAA Alias queries to CloudFront are not billed as DNS queries.\n'

printf '\n4) Existing CloudFront distributions\n'
DISTRIBUTIONS="$(AWS_PAGER="" aws cloudfront list-distributions --output json)"
printf '%s' "$DISTRIBUTIONS" | python3 -c '
import json,sys
payload=json.load(sys.stdin)
items=((payload.get("DistributionList") or {}).get("Items") or [])
if not items:
    print("No CloudFront distributions found.")
else:
    for item in items:
        aliases=((item.get("Aliases") or {}).get("Items") or [])
        alias_text=", ".join(aliases) if aliases else "(no aliases)"
        print("- {} | {} | status={} | enabled={} | aliases={}".format(
            item.get("Id","?"), item.get("DomainName","?"), item.get("Status","?"),
            item.get("Enabled",False), alias_text))
'

printf '\n5) Existing ACM certificates for the target hostname in us-east-1\n'
AWS_PAGER="" aws acm list-certificates \
  --region "$REGION" \
  --query "CertificateSummaryList[?DomainName=='${DOMAIN}'].[CertificateArn,DomainName]" \
  --output table

printf '\n6) Existing fallback CloudFormation stack (should normally be absent)\n'
if AWS_PAGER="" aws cloudformation describe-stacks --region "$REGION" --stack-name "$STACK" --query 'Stacks[0].[StackName,StackStatus]' --output table 2>/dev/null; then
  echo 'WARNING: the pay-as-you-go fallback stack already exists. Stop and review it before creating another distribution.' >&2
else
  echo 'No fallback CloudFormation stack found.'
fi

cat <<'EOF'

PREFLIGHT COMPLETE — NO AWS RESOURCES WERE CHANGED.

Next step is performed in the CloudFront console, not by the pay-as-you-go
CloudFormation helper:
  - Create a standard distribution for a single website/app.
  - Use titans.alecjprice.com as the public hostname.
  - Select the CloudFront Free flat-rate plan ($0/month).
  - If AWS says the account is ineligible for the Free flat-rate plan, STOP.
  - Do not choose Pro, Business, Premium, or pay-as-you-go.
  - Do not attach the whole Route 53 hosted zone to the plan yet.
  - Do not enable Lambda@Edge, paid CAPTCHA API, DNS query logging, enhanced
    metrics, or other separately billed extras.
EOF
