import fs from 'node:fs';

const extracted = JSON.parse(fs.readFileSync('tools/extracted-strings.json', 'utf8'));
const entries = Object.entries(extracted);

// Breakdown by categories
console.log('Total extracted:', entries.length);

// Nav & common UI (count >= 10)
const commonUI = entries.filter(([text, data]) => data.count >= 10);
console.log('Common UI strings (count >= 10):', commonUI.length);

// Page titles & metadata
const metaStrings = entries.filter(([text, data]) => data.sample.type === 'meta');
console.log('Meta strings:', metaStrings.length);

// Alt attributes
const altStrings = entries.filter(([text, data]) => data.sample.type === 'attr' && data.sample.attr === 'alt');
console.log('Alt strings:', altStrings.length);

// Aria labels
const ariaStrings = entries.filter(([text, data]) => data.sample.type === 'attr' && data.sample.attr === 'aria-label');
console.log('Aria strings:', ariaStrings.length);

// Titles (<title>)
const titleStrings = entries.filter(([text, data]) => data.sample.type === 'text' && data.sample.file.endsWith('index.html') && /Void Acoustics/i.test(text));
console.log('Title-like strings:', titleStrings.length);
