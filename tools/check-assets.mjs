import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.name === '.git') return [];
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}
function hash(path) {
  const bytes = readFileSync(path);
  const content = ['.css', '.js', '.svg'].includes(extname(path))
    ? bytes.toString('utf8').replace(/\r\n/g, '\n') : bytes;
  return createHash('sha256').update(content).digest('hex').slice(0, 12);
}
let checked = 0;
for (const file of files(root).filter(path => /\.(html|css)$/.test(path))) {
  const text = readFileSync(file, 'utf8');
  const references = file.endsWith('.html')
    ? [...text.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1])
    : [...text.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map(match => match[1]);
  for (const reference of references) {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(reference)) continue;
    const [path, query = ''] = reference.split('?');
    if (!/\.(?:css|js|svg|png|ttf)$/.test(path)) continue;
    const target = resolve(dirname(file), path);
    assert.equal(new URLSearchParams(query).get('v'), hash(target),
      `${file}: ${reference} must use its current content hash to avoid stale browser assets`);
    checked++;
  }
}
console.log(`PASS: ${checked} asset references use their current content hash.`);
