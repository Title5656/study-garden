/* Per-chapter mini labs, no external services. Progress relies on StudyApp. */
(function(){'use strict';
 const node=document.querySelector('[data-thermo-widget]');
 if(!node||!window.ThermoCore)return;
 const k=window.ThermoCore;
 const svg=node.querySelector('.thermo-lab-svg');
 const bar=svg.querySelector('.thermo-dynamic-bar');
 const txt=svg.querySelector('.thermo-lab-inline');
 const output=node.querySelector('#thermo-output');
 const note=node.querySelector('#thermo-lab-note');
 const kind=node.dataset.thermoWidget;
 const number=id=>Number(node.querySelector('[data-thermo-input="'+id+'"]')?.value);
 const fmt=(n,d=1)=>new Intl.NumberFormat('th-TH',{maximumFractionDigits:d,minimumFractionDigits:d}).format(n);
 const paint=(fraction,label)=>{
  const f=Math.max(0.02,Math.min(1,fraction));bar.setAttribute('width',String(Math.round(320*f)));
  txt.textContent=label;
 };
 function render(){
  node.querySelectorAll('[data-thermo-input]').forEach(input=>{const el=node.querySelector('#thermo-value-'+input.dataset.thermoInput);if(el)el.textContent=input.value;});
  let result='',hint='',p=0.5,label='ผลลัพธ์';
  switch(kind){
   case 'piston': {
    const v=number('volume'),P=k.piston(v);p=2/v;label='P ∝ 1/V';
    const y=108-(v-2)/18*80;node.querySelector('[data-thermo-piston]')?.setAttribute('y',y.toFixed(1));
    const gas=node.querySelector('[data-thermo-gas]');if(gas){gas.setAttribute('y',(y+13).toFixed(1));gas.setAttribute('height',(149-y-13).toFixed(1));}result=fmt(P,1)+' kPa';hint='PV=nRT; เมื่อ V เพิ่ม P ลด (T=300 K, n=1 mol), ไม่ใช่ความดันที่คงทุกกระบวนการ';break;}
   case 'energy':{
    const Q=number('heat'),W=number('work'),d=k.energy(Q,W);p=(d+200)/400;label='ΔU = Q − Wout';result=(d>=0?'+':'')+fmt(d,0)+' kJ';hint='งาน Wout บวกเมื่อระบบทำงานออก; งานที่ป้อนเข้าสู่ระบบจะเป็น Wout ติดลบ';break;}
   case 'virial':{
    const P=number('pressure'),z=k.virial(P);p=z;label='Z = PṼ / RT';result='Z ≈ '+fmt(z,3);hint='Z≈1+B P/RT ที่ B=−0.12 L/mol, T=400 K ใช้เป็นแบบจำลองสองพจน์สำหรับก๊าซช่วงเหมาะสมเท่านั้น';break;}
   case 'heat':{
    const T=number('temperature'),q=k.sensible(T);p=(T-20)/75;label='Q = mCp ΔT';result=fmt(q,1)+' kJ';hint='ใช้ Cp คงที่ของน้ำเหลว 2 kg (4.18 kJ/kgK) จาก 20°C; ห้ามผ่านการเปลี่ยนเฟสในแบบจำลองนี้';break;}
   case 'carnot':{
    const hot=number('hot'),eta=k.carnot(hot);p=eta;label='ηmax = 1 − Tc/Th';result=fmt(eta*100,1)+'% สูงสุด';hint='TH='+hot+' K, TC=300 K; ค่า Carnot เป็นเพดานเมื่อย้อนกลับได้ระหว่าง reservoir สองแหล่ง';break;}
   case 'quality':{
    const x=number('quality')/100,h=k.qualityH(x);p=x;label='x = mไอ / mรวม';
    node.querySelector('[data-thermo-liquid]')?.setAttribute('width',(250*(1-x)).toFixed(1));
    node.querySelector('[data-thermo-vapor]')?.setAttribute('width',(250*x).toFixed(1));result='h ≈ '+fmt(h,1)+' kJ/kg';hint='Quality '+fmt(x*100,0)+'% · ใช้ hf,hg ของน้ำอิ่มตัวที่ 100°C เท่านั้น';break;}
   case 'nozzle':{
    const d=number('drop'),c=k.nozzle(d);p=d/200;label='h → c²/2';result=fmt(c,1)+' m/s';hint='Steady adiabatic, ไม่รวม loss/choking, inlet speed 50 m/s, Δh='+d+' kJ/kg';break;}
   case 'rankine':{
    const wt=number('turbine'),eta=k.rankine(wt);p=eta;label='η = Wnet / Qin';result=fmt(eta*100,1)+'%';hint='Wnet='+fmt(wt-20,0)+' kJ/kg, Qin=3000 kJ/kg, Wpump=20 kJ/kg (การสมมติค่าเพื่อฝึกสมการ)';break;}
   case 'cop':{
    const cold=number('cold'),cop=k.fridgeCOP(cold),w=10/cop;p=cop/20;label='COP = Tc/(Th−Tc)';result='COPmax = '+fmt(cop,2);hint='QC=10 kW ต้องใช้ Wอย่างน้อย≈'+fmt(w,2)+' kW ในแบบ Carnot; TH=300 K และ TC='+cold+' K';break;}
   default:return;
  }
  paint(p,label);output.textContent=result;note.textContent=hint;
 }
 node.querySelectorAll('[data-thermo-input]').forEach(el=>el.addEventListener('input',render));
 render();
})();
