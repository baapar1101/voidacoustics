const fs = require('fs');
const path = require('path');
const parse5 = require('parse5');

const EN_DIR = path.join(__dirname, '..', 'mirror', 'en');

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, acc);
    else if (ent.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const files = walk(EN_DIR);
console.log(`Found ${files.length} HTML files in mirror/en`);

const strings = new Map(); // text -> { count, occurrences: [{ file, type, attr }] }

function addString(str, file, type, attr = null) {
  if (!str) return;
  const trimmed = str.trim();
  if (!trimmed || trimmed.length < 2) return;
  // Ignore pure numbers, symbols, dates, single hex codes
  if (/^[\d\s.,:;/#%*+=\-_()@!?[\]{}<>$&|\\^~]+$/.test(trimmed)) return;
  if (/^#[0-9a-f]{3,8}$/i.test(trimmed)) return;
  if (/^rgba?\(.*\)$/i.test(trimmed)) return;
  // Ignore URLs or script snippets
  if (/^(https?:\/\/|\/wp-|data:)/.test(trimmed)) return;
  if (trimmed.includes('function(') || trimmed.includes('var ') || trimmed.includes('const ') || trimmed.includes('{')) return;

  const rel = path.relative(EN_DIR, file).replace(/\\/g, '/');
  if (!strings.has(trimmed)) {
    strings.set(trimmed, { count: 0, occurrences: [] });
  }
  const entry = strings.get(trimmed);
  entry.count++;
  if (entry.occurrences.length < 3) {
    entry.occurrences.push({ file: rel, type, attr });
  }
}

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const doc = parse5.parse(content, { sourceCodeLocationInfo: true });

  function traverse(node) {
    if (node.nodeName === '#text') {
      const parentName = node.parentNode?.nodeName;
      if (parentName !== 'script' && parentName !== 'style' && parentName !== 'noscript') {
        addString(node.value, file, 'text');
      }
    } else if (node.attrs) {
      for (const a of node.attrs) {
        if (['alt', 'title', 'aria-label', 'placeholder'].includes(a.name)) {
          addString(a.value, file, 'attr', a.name);
        }
      }
      // Check meta description & og tags
      if (node.nodeName === 'meta') {
        const nameAttr = node.attrs.find((a) => a.name === 'name')?.value;
        const propAttr = node.attrs.find((a) => a.name === 'property')?.value;
        const contentAttr = node.attrs.find((a) => a.name === 'content')?.value;
        if (contentAttr) {
          if (nameAttr === 'description' || propAttr === 'og:title' || propAttr === 'og:description' || propAttr === 'og:site_name') {
            addString(contentAttr, file, 'meta', nameAttr || propAttr);
          }
        }
      }
    }
    if (node.childNodes) {
      for (const child of node.childNodes) traverse(child);
    }
  }

  traverse(doc);
}

console.log(`Extracted ${strings.size} unique strings.`);

// Character count summary
let totalChars = 0;
let uniqChars = 0;
for (const [s, data] of strings.entries()) {
  uniqChars += s.length;
  totalChars += s.length * data.count;
}
console.log(`Unique string chars: ${uniqChars.toLocaleString()}`);
console.log(`Total occurrences chars: ${totalChars.toLocaleString()}`);

// Save to tools/extracted-strings.json
const output = {};
for (const [k, v] of strings.entries()) {
  output[k] = { count: v.count, sample: v.occurrences[0] };
}
fs.writeFileSync(path.join(__dirname, 'extracted-strings.json'), JSON.stringify(output, null, 2), 'utf8');
console.log(`Saved extracted strings to tools/extracted-strings.json`);
