// 수동 sitemap 생성 엔드포인트
// @astrojs/sitemap 라이브러리 버그 우회용

import { getCollection } from 'astro:content';
import { CATEGORIES } from '../content/config';

export async function GET() {
  const siteUrl = 'https://daparapara.com';

  const posts = await getCollection('blog', ({ data }) => !data.draft);

  const staticPages = [
    { url: '/',         priority: '1.0', changefreq: 'daily' },
    { url: '/about/',   priority: '0.8', changefreq: 'monthly' },
    { url: '/privacy/', priority: '0.5', changefreq: 'yearly' },
    { url: '/search/',  priority: '0.6', changefreq: 'monthly' },
  ];

  // 글이 1개 이상 있는 카테고리만 포함 + lastmod는 해당 카테고리 최신 글 날짜
  const categoryEntries = CATEGORIES
    .map(({ slug }) => {
      const categoryPosts = posts.filter(
        (p) => p.data.category === slug || (p.data.categories ?? []).includes(slug)
      );
      if (categoryPosts.length === 0) return null;
      const latest = categoryPosts
        .map((p) => p.data.publishedAt)
        .sort((a, b) => b.valueOf() - a.valueOf())[0];
      return {
        url: `/category/${slug}/`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: latest.toISOString().split('T')[0],
      };
    })
    .filter(Boolean) as { url: string; priority: string; changefreq: string; lastmod: string }[];

  const postEntries = posts.map((post) => ({
    url: `/blog/${post.slug.split('/').pop()}/`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: post.data.publishedAt.toISOString().split('T')[0],
  }));

  const allEntries = [...staticPages, ...categoryEntries, ...postEntries];

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
