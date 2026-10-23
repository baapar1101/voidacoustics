'use strict';
/**
 * Static build: mirror/ -> dist/
 *
 * Target: domain root on nginx/Apache, so all URLs become root-relative
 * (/wp-content/..., /products/...) which the browser resolves against the host.
 *
 * Rewrites performed:
 *   https://voidacoustics.com/<path>  ->  /<path>      (assets + internal pages)
 *   protocol-relative //host/<path>   ->  /<path>
 *   external hosts (facebook, fonts, cdn.boxicons...) left untouched
 *
 * Also emits dist/.htaccess and dist/nginx.conf snippets.
 */

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const SRC = path.join(__dirname, '..', 'mirror');
const OUT = path.join(__dirname, '..', 'dist');
const HOSTS = new Set(['voidacoustics.com', 'www.voidacoustics.com']);

const TEXT_EXT = new Set(['html', 'htm', 'css', 'js', 'mjs', 'json', 'svg', 'xml', 'txt']);

const FA_BUSINESS_ADDRESS = 'استان اصفهان، شهرستان اصفهان<br>بخش مرکزی، شهر اصفهان<br>خلجا، خیابان شیخ بهایی<br>بن بست مینا ۲۹، پلاک ۴۷۵<br>ساختمان ایزدی';
const EN_BUSINESS_ADDRESS = 'Izadi Building, No. 475<br>Mina 29 Dead End, Sheikh Bahaei Street<br>Khalaja, Isfahan City, Central District<br>Isfahan County, Isfahan Province<br>Iran';
const BUSINESS_PHONE = '+989901046596';

function shouldProcess(file) {
  const ext = path.extname(file).slice(1).toLowerCase();
  return TEXT_EXT.has(ext);
}

function normalizeBusinessContact(html) {
  const isPersian = /<html\b[^>]*\blang=["']fa/i.test(html);
  const localizedAddress = isPersian ? FA_BUSINESS_ADDRESS : EN_BUSINESS_ADDRESS;
  const localizedInlineAddress = localizedAddress.replaceAll('<br>', isPersian ? '، ' : ', ');
  return html
    .replace(/Unit L, The Fulcrum, Vantage Way, Poole, Dorset, BH12 4NU, United Kingdom/gi, localizedInlineAddress)
    .replace(/Unit L, The Fulcrum\s*<br\s*\/?>\s*Vantage Way\s*<br\s*\/?>\s*Poole, Dorset\s*<br\s*\/?>\s*BH12 4NU\s*<br\s*\/?>\s*United Kingdom/gi, localizedAddress)
    .replace(/واحد L، ساختمان Fulcrum\s*<br\s*\/?>\s*خیابان ونتج\s*<br\s*\/?>\s*پول، دورست\s*<br\s*\/?>\s*BH12 4NU\s*<br\s*\/?>\s*انگلستان/g, FA_BUSINESS_ADDRESS)
    .replace(/<li><strong>Europe:<\/strong>\s*<a href="tel:4401202666006">\+44 \(0\) 1202 666006<\/a><\/li>/gi, `<li><strong>Phone:</strong> <a dir="ltr" href="tel:${BUSINESS_PHONE}">${BUSINESS_PHONE}</a></li>`)
    .replace(/<li><strong>America:<\/strong>\s*<a href="tel:16306866616">\+1 \(630\) 6866616<\/a><\/li>/gi, '')
    .replace(/<li><strong>اروپا:<\/strong>\s*<a href="tel:4401202666006">\+44 \(0\) 1202 666006<\/a><\/li>/g, `<li><strong>تماس:</strong> <a dir="ltr" href="tel:${BUSINESS_PHONE}">${BUSINESS_PHONE}</a></li>`)
    .replace(/<li><strong>آمریکا:<\/strong>\s*<a href="tel:16306866616">\+1 \(630\) 6866616<\/a><\/li>/g, '')
    .replace(/<div>\s*(?:Registered WEEE Producer: WEE\/EK4517VW|تولیدکننده ثبت‌شده تجهیزات الکترونیکی: WEE\/EK4517VW)\s*<\/div>/gi, '');
}

/** Rewrite every same-site absolute URL to root-relative. */
function rewrite(html) {
  // https://voidacoustics.com/foo  and  http://www.voidacoustics.com/foo
  let out = normalizeBusinessContact(html).replace(
    /https?:\/\/(?:www\.)?voidacoustics\.com(\/[^\s"'`)\\]*)?/g,
    (m, p) => (p && p.length > 1 ? p : '/')
  );
  // protocol-relative  //voidacoustics.com/foo
  out = out.replace(/(^|["'(=\s])\/\/(?:www\.)?voidacoustics\.com(\/[^\s"'`)\\]*)?/g,
    (m, pre, p) => `${pre}${p && p.length > 1 ? p : '/'}`);
  // drop cache-busting query strings on local asset refs
  // Strip the WP cache-busting param. Value may be dotted (ver=6.1.7) or hex
  // (ver=2c532d7e2be36f6af233), so match up to the next delimiter -- NOT [0-9a-f]+,
  // which truncates at the first '.' and corrupts the filename.
  out = out.replace(/(\/wp-(?:content|includes)\/[^\s"'`)]*?)\?ver=[^&\s"'`)]*/gi, '$1');
  // Keep custom UI assets cache-safe without rewriting every mirrored page
  // whenever the shared controls change.
  out = out
    .replace(/(\/void-mobile\.css)(?:\?v=[^\s"'`)]*)?/gi, '$1?v=20261023-1')
    .replace(/(\/void-mobile\.js)(?:\?v=[^\s"'`)]*)?/gi, '$1?v=20261023-1');
  return out;
}

async function walk(dir, base = dir, acc = []) {
  for (const e of await fsp.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, base, acc);
    else acc.push(path.relative(base, p));
  }
  return acc;
}

const HTACCESS = `# Static mirror of voidacoustics.com -- Apache
DirectoryIndex index.html index.php

<IfModule mod_rewrite.c>
  RewriteEngine On

  # pretty URLs: /about/ -> /about/index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME}/index.html -f
  RewriteRule ^(.*)$ /$1/index.html [L]

  # extensionless pages
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)$ /$1.html [L]
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript image/svg+xml application/json
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css                "access plus 1 year"
  ExpiresByType application/javascript  "access plus 1 year"
  ExpiresByType image/jpeg              "access plus 1 year"
  ExpiresByType image/png               "access plus 1 year"
  ExpiresByType image/webp              "access plus 1 year"
  ExpiresByType image/svg+xml           "access plus 1 year"
  ExpiresByType font/woff2              "access plus 1 year"
  ExpiresByType video/mp4               "access plus 1 month"
</IfModule>

<IfModule mod_mime.c>
  AddType font/woff2 .woff2
  AddType image/svg+xml .svg
</IfModule>
`;

const NGINX_CONF = `# Static mirror of voidacoustics.com -- nginx server block
server {
    listen 80;
    server_name example.com www.example.com;
    root /var/www/voidacoustics;
    index index.html;

    # pretty URLs: /about/ -> /about/index.html
    location / {
        try_files $uri $uri/ $uri/index.html =404;
    }

    # extensionless pages: /about -> /about.html
    location ~ ^/(.*[^/])$ {
        try_files $uri $uri.html $uri/index.html =404;
    }

    location ~* \.(css|js|jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|eot|mp4|webm)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    gzip on;
    gzip_types text/css application/javascript image/svg+xml application/json text/html;
    gzip_min_length 1024;
}
`;

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`missing ${SRC} -- run: node tools/crawl.js <urls>`);
    process.exit(1);
  }

  await fsp.rm(OUT, { recursive: true, force: true });
  await fsp.mkdir(OUT, { recursive: true });

  const files = await walk(SRC);
  let processed = 0;
  let rewritten = 0;

  for (const rel of files) {
    const from = path.join(SRC, rel);
    const to = path.join(OUT, rel);
    await fsp.mkdir(path.dirname(to), { recursive: true });

    if (shouldProcess(rel)) {
      const txt = await fsp.readFile(from, 'utf8');
      const out = rewrite(txt);
      if (out !== txt) rewritten++;
      await fsp.writeFile(to, out, 'utf8');
    } else {
      await fsp.copyFile(from, to);
    }
    processed++;
  }

  await fsp.writeFile(path.join(OUT, '.htaccess'), HTACCESS);
  await fsp.writeFile(path.join(__dirname, '..', 'nginx.conf'), NGINX_CONF);
  await fsp.writeFile(
    path.join(__dirname, '..', 'server-config.example.json'),
    JSON.stringify(
      {
        name: 'voidacoustics-static',
        root: '/var/www/voidacoustics',
        cleanUrls: true,
        trailingSlash: true,
        headers: [{ source: '**/*.[cssjsjpgjpegpngwebpsvgwoff2mp4]', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }],
      },
      null,
      2
    )
  );

  const pages = files.filter((f) => f.endsWith('.html')).length;
  let bytes = 0;
  for (const rel of files) bytes += (await fsp.stat(path.join(OUT, rel))).size;

  console.log('build complete');
  console.log(`  output      ${OUT}`);
  console.log(`  files       ${processed} (${pages} html)`);
  console.log(`  rewritten   ${rewritten}`);
  console.log(`  size        ${(bytes / 1048576).toFixed(1)} MB`);
  console.log('\n  also wrote: dist/.htaccess, nginx.conf, server-config.example.json');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
