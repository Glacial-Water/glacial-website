import type { APIRoute } from 'astro';
import { isProduction } from '../data/site';

// Production: everything may be crawled, the sitemap is named. Preview: nothing is indexed (D188 a).
export const GET: APIRoute = ({ site }) => {
  const body = isProduction
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', site).href}\n`
    : `User-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
