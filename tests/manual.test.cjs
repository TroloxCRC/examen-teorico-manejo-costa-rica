const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
let persisted=JSON.stringify({vehicle:'automovil',attempts:2,correct:1,seen:['q001'],wrong:['q001'],history:[]});
const element={innerHTML:'',classList:{toggle(){}},focus(){},querySelector(){return element},append(){},remove(){},showModal(){},close(){}};
const ctx={console,URL,Date,Math,setInterval:()=>1,clearInterval(){},document:{querySelector:()=>element,querySelectorAll:()=>[],createElement:()=>element,body:element},window:{scrollTo(){},addEventListener(){}},localStorage:{getItem:()=>persisted,setItem:(key,value)=>persisted=value}};
vm.createContext(ctx);
for(const file of ['questions.js','manual-questions.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);
vm.runInContext(`
function demand(test,message){if(!test)throw Error(message)}
demand(MANUAL_BANK.length===93,'93 manual questions');
demand(new Set(BANK.map(q=>q.id)).size===BANK.length,'unique IDs across banks');
for(let topic=1;topic<=31;topic++)demand(MANUAL_BANK.filter(q=>q.topic===topic).length===3,'three per topic '+topic);
for(const q of MANUAL_BANK){
 demand(q.options.length===3&&new Set(q.options).size===3,'three distinct options');
 demand(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3,'valid answer');
 demand(Number.isInteger(q.manualPage)&&q.manualPage>=1&&q.manualPage<=116,'valid PDF page');
 demand(q.question&&q.explanation&&q.topicTitle&&q.source,'complete reference');
 demand(!('evidence' in q),'internal evidence not published');
 demand(reference(q).includes('tercero')&&!reference(q).includes('fuente oficial'),'source classification');
}
demand(state.attempts===2&&state.wrong.includes('q001'),'existing progress preserved');
for(let n=0;n<100;n++){
 state.vehicle='automovil';start('exam');
 demand(session.qs.length===40,'40 questions');
 demand(new Set(session.qs.map(q=>q.id)).size===40,'no duplicates');
 demand(new Set(session.qs.map(q=>q.topic)).size===31,'all 31 topics in exam');
 for(const q of session.qs){const original=MANUAL_BANK.find(x=>x.id===q.id);demand(q.options[q.answer]===original.options[original.answer],'shuffle preserves answer');}
 home();
}
category=MANUAL_BANK[0].category;start('practice');
demand(session.qs.length===3&&session.qs.every(q=>q.category===category),'practice topic filter');
session.answers=session.qs.map(q=>q.answer);finish();
demand(state.history.at(-1).score===100,'correct score');
category='Todos';start('exam');finish(true);
demand(state.history.at(-1).score===0,'timeout and unanswered score');
start('review');const solved=session.qs.map(q=>q.id);session.answers=session.qs.map(q=>q.answer);finish();
demand(solved.every(id=>!state.wrong.includes(id)),'review clears solved errors');
state.vehicle='moto';start('exam');
demand(session.qs.length===40&&session.qs.every(q=>!q.manualPage),'motorcycle stays separate');
home();sources();demand(document.querySelector('#app').innerHTML.includes('no una edición oficial autenticada'),'provenance visible');
`,ctx);
assert.equal(JSON.parse(persisted).history.length,3);
console.log('PASS: manual coverage, balanced exam sampling (100 runs), answer shuffling, citations, topic practice, scoring, timeout, error review, existing progress, and motorcycle separation.');
