(function(){
 'use strict';
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 const button=(text,fn,cls='il-choice')=>{const b=el('button',text,cls);b.type='button';b.addEventListener('click',fn);return b;};
 document.querySelectorAll('[data-inline-explorer]').forEach(root=>{
  const data=JSON.parse(root.querySelector('script').textContent),mount=root.querySelector('.il-mount');
  const choices=el('div',undefined,'il-choices'),stage=el('div',undefined,'il-stage');stage.setAttribute('role','status');
  mount.append(choices,stage);
  data.choices.forEach((c,i)=>choices.append(button(c.icon+' '+c.name,()=>show(i))));
  function show(i){
   const c=data.choices[i];[...choices.children].forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));
   stage.replaceChildren();const flow=el('div',undefined,'il-flow');
   c.nodes.forEach((text,j)=>{if(j)flow.append(el('span','→','il-flow-arrow'));const node=el('div',undefined,'il-flow-node');node.dataset.tone=String(j%4);node.append(el('small',String(j+1).padStart(2,'0')),el('strong',text));flow.append(node);});
   const explanation=el('div',undefined,'il-explanation');explanation.append(el('h4',c.icon+' '+c.name),el('p',c.why));
   const example=el('pre'),code=el('code',c.example);example.append(code);
   const cost=el('p',undefined,'il-caution');cost.append(el('strong','ต้องชั่งน้ำหนัก · '),document.createTextNode(c.tradeoff));
   stage.append(flow,explanation,example,cost);
  }
  show(0);
 });
 document.querySelectorAll('[data-inline-sort]').forEach(root=>{
  const data=JSON.parse(root.querySelector('script').textContent),mount=root.querySelector('.il-mount');
  const progress=el('p',undefined,'il-game-progress'),pool=el('div',undefined,'il-pool'),bins=el('div',undefined,'il-bins'),feedback=el('p',undefined,'il-game-feedback');
  feedback.setAttribute('role','status');const meter=el('progress');meter.max=data.cards.length;meter.setAttribute('aria-label','จำนวนการ์ดที่จัดถูก');
  let selected=null;const placed=new Set();
  mount.append(progress,meter,pool,bins,feedback,button('↺ เริ่มใหม่',reset,'il-reset'));
  function select(i){selected=i;[...pool.children].forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.card)===i)));feedback.textContent='เลือกแล้ว: '+data.cards[i][0]+' — เลือกกล่องปลายทาง';}
  function place(bin){
   if(selected===null){feedback.textContent='เลือกการ์ดหนึ่งใบก่อน แล้วเลือกกล่องปลายทาง';return;}
   const [text,correct,why]=data.cards[selected];
   if(bin!==correct){feedback.dataset.result='retry';feedback.textContent='ลองอีกครั้ง · '+why;return;}
   placed.add(selected);pool.querySelector(`[data-card="${selected}"]`).remove();
   bins.children[bin].querySelector('.il-placed').append(el('span','✓ '+text,'il-solved'));selected=null;
   feedback.dataset.result='correct';feedback.textContent='ถูกต้อง · '+why;update();
   const next=pool.querySelector('button');if(next)next.focus();else{feedback.tabIndex=-1;feedback.focus();}
  }
  function update(){meter.value=placed.size;progress.textContent=`จัดได้ ${placed.size} / ${data.cards.length} ใบ${placed.size===data.cards.length?' · ลองอธิบายความต่างด้วยคำของตัวเอง':''}`;}
  function reset(){
   selected=null;placed.clear();pool.replaceChildren();bins.replaceChildren();
   data.cards.forEach(([text],i)=>{const b=button(text,()=>select(i),'il-chip');b.dataset.card=String(i);b.setAttribute('aria-pressed','false');pool.append(b);});
   data.bins.forEach((text,i)=>{const bin=el('div',undefined,'il-bin');bin.dataset.tone=String(i);const drop=button(text,()=>place(i),'il-bin-target');drop.setAttribute('aria-label','วางการ์ดใน '+text);bin.append(drop,el('div',undefined,'il-placed'));bins.append(bin);});
   feedback.textContent='เลือกการ์ด แล้วเลือกกล่อง · ใช้ Tab และ Enter ได้ ไม่ต้องลาก';delete feedback.dataset.result;update();
  }
  reset();
 });
})();
