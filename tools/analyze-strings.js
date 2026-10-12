const fs = require('fs');

const data = JSON.parse(fs.readFileSync('tools/extracted-strings.json', 'utf8'));
const entries = Object.entries(data);

console.log('Total entries:', entries.length);

// Sort by count descending (most common strings across the 173 pages)
entries.sort((a, b) => b[1].count - a[1].count);

console.log('\n=== TOP 40 MOST FREQUENT STRINGS ===');
entries.slice(0, 40).forEach(([k, v]) => {
  console.log(`[x${v.count}] ${k.slice(0, 80)}`);
});

// Group by length
const short = entries.filter(([k]) => k.length <= 25);
const medium = entries.filter(([k]) => k.length > 25 && k.length <= 100);
const long = entries.filter(([k]) => k.length > 100);

console.log(`\nLength distribution:`);
console.log(`  Short (<=25 chars): ${short.length}`);
console.log(`  Medium (26-100 chars): ${medium.length}`);
console.log(`  Long (>100 chars): ${long.length}`);
