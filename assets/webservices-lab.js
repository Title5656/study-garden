/* Deterministic teaching models. No cookies, tokens, SQL or network requests are created. */
(function(root){
  'use strict';
  const M={
    sessionStart:()=>({cookie:null,store:{},next:1,views:0}),
    sessionRequest(s){
      const store={...s.store}; let id=s.cookie, next=s.next;
      if(!id || !store[id]) id='sid-'+next++;
      store[id]=(store[id]||0)+1;
      return {cookie:id,store,next,views:store[id]};
    },
    sessionAction(s,action){
      if(action==='reset')return M.sessionStart();
      if(action==='forget')return {...s,cookie:null,views:0};
      if(action==='restart')return {...s,store:{},views:0};
      if(action==='logout'){const store={...s.store};delete store[s.cookie];return {...s,store,cookie:null,views:0};}
      return M.sessionRequest(s);
    },
    parseJSON(text){try{const value=JSON.parse(text);return {ok:true,value,type:value===null?'null':Array.isArray(value)?'array':typeof value};}catch{return {ok:false};}},
    cors(from,to,allow,credentials){const same=new URL(from).origin===new URL(to).origin;return {same,read:same || (allow===new URL(from).origin || (allow==='*'&&!credentials))};},
    token(state,forbidden){return state!=='valid'?401:forbidden?403:200;},
    crudStart:()=>[{id:1,name:'Nida'}],
    crud(db,method,id,name){
      const copy=db.map(x=>({...x})), index=copy.findIndex(x=>x.id===id);
      if(!Number.isInteger(id)||id<1||(['POST','PUT'].includes(method)&&!name.trim()))return {db:copy,status:400,data:'id ต้องเป็นจำนวนเต็มบวก และชื่อห้ามว่างเมื่อสร้างหรือแก้ไข'};
      if(method==='POST'){if(index>=0)return {db:copy,status:409,data:'id ซ้ำกับข้อมูลที่มีแล้ว'};copy.push({id,name:name.trim()});return {db:copy,status:201,data:copy.at(-1)};}
      if(index<0)return {db:copy,status:404,data:'ไม่พบ student id นี้'};
      if(method==='PUT')copy[index]={id,name:name.trim()};
      const data=copy[index];if(method==='DELETE')copy.splice(index,1);
      return {db:copy,status:200,data};
    }
  };
  if(typeof module==='object')module.exports=M;
  if(!root.document)return;
  root.WebServicesModel=M;
  document.querySelectorAll('[data-ws-lab]').forEach(lab=>{
    const type=lab.dataset.wsLab, out=lab.querySelector('[role=status]');
    const field=n=>lab.querySelector(`[name="${n}"]`);
    let session=M.sessionStart(),db=M.crudStart();
    function render(action){
      if(type==='session'){
        if(action)session=M.sessionAction(session,action);
        lab.querySelector('[data-client]').textContent='Browser cookie: '+(session.cookie||'ไม่มี session ID');
        lab.querySelector('[data-server]').textContent='Server store: '+JSON.stringify(session.store);
        out.textContent=session.views?`ตอบกลับ: อ่าน ${session.views} ครั้งใน session ${session.cookie} เพราะค้นข้อมูลด้วย ID จาก cookie`:'ยังไม่มีตัวนับของ request ใหม่ ลองคาดการณ์แล้วส่ง request; ลบ cookie ทำให้หา session เดิมไม่เจอ ส่วน restart ทำให้ MemoryStore ว่าง';
      }
      if(type==='json'){
        const r=M.parseJSON(field('json').value);
        out.textContent=r.ok?`แปลงสำเร็จ · ชนิด ${r.type}\n${JSON.stringify(r.value,null,2)}\nJSON.parse เปลี่ยนข้อความเป็นค่า; JSON.stringify เปลี่ยนค่ากลับเป็นข้อความ`:'แปลงไม่ได้: JSON ต้องใช้ double quotes ครอบ key/string ไม่มี trailing comma, comment หรือ undefined; แก้แล้วลองใหม่ได้';
      }
      if(type==='cors'){
        const r=M.cors(field('origin').value,'http://localhost:3000',field('allow').value,field('credentials').checked);
        out.textContent=r.same?'Same origin: JavaScript อ่าน response ได้โดยไม่ต้องผ่าน CORS':r.read?'Cross origin: อ่าน response ได้ เพราะ allow-origin ตรงกับหน้าเว็บ หรือเป็น * โดยไม่ส่ง credentials; แบบจำลองสมมติว่า allow-credentials: true เมื่อเปิด credentials':'Cross origin: browser ไม่ให้ JavaScript อ่าน response เพราะ allow-origin ไม่ตรง หรือใช้ * คู่กับ credentials; request แบบ simple อาจถึง server แล้ว CORS จึงไม่ใช่ระบบยืนยันตัวตน';
      }
      if(type==='token'){
        const status=M.token(field('token').value,field('forbidden').checked);
        out.textContent=status===401?'401: ไม่มี token ที่ผ่านการตรวจ จึงหยุดก่อน handler; decode payload อย่างเดียวไม่พิสูจน์ลายเซ็นหรืออายุ':status===403?'403: token ผ่านและรู้ว่าเป็นใคร แต่ไม่มีสิทธิ์ทำรายการนี้; authentication กับ authorization คนละขั้น':'200: ตรวจลายเซ็น/อายุและสิทธิ์ผ่าน จึงไป query ข้อมูล; ผลนี้จำลองเงื่อนไข ไม่ได้สร้างหรือ verify JWT จริง';
      }
      if(type==='crud'){
        if(action==='reset'){db=M.crudStart();out.textContent='เริ่มใหม่: มี Nida id 1 ลองอ่าน id 1 หรือสร้าง id 2';}
        else if(action==='send'){
          const r=M.crud(db,field('method').value,Number(field('id').value),field('student').value);db=r.db;
          out.textContent=`HTTP ${r.status}\n${JSON.stringify(r.data,null,2)}\n${r.status>=400?'คำขอไม่สำเร็จ ข้อมูลจึงคงเดิม':'ผลลัพธ์สะท้อนข้อมูลหลังทำคำขอ'}; สถานะเป็นสัญญาที่ออกแบบเพิ่มเพื่อเรียนรู้`;
        }
        lab.querySelector('[data-db]').textContent=JSON.stringify(db,null,2);
      }
    }
    lab.addEventListener('click',event=>{const b=event.target.closest('[data-ws-action]');if(b)render(b.dataset.wsAction);});
    lab.addEventListener('change',()=>{if(type==='cors'||type==='token')render();});
    render(type==='crud'?'reset':undefined);
  });
})(typeof window==='object'?window:globalThis);
