import fs from 'node:fs';

const extracted = JSON.parse(fs.readFileSync('tools/extracted-strings.json', 'utf8'));
const common = {};

for (const [k, v] of Object.entries(extracted)) {
  if (v.count >= 10 || k.length < 40) {
    common[k] = v.count;
  }
}

fs.writeFileSync('tools/common-candidates.json', JSON.stringify(common, null, 2), 'utf8');
console.log('Saved common candidates:', Object.keys(common).length);
