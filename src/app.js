import {validate,selection,summary,money} from './model.js';
const root=document.querySelector('#app');
try {
 const response=await fetch(new URL('../data/annual.json',import.meta.url));
 if(!response.ok) throw Error('Dataset unavailable');
 const data=validate(await response.json());
 const cities=[...new Set(data.cells.map(c=>c.city))];
 root.innerHTML=`<div class="app-shell"><aside class="sidebar"><div class="brand"><img src="./logo.svg" alt=""><div><strong>campus<span>&</span>home.</strong><small>WHERE DATA FEELS AT HOME</small></div></div><p class="nav-label">WORKSPACE</p><a class="nav" id="nav-overview" href="#overview">◈ Market overview</a><a class="nav" id="nav-comparisons" href="#comparisons">▥ Regional comparisons</a><div class="sidebar-note"><strong>Small towns. Big picture.</strong><p>A private-data-free demonstration of college-town housing insights.</p><small>SYNTHETIC DATA ONLY</small></div></aside><div class="main-shell"><header>Workspace / <strong id="current-section">Market overview</strong><span>Synthetic demonstration</span></header><main id="overview"><div class="eyebrow">COLLEGE TOWN HOUSING INSIGHTS</div><h1>A little perspective. A better place.</h1><p class="subtitle">Explore annual patterns through fictional towns and illustrative numbers.</p><div class="notice" role="note"><strong>Synthetic demonstration — not real market evidence.</strong> Every value and place is fictional. No original housing records were used.</div><div class="filters"><label>City <select id="city"><option value="all">All demo towns</option>${cities.map(c=>`<option>${c}</option>`).join('')}</select></label><label>University <select id="university"><option value="all">All demo universities</option>${cities.map(c=>`<option value="${c}">${data.cells.find(x=>x.city===c).university}</option>`).join('')}</select></label><label>Year <select id="year"><option>2025</option><option>2024</option><option>2023</option></select></label><button id="reset">Reset filters</button></div><div id="results" aria-live="polite"></div><section class="panel documentation"><h2>About this demonstration</h2><p>Only annual town counts and median prices are published. Town and university selections describe the same fixed population. Regional comparisons group towns for display; they do not calculate regional medians.</p><p>Property search, transaction tables, details, bookmarks, exports, monthly and property-type filters, and distance metrics are omitted. No database, account, analytics, external font, or API is used.</p><p>Real-data publication requires permission and a separate review of small groups, overlapping summaries, outside information, and changes between releases. A group-size threshold alone does not establish privacy.</p></section><footer>Campus & Home · Synthetic aggregate demo · Not approved for real-data publication · Updated deployment verification</footer></main></div></div>`;
 function syncNavigation() {
  const section=window.location.hash==='#comparisons'?'comparisons':'overview';
  for(const name of ['overview','comparisons']) {
   const link=document.querySelector('#nav-'+name);
   link.classList.toggle('active',name===section);
   if(name===section) link.setAttribute('aria-current','location');
   else link.removeAttribute('aria-current');
  }
  document.querySelector('#current-section').textContent=section==='comparisons'?'Regional comparisons':'Market overview';
 }
 window.addEventListener('hashchange',syncNavigation);
 syncNavigation();
 const city=document.querySelector('#city'), university=document.querySelector('#university'), year=document.querySelector('#year');
 function render(){
  const cells=selection(data,city.value,year.value), totals=summary(cells);
  const series=data.cells.filter(c=>city.value==='all'||c.city===city.value);
  const annual=[2023,2024,2025].map(y=>({year:y,...summary(series.filter(c=>c.year===y))}));
  const maxCount=Math.max(...annual.map(c=>c.count));
  document.querySelector('#results').innerHTML=`<div class="kpis"><article><small>Annual sales · ${year.value}</small><strong>${totals.count.toLocaleString('en-US')}</strong><small>Synthetic count across selected towns</small></article><article><small>Median sale price · ${year.value}</small><strong>${money(totals.medianPrice)}</strong><small>${totals.medianPrice===null?'Overall median is not derived from town medians':'Synthetic town-year median · USD'}</small></article><article><small>Selected towns</small><strong>${cells.length}</strong><small>Fixed annual aggregate groups</small></article></div><section class="panel"><h2>Annual trends</h2><p>Sales volume${city.value==='all'?' · select one town to see median-price trends':' and median sale price'}. All numbers are synthetic.</p><div class="trends">${annual.map(a=>`<div class="trend"><strong>${a.year}</strong><div class="track"><div class="bar" style="width:${a.count/maxCount*100}%"></div></div><span>${a.count.toLocaleString('en-US')} sales</span><span>${a.medianPrice===null?'—':money(a.medianPrice)}</span></div>`).join('')}</div></section><section class="panel" id="comparisons"><h2>Regional comparisons · ${year.value}</h2><p>Town-level counts and median prices, grouped by fictional region. Comparisons show all towns regardless of town selection.</p><div class="regions">${['North','South','West'].map(region=>`<section><h3>${region}</h3>${selection(data,'all',year.value).filter(c=>c.region===region).map(c=>`<div class="comparison"><strong>${c.city}</strong><small>${c.university}</small><span>${c.count.toLocaleString('en-US')} sales · ${money(c.medianPrice)}</span></div>`).join('')}</section>`).join('')}</div></section>`;
 }
 city.addEventListener('change',()=>{university.value=city.value;render()});
 university.addEventListener('change',()=>{city.value=university.value;render()});
 year.addEventListener('change',render);
 document.querySelector('#reset').addEventListener('click',()=>{city.value=university.value='all';year.value='2025';render()});
 render();
 // The comparison anchor is created after the asynchronous data load.
 if(window.location.hash==='#comparisons') document.querySelector('#comparisons').scrollIntoView();
} catch(error) {root.textContent='Unable to load the synthetic demonstration. Check the local server and approved data schema.';console.error(error);}
