// sitemap.xml, generated on every build so new pages appear automatically.
import type { APIRoute } from 'astro';

const routes = ['/', '/cv/', '/research/', '/publications/', '/teaching/', '/media/', '/contact/', '/legal-notice/', '/privacy/'];

export const GET: APIRoute = ({ site }) => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .map((r) => `  <url><loc>${new URL(r, site)}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
