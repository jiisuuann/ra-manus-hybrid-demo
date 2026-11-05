export const MIN_COUNT = 100;
const exact = (obj, keys) => obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).sort().join('|') === [...keys].sort().join('|');
export function validate(data) {
  if (!exact(data, ['schemaVersion','provenance','publicationStatus','cells']) || data.schemaVersion !== 1 || data.provenance !== 'synthetic' || data.publicationStatus !== 'demo-only' || !Array.isArray(data.cells) || !data.cells.length) throw Error('Only allowlisted synthetic releases are accepted');
  const seen = new Set();
  for (const c of data.cells) {
    if (!exact(c,['city','university','region','year','count','medianPrice']) || !['North','South','West'].includes(c.region) || !/^Demo [A-Za-z ]{1,40}$/.test(c.city) || !/^Demo [A-Za-z ]{1,40}$/.test(c.university) || ![2023,2024,2025].includes(c.year) || !Number.isInteger(c.count) || c.count < MIN_COUNT || c.count % 10 || !Number.isInteger(c.medianPrice) || c.medianPrice < 50000 || c.medianPrice % 5000) throw Error('Invalid or ineligible aggregate');
    const key = `${c.city}|${c.year}`;
    if (seen.has(key)) throw Error('Duplicate cell');
    seen.add(key);
  }
  const cities = [...new Set(data.cells.map(c=>c.city))];
  for (const city of cities) {
    const cells = data.cells.filter(c=>c.city===city);
    if(cells.length!==3 || new Set(cells.map(c=>c.university)).size!==1 || new Set(cells.map(c=>c.region)).size!==1) throw Error('Incomplete annual series or inconsistent geography');
  }
  if(new Set(data.cells.map(c=>c.university)).size!==cities.length) throw Error('Demo requires one university per city');
  return data;
}
export function selection(data, city, year) {
  return data.cells.filter(c=>(city==='all'||c.city===city)&&c.year===Number(year));
}
export function summary(cells) {
  return {count:cells.reduce((n,c)=>n+c.count,0), medianPrice:cells.length===1?cells[0].medianPrice:null};
}
export const money = n => n===null?'Select one town':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
