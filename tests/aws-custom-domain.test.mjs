import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('pay-as-you-go AWS custom domain template is fail-closed and keeps safe origin settings',()=>{
  const template=read('infra/aws/titans-command-center-domain.yaml');
  assert.match(template,/PAY-AS-YOU-GO FALLBACK ONLY/);
  assert.match(template,/PayAsYouGoAcknowledgement/);
  assert.match(template,/Default: BLOCKED/);
  assert.match(template,/I_UNDERSTAND_CHARGES/);
  assert.match(template,/RequireExplicitMeteredBillingAcknowledgement/);
  assert.match(template,/titans-command-center\.alecjprice\.com/);
  assert.match(template,/titans-command-center\.alecjordanprice\.workers\.dev/);
  assert.match(template,/AWS::CertificateManager::Certificate/);
  assert.match(template,/ValidationMethod: DNS/);
  assert.match(template,/AWS::CloudFront::Distribution/);
  assert.match(template,/AWS::Route53::RecordSet/);
  assert.match(template,/Type: A/);
  assert.match(template,/Type: AAAA/);
  assert.match(template,/CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad/);
  assert.match(template,/OriginRequestPolicyId: b689b0a8-53d0-40ab-baf2-68738e2966ac/);
  assert.match(template,/Header: X-Robots-Tag/);
  assert.match(template,/ViewerProtocolPolicy: redirect-to-https/);
  assert.match(template,/MinimumProtocolVersion: TLSv1\.2_2021/);
  assert.doesNotMatch(template,/AKIA[0-9A-Z]{16}/);
});

test('metered deployment helper refuses normal execution and requires explicit charge acknowledgement',()=>{
  const script=read('scripts/deploy-aws-custom-domain.sh');
  assert.match(script,/REGION="us-east-1"/);
  assert.match(script,/COST SAFETY STOP/);
  assert.match(script,/ALLOW_PAY_AS_YOU_GO_CLOUDFRONT/);
  assert.match(script,/I_UNDERSTAND_CHARGES/);
  assert.match(script,/PayAsYouGoAcknowledgement=I_UNDERSTAND_CHARGES/);
  assert.match(script,/route53 list-hosted-zones-by-name/);
  assert.match(script,/cloudformation validate-template/);
  assert.match(script,/cloudformation deploy/);
  assert.match(script,/PRODUCTION_URL="https:\/\/\$\{DOMAIN\}" node scripts\/production-regression\.mjs/);
  assert.match(script,/x-robots-tag:.*noindex/i);
  assert.doesNotMatch(script,/aws_secret_access_key/i);
});

test('AWS free-plan preflight is read-only and checks account, DNS, CloudFront and ACM state',()=>{
  const script=read('scripts/aws-free-plan-preflight.sh');
  assert.match(script,/AWS COST-SAFE PREFLIGHT/);
  assert.match(script,/READ ONLY/);
  assert.match(script,/sts get-caller-identity/);
  assert.match(script,/route53 list-hosted-zones-by-name/);
  assert.match(script,/route53 get-hosted-zone/);
  assert.match(script,/route53 list-resource-record-sets/);
  assert.match(script,/cloudfront list-distributions/);
  assert.match(script,/acm list-certificates/);
  assert.match(script,/cloudformation describe-stacks/);
  assert.match(script,/CloudFront Free flat-rate plan \(\$0\/month\)/);
  assert.match(script,/If AWS says the account is ineligible.*STOP/s);
  assert.doesNotMatch(script,/cloudformation deploy/);
  assert.doesNotMatch(script,/route53 change-resource-record-sets/);
  assert.doesNotMatch(script,/request-certificate/);
  assert.doesNotMatch(script,/create-distribution/);
  assert.doesNotMatch(script,/aws_secret_access_key/i);
});

test('AWS custom-domain guide keeps D1 authoritative and Neon Auth isolated',()=>{
  const guide=read('docs/AWS_CUSTOM_DOMAIN.md');
  assert.match(guide,/Cloudflare Worker and D1 database remain the application origin and production data authority/);
  assert.match(guide,/Route 53 -> CloudFront Free flat-rate \+ ACM -> Cloudflare Worker -> D1/);
  assert.match(guide,/Browser -> CloudFront -> Cloudflare Worker account proxy -> Neon Auth/);
  assert.match(guide,/AWS layer is only a public HTTPS\/DNS front door/);
  assert.match(guide,/does not receive D1 credentials/);
  assert.match(guide,/\/api\/health` reports Cloudflare D1 as the primary storage provider/);
  assert.match(guide,/optional Neon Auth outage must not turn public fan routes into an application outage/);
  assert.match(guide,/Do not delete .*Cloudflare Worker, D1 database, Neon Auth project, or GitHub repository/s);
  assert.doesNotMatch(guide,/Cloudflare Worker and Neon database remain the origin\/backend/);
  assert.doesNotMatch(guide,/Cloudflare Worker -> Neon(?:\s|`)/);
  assert.doesNotMatch(guide,/Neon configured and healthy/);
});
