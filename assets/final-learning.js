(function () {
  'use strict';
  const core = window.FinalLearningCore;
  if (!core) return;
  const el = (tag, text, cls) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (cls) node.className = cls;
    return node;
  };
  function button(parent, text, fn) {
    const b = el('button', text, 'btn'); b.type = 'button'; b.addEventListener('click', fn); parent.append(b); return b;
  }
  function select(parent, label, values) {
    const l = el('label', label), s = el('select');s.setAttribute('aria-label',label);
    for (const [value, text] of values) {const o = el('option', text);o.value = value;s.append(o);}
    l.append(s);parent.append(l);return s;
  }
  function output(parent) {
    const o = el('div', '', 'fl-result');o.setAttribute('role','status');parent.append(o);return o;
  }
  function architecture(root) {
    const controls = el('div', undefined, 'fl-controls');root.append(controls);
    const mode = select(controls, 'โครงสร้าง', [['direct','เรียก Provider โดยตรง'],['adapter','ผ่าน Adapter']]);
    const change = select(controls, 'สิ่งที่เปลี่ยน', [['provider','รูปแบบของ Provider'],['ui','หน้าจอ Checkout']]);
    const contract = select(controls, 'สัญญาของ Adapter', [['stable','รักษาสัญญาเดิมได้'],['changed','ต้องเปลี่ยนสัญญาด้วย']]);
    const fig = el('figure'), graph = el('div', undefined, 'fl-dependencies');
    fig.append(graph, el('figcaption','ลูกศร → หมายถึงพึ่งพา · คำว่า “ตรวจ” ระบุส่วนที่อาจได้รับผลกระทบ'));root.append(fig);
    const out = output(root);
    function render() {
      contract.disabled = mode.value === 'direct' || change.value === 'ui';
      const result = core.architecture(mode.value,change.value,contract.value === 'changed');
      graph.replaceChildren();
      const clients = el('div', undefined, 'fl-client-stack');
      function card(name) {return el('div',`${result.affected.includes(name)?'ตรวจ · ':''}${name}`, 'fl-component'+(result.affected.includes(name)?' fl-affected':''));}
      ['Checkout','Refund','Report'].forEach(name=>clients.append(card(name)));
      graph.append(clients,el('span','→','fl-arrow'));
      if (mode.value==='adapter') graph.append(card('Adapter'),el('span','→','fl-arrow'));
      graph.append(card('Provider'));
      graph.dataset.mode = mode.value;
      out.textContent = `ควรตรวจ ${result.affected.length} ส่วน: ${result.affected.join(', ')}. ` +
        (change.value==='ui' ? 'การเปลี่ยนหน้าจอในกรณีนี้ไม่เปลี่ยนสัญญาของบริการที่เรียกใช้'
          :mode.value==='direct' ? 'ทุกผู้เรียกรู้รายละเอียด Provider จึงต้องตามตรวจเมื่อรูปแบบเปลี่ยน'
            :contract.value==='stable' ? 'Adapter แปลงรูปแบบใหม่ให้ยังตรงสัญญาเดิม ผู้ใช้สัญญาไม่ต้องรู้รายละเอียดใหม่ แต่ยังต้องทดสอบ integration'
              :'เมื่อสัญญาที่ผู้เรียกใช้เปลี่ยน ขอบเขตเดิมไม่สามารถกั้นผลกระทบนี้ได้');
    }
    [mode,change,contract].forEach(s=>s.addEventListener('change',render));
    button(controls,'เริ่มใหม่',()=>{mode.value='direct';change.value='provider';contract.value='stable';render();});render();
  }
  function review(root) {
    const controls = el('div', undefined, 'fl-controls');root.append(controls);
    const variant = select(controls,'การเปลี่ยนโค้ด',[['original','โค้ดเดิม'],['refactor','แยกตัวแปร · เงื่อนไขเดิม'],['fix','แก้เงื่อนไขให้รวม 1000']]);
    const label = el('label','ยอดที่อยากลอง (บาท)'), amount = el('input');amount.type='number';amount.min='0';amount.max='1000000';amount.step='0.01';amount.value='1000';label.append(amount);controls.append(label);
    const sliderLabel=el('label','ลากสำรวจยอด 0–2000 บาท'),slider=el('input');slider.type='range';slider.min='0';slider.max='2000';slider.step='1';slider.value='1000';sliderLabel.append(slider);root.append(sliderLabel);
    const receipts=el('div',undefined,'il-receipts');root.append(receipts);
    const pre = el('pre'), code = el('code');pre.append(code);root.append(pre);
    const cases = el('div',undefined,'fl-cases');root.append(cases);const out = output(root);
    const snippets = {
      original:'// กติกา: ตั้งแต่ 1000 ลด 10%\nfunction total(amount) {\n  return amount > 1000 ? amount * 0.9 : amount;\n}',
      refactor:'// แยกตัวแปร แต่ยังคงเงื่อนไขเดิม\nfunction total(amount) {\n  const eligible = amount > 1000;\n  return eligible ? amount * 0.9 : amount;\n}',
      fix:'// รวมยอดที่เท่ากับ 1000 ตามกติกา\nfunction total(amount) {\n  return amount >= 1000 ? amount * 0.9 : amount;\n}'
    };
    function clear() {
      code.textContent=snippets[variant.value];cases.replaceChildren();out.textContent='คาดการณ์ผลก่อน แล้วกดทดสอบค่าขอบ';receipts.replaceChildren();
      if(!amount.value.trim()||!amount.checkValidity())return;
      const value=Number(amount.value),want=core.price(value,'fix'),actual=core.price(value,variant.value);
      for(const [title,total,pass] of [['ยอดสินค้า',value,null],['ควรจ่ายตามกติกา',want,true],['โค้ดนี้คิดได้',actual,actual===want]]){
        const receipt=el('div',undefined,'il-receipt');if(pass!==null)receipt.dataset.pass=String(pass);receipt.append(el('small',title),el('strong',total.toFixed(2)),el('small','บาท'));receipts.append(receipt);
      }
    }
    slider.addEventListener('input',()=>{amount.value=slider.value;clear();});
    amount.addEventListener('input',()=>{slider.value=String(Math.min(2000,Math.max(0,Number(amount.value)||0)));});
    button(controls,'ทดสอบค่าขอบ',()=>{
      if (!amount.value.trim() || !amount.checkValidity()) {out.textContent='ใส่ยอด 0–1,000,000 บาท ไม่เกินสองตำแหน่งทศนิยม';return;}
      const values = [...new Set([999,1000,1001,Number(amount.value)])];
      const table = el('table'), caption = el('caption','ผลที่ได้เทียบกติกา (บาท)');table.append(caption);
      const head = el('tr');['ยอด','ควรจ่าย','ได้จริง','ผล'].forEach(t=>{const th=el('th',t);th.scope='col';head.append(th);});const thead=el('thead');thead.append(head);table.append(thead);
      const tbody=el('tbody');let failed=0;
      values.forEach(value=>{const want=core.price(value,'fix'), actual=core.price(value,variant.value), row=el('tr');
        if (want!==actual) failed++;
        [value.toFixed(2),want.toFixed(2),actual.toFixed(2),want===actual?'ผ่าน':'ต่างจากกติกา'].forEach(t=>row.append(el('td',t)));tbody.append(row);
      });table.append(tbody);cases.replaceChildren(table);
      out.textContent = failed ? `พบ ${failed} กรณีที่ต่างจากกติกา: > ไม่รวมยอดที่เท่ากับ 1000 การแยกตัวแปรเดิมจึงยังไม่แก้ defect`
        : 'ผ่านชุดกรณีนี้: >= รวมค่าขอบ 1000 แล้ว นี่เป็น bug fix ที่เปลี่ยนพฤติกรรมตาม requirement';
    });
    button(controls,'เริ่มใหม่',()=>{variant.value='original';amount.value='1000';slider.value='1000';clear();});
    variant.addEventListener('change',clear);amount.addEventListener('input',clear);clear();
  }
  function merge(root) {
    const controls=el('div',undefined,'fl-controls');root.append(controls);
    const scenario=select(controls,'การแก้ของสอง branch',[['different','แก้คนละ field'],['conflict','แก้ fee ต่างกัน'],['same','แก้ fee เป็นค่าเดียวกัน']]);
    const graph=el('figure',undefined,'fl-history');root.append(graph);
    const resolution=el('div',undefined,'fl-controls');root.append(resolution);
    const choice=select(resolution,'ค่าที่ตกลงให้ fee เป็น',[['','เลือกหลังตรวจความต้องการ'],['20','20 · ตาม main'],['0','0 · ตาม feature']]);
    const out=output(root);out.tabIndex=-1;let stage=0, result;
    const base={title:'Shop',fee:'50'};
    function variants(){return scenario.value==='different'?[{title:'Garden',fee:'50'},{title:'Shop',fee:'0'}]:[{title:'Shop',fee:scenario.value==='same'?'0':'20'},{title:'Shop',fee:'0'}];}
    function commit(label,value) {const card=el('div',undefined,'fl-commit');card.append(el('strong',label),el('pre',`title=${value.title}\nfee=${value.fee}`));return card;}
    function draw() {
      graph.replaceChildren(commit('B · ฐานร่วม',base));
      if(stage>0){const [main,feature]=variants(),fork=el('div',undefined,'fl-fork');fork.append(commit('M · main',main),commit('F · feature',feature));graph.append(el('p','↙ แตกจาก B ↘'),fork);}
      if(stage===3) graph.append(el('p','M + F → C · มี parent สองตัว'),commit('C · main หลังรวม',result.values));
      graph.append(el('figcaption',stage===0?'main และ feature เริ่มที่ B':stage===3?'C เก็บผลรวมจาก M และ F; feature ยังชี้ F':'M และ F มีฐานร่วม B; ยังไม่มี commit ผลรวม'));
      step.disabled=stage>=2;step.textContent=stage===0?'สร้าง commit ทั้งสองฝั่ง':'ลองรวมเข้า main';
      resolution.hidden=stage!==2;
    }
    const confirm=button(resolution,'บันทึกผลที่ตกลง',()=>{
      if(choice.value===''){out.textContent='เลือกค่าหลังตรวจ requirement ก่อนบันทึกผลรวม';return;}
      result.values.fee=choice.value;stage=3;draw();out.textContent=`สร้าง C โดยเลือก fee=${choice.value} นี่คือการตัดสินใจของทีม ต้องตรวจ requirement และทดสอบ ไม่ใช่คำตอบที่ Git เลือกให้`;out.focus();
    });
    const step=button(controls,'สร้าง commit ทั้งสองฝั่ง',()=>{
      if(stage===0){stage=1;out.textContent='ทั้งสองฝั่งมี commit ของตัวเองแล้ว ลองใช้ฐาน B เปรียบเทียบก่อนรวม';}
      else {result=core.merge(base,...variants());stage=result.conflicts.length?2:3;out.textContent=result.conflicts.length?'ขัดแย้งที่ fee: ทั้งสองฝั่งเปลี่ยนจากฐานเป็นคนละค่า ต้องตรวจ requirement แล้วตกลงผล':'รวม field ได้โดยไม่ขัดแย้ง แต่ยังต้องทดสอบพฤติกรรมของผลรวม';}
      draw();
      if(stage===2)choice.focus();else if(stage===3)out.focus();
    });
    function reset(){stage=0;choice.value='';out.textContent='เริ่มจากฐานร่วม B ก่อนแยกทำงาน';draw();}
    button(controls,'เริ่มใหม่',reset);scenario.addEventListener('change',reset);reset();
  }
  const labs={architecture,review,merge};
  document.querySelectorAll('[data-final-lab]').forEach(root=>labs[root.dataset.finalLab]?.(root));

  document.querySelectorAll('[data-final-checks]').forEach(root=>{
    const questions=JSON.parse(root.querySelector('script').textContent), ui=root.querySelector('.fl-check-ui');
    const allowed=questions.map(q=>q.id), key=`study-garden:final-learning:v1:${document.body.dataset.subject}:${document.body.dataset.chapter}`;
    let solved=[], index=0, storageFailed=false;
    try {solved=core.sanitizeProgress(JSON.parse(localStorage.getItem(key)),allowed);} catch {storageFailed=true;}
    function save(){try {localStorage.setItem(key,JSON.stringify(solved));} catch {storageFailed=true;}}
    const status=el('p',undefined,'fl-progress'), notice=el('p',undefined,'fl-limit'), form=el('form'), field=el('fieldset'), legend=el('legend');
    const feedback=output(ui), controls=el('div',undefined,'fl-controls');
    form.append(field);ui.prepend(status,notice,form);ui.append(controls);
    const check=el('button','ตรวจคำตอบ','btn');check.type='submit';form.append(check);
    const next=button(controls,'ข้อต่อไป →',()=>{index=(index+1)%questions.length;render();legend.focus();});next.hidden=true;
    button(controls,'เริ่มชุดฝึกใหม่',()=>{index=0;render();legend.focus();});
    const resetDetails=el('details'), summary=el('summary','จัดการความคืบหน้าชุดนี้');resetDetails.append(summary);ui.append(resetDetails);
    button(resetDetails,'ล้างความคืบหน้าชุดนี้',()=>{solved=[];save();index=0;render();});
    function progress(){status.textContent=`ทำได้แล้ว ${solved.length} / ${questions.length} ข้อ${solved.length===questions.length?' · ผ่านโจทย์ประยุกต์ชุดนี้':''}`;notice.textContent=storageFailed?'บันทึกถาวรไม่ได้ในเบราว์เซอร์นี้ แต่ยังฝึกต่อได้ในหน้านี้':'เก็บเฉพาะข้อที่ทำได้ในเบราว์เซอร์นี้ · เริ่มชุดฝึกใหม่ได้โดยไม่เสียความคืบหน้า';}
    function render(){
      const q=questions[index];field.replaceChildren(legend);legend.textContent=`ข้อ ${index+1}: ${q.q}`;legend.tabIndex=-1;
      q.options.forEach((text,i)=>{const label=el('label',undefined,'fl-option'),radio=el('input');radio.type='radio';radio.name='fl-answer';radio.value=String(i);radio.required=true;label.append(radio,el('span',text));field.append(label);});
      feedback.replaceChildren();next.hidden=true;check.disabled=false;progress();
    }
    form.addEventListener('change',()=>{feedback.replaceChildren();next.hidden=true;check.disabled=false;});
    form.addEventListener('submit',event=>{
      event.preventDefault();const picked=form.querySelector('input:checked');if(!picked)return;
      const q=questions[index], correct=Number(picked.value)===q.answer;
      if(correct&&!solved.includes(q.id)){solved.push(q.id);save();}
      feedback.replaceChildren(el('strong',correct?'ถูกต้อง · อธิบายเหตุผลให้ตัวเองอีกครั้ง':'ยังไม่ตรง · ใช้เหตุผลนี้แล้วลองใหม่'),el('p',q.why));
      const link=el('a','กลับไปทบทวนแนวคิด');link.href='#'+q.link;feedback.append(link);
      next.hidden=!correct;next.textContent=index===questions.length-1?'กลับไปฝึกข้อแรก':'ข้อต่อไป →';check.disabled=correct;progress();
    });
    root.classList.add('fl-enhanced');ui.hidden=false;render();
  });
})();
