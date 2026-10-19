(function(){
  'use strict';
  const $=(s,el=document)=>el.querySelector(s);
  const $$=(s,el=document)=>[...el.querySelectorAll(s)];
  const activities=window.EcommerceActivities;
  if(!activities||document.body.dataset.subject!=='itds294')return;
  const number=(n,d=2)=>n.toLocaleString('th-TH',{maximumFractionDigits:d});
  const make=(tag,text,className)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el};

  $$('.ec-stepper').forEach(lab=>{
    const steps=activities.steps[lab.dataset.stepper];
    if(!steps)return;
    let index=0;
    const track=$('.ec-track',lab),stage=$('.ec-stage',lab);
    const buttons=steps.map((step,i)=>{
      const button=make('button',`${i+1} · ${step[0]}`);
      button.type='button';button.addEventListener('click',()=>{index=i;render()});track.append(button);return button;
    });
    function render(){
      buttons.forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===index));button.classList.toggle('is-complete',i<index)});
      const [title,text,path]=steps[index];
      stage.replaceChildren(make('div',path,'ec-path'),make('h4',title),make('p',text));
      $('[data-step-position]',lab).textContent=`${index+1} / ${steps.length}`;
      $('[data-step-prev]',lab).disabled=index===0;
      $('[data-step-next]',lab).disabled=index===steps.length-1;
    }
    $('[data-step-prev]',lab).addEventListener('click',()=>{if(index>0){index--;render()}});
    $('[data-step-next]',lab).addEventListener('click',()=>{if(index<steps.length-1){index++;render()}});
    $('[data-step-reset]',lab).addEventListener('click',()=>{index=0;render()});
    render();
  });

  const platform=[
    ['ทีมเล็ก · เริ่มใน 2 สัปดาห์','เริ่มทดสอบผ่านบริการที่พร้อม','SaaS หรือ marketplace ช่วยลดเวลาสร้างพื้นฐาน เปรียบเทียบค่าบริการ ข้อมูลที่ได้ และข้อจำกัดก่อนเลือก ถ้ามีผู้ซื้อเดิมอยู่ในตลาดกลางอาจเริ่มทดสอบได้เร็ว ตัวเลือกนี้เป็นแนวคิดจากเงื่อนไข ไม่ใช่คำแนะนำผลิตภัณฑ์เฉพาะ'],
    ['มีกฎอนุมัติหลายฝ่าย','พิจารณาระบบที่เชื่อมงานเฉพาะได้','เริ่มจากเขียนกฎงาน ข้อมูล และสิทธิ์ อาจต้องใช้แพลตฟอร์มที่ต่อยอดได้หรือพัฒนาเฉพาะบางส่วน ดูว่าทีมดูแลระยะยาวไหวหรือไม่ ไม่จำเป็นต้องสร้างทุกส่วนเอง'],
    ['ขายหลายช่องทาง','จัดข้อมูลและความรับผิดให้ตรงกัน','หน้าร้านเองอาจใช้สร้างประสบการณ์ ส่วน marketplace ใช้เข้าถึงผู้ซื้อ ต้องจัดสต็อก ราคา รายการ และบริการหลังขายให้สอดคล้องกัน พร้อมตรวจต้นทุนรวมและการพึ่งพาแพลตฟอร์ม']
  ];
  const revenueExamples={
    Advertising:'สมมติขายพื้นที่ได้ 10,000 ครั้ง × 0.05 บาท = รายได้ 500 บาท ผู้ลงโฆษณาเป็นผู้จ่าย',
    Subscription:'สมมติมีผู้จ่ายจริง 100 คน × 99 บาท/เดือน = รายได้ 9,900 บาท/เดือน ผู้ใช้ฟรีไม่รวมในจำนวนนี้',
    'Transaction fee':'สมมติ 1,000 รายการ × ค่าบริการ 10 บาท = รายได้ 10,000 บาท ยอดมูลค่าธุรกรรมทั้งหมดเป็นอีกจำนวน',
    Sales:'สมมติขาย 100 ชิ้น × 250 บาท = รายได้ 25,000 บาท ยังต้องหักต้นทุนสินค้าและค่าใช้จ่าย',
    Affiliate:'สมมติรายการส่งต่อที่เข้าเงื่อนไข 100 รายการ × ค่าตอบแทน 20 บาท = รายได้ 2,000 บาท'
  };
  $$('.ec-explorer').forEach(lab=>{
    const key=lab.dataset.explorer;
    const source=key==='platform'?platform:$$('tbody tr',lab.closest('.lesson-section')).map(row=>$$('td',row).map(cell=>cell.textContent.trim()));
    const choice=$('.ec-choice',lab),stage=$('.ec-stage',lab);
    const buttons=source.map((row,index)=>{
      const button=make('button',row[0],'btn tiny');button.type='button';button.addEventListener('click',()=>render(index));choice.append(button);return button;
    });
    function render(index){
      buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
      const row=source[index];
      stage.replaceChildren(make('h4',row[0]),...row.slice(1).map(text=>make('p',text)));
      if(key==='revenue'&&revenueExamples[row[0]])stage.append(make('div',revenueExamples[row[0]],'note'));
    }
    if(source.length)render(0);
  });

  // Invalid or empty inputs stay visible as a useful message, never NaN/Infinity.
  function inputs(ids,output){
    const fields=ids.map(id=>$('#'+id));
    if(fields.some(el=>el.value.trim()===''||!el.checkValidity()||!Number.isFinite(Number(el.value)))){
      output.textContent='กรอกค่าที่ถูกต้องตามช่วงกำหนดให้ครบ เพื่อคำนวณใหม่';return null;
    }
    return fields.map(el=>Number(el.value));
  }
  function metric(label,value){const card=make('div',undefined,'ec-metric');card.append(make('span',label),make('strong',value));return card}
  const funnel=$('#funnel-lab');
  if(funnel){
    const output=$('#funnel-output'),bars=$('#funnel-bars');
    function render(){
      const values=inputs(['f-impressions','f-ctr','f-cvr','f-spend','f-aov'],output);
      if(!values){bars.replaceChildren();return}
      const [impressions,ctr,cvr,spend,aov]=values;
      const result=EcommerceCore.funnel(impressions,ctr,cvr,spend,aov);
      bars.replaceChildren();
      [['Impressions',impressions],['Clicks',result.clicks],['Orders',result.orders]].forEach(([label,value])=>{
        const row=make('div',undefined,'ec-bar-row');const fill=make('i');fill.style.width=`${impressions>0?value/impressions*100:0}%`;
        const rail=make('div',undefined,'ec-bar-rail');rail.append(fill);
        row.append(make('span',label),rail,make('b',number(value)));bars.append(row);
      });
      const grid=make('div',undefined,'ec-metrics');
      const cost=n=>n===null?'คำนวณไม่ได้':number(n)+' บาท';
      grid.append(metric('รายได้คาดหมาย',cost(result.revenue)),metric('CPC',cost(result.cpc)),metric('CPA ต่อออร์เดอร์',cost(result.cpa)),metric('ROAS',result.roas===null?'คำนวณไม่ได้':number(result.roas)+' เท่า'));
      output.replaceChildren(grid,make('p',`${number(impressions)} × ${ctr}% = ${number(result.clicks)} คลิก; ${number(result.clicks)} × ${cvr}% = ${number(result.orders)} ออร์เดอร์; × ${number(aov)} บาท = ${number(result.revenue)} บาท`,'small'));
    }
    funnel.addEventListener('input',render);render();
  }

  const location=$('#location-lab');
  if(location){
    function render(){
      const distance=Number($('#customer-distance').value),radius=Number($('#offer-radius').value),consent=$('#location-consent').checked;
      $('#distance-label').value=distance;$('#radius-label').value=radius;
      $('.ec-zone',location).style.width=`${radius/1000*82}%`;
      $('.ec-customer',location).style.left=`${8+distance/1000*82}%`;
      const text=!consent?'ผู้ใช้ไม่เลือกรับข้อเสนอ → ไม่แสดงข้อเสนอ แม้อยู่ในพื้นที่':distance<=radius?`อยู่ในพื้นที่ (${distance} ≤ ${radius} เมตร) → เข้าเงื่อนไขแสดงข้อเสนอจำลอง ต้องตรวจความเกี่ยวข้องและความถี่ต่อ`:`อยู่นอกพื้นที่ (${distance} > ${radius} เมตร) → ยังไม่แสดงข้อเสนอในแบบจำลองนี้`;
      $('#location-output').textContent=text;
    }
    location.addEventListener('input',render);render();
  }

  const finance=$('#finance-lab');
  if(finance){
    const output=$('#finance-output'),chart=$('#finance-chart'),table=$('#finance-table');
    function svg(tag,attrs,text){const el=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);if(text!==undefined)el.textContent=text;return el}
    function render(){
      const values=inputs(['m-price','m-variable','m-fixed','m-volume'],output);
      if(!values){chart.hidden=true;table.replaceChildren();return}
      chart.hidden=false;
      const[price,variable,fixed,volume]=values,result=EcommerceCore.finance(...values);
      const grid=make('div',undefined,'ec-metrics');
      grid.append(metric('ส่วนเกิน/รายการ',number(result.margin)+' บาท'),metric('จุดคุ้มทุน',result.breakEven===null?'ไม่มีในโมเดลนี้':number(result.breakEven,0)+' รายการ'),metric('รายได้',number(result.revenue)+' บาท'),metric('กำไรตามแบบจำลอง',number(result.profit)+' บาท'));
      const explanation=result.breakEven===null?'ส่วนเกินไม่เป็นบวก จึงเพิ่มจำนวนอย่างเดียวเพื่อชดเชยต้นทุนคงที่ไม่ได้':`${number(price)} × ${number(volume)} − (${number(fixed)} + ${number(variable)} × ${number(volume)}) = ${number(result.profit)} บาท/เดือน`;
      output.replaceChildren(grid,make('p',explanation,'small'));
      const xMax=Math.max(1,volume*1.3,Math.min(result.breakEven??0,Math.max(volume*3,1000))*1.3);
      const yMax=Math.max(1,price*xMax,fixed+variable*xMax)*1.13;
      const x=n=>65+n/xMax*540,y=n=>260-n/yMax*220;
      $$('g',chart).forEach(el=>el.remove());const group=svg('g',{});
      for(let i=0;i<=4;i++){
        const xv=xMax*i/4,yv=yMax*i/4;
        group.append(svg('line',{x1:65,y1:y(yv),x2:605,y2:y(yv),class:'ec-gridline'}),svg('text',{x:57,y:y(yv)+4,'text-anchor':'end'},number(yv,0)),svg('text',{x:x(xv),y:282,'text-anchor':'middle'},number(xv,0)));
      }
      group.append(svg('text',{x:65,y:19},'บาท/เดือน'),svg('text',{x:605,y:312,'text-anchor':'end'},'รายการ/เดือน'));
      group.append(svg('path',{d:`M ${x(0)} ${y(0)} L ${x(xMax)} ${y(price*xMax)}`,class:'ec-revenue'}));
      group.append(svg('path',{d:`M ${x(0)} ${y(fixed)} L ${x(xMax)} ${y(fixed+variable*xMax)}`,class:'ec-cost'}));
      const exact=result.margin>0?fixed/result.margin:result.breakEven;
      if(exact!==null&&exact<=xMax)group.append(svg('circle',{cx:x(exact),cy:y(price*exact),r:5,class:'ec-intersection'}));
      chart.append(group);
      const htmltable=make('table'),thead=make('thead'),head=make('tr');['จำนวน/เดือน','รายได้ (บาท)','ต้นทุนรวม (บาท)','กำไร (บาท)'].forEach(text=>{const th=make('th',text);th.scope='col';head.append(th)});thead.append(head);htmltable.append(thead);
      const body=make('tbody');
      [...new Set([0,Math.round(volume/2),volume,...(result.breakEven!==null?[result.breakEven]:[])])].sort((a,b)=>a-b).forEach(count=>{const value=EcommerceCore.finance(price,variable,fixed,count);const row=make('tr');[count,value.revenue,value.cost,value.profit].forEach(n=>row.append(make('td',number(n))));body.append(row)});
      htmltable.append(body);const wrap=make('div',undefined,'table-wrap');wrap.tabIndex=0;wrap.setAttribute('role','region');wrap.setAttribute('aria-label','ข้อมูลประกอบกราฟจุดคุ้มทุน');wrap.append(htmltable);table.replaceChildren(wrap);
    }
    finance.addEventListener('input',render);render();
  }

  $$('.ec-worksheet').forEach(lab=>{
    const key='study-garden:itds294:draft:'+lab.dataset.worksheet,fields=$$('textarea[data-field]',lab),status=$('[data-draft-status]',lab);
    try{const draft=JSON.parse(localStorage.getItem(key)||'{}');fields.forEach(el=>{if(typeof draft?.[el.dataset.field]==='string')el.value=draft[el.dataset.field]})}catch{status.textContent='ไม่สามารถอ่านร่างที่บันทึกไว้ ดาวน์โหลดเพื่อเก็บสำเนาได้'}
    function save(){
      const value=Object.fromEntries(fields.map(el=>[el.dataset.field,el.value]));
      try{localStorage.setItem(key,JSON.stringify(value));status.textContent='บันทึกร่างในเบราว์เซอร์นี้แล้ว'}catch{status.textContent='เก็บร่างได้เฉพาะหน้านี้ กรุณาดาวน์โหลดเพื่อเก็บสำเนา';const notice=$('#storage-notice');if(notice)notice.hidden=false}
    }
    lab.addEventListener('input',save);
    $('[data-fill-example]',lab).addEventListener('click',()=>{fields.forEach(el=>{el.value=activities.worksheets[lab.dataset.worksheet][el.dataset.field]||''});save()});
    $('[data-download]',lab).addEventListener('click',()=>{
      const text='ITDS294 · ใบงานฝึกคิด\n\n'+fields.map(el=>el.closest('label').firstChild.textContent.trim()+'\n'+el.value).join('\n\n');
      const url=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'}));
      const a=make('a');a.href=url;a.download='itds294-'+lab.dataset.worksheet+'-worksheet.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='สร้างไฟล์ใบงานสำหรับดาวน์โหลดแล้ว';
    });
  });
})();
