const fs = require('fs');

const f = fs.readFileSync('mirror/en/index.html', 'utf8');

// 1. Aside (language switcher)
const asideMatch = f.match(/<aside[\s\S]*?<\/aside>/i);
console.log('=== WEGLOT ASIDE SWITCHER ===');
if (asideMatch) {
  console.log(asideMatch[0]);
} else {
  console.log('None found');
}

// 2. Header and Logo
const headerMatch = f.match(/<header[\s\S]*?<\/header>/i);
console.log('\n=== HEADER (first 1000 chars) ===');
if (headerMatch) {
  console.log(headerMatch[0].slice(0, 1000));
}

// 3. Search for logo occurrences
console.log('\n=== LOGO OCCURRENCES ===');
for (const m of f.matchAll(/<img[^>]*logo[^>]*>/gi)) {
  console.log(m[0]);
}
for (const m of f.matchAll(/<a[^>]*class="[^"]*logo[^"]*"[^>]*>[\s\S]*?<\/a>/gi)) {
  console.log(m[0]);
}

// 4. Favicon occurrences
console.log('\n=== FAVICON OCCURRENCES ===');
for (const m of f.matchAll(/<link[^>]*rel="[^"]*icon"[^>]*>/gi)) {
  console.log(m[0]);
}
for (const m of f.matchAll(/<meta[^>]*TileImage[^>]*>/gi)) {
  console.log(m[0]);
}
