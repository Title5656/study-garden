from __future__ import annotations
import json, html, importlib.util, re, hashlib
from pathlib import Path
root=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('content',root/'tools/thermo-authoring/author_content.py')
content=importlib.util.module_from_spec(spec); spec.loader.exec_module(content)
chapters=content.COURSE
assert [c['num'] for c in chapters]==list(range(1,10))
H=lambda s:html.escape(str(s),quote=True)

DIAGRAMS={
1:['ระบบ (System)','ขอบเขต (Boundary)','สิ่งแวดล้อม (Surroundings)','Q / W / Mass'],
2:['Mass & Energy In','Control Volume','Mass & Energy Out','สะสม / งาน / ความร้อน'],
3:['P–T–V (State)','EoS → Ideal / Real','Z & Critical Data','เลือกเฟส / ปริมาตร'],
4:['Reactants + ΔHf°','Reaction ΔHr°','Sensible + Latent','Products + Q duty'],
5:['TH → รับ QH','Heat Engine','งาน W + ทิ้ง QC','TC / Sgen ≥ 0'],
6:['U(S,V)','H(S,P)','F(T,V)','G(T,P)'],
7:['Nozzle: h→c²/2','Throttle: h≈คงที่','Turbine: h→W','Compressor: W→h'],
8:['Pump','Boiler','Turbine','Condenser'],
9:['Evaporator','Compressor','Condenser','Expansion Valve']}

def diagram(ch):
    labels=DIAGRAMS[ch]
    boxfill=['#e1eeef','#eee8ff','#fff0dc','#e6efe3']
    parts=['<svg viewBox="0 0 880 174" role="img" aria-label="แผนภาพแสดงลำดับ: '+H(' ไปยัง '.join(labels))+'" class="thermo-diagram">']
    for i,label in enumerate(labels):
        x=16+i*219
        parts.append(f'<rect x="{x}" y="39" width="198" height="95" rx="20" fill="{boxfill[i]}" stroke="#89949a" stroke-opacity=".35"/>')
        # show 2 rows if too long
        split=len(label)//2
        if len(label)>21:
            words=label.split(' '); n=max(1,len(words)//2); lab=[' '.join(words[:n]),' '.join(words[n:])]
            parts.append(f'<text x="{x+99}" y="78" text-anchor="middle" fill="#1d3340" font-size="14" font-weight="700">{H(lab[0])}</text><text x="{x+99}" y="101" text-anchor="middle" fill="#1d3340" font-size="13">{H(lab[1])}</text>')
        else:parts.append(f'<text x="{x+99}" y="90" text-anchor="middle" fill="#1d3340" font-size="16" font-weight="600">{H(label)}</text>')
        if i<3:parts.append(f'<path d="M {x+198} 87 h19 m-7 -6 7 6 -7 6" stroke="#527588" fill="none" stroke-width="2"/>')
    parts.append('</svg>');return ''.join(parts)

# Accessible slider simulator. No dependency on Chart.js or external requests.
WIDGETS={
1:('ลูกสูบแบบก๊าซอุดมคติ','เลื่อนปริมาตรแล้วดูความดันที่เปลี่ยน เมื่อ T และ n คงที่', [('volume','ปริมาตร (L)',2,20,10,1)],'piston'),
2:('ทดลองกฎข้อที่หนึ่ง','ดูผล ΔU เมื่อความร้อนเข้าและงานออก โดยกำหนดเครื่องหมาย Wout บวก', [('heat','Q (kJ)',-100,100,70,5),('work','Wout (kJ)',-100,100,30,5)],'energy'),
3:('ความเบี่ยงเบนก๊าซจริง Z','ตัวอย่าง Virial สองพจน์ที่ความดันไม่สูง: T=400 K, B=−0.12 L/mol', [('pressure','ความดัน (bar)',1,25,10,1)],'virial'),
4:('Sensible heat ของน้ำเหลว (แบบประมาณ)','ตัวอย่าง Cp คงที่ 4.18 kJ/(kg·K), มวล 2 kg ไม่มีการเปลี่ยนเฟส', [('temperature','อุณหภูมิปลาย (°C)',20,95,60,1)],'heat'),
5:('เครื่องยนต์ Carnot','ปรับ TH โดย TC คงที่ 300 K เพื่อเห็นขีดจำกัดประสิทธิภาพ', [('hot','แหล่งร้อน TH (K)',350,900,600,10)],'carnot'),
6:('Quality ของน้ำเดือด 100°C','hf=419.1, hg=2676.0 kJ/kg ที่ประมาณ 1 atm; ใช้เฉพาะสองเฟสอิ่มตัว', [('quality','มวลไอ (%)',0,100,35,5)],'quality'),
7:('หัวฉีดอุดมคติ','ใช้ความเร็วขาเข้า 50 m/s แล้วเลื่อน enthalpy drop (ละ loss และ choking)', [('drop','h₁−h₂ (kJ/kg)',0,200,80,5)],'nozzle'),
8:('ลองคิดประสิทธิภาพ Rankine','กำหนดความร้อนเข้า 3000 kJ/kg และงานปั๊ม 20 kJ/kg', [('turbine','งานกังหัน (kJ/kg)',500,1500,1100,50)],'rankine'),
9:('COP Carnot refrigerator','TH=300 K; ปรับ TC ต่ำกว่า TH แล้วดูงานต่ำสุดเชิงทฤษฎีเมื่อ QC=10 kW', [('cold','อุณหภูมิห้องเย็น TC (K)',220,285,260,5)],'cop')
}

def widget_html(n):
    title,description,inputs,kind=WIDGETS[n]
    controls=''.join(f'<label class="thermo-control"><span>{H(label)} <strong id="thermo-value-{name}">{default}</strong></span><input type="range" id="thermo-{name}" data-thermo-input="{name}" min="{minn}" max="{maxx}" value="{default}" step="{step}" aria-label="{H(label)}"><span class="thermo-ticks"><span>{minn}</span><span>{maxx}</span></span></label>' for name,label,minn,maxx,default,step in inputs)
    scenes={
      'piston': '<svg class="thermo-scene" viewBox="0 0 280 168" role="img" aria-label="กระบอกสูบ: เมื่อเพิ่มปริมาตร ลูกสูบเลื่อนสูงขึ้น และความดันลดลง"><rect x="82" y="10" width="116" height="142" rx="10" fill="none" stroke="currentColor" stroke-width="3"/><rect data-thermo-gas x="85" y="80" width="110" height="69" fill="#a7d6dd" opacity=".8"/><rect data-thermo-piston x="78" y="68" width="124" height="13" rx="4" fill="#3e6c78"/><path d="M140 10 V2" stroke="currentColor" stroke-width="4"/><text x="212" y="39" fill="currentColor" font-size="12">ลูกสูบ</text><path d="M205 43 l-12 20" stroke="currentColor" fill="none"/><text x="20" y="148" fill="currentColor" font-size="11">ก๊าซ</text></svg><p class="thermo-scene-note">การเคลื่อนที่เป็นภาพสมมติภายใต้ T, n คงที่</p>',
      'quality': '<svg class="thermo-scene" viewBox="0 0 280 168" role="img" aria-label="แถบแสดงสัดส่วนมวลของเหลวและไอในน้ำสองเฟส"><text x="12" y="21" fill="currentColor" font-size="12">มวลของเหลว</text><rect x="12" y="29" width="250" height="38" rx="7" fill="#c4d8df"/><rect data-thermo-liquid x="12" y="29" width="162.5" height="38" rx="7" fill="#257aa4"/><text x="12" y="94" fill="currentColor" font-size="12">มวลไอ</text><rect x="12" y="102" width="250" height="38" rx="7" fill="#c4d8df"/><rect data-thermo-vapor x="12" y="102" width="87.5" height="38" rx="7" fill="#78afa8"/></svg><p class="thermo-scene-note">ความยาวแถบแทนสัดส่วนมวล ไม่ใช่ปริมาตรจริงของแต่ละเฟส</p>'
    }
    scene=scenes.get(kind,'')
    return f'''<section class="lesson-section" id="experiment" data-reader-category="practice"><h2>ทดลองปรับค่าด้วยตัวเอง</h2><p>{H(description)} เครื่องมือนี้เป็นแบบจำลองภายใต้สมมติฐานที่ระบุ ไม่ใช่โปรแกรมออกแบบโรงงาน</p><figure class="thermo-experiment" data-thermo-widget="{kind}" aria-label="{H(title)}"><div class="thermo-experiment-heading"><strong>{H(title)}</strong><span class="thermo-experiment-tag">Interactive</span></div><div class="thermo-experiment-grid"><div class="thermo-controls">{controls}</div><div class="thermo-lab-result">{scene}<svg class="thermo-lab-svg" viewBox="0 0 380 170" role="img" aria-label="ภาพประกอบผลการทดลอง"><rect class="thermo-dynamic-bar" x="20" y="55" width="200" height="64" rx="10"/><path class="thermo-lab-axis" d="M 16 136 H 354" stroke-width="2"/><text class="thermo-lab-inline" x="26" y="93">ผลลัพธ์</text></svg><output id="thermo-output" class="thermo-output" aria-live="polite" aria-atomic="true">กำลังเตรียมการคำนวณ…</output><p class="thermo-lab-note" id="thermo-lab-note"></p></div></div><figcaption>เลื่อนค่าและสังเกตผลลัพธ์ โดยทุกค่าอยู่ภายใต้สมมติฐานที่ระบุในโจทย์</figcaption></figure><noscript><p class="thermo-tip">การจำลองต้องเปิด JavaScript แต่สมการและคำอธิบายทั้งหมดอ่านได้ด้านบน</p></noscript></section>'''

def cards_and_quiz():
 return '''<section class="lesson-section" id="flashcards"><h2>Flashcards · 10 ใบ</h2><p>แตะหรือกด Enter/Space บนการ์ดเพื่อพลิกอ่านคำจำกัดความ</p><button id="flashcard" class="flashcard" aria-pressed="false" aria-labelledby="flash-label flash-text" aria-describedby="flash-instruction"><small id="flash-label">คำศัพท์</small><span id="flash-text" class="flashcard-term" aria-live="polite" aria-atomic="true"></span><small id="flash-instruction">แตะเพื่อพลิก ↻</small></button><div class="flash-controls"><button class="btn tiny" id="flash-prev">← ก่อนหน้า</button><span id="flash-position" class="small muted" aria-live="polite"></span><button class="btn tiny" id="flash-next">ถัดไป →</button></div></section>
<section class="lesson-section" id="quiz"><h2>Quiz ท้ายบท · 10 ข้อ</h2><p>เลือกคำตอบให้ครบ ระบบจะเก็บคะแนนในเบราว์เซอร์เครื่องนี้และแสดงเหตุผลของทุกข้อหลังตรวจ</p><form id="quiz-form"><div id="quiz-questions"></div><p id="quiz-count" class="small muted" aria-live="polite">ตอบแล้ว 0 / 10 ข้อ</p><p id="quiz-error" class="error-text" role="alert"></p><div class="actions"><button id="quiz-submit" class="btn primary" type="submit">ตรวจคำตอบ →</button><button id="quiz-retry" class="btn" type="button" hidden>ทำใหม่ ↻</button></div><div id="quiz-result" class="quiz-result" tabindex="-1" hidden><h3 id="quiz-score"></h3><p id="quiz-message"></p></div></form></section>'''

WORKED={
 1:('คำนวณความดันก๊าซจากสมการ PV=nRT', 'ก๊าซอุดมคติ n=1 mol, T=300 K, V=10 L จงหา P', [
   'ตรวจระบบ: ก๊าซอุดมคติที่สมดุลและ T เป็น K ใช้ R=8.314 kPa·L/(mol·K)',
   'จัดสมการ P=nRT/V = 1×8.314×300/10 = 249.42 kPa',
   'ตรวจหน่วย mol×(kPa·L/mol·K)×K/L = kPa; ถ้า V เพิ่มสองเท่าที่ T,n คงที่ ความดันเหลือครึ่งเดียว']),
 2:('ระบบปิด: หาการเปลี่ยนพลังงานภายใน','ระบบปิดรับความร้อน 100 kJ และทำงานออก 40 kJ ละเลย ΔKE และ ΔPE',[ 
   'กำหนดเครื่องหมาย: Q=+100 kJ; Wout=+40 kJ',
   'กฎข้อที่หนึ่ง ΔU=Q−Wout=100−40=+60 kJ',
   'ถ้าตำราใช้ Won บวกเมื่องานเข้า จะได้ Won=−40 kJ และ ΔU=Q+Won เท่ากัน']),
 3:('คำนวณ Z และปริมาตรโมลาร์แบบประมาณ','ใช้ Virial สองพจน์ B=−0.12 L/mol ที่ T=400 K และ P=10 bar',[ 
   'เลือก R=0.0831446 L·bar/(mol·K) เพื่อให้หน่วยเข้ากับ P, B',
   'Z≈1+BP/RT=1−(0.12×10)/(0.0831446×400)=0.9639',
   'ปริมาตรโมลาร์ Ṽ≈ZRT/P=0.9639×0.0831446×400/10≈3.205 L/mol; เป็นค่าจากการประมาณ ไม่ใช่คำตอบแน่นอนของก๊าซทุกชนิด']),
 4:('หาปริมาณความร้อนจาก Sensible Heating','ให้น้ำเหลว 2 kg ร้อนจาก 20°C เป็น 60°C โดยประมาณ Cp=4.18 kJ/(kg·K)',[
   'ไม่มีการเปลี่ยนเฟสและใช้ Cp คงที่ในช่วง 20–60°C',
   'ΔT=60−20=40 K (ผลต่างอุณหภูมิ K และ °C มีขนาดเท่ากัน)',
   'Q≈mCpΔT=2×4.18×40=334.4 kJ ถ้าผ่านจุดเดือดต้องเพิ่มพลังงานแฝง']),
 5:('ขีดจำกัดเครื่องยนต์ Carnot','เครื่องยนต์รับ QH=1000 kJ จาก TH=600 K ทิ้งความร้อนที่ TC=300 K',[
   'ตรวจหน่วยอุณหภูมิเป็น Kelvin ทั้งคู่ และ TH > TC',
   'ηCarnot=1−TC/TH=1−300/600=0.50 หรือ 50%',
   'งานสูงสุด Wmax=ηQH=500 kJ และ QC=QH−W=500 kJ; เครื่องจริงมี irreversibility จึงให้ W น้อยกว่านี้']),
 6:('เอนทัลปีของน้ำอิ่มตัวแบบสองเฟส','กำหนด hf=419.1 kJ/kg, hg=2676.0 kJ/kg และ quality x=0.35',[
   'quality คือสัดส่วนมวลไอ ไม่ใช่สัดส่วนปริมาตร',
   'h=hf+x(hg−hf)=419.1+0.35(2676.0−419.1)=1209.0 kJ/kg',
   'ค่า hf/hg ต้องอ่านที่ความดันหรืออุณหภูมิอิ่มตัวเดียวกัน มิฉะนั้นใช้สมการนี้ไม่ได้']),
 7:('ความเร็วปลายหัวฉีดเมื่อเอนทัลปีลด','อากาศใน nozzle มี c1=50 m/s และ h1−h2=80 kJ/kg (ไม่มี Q, shaft work และ ΔPE)',[
   'สมการพลังงานต่อหน่วยมวล: (c2²−c1²)/2=(h1−h2)×1000 J/kg',
   'c2=√(50²+2×80,000)=√162,500≈403.1 m/s',
   'อย่าลืมแปลง kJ/kg เป็น J/kg; nozzle จริงอาจมีแรงเสียดทานและข้อจำกัดการไหลอัดตัว']),
 8:('ประสิทธิภาพของ Rankine cycle แบบฝึก','กำหนดงานกังหัน 1100 kJ/kg งานปั๊ม 20 kJ/kg และความร้อนเข้า boiler 3000 kJ/kg',[
   'กำหนดขอบเขตหนึ่งวัฏจักร: Wnet=Wturbine−Wpump=1080 kJ/kg',
   'ηthermal=Wnet/Qin=1080/3000=0.36 หรือ 36%',
   'สมดุลวัฏจักรให้ Qout=Qin−Wnet=1920 kJ/kg; ค่าตัวเลขเป็นโจทย์สมมติ ไม่ได้แทน steam tables']),
 9:('งานต่ำสุดของเครื่องทำความเย็น Carnot','ภาระห้องเย็น QC=10 kW, อุณหภูมิห้องเย็น TC=260 K, สิ่งแวดล้อม TH=300 K',[
   'COPR,Carnot=TC/(TH−TC)=260/(300−260)=6.5',
   'กำลังขับต่ำสุดเชิงทฤษฎี Wmin=QC/COP=10/6.5≈1.54 kW',
   'ความร้อนออก condenser QH=QC+W≈11.54 kW; COP จริงต่ำกว่า Carnot เพราะมีการสูญเสีย']),
}
def worked_html(num):
 title,problem,steps=WORKED[num]
 items=''.join(f'<li>{H(st)}</li>' for st in steps)
 return f'<section class="lesson-section" id="worked-example" data-reader-category="practice"><h2>ตัวอย่างคำนวณทีละขั้น</h2><h3>{H(title)}</h3><p>{H(problem)}</p><ol class="thermo-steps">{items}</ol><p class="thermo-example-disclaimer">โจทย์ตัวเลขตัวอย่างนี้สร้างใหม่เพื่อฝึกวิธีคิด ไม่ใช่ข้อความหรือเฉลยคัดลอกจากเอกสารผู้สอน</p></section>'

def html_document(c):
 n=c['num']; id=f'{n:02}'
 toc=''.join(f'<a href="#{H(s["id"])}">{H(s["title"])}</a>' for s in c['sections'])
 sections=[]
 for i,s in enumerate(c['sections']):
  sections.append(f'<section class="lesson-section" id="{H(s["id"])}"><div class="section-kicker">{i+1:02} / บท {n} · PDF หน้า {H(s["pages"])}</div><h2>{H(s["title"])}</h2>{s["content"]}</section>')
  if i==0:
   sections.append(f'<section class="lesson-section" id="concept-map"><div class="section-kicker">แผนภาพเนื้อหา</div><h2>เห็นภาพรวมก่อนลงสมการ</h2><figure class="thermo-figure">{diagram(n)}<figcaption>แผนภาพแนวคิดวาดขึ้นใหม่เพื่อประกอบการเรียน ไม่ใช่สไลด์ต้นฉบับ</figcaption></figure><p>อ่านจากซ้ายไปขวาเพื่อเห็นความเกี่ยวข้องของตัวแปร แต่การคำนวณจริงต้องเลือกขอบเขตและสมมติฐานก่อนเสมอ</p></section>')
 problems=''.join(f'<tr><td>หน้า {pg}</td><td>{H(topic)}</td><td>{H(method)}</td></tr>' for pg,topic,method in c['problems'])
 source=f'''<section class="lesson-section" id="examples" data-reader-category="practice"><h2>แผนที่โจทย์จากสไลด์</h2><p>ตารางนี้ชี้โจทย์ที่มีในเอกสารและหลักการที่ต้องใช้แก้ เพื่อกลับไปฝึกแทนตัวเลขจากสไลด์ ไม่ได้คัดลอกโจทย์ยาวหรือรับรองผลเฉลยอาจารย์</p><div class="thermo-table-scroll"><table class="thermo-table"><thead><tr><th>หน้า PDF</th><th>โจทย์/สถานการณ์</th><th>หลักแก้</th></tr></thead><tbody>{problems}</tbody></table></div></section>'''
 sources=f'''<section class="lesson-section" id="sources"><h2>ที่มา ขอบเขต และหมายเหตุ</h2><p><strong>เอกสารหลัก:</strong> 611201-2569(1).pdf, 611201 Thermodynamics for Chemical Process Engineers I, รศ.ดร. ศุภกิจ สุทธิเรืองวงศ์ (มหาวิทยาลัยศิลปากร) · บท {n}, หน้า PDF {H(c['pages'])} เนื้อหาเรียบเรียงเป็นภาษาไทยและแผนภาพ/กิจกรรมสร้างใหม่</p><p>คำอธิบายเพิ่มเติมช่วยแยกขอบเขตสมมติฐาน ความคลาดเคลื่อนของการประมาณ หน่วย เครื่องหมาย และกรณีสูตรใช้ไม่ได้ สูตรหรือสมการที่ต้องใช้ข้อมูลเฉพาะสารควรตรวจจากตารางสมบัติ/สมการในสไลด์ต้นฉบับอีกครั้ง</p><p><strong>ขอบเขตการสรุป:</strong> ครอบคลุมหัวข้อหลัก สูตรและตัวอย่างชนิดต่าง ๆ ในบทนี้ แต่ไม่ได้แทนการดูภาพสไลด์ทุกหน้า หรือขั้นตอนคำนวณเชิงตัวเลขทุกบรรทัดของตัวอย่าง 292 หน้า เอกสารต้นฉบับไม่ได้คัดลอกไปยัง repository สาธารณะเพื่อรักษาสิทธิ์ผู้จัดทำ</p></section>'''
 next_href=f'chapter-{n+1:02}.html' if n<9 else 'index.html'
 next_text='อ่านบทถัดไป →' if n<9 else 'กลับไปเลือกบทเรียน ↗'
 page=f'''<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="{H(c['summary'])}"><meta name="theme-color" content="#f5f5f7"><title>บท {n} {H(c['title'])} · Study Garden</title>
<link rel="icon" href="../../assets/favicon.png"><link rel="stylesheet" href="../../assets/style.css"><link rel="stylesheet" href="../../assets/reader.css"><link rel="stylesheet" href="../../assets/thermo.css">
<script defer src="../../assets/core.js"></script><script defer src="../../assets/thermo-content.js"></script><script defer src="../../assets/app.js"></script><script defer src="../../assets/reader.js"></script><script defer src="../../assets/thermo-core.js"></script><script defer src="../../assets/thermo-labs.js"></script></head><body data-subject="thermo-chemical" data-chapter="{id}"><a class="skip" href="#main">ข้ามไปยังเนื้อหา</a>
<header class="site-header"><nav class="wrap nav" aria-label="เมนูหลัก"><a class="brand" href="../../index.html"><img class="brand-mark" src="../../assets/study-garden-logo.png" width="36" height="36" alt="">Study Garden</a><div class="nav-links"><a href="../../index.html#subjects">วิชาทั้งหมด</a><a href="index.html">Thermodynamics</a></div><button class="theme-toggle" data-theme-toggle aria-label="สลับโหมดสี">☾ มืด</button></nav></header>
<div id="storage-notice" class="storage-notice" role="status" hidden>เบราว์เซอร์ไม่อนุญาตให้บันทึกความคืบหน้า</div><main id="main" class="wrap"><nav class="breadcrumb" aria-label="เส้นทาง"><a href="../../index.html">วิชาทั้งหมด</a><span>/</span><a href="index.html">611201</a><span>/</span><span>บท {n}</span></nav><header class="chapter-hero thermo-hero"><div class="eyebrow">611201 · CHAPTER {id} · PDF {H(c['pages'])}</div><h1>{H(c['title'])}</h1><p>{H(c['summary'])}</p><div class="tags"><span class="pill">{H(c['en'])}</span><span class="pill lilac">Flashcards 10 · Quiz 10</span><span class="tag" data-chapter-status="{id}">ยังไม่ได้อ่าน</span></div></header>
<div class="lesson-layout"><aside class="toc" aria-label="สารบัญบทเรียน"><h2>หัวข้อในบทนี้</h2>{toc}<div class="toc-tools"><a href="#concept-map">ภาพรวม</a><a href="#experiment">ทดลองปรับค่า</a><a href="#worked-example">ตัวอย่างคำนวณ</a><a href="#examples">ตัวอย่างจากสไลด์</a><a href="#flashcards">Flashcards</a><a href="#quiz">Quiz</a><a href="#sources">แหล่งอ้างอิง</a></div></aside><article class="lesson-content">{''.join(sections)}{widget_html(n)}{worked_html(n)}{source}{cards_and_quiz()}{sources}<button class="btn soft" data-mark-read aria-pressed="false">ทำเครื่องหมายว่าอ่านแล้ว ✓</button><nav class="chapter-end" aria-label="เปลี่ยนบท"><a class="btn" href="index.html">← ภาพรวมวิชา</a><a class="btn primary" href="{next_href}">{next_text}</a></nav></article></div></main><footer class="thermo-footer wrap"><a href="../../index.html">Study Garden © 2026</a><span>สรุปวิชา 611201 · พัฒนาเพื่อใช้ทบทวน ไม่ใช่ข้อสอบจริง</span><a href="index.html">สารบัญ Thermodynamics ↑</a></footer></body></html>'''
 return page

# Build quiz data consumed by existing StudyApp without altering scoring logic.
allcontent={}
for ch in chapters:
 id=f"{ch['num']:02}"
 quiz=[]
 for ix,q in enumerate(ch['quiz']):
  pos=(ix+ch['num'])%4
  options=q['wrong'].copy(); options.insert(pos,q['correct'])
  assert len(options)==4 and len(set(options))==4,(id,ix)
  quiz.append({'q':q['q'],'options':options,'answer':pos,'explanation':q['explanation']})
 assert len(quiz)==10 and len(set(q['q'] for q in quiz))==10
 allcontent[id]={'cards':[list(c) for c in ch['glossary']],'quiz':quiz}
 (root/'subjects/thermo-chemical'/f'chapter-{id}.html').write_text(html_document(ch),encoding='utf8')
js='''/* Course data for Study Garden shared flashcards, quiz and progress. */\nwindow.StudyContent = window.StudyContent || {};\nwindow.StudyContent["thermo-chemical"] = '''+json.dumps(allcontent,ensure_ascii=False,indent=2)+''';\n'''
(root/'assets/thermo-content.js').write_text(js,encoding='utf8')

cards=[]
for c in chapters:
 id=f"{c['num']:02}"
 cards.append(f'<a class="thermo-course-card" href="chapter-{id}.html" aria-label="อ่านบท {c["num"]} {H(c["title"])}"><span class="thermo-card-index">CHAPTER {id} · PDF หน้า {H(c["pages"])}</span><strong>{H(c["title"])}</strong><span class="thermo-course-meta">{H(c["summary"])}</span><span class="thermo-card-bottom"><span data-chapter-status="{id}">ยังไม่ได้อ่าน</span><span>เปิดอ่าน ↗</span></span></a>')
index=f'''<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="611201 Thermodynamics for Chemical Process Engineers I สรุปภาษาไทย 9 บทพร้อม Interactive, Flashcards และ Quiz"><title>Thermodynamics for Chemical Process Engineers I · Study Garden</title><link rel="icon" href="../../assets/favicon.png"><link rel="stylesheet" href="../../assets/style.css"><link rel="stylesheet" href="../../assets/thermo.css"><script defer src="../../assets/core.js"></script><script defer src="../../assets/thermo-content.js"></script><script defer src="../../assets/app.js"></script></head><body data-subject="thermo-chemical"><a class="skip" href="#main">ข้ามไปยังเนื้อหา</a><header class="site-header"><nav class="wrap nav"><a class="brand" href="../../index.html"><img class="brand-mark" src="../../assets/study-garden-logo.png" width="36" height="36" alt="">Study Garden</a><div class="nav-links"><a href="../../index.html#subjects">วิชาทั้งหมด</a><a href="#chapters">บทเรียน</a></div><button class="theme-toggle" data-theme-toggle aria-label="สลับโหมดสี">☾ มืด</button></nav></header><div id="storage-notice" class="storage-notice" role="status" hidden>ไม่สามารถเก็บความคืบหน้าได้ในเบราว์เซอร์นี้</div><main class="wrap thermo-index" id="main"><nav class="breadcrumb"><a href="../../index.html">วิชาทั้งหมด</a><span>/</span><span>611201</span></nav><div class="thermo-index-hero"><div class="eyebrow">611201 · THERMODYNAMICS I · 9 CHAPTERS</div><h1>Thermodynamics<br>for Chemical Process Engineers</h1><p>เริ่มจากศูนย์ด้วยคำอธิบายภาษาไทย เห็นสมมติฐานก่อนแทนสูตร พร้อมแผนภาพ ทดลองปรับค่า Flashcards และ Quiz ทุกบท</p><div class="thermo-index-stats"><span><strong>9</strong> บท</span><span><strong>90</strong> Flashcards</span><span><strong>90</strong> ข้อ Quiz</span><span>อ่านแล้ว <strong data-read-count>0</strong> / 9</span></div><div class="thermo-index-track" aria-label="ความคืบหน้าการอ่าน"><span data-progress-bar></span></div><a class="btn primary" href="chapter-01.html">เริ่มเรียนบทที่ 1 →</a></div><section id="chapters" class="thermo-index-chapters" aria-labelledby="chapters-title"><div class="thermo-index-section-head"><div><div class="eyebrow">LEARNING PATH</div><h2 id="chapters-title">เลือกบทเรียน</h2></div><span>เรียงตามเอกสารต้นฉบับ</span></div><div class="thermo-course-grid">{''.join(cards)}</div></section><section class="thermo-notice"><h2>ที่มาของเนื้อหา</h2><p>สรุปจากสไลด์รายวิชา 611201 Thermodynamics for Chemical Process Engineers I จำนวน 292 หน้า โดยบท 1–9 เริ่มที่หน้า 4–292 และมีรายการเนื้อหาทั่วไปหน้า 1–3 บทเรียนเรียบเรียงและเพิ่มแผนภาพเอง ไม่เผยแพร่ไฟล์สไลด์ต้นฉบับผ่าน GitHub</p><p>บทเรียนนี้ครอบคลุมหัวข้อหลักและสูตรสำคัญ แต่การฝึกตามตัวเลขทุกโจทย์ ตารางคุณสมบัติเฉพาะสาร และรูปต้นฉบับยังต้องอ้างอิง PDF ของรายวิชา ชื่อผู้สอนและรายละเอียดแหล่งที่มาระบุในแต่ละบท</p></section></main><footer class="thermo-footer wrap"><a href="../../index.html">Study Garden © 2026</a><span>611201 · Thai learning companion</span></footer></body></html>'''
(root/'subjects/thermo-chemical/index.html').write_text(index,encoding='utf8')
manifest={'source':'611201-2569(1).pdf', 'source_sha256':'933db55cf163d4e0bffd543cf8c362dde4066a176b2cf0eddb467dc946b5ba89', 'source_pdf_pages':292, 'course':'611201', 'note':'Do not publish the uploaded original PDF without the copyright holder permission.', 'chapters':[{'chapter':c['num'],'pages':c['pages'],'sections':[{'title':s['title'],'pages':s['pages']} for s in c['sections']],'example_pages':[p for p,_,_ in c['problems']]} for c in chapters]}
(root/'docs/thermo-source-map.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8')
print('WROTE',len(chapters),'chapters;',sum(len(c['sections']) for c in chapters),'sections;',sum(len(c['problems']) for c in chapters),'examples; 90 quizzes')

# Pin URL fingerprints for GitHub Pages' browser caches (matches tools/check-assets.mjs).
asset_hashes={
 'favicon.png':'66f8b58bffb5',
 'study-garden-logo.png':'4d3c7e4e5b15',
 'style.css':'57402278ef28',
 'reader.css':'e645af8bb978',
 'core.js':'02afe1c9497e',
 'app.js':'187c0a39763c',
 'reader.js':'6909a53af50d',
}
for name in ['thermo.css','thermo-content.js','thermo-core.js','thermo-labs.js']:
 asset_hashes[name]=hashlib.sha256((root/'assets'/name).read_bytes()).hexdigest()[:12]
for file in (root/'subjects/thermo-chemical').glob('*.html'):
 data=file.read_text(encoding='utf8')
 for name,hash12 in asset_hashes.items():
  data=data.replace(f'../../assets/{name}\"',f'../../assets/{name}?v={hash12}\"')
 file.write_text(data,encoding='utf8')
print('Versioned references:',len(asset_hashes))
