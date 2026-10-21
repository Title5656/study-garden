// Static include: keeps the shared note available without JavaScript or a build server.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const note = readFileSync(new URL('assets/itds261-source-note.html', root), 'utf8').trim();
const include = `<!-- itds261-source-note:start -->\n${note}\n<!-- itds261-source-note:end -->`;
let count = 0;
for (const name of readdirSync(new URL('subjects/itds261/', root))) {
  if (!/^chapter-\d+\.html$/.test(name)) continue;
  const path = new URL(`subjects/itds261/${name}`, root);
  const before = readFileSync(path, 'utf8');
  const after = before.includes('<!-- itds261-source-note:start -->')
    ? before.replace(/<!-- itds261-source-note:start -->[\s\S]*?<!-- itds261-source-note:end -->/, include)
    : before.replace(/<p>เลขหน้าอ้างอิงคือ[\s\S]*?<\/p><p>เลขบทเว็บไซต์[\s\S]*?<\/p>/, () => include);
  if (after !== before) { writeFileSync(path, after); count++; }
}
console.log(`Shared source notes: ${count} chapters updated.`);
