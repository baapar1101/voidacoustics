import fs from 'node:fs';

const extracted = JSON.parse(fs.readFileSync('tools/extracted-strings.json', 'utf8'));
const currentGlossary = JSON.parse(fs.readFileSync('tools/full-glossary.json', 'utf8'));

const unhandled = [];
for (const [text, data] of Object.entries(extracted)) {
  const t = text.trim();
  if (!currentGlossary[t] && t.length > 2) {
    unhandled.push({ text: t, count: data.count, len: t.length });
  }
}

unhandled.sort((a, b) => b.count - a.count);
console.log('Unhandled strings count:', unhandled.length);
console.log('\nTop 50 unhandled strings by frequency:');
unhandled.slice(0, 50).forEach((u) => console.log(`[x${u.count}] ${u.text.slice(0, 80)}`));
