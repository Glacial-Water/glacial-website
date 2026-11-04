// Redirect map for cutover (D140 (11)-(12), D188 a). Old WordPress addresses -> new pages, 301.
// Written into dist/_redirects (Cloudflare Pages format) at build time ONLY for the production target (see astro.config.mjs).
// Dropped and junk addresses are NOT listed: they get the site's own not-found page, never a redirect to Home (D140 11 b).
// The ruler ratifies this map (D140 11 a). Two calls for the ruler are marked CALL below.
export const redirects = [
  // [old address, new address]
  ['/home/', '/'],
  ['/about-us/', '/about/'],
  ['/contact-us/', '/contact/'],
  ['/faqs/', '/faq/'],                 // FAQ lands in its own pull request (D188 a); until then /faq/ is the coming-soon page
  ['/certified-quality/', '/quality-certs/'],
  ['/residential-waters/', '/prices/'], // CALL: "the nearest new page" (D140 11): home-delivery products and prices; ruler may choose /delivery/
  ['/mineral-water-delivery-pakistan/', '/delivery/'], // D140 (12): not on the frozen list; 301 to /delivery/ unless the ruler finds a closer match
  ['/privacy-policy/', '/privacy/'],   // D140 (11 d): yes, whether or not the old site gets a privacy page; page lands in its own pull request
];
