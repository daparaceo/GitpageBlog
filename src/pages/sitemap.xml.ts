// 수동 sitemap 생성 엔드포인트
// @astrojs/sitemap 라이브러리 버그 우회용

import { getCollection } from 'astro:content';

export async function GET() {
  const siteUrl = 'https://daparapara.com';

  const posts = await getCollection('blog', ({ data }) => !data.draft);

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/about/', priority: '0.8', changefreq: 'monthly' },
    { url: '/privacy/', priority: '0.5', changefreq: 'yearly' },
    { url: '/category/life-info/', priority: '0.8', changefreq: 'daily' },
    { url: '/category/tech/', priority: '0.8', changefreq: 'daily' },
    { url: '/category/finance/', priority: '0.8', changefreq: 'daily' },
    { url: '/category/travel/', priority: '0.8', changefreq: 'weekly' },
    { url: '/category/food/', priority: '0.8', changefreq: 'weekly' },
  ];

  const postEntries = posts.map((post) => ({
    url: `/blog/${post.slug}/`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: post.data.publishedAt.toISOString().split('T')[0],
  }));

  const allEntries = [...staticPages, ...postEntries];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (entry) => `  <url>
    <loc>${siteUrl}${entry.url}</loc>
    ${'lastmod' in entry ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
