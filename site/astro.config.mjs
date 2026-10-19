// @ts-check
import { defineConfig } from 'astro/config';

// Static build for an ordinary web host (STRATO): every page becomes
// <route>/index.html, assets go to /_astro/.
export default defineConfig({
  site: 'https://www.hanusch.earth',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'never' },
});
