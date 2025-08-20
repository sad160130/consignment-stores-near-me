import { processExcelData, getStateSlug, getCitySlug } from '@/lib/data-processor';

export async function GET() {
  const data = processExcelData();
  const baseUrl = 'https://www.consignmentstores.site'; // Updated domain
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Pages -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/sitemap</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;

  // Add state pages
  data.statesList.forEach((stateName) => {
    const stateSlug = getStateSlug(stateName);
    sitemap += `  <url>
    <loc>${baseUrl}/${stateSlug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
  });

  // Add city pages
  Object.entries(data.citiesByState).forEach(([stateName, cities]) => {
    const stateSlug = getStateSlug(stateName);
    cities.forEach((cityName) => {
      const citySlug = getCitySlug(cityName);
      sitemap += `  <url>
    <loc>${baseUrl}/${stateSlug}/${citySlug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });
  });

  sitemap += '</urlset>';

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}