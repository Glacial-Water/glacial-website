import { defineConfig } from 'astro/config';

// Preview on GitHub Pages (D45). At cutover, site/base change to the real domain.
export default defineConfig({
  site: 'https://glacial-water.github.io',
  base: '/glacial-website',
  trailingSlash: 'always',
});
