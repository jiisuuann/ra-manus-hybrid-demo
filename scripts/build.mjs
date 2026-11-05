import {mkdir,copyFile,readdir,rm} from 'node:fs/promises';
import {auditSource} from './audit.mjs';
await auditSource();
await rm(new URL('../dist/',import.meta.url),{recursive:true,force:true});
for(const dir of ['','src/','data/']) await mkdir(new URL('../dist/'+dir,import.meta.url),{recursive:true});
for(const file of ['index.html','logo.svg','src/app.js','src/model.js','src/style.css','data/annual.json']) await copyFile(new URL('../'+file,import.meta.url),new URL('../dist/'+file,import.meta.url));
console.log('Built allowlisted static files in dist/');
