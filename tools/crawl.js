'use strict';
/**
 * Dependency-free static mirror crawler.
 *
 * Crawls voidacoustics.com from a set of seeds and writes a pristine mirror to
 * ./mirror :
 *   /about/                 ->  mirror/about/index.html
 *   /wp-content/x/y.jpg     ->  mirror/wp-content/x/y.jpg
 *
 * HTML is stored exactly as served (no URL rewriting here) so the build step
 * can do a single deterministic transform.
 */

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const ORIGIN = 'https://voidacoustics.com';
const HOSTS = new Set(['voidacoustics.com', 'www.voidacoustics.com']);
const MIRROR = path.join(__dirname, '..', 'mirror');
const CONCURRENCY = 8;
const MAX_PAGES = Number(process.env.MAX_PAGES) || 400;
const TIMEOUT_MS = 45000;
const LARGE_TIMEOUT_MS = 300000; // zips / PDFs can be >10MB on a slow link

const ASSET_EXT = new Set([
  'css', 'js', 'mjs', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg', 'ico',
  'woff', 'woff2', 'ttf', 'otf', 'eot', 'mp4', 'webm', 'mp3', 'wav', 'pdf', 'zip',
]);

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// ---------------------------------------------------------------- url helpers

/** Normalise to an absolute URL on the target origin, or null if not ours. */
function toUrl(raw, base) {
  if (!raw) return null;
  let s = String(raw).trim();
  if (!s) return null;
  if (/^(data:|mailto:|tel:|javascript:|#|blob:|about:)/i.test(s)) return null;

  let u;
  try {
    u = new URL(s, base);
  } catch {
    return null;
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
  if (!HOSTS.has(u.hostname)) return null;

  u.hash = '';
  // keep query off the local filename, but remember it
  const search = u.search;
  u.search = '';
  if (u.pathname.includes('{') || u.pathname.includes('}')) return null;

  return { url: u.toString(), path: u.pathname, query: search };
}

/** Local file path for a URL pathname. */
function mirrorPath(pathname) {
  let p = decodeURIComponent(pathname);
  if (p.endsWith('/')) p += 'index.html';
  else if (!path.extname(p)) p += '/index.html';
  return path.join(MIRROR, p.replace(/^\/+/, '').replace(/\.\./g, ''));
}

function kindOf(pathname) {
  const ext = path.extname(pathname).slice(1).toLowerCase();
  if (ASSET_EXT.has(ext)) return 'asset';
  if (ext === 'html') return 'page';
  if (pathname.endsWith('/') || ext === '') return 'page';
  return null; // unknown -> ignore
}

const SKIP_PREFIX = ['/wp-admin', '/wp-login', '/wp-json', '/wp-cron', '/feed', '/author/'];
const SKIP_EXACT = new Set(['/xmlrpc.php', '/robots.txt', '/sitemap.xml']);

function isSkipped(pathname) {
  if (SKIP_EXACT.has(pathname)) return true;
  if (pathname.includes('admin-ajax')) return true;
  return SKIP_PREFIX.some((p) => pathname.startsWith(p));
}

// ------------------------------------------------------------ link extraction

function extractLinks(html, pageUrl) {
  const out = new Set();
  const push = (raw) => {
    const n = toUrl(raw, pageUrl);
    if (n) out.add(n.url);
  };

  // href / src on any tag
  for (const m of html.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)) push(m[1]);

  // srcset / imagesrcset
  for (const m of html.matchAll(/srcset\s*=\s*["']([^"']+)["']/gi)) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url) push(url);
    }
  }

  // <style> blocks and inline <script> url(...) references
  for (const m of html.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)) push(m[1]);

  // plain absolute URLs inside JS payloads (REST roots, etc.)
  for (const m of html.matchAll(/https?:\/\/voidacoustics\.com\/[^\s"'`)\\]+/g)) push(m[0]);

  return out;
}

// ------------------------------------------------------------------- fetching

async function fetchWithRetry(url, attempts = 3) {
  const isBig = /\.(zip|pdf|mp4|mp3|psd|ai|sketch)(\?|$)/i.test(url);
  const timeout = isBig ? LARGE_TIMEOUT_MS : TIMEOUT_MS;
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeout);
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, Accept: '*/*', 'Accept-Language': 'en-US,en;q=0.9' },
        redirect: 'follow',
        signal: ctl.signal,
      });
      if (res.status === 404 || res.status === 410) return { notFound: true };
      if (res.status >= 500 || res.status === 429) throw new Error(`HTTP ${res.status}`);
      if (!res.ok) return { notFound: true, status: res.status };
      const buf = Buffer.from(await res.arrayBuffer());
      return { buf, type: res.headers.get('content-type') || '' };
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}

// ------------------------------------------------------------------------ run

async function main() {
  // Seeds may be passed as args, or via @file / --seeds=file (Windows has a
  // ~32k command-line limit, which a few hundred URLs will blow through).
  let raw = [];
  for (const a of process.argv.slice(2)) {
    if (a.startsWith('@') || a.startsWith('--seeds=')) {
      const f = a.replace(/^@/, '').replace(/^--seeds=/, '');
      raw.push(...(await fsp.readFile(f, 'utf8')).split(/\r?\n/));
    } else {
      raw.push(a);
    }
  }
  const seeds = raw.map((s) => s.trim()).filter(Boolean);

  if (!seeds.length) {
    console.error('usage: node tools/crawl.js <url> [url...] | node tools/crawl.js @seeds.txt');
    process.exit(1);
  }

  await fsp.mkdir(MIRROR, { recursive: true });

  const pageQueue = [];
  const assetQueue = [];
  const seen = new Set();
  for (const s of seeds) {
    const n = toUrl(s, ORIGIN + '/');
    if (n) pageQueue.push(n.url);
  }

  /** enqueue a discovered URL into the correct queue */
  const enqueue = (url) => {
    if (seen.has(url)) return;
    const { pathname } = new URL(url);
    if (isSkipped(pathname)) return;
    const kind = kindOf(pathname);
    if (!kind) return;
    (kind === 'page' ? pageQueue : assetQueue).push(url);
  };

  const stats = { pages: 0, assets: 0, bytes: 0, notFound: 0, failed: 0 };
  const failures = [];
  const notFounds = new Set();
  let active = 0;

  async function worker() {
    // Drain assets fully. Only stop *page* fetching at MAX_PAGES, and keep
    // going until both queues are empty so no referenced asset is left behind.
    for (;;) {
      let url, kind;
      if (assetQueue.length) {
        url = assetQueue.shift();
        kind = 'asset';
      } else if (pageQueue.length && stats.pages < MAX_PAGES) {
        url = pageQueue.shift();
        kind = 'page';
      } else {
        return; // nothing left to do
      }
      if (!url || seen.has(url)) continue;
      seen.add(url);

      const { pathname } = new URL(url);
      if (isSkipped(pathname)) continue;
      if (kindOf(pathname) !== kind) kind = kindOf(pathname);
      if (!kind) continue;

      active++;
      try {
        const r = await fetchWithRetry(url);
        if (r.notFound) {
          stats.notFound++;
          notFounds.add(pathname);
          continue;
        }
        const dest = mirrorPath(pathname);
        await fsp.mkdir(path.dirname(dest), { recursive: true });
        await fsp.writeFile(dest, r.buf);
        stats.bytes += r.buf.length;

        const text = r.buf.toString('utf8');
        if (kind === 'page') {
          stats.pages++;
          for (const link of extractLinks(text, url)) enqueue(link);
          if (stats.pages % 25 === 0) {
            process.stdout.write(
              `\r  pages=${stats.pages} assets=${stats.assets} pending=${pageQueue.length + assetQueue.length}   `
            );
          }
        } else {
          stats.assets++;
          if (/\.css($|\?)/.test(pathname)) {
            for (const link of extractLinks(text, url)) enqueue(link);
          }
        }
      } catch (e) {
        stats.failed++;
        failures.push(`${url} :: ${e.message}`);
      } finally {
        active--;
      }
    }
  }

  console.log(`crawling ${ORIGIN} -> ${MIRROR}`);
  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  console.log('\n' + '-'.repeat(52));
  console.log(`  pages        ${stats.pages}`);
  console.log(`  assets       ${stats.assets}`);
  console.log(`  total size   ${(stats.bytes / 1048576).toFixed(1)} MB`);
  console.log(`  not found    ${stats.notFound}`);
  console.log(`  failed       ${stats.failed}`);
  console.log('-'.repeat(52));

  if (notFounds.size) {
    console.log('\nNOT FOUND (skipped):');
    [...notFounds].sort().forEach((p) => console.log('  ' + p));
  }
  if (failures.length) {
    console.log('\nFAILED:');
    failures.forEach((f) => console.log('  ' + f));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});