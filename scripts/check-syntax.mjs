import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root=process.cwd();
const skip=new Set(['node_modules','.git','.vercel']);
const jsFiles=[];
const pythonFiles=[];

async function walk(dir){
  for(const entry of await readdir(dir,{withFileTypes:true})){
    if(skip.has(entry.name))continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())await walk(full);
    else if(/\.(m?js)$/.test(entry.name))jsFiles.push(full);
    else if(entry.name.endsWith('.py'))pythonFiles.push(full);
  }
}

await walk(root);

for(const file of jsFiles.sort()){
  const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
  if(result.status!==0){
    process.stderr.write(`Syntax check failed: ${path.relative(root,file)}\n${result.stderr||result.stdout}`);
    process.exit(result.status||1);
  }
}

const candidates=process.platform==='win32'?['python','py']:['python3','python'];
let python=null;
for(const candidate of candidates){
  const args=candidate==='py'?['-3','--version']:['--version'];
  const result=spawnSync(candidate,args,{encoding:'utf8'});
  if(!result.error&&result.status===0){python=candidate;break;}
}
if(pythonFiles.length&&!python){
  process.stderr.write('Syntax check failed: Python is required to validate browser regression scripts.\n');
  process.exit(1);
}

const compile=`import pathlib,sys; p=pathlib.Path(sys.argv[1]); compile(p.read_text(encoding='utf-8'), str(p), 'exec')`;
for(const file of pythonFiles.sort()){
  const args=python==='py'
    ?['-3','-W','error::SyntaxWarning','-c',compile,file]
    :['-W','error::SyntaxWarning','-c',compile,file];
  const result=spawnSync(python,args,{encoding:'utf8'});
  if(result.status!==0){
    process.stderr.write(`Python syntax check failed: ${path.relative(root,file)}\n${result.stderr||result.stdout}`);
    process.exit(result.status||1);
  }
}

console.log(`Syntax check passed: ${jsFiles.length} JavaScript modules, ${pythonFiles.length} Python scripts.`);
