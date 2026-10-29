// Remove legacy public source notes from generated course pages.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const root = new URL('../', import.meta.url);
let count = 0;
for (const name of readdirSync(new URL('subjects/itds261/', root))) {
  if (!/^chapter-\d+\.html$/.test(name)) continue;
  const path = new URL(`subjects/itds261/${name}`, root);
  const before = readFileSync(path, 'utf8');
  const after = before.replace(/<!-- itds261-source-note:start -->[\s\S]*?<!-- itds261-source-note:end -->/, '');
  if (after !== before) { writeFileSync(path, after); count++; }
}
console.log(`Removed shared source notes from ${count} chapters.`);
