'use strict';
/** Analyse broken *page* links in dist/ to see what they target. */
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const OUT = path.join(__dirname, '..', 'dist');

async function walk(dir, base = dir, acc = []) {
  for (const e of await fsp.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, base, acc);
    else acc.push(path.relative(base, p));
  }
  return acc;
}

(async () => {
  const files = await walk(OUT);
  const broken = new Map();
  let total = 0;

  for (const rel of files) {
    if (!rel.endsWith('.html')) continue;
    const txt = await fsp.readFile(path.join(OUT, rel), 'utf8');
    for (const m of txt.matchAll(/(?:href|action)\s*=\s*["']([^"'#?]+)/gi)) {
      let p = m[1];
      if (/^(https?:)?\/\//i.test(p) || /^(mailto|tel|javascript|data):/i.test(p)) continue;
      if (!p.startsWith('/')) continue;
      p = decodeURIComponent(p.split('#')[0]);
      if (/\.[a-z0-9]{2,5}$/i.test(p)) continue; // asset
      total++;
      const c1 = path.join(OUT, p, 'index.html');
      const c2 = path.join(OUT, p + '.html');
      if (!fs.existsSync(c1) && !fs.existsSync(c2)) {
        const key = p.replace(/\/$/, '/');
        if (!broken.has(key)) broken.set(key, new Set());
        broken.get(key).add(rel);
      }
    }
  }

  const byLocale = new Map();
  let nonLocale = 0;
  for (const [p] of broken) {
    const m = p.match(/^\/(de|es|fr|it|ja|ko|zh|hi|nl|pt|pl|tr|ru|ar)\//i);
    if (m) byLocale.set(m[1].toLowerCase(), (byLocale.get(m[1].toLowerCase()) || 0) + 1);
    else nonLocale++;
  }

  console.log(`page links total      ${total}`);
  console.log(`distinct broken paths ${broken.size}`);
  console.log(`\nbroken, grouped by locale prefix:`);
  [...byLocale.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  /${k}/  ${v}`));
  console.log(`  (no locale prefix)  ${nonLocale}`);

  console.log(`\ntop 25 non-locale broken targets:`);
  [...broken.entries()].filter(([p]) => !/^\/(de|es|fr|it|ja|ko|zh|hi|nl|pt|pl|tr|ru|ar)\//i.test(p))
    .slice(0, 25).forEach(([p, s]) => console.log(`  ${p}   [${s.size} pages]`));
})();