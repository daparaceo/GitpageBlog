import { defineCollection, z } from 'astro:content';

// 카테고리 목록 (확장 시 여기에 추가)
// 각 카테고리는 /category/[slug] 페이지로 자동 생성됨
export const CATEGORIES = [
  { slug: 'life-info',  label: '생활정보' },
  { slug: 'tech',       label: 'IT·기술' },
  { slug: 'finance',    label: '재테크' },
  { slug: 'travel',     label: '여행' },
  { slug: 'food',       label: '음식·맛집' },
] as const;

export type CategorySlug = typeof CATEGORIES[number]['slug'];

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishedAt: z.date(),

    // 카테고리 (목록 페이지 분류 기준)
    category: z.enum([
      'life-info', 'tech', 'finance', 'travel', 'food'
    ]).optional(),

    // 태그 (카테고리 내 세부 분류)
    tags: z.array(z.string()).optional().default([]),

    // OG 이미지 (Cloudinary URL 권장)
    ogImage: z.string().optional(),

    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
