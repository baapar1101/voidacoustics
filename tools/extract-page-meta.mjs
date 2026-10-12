import fs from 'node:fs';
import path from 'node:path';

const EN_DIR = 'mirror/en';

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, acc);
    else if (ent.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const files = walk(EN_DIR);
const pages = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(EN_DIR, file).replace(/\\/g, '/');
  const slug = rel.replace(/(^|\/)index\.html$/i, '$1').replace(/\.html$/i, '');
  const title = content.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const desc = content.match(/<meta name="description" content="([^"]*)"/i)?.[1];
  pages.push({ slug: slug || '/', rel, title, desc });
}

fs.writeFileSync('tools/all-pages-meta.json', JSON.stringify(pages, null, 2), 'utf8');
console.log(`Extracted metadata for ${pages.length} pages.`);
