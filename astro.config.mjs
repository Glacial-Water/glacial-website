import { defineConfig } from 'astro/config';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { redirects } from './src/data/redirects.mjs';

// Two targets, one codebase (D188 a):
//  - preview (default): GitHub Pages under /glacial-website/, every page noindex, robots.txt disallows all (D45).
//  - production: PUBLIC_TARGET=production npm run build -> top of glacial.pk, indexable, sitemap on, _redirects written (cutover, D140).
const production = process.env.PUBLIC_TARGET === 'production';

// Cloudflare Pages reads dist/_redirects. Old addresses 301 to the new pages (D140 (11)-(12)); both with and without the trailing slash.
const writeRedirects = {
  name: 'glacial-redirect-map',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      if (!production) return;
      const lines = redirects.flatMap(([from, to]) => [`${from} ${to} 301`, `${from.replace(/\/$/, '')} ${to} 301`]);
      await writeFile(fileURLToPath(new URL('_redirects', dir)), lines.join('\n') + '\n');
    },
  },
};

export default defineConfig({
  site: production ? 'https://glacial.pk' : 'https://glacial-water.github.io',
  base: production ? '/' : '/glacial-website',
  trailingSlash: 'always',
  integrations: [writeRedirects],
});
