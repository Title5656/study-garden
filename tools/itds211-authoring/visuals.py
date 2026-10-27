"""Small, original SVG teaching diagrams; not reproductions of source slides."""
from html import escape


def label(x, y, text, kind='label', anchor='middle'):
    return f'<text x="{x}" y="{y}" class="{kind}" text-anchor="{anchor}">{escape(str(text))}</text>'


def box(x, y, width, height, title, subtitle='', color='blue'):
    result = f'<rect x="{x}" y="{y}" width="{width}" height="{height}" rx="14" class="{color}"/>'
    result += label(x + width / 2, y + height / 2 + (5 if not subtitle else -4), title)
    if subtitle:
        result += label(x + width / 2, y + height / 2 + 20, subtitle, 'small')
    return result


def arrow(x1, y1, x2, y2, text=''):
    result = f'<path d="M{x1},{y1} L{x2},{y2}" class="arrow" marker-end="url(#head)"/>'
    if text:
        result += label((x1+x2)/2, (y1+y2)/2 - 10, text, 'small')
    return result


def overview():
    return (box(38,90,208,90,'HARDWARE','CPU · memory · I/O')
            + arrow(246,135,302,135)
            + box(310,90,208,90,'INSTRUCTIONS','data · ISA · pipeline')
            + arrow(518,135,574,135)
            + box(582,90,208,90,'OPERATING SYSTEM','process · scheduling')
            + label(414,236,'Understand each layer, then follow how they work together.','small'))


def components():
    return (box(42,100,190,100,'INPUT / OUTPUT','devices exchange data')
            + box(314,100,200,100,'CPU','control unit + ALU')
            + box(596,100,190,100,'MEMORY','instructions + data')
            + arrow(232,135,306,135)+arrow(306,170,232,170)
            + arrow(514,135,588,135)+arrow(588,170,514,170)
            + label(414,58,'One computer, different responsibilities')
            + label(414,249,'Addresses identify a location; data carries its contents.','small'))


def registers():
    return (box(35,75,175,70,'PC','next instruction')+arrow(210,110,277,110)
            +box(285,75,175,70,'MAR','address to access')+arrow(460,110,552,110,'address')
            +box(560,75,220,150,'MEMORY','address → stored value')
            +box(285,175,175,70,'MBR','value being transferred')
            +arrow(560,208,468,208,'data')+arrow(285,210,218,210)
            +box(35,175,175,70,'IR / AC','instruction / work value'))


def bits():
    result = label(414,64,'IEEE 754 binary32: 32 bits with three jobs')
    result += box(45,102,85,84,'S','1 bit','rose')
    result += box(138,102,220,84,'EXPONENT','8 bits · bias 127','sand')
    result += box(366,102,415,84,'FRACTION','23 bits','blue')
    result += label(414,239,'Normal value = (−1)^S × (1 + fraction) × 2^(exponent − 127)','small')
    result += label(414,273,'Exponent 0 and 255 need the special-case rules explained in the lesson.','small')
    return result


def hierarchy():
    result = ''
    for y,width,title,sub,color in [(45,210,'REGISTERS','closest to the CPU','rose'),(105,335,'CACHE','recently used blocks','sand'),(165,470,'MAIN MEMORY','working programs and data','blue'),(225,620,'SECONDARY STORAGE','persistent files','green')]:
        result += box(414-width/2,y,width,53,title,sub,color)
    return result + arrow(65,220,65,90) + label(65,253,'FASTER','small') + arrow(757,90,757,220) + label(757,253,'LARGER','small')


def io_paths():
    result = label(414,34,'Who waits, and who moves the data?')
    for y,title,middle,tail,color in [(65,'PROGRAMMED I/O','CPU checks device','CPU moves data','rose'),(145,'INTERRUPT I/O','device signals ready','CPU moves data','sand'),(225,'DMA','CPU sets up transfer','DMA moves a block','green')]:
        result += box(35,y,205,60,title,'',color)+arrow(240,y+30,292,y+30)
        result += box(300,y,225,60,middle)+arrow(525,y+30,577,y+30)
        result += box(585,y,205,60,tail)
    return result


def disk():
    result = label(414,34,'Disk access: position first, then transfer')
    result += '<circle cx="180" cy="160" r="107" class="blue"/><circle cx="180" cy="160" r="74" class="track"/><circle cx="180" cy="160" r="42" class="track"/><circle cx="180" cy="160" r="13" class="hub"/>'
    result += '<path d="M40,105 L153,138 L170,151" class="arm"/>'
    result += label(180,298,'track + sector + read/write head','small')
    result += box(355,60,400,55,'1 · SEEK','', 'rose')
    result += box(355,133,400,55,'2 · ROTATIONAL LATENCY','', 'sand')
    result += box(355,206,400,55,'3 · TRANSFER','', 'green')
    result += arrow(555,115,555,125)+arrow(555,188,555,198)
    return result


def pipeline():
    result = label(414,35,'Different instructions overlap; each keeps its own order.')
    stages=['IF','ID','EX','MEM','WB']
    for cycle in range(7):
        result += label(218+cycle*80,73,str(cycle+1),'small')
    for row in range(3):
        y=94+row*60
        result += label(100,y+30,'Instruction '+str(row+1),'small')
        for i,stage in enumerate(stages):
            result += box(184+(i+row)*80,y,69,44,stage,'',['blue','sand','green'][row])
    return result+label(414,301,'Ideal example: no hazards. Stalls and forwarding are shown in the lab.','small')


def parallel():
    result=label(220,40,'SHARED MEMORY')+label(632,40,'MESSAGE PASSING')
    result+=box(46,80,145,65,'CPU A')+box(249,80,145,65,'CPU B')
    result+=box(93,214,255,65,'ONE MEMORY','shared address space','green')
    result+=arrow(118,145,176,206)+arrow(321,145,263,206)
    result+=box(463,80,142,65,'CPU A')+box(659,80,142,65,'CPU B')
    result+=box(463,214,142,65,'MEMORY A','','green')+box(659,214,142,65,'MEMORY B','','green')
    result+=arrow(534,145,534,206)+arrow(730,145,730,206)
    result+=arrow(605,111,651,111)+arrow(659,133,613,133)
    return result


def os_layers():
    return (box(99,48,630,65,'APPLICATIONS','programs ask for services','blue')
            +arrow(414,113,414,144)+label(489,136,'system call','small')
            +box(99,152,630,65,'OPERATING SYSTEM','manage resources and provide abstractions','sand')
            +arrow(414,217,414,248)
            +box(99,256,630,50,'HARDWARE: CPU · MEMORY · DEVICES','','green'))


def states():
    result = box(40,65,184,75,'READY','waiting for CPU')
    result += box(319,65,190,75,'RUNNING','using the CPU','green')
    result += box(604,65,184,75,'TERMINATED','finished','rose')
    result += box(319,230,190,75,'BLOCKED','waiting for an event','sand')
    result += arrow(224,90,311,90,'dispatch')+arrow(319,129,232,129,'timeout')
    result += arrow(509,102,596,102,'exit')+arrow(414,140,414,222,'I/O request')
    result += '<path d="M319,268 L132,268 L132,148" class="arrow" marker-end="url(#head)"/>'
    result += label(191,256,'I/O complete','small')
    return result


def scheduling():
    result = label(414,40,'FCFS example · all three jobs arrive at time 0')
    for x,w,title,color in [(66,278,'A · burst 5','blue'),(344,167,'B · burst 3','sand'),(511,223,'C · burst 4','green')]:
        result += box(x,83,w,64,title,'',color)
    for x,t in [(66,0),(344,5),(511,8),(734,12)]:result+=label(x,173,t,'small')
    result += box(66,216,310,70,'WAITING','A = 0 · B = 5 · C = 8','sand')
    result += box(424,216,310,70,'TURNAROUND','A = 5 · B = 8 · C = 12','green')
    return result


VISUALS = {
 '01': ('course-map', 'แผนที่เชื่อมฮาร์ดแวร์ คำสั่ง และระบบปฏิบัติการ', [3,4,7,8], overview),
 '02': ('computer-components', 'ส่วนประกอบคอมพิวเตอร์และการแลกเปลี่ยนข้อมูล', [13,14], components),
 '03': ('register-data-flow', 'ตามที่อยู่และค่าระหว่างรีจิสเตอร์กับหน่วยความจำ', [5,10,11], registers),
 '04': ('float-bit-fields', 'บิตเครื่องหมาย เลขชี้กำลัง และเศษส่วนของ binary32', [25,26,27,28,29], bits),
 '05': ('memory-hierarchy', 'ลำดับชั้นหน่วยความจำจากรีจิสเตอร์ถึงที่เก็บข้อมูล', [6,7,8], hierarchy),
 '06': ('io-transfer-paths', 'เปรียบเทียบผู้รอและผู้ย้ายข้อมูลใน I/O สามแบบ', [8,9,10,11], io_paths),
 '07': ('disk-access', 'สามช่วงเวลาที่ต้องใช้ก่อนดิสก์ส่งข้อมูลครบ', [7,14,15], disk),
 '08': ('pipeline-overlap', 'คำสั่งสามคำสั่งซ้อนงานใน pipeline ห้าขั้น', [4,5,6], pipeline),
 '09': ('parallel-models', 'หน่วยความจำร่วมและการส่งข้อความระหว่างเครื่อง', [19,31], parallel),
 '10': ('os-layers', 'โปรแกรมเรียกบริการระบบปฏิบัติการเพื่อใช้ฮาร์ดแวร์', [11,12,20,24], os_layers),
 '11': ('process-states', 'เหตุการณ์ที่ทำให้ process เปลี่ยนสถานะ', [14,38,39], states),
 '12': ('scheduling-timeline', 'ตัวอย่างเสริม FCFS พร้อมเวลารอและเวลาตั้งแต่มาถึงจนเสร็จ', [13,18,19], scheduling),
}


def write_visual(lesson, output):
    slug, title, pages, draw = VISUALS[lesson['id']]
    pages = pages or lesson['figures'][0]['pages']
    styles = '''text{font-family:Arial,sans-serif;fill:#18384b}.label{font-size:18px;font-weight:700}.small{font-size:14px;font-weight:400}.tiny{font-size:12px}.blue{fill:#e1eef7;stroke:#83acc8;stroke-width:1.5}.sand{fill:#fff0cf;stroke:#d6b96f;stroke-width:1.5}.green{fill:#dcf0e4;stroke:#86b89a;stroke-width:1.5}.rose{fill:#f8e4e5;stroke:#cc9caa;stroke-width:1.5}.arrow{fill:none;stroke:#4b718b;stroke-width:2.5}.track{fill:none;stroke:#83acc8;stroke-width:2}.hub{fill:#fff;stroke:#83acc8;stroke-width:2}.arm{fill:none;stroke:#365e7a;stroke-width:9;stroke-linecap:round}'''
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 828 330" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">Original supplementary teaching diagram for {escape(lesson["code"])}. Detailed parts and flow are explained beside this image.</desc><defs><style>{styles}</style><marker id="head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="#4b718b"/></marker></defs><rect width="828" height="330" rx="18" fill="#f7fafc"/>{draw()}</svg>\n'
    output.mkdir(parents=True, exist_ok=True)
    name=lesson['id']+'-'+slug+'.svg'
    (output/name).write_text(svg, encoding='utf-8')
    return name, title, pages
