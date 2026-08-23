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
