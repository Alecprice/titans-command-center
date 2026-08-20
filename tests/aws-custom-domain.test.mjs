import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('AWS custom domain stack keeps Route 53 and CloudFront in front of the existing Worker',()=>{
  const template=read('infra/aws/titans-command-center-domain.yaml');
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

test('AWS deployment helper fails closed before accidental pay-as-you-go CloudFront creation',()=>{
  const script=read('scripts/deploy-aws-custom-domain.sh');
  assert.match(script,/REGION="us-east-1"/);
  assert.match(script,/ALLOW_PAY_AS_YOU_GO_CLOUDFRONT/);
  assert.match(script,/I_UNDERSTAND_CHARGES/);
  assert.match(script,/COST SAFETY STOP/);
  assert.match(script,/No AWS resources were created by this invocation/);
  assert.match(script,/FLAT-RATE FREE PLAN/);
  assert.match(script,/route53 list-hosted-zones-by-name/);
  assert.match(script,/cloudformation validate-template/);
  assert.match(script,/cloudformation deploy/);
  assert.match(script,/PRODUCTION_URL="https:\/\/\$\{DOMAIN\}" node scripts\/production-regression\.mjs/);
  assert.match(script,/x-robots-tag:.*noindex/i);
  assert.doesNotMatch(script,/aws_secret_access_key/i);
});
