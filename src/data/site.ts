// Shared facts used by the header, footer and order sheet. Sources: 00-INDEX D5 (phone), D34 (hours), D49 (seven footer links).
// Links marked soon:true point at pages that are not built yet; they render as plain text until the page exists.
const base = import.meta.env.BASE_URL;
export const phoneDisplay = '0311-1125124';
export const phoneTel = '+923111125124';
export const whatsappUrl = 'https://wa.me/923111125124';
export const hoursLine = 'Shops open 9am–9pm, every day · Delivery bookings until 7pm';
export const navLinks: { label: string; href: string; soon?: boolean }[] = [
  { label: 'Products and prices', href: `${base}prices/`, soon: true },
  { label: 'How delivery works', href: `${base}delivery/`, soon: true },
  { label: 'Quality Certs', href: `${base}quality-certs/` },
  { label: 'For businesses', href: `${base}businesses/`, soon: true },
  { label: 'About Glacial', href: `${base}about/`, soon: true },
  { label: 'Contact and support', href: `${base}contact/`, soon: true },
  { label: 'FAQ', href: `${base}faq/`, soon: true },
];
