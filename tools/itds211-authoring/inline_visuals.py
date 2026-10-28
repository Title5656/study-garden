"""Authored in-context teaching aids. Static explanations also work without JS."""
from pathlib import Path
from html import escape
import json

DATA = json.loads(Path(__file__).with_name('inline-visuals.json').read_text(encoding='utf-8'))
SIMS = {
    '02': ('clock-and-cpu-equation', 'cpu', 'GHz เพิ่มแล้วเวลาเปลี่ยนอย่างไร?', 'ตรึง IC = 500 ล้านคำสั่ง และ CPI = 2 แล้วเปลี่ยนเฉพาะความถี่: ที่ 2 GHz ใช้เวลา 0.5 วินาที; ที่ 4 GHz ใช้ 0.25 วินาที'),
    '04': ('twos-complement', 'bits', 'บิตชุดเดียว อ่านได้สองความหมาย', 'ใน 8 บิต รหัส 10000000 อ่านแบบ unsigned ได้ 128 แต่แบบ two’s complement ได้ −128 เพราะบิตซ้ายสุดมีน้ำหนัก −128'),
    '05': ('direct-mapping', 'cache', 'ที่อยู่นี้ต้องไป cache line ไหน?', 'สมมติ 4 lines, block ละ 4 bytes: address 0 และ 16 อยู่คนละ block แต่ลง line 0 เหมือนกัน จึงต้องตรวจ tag เพื่อแยกให้ออก'),
    '07': ('disk-timing', 'disk', 'หมุนเร็วขึ้น ลดเวลาส่วนไหน?', 'ตรึง seek 5 ms, ข้อมูล 1 MB, transfer rate 100 MB/s และไม่คิด overhead; ที่ 6000 rpm รอหมุนเฉลี่ย 5 ms รวม 20 ms'),
    '08': ('pipeline-timing', 'pipeline', 'เพิ่มคำสั่งแล้ว pipeline ช่วยอย่างไร?', 'สมมติ 5 stages ใช้เวลาเท่ากัน ขั้นละ 1 cycle ไม่มี hazard หรือ overhead: N คำสั่งใช้ N + 4 cycles เทียบกับ 5N cycles เมื่อทำทีละคำสั่ง'),
    '09': ('parallel-programming-cost', 'amdahl', 'เพิ่มคอร์แล้วส่วนที่แบ่งไม่ได้ยังอยู่', 'แบบจำลอง Amdahl สมมติส่วน parallel 75%, serial 25%, ไม่มี communication overhead: 4 คอร์เร็วขึ้น 1 / (0.25 + 0.75/4) ≈ 2.29 เท่า'),
    '11': ('process-states', 'process', 'ลองส่งเหตุการณ์ให้โปรเซส', 'Ready → dispatch → Running → รอ I/O → Blocked → I/O เสร็จ → Ready; ต้องถูก dispatch อีกครั้งจึงจะได้รัน'),
    '12': ('round-robin', 'schedule', 'Quantum เปลี่ยนลำดับแบ่ง CPU อย่างไร?', 'สมมติงาน A/B/C มาที่เวลา 0 มี burst 5/3/1 ตามลำดับ ไม่มี I/O และไม่คิด context-switch overhead; ลองเปรียบเทียบ q = 1 กับ q = 4')
}

def inline_html(chapter, section):
    result = ''
    for target, title, kind, nodes, takeaway in DATA.get(chapter, []):
        if target != section:
            continue
        items = ''.join('<li><div class="itds211-map-label"><strong>'+escape(label)+'</strong><span>'+escape(symbol)+'</span></div><p class="itds211-map-detail">'+escape(detail)+'</p></li>' for label, symbol, detail in nodes)
        result += '<figure class="itds211-inline-map" data-map-kind="'+kind+'"><figcaption><span class="itds211-inline-kicker">[อธิบายเสริม] · มองให้เห็นภาพ</span><h3>'+escape(title)+'</h3></figcaption><p class="itds211-map-hint" hidden>เลือกแต่ละจุดเพื่อดูว่าเกี่ยวข้องกับเนื้อหานี้อย่างไร</p><ol class="itds211-map-nodes">'+items+'</ol><p class="itds211-map-takeaway"><strong>เชื่อมกลับกับเนื้อหา</strong> '+escape(takeaway)+'</p></figure>'
    sim = SIMS.get(chapter)
    if sim and sim[0] == section:
        _, kind, title, explanation = sim
        result += '<figure class="itds211-inline-sim" data-inline-sim="'+kind+'"><figcaption><span class="itds211-inline-kicker">[อธิบายเสริม] · ลองแล้วเห็นผล</span><h3>'+escape(title)+'</h3></figcaption><p>'+escape(explanation)+'</p><div class="itds211-sim-live" hidden></div></figure>'
    return '<!-- itds211-inline:start -->'+result+'<!-- itds211-inline:end -->' if result else ''

def embed_inline(chapter, section, html):
    visual = inline_html(chapter, section)
    if not visual:
        return html
    # Place it directly after the first explanation, before the rest of the topic.
    split = html.find('</p>') + 4
    return html[:split] + visual + html[split:] if split > 3 else visual + html

def validate_inline(lessons):
    for lesson in lessons:
        chapter=lesson['id']
        ids={s['id'] for s in lesson['sections']}
        for target, *_ in DATA.get(chapter, []):
            if target not in ids:
                raise ValueError(f'Inline visual target missing: {chapter}/{target}')
        if chapter in SIMS and SIMS[chapter][0] not in ids:
            raise ValueError(f'Inline simulator target missing: {chapter}')
