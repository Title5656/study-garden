/* Small, independent explanations beside the paragraph that introduces them. */
(function () {
  'use strict';
  if (document.body.dataset.subject !== 'itds211') return;
  const C = window.ITDS211Core;
  const fmt = value => Number(value.toFixed(3)).toLocaleString('en-US');
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  document.querySelectorAll('.itds211-inline-map').forEach((map, mapIndex) => {
    const panel = document.createElement('div');
    panel.className = 'itds211-map-panel';
    panel.setAttribute('aria-live', 'polite');
    const items = [...map.querySelectorAll('.itds211-map-nodes > li')];
    const buttons = [];
    items.forEach((item, index) => {
      const label = item.querySelector('.itds211-map-label');
      const detail = item.querySelector('.itds211-map-detail');
      detail.id = `inline-map-${mapIndex}-${index}`;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'itds211-map-node';
      button.innerHTML = `<span class="itds211-node-number" aria-hidden="true">${String(index + 1).padStart(2,'0')}</span>${label.innerHTML}`;
      button.setAttribute('aria-controls', detail.id);
      button.setAttribute('aria-pressed', String(index === 0));
      detail.hidden = index !== 0;
      label.replaceWith(button);
      panel.append(detail);
      buttons.push(button);
      button.addEventListener('click', () => {
        buttons.forEach((b, i) => {
          b.setAttribute('aria-pressed', String(i === index));
          panel.children[i].hidden = i !== index;
        });
      });
    });
    map.querySelector('.itds211-map-nodes').after(panel);
    map.querySelector('.itds211-map-hint').hidden = false;
    map.classList.add('is-interactive');
  });

  const bar = (label, value, max, tone = '') => `<div class="itds211-inline-bar ${tone}"><span>${esc(label)}</span><div><i style="width:${Math.max(0, Math.min(100, value / max * 100))}%"></i></div><b>${fmt(value)}</b></div>`;
  function slider(host, label, min, max, value, step, calculate) {
    const live = host.querySelector('.itds211-sim-live');
    live.hidden = false;
    live.innerHTML = `<label class="itds211-inline-slider"><span>${esc(label)} <b data-current></b></span><input type="range" min="${min}" max="${max}" value="${value}" step="${step}"></label><div class="itds211-inline-result"><output aria-live="polite"></output><div class="itds211-inline-graphic"></div></div><button type="button" class="btn tiny" data-inline-reset>คืนค่าเริ่มต้น</button>`;
    const input = live.querySelector('input');
    function update() {
      const current = Number(input.value);
      const result = calculate(current);
      live.querySelector('[data-current]').textContent = fmt(current);
      live.querySelector('output').textContent = result.text;
      live.querySelector('.itds211-inline-graphic').innerHTML = result.graphic;
    }
    input.addEventListener('input', update);
    live.querySelector('[data-inline-reset]').addEventListener('click', () => { input.value = value; update(); });
    update();
  }
  const sims = {
    cpu(host) {
      slider(host, 'ความถี่ CPU (GHz)', 1, 5, 2, .5, ghz => {
        const seconds = C.cpuTime({instructions:500e6, cpi:2, ghz}).seconds;
        return {text:`500 ล้าน × 2 ÷ (${ghz} × 10⁹) = ${fmt(seconds)} วินาที · ${fmt(.5 / seconds)} เท่าของประสิทธิภาพที่ 2 GHz`, graphic:bar('ฐาน 2 GHz · วินาที', .5, 1)+bar(`ทดลอง ${ghz} GHz · วินาที`, seconds, 1, 'teal')+'<p>แท่งสั้นลง = ใช้เวลาน้อยลง · IC และ CPI คงเดิมในแบบจำลองนี้</p>'};
      });
    },
    bits(host) {
      const live = host.querySelector('.itds211-sim-live');
      live.hidden = false;
      let number = 0;
      live.innerHTML = '<div class="itds211-inline-bits">'+Array.from({length:8},(_,i)=>`<button type="button" data-inline-bit="${7-i}" aria-pressed="false" aria-label="สลับบิต ${7-i} น้ำหนัก unsigned ${2**(7-i)}"><small>${2**(7-i)}</small><b>0</b></button>`).join('')+'</div><output aria-live="polite"></output><button type="button" class="btn tiny" data-inline-reset>ล้างทุกบิต</button>';
      const update = () => {
        live.querySelectorAll('[data-inline-bit]').forEach(button => {
          const on = Boolean(number & (1 << Number(button.dataset.inlineBit)));
          button.setAttribute('aria-pressed', String(on));
          button.querySelector('b').textContent = on ? '1' : '0';
        });
        const signed = number >= 128 ? number - 256 : number;
        live.querySelector('output').textContent = `${number.toString(2).padStart(8,'0')} → unsigned = ${number} · two’s complement = ${signed} · บิตซ้ายสุดมีน้ำหนัก +128 แบบ unsigned แต่ −128 แบบ signed`;
      };
      live.querySelectorAll('[data-inline-bit]').forEach(button => button.addEventListener('click', () => {number ^= 1 << Number(button.dataset.inlineBit); update();}));
      live.querySelector('[data-inline-reset]').addEventListener('click', () => {number=0;update();});
      update();
    },
    cache(host) {
      slider(host, 'Byte address', 0, 63, 0, 1, address => {
        const block = Math.floor(address / 4), line = block % 4, tag = Math.floor(block / 4), offset = address % 4;
        return {text:`Address ${address} → Block ${block} → Line ${line} · Tag ${tag} · Offset ${offset}`,graphic:`<div class="itds211-cache-lines">${Array.from({length:4},(_,i)=>`<div class="${i===line?'is-selected':''}"><small>Line ${i}</small><strong>${i===line?`← Block ${block}`:'—'}</strong></div>`).join('')}</div><p>Block = ⌊address ÷ 4⌋ · Line = block mod 4 · เปลี่ยนจาก 0 เป็น 16 เพื่อเห็นการชน line; ภาพนี้แสดงตำแหน่งที่จะลง ยังไม่จำลอง hit/miss ตามประวัติ</p>`};
      });
    },
    disk(host) {
      slider(host, 'ความเร็วรอบ (rpm)', 3000, 15000, 6000, 1000, rpm => {
        const r = C.diskTime({rpm,seekMs:5,bytes:1e6,megabytesPerSecond:100});
        return {text:`รวม ${fmt(r.totalMs)} ms = seek 5 + รอหมุนเฉลี่ย ${fmt(r.rotationMs)} + transfer 10`,graphic:bar('Seek · ms',5,10)+bar('Rotation · ms',r.rotationMs,10,'orange')+bar('Transfer · ms',10,10,'teal')+'<p>Average rotation = 30,000 ÷ rpm ms · ความเร็วหมุนไม่เปลี่ยน seek หรือ transfer ที่เราตรึงไว้</p>'};
      });
    },
    pipeline(host) {
      slider(host, 'จำนวนคำสั่งอิสระ', 1, 8, 4, 1, n => {
        const cycles=n+4, stages=['IF','ID','EX','MEM','WB'];
        const rows=Array.from({length:n},(_,r)=>`<tr><th scope="row">I${r+1}</th>${Array.from({length:cycles},(_,c)=>`<td>${c>=r&&c<r+5?`<span class="itds211-cell stage-${stages[c-r]}">${stages[c-r]}</span>`:'·'}</td>`).join('')}</tr>`).join('');
        return {text:`ทีละคำสั่ง ${5*n} cycles → Pipeline ${cycles} cycles · Speedup ${fmt(5*n/cycles)}×`,graphic:`<div class="table-wrap" tabindex="0" role="region" aria-label="จังหวะ pipeline เลื่อนแนวนอนเพื่อดูทุก cycle"><table class="itds211-inline-timing"><thead><tr><th>คำสั่ง</th>${Array.from({length:cycles},(_,i)=>`<th scope="col">${i+1}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div><p>อ่านแนวนอน = เส้นทางคำสั่งเดียว · อ่านแนวตั้ง = หลายคำสั่งใน cycle เดียว · คำสั่งแรกยังใช้ 5 cycles</p>`};
      });
    },
    amdahl(host) {
      slider(host, 'จำนวนคอร์', 1, 16, 4, 1, cores => {
        const serial=.25, parallel=.75/cores, total=serial+parallel;
        return {text:`Speedup = 1 ÷ (0.25 + 0.75/${cores}) = ${fmt(1/total)}× · เวลาเหลือ ${fmt(total*100)}% ของเวลาเดิม`,graphic:bar('Serial · %',25,100,'orange')+bar('Parallel · %',parallel*100,100,'teal')+bar('รวม · %',total*100,100)+'<p>เพิ่มคอร์มากเพียงใด ส่วน serial 25% ยังอยู่ เพดาน speedup ของเงื่อนไขนี้คือ 4×</p>'};
      });
    },
    process(host) {
      const live = host.querySelector('.itds211-sim-live');
      live.hidden = false;
      let state='ready';
      const events=[['dispatch','ให้ CPU','ready'],['io','รอ I/O','running'],['timeout','หมดช่วงเวลา','running'],['complete','I/O เสร็จ','blocked']];
      const names={ready:'Ready · พร้อม แต่ยังไม่มี CPU',running:'Running · กำลังใช้ CPU',blocked:'Blocked · รอ I/O จึงยังรันไม่ได้'};
      live.innerHTML='<div class="itds211-process-track"></div><div class="itds211-inline-actions">'+events.map(([event,label])=>`<button type="button" class="btn" data-event="${event}">${label}</button>`).join('')+'</div><output aria-live="polite"></output><button type="button" class="btn tiny" data-inline-reset>เริ่มที่ Ready</button>';
      const update = message => {
        live.querySelector('.itds211-process-track').innerHTML=Object.keys(names).map(key=>`<span class="${key===state?'is-selected':''}">${esc(names[key].split(' · ')[0])}${key===state?' ●':''}</span>`).join('');
        events.forEach(([event,,from])=>live.querySelector(`[data-event="${event}"]`).disabled=state!==from);
        live.querySelector('output').textContent=(message?message+' → ':'')+names[state];
      };
      events.forEach(([event,label])=>live.querySelector(`[data-event="${event}"]`).addEventListener('click',()=>{state=C.processTransition(state,event);update(label);}));
      live.querySelector('[data-inline-reset]').addEventListener('click',()=>{state='ready';update();});
      update();
    },
    schedule(host) {
      slider(host, 'Quantum (หน่วยเวลา)', 1, 5, 1, 1, quantum => {
        const r=C.schedule([{id:'A',arrival:0,burst:5},{id:'B',arrival:0,burst:3},{id:'C',arrival:0,burst:1}],'RR',quantum);
        return {text:`q = ${quantum} · รอเฉลี่ย ${fmt(r.averages.waiting)} · Response เฉลี่ย ${fmt(r.averages.response)} · จบทั้งหมดที่ ${r.elapsed}`,graphic:`<div class="itds211-inline-gantt" role="img" aria-label="${esc(r.segments.map(s=>`${s.id}: ${s.start} ถึง ${s.end}`).join(', '))}">${r.segments.map(s=>`<span class="job-${s.id}" style="flex:${s.end-s.start}"><b>${s.id}</b><small>${s.start}–${s.end}</small></span>`).join('')}</div><p>ทุกงานมาที่ 0 · A=5, B=3, C=1 · ยิ่ง q สั้นยิ่งสลับบ่อย แต่ภาพนี้ยังไม่คิดต้นทุนสลับงาน</p>`};
      });
    }
  };
  if (C) document.querySelectorAll('[data-inline-sim]').forEach(host => sims[host.dataset.inlineSim]?.(host));
})();
