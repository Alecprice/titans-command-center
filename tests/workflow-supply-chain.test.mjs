import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const workflowDir=path.join(root,'.github','workflows');
const workflows=fs.readdirSync(workflowDir).filter(name=>/\.ya?ml$/.test(name));
const read=name=>fs.readFileSync(path.join(workflowDir,name),'utf8');
const fullSha=/^[0-9a-f]{40}$/;

test('external workflow actions are pinned to immutable commit SHAs',()=>{
  for(const name of workflows){
    const source=read(name);
    for(const match of source.matchAll(/^\s*uses:\s*([^\s#]+)(?:\s*#.*)?$/gm)){
      const ref=match[1];
      if(ref.startsWith('./'))continue;
      const at=ref.lastIndexOf('@');
      assert.ok(at>0,`${name}: action reference has no @ ref: ${ref}`);
      const sha=ref.slice(at+1);
      assert.match(sha,fullSha,`${name}: action is not pinned to a full commit SHA: ${ref}`);
    }
  }
});

test('Node-powered release workflows explicitly use Node 24 without package-manager caching',()=>{
  for(const name of ['quality.yml','cloudflare-deploy.yml','current-experience-browser.yml']){
    const source=read(name);
    assert.match(source,/name: Use Node 24/,`${name}: Node 24 setup step missing`);
    assert.match(source,/node-version: '24'/,`${name}: Node 24 runtime missing`);
    assert.match(source,/package-manager-cache: false/,`${name}: package-manager cache should be disabled`);
    assert.doesNotMatch(source,/Node 20|node-version:\s*['"]20['"]/,`${name}: deprecated Node 20 remains`);
  }
});

test('security-sensitive workflows retain least-privilege repository permissions',()=>{
  for(const name of ['quality.yml','nflreadpy-ingest.yml','responsive-matrix.yml']){
    const source=read(name);
    assert.match(source,/permissions:\s*\n\s*contents: read/);
    assert.doesNotMatch(source,/contents: write/);
  }
  const audit=read('current-experience-browser.yml');
  assert.match(audit,/permissions:\s*\n\s*contents: read\s*\n\s*statuses: write/);
  for(const name of ['cloudflare-deploy.yml','player-headshots.yml'])assert.match(read(name),/permissions:\s*\n\s*contents: write/);
});

test('read-only workflow checkouts do not persist repository credentials',()=>{
  for(const name of ['quality.yml','nflreadpy-ingest.yml','responsive-matrix.yml','current-experience-browser.yml']){
    const source=read(name);
    assert.match(source,/persist-credentials: false/,`${name}: read-only checkout should not persist GitHub credentials`);
  }
  for(const name of ['cloudflare-deploy.yml','player-headshots.yml']){
    const source=read(name);
    assert.doesNotMatch(source,/persist-credentials: false/,`${name}: write workflow still needs checkout credentials for its generated-file push`);
  }
});

test('Cloudflare status writer syncs to current main before committing its generated report',()=>{
  const deploy=read('cloudflare-deploy.yml');
  const fetchIndex=deploy.indexOf('git fetch origin main');
  const guardIndex=deploy.indexOf('git diff --quiet "$GITHUB_SHA" origin/main');
  const checkoutIndex=deploy.indexOf('git checkout -B main origin/main');
  const reportIndex=deploy.indexOf("echo '# Cloudflare deployment status'");
  const pushIndex=deploy.indexOf('git push origin main');
  assert.ok(fetchIndex>=0,'deployment status writer must fetch the latest main');
  assert.ok(guardIndex>fetchIndex,'deployment status writer must reject superseded source revisions after fetching');
  assert.ok(checkoutIndex>guardIndex,'deployment status writer must move to current main only after the supersession guard passes');
  assert.ok(reportIndex>checkoutIndex,'deployment report must be generated after syncing current main');
  assert.ok(pushIndex>reportIndex,'deployment report must push only after the synced report commit is created');
  assert.match(deploy,/':\(exclude\)docs\/CLOUDFLARE_STATUS\.md'/,'generated status-only commits must not make the active release look superseded');
  assert.match(deploy,/Skipping deployment status write because main contains newer non-status changes/);
});

test('cancelled Cloudflare releases never publish generated deployment status',()=>{
  const deploy=read('cloudflare-deploy.yml');
  assert.match(deploy,/name: Record Cloudflare deployment result[\s\S]*if: \$\{\{ always\(\) && !cancelled\(\) \}\}/);
});

test('critical workflow dependencies stay on the reviewed pinned releases',()=>{
  const all=workflows.map(read).join('\n');
  for(const ref of [
    'actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1',
    'actions/setup-node@820762786026740c76f36085b0efc47a31fe5020',
    'actions/setup-python@5fda3b95a4ea91299a34e894583c3862153e4b97',
    'actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a',
    'actions/github-script@3a2844b7e9c422d3c10d287c895573f7108da1b3',
    'cloudflare/wrangler-action@ebbaa1584979971c8614a24965b4405ff95890e0'
  ])assert.ok(all.includes(ref),`reviewed pinned action missing: ${ref}`);
});
