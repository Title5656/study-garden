/* Adapted from user-supplied Html.html; native Study Garden navigation/assessment are used. */

const $=id=>document.getElementById(id);
const NS='http://www.w3.org/2000/svg';
const reducedMotion=matchMedia("(prefers-reduced-motion: reduce)");
const sleep=ms=>new Promise(r=>setTimeout(r,reducedMotion.matches?0:ms));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* ===== DRAG GAME ===== */
function dragGame(id,bins,items){const el=$(id);let sel=null,ok=0,miss=0;
 const start=()=>{ok=0;miss=0;sel=null;
  el.innerHTML=`<div class="pool"></div><div class="bins" style="grid-template-columns:repeat(${bins.length},1fr)">${bins.map(b=>`<div class="bin" role="button" tabindex="0" aria-label="วางการ์ดใน ${b}" data-b="${b}"><div class="binh">${b}</div><div class="bini"></div></div>`).join('')}</div><div class="gmsg" role="status">👆 ลากการ์ดไปวางในกล่องที่ถูก (มือถือ: แตะการ์ด แล้วแตะกล่อง)</div>`;
  const pool=el.querySelector('.pool'),msg=el.querySelector('.gmsg');
  shuffle(items).forEach(it=>{const c=document.createElement('button');c.type='button';c.className='chip';c.textContent=it.t;c.draggable=true;c._it=it;
   c.addEventListener('dragstart',e=>{sel=c;e.dataTransfer.setData('text/plain','x')});
   c.addEventListener('click',e=>{e.stopPropagation();if(c.classList.contains('good'))return;el.querySelectorAll('.chip').forEach(x=>x.classList.remove('sel'));sel=c;c.classList.add('sel')});
   pool.appendChild(c)});
  el.querySelectorAll('.bin').forEach(b=>{b.addEventListener('dragover',e=>{e.preventDefault();b.classList.add('over')});
   b.addEventListener('dragleave',()=>b.classList.remove('over'));
   b.addEventListener('drop',e=>{e.preventDefault();b.classList.remove('over');place(b)});
   b.addEventListener('click',()=>place(b));b.addEventListener('keydown',e=>{if(e.target===b&&(e.key==='Enter'||e.key===' ')){e.preventDefault();place(b)}})});
  function place(b){const c=sel;if(!c||c.classList.contains('good'))return;sel=null;c.classList.remove('sel');
   if(c._it.a===b.dataset.b){c.classList.add('good');c.draggable=false;c.setAttribute('aria-disabled','true');b.querySelector('.bini').appendChild(c);ok++;msg.innerHTML='✅ ถูกต้อง! '+(c._it.e||'');msg.className='gmsg okc'}
   else{miss++;c.classList.add('shake');setTimeout(()=>c.classList.remove('shake'),450);msg.innerHTML=`❌ "${esc(c._it.t)}" ไม่ใช่ ${b.dataset.b}`+(c._it.e?' · 💡 '+c._it.e:'');msg.className='gmsg badc'}
   if(ok===items.length){msg.innerHTML=`🎉 ครบทุกใบ! ผิดไป ${miss} ครั้ง ${miss===0?'· เพอร์เฟกต์ 🏆':''} <button class="btn sm">เล่นใหม่</button>`;msg.className='gmsg okc';msg.querySelector('button').onclick=start}}};
 start()}
dragGame('g_qa',['QA','QC'],[
 {t:'กำหนดให้ทุกคนทำ code review ก่อน merge',a:'QA',e:'ปรับปรุงกระบวนการ'},{t:'รัน test case กับเวอร์ชันล่าสุดก่อนปล่อย',a:'QC',e:'ตรวจ product หา fault'},
 {t:'อบรม coding standard ให้พนักงานใหม่',a:'QA',e:'ป้องกันที่ต้นทาง'},{t:'Tester พบว่าปุ่ม Login ไม่ทำงาน',a:'QC',e:'ตรวจจับ fault'},
 {t:'วัดและปรับปรุงขั้นตอนพัฒนาทั้งองค์กร',a:'QA',e:'measure & improve process'},{t:'ตรวจหน้าจอที่ทำเสร็จว่าตรง spec',a:'QC',e:'verify product'}]);
dragGame('g_sd',['Static','Dynamic'],[
 {t:'Unused variables',a:'Static'},{t:'Memory leak detection',a:'Dynamic'},{t:'Unreachable code',a:'Static'},{t:'Profiling',a:'Dynamic'},
 {t:'Code smells',a:'Static'},{t:'Code coverage analysis',a:'Dynamic',e:'ต้องรันถึงรู้ว่าบรรทัดไหนถูกรัน'},{t:'Security vulnerabilities',a:'Static'},
 {t:'Performance monitoring',a:'Dynamic'},{t:'Syntax and type errors',a:'Static'},{t:'Runtime error detection',a:'Dynamic'},
 {t:'Potential null-pointer errors',a:'Static',e:'"potential" = คาดการณ์จากโค้ดโดยไม่รัน'},{t:'Violations of coding standards',a:'Static'},{t:'Debugging',a:'Dynamic',e:'อยู่ในรายการสไลด์ 9'}]);
dragGame('g_vv',['Verification','Validation'],[
 {t:'"Are we building the software right?"',a:'Verification'},{t:'"Are we building the right software?"',a:'Validation'},
 {t:'ตรวจ design document เทียบ requirements ของ phase ก่อน',a:'Verification'},{t:'ผู้ใช้จริงลองใช้ตอนจบโปรเจกต์',a:'Validation'},
 {t:'ตรวจว่าโค้ดทำตาม detailed design',a:'Verification'},{t:'Acceptance testing กับลูกค้า',a:'Validation'}]);
dragGame('g_bw',['Black-box','White-box'],[
 {t:'Equivalence Class Partitioning',a:'Black-box'},{t:'Path analysis',a:'White-box'},{t:'Boundary Value Analysis',a:'Black-box'},{t:'Branch coverage',a:'White-box'},
 {t:'Behavioral / Functional testing',a:'Black-box'},{t:'Glass-box / Structural testing',a:'White-box'},{t:'สร้าง test จาก specification',a:'Black-box'},
 {t:'ใช้ control structure สร้าง test',a:'White-box'},{t:'หา initialization / termination errors',a:'Black-box'},{t:'Statement coverage',a:'White-box'}]);
dragGame('g_it',['Inspection','Testing'],[
 {t:'ใช้กับ intermediate artifacts ได้',a:'Inspection'},{t:'ใช้ได้กับโค้ดเท่านั้น',a:'Testing'},{t:'Catches defects early',a:'Inspection'},
 {t:'Catches defects late',a:'Testing'},{t:'ช่วยกระจายความรู้และ best practices',a:'Inspection'},{t:'Necessary to gauge quality',a:'Testing'},
 {t:'หาเจอถูก แต่แก้แพง',a:'Testing'},{t:'Cost-effective',a:'Inspection'}]);

/* ===== FACTORY ===== */
let factoryRunning=false;
function toggleFactory(){factoryRunning=!factoryRunning;$('factory-toggle').textContent=factoryRunning?'Ⅱ หยุดโรงงาน':'▶ เริ่มโรงงาน';$('factory-toggle').setAttribute('aria-pressed',String(factoryRunning));}
const F={items:[],last:0,st:{made:0,bad:0,caught:0,esc:0}};
function qaUpd(){const q=+$('qaLv').value;$('qaV').textContent=q;$('qaShield').style.opacity=.15+.85*q/100;$('qcStation').style.opacity=$('qcOn').checked?1:.15}
function fReset(){F.items.forEach(it=>it.g.remove());F.items=[];F.last=0;$('fMsg').textContent='ล้างสถิติแล้ว ลองปรับ QA และ QC เพื่อเปรียบเทียบ';F.st={made:0,bad:0,caught:0,esc:0};fStats()}
function fStats(){const s=F.st;$('sMade').textContent=s.made;$('sBad').textContent=s.bad;$('sCaught').textContent=s.caught;$('sEsc').textContent=s.esc;
 if(s.made>5)$('fMsg').innerHTML=`ของเสียเกิด ${(s.bad/s.made*100).toFixed(0)}% ของที่ผลิต · หลุดถึงลูกค้า ${(s.esc/s.made*100).toFixed(0)}% `+(!$('qcOn').checked?'😱 ไม่มี QC ของเสียหลุดหมด!':(+$('qaLv').value<50?'💡 ลองเพิ่ม QA ดู ของเสียจะเกิดน้อยลงตั้งแต่ต้น':'👍 QA ดี + QC ทำงาน = คุณภาพสูง'))}
function fSpawn(){const q=+$('qaLv').value,bad=Math.random()<(.55-.5*q/100);const g=document.createElementNS(NS,'g');
 g.innerHTML=`<rect x="-12" y="-12" width="24" height="24" rx="5" fill="${bad?'#ef4444':'#22c55e'}"/><text y="5" text-anchor="middle" font-size="14" fill="#fff" font-weight="800">${bad?'✗':'✓'}</text>`;
 $('fItems').appendChild(g);F.items.push({g,x:205,y:121,bad,chk:false,drop:false});F.st.made++;if(bad)F.st.bad++}
function fLoop(t){if(factoryRunning&&!document.hidden&&!$('sec-qa').hidden&&$('fItems').getBoundingClientRect().bottom>0&&$('sec-qa').getBoundingClientRect().top<innerHeight){if(t-F.last>900){F.last=t;fSpawn()}
 F.items.forEach(it=>{if(it.drop){it.y+=3;if(it.y>205)it.dead=true}else{it.x+=1.8;
  if(!it.chk&&it.x>=480){it.chk=true;if(it.bad&&$('qcOn').checked&&Math.random()<.9){it.drop=true;F.st.caught++;const f=$('qcFlash');f.setAttribute('opacity',.35);setTimeout(()=>f.setAttribute('opacity',0),200)}}
  if(it.x>=695){it.dead=true;if(it.bad)F.st.esc++}}
  it.g.setAttribute('transform',`translate(${it.x},${it.y})`);if(it.dead)it.g.remove()});
 F.items=F.items.filter(i=>!i.dead);fStats()}
 setTimeout(()=>fLoop(performance.now()),40)}
qaUpd();setTimeout(()=>fLoop(performance.now()),40);

/* ===== TOOLS ===== */
const TOOLS=[
 {ic:'📖',n:'Code Review',s:'สไลด์ 6',d:'Examine source code to identify defects <b>before execution</b> คืออ่านตรวจโค้ดก่อนรัน',l:['<b>Code inspection</b>: ตรวจอย่างเป็นระบบเทียบกับเกณฑ์ (เหมือนตรวจรถตามเช็กลิสต์)','<b>Peer review</b>: ให้นักพัฒนาอีกคนช่วยตรวจ','<b>Walkthrough</b>: เจ้าของโค้ดพาอธิบายทีละขั้น','<b>Static analysis</b>: ใช้เครื่องมืออัตโนมัติวิเคราะห์โดยไม่รัน'],a:'✍️ ให้เพื่อนพิสูจน์อักษรรายงานก่อนส่ง'},
 {ic:'🧪',n:'Testing',s:'สไลด์ 7',d:'<b>Execute</b> the software and observe whether its behavior matches expectations',l:['<b>Unit</b>: test individual functions or classes','<b>Integration</b>: test interactions between components','<b>System</b>: test the complete system','<b>Acceptance</b>: verify system meets user/business requirements','<b>Regression</b>: ensure new changes have not introduced new defects'],a:'🚗 ขับรถทดสอบจริง'},
 {ic:'🔬',n:'Static Analysis',s:'สไลด์ 8',d:'Detect potential problems <b>without running</b> the program',l:['Syntax and type errors','Unused variables','Unreachable code','Code smells (เขียนได้แต่ออกแบบไม่ดี ส่อแววปัญหา)','Security vulnerabilities','Potential null-pointer errors','Violations of coding standards'],a:'📝 ตัวตรวจคำผิดใน Word'},
 {ic:'🏃',n:'Dynamic Analysis',s:'สไลด์ 9',d:'Detect problems <b>while the program is running</b>',l:['Runtime error detection','Memory leak detection (จองหน่วยความจำแล้วไม่คืน)','Performance monitoring','Debugging','Code coverage analysis','Profiling (ส่วนไหนกินเวลา/ทรัพยากรมากสุด)'],a:'🏥 วัดคลื่นหัวใจขณะวิ่งบนลู่'},
 {ic:'🐞',n:'Debugging',s:'สไลด์ 10',d:'Locate and identify the <b>cause</b> of a failure <b>after</b> an error has been observed',l:['Identify Failure → Reproduce the problem → Locate the cause → Fix the defect → Test again','Breakpoints · Step-by-step execution · Variable inspection · Logging/tracing · Stack-trace analysis'],a:'🕵️ นักสืบ (ไปเล่นที่หน้า Debugging Detective)'},
 {ic:'📐',n:'Formal Methods',s:'สไลด์ 11',d:'Use <b>mathematical techniques</b> to demonstrate that software satisfies specified properties',l:['Formal specification','Model checking','Theorem proving','Formal verification'],a:'🧮 พิสูจน์ด้วยคณิตศาสตร์แทนการลองทีละกรณี',x:'นิยมใช้ในระบบที่พลาดไม่ได้ เช่น ระบบการบิน หรืออุปกรณ์การแพทย์ แม่นยำมากแต่แพงและยาก'}];
$('tools').innerHTML=TOOLS.map((t,i)=>`<button class="tool" data-i="${i}"><span class="ti">${t.ic}</span>${t.n}</button>`).join('');
function toolShow(i){const t=TOOLS[i];document.querySelectorAll('.testing-lab .tool').forEach(b=>b.classList.toggle('on',+b.dataset.i===i));
 $('toolInfo').innerHTML=`<h3>${t.ic} ${t.n} <span class="sl">${t.s}</span></h3><p>${t.d}</p><ul>${t.l.map(x=>`<li>${x}</li>`).join('')}</ul><p><b>Analogy:</b> ${t.a}</p>${t.x?`<div class="extra">${t.x}</div>`:''}`}
document.querySelectorAll('.testing-lab .tool').forEach(b=>b.onclick=()=>toolShow(+b.dataset.i));toolShow(0);

/* ===== DEBUG DETECTIVE ===== */
const DS5=['Identify Failure','Reproduce the problem','Locate the cause','Fix the defect','Test again'];let dK=0,trI=-1,dFixed=false,dRep=[];
function dbgFlow(){let s='';DS5.forEach((t,i)=>{const x=10+i*150,on=i===dK,done=i<dK;
 s+=`<g class="dstep" role="button" tabindex="0" onclick="dbgGo(${i})"><rect x="${x}" y="25" width="128" height="58" rx="12" fill="${on?'#4f46e5':done?'#16a34a':'var(--soft)'}" stroke="#4f46e5" stroke-width="2" style="transition:.3s"/>
 <text x="${x+64}" y="50" text-anchor="middle" font-size="12" font-weight="800" fill="${on||done?'#fff':'var(--text)'}">${i+1}. ${t.split(' ').slice(0,2).join(' ')}</text><text x="${x+64}" y="68" text-anchor="middle" font-size="12" fill="${on||done?'#fff':'var(--text)'}">${t.split(' ').slice(2).join(' ')}</text></g>`;
 if(i<4)s+=`<path d="M${x+130},54 L${x+146},54" stroke="#94a3b8" stroke-width="3"/><path d="M${x+142},48 L${x+149},54 L${x+142},60z" fill="#94a3b8"/>`});
 s+=`<text x="${10+dK*150+64}" y="18" text-anchor="middle" font-size="18">🕵️</text>`;$('dbgFlow').innerHTML=s}
const DCODE=['function total(prices) {','  let t = 0;','  for (let i = 0; i <= prices.length; i++)','    t += prices[i];','  return t;','}'];
const TR=[{l:1,i:'–',t:0,n:'เริ่มต้น t = 0'},{l:2,i:0,t:0,n:'i = 0 → 0 <= 3 จริง เข้า loop'},{l:3,i:0,t:100,n:'t = 0 + prices[0] (100) = 100'},{l:2,i:1,t:100,n:'i = 1 → 1 <= 3 จริง'},{l:3,i:1,t:150,n:'t = 100 + 50 = 150'},{l:2,i:2,t:150,n:'i = 2 → 2 <= 3 จริง'},{l:3,i:2,t:180,n:'t = 150 + 30 = 180 ✅ ยอดยังถูกต้องอยู่'},{l:2,i:3,t:180,n:'⚠️ i = 3 → 3 <= 3 ยังจริง! แต่ prices มีแค่ index 0–2',w:1},{l:3,i:3,t:'NaN',n:'💥 prices[3] = undefined → 180 + undefined = NaN · เจอต้นเหตุแล้ว: เงื่อนไข <= ทำให้วนเกินไป 1 รอบ',w:1},{l:4,i:4,t:'NaN',n:'return NaN → หน้าจอแสดง NaN'}];
const buggy=p=>{let t=0;for(let i=0;i<=p.length;i++)t+=p[i];return t},fixed=p=>p.reduce((a,b)=>a+b,0);
let dReplay=0,dReplaying=false;
function dbgGo(k){dReplay++;dReplaying=false;dK=k;dbgFlow();const S=$('dbgStage');
 if(k===0){S.innerHTML=`<h3>① Identify Failure: เห็นอาการผิด</h3><p>ร้านออนไลน์ของคุณ ลูกค้าใส่ของ 3 ชิ้นในตะกร้า: เสื้อ 100 · หมวก 50 · ถุงเท้า 30</p><div class="two"><div class="phone"><div class="scr" id="d0">🛒 ตะกร้า 3 ชิ้น<br><br><button class="btn sm" onclick="$('d0').innerHTML='ยอดรวม:<br><b style=font-size:1.5rem>'+buggy([100,50,30])+' บาท</b> 😱';$('d0').classList.add('bad');$('d0n').style.display='block'">ชำระเงิน</button></div></div>
 <div><p>กด "ชำระเงิน" ในจอโทรศัพท์</p><div id="d0n" style="display:none" class="fb bad">💥 นี่คือ <b>Failure</b> ที่ผู้ใช้เห็น (ควรได้ 180) ตอนนี้เรารู้ว่า "มีปัญหา" แต่ยังไม่รู้สาเหตุ<br><button class="btn" onclick="dbgGo(1)">ไปขั้นถัดไป ▶</button></div></div></div>`}
 if(k===1){dRep=[];S.innerHTML=`<h3>② Reproduce the problem: ทำให้ปัญหาเกิดซ้ำได้</h3><p>ลองตะกร้าแบบอื่นดูว่าผิดทุกครั้งไหม</p>
 <button class="btn ghost" onclick="dRepT([20,30])">🛒 [20, 30]</button><button class="btn ghost" onclick="dRepT([99])">🛒 [99]</button><button class="btn ghost" onclick="dRepT([5,5,5,5])">🛒 [5,5,5,5]</button><div id="d1"></div>`}
 if(k===2){trI=-1;S.innerHTML=`<h3>③ Locate the cause: ตั้ง breakpoint แล้วรันทีละบรรทัด</h3><p>prices = [100, 50, 30] · กด "Step" เพื่อรันทีละบรรทัด แล้วดูค่าตัวแปร (Variable inspection)</p>
 <div class="two"><pre class="code" id="dCode">${DCODE.map((l,i)=>`<span class="ln ${i===2?'bp':''}" id="dl${i}">${esc(l)}</span>`).join('')}</pre>
 <div><div class="grid" style="grid-template-columns:1fr 1fr"><div class="stat">i<b id="dvi">–</b></div><div class="stat">t<b id="dvt">–</b></div></div>
 <div class="arr">${[100,50,30].map((v,i)=>`<div class="cell" id="dp${i}"><small>[${i}]</small>${v}</div>`).join('')}<div class="cell skip" id="dp3" style="opacity:.25"><small>[3]</small>?</div></div><br>
 <button class="btn" onclick="dStep()">⏭ Step</button><button class="btn ghost sm" onclick="dbgGo(2)">↺</button></div></div><p class="qbox" id="dNote">🔴 แถบแดงซ้าย = breakpoint (จุดหยุดโปรแกรม)</p>`}
 if(k===3){S.innerHTML=`<h3>④ Fix the defect: เลือกวิธีแก้ที่ถูก</h3><pre class="code"><span class="ln">  for (let i = 0; i <b style="color:#f87171">&lt;=</b> prices.length; i++)</span></pre><br>
 <button class="opt" onclick="dFix(this,0)">A. เปลี่ยน <code>let t = 0</code> เป็น <code>let t = 1</code></button><button class="opt" onclick="dFix(this,1)">B. เปลี่ยน <code>&lt;=</code> เป็น <code>&lt;</code></button><button class="opt" onclick="dFix(this,2)">C. ลบบรรทัด <code>return t</code></button><div id="d3"></div>`}
 if(k===4){S.innerHTML=`<h3>⑤ Test again: เทสซ้ำว่าหายจริง</h3><p>รัน test case ทั้งหมดอีกรอบ (นี่คือแนวคิดของ <b>regression testing</b> ด้วย: แก้แล้วต้องไม่พังที่อื่น)</p><button class="btn" id="debug-retest" onclick="dRetest()">▶ รัน test ทั้งหมด</button><div class="testing-table" tabindex="0" role="region" aria-label="ผลการทดสอบซ้ำ"><table id="d4"></table></div>`}}
function dRepT(p){dRep.push(p);$('d1').innerHTML=dRep.map(x=>`<div class="fb bad" style="display:block">🛒 [${x}] → ได้ <b>${buggy(x)}</b> (ควรได้ ${fixed(x)})</div>`).join('')+(dRep.length>=2?`<div class="fb ok">✅ ผิดทุกครั้ง = <b>reproduce ได้</b> เราเรียกปัญหาให้เกิดซ้ำได้แล้ว พร้อมตามหาสาเหตุ<br><button class="btn" onclick="dbgGo(2)">ไปขั้นถัดไป ▶</button></div>`:'')}
function dStep(){if(trI>=TR.length-1)return;trI++;const s=TR[trI];document.querySelectorAll('.testing-lab #dCode .ln').forEach((x,i)=>{x.classList.toggle('hit',i===s.l&&!s.w);x.classList.toggle('warn',i===s.l&&!!s.w)});
 $('dvi').textContent=s.i;$('dvt').textContent=s.t;$('dvt').style.color=s.t==='NaN'?'var(--bad)':'';
 for(let i=0;i<4;i++){const c=$('dp'+i);if(c)c.classList.toggle('cur',s.l===3&&s.i===i)}if(s.i===3)$('dp3').style.opacity=1;
 $('dNote').innerHTML=s.n+(trI===TR.length-1?'<br><button class="btn" onclick="dbgGo(3)">ไปแก้บั๊ก ▶</button>':'')}
function dFix(b,k){document.querySelectorAll('.testing-lab #dbgStage .opt').forEach(o=>o.classList.remove('right','wrong'));
 if(k===1){b.classList.add('right');dFixed=true;$('d3').innerHTML='<div class="fb ok">✅ ถูกต้อง! index สุดท้ายคือ length−1 จึงต้องใช้ &lt;<br><button class="btn" onclick="dbgGo(4)">ไปเทสซ้ำ ▶</button></div>'}
 else{b.classList.add('wrong');$('d3').innerHTML='<div class="fb bad">❌ วิธีนี้ไม่ได้แก้ต้นเหตุ ต้นเหตุคือ loop วนเกินไป 1 รอบ</div>'}}
async function dRetest(){
 if(dReplaying||!$('d4'))return;
 const run=++dReplay,table=$('d4'),button=$('debug-retest');
 dReplaying=true;if(button)button.disabled=true;
 const T=[[100,50,30],[20,30],[99],[5,5,5,5],[]];
 table.innerHTML='<tr><th>Input</th><th>Expected</th><th>Actual</th><th></th></tr>';
 try {
  for(const p of T){await sleep(350);if(run!==dReplay||!table.isConnected)return;
   const a=dFixed?fixed(p):buggy(p),e=fixed(p);
   table.innerHTML+=`<tr><td>[${p}]</td><td>${e}</td><td>${a}</td><td>${a===e?'✅':'❌'}</td></tr>`;
  }
  table.innerHTML+=`<tr><td colspan="4"><b>${dFixed?'🎉 ผ่านทุกข้อ! ปิดคดีได้ 🕵️':'ยังไม่ได้แก้บั๊ก กลับไปขั้น ④'}</b></td></tr>`;
 } finally {if(run===dReplay){dReplaying=false;if(button)button.disabled=false;}}
}
dbgGo(0);

/* ===== V&V ===== */
let vvSpec=true,vvBuild=true;
function vvUpd(){$('vvS').textContent=vvSpec?'📄 Spec เขียนถูก (จักรยาน) · คลิกเพื่อสลับ':'📄 Spec เขียนผิด (รถยนต์) · คลิกเพื่อสลับ';
 $('vvB').textContent=vvBuild?'🔨 ทีมสร้างตรง Spec · คลิกเพื่อสลับ':'🔨 ทีมสร้างไม่ตรง Spec · คลิกเพื่อสลับ';
 $('vvSE').textContent=vvSpec?'🚲':'🚗';$('vvST').textContent=vvSpec?'จักรยาน':'รถยนต์';
 const be=vvBuild?(vvSpec?'🚲':'🚗'):(vvSpec?'🛴':'🛺');$('vvBE').textContent=be;$('vvBT').textContent=vvBuild?'ตรงตาม spec':'ไม่ตรง spec';
 const ver=vvBuild,val=vvSpec&&vvBuild;
 $('vvVer').innerHTML=`🔧 Verification: ${ver?'✅ ผ่าน':'❌ ไม่ผ่าน'}<br><small style="font-weight:400">สร้างถูกตามเอกสาร phase ก่อนหน้าไหม?</small>`;$('vvVer').style.background=ver?'rgba(22,163,74,.15)':'rgba(220,38,38,.12)';
 $('vvVal').innerHTML=`🎯 Validation: ${val?'✅ ผ่าน':'❌ ไม่ผ่าน'}<br><small style="font-weight:400">${val?'ลูกค้าได้ของที่ต้องการจริง':(ver?'สร้างเป๊ะตาม spec แต่ลูกค้าไม่ได้อยากได้สิ่งนี้!':'ลูกค้าไม่ได้ของที่ต้องการ')}</small>`;$('vvVal').style.background=val?'rgba(22,163,74,.15)':'rgba(220,38,38,.12)'}
vvUpd();
const VP=[['Requirements','Acceptance test','ตรวจว่าระบบตรงความต้องการผู้ใช้/ธุรกิจ'],['High-Level Design','System test','ทดสอบทั้งระบบเทียบกับการออกแบบภาพรวม'],['Detailed Design','Integration test','ทดสอบการเชื่อมต่อระหว่าง components ตาม design ละเอียด'],['Coding','Unit test','ทดสอบฟังก์ชัน/คลาสทีละตัว (ก้นตัว V)']];
const VL=[95,165,235,305],VR=[665,595,525,455],VY=[40,105,170,235];let vSel=-1,vHL=null;
function vDraw(){let s=`<polyline points="${VL.map((x,i)=>x+','+VY[i]).join(' ')} ${VR.slice().reverse().map((x,i)=>x+','+VY[3-i]).join(' ')}" fill="none" stroke="#c7d2fe" stroke-width="26" stroke-linejoin="round" opacity=".5"/>`;
 s+=`<text x="20" y="290" class="svgm" font-weight="800">⬇ DEVELOPMENT</text><text x="740" y="290" text-anchor="end" class="svgm" font-weight="800">TESTING ⬆</text>`;
 VP.forEach((p,i)=>{if(i<3)s+=`<line x1="${VL[i]+75}" y1="${VY[i]}" x2="${VR[i]-75}" y2="${VY[i]}" stroke="${vSel===i?'#f59e0b':'#94a3b8'}" stroke-width="${vSel===i?4:2}" stroke-dasharray="6 5"/>`;
  [[VL[i],p[0],'L'],[VR[i],p[1],'R']].forEach(([x,t,sd])=>{const hl=vSel===i||vHL===sd+i;
   s+=`<g role="button" tabindex="0" style="cursor:pointer" onclick="vPick(${i})"><rect x="${x-72}" y="${VY[i]-19}" width="144" height="38" rx="10" fill="${hl?'#4f46e5':'var(--card)'}" stroke="#4f46e5" stroke-width="2"/><text x="${x}" y="${VY[i]+5}" text-anchor="middle" font-size="13" font-weight="700" fill="${hl?'#fff':'var(--text)'}">${t}</text></g>`})});
 $('vSvg').innerHTML=s}
function vPick(i){vSel=i;vHL=null;vDraw();$('vTxt').innerHTML=`<b>${VP[i][0]}</b> ↔ <b>${VP[i][1]}</b><br><span style="font-weight:400">${VP[i][2]}</span>`}
async function vAnim(){vSel=-1;const seq=[...[0,1,2,3].map(i=>'L'+i),...[3,2,1,0].map(i=>'R'+i)];
 for(const k of seq){vHL=k;vDraw();const i=+k[1];$('vTxt').innerHTML=k[0]==='L'?`⬇ ฝั่ง Development: <b>${VP[i][0]}</b>`:`⬆ ฝั่ง Testing: <b>${VP[i][1]}</b> (ทดสอบเทียบกับ ${VP[i][0]})`;await sleep(800)}
 vHL=null;vDraw();$('vTxt').textContent='สร้างลงจากบนลงล่าง แล้วทดสอบไต่กลับขึ้นไป โดยแต่ละระดับจับคู่กัน'}
vDraw();

/* ===== FAULT LAB ===== */
let fBusy=false;
async function runFault(){if(fBusy)return;const parts=$('avgIn').value.split(',').map(s=>s.trim());const a=parts.map(Number);if(parts.some(x=>x==='')||a.some(x=>!Number.isFinite(x))||a.length>30||!Number.isFinite(a.reduce((x,y)=>x+y,0))){$('fMsg2').textContent='กรอกตัวเลขที่มีค่าจำกัด 1–30 ค่า คั่นด้วยจุลภาค โดยไม่เว้นค่ากลาง';return;}fBusy=true;
 $('fArr').innerHTML=a.map((v,i)=>`<div class="cell" id="fc${i}"><small>[${i}]</small>${v}</div>`).join('');$('fc0').classList.add('skip');
 const right=a.reduce((x,y)=>x+y,0);$('fExp').textContent=right;let sum=0;$('fSum').textContent=0;$('fSum').className='';$('fScr').className='scr';$('fScr').textContent='กำลังคำนวณ...';$('fMsg2').innerHTML='';
 for(let i=1;i<a.length;i++){$('fI').textContent=i;document.querySelectorAll('.testing-lab #fArr .cell').forEach(c=>c.classList.remove('cur'));$('fc'+i).classList.add('cur');sum+=a[i];$('fSum').textContent=sum;await sleep(650)}
 const bad=sum!==right;$('fSum').className=bad?'badv':'okv';const g=+(sum/a.length).toFixed(2),e=+(right/a.length).toFixed(2);
 $('fScr').innerHTML=`ค่าเฉลี่ย<br><b style="font-size:1.6rem">${g}</b>`+(bad?`<small>ควรเป็น ${e} ❌</small>`:'<small>ดูถูกต้อง ✓</small>');$('fScr').classList.add(bad?'bad':'ok');
 $('fMsg2').innerHTML=bad?'<div class="fb bad">💥 Fault (i = 1) ถูกรัน → <b>Error</b>: sum ในหน่วยความจำผิด → <b>Failure</b>: ผู้ใช้เห็นค่าเฉลี่ยผิด</div>':'<div class="fb ok">😮 Fault ยังอยู่ในโค้ด แต่ <b>ไม่เกิด failure</b> เพราะ arr[0] = 0 พอดี ข้ามไปก็ไม่มีผล นี่คือเหตุผลที่การเทสอาจพลาดบั๊กได้!</div>';fBusy=false}

/* ===== DOMAIN DOTS ===== */
const DOM={bugs:[],tested:new Set(),rev:false};
function domNew(){DOM.bugs=[];while(DOM.bugs.length<3){const r=Math.floor(Math.random()*240);if(!DOM.bugs.includes(r))DOM.bugs.push(r)}DOM.tested=new Set();DOM.rev=false;domDraw();$('domMsg').textContent='กด "สุ่มเทส" เพื่อเริ่ม'}
function domDraw(){let s='';for(let i=0;i<240;i++){const x=20+(i%24)*28,y=20+Math.floor(i/24)*28,t=DOM.tested.has(i),b=DOM.bugs.includes(i);
 if(t&&b)s+=`<circle cx="${x}" cy="${y}" r="11" fill="#ef4444"/><text x="${x}" y="${y+5}" text-anchor="middle" font-size="13">🐞</text>`;
 else if(t)s+=`<circle cx="${x}" cy="${y}" r="9" fill="#3b82f6"><animate attributeName="r" from="2" to="9" dur=".4s"/></circle>`;
 else if(b&&DOM.rev)s+=`<circle cx="${x}" cy="${y}" r="10" fill="none" stroke="#ef4444" stroke-width="3"><animate attributeName="r" values="7;12;7" dur="1s" repeatCount="indefinite"/></circle>`;
 else s+=`<circle cx="${x}" cy="${y}" r="6" fill="#cbd5e1"/>`}$('dom').innerHTML=s}
function domTest(){const k=+$('domK').value;const av=shuffle([...Array(240).keys()].filter(i=>!DOM.tested.has(i))).slice(0,k);av.forEach(i=>DOM.tested.add(i));domDraw();
 const f=DOM.bugs.filter(b=>DOM.tested.has(b)).length,n=DOM.tested.size;
 $('domMsg').innerHTML=`เทสไปแล้ว ${n}/240 ค่า (${(n/240*100).toFixed(0)}%) · เจอบั๊ก <b>${f}</b> ตัว · `+(f===0?'ทุก test ผ่าน ✅ ... แต่แปลว่าไม่มีบั๊กไหม? 🤔 กด "เปิดเฉลย"':f<3?'ยังมีบั๊กที่ไม่เจออีกไหม? เราไม่มีทางรู้แน่ จนกว่าจะเทสครบทุกค่า':'เจอครบ 3 ตัวแล้ว แต่ในชีวิตจริงเราไม่รู้ว่ามีกี่ตัว!')}
domNew();

/* ===== TEST LEVELS ===== */
const LV=[{n:'Acceptance',r:128,c:'#7c3aed',d:'verify system meets user/business requirements · ลูกค้าทดลองใช้ก่อนรับงาน 🤝'},{n:'System',r:98,c:'#2563eb',d:'test the complete system · ทดสอบทั้งระบบที่ประกอบเสร็จ 🚗'},{n:'Integration',r:68,c:'#0891b2',d:'test interactions between components · ชิ้นส่วนทำงานร่วมกันได้ไหม ⚙️'},{n:'Unit',r:36,c:'#16a34a',d:'test individual functions or classes · เช็กทีละชิ้นเล็กสุด 🔩'}];
$('lvSvg').innerHTML=LV.map((l,i)=>`<g role="button" tabindex="0" style="cursor:pointer" onclick="lvPick(${i})"><circle cx="150" cy="140" r="${l.r}" fill="${l.c}" opacity=".85" stroke="#fff" stroke-width="3"/><text x="150" y="${i===3?145:140-l.r+20}" text-anchor="middle" fill="#fff" font-weight="800" font-size="13">${l.n}</text></g>`).join('');
function lvPick(i){$('lvTxt').innerHTML=`<span class="tag" style="background:${LV[i].c}">${LV[i].n} testing</span><br>${LV[i].d}`}
function lvReg(){$('lvTxt').innerHTML='<span class="tag" style="background:#f59e0b">🔁 Regression testing</span><br>ensure new changes have not introduced new defects · ใช้ได้ทุกระดับ ทุกครั้งที่แก้โค้ด ต้องรันเทสเดิมซ้ำ (ซ่อมแอร์แล้วต้องเช็กว่าไฟหน้ายังติด)'}
const PGS=[{g:[1,1,1,1,1,1,1,1],n:'Unit Tests',c:'#16a34a'},{g:[2,2,2,2],n:'Functional Tests',c:'#0891b2'},{g:[4,4],n:'Component Tests',c:'#2563eb'},{g:[8],n:'System / Regression Test',c:'#7c3aed'}];let pgK=0;
function pgDraw(){const s=PGS[pgK];$('pgSteps').innerHTML=PGS.map((p,i)=>`<span class="tag" style="background:${i<=pgK?p.c:'#94a3b8'}">${p.n}</span>${i<3?'<span class="muted">→</span>':''}`).join('');
 $('pgArea').innerHTML=s.g.map(n=>`<div class="pgg" style="border-color:${s.c}"><div class="pgl" style="background:${s.c}">${s.n}</div>${pgK===3?'<span style="font-size:3rem">🚗</span><br>':''}${'<span class="lego">🧱</span>'.repeat(pgK===3?0:n)}<div>✅</div></div>`).join('')}
function pgNext(){pgK=(pgK+1)%4;pgDraw()}pgDraw();

/* ===== BLACK/WHITE ===== */
let bwOpen=false;
function bwToggle(){bwOpen=!bwOpen;$('bwBox').setAttribute('fill',bwOpen?'rgba(99,102,241,.08)':'#0f172a');$('bwIn').setAttribute('opacity',bwOpen?1:0);$('bwQ').setAttribute('opacity',bwOpen?0:1);
 $('bwBtn').textContent=bwOpen?'🔒 ปิดฝากล่อง (Black-box)':'🔓 เปิดฝากล่อง (White-box)';
 $('bwTxt').innerHTML=bwOpen?'⬜ <b>White-box:</b> เห็นตรรกะข้างใน จึงออกแบบ test ให้ผ่านทุกทางแยก (coin ok = T และ F) เหมือนเปิดตู้กดน้ำดูวงจร':'⬛ <b>Black-box:</b> มองไม่เห็นข้างใน รู้แค่ spec "หยอดเหรียญ → ได้น้ำ" จึงเทสจาก input/output เหมือนลูกค้าหยอดเหรียญตู้กดน้ำ'}
bwOpen=true;bwToggle();
function lgUpd(){if(['lgA','lgB'].some(id=>$(id).value.trim()===''||!Number.isFinite(Number($(id).value)))){$('lgT').innerHTML='<tr><td>กรอกตัวเลขให้ครบทั้งสองช่อง</td></tr>';return;}const a=+$('lgA').value,b=+$('lgB').value,k=a>b?0:b>a?1:2;const R=[['First > Second','10, 7'],['Second > First','8, 12'],['First = Second','6, 6']];
 $('lgT').innerHTML='<tr><th>Class</th><th>Representative (สไลด์)</th></tr>'+R.map((r,i)=>`<tr style="${i===k?'background:#fde68a;color:#1e293b;font-weight:700':''}"><td>${r[0]} ${i===k?'👈 input ของคุณอยู่กลุ่มนี้':''}</td><td>${r[1]}</td></tr>`).join('')}
lgUpd();

/* ===== NUMBER LINE ECP/BVA ===== */
let nlMode='ecp',nlKey='';
function nlUpd(){const a=Math.round(+$('rMin').value),b=Math.round(+$('rMax').value);$('mEcp').className='btn sm '+(nlMode==='ecp'?'on':'ghost');$('mBva').className='btn sm '+(nlMode==='bva'?'on':'ghost');
 if(['rMin','rMax'].some(id=>$(id).value.trim()===''||!Number.isSafeInteger(Number($(id).value))||Math.abs(Number($(id).value))>1000000)||a>b){$('nlTab').textContent='กรอกจำนวนเต็มตั้งแต่ −1000000 ถึง 1000000 โดยค่าต่ำสุดไม่เกินค่าสูงสุด';$('prV').textContent='—';$('prR').textContent='';$('nl').innerHTML='<text x="380" y="100" text-anchor="middle" fill="#dc2626" font-size="18">ตรวจช่วงจำนวนเต็มที่กรอก</text>';return}
 const span=Math.max(b-a,6),lo=Math.floor(a-span*.5),hi=Math.ceil(b+span*.5),X=v=>30+(v-lo)/(hi-lo)*700,P=$('probe');
 if(nlKey!==a+','+b){nlKey=a+','+b;P.min=lo;P.max=hi;P.value=Math.round((a+b)/2)}
 const pv=+P.value,ok=pv>=a&&pv<=b;
 let s=`<rect x="${X(lo)}" y="34" width="${X(a-.5)-X(lo)}" height="34" fill="#fca5a5"/><rect x="${X(a-.5)}" y="34" width="${X(b+.5)-X(a-.5)}" height="34" fill="#86efac"/><rect x="${X(b+.5)}" y="34" width="${X(hi)-X(b+.5)}" height="34" fill="#fca5a5"/>
 <text x="${(X(lo)+X(a-.5))/2}" y="56" text-anchor="middle" font-weight="800" fill="#991b1b">Invalid</text><text x="${(X(a)+X(b))/2}" y="56" text-anchor="middle" font-weight="800" fill="#166534">Valid</text><text x="${(X(b+.5)+X(hi))/2}" y="56" text-anchor="middle" font-weight="800" fill="#991b1b">Invalid</text>
 <line x1="30" y1="68" x2="730" y2="68" stroke="#475569" stroke-width="2"/>`;
 const pin=(v,c,lab,y)=>`<line x1="${X(v)}" y1="68" x2="${X(v)}" y2="${y-8}" stroke="${c}" stroke-width="2"/><circle cx="${X(v)}" cy="${y}" r="8" fill="${c}"/><text x="${X(v)}" y="${y+24}" text-anchor="middle" font-size="12" font-weight="700" class="svgt">${nlMode==='bva'?'':lab}</text>`;
 if(nlMode==='ecp'){const r1=Math.round((lo+a-1)/2),r2=Math.round((a+b)/2),r3=Math.round((b+1+hi)/2);s+=pin(r1,'#dc2626',r1,92)+pin(r2,'#16a34a',r2,92)+pin(r3,'#dc2626',r3,92);
  s+=`<text x="380" y="150" text-anchor="middle" class="svgm" font-size="14">🍲 ECP: เลือกตัวแทนกลุ่มละ 1 ค่า (ค่าไหนในกลุ่มก็ได้) → 3 test cases</text>`;
  $('nlTab').innerHTML=`<table><tr><th>Class</th><th>Representative</th><th>Expected</th></tr><tr><td>≤ ${a-1}</td><td>${r1}</td><td>Invalid</td></tr><tr><td>${a} – ${b}</td><td>${r2}</td><td>Valid</td></tr><tr><td>≥ ${b+1}</td><td>${r3}</td><td>Invalid</td></tr></table>`}
 else{const all=[...new Set([a-1,a,a+1,b-1,b,b+1])].sort((x,y)=>x-y),belong=all.filter(x=>x>=a&&x<=b),reduced=[...new Set([a,b])];s+=pin(a-1,'#dc2626',a-1,92)+pin(a,'#16a34a',a,92)+pin(b,'#16a34a',b,92)+pin(b+1,'#dc2626',b+1,92);
  const inset=(x0,c,vals,cols)=>`<line x1="${c}" y1="76" x2="${x0+110}" y2="128" stroke="#94a3b8" stroke-dasharray="4 4"/><rect x="${x0}" y="128" width="220" height="70" rx="12" fill="var(--soft)" stroke="#a5b4fc"/><text x="${x0+110}" y="144" text-anchor="middle" font-size="11" class="svgm">🔍 ซูมที่ขอบ</text>`+vals.map((v,k)=>`<circle cx="${x0+45+k*65}" cy="165" r="12" fill="${v>=a&&v<=b?'#16a34a':'#dc2626'}"/><text x="${x0+45+k*65}" y="192" text-anchor="middle" font-size="12" font-weight="700" class="svgt">${v}</text><text x="${x0+45+k*65}" y="169" text-anchor="middle" font-size="9" fill="#fff" font-weight="800">${['−1','B','+1'][k]}</text>`).join('');
  s+=inset(110,X(a),[a-1,a,a+1],['#dc2626','#16a34a','#86efac'])+inset(430,X(b),[b-1,b,b+1],['#86efac','#16a34a','#dc2626']);
  $('nlTab').innerHTML=`<table><tr><th>Class</th><th>All Cases</th><th>Belonging Cases</th><th>Reduced Class</th></tr><tr><td>&lt; ${a}</td><td>${a-1}, ${a}</td><td>${a-1}</td><td><b>${a-1}</b></td></tr><tr><td>${a} – ${b}</td><td>${all.join(', ')}</td><td>${belong.join(', ')}</td><td><b>${reduced.join(', ')}</b></td></tr><tr><td>&gt; ${b}</td><td>${b}, ${b+1}</td><td>${b+1}</td><td><b>${b+1}</b></td></tr></table><p><b>Test cases:</b> ${[...new Set([a-1,a,b,b+1])].map(v=>v+' → '+(v>=a&&v<=b?'Valid':'Invalid')).join(' · ')}</p>`}
 s+=`<path d="M${X(pv)-9},8 L${X(pv)+9},8 L${X(pv)},26z" fill="#f59e0b"/><line x1="${X(pv)}" y1="26" x2="${X(pv)}" y2="68" stroke="#f59e0b" stroke-width="3"/>`;
 $('nl').innerHTML=s;$('prV').textContent=pv;const near=[a-1,a,a+1,b-1,b,b+1].includes(pv);
 $('prR').innerHTML=`<span class="tag" style="background:${ok?'#16a34a':'#dc2626'}">${ok?'Valid':'Invalid'}</span> ${near?'📏 อยู่ที่ขอบ (BVA ชอบ!)':'(อยู่กลางกลุ่ม เหมาะเป็นตัวแทน ECP)'}`}
nlUpd();

/* ===== BVA STAGES ===== */
const BVC=[{n:'Low',lo:-1e9,hi:-1,all:[-1,0],red:[-1]},{n:'0-12',lo:0,hi:12,all:[-1,0,1,11,12,13],red:[0,12]},{n:'13-19',lo:13,hi:19,all:[12,13,14,18,19,20],red:[13,19]},{n:'20-35',lo:20,hi:35,all:[19,20,21,34,35,36],red:[20,35]},{n:'36-120',lo:36,hi:120,all:[35,36,37,119,120,121],red:[36,120]},{n:'High',lo:121,hi:1e9,all:[120,121],red:[121]}];
function bvStage(k){const T=['① <b>All Cases:</b> ทุกขอบเขียน (boundary−1, boundary, boundary+1)','② <b>Belonging Cases:</b> ตัดค่าที่ <u>ไม่อยู่ในกลุ่มนั้น</u> ออก (ขีดฆ่าสีแดง)','③ <b>Reduced Class:</b> เหลือแค่ <u>ค่าขอบจริง</u> (min/max ของกลุ่ม) ⭐'];$('bvTxt').innerHTML=T[k];
 $('bvT').innerHTML='<tr><th>Class</th><th>Cases</th><th>Reduced</th></tr>'+BVC.map(c=>`<tr><td><b>${c.n}</b></td><td>${c.all.map(v=>{const inC=v>=c.lo&&v<=c.hi,isR=c.red.includes(v);let cl='';if(k>=1&&!inC)cl='out';else if(k===2&&!isR)cl='out2';else if(k===2&&isR)cl='gold';return `<span class="bchip ${cl}">${v}</span>`}).join('')}</td><td>${k===2?'<b>'+c.red.join(', ')+'</b>':'…'}</td></tr>`).join('')}
bvStage(0);

/* ===== TICKET GAME ===== */
const TC=[{n:'Invalid (<0)',c:'#dc2626',p:'Error: Invalid Age',lo:-5,hi:-1},{n:'0–11',c:'#0ea5e9',p:'Free 🎉',lo:0,hi:11},{n:'12–17',c:'#f59e0b',p:'100 บาท',lo:12,hi:17},{n:'18–60',c:'#16a34a',p:'200 บาท',lo:18,hi:60},{n:'>60',c:'#7c3aed',p:'100 บาท',lo:61,hi:90}];
const BV=[-1,0,11,12,17,18,60,61];let suite=[];const TX=v=>20+(v+5)/95*720;
function tkUpd(){const a=+$('age').value,c=TC.find(x=>a>=x.lo&&a<=x.hi);
 let s=TC.map(z=>`<rect x="${TX(z.lo-.5)}" y="20" width="${TX(z.hi+.5)-TX(z.lo-.5)}" height="34" fill="${z.c}" opacity="${z===c?1:.35}"/><text x="${(TX(z.lo-.5)+TX(z.hi+.5))/2}" y="42" text-anchor="middle" fill="#fff" font-size="12" font-weight="800">${z.n}</text>`).join('');
 s+=BV.map(v=>`<line x1="${TX(v)}" y1="54" x2="${TX(v)}" y2="66" stroke="${suite.includes(v)?'#16a34a':'#94a3b8'}" stroke-width="3"/><text x="${TX(v)}" y="80" text-anchor="middle" font-size="10" fill="${suite.includes(v)?'#16a34a':'var(--muted)'}" font-weight="700">${v}</text>`).join('');
 s+=`<path d="M${TX(a)-8},2 L${TX(a)+8},2 L${TX(a)},16z" fill="#1e293b" stroke="#fff"/>`+suite.map(v=>`<circle cx="${TX(v)}" cy="96" r="5" fill="#4f46e5"/>`).join('');
 $('tkSvg').innerHTML=s;$('tkAge').textContent=a;$('tkCls').innerHTML=`<span class="tag" style="background:${c.c}">${c.n}</span>`;$('tkPr').textContent=c.p;
 $('tkAv').textContent=a<0?'❓':a<=2?'👶':a<=11?'🧒':a<=17?'🧑‍🎓':a<=60?'🧑‍💼':'👴';$('tkBd').textContent=BV.includes(a)?'📏 ค่านี้เป็น boundary value!':''}
function tkAdd(){const a=+$('age').value;if(!suite.includes(a))suite.push(a);tkSuite()}
function tkSuite(){suite.sort((x,y)=>x-y);$('tkList').textContent=suite.length?suite.join(', '):'ยังไม่มี';const cc=TC.map(c=>suite.some(v=>v>=c.lo&&v<=c.hi)),bc=BV.map(b=>suite.includes(b));
 $('mC').style.width=cc.filter(Boolean).length/5*100+'%';$('mB').style.width=bc.filter(Boolean).length/8*100+'%';
 $('pC').innerHTML=TC.map((c,i)=>`<span class="pill ${cc[i]?'on':''}">${c.n}</span>`).join('');$('pB').innerHTML=BV.map((b,i)=>`<span class="pill ${bc[i]?'on':''}">${b}</span>`).join('');
 $('tkMsg').innerHTML=bc.every(Boolean)?`<div class="fb ok">🏆 ครบทุกขอบ! ใช้ ${suite.length} test cases ${suite.length===8?'(น้อยที่สุดเป๊ะ!)':'(ลองให้เหลือแค่ 8 ดูสิ)'}</div>`:cc.every(Boolean)?'<div class="fb ok">✅ ครบทุก class แล้ว (ผ่าน ECP) ลองเติมค่าขอบให้ครบด้วย BVA</div>':'';tkUpd()}
tkSuite();

/* ===== FLOWCHART ENGINE ===== */
const FS={};
function trimP(nd,p){const w=(nd.w||64)/2,h=(nd.h||(nd.t==='c'?46:32))/2,dx=p[0]-nd.x,dy=p[1]-nd.y;if(!dx&&!dy)return[nd.x,nd.y];
 const t=nd.t==='c'?1/(Math.abs(dx)/w+Math.abs(dy)/h):Math.min(dx?w/Math.abs(dx):1e9,dy?h/Math.abs(dy):1e9);return[nd.x+dx*t,nd.y+dy*t]}
function flow(id,cfg){const svg=$(id);svg.setAttribute('viewBox',`0 0 ${cfg.w} ${cfg.h}`);FS[id]={cov:new Set(),hl:new Set(),tm:[],E:{}};
 let d=`<defs>${[['g','#94a3b8'],['o','#f59e0b'],['v','#16a34a']].map(([k,c])=>`<marker id="${id}-a${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0L10,5L0,10z" fill="${c}"/></marker>`).join('')}</defs>`,E='',L='',Nd='';
 cfg.edges.forEach(e=>{const A=cfg.nodes[e.f],B=cfg.nodes[e.t],pts=[[A.x,A.y],...(e.via||[]),[B.x,B.y]];FS[id].E[e.n]=e;
  const p0=trimP(A,pts[1]),pn=trimP(B,pts[pts.length-2]);pts[0]=p0;pts[pts.length-1]=pn;
  E+=`<path class="edge" data-n="${e.n}" d="M${pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L')}" marker-end="url(#${id}-ag)"/>`;
  const lab=e.lab===undefined?e.n:e.lab;if(lab!==''){let bi=0,bl=-1;for(let i=0;i<pts.length-1;i++){const l=Math.hypot(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1]);if(l>bl){bl=l;bi=i}}
   const lx=(pts[bi][0]+pts[bi+1][0])/2,ly=(pts[bi][1]+pts[bi+1][1])/2;L+=`<g class="elab" data-n="${e.n}"><circle cx="${lx}" cy="${ly}" r="10"/><text x="${lx}" y="${ly+4}" text-anchor="middle" font-size="11" font-weight="800" class="svgt">${lab}</text></g>`}});
 Object.entries(cfg.nodes).forEach(([k,n])=>{const w=n.w||64,h=n.h||(n.t==='c'?46:32);
  const shape=n.t==='c'?`<polygon points="${n.x},${n.y-h/2} ${n.x+w/2},${n.y} ${n.x},${n.y+h/2} ${n.x-w/2},${n.y}"/>`:`<rect x="${n.x-w/2}" y="${n.y-h/2}" width="${w}" height="${h}" rx="${n.t==='e'?h/2:7}"/>`;
  Nd+=`<g class="nd" data-k="${k}">${shape}<text x="${n.x}" y="${n.y+4.5}" text-anchor="middle" font-size="${n.fs||13}">${n.label||k}</text></g>`});
 svg.innerHTML=d+E+Nd+L}
function paint(id){const st=FS[id],sv=$(id),hn=new Set();
 sv.querySelectorAll('.edge').forEach(p=>{const n=p.dataset.n,s=st.hl.has(n)?'hl':st.cov.has(n)?'cov':'';p.classList.remove('hl','cov');if(s)p.classList.add(s);p.setAttribute('marker-end',`url(#${id}-a${s==='hl'?'o':s==='cov'?'v':'g'})`);if(s==='hl'){hn.add(st.E[n].f);hn.add(st.E[n].t)}});
 sv.querySelectorAll('.elab').forEach(g=>{const n=g.dataset.n;g.classList.remove('hl','cov');if(st.hl.has(n))g.classList.add('hl');else if(st.cov.has(n))g.classList.add('cov')});
 sv.querySelectorAll('.nd').forEach(g=>g.classList.toggle('hl',hn.has(g.dataset.k)))}
function animPath(id,edges){const st=FS[id];st.tm.forEach(clearTimeout);st.tm=[];st.hl=new Set();paint(id);edges.forEach((n,k)=>st.tm.push(setTimeout(()=>{st.hl.add(String(n));paint(id)},reducedMotion.matches?0:k*380)))}
function pathBtns(box,id,paths){$(box).innerHTML=paths.map((p,i)=>`<button class="btn ghost sm" data-i="${i}">${p.n}</button>`).join('')+`<div class="qbox" id="${box}-t">กดปุ่ม path เพื่อดูเส้นทางวิ่งบนผังงาน 🟧</div>`;
 $(box).querySelectorAll('button').forEach(b=>b.onclick=()=>{const p=paths[+b.dataset.i];animPath(id,p.e);$(box+'-t').innerHTML=`<b>${p.n}:</b> ${p.s}<br><small>segments (${p.e.join(', ')})</small>`})}
function indep(box,id,paths,nE,target){let ch=[],msg='คลิก path ทีละเส้น: จะรับเข้าชุดได้เฉพาะ path ที่มี <b>edge ใหม่</b> อย่างน้อย 1 เส้น';
 const cov=()=>{const c=new Set();ch.forEach(i=>paths[i].e.forEach(x=>c.add(String(x))));return c};
 function r(){const c=cov();FS[id].cov=c;paint(id);const done=ch.length===target&&c.size===nE;
  $(box).innerHTML=`<p><b>Cyclomatic number</b> = ${target-1} decisions + 1 = <b>${target}</b></p>`+paths.map((p,i)=>`<button type="button" class="pchip ${ch.includes(i)?'on':''}" aria-pressed="${ch.includes(i)}" data-i="${i}">${p.n}<small>(${p.e.join(',')})</small></button>`).join('')+
  `<p>Edge ที่ครอบคลุม: ${c.size}/${nE} · Paths ในชุด: ${ch.length}/${target}</p><div class="meter"><div style="width:${c.size/nE*100}%"></div></div><div class="qbox">${done?'🏆 สำเร็จ! ได้ชุด linearly independent ครบ '+target+' paths ครอบคลุมทุก edge':msg}</div><button class="btn ghost sm">↺ เริ่มใหม่</button>`;
  $(box).querySelector('.btn').onclick=()=>{ch=[];msg='เริ่มใหม่แล้ว';r()};
  $(box).querySelectorAll('.pchip').forEach(el=>el.onclick=()=>{const i=+el.dataset.i,p=paths[i];
   if(ch.includes(i)){ch=ch.filter(x=>x!==i);msg=`เอา ${p.n} ออกแล้ว`}
   else{const c2=cov(),nw=p.e.filter(x=>!c2.has(String(x)));if(!nw.length)msg=`❌ ${p.n} ไม่มี edge ใหม่เลย (ใช้แต่ edge ที่เคยผ่านแล้ว) จึงไม่ independent`;else if(ch.length>=target)msg='ชุดครบจำนวนแล้ว ลองเอาบาง path ออก';else{ch.push(i);msg=`✅ ${p.n} นำ edge ใหม่ {${nw.join(', ')}} เข้ามา`}}
   animPath(id,p.e);r()})}
 r()}

/* --- slide 33 --- */
flow('f33',{w:330,h:290,nodes:{S1:{x:140,y:30},C1:{x:140,y:110,t:'c'},S2:{x:260,y:185},S3:{x:140,y:260}},edges:[{n:1,f:'S1',t:'C1'},{n:2,f:'C1',t:'S2'},{n:3,f:'S2',t:'S3'},{n:4,f:'C1',t:'S3'}]});
pathBtns('p33','f33',[{n:'path1',s:'S1 – C1 – S3',e:[1,4]},{n:'path2',s:'S1 – C1 – S2 – S3',e:[1,2,3]}]);
/* --- slide 34 --- */
flow('f34',{w:520,h:300,nodes:{S1:{x:45,y:60},C1:{x:150,y:60,t:'c'},C2:{x:265,y:60,t:'c'},C3:{x:380,y:60,t:'c'},S2:{x:150,y:160},S3:{x:265,y:160},S4:{x:380,y:160},S5:{x:265,y:265}},
 edges:[{n:1,f:'S1',t:'C1'},{n:5,f:'C1',t:'C2'},{n:6,f:'C2',t:'C3'},{n:2,f:'C1',t:'S2'},{n:3,f:'C2',t:'S3'},{n:4,f:'C3',t:'S4'},{n:8,f:'S2',t:'S5'},{n:9,f:'S3',t:'S5'},{n:10,f:'S4',t:'S5'},{n:7,f:'C3',t:'S5',via:[[480,60],[480,265]]}]});
pathBtns('p34','f34',[{n:'path1',s:'S1–C1–S2–S5',e:[1,2,8]},{n:'path2',s:'S1–C1–C2–S3–S5',e:[1,5,3,9]},{n:'path3',s:'S1–C1–C2–C3–S4–S5',e:[1,5,6,4,10]},{n:'path4',s:'S1–C1–C2–C3–S5',e:[1,5,6,7]}]);
/* --- slide 35 --- */
flow('f35',{w:420,h:290,nodes:{S1:{x:180,y:30},C1:{x:180,y:130,t:'c'},S2:{x:340,y:130},S3:{x:180,y:255}},edges:[{n:1,f:'S1',t:'C1'},{n:2,f:'C1',t:'S2'},{n:3,f:'S2',t:'C1',via:[[340,75],[215,75]]},{n:4,f:'C1',t:'S3'}]});
pathBtns('p35','f35',[{n:'path1 (ไม่เข้า loop)',s:'S1 – C1 – S3',e:[1,4]},{n:'path2 (เข้า loop)',s:'S1 – C1 – S2 – C1 – S3',e:[1,2,3,4]}]);
/* --- slide 36 --- */
flow('f36',{w:340,h:340,nodes:{C1:{x:140,y:35,t:'c'},S2:{x:270,y:110},C2:{x:140,y:185,t:'c'},S3:{x:270,y:260},End:{x:140,y:310,t:'e'}},edges:[{n:1,f:'C1',t:'C2'},{n:2,f:'C1',t:'S2'},{n:3,f:'S2',t:'C2'},{n:4,f:'C2',t:'End'},{n:5,f:'C2',t:'S3'},{n:6,f:'S3',t:'End'}]});
const P36=[{n:'path1',e:[1,5,6]},{n:'path2',e:[1,4]},{n:'path3',e:[2,3,4]},{n:'path4',e:[2,3,5,6]}];
$('mx36').innerHTML='<tr><th></th>'+[1,2,3,4,5,6].map(e=>`<th>${e}</th>`).join('')+'</tr>'+P36.map(p=>`<tr><td><b>${p.n}</b></td>${[1,2,3,4,5,6].map(e=>`<td style="text-align:center">${p.e.includes(e)?1:''}</td>`).join('')}</tr>`).join('');
indep('b36','f36',P36,6,3);
/* --- slide 37 --- */
flow('f37',{w:360,h:420,nodes:{S1:{x:150,y:28},C1:{x:150,y:100,t:'c'},S2:{x:285,y:150},C2:{x:150,y:205,t:'c'},S3:{x:285,y:255},C3:{x:150,y:305,t:'c'},S4:{x:75,y:390},S5:{x:235,y:390}},
 edges:[{n:1,f:'S1',t:'C1'},{n:2,f:'C1',t:'S2'},{n:3,f:'C1',t:'C2'},{n:4,f:'S2',t:'C2'},{n:5,f:'C2',t:'S3'},{n:6,f:'C2',t:'C3'},{n:7,f:'S3',t:'C3'},{n:8,f:'C3',t:'S5'},{n:9,f:'C3',t:'S4'}]});
indep('b37','f37',[{n:'path1',e:[1,2,4,6,9]},{n:'path2',e:[1,2,4,6,8]},{n:'path3',e:[1,2,4,5,7,9]},{n:'path4',e:[1,2,4,5,7,8]},{n:'path5',e:[1,3,6,9]},{n:'path6',e:[1,3,6,8]},{n:'path7',e:[1,3,5,7,9]},{n:'path8',e:[1,3,5,7,8]}],9,4);

/* ===== TREE 2^n ===== */
function treeUpd(){const n=+$('nd').value;$('nv').textContent=n;$('nv2').textContent=n;$('tp').textContent=2**n;$('ip').textContent=n+1;
 $('b1').style.width=Math.min(2**n/1024*320,320)+4+'px';$('b2').style.width=(n+1)/1024*320+4+'px';
 if(n>6){$('tree').innerHTML=`<text x="350" y="120" text-anchor="middle" font-size="22" class="svgt">n = ${n} → ${2**n} paths 😱</text><text x="350" y="155" text-anchor="middle" class="svgm">ใหญ่เกินจะวาด! แต่ independent paths มีแค่ ${n+1}</text>`;return}
 const W=700,H=250,Y=d=>20+d*(H-45)/n;let L='',C='';
 for(let d=0;d<=n;d++){const cnt=2**d;for(let k=0;k<cnt;k++){const x=W*(k+.5)/cnt;
  if(d<n){const xl=W*(2*k+.5)/(2*cnt),xr=W*(2*k+1.5)/(2*cnt);L+=`<line x1="${x}" y1="${Y(d)}" x2="${xl}" y2="${Y(d+1)}" stroke="#16a34a" stroke-width="2"/><line x1="${x}" y1="${Y(d)}" x2="${xr}" y2="${Y(d+1)}" stroke="#dc2626" stroke-width="2"/>`;
   if(n<=3)L+=`<text x="${(x+xl)/2-8}" y="${(Y(d)+Y(d+1))/2}" font-size="11" fill="#16a34a" font-weight="800">T</text><text x="${(x+xr)/2+4}" y="${(Y(d)+Y(d+1))/2}" font-size="11" fill="#dc2626" font-weight="800">F</text>`}
  C+=d<n?`<circle cx="${x}" cy="${Y(d)}" r="${n>4?5:9}" fill="#4f46e5"/>${n<=4?`<text x="${x}" y="${Y(d)+4}" text-anchor="middle" font-size="9" fill="#fff">C${d+1}</text>`:''}`:`<circle cx="${x}" cy="${Y(d)}" r="${n>4?3:6}" fill="#f59e0b"/>`}}
 $('tree').innerHTML=L+C+`<text x="8" y="${H-4}" font-size="12" class="svgm">🟠 ปลายทาง = 1 path · มีทั้งหมด ${2**n} ปลายทาง</text>`}
treeUpd();

/* ===== FINDLAR ===== */
const FL=['public Double FindLar_3(Double n1, Double n2, Double n3) {','  Double largest;','  if (n1 >= n2) {              // D1','    if (n1 >= n3) {            // D2','      largest = n1;','    } else {','      largest = n3;','    }','  } else {','    if (n2 >= n3) {            // D3','      largest = n2;','    } else {','      largest = n3;','    }','  }','  return largest;','}'];
$('flCode').innerHTML=FL.map((l,i)=>`<span class="ln" id="L${i}">${esc(l)}</span>`).join('');
flow('fFL',{w:480,h:340,nodes:{D1:{x:240,y:38,t:'c',w:116,h:50,label:'n1 >= n2',fs:12},D2:{x:120,y:125,t:'c',w:116,h:50,label:'n1 >= n3',fs:12},D3:{x:360,y:125,t:'c',w:116,h:50,label:'n2 >= n3',fs:12},
 A:{x:55,y:220,w:100,label:'largest=n1',fs:12},B:{x:180,y:220,w:100,label:'largest=n3',fs:12},C:{x:300,y:220,w:100,label:'largest=n2',fs:12},D:{x:425,y:220,w:100,label:'largest=n3',fs:12},R:{x:240,y:305,t:'e',w:120,h:34,label:'return largest',fs:12}},
 edges:[{n:'a',f:'D1',t:'D2',lab:'T'},{n:'b',f:'D1',t:'D3',lab:'F'},{n:'c',f:'D2',t:'A',lab:'T'},{n:'d',f:'D2',t:'B',lab:'F'},{n:'e',f:'D3',t:'C',lab:'T'},{n:'f',f:'D3',t:'D',lab:'F'},{n:'g',f:'A',t:'R',lab:''},{n:'h',f:'B',t:'R',lab:''},{n:'i',f:'C',t:'R',lab:''},{n:'j',f:'D',t:'R',lab:''}]});
const FP={P1:{l:[0,1,2,3,4,15,16],e:['a','c','g'],d:'D1=T, D2=T → largest = n1',b:['D1T','D2T'],h:'(5, 3, 1)'},P2:{l:[0,1,2,3,5,6,15,16],e:['a','d','h'],d:'D1=T, D2=F → largest = n3',b:['D1T','D2F'],h:'(5, 3, 9)'},
 P3:{l:[0,1,2,8,9,10,15,16],e:['b','e','i'],d:'D1=F, D3=T → largest = n2',b:['D1F','D3T'],h:'(2, 7, 4)'},P4:{l:[0,1,2,8,9,11,12,15,16],e:['b','f','j'],d:'D1=F, D3=F → largest = n3',b:['D1F','D3F'],h:'(2, 7, 9)'}};
const STM=[1,2,3,4,6,9,10,12,15];let cP=new Set(),cB=new Set(),cS=new Set(),flT=[];
function runFL(){if(['n1','n2','n3'].some(id=>$(id).value.trim()===''||!Number.isFinite(Number($(id).value)))){$('flRes').textContent='กรอกตัวเลขที่มีค่าจำกัดให้ครบทั้ง 3 ช่อง';return;}const a=+$('n1').value,b=+$('n2').value,c=+$('n3').value;let p,res;
 if(a>=b){if(a>=c){p='P1';res=a}else{p='P2';res=c}}else{if(b>=c){p='P3';res=b}else{p='P4';res=c}}
 flT.forEach(clearTimeout);flT=[];document.querySelectorAll('.testing-lab #flCode .ln').forEach(x=>x.classList.remove('hit'));
 FP[p].l.forEach((ln,k)=>flT.push(setTimeout(()=>$('L'+ln).classList.add('hit'),reducedMotion.matches?0:k*130)));
 const nw=!cP.has(p);cP.add(p);FP[p].b.forEach(x=>cB.add(x));FP[p].l.forEach(x=>{if(STM.includes(x))cS.add(x)});
 FS.fFL.cov=new Set([...cP].flatMap(k=>FP[k].e));animPath('fFL',FP[p].e);
 $('flRes').innerHTML=`ผลลัพธ์ = <b>${res}</b> · ผ่าน <b>${p}</b> (${FP[p].d}) ${nw?'🆕 path ใหม่!':'· path นี้เคยผ่านแล้ว ลอง input อื่น'}`;flUpd()}
function flUpd(){$('mP').style.width=cP.size/4*100+'%';$('mBr').style.width=cB.size/6*100+'%';$('mS').style.width=cS.size/STM.length*100+'%';
 $('pP').innerHTML=['P1','P2','P3','P4'].map(x=>`<span class="pill ${cP.has(x)?'on':''}">${x}</span>`).join('')+(cP.size===4?' 🏆':'');
 $('pBr').innerHTML=['D1T','D1F','D2T','D2F','D3T','D3F'].map(x=>`<span class="pill ${cB.has(x)?'on':''}">${x}</span>`).join('');$('pS').textContent=`${cS.size}/${STM.length} statements`}
function hintFL(){const m=['P1','P2','P3','P4'].find(x=>!cP.has(x));$('flRes').innerHTML=m?`💡 ยังไม่ผ่าน ${m}: ${FP[m].d} ลองใส่ ${FP[m].h}`:'ครบทุก path แล้ว! 🏆'}
function resetFL(){flT.forEach(clearTimeout);flT=[];FS.fFL.tm.forEach(clearTimeout);FS.fFL.tm=[];$('flRes').textContent='ล้าง coverage แล้ว ลองชุดข้อมูลใหม่';cP.clear();cB.clear();cS.clear();FS.fFL.cov=new Set();FS.fFL.hl=new Set();paint('fFL');document.querySelectorAll('.testing-lab #flCode .ln').forEach(x=>x.classList.remove('hit'));flUpd()}
flUpd();

/* ===== FIND RATE ===== */
const frF=d=>10*Math.exp(-((d-2.5)**2)/(2*.85**2));
function frDraw(){const d=+$('frD').value,X=v=>60+v/5.5*610,Y=v=>205-v*17;let pts=[],ar=[];
 for(let v=0;v<=5.5001;v+=.05){pts.push(X(v).toFixed(1)+','+Y(frF(v)).toFixed(1));if(v<=d)ar.push(X(v).toFixed(1)+','+Y(frF(v)).toFixed(1))}
 let s=`<line x1="60" y1="205" x2="680" y2="205" stroke="#94a3b8" stroke-width="2"/><line x1="60" y1="15" x2="60" y2="205" stroke="#94a3b8" stroke-width="2"/>
 <text x="370" y="242" text-anchor="middle" class="svgm" font-size="13">Time</text><text x="18" y="110" class="svgm" font-size="12" transform="rotate(-90 18 110)" text-anchor="middle"># problems found / hour</text>`;
 for(let k=1;k<=5;k++)s+=`<text x="${X(k)}" y="222" text-anchor="middle" class="svgm" font-size="12">Day ${k}</text><line x1="${X(k)}" y1="205" x2="${X(k)}" y2="210" stroke="#94a3b8"/>`;
 if(ar.length>1)s+=`<polygon points="${X(0)},205 ${ar.join(' ')} ${X(d)},205" fill="rgba(79,70,229,.15)"/>`;
 s+=`<polyline points="${pts.join(' ')}" fill="none" stroke="#4f46e5" stroke-width="4"/><line x1="${X(d)}" y1="205" x2="${X(d)}" y2="${Y(frF(d))}" stroke="#f59e0b" stroke-dasharray="4 4"/><circle cx="${X(d)}" cy="${Y(frF(d))}" r="9" fill="#f59e0b" stroke="#fff" stroke-width="3"/>`;
 if(d>4.3)s+=`<text x="${X(d)}" y="${Y(frF(d))-18}" text-anchor="middle" font-size="22">🛑</text>`;
 $('frSvg').innerHTML=s;$('frV').textContent=d<1?'ก่อน Day 1':'Day '+d.toFixed(1);const r=frF(d);
 $('frMsg').innerHTML=`อัตรา ≈ <b>${r.toFixed(1)}</b> ปัญหา/ชม. → `+(d<1.9?'📈 ช่วงแรก: เริ่มเทส เจอบั๊กเพิ่มขึ้นเรื่อย ๆ':d<3.1?'🔥 ช่วงพีค: เจอบั๊กมากที่สุด (ระหว่าง Day 2–3)':d<4.3?'📉 อัตราลดลง: บั๊กที่เหลือน้อยลง':'🛑 แทบไม่เจอบั๊กใหม่ → สัญญาณพิจารณาหยุดเทส')}
frDraw();

/* ===== DEFECT SEEDING ===== */
const DS={S:20,N:0,it:[],rev:false,round:0};
function dsNew(){const count=Number($('dsS').value);if($('dsS').value.trim()===''||!Number.isInteger(count)||count<1||count>40){$('dsOut').textContent='กรอกจำนวนเต็ม 1–40 ตัวก่อนสร้างบ่อใหม่';return;}DS.S=count;DS.N=15+Math.floor(Math.random()*30);DS.rev=false;DS.round=0;
 const cells=shuffle([...Array(22*7).keys()]).slice(0,DS.S+DS.N);DS.it=cells.map((c,i)=>({c,seed:i<DS.S,f:false}));dsDraw()}
function dsRound(){DS.round++;DS.it.forEach(x=>{if(!x.f&&Math.random()<.35)x.f=true});dsDraw()}
function dsDraw(){let s=`<rect x="5" y="5" width="690" height="220" rx="30" fill="rgba(56,189,248,.12)" stroke="#7dd3fc" stroke-width="3"/>`;
 DS.it.forEach(x=>{const cx=35+(x.c%22)*30,cy=30+Math.floor(x.c/22)*29;
  if(x.f&&x.seed)s+=`<circle cx="${cx}" cy="${cy}" r="10" fill="#2563eb"></circle>`;
  else if(x.f)s+=`<text x="${cx}" y="${cy+6}" text-anchor="middle" font-size="18">🐞</text>`;
  else if(x.seed)s+=`<circle cx="${cx}" cy="${cy}" r="9" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="3 3"/>`;
  else if(DS.rev)s+=`<circle cx="${cx}" cy="${cy}" r="9" fill="none" stroke="#dc2626" stroke-width="2.5"/>`});
 $('dsSvg').innerHTML=s;const sF=DS.it.filter(x=>x.f&&x.seed).length,nF=DS.it.filter(x=>x.f&&!x.seed).length;
 let o=`รอบที่ ${DS.round} · บั๊กปลอมที่เจอ <b>${sF}/${DS.S}</b> · บั๊กจริงที่เจอ <b>${nF}</b><br>`;
 if(sF>0){const est=nF*DS.S/sF;o+=`① อัตราการเจอ = ${sF}/${DS.S} = <b>${(sF/DS.S*100).toFixed(0)}%</b><br>② บั๊กจริงทั้งหมด ≈ ${nF} × ${DS.S} ÷ ${sF} = <b>${est.toFixed(1)}</b><br>③ ยังเหลือที่ไม่เจอ ≈ <b style="font-size:1.3rem;color:var(--pri)">${Math.max(0,est-nF).toFixed(1)}</b> ตัว`}else o+='กด "เทส 1 รอบ" เพื่อเริ่ม';
 if(DS.rev)o+=`<br>👁️ เฉลย: บั๊กจริงมีทั้งหมด <b>${DS.N}</b> ตัว (วงแดง = ที่ยังไม่เจอ)`;$('dsOut').innerHTML=o}
dsNew();

/* ===== INSPECTION TIMELINE ===== */
let itMode='i';const PH=['Requirements','Design','Code','Test','Release'];
function itDraw(){$('itI').className='btn sm '+(itMode==='i'?'on':'ghost');$('itT').className='btn sm '+(itMode==='t'?'on':'ghost');
 const ap=itMode==='i'?[0,1,2]:[2,3];let s='';
 PH.forEach((p,i)=>{const x=20+i*148,on=ap.includes(i);s+=`<rect x="${x}" y="30" width="130" height="50" rx="12" fill="${on?(itMode==='i'?'#0891b2':'#dc2626'):'var(--soft)'}" stroke="#94a3b8" style="transition:.4s"/><text x="${x+65}" y="60" text-anchor="middle" font-weight="800" font-size="13" fill="${on?'#fff':'var(--text)'}">${p}</text>`;
  if(on)s+=`<text x="${x+65}" y="22" text-anchor="middle" font-size="18">${itMode==='i'?'🔍':'🧪'}</text>`;
  if(i<4)s+=`<path d="M${x+132},55 L${x+146},55" stroke="#94a3b8" stroke-width="3"/>`;
  const h=[10,22,40,70,110][i];s+=`<rect x="${x+40}" y="${195-h}" width="50" height="${h}" rx="5" fill="#f59e0b" opacity=".75"/>`});
 s+=`<text x="10" y="110" font-size="12" class="svgm">💰 ต้นทุนการแก้บั๊ก ถ้าเจอที่ phase นั้น (แนวโน้มสมมติ [อธิบายเสริม])</text>`;$('itSvg').innerHTML=s;
 $('itTxt').innerHTML=itMode==='i'?'🔍 <b>Inspection</b> ใช้ได้กับเอกสารระหว่างทาง (intermediate artifacts) เช่น requirements, design และโค้ด → <b>จับ defect ได้เร็ว</b> ตอนที่แก้ยังถูก · cost-effective · ช่วยกระจายความรู้ในทีม':'🧪 <b>Testing</b> ใช้ได้กับ <b>โค้ดเท่านั้น</b> → จับ defect ได้ <b>ช้า</b> (หลัง implementation) หาเจอง่าย แต่แก้แพง · ทว่า <b>จำเป็นต่อการวัดคุณภาพ</b> จึงต้องใช้ทั้งสองอย่างเสริมกัน'}
itDraw();


// Native keyboard activation for SVG controls, without changing their visual design.
document.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.matches('.testing-lab svg [role="button"]')){event.preventDefault();event.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
