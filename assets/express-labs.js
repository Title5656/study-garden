(function(){
 'use strict';const core=window.ExpressLessonCore;
 const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
 function select(root,label,values){const l=el('label',label),s=el('select');for(const v of values){const o=el('option',v);o.value=v;s.append(o);}l.append(s);root.append(l);return s;}
 function input(root,label,value){const l=el('label',label),i=el('input');i.value=value;l.append(i);root.append(l);return i;}
 function button(root,text,fn){const b=el('button',text);b.className='btn';b.type='button';b.addEventListener('click',fn);root.append(b);return b;}
 for(const root of document.querySelectorAll('[data-express-lab]')){
  root.replaceChildren();const controls=el('div');controls.className='node-controls';root.append(controls);const out=el('output');out.className='node-output';out.setAttribute('aria-live','polite');root.append(out);
  const kind=root.dataset.expressLab;
  if(kind==='route'||kind==='middleware'){
   const m=select(controls,'HTTP method',['GET','POST']),p=input(controls,'Request path','/product/add'),order=select(controls,'ตำแหน่ง 404',['ท้าย routes','ก่อน routes']);
   const run=()=>{const r=core.route(m.value,p.value,order.selectedIndex===1);out.textContent=`${m.value} ${p.value}\n${order.selectedIndex===1?'404 middleware จบ response ก่อนถึง handler':'Router เลือก handler ตาม method และ path'}\nStatus ${r.status}\n${r.body}`;};button(controls,'ส่ง request',run);run();
  }else if(kind==='static'){
   const mount=select(controls,'Mount path',['/','/assets']),p=input(controls,'URL ของ resource','/images/sample.png');const run=()=>{const f=core.staticFile(p.value,mount.value);out.textContent=f?`200 → ${f}\nชื่อโฟลเดอร์ public ไม่ได้อยู่ใน URL`:'404 → ไม่พบไฟล์ในชุดจำลอง (มี mystyle.css และ images/sample.png)';};button(controls,'ค้นหาไฟล์',run);mount.addEventListener('change',run);run();
  }else if(kind==='form'){
   const method=select(controls,'วิธีส่ง',['GET','POST']),fname=input(controls,'First name','John'),lname=input(controls,'Last name','Doe'),parser=select(controls,'Body parser',['เปิด','ปิด']),type=select(controls,'Content-Type',['urlencoded','json']);
   const run=()=>{const r=core.form(method.value,fname.value,lname.value,parser.value==='เปิด',type.value);out.textContent=`${method.value} ${r.url}\nBody: ${r.payload||'(ไม่มี)'}\n${method.value==='GET'?'req.query':'req.body'}: ${JSON.stringify(r.data)}\nStatus ${r.status}\n${r.message}\n`+(r.status===200?'ขั้นต่อไป: ทำงานกับข้อมูล แล้ว redirect ไปหน้าสำเร็จ (แบบจำลอง)':'ส่งฟอร์มเดิมกลับพร้อมข้อมูลและข้อความผิดพลาด');};button(controls,'ส่งฟอร์มจำลอง',run);run();
  }else if(kind==='setup'){
   const steps=['mkdir myFirstExpress และ cd เข้าโฟลเดอร์','npm init -y → สร้าง package.json','npm install express → dependencies และ package-lock.json','npm install --save-dev nodemon → devDependencies','สร้าง app.cjs แล้วตั้ง scripts.start = node app.cjs','npm start → Server listening on port: 3000'];let i=0;const show=()=>{out.textContent=`ขั้น ${i+1}/${steps.length}\n${steps[i]}`;prev.disabled=i===0;next.disabled=i===steps.length-1;};const prev=button(controls,'← ขั้นก่อน',()=>{i--;show();}),next=button(controls,'ขั้นต่อไป →',()=>{i++;show();});show();
  }else if(kind==='template'){
   const name=input(controls,'ชื่อที่ได้จากข้อมูล','John');const run=()=>{out.textContent=`Template: Hello, {{name}}\nข้อมูล: ${JSON.stringify({name:name.value})}\nผลข้อความใน HTML: Hello, ${name.value}\nจำลองแนวคิดเท่านั้น ไม่ใช่ syntax ของ EJS/Pug; template engine จริงต้อง escape ข้อมูลตามบริบท`;};name.addEventListener('input',run);run();
  }
 }
})();
