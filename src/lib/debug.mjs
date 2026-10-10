import { listPages, readPage, ROOT, MIRROR } from './pages.mjs';
console.error('ROOT=', ROOT);
console.error('MIRROR=', MIRROR);
console.error('exists mirror=', (await import('node:fs')).default.existsSync(MIRROR));
console.error('pages=', listPages().length);
console.error('home=', readPage('/') ? 'ok' : 'null');
