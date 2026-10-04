import { defineConfig } from 'astro/config';

// Static output, deployed at domain root behind nginx/Apache.
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory', // /about/ -> about/index.html
  },
  compressHTML: false, // sources are already minified WordPress output
  devToolbar: { enabled: false },
});