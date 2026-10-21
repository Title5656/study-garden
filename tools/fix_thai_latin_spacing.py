#!/usr/bin/env python3
"""
ตรวจ/แก้ช่องว่างระหว่างอักษรไทยกับอักษรละติน/ตัวเลข ในไฟล์ .html และ .md

วิธีใช้
  python fix_thai_latin_spacing.py <ไฟล์หรือโฟลเดอร์>            # โหมดรายงาน (ยังไม่แก้ไฟล์)
  python fix_thai_latin_spacing.py <ไฟล์หรือโฟลเดอร์> --write    # แก้ไฟล์จริง

ตัวอย่างที่ถูกแก้
  "Givenเข้าสู่ระบบและกรอกเลขถนน"  ->  "Given เข้าสู่ระบบและกรอกเลขถนน"
  "ครอบคลุม5stories"               ->  "ครอบคลุม 5stories"   (รอยต่อตัวเลข/ตัวอักษรละติน เช่น 5stories ต้องแก้มือ)

ข้อควรระวัง
  - แตะเฉพาะ "ข้อความ" ใน HTML ไม่แตะ tag, attribute, <script>, <style>, <pre>, <code>
  - ไฟล์ .md จะข้ามบล็อกโค้ดที่ล้อมด้วย ``` และข้อความในเครื่องหมาย `...`
  - ข้อมูล Quiz/Flashcards ที่อยู่ในไฟล์ .js หรือ .json สคริปต์นี้ไม่แตะ ให้ตรวจแยกต่างหาก
  - รันโหมดรายงานก่อนเสมอ แล้วใช้ git diff ตรวจผลก่อน commit
"""
import re
import sys
from pathlib import Path

THAI = "\u0E00-\u0E7F"

# ไทย ตามด้วย ละติน/ตัวเลข   และ   ละติน/ตัวเลข/% ตามด้วย ไทย
THAI_THEN_LATIN = re.compile(f"([{THAI}])([A-Za-z0-9])")
LATIN_THEN_THAI = re.compile(f"([A-Za-z0-9%])([{THAI}])")

# แยกข้อความ HTML ออกเป็น [ข้อความ, tag, ข้อความ, tag, ...]  (ตำแหน่งคี่ = tag/คอมเมนต์)
TAG_SPLIT = re.compile(r"(<!--.*?-->|<[^>]+>)", re.S)
SKIP_TAGS = {"script", "style", "pre", "code", "kbd", "textarea"}


def add_spaces(text):
    """แทรกช่องว่างตรงรอยต่อไทย/ละติน คืนค่า (ข้อความใหม่, จำนวนที่แทรก)"""
    new, n1 = THAI_THEN_LATIN.subn(r"\1 \2", text)
    new, n2 = LATIN_THEN_THAI.subn(r"\1 \2", new)
    return new, n1 + n2


def samples_in(text, limit=3):
    """เก็บตัวอย่างบริบทรอบจุดที่จะแก้ ไว้แสดงในรายงาน"""
    found = []
    for pattern in (THAI_THEN_LATIN, LATIN_THEN_THAI):
        for m in pattern.finditer(text):
            found.append(text[max(0, m.start() - 10): m.end() + 10].replace("\n", " "))
            if len(found) >= limit:
                return found
    return found


def fix_html(source):
    parts = TAG_SPLIT.split(source)
    skip_depth = 0
    total = 0
    examples = []
    for i, part in enumerate(parts):
        if i % 2 == 1:                          # tag หรือคอมเมนต์: ไม่แก้ แต่ติดตามว่าอยู่ใน <pre>/<script> ไหม
            m = re.match(r"<(/?)([a-zA-Z0-9]+)", part)
            if m and m.group(2).lower() in SKIP_TAGS and not part.endswith("/>"):
                skip_depth = max(skip_depth + (-1 if m.group(1) else 1), 0)
            continue
        if skip_depth:                          # อยู่ในบล็อกที่ห้ามแตะ
            continue
        new, count = add_spaces(part)
        if count:
            if len(examples) < 3:
                examples += samples_in(part, 3 - len(examples))
            parts[i] = new
            total += count
    return "".join(parts), total, examples


def fix_markdown(source):
    total = 0
    examples = []
    out = []
    in_fence = False
    for line in source.split("\n"):
        if line.strip().startswith("```"):
            in_fence = not in_fence
            out.append(line)
            continue
        if in_fence:
            out.append(line)
            continue
        # แยกส่วนที่อยู่ใน `inline code` ออก ไม่แก้ส่วนนั้น
        pieces = re.split(r"(`[^`]*`)", line)
        for j in range(0, len(pieces), 2):
            new, count = add_spaces(pieces[j])
            if count:
                if len(examples) < 3:
                    examples += samples_in(pieces[j], 3 - len(examples))
                pieces[j] = new
                total += count
        out.append("".join(pieces))
    return "\n".join(out), total, examples


def collect_files(target):
    path = Path(target)
    if path.is_file():
        return [path]
    files = []
    for ext in ("*.html", "*.md"):
        files += [p for p in path.rglob(ext) if ".git" not in p.parts and "node_modules" not in p.parts]
    return sorted(files)


def main():
    # Windows consoles may default to cp874, which cannot print the report's symbols.
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    write = "--write" in sys.argv
    if not args:
        print(__doc__)
        sys.exit(1)

    grand_total = 0
    for file in collect_files(args[0]):
        source = file.read_text(encoding="utf-8")
        fixer = fix_markdown if file.suffix == ".md" else fix_html
        new_source, count, examples = fixer(source)
        if not count:
            continue
        grand_total += count
        print(f"{file}: {count} จุด")
        for ex in examples:
            print(f"    ...{ex}...")
        if write:
            file.write_text(new_source, encoding="utf-8")

    mode = "แก้ไฟล์แล้ว" if write else "โหมดรายงาน (ยังไม่แก้ไฟล์) เพิ่ม --write เพื่อแก้จริง"
    print(f"\nรวม {grand_total} จุด · {mode}")


if __name__ == "__main__":
    main()
