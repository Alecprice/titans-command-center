import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const DATABASE_NAME='titans-command-center';
const BINDING='TITANS_DB';
const CONFIG='wrangler.jsonc';
const MIGRATIONS_DIR='db/d1/migrations';

function wrangler(args,{stdio='pipe'}={}){
  return execFileSync('npx',['--yes','wrangler@4',...args],{encoding:'utf8',stdio:stdio==='inherit'?'inherit':['ignore','pipe','inherit']});
}

function listDatabases(){
  const raw=wrangler(['d1','list','--json']);
  const parsed=JSON.parse(raw);
  return Array.isArray(parsed)?parsed:Array.isArray(parsed?.result)?parsed.result:[];
}

function databaseId(row){return String(row?.uuid||row?.id||row?.database_id||'').trim();}

function serializeConfig(config){
  return JSON.stringify(config,null,2)
    .replace(/"required": \[\n\s*"DATABASE_URL"\n\s*\]/,'"required": ["DATABASE_URL"]')
    .replace(/"run_worker_first": \[\n\s*"\\/api\\/\\*"\n\s*\]/,'"run_worker_first": ["/api/*"]');
}

if(!fs.existsSync(CONFIG))throw new Error(`${CONFIG} not found. Run this command from the repository root.`);

const database=listDatabases().find(row=>String(row?.name||'')===DATABASE_NAME);
if(!database){
  console.error(`D1 database '${DATABASE_NAME}' does not exist yet.`);
  console.error(`Create it once with: npx wrangler@4 d1 create ${DATABASE_NAME} --location enam`);
  console.error(`Then rerun: npm run d1:configure`);
  process.exit(2);
}

const id=databaseId(database);
if(!id)throw new Error(`Unable to determine the D1 database ID for '${DATABASE_NAME}'.`);

const config=JSON.parse(fs.readFileSync(CONFIG,'utf8'));
const existing=Array.isArray(config.d1_databases)?config.d1_databases:[];
config.d1_databases=[
  ...existing.filter(entry=>entry?.binding!==BINDING&&entry?.database_name!==DATABASE_NAME),
  {binding:BINDING,database_name:DATABASE_NAME,database_id:id,migrations_dir:MIGRATIONS_DIR}
];
fs.writeFileSync(CONFIG,`${serializeConfig(config)}\n`);

console.log(`Configured ${BINDING} -> ${DATABASE_NAME} (${id}).`);
console.log('Applying D1 migrations...');
wrangler(['d1','migrations','apply',DATABASE_NAME,'--remote'],{stdio:'inherit'});
console.log('D1 configuration complete. Run npm run check before deploying.');
