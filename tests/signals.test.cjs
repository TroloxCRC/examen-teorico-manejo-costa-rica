const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');const nodes=new Map();
const node=selector=>{if(!nodes.has(selector))nodes.set(selector,{innerHTML:'',textContent:'',value:'',disabled:false,focus(){}});return nodes.get(selector)};
let html='',stored='';
const context={console,window:{addEventListener(){}},document:{querySelector:node,querySelectorAll:()=>[]},localStorage:{getItem:()=>null,setItem:(key,value)=>stored=value},page:(content)=>{html=content},esc:s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),ask:(a,b,yes)=>yes()};
vm.createContext(context);
for(const file of ['signals-data.js','signals-feature.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const signs=context.window.TRAFFIC_SIGNS,questions=context.window.TRAFFIC_SIGN_QUESTIONS;
assert.equal(signs.length,56);assert.equal(questions.length,56);assert.equal(new Set(signs.map(s=>s.id)).size,56);
for(const s of signs){assert(s.name&&s.meaning&&s.category&&s.detailUrl.startsWith('https://licenciadeconducircr.com/'));assert(fs.existsSync(path.join(root,s.image)));}
for(const q of questions){const s=signs.find(s=>s.id===q.signId);assert.equal(q.options[q.answer],s.name);assert.equal(new Set(q.options).size,3);assert.equal(q.image,s.image);}
context.window.renderSignals();assert.equal((node('#signals-grid').innerHTML.match(/<article/g)||[]).length,56);
node('#signals-search').oninput({target:{value:'TELEFONO'}});assert.equal((node('#signals-grid').innerHTML.match(/<article/g)||[]).length,1);assert(node('#signals-grid').innerHTML.includes('Teléfono'));
node('#signals-search').oninput({target:{value:'xyz-no-results'}});assert(node('#signals-start').disabled);assert(node('#signals-grid').innerHTML.includes('No encontramos'));
node('#signals-search').oninput({target:{value:''}});
const category=signs[0].category;node('#signals-category').onchange({target:{value:category}});assert.equal((node('#signals-grid').innerHTML.match(/<article/g)||[]).length,signs.filter(s=>s.category===category).length);
node('#signals-category').onchange({target:{value:'Todas'}});node('#signals-start').onclick();assert(context.window.hasActiveSignalPractice());assert(html.includes('Señal de tránsito para identificar'));context.window.leaveSignals();assert(!context.window.hasActiveSignalPractice());
assert(!stored,'Browsing and unconfirmed practice do not create attempts');
console.log('PASS: complete 56-sign catalogue, assets, answer mapping, accent-insensitive search, empty result, category filters and independent practice lifecycle.');
