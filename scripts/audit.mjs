import {readFile,readdir} from 'node:fs/promises';
import {validate} from '../src/model.js';
import {fileURLToPath} from 'node:url';
export const outputFiles=['data/annual.json','index.html','logo.svg','src/app.js','src/model.js','src/style.css'];
const sourceFiles=[...outputFiles,'.gitignore','README.md','package.json','scripts/audit.mjs','scripts/build.mjs','scripts/serve.mjs','tests/demo.test.mjs','.github/workflows/pages.yml'];
async function walk(dir,prefix=''){
 const entries=await readdir(dir,{withFileTypes:true});let files=[];
 for(const e of entries){if(!prefix&&(e.name==='dist'||e.name==='.git'))continue;const name=prefix+e.name;if(e.isSymbolicLink())throw Error('Symlink forbidden: '+name);files.push(...(e.isDirectory()?await walk(new URL(e.name+'/',dir),name+'/'):[name]));}return files;
}
export async function auditSource(){
 const root=new URL('../',import.meta.url);
 const files=await walk(root);
 if(files.sort().join('|')!==sourceFiles.sort().join('|'))throw Error('Unexpected source file: review allowlist');
 validate(JSON.parse(await readFile(new URL('data/annual.json',root),'utf8')));
 for(const f of outputFiles){const text=await readFile(new URL(f,root),'utf8');if(/https?:\/\/|__MANUS|sales\.v1|sourceMappingURL|listing_id|address_street|latitude|longitude/i.test(text.replace('http://www.w3.org/2000/svg','')))throw Error('Forbidden content: '+f);}
 console.log('Source schema and file allowlist passed');
}
export async function auditBuild(){
 const root=new URL('../dist/',import.meta.url), files=await walk(root);
 if(files.sort().join('|')!==[...outputFiles].sort().join('|'))throw Error('Unexpected build file');
 for(const f of outputFiles){const built=await readFile(new URL(f,root));const source=await readFile(new URL('../'+f,import.meta.url));if(!built.equals(source))throw Error('Build differs from approved source: '+f);}
 console.log('Build audit passed: six approved files; no extra assets or source maps');
}
if(process.argv[1]===fileURLToPath(import.meta.url)){await auditSource();await auditBuild();}
