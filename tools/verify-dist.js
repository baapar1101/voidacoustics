'use strict';
/**
 * Verify dist/ is self-contained: every root-relative reference in every
 * text file must resolve to a real file on disk, and no same-site absolute
 * URLs may remain.
 */
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const OUT = path.join(__dirname, '..', 'dist');
const TEXT = new Set(['html', 'htm', 'css', 'js', 'mjs', 'json', 'svg', 'xml']);
const ASSET = new Set(['css','js','mjs','jpg','jpeg','png','gif','webp','avif','svg','ico','woff','woff2','ttf','otf','eot','mp4','webm','mp3','pdf','zip']);

async function walk(dir, base = dir, acc = []) {
  for (const e of await fsp.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, base, acc);
    else acc.push(path.relative(base, p));
  }
  return acc;
}

/** candidate root-relative refs in a text blob */
function refs(txt) {
  const out = new Set();
  const add = (s) => {
    if (!s) return;
    s = s.trim();
    if (/^(https?:)?\/\//i.test(s) || /^(data|mailto|tel|javascript|#)/i.test(s)) return;
    out.add(s);
  };
  for (const m of txt.matchAll(/(?:href|src|data-src|poster)\s*=\s*["']([^"']+)["']/gi)) add(m[1]);
  for (const m of txt.matchAll(/srcset\s*=\s*["']([^"']+)["']/gi))
    for (const p of m[1].split(',')) add(p.trim().split(/\s+/)[0]);
  for (const m of txt.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)) add(m[1]);
  return out;
}

async function main() {
  const files = await walk(OUT);
  const broken = new Map();   // ref -> [sources]
  let checked = 0;
  let leftover = [];

  for (const rel of files) {
    const ext = path.extname(rel).slice(1).toLowerCase();
    if (!TEXT.has(ext)) continue;
    const txt = await fsp.readFile(path.join(OUT, rel), 'utf8');

    for (const m of txt.matchAll(/https?:\/\/(?:www\.)?voidacoustics\.com/gi)) leftover.push(`${rel} :: ${m[0]}`);

    const dir = path.dirname(rel);
    for (const r of refs(txt)) {
      let p = r.split('#')[0].split('?')[0];
      if (!p) continue;
      const isRoot = p.startsWith('/');
      const relRef = isRoot ? decodeURIComponent(p).replace(/^\/+/, '') : decodeURIComponent(path.normalize(path.join(dir, p)));
      if (!ASSET.has(path.extname(relRef).slice(1).toLowerCase())) continue; // page links checked separately
      checked++;
      const fsPath = path.join(OUT, relRef);
      if (!fs.existsSync(fsPath) || !fs.statSync(fsPath).isFile()) {
        if (!broken.has(relRef)) broken.set(relRef, new Set());
        broken.get(relRef).add(rel);
      }
    }
  }

  // page links -> do they resolve?
  let pageRefs = 0, pageBroken = 0;
  for (const rel of files) {
    if (!rel.endsWith('.html')) continue;
    const txt = await fsp.readFile(path.join(OUT, rel), 'utf8');
    const dir = path.dirname(rel);
    for (const m of txt.matchAll(/(?:href|action)\s*=\s*["']([^"'#?]+)/gi)) {
      let p = m[1];
      if (/^(https?:)?\/\//i.test(p) || /^(mailto|tel|javascript|data):/i.test(p)) continue;
      if (!p.startsWith('/')) continue;
      p = decodeURIComponent(p.split('#')[0].split('?')[0]);
      if (/\.[a-z0-9]{2,5}$/i.test(p) && !/\/$/.test(p)) continue; // asset, already checked
      pageRefs++;
      const cand = p.endsWith('/') ? path.join(OUT, p, 'index.html') : path.join(OUT, p, 'index.html');
      const alt = p.endsWith('/') ? path.join(OUT, p) : path.join(OUT, p + '.html');
      if (!fs.existsSync(cand) && !fs.existsSync(alt)) pageBroken++;
    }
  }

  console.log('dist self-containment check');
  console.log(`  files scanned        ${files.length}`);
  console.log(`  asset refs checked   ${checked}`);
  console.log(`  BROKEN asset refs    ${broken.size}`);
  console.log(`  page links checked   ${pageRefs}`);
  console.log(`  broken page links    ${pageBroken}`);
  console.log(`  leftover same-site   ${leftover.length}`);

  if (broken.size) {
    console.log('\nBROKEN ASSETS (top 40):');
    [...broken.entries()].slice(0, 40).forEach(([r, s]) =>
      console.log(`  ${r}   [in ${[...s].slice(0, 2).join(', ')}${s.size > 2 ? ` +${s.size - 2}` : ''}]`)
    );
  }
  if (leftover.length) {
    console.log('\nLEFTOVER same-site URLs (top 20):');
    [...new Set(leftover)].slice(0, 20).forEach((l) => console.log('  ' + l));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });