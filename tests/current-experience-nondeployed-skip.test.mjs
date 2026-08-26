import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync('.github/workflows/current-experience-browser.yml','utf8');

test('Current Experience does not publish a failure status for a revision that is not live', () => {
  assert.match(workflow, /Record non-deployed revision skip/);
  assert.match(workflow, /if: steps\.deployed_sha\.outcome != 'success'/);
  assert.match(workflow, /Publish Current Experience commit status\n\s+if: steps\.deployed_sha\.outcome == 'success'/);
  assert.doesNotMatch(workflow, /DEPLOYED_SHA_OUTCOME: \$\{\{ steps\.deployed_sha\.outcome \}\}[\s\S]*Publish Current Experience commit status/);
});

test('Current Experience browser checks still fail closed when the revision is actually deployed', () => {
  assert.match(workflow, /Fail audit when any evaluated current-experience check failed/);
  assert.match(workflow, /if: steps\.deployed_sha\.outcome == 'success'/);
  assert.match(workflow, /\[\[ "\$outcome" == "success" \]\] \|\| exit 1/);
});

test('non-deployed revisions do not create empty browser-report artifacts', () => {
  assert.match(workflow, /Upload audit reports\n\s+if: steps\.deployed_sha\.outcome == 'success'/);
});
