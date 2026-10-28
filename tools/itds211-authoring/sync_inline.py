"""Update only the inline aids in existing ITDS211 pages, preserving hand edits."""
from pathlib import Path
import re, hashlib
from inline_visuals import inline_html, DATA, SIMS

ROOT=Path(__file__).resolve().parents[2]
for chapter in DATA:
    path=ROOT/'subjects/itds211'/f'chapter-{chapter}.html'
    text=path.read_text(encoding='utf-8')
    text=re.sub(r'<!-- itds211-inline:start -->.*?<!-- itds211-inline:end -->','',text,flags=re.S)
    targets={x[0] for x in DATA[chapter]}
    if chapter in SIMS:
        targets.add(SIMS[chapter][0])
    for target in targets:
        pattern=r'(<section class="lesson-section" id="'+re.escape(target)+r'">)(.*?)(</section>)'
        def update(match):
            body=match[2]
            # Skip the question/citation; insert after the first explanatory paragraph.
            start=body.find('</small>')+8
            end=body.find('</p>',start)+4
            if end < 4:
                end=len(body)
            return match[1]+body[:end]+inline_html(chapter,target)+body[end:]+match[3]
        text,count=re.subn(pattern,update,text,flags=re.S)
        if count!=1:
            raise ValueError(f'Missing or duplicated section: {chapter}/{target}')
    if 'assets/itds211-inline.js' not in text:
        text=text.replace('<script defer src="../../assets/reader.js', '<script defer src="../../assets/itds211-inline.js"></script><script defer src="../../assets/reader.js')
    path.write_text(text,encoding='utf-8')

# Content hashes are scoped to this course; other courses are untouched.
for path in (ROOT/'subjects/itds211').glob('*.html'):
    text=path.read_text(encoding='utf-8')
    for asset in ['itds211.css','itds211-inline.js']:
        digest=hashlib.sha256((ROOT/'assets'/asset).read_text(encoding='utf-8').encode('utf-8')).hexdigest()[:12]
        text=re.sub(r'../../assets/'+re.escape(asset)+r'(?:\?v=[a-f0-9]+)?', '../../assets/'+asset+'?v='+digest,text)
    path.write_text(text,encoding='utf-8')
print('Updated 48 inline maps and 8 simulations in ITDS211 only.')
