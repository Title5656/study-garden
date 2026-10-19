// Run before publishing: node tools/version-assets.mjs
// Each changed asset gets a new URL, including CSS images and local fonts.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
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
  // Git stores these text assets as LF even when a Windows checkout uses CRLF.
  const content = ['.css', '.js', '.svg'].includes(extname(path))
    ? bytes.toString('utf8').replace(/\r\n/g, '\n') : bytes;
  return createHash('sha256').update(content).digest('hex').slice(0, 12);
}
function version(reference, file) {
  if (/^(?:[a-z]+:|\/\/|#)/i.test(reference)) return reference;
  const [resource, fragment] = reference.split('#');
  const [path, query = ''] = resource.split('?');
  if (!/\.(?:css|js|svg|png|ttf)$/.test(path)) return reference;
  const params = new URLSearchParams(query);
  params.set('v', hash(resolve(dirname(file), path)));
  return `${path}?${params}${fragment === undefined ? '' : '#' + fragment}`;
}
const paths = files(root);
let changed = 0;
// Version CSS dependencies first, then fingerprint the resulting CSS in HTML.
for (const extension of ['.css', '.html']) {
  for (const file of paths.filter(path => path.endsWith(extension))) {
    const before = readFileSync(file, 'utf8');
    const after = extension === '.html'
      ? before.replace(/((?:src|href)=")([^"]+)(")/g,
          (_, start, reference, end) => start + version(reference, file) + end)
      : before.replace(/(url\(['"]?)([^)'"\s]+)(['"]?\))/g,
          (_, start, reference, end) => start + version(reference, file) + end);
    if (after !== before) {
      writeFileSync(file, after);
      changed++;
    }
  }
}
console.log(`Versioned assets: ${changed} files updated.`);
