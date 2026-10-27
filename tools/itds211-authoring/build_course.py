"""Render authored ITDS211 lessons as static, progressively enhanced pages."""
from pathlib import Path
from html import escape as esc
import argparse, json, re, sys
from visuals import write_visual

ROOT = Path(__file__).resolve().parents[2]
AUTH = Path(__file__).resolve().parent
OUT = ROOT / 'subjects' / 'itds211'
EXPECTED = [('CA00',9),('CA01',43),('CA02',46),('CA03',118),('CA04',112),('CA05',52),('CA06',45),('CA07',53),('CA08',41),('OS01',40),('OS02',41),('OS03',48)]
SOURCE_FILES = ['itds-210_comp_arch_Chapter00.pdf'] + ['itds-211_comp_arch_Chapter'+name+'.pdf' for name in ['01','02','03_RiscV','04','05','06','07','08']] + ['Lecture 1 - Introduction.pdf','Lecture 2 - Process.pdf','Lecture 3 - Process Scheduling.pdf']
LABS = ['overview','performance','machine','numbers','cache','io','storage','pipeline','parallel','os','process','scheduling']
LAB_SOURCE_PAGES = [[3,4,7,8],[38,39,40,41,42],[17,18,21,25,26,27,35,36],[18,19,20,21,22,25,26,27,28,29,30,31],[23,24,25,26,45,46,47,48,49,50,51,73,74,75,76,77,78,79,80,81,82,83,84],[8,9,10,11,24,25,26,27,28,29],[14,15,17,18,19,20,21,22,26],[4,5,6,10,11,12,13,35,36,37,38,39,40,41,42,43,44,45,46,47,48],[19,31],[19,20,21,22,23,24,25],[14,38,39],[13,14,15,18,19,20,21,22,23,24,25,26,27,28]]
DEPENDENCIES = {
    '01': [], '02': ['01'], '03': ['02'], '04': ['02','03'],
    '05': ['02','03','04'], '06': ['03','05'], '07': ['04','05','06'],
    '08': ['02','03','04','05'], '09': ['02','04','05','06','08'],
    '10': ['02','03','05','06','07'], '11': ['03','04','10'], '12': ['06','11']
}

def e(value): return esc(str(value), quote=True)

def cite(lesson, pages):
    pages = sorted(set(int(p) for p in pages))
    ranges = []
    for p in pages:
        if ranges and ranges[-1][1] == p - 1: ranges[-1][1] = p
        else: ranges.append([p,p])
    label = ', '.join(str(a) if a == b else f'{a}–{b}' for a,b in ranges)
    first = pages[0] if pages else 1
    return f'<small class="itds211-cite">ต้นทาง: {e(lesson["sourceFile"])} · หน้า PDF {label} <a href="#sources" data-source-page="{first}">เปิดดูต้นฉบับในเครื่อง ↗</a></small>'

def table(headers, rows, label='ตารางประกอบบทเรียน'):
    return '<div class="table-wrap" tabindex="0" role="region" aria-label="'+e(label)+'"><table><thead><tr>'+''.join('<th scope="col">'+h+'</th>' for h in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+str(c)+'</td>' for c in row)+'</tr>' for row in rows)+'</tbody></table></div>'

def normalize_html(text):
    # Authors own content; the renderer only supplies an accessible scroll wrapper.
    return re.sub(r'<table\b([^>]*)>(.*?)</table>',lambda m:'<div class="table-wrap" tabindex="0" role="region" aria-label="ตาราง เลื่อนแนวนอนเพื่ออ่านครบ"><table'+m[1]+'>'+m[2]+'</table></div>',text,flags=re.S)

def section(sid, title, content, category=None):
    return f'<section class="lesson-section" id="{e(sid)}"'+(f' data-reader-category="{category}"' if category else '')+f'><h2>{title}</h2>{content}</section>\n'

def prerequisite_links(number):
    return ', '.join('<a href="chapter-'+n+'.html">'+EXPECTED[int(n)-1][0]+'</a>' for n in DEPENDENCIES[number]) or 'เริ่มจากศูนย์ได้'

def common_head(title, reader=False):
    # The shared footer depends on reader.css/js on landing pages as well.
    styles=['style','library','reader','study-halftone-footer','itds211']+([] if reader else ['universities'])
    scripts=['core','itds211-content','app','study-halftone-footer']+(['itds211-core','itds211-labs'] if reader else [])+['reader']
    return '<!doctype html>\n<html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f5f5f7"><meta name="description" content="เรียน ITDS211 ภาษาไทยจากพื้นฐาน พร้อมอ้างอิงสไลด์ ตัวอย่างทีละขั้น ภาพ Interactive และคำถามทบทวน"><title>'+e(title)+' · Study Garden</title><link rel="icon" href="../../assets/favicon.png" type="image/png">'+''.join(f'<link rel="stylesheet" href="../../assets/{s}.css">' for s in styles)+''.join(f'<script defer src="../../assets/{s}.js"></script>' for s in scripts)+'</head>\n'

HEADER='''<a class="skip" href="#main">ข้ามไปยังเนื้อหา</a><header class="site-header"><nav class="wrap nav" aria-label="เมนูหลัก"><a class="brand" href="../../index.html"><img class="brand-mark" src="../../assets/study-garden-logo.png" alt="" width="36" height="36" decoding="async">Study Garden</a><div class="nav-links"><a href="../../index.html#subjects">วิชาทั้งหมด</a><a class="desktop-link" href="index.html">บทเรียน</a></div><button class="theme-toggle" data-theme-toggle aria-label="สลับโหมดสี">☾ มืด</button></nav></header><div id="storage-notice" class="storage-notice" role="status" hidden>เบราว์เซอร์ไม่อนุญาตให้บันทึกข้อมูล ความคืบหน้าอาจไม่ถูกเก็บหลังปิดหน้า</div><noscript><p class="wrap note warm">เนื้อหา ตาราง คำถาม และเฉลยอ่านได้ทั้งหมดเมื่อปิด JavaScript เปิด JavaScript เพื่อใช้ Interactive, Flashcards และ Quiz</p></noscript>'''

def footer():
    template=(ROOT/'subjects/itds261/chapter-01.html').read_text(encoding='utf-8')
    result=template[template.index('<div class="footer-reveal">'):]
    result=result[:result.rfind('</body>')]
    result=result.replace('<nav class="footer-actions" aria-label="เลือกวิชา">','<nav class="footer-actions" aria-label="เลือกวิชา"><a class="footer-pill" href="index.html">ITDS211</a>')
    return result+'</body></html>\n'

def concept_figure(lesson, figure, index):
    parts=''.join('<div class="itds211-part"><b>'+f'{i+1:02}'+'</b>'+e(p)+'</div>' for i,p in enumerate(figure.get('parts',[])))
    flow='<div class="itds211-flow">'+'<i aria-hidden="true">→</i>'.join('<span>'+e(p)+'</span>' for p in figure.get('flow',[]))+'</div>' if figure.get('flow') else ''
    return '<figure class="itds211-figure" id="figure-'+str(index)+'"><h3>'+e(figure['title'])+'</h3><div class="itds211-parts">'+parts+'</div>'+flow+'<figcaption>'+e(figure['description'])+cite(lesson,figure['pages'])+'</figcaption></figure>'

def validate(d):
    index=int(d['id'])-1
    if index<0 or index>=12 or (d['code'],d['sourcePages'])!=EXPECTED[index]: raise ValueError(f'Unexpected source identity: {d["id"]}')
    if d['sourceFile']!=SOURCE_FILES[index] or d['lab']!=LABS[index]: raise ValueError('source filename or lab does not match the lecture')
    if not 3<=len(d['overview'])<=5: raise ValueError('overview must contain 3–5 lines')
    if len(d['quiz'])!=10 or len(d['cards'])<10 or not 5<=len(d['review'])<=10: raise ValueError('quiz/cards/review counts')
    ids=[s['id'] for s in d['sections']]
    reserved={'overview','prerequisites','worked-examples','interactive','visual-map','glossary','confusions','recap','review','flashcards','quiz','sources','coverage','review-answers'}
    if len(set(ids))!=len(ids) or set(ids)&reserved: raise ValueError('section IDs are duplicated or reserved')
    pages=[c['page'] for c in d['coverage']]
    if sorted(pages)!=list(range(1,d['sourcePages']+1)): raise ValueError('source coverage must include each page exactly once')
    byid={s['id']:s for s in d['sections']}
    for group in ['figures','workedExamples','glossary','confusions','review']:
        for item in d[group]:
            if not item['pages'] or any(not isinstance(p,int) or not 1<=p<=d['sourcePages'] for p in item['pages']): raise ValueError(f'invalid citation in {group}')
    for c in d['coverage']:
        if c['status'] not in ('context','explained','needs-review'): raise ValueError('unknown coverage status')
        if not c['sectionIds'] or any(x not in byid for x in c['sectionIds']): raise ValueError(f'coverage invalid section: {c}')
        if not any(c['page'] in byid[x]['pages'] for x in c['sectionIds']): raise ValueError(f'coverage page not taught by cited section: {c}')
    for s in d['sections']:
        if not s['pages'] or any(p<1 or p>d['sourcePages'] for p in s['pages']): raise ValueError(f'invalid source pages {s["id"]}')
    for q in d['quiz']:
        if len(q['options'])!=4 or q['answer'] not in range(4): raise ValueError('invalid quiz answer')

def render_lesson(d, lessons):
    number=d['id']; code=d['code']
    image_name,image_title,image_pages=write_visual(d,ROOT/'assets/itds211-visuals')
    body=section('overview','1 · ภาพรวมบทนี้',''.join('<p>'+e(t)+'</p>' for t in d['overview'])+cite(d,[1]))
    body+=section('prerequisites','2 · พื้นฐานที่ต้องรู้ก่อน','<p>[อธิบายเสริม] บทที่ช่วยปูพื้นฐาน: '+prerequisite_links(number)+'</p>'+normalize_html(d['prerequisitesHtml'])+cite(d,[1]))
    for n,s in enumerate(d['sections'],1):
        source=cite(d,s['pages'])
        html=normalize_html(s['html'])
        # A subsection can inherit the section's page set without losing its source.
        html=re.sub(r'(</h[34]>)',lambda m:m[0]+source,html)
        body+=section(s['id'],f'3.{n} · '+e(s['title']),'<p class="itds211-problem"><strong>'+e(s['question'])+'</strong></p>'+source+html)
    if d['figures']:
        overview_image='<figure class="itds211-figure itds211-illustration"><img src="../../assets/itds211-visuals/'+e(image_name)+'" width="828" height="330" loading="lazy" decoding="async" alt="'+e(image_title)+'"><figcaption>[อธิบายเสริม] '+e(image_title)+' · ภาพวาดใหม่เพื่อทบทวนแนวคิด <a href="../../assets/itds211-visuals/'+e(image_name)+'" target="_blank" rel="noopener">เปิดภาพขนาดเต็ม ↗</a>'+cite(d,image_pages)+'</figcaption></figure>'
        body+=section('visual-map','ภาพประกอบและทางไหลข้อมูล','<p>[อธิบายเสริม] ภาพจัดวางใหม่เพื่อทบทวนแนวคิดจากสไลด์ อ่านคำอธิบายส่วนประกอบและลูกศรควบคู่กับเนื้อหาหลัก</p>'+overview_image+''.join(concept_figure(d,f,i+1) for i,f in enumerate(d['figures'])))
    examples=''.join('<h3>'+e(x['title'])+'</h3>'+cite(d,x['pages'])+normalize_html(x['html']) for x in d['workedExamples'])
    body+=section('worked-examples','4 · ตัวอย่างและวิธีทำทีละขั้น',examples or '<p>บทนี้ไม่มีโจทย์คำนวณในต้นฉบับ ใช้คำถามท้ายบทตรวจความเข้าใจ</p>')
    body+=section('interactive','ห้องทดลอง · ลองเปลี่ยนค่าแล้วสังเกต',normalize_html(d.get('interactiveGuide','<p>[อธิบายเสริม] แบบจำลองสำหรับฝึกตามแนวคิดในบท เปลี่ยนค่าทีละอย่าง แล้วอธิบายเหตุผลก่อนกดดูผล</p>'))+cite(d,LAB_SOURCE_PAGES[int(number)-1])+'<div class="itds211-lab" data-itds211-lab="'+e(d['lab'])+'"><p>กำลังเตรียมห้องทดลอง…</p></div><noscript><p>ตัวอย่างวิธีทำแบบข้อความอยู่ในหัวข้อก่อนหน้า</p></noscript>','practice')
    rows=[[e(g['term'])+'<br><span lang="th">'+e(g['thai'])+'</span>',e(g['meaning']),e(g['note'])+cite(d,g['pages'])] for g in d['glossary']]
    body+=section('glossary','5 · ตารางคำศัพท์สำคัญ',table(['ศัพท์ | คำไทย','ความหมายง่าย ๆ','หมายเหตุและต้นทาง'],rows,'คำศัพท์ประจำบท'))
    body+=section('confusions','6 · จุดที่มักสับสนและประเด็นฝึกสอบ','<p>[อธิบายเสริม] ประเด็นสำหรับตรวจความเข้าใจ ไม่ใช่การยืนยันข้อสอบจริง</p>'+''.join('<h3>'+e(x['title'])+'</h3>'+cite(d,x['pages'])+normalize_html(x['html']) for x in d['confusions']))
    body+=section('recap','7 · ทบทวนก่อนสอบ','<ul>'+''.join('<li>'+e(x)+'</li>' for x in d['recap'])+'</ul>'+cite(d,range(1,d['sourcePages']+1)))
    body+=section('review','8 · คำถามทบทวน','<p>[อธิบายเสริม] ลองตอบก่อนเปิดเฉลยท้ายบท มีทั้งความเข้าใจและการคำนวณเมื่อบทนั้นใช้การคำนวณ</p><ol>'+''.join('<li>'+e(x['question'])+cite(d,x['pages'])+'</li>' for x in d['review'])+'</ol><p><a href="#review-answers">ไปยังเฉลยละเอียดท้ายบท ↓</a></p>')
    body+=section('flashcards','Flashcards · คำศัพท์และความเชื่อมโยง','<p>กดการ์ด หรือใช้ Enter / Space เพื่อพลิกดูความหมาย</p><button id="flashcard" class="flashcard" aria-pressed="false" aria-labelledby="flash-label flash-text"><small id="flash-label">คำศัพท์</small><span id="flash-text" class="flashcard-term" aria-live="polite"></span><small>แตะเพื่อพลิก ↻</small></button><div class="flash-controls"><button class="btn tiny" id="flash-prev">← ใบก่อน</button><span id="flash-position" class="small muted" aria-live="polite"></span><button class="btn tiny" id="flash-next">ใบถัดไป →</button></div>')
    body+=section('quiz','Quiz ท้ายบท · 10 ข้อ','<p>[อธิบายเสริม] แบบฝึกหัดตรวจความเข้าใจ เลือกให้ครบแล้วกดตรวจคำตอบ</p><form id="quiz-form"><div id="quiz-questions"></div><p id="quiz-count" class="small muted" aria-live="polite">ตอบแล้ว 0 / 10 ข้อ</p><p id="quiz-error" class="error-text" role="alert"></p><div class="actions"><button id="quiz-submit" class="btn primary" type="submit">ตรวจคำตอบ →</button><button id="quiz-retry" class="btn" type="button" hidden>ทำใหม่ ↻</button></div><div id="quiz-result" class="quiz-result" tabindex="-1" hidden><h3 id="quiz-score"></h3><p id="quiz-message"></p></div></form>')
    issues='<ul>'+''.join('<li>'+e(x)+'</li>' for x in d['sourceIssues'])+'</ul>' if d['sourceIssues'] else '<p>ไม่มีข้อคลาดเคลื่อนของต้นฉบับที่บันทึกไว้สำหรับบทนี้</p>'
    body+=section('sources','แหล่งอ้างอิงและข้อสังเกตต้นฉบับ','<p>เอกสาร: <strong>'+e(d['sourceFile'])+'</strong> · '+str(d['sourcePages'])+' หน้า เลขหน้า PDF เริ่มที่ปกเป็นหน้า 1</p><p>กดเลขหน้าอ้างอิงแล้วเลือก PDF ต้นฉบับจากเครื่องเพื่อเปิดเทียบ ไฟล์ที่เลือกใช้ดูในเบราว์เซอร์นี้</p><button class="btn" type="button" data-source-page="1">เลือก PDF และเปิดดูต้นฉบับ</button>'+issues+'<p><a href="index.html">กลับหน้ารวมบทเรียน ITDS211 ↗</a></p>')
    statuses={'context':'บริบท/ข้อมูลรายวิชา','explained':'มีคำอธิบายในบท','needs-review':'ต้องตรวจเพิ่ม'}
    rows=[[str(c['page']),e(statuses.get(c['status'],c['status'])),e(c['note']),'<br>'.join('<a href="#'+e(sid)+'">'+e(next(s['title'] for s in d['sections'] if s['id']==sid))+'</a>' for sid in c['sectionIds'])] for c in d['coverage']]
    unfinished=[c for c in d['coverage'] if c['status'] not in ('context','explained')]
    body+=section('coverage','ตรวจความครอบคลุมสไลด์','<p>ลงรายการครบ '+str(d['sourcePages'])+' หน้า โดยแยกหน้าบริบทออกจากหน้าที่มีเนื้อหาสอน'+(' · ยังมีหน้าที่ต้องตรวจเพิ่ม '+str(len(unfinished))+' หน้า' if unfinished else ' · ไม่มีหน้าที่ระบุว่าข้ามหรือรอตรวจเพิ่ม')+'</p><p class="muted small">ทะเบียนนี้ระบุว่าคำอธิบายอยู่ตรงไหน เป็นบันทึกตรวจเนื้อหา ไม่ใช่การยืนยันจากอาจารย์</p><details class="itds211-coverage"><summary>ดูทะเบียนรายหน้า '+str(d['sourcePages'])+' หน้า</summary>'+table(['หน้า PDF','สถานะ','สิ่งที่ตรวจ/อธิบาย','กลับไปหัวข้อ'],rows,'ทะเบียนสไลด์ต้นทางรายหน้า')+'</details>')
    body+=section('review-answers','เฉลยละเอียด · คำถามทบทวนท้ายบท','<p>[อธิบายเสริม] แนวตอบพร้อมเหตุผล ใช้ตรวจวิธีคิดหลังลองทำด้วยตัวเอง</p>'+''.join('<div class="itds211-review"><h3>'+str(i+1)+'. '+e(x['question'])+'</h3>'+normalize_html(x['answerHtml'])+cite(d,x['pages'])+'</div>' for i,x in enumerate(d['review'])))
    previous=int(number)-1; following=int(number)+1
    nav='<a class="btn" href="'+(f'chapter-{previous:02}.html' if previous else 'index.html')+'">← '+('บทก่อนหน้า' if previous else 'ภาพรวมวิชา')+'</a>'
    if following<=12: nav+=f'<a class="btn primary" href="chapter-{following:02}.html">บทถัดไป →</a>'
    else: nav+='<a class="btn primary" href="index.html">กลับแผนที่รายวิชา →</a>'
    hero=f'<nav class="breadcrumb" aria-label="เส้นทาง"><a href="../../index.html">วิชาทั้งหมด</a><span>/</span><a href="index.html">ITDS211</a><span>/</span><span>{code}</span></nav><header class="chapter-hero"><div class="eyebrow">ITDS211 · {code} · ลำดับเรียน {int(number)} / 12</div><h1>{e(d["title"])}</h1><p>{e(d["englishTitle"])}</p><div class="tags"><span class="pill">ต้นฉบับ {d["sourcePages"]} หน้า</span><span class="tag" data-chapter-status="{number}">ยังไม่ได้อ่าน</span></div></header>'
    html=common_head(d['title'],True)+f'<body data-subject="itds211" data-chapter="{number}" data-reader-mode="paged" data-source-file="{e(d["sourceFile"])}">'+HEADER+'<main id="main" class="wrap">'+hero+'<div class="lesson-layout"><aside class="toc" aria-label="สารบัญบทเรียน"><h2>ในบทนี้</h2><a href="#overview">ภาพรวม</a><a href="#sources">ต้นฉบับ</a></aside><article class="lesson-content">'+body+'<button class="btn soft" data-mark-read aria-pressed="false">ทำเครื่องหมายว่าอ่านแล้ว ✓</button><nav class="chapter-end" aria-label="เปลี่ยนบท">'+nav+'</nav></article></div></main>'+footer()
    (OUT/f'chapter-{number}.html').write_text(html,encoding='utf-8')


def folder_shapes():
    # Reuse the site's actual silhouettes, including normalized SVG coordinates.
    home=(ROOT/'index.html').read_text(encoding='utf-8')
    shapes=re.search(r'<svg\b[^>]*class="folder-shapes"[^>]*>.*?</svg>',home,re.S)
    if not shapes: raise ValueError('Shared folder shape definitions are missing from the home page')
    return shapes[0]


def folder(d):
    n=d['id'];code=d['code'];title=e(d['title'])
    return f'''<article class="folder-card palette-glacier" data-search-text="ITDS211 {code} {title} {e(d['englishTitle'])}"><span class="folder-category">{code} · {d['sourcePages']} หน้า</span><details class="glass-folder" name="chapters"><summary aria-label="เปิดแฟ้ม {code} {title}"><span class="folder-object" aria-hidden="true"><span class="folder-back art-glacier"></span><svg class="folder-rim folder-back-rim" viewBox="0 0 340 272" preserveAspectRatio="none"><path d="M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z"/></svg><span class="folder-sheet sheet-one"><span>บทเรียน</span><i></i><i></i><i></i></span><span class="folder-sheet sheet-two"><span>Flashcards</span><b>{len(d['cards'])}</b></span><span class="folder-sheet sheet-three"><span>Quiz</span><b>10</b></span><span class="folder-front"><svg class="folder-rim folder-front-rim" viewBox="0 0 340 198" preserveAspectRatio="none"><path d="M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 176A22 22 0 0 1 318 198L22 198A22 22 0 0 1 0 176Z"/></svg><span class="folder-label"><span class="folder-code">ITDS211 / {code}</span><strong>{title}</strong></span><span class="folder-key">↗</span></span></span></summary><nav class="folder-files" aria-label="เนื้อหา {code}"><a href="chapter-{n}.html"><span>บทเรียนและตัวอย่าง</span><span>↗</span></a><a href="chapter-{n}.html#interactive"><span>ห้องทดลอง</span><span>↗</span></a><a href="chapter-{n}.html#quiz"><span>Quiz · 10 ข้อ</span><span>↗</span></a></nav></details><div class="folder-caption"><a href="chapter-{n}.html">{code} <span>↗</span></a><span data-chapter-status="{n}">ยังไม่ได้อ่าน</span></div></article>'''

def build(release=False):
    lessons=[]
    for path in sorted((AUTH/'lessons').glob('*.json')):
        d=json.loads(path.read_text(encoding='utf-8'));validate(d);lessons.append(d)
    if release and ([d['id'] for d in lessons]!=[f'{n:02}' for n in range(1,13)] or any(c['status']=='needs-review' for d in lessons for c in d['coverage'])):
        raise ValueError('Release requires all twelve lectures and no unresolved coverage rows')
    OUT.mkdir(parents=True,exist_ok=True)
    for d in lessons: render_lesson(d,lessons)
    content={d['id']:{'title':d['title'],'cards':d['cards'],'quiz':d['quiz']} for d in lessons}
    (ROOT/'assets/itds211-content.js').write_text('window.StudyContent = window.StudyContent || {};\nwindow.StudyContent.itds211 = '+json.dumps(content,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
    ready_codes={d['code'] for d in lessons}
    missing=[code for code,_ in EXPECTED if code not in ready_codes]
    note='<p>กำลังจัดทำบทที่เหลือ: '+e(', '.join(missing))+'</p>' if missing else '<p>บทเรียนแยก 12 บทตามไฟล์ที่ได้รับ รวมต้นฉบับ 648 หน้า เรียนจาก CA00–CA08 แล้วต่อ OS01–OS03</p>'
    index=common_head('ITDS211 · Computer Architecture and Operating Systems')+'<body data-subject="itds211">'+folder_shapes()+HEADER+'<main id="main" class="wrap library-main"><nav class="breadcrumb"><a href="../../index.html">วิชาทั้งหมด</a><span>/</span><span>ITDS211</span></nav><div class="page-heading"><div><h1>ITDS211</h1><p>Computer Architecture and Operating Systems</p></div><label class="search-field"><input id="subject-search" type="search" placeholder="ค้นหาบทหรือหัวข้อ" aria-label="ค้นหาบทเรียน"></label></div><p class="itds211-intro">เริ่มจากเครื่องคอมพิวเตอร์ทำงานอย่างไร ไปถึงระบบปฏิบัติการจัดการโปรแกรมหลายงาน อ่านทีละหัวข้อ ทดลองทีละขั้น แล้วใช้คำถามท้ายบทตรวจว่าตัวเองอธิบายเหตุผลได้</p>'+note+'<div class="library-toolbar"><span class="active-tab">บทเรียน <span>'+str(len(lessons))+'</span></span><div class="reading-progress"><span>อ่านแล้ว <strong data-read-count>0</strong> / '+str(len(lessons))+' บท</span><div class="progress-bar"><span data-progress-bar></span></div></div></div><section class="folder-grid" aria-label="บทเรียนเรียงตามพื้นฐาน">'+''.join(folder(d) for d in lessons)+'</section><p id="search-empty" class="filter-empty" role="status" hidden>ไม่พบบทที่ค้นหา ลองค้นหาชื่อหัวข้อหรือ CA / OS</p></main>'+footer()
    (OUT/'index.html').write_text(index,encoding='utf-8')
    source_map=[{'id':d['id'],'code':d['code'],'file':d['sourceFile'],'pages':d['sourcePages'],'coverage':d['coverage'],'issues':d['sourceIssues']} for d in lessons]
    (ROOT/'docs/itds211-source-map.json').write_text(json.dumps(source_map,ensure_ascii=False,indent=2),encoding='utf-8')
    (OUT/'sources.json').write_text(json.dumps([{k:v for k,v in x.items() if k!='coverage'} for x in source_map],ensure_ascii=False,indent=2),encoding='utf-8')
    if release:
        home_path=ROOT/'index.html'
        home=home_path.read_text(encoding='utf-8')
        def sync_card(match):
            card=match[0]
            card=re.sub(r'(<span>Flashcards</span><b>)\d+(</b>)',lambda m:m[1]+str(sum(len(d['cards']) for d in lessons))+m[2],card,count=1)
            return card
        home,count=re.subn(r'<article\b[^>]*data-search-text="ITDS211[^"]*"[^>]*>.*?</article>',sync_card,home,count=1,flags=re.S)
        if count!=1: raise ValueError('ITDS211 home folder is missing')
        home_path.write_text(home,encoding='utf-8')
    print(f'Rendered {len(lessons)} separate lessons; {sum(d["sourcePages"] for d in lessons)} source pages indexed. Missing: {", ".join(missing) or "none"}.')

if __name__=='__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release',action='store_true',help='require all twelve complete coverage records')
    build(parser.parse_args().release)
