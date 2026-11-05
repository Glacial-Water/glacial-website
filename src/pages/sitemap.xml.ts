import type { APIRoute } from 'astro';
import { framePages, isProduction } from '../data/site';

// /sitemap.xml: the frozen pages (D139) that exist as real pages. a page is listed only once its own file exists (Privacy and Terms, D196). The preview lists nothing (it is not indexed).
const built = import.meta.glob('./*.astro');
const exists = (slug: string) => (slug === '' ? './index.astro' : `./${slug}.astro`) in built;

export const GET: APIRoute = ({ site }) => {
  const urls = isProduction ? framePages.filter(exists).map((slug) => new URL(slug ? `${slug}/` : '', site).href) : [];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
