import fs from 'node:fs';
import path from 'node:path';

const EN_DIR = 'mirror/en';
const entries = fs.readdirSync(EN_DIR, { withFileTypes: true });

for (const e of entries) {
  if (e.isDirectory()) {
    const sub = fs.readdirSync(path.join(EN_DIR, e.name), { withFileTypes: true });
    console.log(`- ${e.name} (${sub.length} entries)`);
  } else {
    console.log(`- [file] ${e.name}`);
  }
}
