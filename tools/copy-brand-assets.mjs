import fs from 'node:fs';
import path from 'node:path';

const assets = [
  'favicon.svg',
  'favicon.png',
  'void_fa_logo.svg',
  'void_fa_logo_white.svg',
  'void_fa_logo.png',
  'logo.svg',
];

const targets = ['public', 'mirror', 'dist'];

for (const target of targets) {
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
  for (const asset of assets) {
    if (fs.existsSync(asset)) {
      fs.copyFileSync(asset, path.join(target, asset));
      console.log(`Copied ${asset} -> ${target}/${asset}`);
    }
  }
}
