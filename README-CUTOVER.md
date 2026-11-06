# Cutover plumbing (C5)

One codebase, two builds.

- **Preview (default, what GitHub Pages deploys):** `npm run build`. Lives under `/glacial-website/`, every page carries `noindex`, `robots.txt` disallows everything, the sitemap is empty.
- **Production (for glacial.pk):** `PUBLIC_TARGET=production npm run build`. Site works at the top of the domain (`/`), pages are indexable with a canonical link, `robots.txt` names `/sitemap.xml`, the sitemap lists the frozen pages that exist, and `dist/_redirects` (Cloudflare Pages format) is written from `src/data/redirects.mjs`.

On Cloudflare Pages set the build command to `PUBLIC_TARGET=production npm run build` and the output folder to `dist`.

Files: `src/data/redirects.mjs` (old address -> new page), `src/pages/robots.txt.ts`, `sitemap.xml.ts`, `llms.txt.ts`, shop and schema data in `src/data/site.ts`, Product/Offer schema in `src/pages/prices.astro`.
Not included yet: the Google Tag Manager container (no ID), the FAQ and Privacy & terms pages (their own pull requests; the sitemap, redirects and llms.txt pick them up when the files exist).
