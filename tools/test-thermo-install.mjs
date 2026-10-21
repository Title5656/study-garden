import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

// Exercise the real installer with both Unix and Windows checkout line endings.
for (const newline of ['\n', '\r\n']) {
  const root = mkdtempSync(join(tmpdir(), 'study-garden-thermo-'));
  try {
    mkdirSync(join(root, 'tools'));
    mkdirSync(join(root, 'assets'));
    writeFileSync(join(root, 'tools/install-thermo.mjs'), readFileSync(new URL('./install-thermo.mjs', import.meta.url)));
    writeFileSync(join(root, 'assets/thermo-content.js'), 'window.StudyContent = {};'+newline);
    const fixtures = {
      'index.html': '<script defer src="assets/app.js"></script>\nวิชาทั้งหมด <span>3</span>\n3 วิชา · 25 บทเรียน\n / 25 บท\nITDS241, ITDS294 และ ITDS261 เลือกวิชา\n<article>existing course</article>\n        </div>\n        <p id="search-empty">empty</p>\n',
      'tools/check-curriculum.mjs': "const assets = ['content', 'ecommerce-content', 'software-content'];\nassert.equal(total(), 25);\nconsole.log('3 courses, 25 chapters, 250 questions');\n",
      'tools/test-learning.mjs': "assert.equal(await page.locator('.subject-folder').count(),3);\n",
      'README.md': '# Study Garden\nExisting documentation\n'
    };
    for (const [name, text] of Object.entries(fixtures)) writeFileSync(join(root, name), text.replace(/\n/g, newline));
    const install = () => spawnSync(process.execPath, [join(root, 'tools/install-thermo.mjs')], { encoding: 'utf8' });
    const first = install();
    assert.equal(first.status, 0, `${JSON.stringify(newline)} checkout: ${first.stderr}`);
    const home = readFileSync(join(root, 'index.html'), 'utf8');
    assert.match(home, /วิชาทั้งหมด <span>4<\/span>/);
    assert.match(home, /4 วิชา · 34 บทเรียน/);
    assert.equal((home.match(/class="subject-folder"/g) || []).length, 1);
    assert.match(home, /assets\/thermo-content\.js\?v=54999cba4629/);
    assert.ok(home.includes('existing course'));
    assert.match(readFileSync(join(root, 'tools/check-curriculum.mjs'), 'utf8'), /4 courses, 34 chapters, 340 questions/);
    assert.match(readFileSync(join(root, 'tools/test-learning.mjs'), 'utf8'), /count\(\),4/);
    const after = Object.fromEntries(Object.keys(fixtures).map(name => [name, readFileSync(join(root, name), 'utf8')]));
    for (const [name, text] of Object.entries(after)) {
      if (newline === '\r\n') assert.ok(!/(?<!\r)\n/.test(text), `${name}: preserve Windows line endings`);
    }
    const second = install();
    assert.equal(second.status, 0, second.stderr);
    for (const [name, text] of Object.entries(after)) assert.equal(readFileSync(join(root, name), 'utf8'), text, `${name}: repeat must be a no-op`);
    console.log(`PASS: installer integrates and reruns safely with ${newline === '\n' ? 'LF' : 'CRLF'} line endings.`);
  } finally {
    assert.ok(resolve(root).startsWith(resolve(tmpdir()) + sep + 'study-garden-thermo-'));
    rmSync(root, { recursive: true, force: true });
  }
}
