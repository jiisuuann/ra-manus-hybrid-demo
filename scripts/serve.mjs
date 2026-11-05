import http from 'node:http';
import {readFile} from 'node:fs/promises';
const dist=process.argv.includes('--dist');
const root=new URL(dist?'../dist/':'../',import.meta.url);
const base='/ra-manus-hybrid-demo/';
const allowed=new Set(['index.html','logo.svg','src/app.js','src/model.js','src/style.css','data/annual.json']);
const types={html:'text/html',svg:'image/svg+xml',js:'application/javascript',css:'text/css',json:'application/json'};
const server=http.createServer(async(req,res)=>{
 const path=new URL(req.url,'http://localhost').pathname;
 if(path==='/'){res.writeHead(302,{Location:base});return res.end()}
 const file=path.startsWith(base)?path.slice(base.length)||'index.html':'';
 if(!allowed.has(file)){res.writeHead(404);return res.end('Not found')}
 try{const content=await readFile(new URL(file,root));res.writeHead(200,{'Content-Type':types[file.split('.').pop()],'X-Content-Type-Options':'nosniff'});res.end(content)}catch{res.writeHead(404);res.end('Not found')}
});
server.listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Demo: http://127.0.0.1:'+(process.env.PORT||4173)+base));
