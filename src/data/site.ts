// Shared facts used by the header, footer and order sheet. Sources: 00-INDEX D5 (phone), D34 (hours), D49 (seven footer links).
// Links marked soon:true point at one-line "coming soon" stub pages (noindex) until the real page is built (D81 b).
const base = import.meta.env.BASE_URL;
// Cutover switch (D188 a): PUBLIC_TARGET=production builds the site for the top of glacial.pk; anything else is the not-indexed preview.
export const isProduction = import.meta.env.PUBLIC_TARGET === 'production';
export const phoneDisplay = '03.111.125.124'; // D146: shown this way on every page; tel:, wa.me and schema keep +923111125124
export const phoneTel = '+923111125124';
export const whatsappUrl = 'https://wa.me/923111125124';
export const hoursLine = 'Shops open 9am–9pm, every day · Delivery bookings until 7pm';
export const navLinks: { label: string; href: string; soon?: boolean }[] = [
  { label: 'Products and prices', href: `${base}prices/` },
  { label: 'How delivery works', href: `${base}delivery/` },
  { label: 'Quality Certs', href: `${base}quality-certs/` },
  { label: 'For businesses', href: `${base}for-businesses/` },
  { label: 'About Glacial', href: `${base}about/` },
  { label: 'Contact and support', href: `${base}contact/` },
  { label: 'FAQ', href: `${base}faq/` },
];

// The two shops (D12, D131, D132, D34). Registered address is never published. No rating, no licence marks, no testing-body names (D10, D24, D172 c).
export const shops = [
  { id: 'dha-phase-1', name: 'Glacial — DHA Phase 1', street: '32/5 Block A, DHA Phase 1' },
  { id: 'johar-town', name: 'Glacial — Johar Town', street: '358-E, Johar Town, Near Allah Hu Chowk' },
];

// Site-wide structured data: one LocalBusiness per shop. `origin` is the site's own address (no trailing slash).
export function localBusinessSchema(origin: string) {
  return shops.map((s) => ({
    '@type': 'LocalBusiness',
    '@id': `${origin}/#${s.id}`,
    name: s.name,
    url: `${origin}/`,
    telephone: phoneTel,
    address: { '@type': 'PostalAddress', streetAddress: s.street, addressLocality: 'Lahore', addressCountry: 'PK' },
    areaServed: { '@type': 'City', name: 'Lahore' },
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '21:00',
    }],
  }));
}

// The ten frozen pages (D139). The sitemap lists the ones that exist as real pages; FAQ and Privacy & terms join when their pages land.
// /terms/ serves the same page as /privacy/ and its canonical points there (D197 a), so it is not in the sitemap or llms.txt.
export const listedPages = ['', 'quality-certs', 'order', 'prices', 'delivery', 'for-businesses', 'about', 'contact', 'faq', 'privacy'];
export const framePages = listedPages;

// Privacy and Terms (D196): one design served at two addresses; the footer carries both links on every page (D105P). Not part of the seven-link nav (D49) or the header menu.
export const legalLinks = [
  { label: 'Privacy', href: `${base}privacy/#privacy` },
  { label: 'Terms', href: `${base}terms/#terms` },
];
