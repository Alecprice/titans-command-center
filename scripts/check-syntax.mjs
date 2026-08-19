import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root=process.cwd();
const skip=new Set(['node_modules','.git','.vercel']);
const files=[];
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){if(skip.has(entry.name))continue;const full=path.join(dir,entry.name);if(entry.isDirectory())await walk(full);else if(/\.(m?js)$/.test(entry.name))files.push(full)}}
await walk(root);
for(const file of files.sort()){
  const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
  if(result.status!==0){process.stderr.write(`Syntax check failed: ${path.relative(root,file)}\n${result.stderr||result.stdout}`);process.exit(result.status||1)}
}
console.log(`Syntax check passed: ${files.length} JavaScript modules.`);
