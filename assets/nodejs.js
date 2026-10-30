(function() {
 'use strict';
 if(document.body.dataset.readerMode!=='paged') return;
 const core=window.NodeLessonCore;
 const $=(s,el=document)=>el.querySelector(s);
 const all=(s,el=document)=>[...el.querySelectorAll(s)];
 function el(tag,text,cls) {const n=document.createElement(tag); if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
 // Render inline code as text nodes, never as executable HTML.
 function inline(node,text) {node.replaceChildren();String(text).split(/(`[^`]+`)/g).forEach(part=>node.append(part.startsWith('`')&&part.endsWith('`')?el('code',part.slice(1,-1)):document.createTextNode(part)));return node;}
 function button(text,fn,parent) {const b=el('button',text,'btn');b.type='button';b.addEventListener('click',fn);parent?.append(b);return b;}
 function controls(parent) {const n=el('div',undefined,'node-controls');parent.append(n);return n;}
 function output(parent,attribute) {const n=el('output',undefined,'node-output');n.setAttribute('aria-live','polite');if(attribute)n.setAttribute(attribute,'');parent.append(n);return n;}
 function input(parent,label,value,attribute) {const l=el('label',label),i=el('input');i.value=value;if(attribute)i.setAttribute(attribute,'');l.append(i);parent.append(l);return i;}
 function select(parent,label,options) {const l=el('label',label),s=el('select');for(const [value,name] of options){const o=el('option',name);o.value=value;s.append(o);}l.append(s);parent.append(l);return s;}
 function diagram(parent,names) {const f=el('figure'),d=el('div',undefined,'node-diagram');names.forEach((name,i)=>{if(i)d.append(el('i','→'));d.append(el('span',name));});f.append(d,el('figcaption','แผนภาพจำลอง วาดใหม่สำหรับบทเรียนนี้'));parent.append(f);return all('span',d);}
 function table(parent,pairs) {const t=el('table',undefined,'node-table');for(const [key,value]of pairs){const r=el('tr');const th=el('th',key);th.scope='row';r.append(th,el('td',value));t.append(r);}parent.replaceChildren(t);}
 function stepper(parent,steps,render) {let index=0;const c=controls(parent);const prev=button('← ขั้นก่อน',()=>{index--;show();},c),next=button('ขั้นต่อไป →',()=>{index++;show();},c);button('เริ่มใหม่',()=>{index=0;show();},c);const status=el('p',undefined,'node-muted');status.setAttribute('aria-live','polite');parent.append(status);function show(){prev.disabled=index===0;next.disabled=index===steps.length-1;status.textContent=`ขั้น ${index+1} / ${steps.length}`;render(steps[index],index);}show();return {reset(newSteps){steps=newSteps;index=0;show();}};}
 function requestResponse(root) {
  const mode=select(root,'ชนิด request',[['dynamic','Dynamic request'],['static','Static request']]);
  const f=el('figure'),d=el('div',undefined,'node-diagram');
  const nodes=['Browser','Web Server','Web App','Database','Static files'].map(name=>el('span',name));
  d.append(nodes[0],el('i','⇄'),nodes[1]);
  const dynamic=el('div',undefined,'node-diagram');dynamic.append(el('small','Dynamic →'),nodes[2],el('i','⇄'),nodes[3]);
  const stat=el('div',undefined,'node-diagram');stat.append(el('small','Static →'),nodes[4]);
  f.append(d,dynamic,stat,el('figcaption','Web Server เลือกเส้นทาง static หรือ dynamic แล้วตอบกลับ Browser'));root.append(f);
  const o=output(root);
  const descriptions={1:'Browser ส่ง HTTP GET request → Web Server',2:'Web Server ตรวจ resource: static ส่งไฟล์ที่มีอยู่; dynamic ให้ Web App สร้างคำตอบ',3:'Web App อ่านข้อมูลจาก Database',4:'Web App รวมข้อมูลกับ HTML template',5:'Web Server ส่ง HTTP response กลับไป Browser',6:'Browser ได้รับและแสดง HTML'};
  const st=stepper(root,core.requestSteps(mode.value),n=>{o.textContent=`ขั้น ${n}: ${descriptions[n]}`;const active={1:[0,1],2:mode.value==='static'?[1,4]:[1,2],3:[2,3],4:[2],5:[1,0],6:[0]}[n];nodes.forEach((node,i)=>node.classList.toggle('is-active',active.includes(i)));});
  mode.addEventListener('change',()=>st.reset(core.requestSteps(mode.value)));
 }
 function dragMatch(root) {
  root.append(el('p','ประกอบ URL: ลากชิ้นส่วน หรือกดเลือกแล้วกดช่องวาง ใช้คีย์บอร์ดได้ทั้งสองวิธี'));
  const choices=controls(root),targets=controls(root),result=output(root);let selected=null;const placed=[null,null,null];
  const values=['http://','localhost',':8081'];
  values.forEach(value=>{const b=button(value,()=>{selected=value;all('button',choices).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));},choices);b.draggable=true;b.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',value);});});
  ['protocol','host','port'].forEach((name,i)=>{const b=button(name+' · วางที่นี่',()=>put(selected,i),targets);b.addEventListener('dragover',e=>e.preventDefault());b.addEventListener('drop',e=>{e.preventDefault();put(e.dataTransfer.getData('text/plain'),i);});});
  function put(value,i){if(!values.includes(value))return;placed[i]=value;targets.children[i].textContent=['protocol','host','port'][i]+' · '+value;result.textContent=placed.every(Boolean)?(placed.every((x,j)=>x===values[j])?'✓ http://localhost:8081 — protocol / host / port ถูกต้อง':'ยังไม่ตรง ลองตรวจ protocol, host และ port อีกครั้ง'):'วางชิ้นส่วนให้ครบ 3 ส่วน';}
  button('เริ่มใหม่',()=>{placed.fill(null);selected=null;[...targets.children].forEach((b,i)=>b.textContent=['protocol','host','port'][i]+' · วางที่นี่');all('button',choices).forEach(b=>b.setAttribute('aria-pressed','false'));result.textContent='';},root);
 }
 function eventLoop(root) {
  root.append(el('p','ส่งงานหลายงาน แล้วกดเดินเวลา เปรียบเทียบจำนวนที่รอรับเรื่อง: I/O รอภายนอกได้ แต่ Computation ที่รันบน main thread ยังบล็อกแม้เลือก Non-blocking'));
  const mode=select(root,'โหมด',[['nonblocking','Non-blocking I/O'],['blocking','Blocking I/O']]);
  const kind=select(root,'ชนิดงาน',[['io','I/O — สุ่ม File System / Database'],['cpu','Computation — JS บน main thread']]);
  kind.options[0].textContent='I/O — File System / Database';
  const duration=input(root,'เวลาของ request ใหม่ (1–4 ขั้น)','3','data-task-duration');duration.type='number';duration.min='1';duration.max='4';duration.step='1';
  const nodes=diagram(root,['Requests','Event loop / JS','I/O: OS / worker pool','Response']);
  const lanes=el('div',undefined,'il-runway');root.append(lanes);
  let tasks=[],tick=0,number=0;const c=controls(root),o=output(root);
  const cpuBusy=()=>tasks.some(t=>t.kind==='cpu'&&t.state==='active');
  function render(){
   const waiting=tasks.filter(t=>t.state==='waiting').length;
   lanes.replaceChildren();
   for(const [name,states] of [['รอรับเรื่อง',['waiting']],['กำลังทำงาน',['active']],['รอ callback',['ready']],['ตอบแล้ว',['done']]]){
    const lane=el('div',undefined,'il-lane');lane.append(el('h4',name));const items=tasks.filter(t=>states.includes(t.state));
    if(!items.length)lane.append(el('small','ยังไม่มีงาน'));
    for(const t of items){const job=el('div','Request '+t.id,'il-job');job.append(el('small',(t.kind==='cpu'?'CPU · บล็อก JS':'I/O')+(t.state==='active'?' · เหลือ '+t.left:'')));lane.append(job);}lanes.append(lane);
   }
   o.textContent=`เวลา ${tick} · request ที่รอคิว: ${waiting}\n`+tasks.map(t=>{
    const state=t.state==='done'?'ตอบกลับแล้ว':t.state==='waiting'?'รอเธรดรับเรื่อง':t.state==='ready'?'I/O เสร็จ รอ callback บน JS thread':`${t.kind==='cpu'?'กำลังคำนวณ JS (บล็อกเธรด)':'กำลังทำ I/O'} (เหลือ ${t.left})`;
    return `Request ${t.id} → ${t.unit} · ${state}`;
   }).join('\n');
   nodes.forEach((n,i)=>n.classList.toggle('is-active',i===(cpuBusy()?1:2)&&tasks.some(t=>t.state==='active')));
  }
  function start(){
   if(cpuBusy())return;
   for(const t of tasks){
    if(t.state!=='waiting')continue;
    if(mode.value==='blocking'&&tasks.some(x=>x.state==='active'))break;
    t.state='active';if(t.kind==='cpu')break;
   }
  }
  button('ส่ง request ใหม่',()=>{
   if(tasks.length>=8){o.textContent+='\nครบ 8 งานแล้ว กดเริ่มใหม่เพื่อทดลองรอบใหม่';return;}
   if(!duration.value||!duration.checkValidity()){o.textContent='กำหนดเวลาเป็นจำนวนเต็ม 1–4 ขั้นก่อนส่ง request';return;}
   number++;tasks.push({id:number,kind:kind.value,unit:kind.value==='cpu'?'Computation (main thread)':['File System','Database'][(number-1)%2],left:Number(duration.value),state:'waiting'});start();render();
  },c);
  button('เดินเวลา 1 ขั้น',()=>{
   tick++;
   for(const t of tasks)if(t.state==='active'&&--t.left<=0)t.state='ready';
   if(!cpuBusy())for(const t of tasks)if(t.state==='ready')t.state='done';
   start();render();
  },c);
  function reset(){tasks=[];tick=0;number=0;render();}
  button('เริ่มใหม่',reset,c);mode.addEventListener('change',reset);render();
 }
 function hello(root) {const o=output(root);stepper(root,[['ติดตั้ง LTS','ติดตั้ง Node.js รุ่น LTS จาก nodejs.org'],['ตรวจเวอร์ชัน','$ node --version\nv<เวอร์ชันที่ติดตั้ง>'],['สร้าง helloworld.js','console.log("Hello World!!");\nconsole.log("In the command line");'],['รันโปรแกรม','$ node helloworld.js\nHello World!!\nIn the command line']],s=>o.textContent=s[0]+'\n\n'+s[1]);}
 function modules(root) {
  root.append(el('p','แก้ string หรือชื่อ export ในแต่ละไฟล์ แล้วรัน greet.js ตัวจำลองรองรับเฉพาะ syntax ของตัวอย่างนี้'));
  const files={'hello.js':'function sayHello(){ console.log("Hello"); }\nmodule.exports.sayHi = sayHello;','msg.js':'module.exports = "Hello World!";','ictgreet.js':'let message = "Hello ICT";\nmodule.exports.greetICT = message;','greet.js':'const eng = require("./hello");\nconst ictgreet = require("./ictgreet");\nconst msg = require("./msg");\neng.sayHi();\nconsole.log(`${msg}`);\nconsole.log(`${ictgreet.greetICT}`);'};
  const c=controls(root),editor=el('textarea');editor.setAttribute('aria-label','โค้ดไฟล์ hello.js');editor.spellcheck=false;let current='hello.js';editor.value=files[current];root.append(editor);
  function choose(name){files[current]=editor.value;current=name;editor.value=files[name];editor.setAttribute('aria-label','โค้ดไฟล์ '+name);all('button',c).forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===name)));}
  for(const name of Object.keys(files))button(name,()=>choose(name),c);
  c.children[0].setAttribute('aria-pressed','true');const run=controls(root),o=output(root);
  button('Run greet.js',()=>{files[current]=editor.value;try{o.textContent=core.runModules(files).join('\n');}catch(e){o.textContent=e.message;}},run);
 }
 function pathParser(root) {
  const i=input(root,'พิมพ์ path ของไฟล์','/Users/jidapa.kra/Documents/demo/path.js','data-path-input');const strip=el('div',undefined,'node-highlight');root.append(strip);const o=el('div');o.setAttribute('data-path-output','');o.setAttribute('aria-live','polite');root.append(o);
  const meanings={root:'ราก',dir:'โฟลเดอร์',base:'ชื่อพร้อมนามสกุล',name:'ชื่อไม่รวมนามสกุล',ext:'นามสกุล'};
  function render(){const parsed=core.parsePath(i.value);table(o,Object.entries(parsed));strip.replaceChildren();for(const [key,value]of Object.entries(parsed)){const span=el('span',value||'∅');span.append(el('small',key+' · '+meanings[key]));strip.append(span);}}
  i.addEventListener('input',render);render();
  root.append(el('p','ลองจับคู่ field กับความหมาย'));const s=select(root,'field',Object.keys(meanings).map(k=>[k,k])),a=select(root,'ความหมาย',Object.entries(meanings).reverse().map(([k,v])=>[k,v]));const feedback=output(root);button('ตรวจการจับคู่',()=>feedback.textContent=s.value===a.value?'✓ ถูกต้อง':`ลองอีกครั้ง: ${s.value} คือ ${meanings[s.value]}`,root);
 }
 function urlExplorer(root) {
  const i=input(root,'พิมพ์ URL','https://www.covid19.com:8080/p/a/t/h?country=TH&time=now','data-url-input');const strip=el('div',undefined,'node-highlight');root.append(strip);const o=el('div');o.setAttribute('data-url-output','');o.setAttribute('aria-live','polite');root.append(o);
  function render(){try{const u=new URL(i.value);table(o,['href','protocol','username','password','hostname','host','port','pathname','search','hash','origin'].map(k=>[k,u[k]||'∅']).concat([...u.searchParams].map(([k,v])=>['query: '+k,v])));strip.replaceChildren();for(const k of ['protocol','host','pathname','search','hash']){if(!u[k])continue;const s=el('span',u[k]);s.append(el('small',k));strip.append(s);}}catch{strip.replaceChildren();o.textContent='URL ไม่ถูกต้อง ลองใช้ https://example.com:8080/a?time=now';}}
  i.addEventListener('input',render);render();
 }
 function asyncOrder(root) {
  const mode=select(root,'รูปแบบการอ่าน',[['parallel','Async parallel'],['sync','Sync'],['nested','Nested callback']]);
  const c=controls(root),times=[300,100,200].map((value,i)=>{const n=input(c,'README'+(i+1)+' เวลา (ms)',String(value));n.type='number';n.min='1';n.max='1000';n.step='1';return n;});
  const chart=el('figure');root.append(chart);const o=output(root);
  button('รันโปรแกรม',()=>{
   if(times.some(n=>!n.value||!n.checkValidity())){chart.replaceChildren();o.textContent='ใส่เวลาจำนวนเต็ม 1–1000 ms ให้ครบทุกไฟล์';return;}
   const timeline=core.asyncTimeline(times.map(n=>Number(n.value)),mode.value),max=Math.max(...timeline.map(t=>t.end));chart.replaceChildren();
   for(const t of [...timeline].sort((a,b)=>a.id-b.id)){const row=el('div',undefined,'node-timeline-row'),track=el('div',undefined,'node-timeline-track'),bar=el('span',undefined,'node-timeline-bar');bar.style.left=t.start/max*100+'%';bar.style.width=t.duration/max*100+'%';track.append(bar);row.append(el('span','README'+t.id),track);chart.append(row);}
   chart.append(el('figcaption','เวลาไปทางขวา · 0 ถึง '+max+' ms (จำลอง; ไม่รวม overhead)'));
   o.textContent=timeline.map(t=>`${t.start}–${t.end} ms → อ่าน README${t.id}; console.log เมื่อ ${t.end} ms`).join('\n')+'\n'+(mode.value==='sync'?'Sync: เธรดถูกบล็อกขณะรอแต่ละไฟล์':mode.value==='nested'?'Nested callback: เริ่มไฟล์ถัดไปเมื่อไฟล์ก่อนจบ; ไม่บล็อกระหว่างรอ แต่โค้ดซ้อน':'Parallel: เริ่มพร้อมกัน; งานที่เสร็จก่อนแสดงก่อน เวลาที่เท่ากันไม่ได้รับประกันลำดับ callback จริง');
  },root);
  button('คืนเวลาเริ่มต้น',()=>{times.forEach((n,i)=>n.value=String([300,100,200][i]));chart.replaceChildren();o.textContent='คืนเวลา 300, 100, 200 ms แล้ว กดรันเพื่อเปรียบเทียบอีกครั้ง';},root);
  function invalidate(){chart.replaceChildren();o.textContent='ค่าตั้งเปลี่ยนแล้ว ลองคาดการณ์ลำดับแล้วกดรันโปรแกรม';}
  mode.addEventListener('change',invalidate);times.forEach(n=>n.addEventListener('input',invalidate));
 }
 function serverBuilder(root) {
  root.append(el('p','เรียงขั้นตอนด้วยปุ่มขึ้น/ลง หรือ drag แล้วกด Run ขั้นตอบ response อยู่ภายใน callback ของ createServer และจะทำงานหลัง listen เมื่อมี request'));
  const correct=['require("http")','createServer((req, res) => {','res.statusCode = 200;','res.setHeader("Content-Type", "text/plain");','res.write("Hello World!");','res.end(); // ปิด callback ด้วย });','myServer.listen(8081);'];
  let order=[2,0,4,1,6,5,3],dragged=null;const list=el('ol',undefined,'node-sort');root.append(list);const o=output(root);
  function move(from,to){if(to<0||to>=order.length)return;const [v]=order.splice(from,1);order.splice(to,0,v);render();}
  function render(){list.replaceChildren();order.forEach((id,index)=>{const li=el('li');li.draggable=true;li.append(el('code',correct[id]));const up=button('↑',()=>{move(index,index-1);list.children[index-1]?.querySelector('button')?.focus();},li),down=button('↓',()=>{move(index,index+1);list.children[index+1]?.querySelector('button')?.focus();},li);up.setAttribute('aria-label','เลื่อนขั้น '+(index+1)+' ขึ้น');down.setAttribute('aria-label','เลื่อนขั้น '+(index+1)+' ลง');up.disabled=index===0;down.disabled=index===order.length-1;li.addEventListener('dragstart',()=>dragged=index);li.addEventListener('dragover',e=>e.preventDefault());li.addEventListener('drop',e=>{e.preventDefault();if(dragged!==null)move(dragged,index);dragged=null;});list.append(li);});}
  render();button('Run',()=>o.textContent=order.every((v,i)=>v===i)?'✓ Terminal: Listening on the port 8081\nReq: /\nReq: /favicon.ico (browser อาจขอเพิ่ม)\nBrowser: Hello World!\nลำดับรันจริง: require → createServer → listen → เมื่อมี request จึงรัน callback':'ยังไม่ตรง ลองเรียง require → createServer → status → header → write → end → listen',root);
 }
 function routeTester(root) {
  const i=input(root,'path ที่ส่งเป็น req.url','/','data-route-input'),c=controls(root),nodes=diagram(root,['/ ?','/shabu ?','/bbq ?','404']);
  for(const path of ['/','/shabu','/bbq','/SOMEPATH'])button(path,()=>{i.value=path;run();},c);
  const runButton=button('ส่ง request',run,c);runButton.setAttribute('data-route-run','');const o=output(root,'data-route-output'),log=output(root);let logs=[];
  function run(){const path=i.value,r=core.route(path);logs.push('Req: '+path);logs=logs.slice(-6);log.textContent='Terminal\n'+logs.join('\n');o.textContent=`Browser · ${r.status} · ${r.type}\n${r.body}`;const index={home:0,shabu:1,bbq:2,missing:3}[r.branch];nodes.forEach((n,j)=>n.classList.toggle('is-active',j<=index));}run();
 }
 const widgets={RequestResponseSim:requestResponse,DragMatch:dragMatch,EventLoopSim:eventLoop,Stepper:hello,LiveTyper:modules,PathParser:pathParser,UrlExplorer:urlExplorer,AsyncOrderSim:asyncOrder,CodeTrace:serverBuilder,RouteTester:routeTester};
 all('[data-node-lab]').forEach(root=>{root.replaceChildren();widgets[root.dataset.nodeLab]?.(root);});
 // Reusable, one-question-at-a-time Quiz. Recall questions are explicitly self-assessed.
 all('[data-node-quiz]').forEach(root=>{
  const questions=JSON.parse($('script',root).textContent),id=root.dataset.quizKey,isFinal=root.hasAttribute('data-final-quiz');let index=0,answers=[],drafts=[];
  const printable=$('.node-quiz-fallback',root).cloneNode(true);printable.className='node-print-quiz';root.after(printable);
  const key='study-garden:itds241:node-quiz:'+id;
  function save(){try{localStorage.setItem(key,JSON.stringify({index,answers,drafts}));}catch{$('#storage-notice').hidden=false;}}
  try{
   const data=JSON.parse(localStorage.getItem(key));
   if(data&&Number.isInteger(data.index)&&data.index>=0&&data.index<=questions.length&&Array.isArray(data.answers)){
    for(const [i,q] of questions.entries()){
     const a=data.answers[i];
     if(!a||typeof a.correct!=='boolean')break;
     if(q.options.length){if(!Number.isInteger(a.value)||a.value<0||a.value>=q.options.length)break;answers.push({value:a.value,correct:a.value===q.answer});}
     else {if(a.value!==null)break;answers.push({value:null,correct:a.correct});}
    }
    index=Math.min(data.index,answers.length);
    if(Array.isArray(data.drafts))drafts=questions.map((q,i)=>({text:typeof data.drafts[i]?.text==='string'?data.drafts[i].text:'',revealed:data.drafts[i]?.revealed===true}));
   }
  }catch{/* storage fallback */}
  function render(){
   root.replaceChildren();
   if(index===questions.length){const score=answers.filter(a=>a?.correct).length;root.append(el('h3',`${score} / ${questions.length} คะแนน`),el('p',isFinal?'คะแนนล่าสุดและคะแนนสูงสุดแสดงในหน้ารายวิชา':'ข้อเขียนเป็นคะแนนประเมินตนเองหลังดูเฉลย แยกจาก Quiz ท้ายบท','node-muted'));button('เริ่มใหม่',()=>{index=0;answers=[];drafts=[];save();render();},root);return;}
   const q=questions[index],status=el('p',`ข้อ ${index+1} / ${questions.length} · ถูกแล้ว ${answers.slice(0,index).filter(a=>a?.correct).length}`,'node-muted'),fieldset=el('fieldset'),legend=el('legend',q.q),feedback=el('div',undefined,'node-feedback');feedback.setAttribute('role','status');fieldset.append(legend);root.append(status,fieldset,feedback);
   inline(legend,q.q);
   const c=controls(root);const next=button('ข้อต่อไป →',()=>{index++;save();if(index===questions.length&&isFinal)storeFinal();render();root.scrollIntoView({block:'start',behavior:'instant'});root.tabIndex=-1;root.focus({preventScroll:true});},c);next.disabled=true;
   function showAnswer(correct,value){inline(feedback,(q.options.length?(correct?'✓ ถูกต้อง':'ลองทบทวนอีกครั้ง'):(correct?'✓ ประเมินตนเอง: ตอบได้':'ประเมินตนเอง: ต้องทบทวน'))+' — เฉลย: '+(q.options.length?q.options[q.answer]:q.answer)+(q.explanation?' · '+q.explanation:''));all('[data-quiz-option]',root).forEach((b,j)=>{b.disabled=true;b.classList.toggle('correct',j===q.answer);b.classList.toggle('wrong',j===value&&!correct);});next.disabled=false;}
   function choose(correct,value){if(answers[index])return;answers[index]={correct,value};save();showAnswer(correct,value);all('button',fieldset).forEach(b=>b.disabled=true);const text=$('textarea',fieldset);if(text)text.readOnly=true;next.focus();}
   if(q.options.length){const options=el('div',undefined,'node-options');q.options.forEach((option,j)=>{const b=button('',()=>choose(j===q.answer,j),options);inline(b,'ABCD'[j]+') '+option);b.setAttribute('data-quiz-option','');});fieldset.append(options);}
   else {
    const draft=drafts[index] ||= {text:'',revealed:false};
    const label=el('label','ลองตอบก่อนดูเฉลย'),text=el('textarea');text.rows=3;text.setAttribute('aria-label','คำตอบของคุณ');text.value=draft.text;text.readOnly=Boolean(answers[index]);text.addEventListener('input',()=>{draft.text=text.value;save();});label.append(text);fieldset.append(label);
    const reveal=button('ดูเฉลย',()=>{draft.revealed=true;save();render();$('fieldset .node-controls button',root)?.focus();},fieldset);
    if(draft.revealed||answers[index]){
     inline(feedback,'เฉลย: '+q.answer+(q.explanation?' · '+q.explanation:''));reveal.disabled=true;
     const self=controls(fieldset);button('ตอบได้',()=>choose(true,null),self);button('ต้องทบทวน',()=>choose(false,null),self);all('button',self).forEach(b=>b.disabled=Boolean(answers[index]));
    }
   }
   if(answers[index])showAnswer(answers[index].correct,answers[index].value);
  }
  function storeFinal(){window.StudyApp.recordQuizScore(answers.filter(a=>a?.correct).length);}
  render();
 });
})();
