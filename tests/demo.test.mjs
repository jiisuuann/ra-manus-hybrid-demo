import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {validate,selection,summary} from '../src/model.js';
import {auditSource,auditBuild} from '../scripts/audit.mjs';
const data=JSON.parse(await readFile(new URL('../data/annual.json',import.meta.url)));
test('synthetic annual release matches independently specified totals and medians',()=>{
 validate(data);assert.equal(data.cells.length,18);
 // The release is a fixed fictional fixture, not a real-data import.
 const towns=['Alder Bay','Birch Haven','Cedar Grove','Willow Harbor','Maple Ridge','Pine Valley'];
 const schools=['Alder University','Birch College','Cedar University','Willow College','Maple University','Pine College'];
 data.cells.forEach((cell,index)=>{
  const town=Math.floor(index/3),year=index%3;
  assert.deepEqual(cell,{city:'Demo '+towns[town],university:'Demo '+schools[town],region:['North','South','West'][Math.floor(town/2)],year:2023+year,count:300+town*80+year*30,medianPrice:250000+town*35000+year*15000});
 });
 for(const [year,total] of [[2023,3000],[2024,3180],[2025,3360]])assert.equal(summary(selection(data,'all',year)).count,total);
 assert.deepEqual(summary(selection(data,'Demo Alder Bay',2025)),{count:360,medianPrice:280000});
 assert.equal(summary(selection(data,'all',2025)).medianPrice,null);
 assert.equal(selection(data,'missing',2025).length,0);
});
test('reject unknown fields, real-data provenance, small or precise groups and inconsistent dimensions',()=>{
 for(const mutate of [d=>d.cells[0].secret='x',d=>d.provenance='real',d=>d.cells[0].count=10,d=>d.cells[0].count=301,d=>d.cells[0].medianPrice=250001,d=>d.cells.push({...d.cells[0]}),d=>d.cells.pop(),d=>d.cells[0].region='Elsewhere']){
  const copy=structuredClone(data);mutate(copy);assert.throws(()=>validate(copy));
 }
});
test('source and deployment artifact allowlists',async()=>{await auditSource();await auditBuild()});
test('built website serves under a repository subpath and does not serve private paths',async()=>{
 const child=spawn(process.execPath,['scripts/serve.mjs','--dist'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:'4174'},stdio:['ignore','pipe','pipe']});
 try{
  await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('error',reject);child.once('exit',code=>reject(Error('Server exited '+code)))});
  const base='http://127.0.0.1:4174/ra-manus-hybrid-demo/';
  for(const f of ['','#overview','#comparisons','logo.svg','src/app.js','src/model.js','src/style.css','data/annual.json'])assert.equal((await fetch(base+f)).status,200);
  for(const f of ['package.json','scripts/serve.mjs','../data/annual.json','data/sales.v1.json'])assert.equal((await fetch(base+f)).status,404);
  const html=await(await fetch(base)).text();assert.match(html,/src="\.\/src\/app.js"/);
  // Resolve the actual HTML assets and module-relative data URL at the Pages path.
  for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
   const url=new URL(match[1],base);assert.ok(url.pathname.startsWith('/ra-manus-hybrid-demo/'));
   assert.equal((await fetch(url)).status,200);
  }
  const moduleUrl=new URL('src/app.js',base);
  const moduleText=await(await fetch(moduleUrl)).text();
  assert.match(moduleText,/new URL\('\.\.\/data\/annual.json',import.meta.url\)/);
  const release=await(await fetch(new URL('../data/annual.json',moduleUrl))).json();
  assert.deepEqual(release,data);
 }finally{child.kill()}
});
test('navigation both ways, direct links, refresh, synchronized filters, annual updates, and reset',async()=>{
 const elements=Object.fromEntries(['#app','#city','#university','#year','#reset','#results','#nav-overview','#nav-comparisons','#current-section','#comparisons'].map(k=>[k,{value:k==='#year'?'2025':'all',innerHTML:'',listeners:{},attributes:{},classList:{active:false,toggle(name,on){this.active=on}},setAttribute(name,value){this.attributes[name]=value},removeAttribute(name){delete this.attributes[name]},scrollIntoView(){this.scrolled=true},addEventListener(event,fn){this.listeners[event]=fn}}]));
 const originalDocument=globalThis.document,originalFetch=globalThis.fetch,originalWindow=globalThis.window;
 const navigation={location:{hash:"#comparisons"},listeners:{},addEventListener(event,fn){this.listeners[event]=fn}};
 globalThis.window=navigation;
 globalThis.document={querySelector:key=>elements[key]};
 globalThis.fetch=async()=>({ok:true,json:async()=>structuredClone(data)});
 try{
  await import('../src/app.js');
  // Direct comparison link / refreshed comparison URL initializes correctly.
  assert.equal(elements['#nav-comparisons'].classList.active,true);
  assert.equal(elements['#nav-overview'].classList.active,false);
  assert.equal(elements['#nav-comparisons'].attributes['aria-current'],'location');
  assert.equal(elements['#comparisons'].scrolled,true);
  for(const hash of ['#overview','#comparisons','#overview','']) {
   navigation.location.hash=hash;navigation.listeners.hashchange();
   const current=hash==='#comparisons'?'comparisons':'overview';
   for(const name of ['overview','comparisons']) {
    assert.equal(elements['#nav-'+name].classList.active,name===current);
    assert.equal(elements['#nav-'+name].attributes['aria-current'],name===current?'location':undefined);
   }
   assert.equal(elements['#current-section'].textContent,current==='comparisons'?'Regional comparisons':'Market overview');
  }
  assert.match(elements['#app'].innerHTML,/Synthetic demonstration/);
  assert.match(elements['#results'].innerHTML,/3,360/);
  elements['#city'].value='Demo Alder Bay';elements['#city'].listeners.change();
  assert.equal(elements['#university'].value,'Demo Alder Bay');
  assert.match(elements['#results'].innerHTML,/\$280,000/);
  elements['#year'].value='2023';elements['#year'].listeners.change();
  assert.match(elements['#results'].innerHTML,/\$250,000/);
  elements['#university'].value='Demo Pine Valley';elements['#university'].listeners.change();
  assert.equal(elements['#city'].value,'Demo Pine Valley');
  elements['#reset'].listeners.click();assert.equal(elements['#year'].value,'2025');assert.equal(elements['#city'].value,'all');assert.match(elements['#results'].innerHTML,/3,360/);
  // Fresh module initialization simulates reloading either fragment URL.
  for(const [index,hash] of ['#overview','#comparisons','','#unknown'].entries()) {
   navigation.location.hash=hash;
   await import(`../src/app.js?refresh=${index}`);
   assert.equal(elements['#nav-comparisons'].classList.active,hash==='#comparisons');
   assert.equal(elements['#nav-overview'].classList.active,hash!=='#comparisons');
   assert.match(elements['#results'].innerHTML,/3,360/);
  }
 }finally{globalThis.document=originalDocument;globalThis.fetch=originalFetch;globalThis.window=originalWindow}
});
