import type { APIRoute } from 'astro';
import { phoneDisplay, hoursLine, shops, framePages } from '../data/site';

// /llms.txt (D172 f): a small plain-text guide for assistants. No claim beyond what the pages say (D55); no rating, no testing-body names (D24).
const built = import.meta.glob('./*.astro');
const exists = (slug: string) => (slug === '' ? './index.astro' : `./${slug}.astro`) in built;
const names: Record<string, string> = {
  '': 'Home', 'quality-certs': 'Quality Certs (published monthly reports)', order: 'Order', prices: 'Products and prices',
  delivery: 'How delivery works', 'for-businesses': 'For businesses', about: 'About Glacial', contact: 'Contact and support',
  faq: 'FAQ', privacy: 'Privacy', terms: 'Terms',
};

export const GET: APIRoute = ({ site }) => {
  const pages = framePages.filter(exists).map((s) => `- [${names[s]}](${new URL(s ? `${s}/` : '', site).href})`);
  const body = `# Glacial

> Glacial sells pure drinking water in refillable bottles, delivered across Lahore, Pakistan, and sold at two shops in Lahore.

## Pages
${pages.join('\n')}

## Shops
${shops.map((s) => `- ${s.name}: ${s.street}, Lahore`).join('\n')}

## Contact
- Phone and WhatsApp: ${phoneDisplay}
- ${hoursLine}
- Prices are listed on the Products and prices page.
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
