import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Astro/Vite rewrites `import.meta.url` when it bundles this module, so the
 * file-relative path above can point into the build cache. Resolve the project
 * root by walking up until a directory containing `mirror/` is found -- starting
 * from both this module's URL and the process cwd.
 */
function findRoot() {
  const starts = [path.dirname(fileURLToPath(import.meta.url)), process.cwd()];
  for (const start of starts) {
    let dir = path.resolve(start);
    for (;;) {
      if (fs.existsSync(path.join(dir, 'mirror'))) return dir;
      const up = path.dirname(dir);
      if (up === dir) break;
      dir = up;
    }
  }
  return path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
}

export const ROOT = findRoot();
export const MIRROR = path.join(ROOT, 'mirror');

/**
 * Recursively list every mirrored HTML document.
 * Returns [{ slug, file }] where slug is the route path without extension,
 * e.g. mirror/products/venu/index.html -> 'products/venu'.
 */
export function listPages() {
  const out = [];
  const walk = (dir) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.toLowerCase().endsWith('.html')) out.push(p);
    }
  };
  walk(MIRROR);

  return out
    .map((file) => {
      const rel = path.relative(MIRROR, file).replace(/\\/g, '/');
      const slug = rel.replace(/(^|\/)index\.html$/i, '$1').replace(/\.html$/i, '');
      return { slug, file };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Route slug ('/' for homepage) -> mirrored source file. */
export function fileForSlug(slug) {
  const clean = slug.replace(/^\/+/, '').replace(/\/$/, '');
  const candidates = clean
    ? [
        path.join(MIRROR, clean, 'index.html'),
        path.join(MIRROR, `${clean}.html`),
      ]
    : [path.join(MIRROR, 'index.html')];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

export function readPage(slug) {
  const file = fileForSlug(slug);
  return file ? fs.readFileSync(file, 'utf8') : null;
}