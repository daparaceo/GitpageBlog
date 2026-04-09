import { defineCollection, z } from 'astro:content';

// 카테고리 목록 (확장 시 여기에 추가)
// 각 카테고리는 /category/[slug] 페이지로 자동 생성됨
export const CATEGORIES = [
  { slug: 'life-info',       label: '생활정보' },
  { slug: 'tech',            label: 'IT·기술' },
  { slug: 'finance',         label: '재테크' },
  { slug: 'travel',          label: '여행' },
  { slug: 'food',            label: '음식·맛집' },
  { slug: 'english-reading', label: '영어원서읽기' },
  { slug: 'camping',         label: '캠핑' },
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
      'life-info', 'tech', 'finance', 'travel', 'food', 'english-reading', 'camping'
    ]).optional(),

    // 태그 (카테고리 내 세부 분류)
    tags: z.array(z.string()).optional().default([]),

    // OG 이미지 (Cloudinary URL 권장)
    ogImage: z.string().optional(),

    // 영어원서 관련 메타데이터 (관련 포스트 자동 추천에 사용)
    author: z.string().optional(),       // 저자 (예: "Karma Wilson")
    ar_level: z.number().optional(),     // AR 레벨 (예: 1.8)
    series: z.string().optional(),       // 시리즈명 (예: "Bear Series")
    isbn: z.string().optional(),         // ISBN-13 (예: "9780689859731") — 책 표지 이미지 경로에 사용

    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
