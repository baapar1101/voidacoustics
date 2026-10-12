const fs = require('fs');

const data = JSON.parse(fs.readFileSync('tools/extracted-strings.json', 'utf8'));

// Sample various categories of strings
const allKeys = Object.keys(data);

console.log('Sample menu/nav items:');
allKeys.filter((k) => k.length < 30 && data[k].count > 50).slice(0, 30).forEach((k) => console.log('  ', k));

console.log('\nSample product titles/series:');
allKeys.filter((k) => /series|system|loudspeaker|subwoofer|amplifier/i.test(k)).slice(0, 20).forEach((k) => console.log('  ', k));

console.log('\nSample specs/technical labels:');
allKeys.filter((k) => /frequency|dispersion|power|impedance|weight|mounting|coverage|driver|spl|aes/i.test(k)).slice(0, 20).forEach((k) => console.log('  ', k));
