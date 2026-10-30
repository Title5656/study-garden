import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {lessons} from './final-learning-content.mjs';
import {groups,explorers,sorting} from './inline-learning-content.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const esc = text => String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const block = html => `<!-- final-learning:start -->${html}<!-- final-learning:end -->`;
export function enhanceLesson(html, key) {
  const lesson = lessons[key];
  if (!lesson) return html;
  html = html.replace(/<!-- final-learning:start -->[\s\S]*?<!-- final-learning:end -->/g,'');
  // Undo only our grouping wrappers, recovering the original section attributes/body.
  html = html.replace(/<!-- inline-group:open -->[\s\S]*?<!-- inline-group:body -->/g,'')
    .replace(/<!-- inline-group:close -->[\s\S]*?<!-- inline-group:end -->/g,'')
    .replace(/<!-- inline-source:([^ ]+) --><div[^>]*>([\s\S]*?)<\/div><!-- inline-source:end -->/g,(_,attrs,body)=>`<section${decodeURIComponent(attrs)}>${body.replace(/<h3 data-inline-heading>/g,'<h2>').replace(/<\/h3><!-- inline-heading:end -->/g,'</h2>')}</section>`);
  html = html.replace(/<body\b([^>]*)>/,(_,attrs)=>'<body'+attrs.replace(/\sdata-reader-inline="[^"]*"/g,'')+' data-reader-inline="true">');
  // Core must precede the existing Express enhancement; UI initializes after the reader.
  html = html.replace(/<head>/, '<head>' + block('<link rel="stylesheet" href="../../assets/final-learning.css"><script defer src="../../assets/final-learning-core.js"></script>'));
  html = html.replace('</head>',block('<link rel="stylesheet" href="../../assets/inline-learning.css"><script defer src="../../assets/final-learning.js"></script><script defer src="../../assets/inline-learning.js"></script>')+'</head>');
  const road = `<div class="fl-guide"><p><strong>เมื่อจบบทนี้:</strong> ${esc(lesson.goal)}</p><details><summary>เลือกเส้นทางเรียน · อ่านใหม่หรือทบทวน</summary><p>อ่านครั้งแรกตามลำดับด้านล่าง ทบทวนให้เลือกหัวข้อที่ยังอธิบายไม่ได้ กิจกรรมเป็นตัวช่วย: คาดการณ์หนึ่งอย่าง → เปลี่ยนตัวแปร → อธิบายผล แล้วค่อยไปต่อ ไม่จำเป็นต้องทำทุกกิจกรรมในรอบเดียว</p><ol>${lesson.route.map(([id,label,outcome])=>`<li><a href="#${id}">${esc(label)}</a><p>${esc(outcome)}</p></li>`).join('')}</ol><p><a href="#learn-transfer">ลองโจทย์ประยุกต์ 2 ข้อ</a> หรือใช้ Flashcards / Quiz เดิมเมื่อต้องการทบทวนเพิ่ม</p></details></div>`;
  const newLab = lesson.lab && `<div class="il-embedded" id="${lesson.lab.id}"><h3>${esc(lesson.lab.title)}</h3><p class="fl-predict"><strong>ลองคิดก่อน:</strong> ${esc(lesson.lab.predict)}</p><div class="fl-lab" data-final-lab="${lesson.lab.kind}"></div><details class="fl-worked"><summary>อ่านตัวอย่างและเหตุผล</summary><p>${esc(lesson.lab.fallback)}</p></details><p class="fl-limit">${esc(lesson.lab.limit)}</p></div>`;
  const json=data=>JSON.stringify(data).replaceAll('<','\\u003c');
  function exploration(data,sort=false){return `<div class="il-card" ${sort?'data-inline-sort':'data-inline-explorer'}><h3>${esc(data.title)}</h3><p class="il-why">${esc(data.why)}</p><div class="il-mount"></div><details class="il-static"><summary>อ่านตัวอย่างทั้งหมด</summary>${sort?data.cards.map(([text,bin,why])=>`<p><strong>${esc(text)} → ${esc(data.bins[bin])}</strong><br>${esc(why)}</p>`).join(''):data.choices.map(c=>`<h4>${esc(c.name)}</h4><p>${esc(c.nodes.join(' → '))}</p><p>${esc(c.why)} · ${esc(c.example)}</p><p>ข้อแลกเปลี่ยน: ${esc(c.tradeoff)}</p>`).join('')}</details><script type="application/json">${json(data)}</script></div>`;}
  const seen = new Set();
  html = html.replace(/<section\b([^>]*)>([\s\S]*?)<\/section>/g, (all, attrs, body) => {
    const id = /\bid="([^"]+)"/.exec(attrs)?.[1];
    if (!id) return all;
    seen.add(id);
    if (id === lesson.start) body = body.replace(/(<h2[^>]*>[\s\S]*?<\/h2>)/, '$1' + block(road));
    if (lesson.bridges?.[id]) body = body.replace(/(<h2[^>]*>[\s\S]*?<\/h2>)/, '$1'+block(`<p class="fl-bridge">${esc(lesson.bridges[id])}</p>`));
    const inline=(explorers[key]?.[id]?exploration(explorers[key][id]):'')+(sorting[key]?.[id]?exploration(sorting[key][id],true):'')+(lesson.lab?.after===id?newLab:'');
    // Place the mechanism directly after the introductory bridge. Counting
    // paragraphs can accidentally insert it inside a collapsed worked answer.
    if(inline){
      const introduction=lesson.bridges?.[id]
        ? /<!-- final-learning:start --><p class="fl-bridge">[\s\S]*?<\/p><!-- final-learning:end -->/
        : /<h2[^>]*>[\s\S]*?<\/h2>/;
      body=body.replace(introduction,match=>match+block(inline));
    }
    const p = lesson.prompts?.[id];
    if (p) {
      body = body.replace(/(<h2[^>]*>[\s\S]*?<\/h2>)/, '$1'+block(`<p class="fl-predict"><strong>ลองคิดก่อน:</strong> ${esc(p.predict)}</p><p class="fl-task">${esc(p.experiment)}</p>`));
      body += block(`<details class="fl-worked"><summary>ทำแล้วดูเหตุผล</summary><p>${esc(p.explain)}</p></details>`);
    }
    return `<section${attrs}>${body}</section>`;
  });
  for (const id of [lesson.start,...Object.keys(lesson.prompts||{}),...Object.keys(lesson.bridges||{}),...(lesson.lab?[lesson.lab.after]:[])]) {
    if (!seen.has(id)) throw new Error(`${key}: missing integration anchor ${id}`);
  }
  const checks = `<div class="il-embedded" id="learn-transfer"><h3>เช็กความเข้าใจ · ใช้กับสถานการณ์ใหม่</h3><div class="fl-checks" data-final-checks><div class="fl-check-ui" hidden></div><div class="fl-check-fallback">${lesson.checks.map(q=>`<p><strong>${esc(q.q)}</strong></p><ul>${q.options.map(o=>`<li>${esc(o)}</li>`).join('')}</ul><details><summary>คำตอบและเหตุผล</summary><p>${esc(q.options[q.answer])} — ${esc(q.why)}</p><a href="#${q.link}">กลับไปทบทวนแนวคิด</a></details>`).join('')}</div><script type="application/json">${json(lesson.checks)}</script></div></div>`;
  const summary=key==='itds241/09'?'topic-38':key==='itds241/10'?'p2-topic-24':'key-takeaways';
  html=html.replace(new RegExp(`(<section[^>]*id="${summary}"[^>]*>[\\s\\S]*?)(</section>)`),(_,body,end)=>body+block(checks)+end);
  for(const [id,title,start,end] of groups[key]||[]){
    const range=new RegExp(`<section([^>]*id="${start}"[^>]*)>([\\s\\S]*?)</section>([\\s\\S]*?<section[^>]*id="${end}"[^>]*>[\\s\\S]*?</section>)`);
    html=html.replace(range,source=>{
      const children=source.replace(/<section([^>]*)>([\s\S]*?)<\/section>/g,(_,attrs,body)=>{
        const oldId=/\bid="([^"]+)"/.exec(attrs)[1];
        const converted=body.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g,(_,heading)=>`<h3 data-inline-heading>${heading.replace(/^ลองทำ · /,'')}</h3><!-- inline-heading:end -->`);
        return `<!-- inline-source:${encodeURIComponent(attrs)} --><div class="il-topic" id="${oldId}" data-inline-source>${converted}</div><!-- inline-source:end -->`;
      });
      return `<!-- inline-group:open --><section class="lesson-section il-group" id="${id}"><h2>${esc(title)}</h2><!-- inline-group:body -->${children}<!-- inline-group:close --></section><!-- inline-group:end -->`;
    });
  }
  // Build a plain content outline, like L12. Legacy deep links remain on inner topics.
  const headings=[...html.matchAll(/<section[^>]*class="lesson-section[^"\n]*"[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g)]
    .map(m=>[m[1],/<h2[^>]*>([\s\S]*?)<\/h2>/.exec(m[2])?.[1]]).filter(x=>x[1]);
  html=html.replace(/<aside class="toc"[^>]*>[\s\S]*?<\/aside>/,`<aside class="toc" aria-label="สารบัญบทเรียน"><h2>ในบทนี้</h2>${headings.map(([id,title])=>`<a href="#${id}">${title.replace(/<[^>]+>/g,'')}</a>`).join('')}</aside>`);
  html=html.replace(/\d+ หน้าสั้น/g,`${headings.length-2} หัวข้อเรียน`).replace(/ · 6 กิจกรรม/g,' · ทดลองไปพร้อมเนื้อหา');
  return html;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let changed = 0;
  for (const key of Object.keys(lessons)) {
    const [course, chapter] = key.split('/');
    const file = resolve(root,`subjects/${course}/chapter-${chapter}.html`);
    const before = readFileSync(file,'utf8'), after = enhanceLesson(before,key);
    if (before !== after) {writeFileSync(file,after);changed++;}
  }
  console.log(`Enhanced ${changed} of 5 lessons.`);
}
