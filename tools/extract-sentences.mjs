import fs from 'node:fs';

const extracted = JSON.parse(fs.readFileSync('tools/extracted-strings.json', 'utf8'));
const dict = JSON.parse(fs.readFileSync('tools/full-glossary.json', 'utf8'));

// Find all unique sentences or phrases from strings
const sentences = new Map();

for (const [k, v] of Object.entries(extracted)) {
  const trimmed = k.trim();
  if (trimmed.length < 5) continue;
  if (!dict[trimmed]) {
    sentences.set(trimmed, v.count);
  }
}

console.log('Total untranslated phrases/sentences:', sentences.size);

// Save to untranslated-sentences.json
const arr = [...sentences.entries()].sort((a, b) => b[1] * b[0].length - a[1] * a[0].length);
fs.writeFileSync('tools/untranslated-phrases.json', JSON.stringify(arr.slice(0, 1000), null, 2), 'utf8');
console.log('Saved top 1000 untranslated phrases to tools/untranslated-phrases.json');
