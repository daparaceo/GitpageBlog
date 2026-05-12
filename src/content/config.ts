import { defineCollection, z } from 'astro:content';

// 카테고리 목록 (확장 시 여기에 추가)
// 각 카테고리는 /category/[slug] 페이지로 자동 생성됨
export const CATEGORIES = [
  { slug: 'english-reading', label: '영어원서읽기', desc: '아이와 함께 읽는 원서 리뷰와 영어 학습 콘텐츠' },
  { slug: 'weekend-trip',    label: '주말여행',     desc: '아이와 함께 떠나는 국내 여행 정보' },
  { slug: 'camping',         label: '캠핑',         desc: '캠핑 장비, 장소, 꿀팁 정보' },
  { slug: 'life-info',       label: '생활정보',     desc: '실생활에 바로 쓸 수 있는 정보와 팁' },
  { slug: 'tech',            label: 'IT · 기술',    desc: '최신 기술 트렌드와 실용적인 디지털 활용법' },
  { slug: 'finance',         label: '재테크',       desc: '절약, 투자, 금융 상품 관련 정보' },
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
      'life-info', 'tech', 'finance', 'travel', 'weekend-trip', 'food', 'english-reading', 'camping'
    ]).optional(),

    // 추가 카테고리 (여러 카테고리에 동시 노출할 때 사용)
    categories: z.array(z.enum([
      'life-info', 'tech', 'finance', 'travel', 'weekend-trip', 'food', 'english-reading', 'camping'
    ])).optional().default([]),

    // 태그 (카테고리 내 세부 분류)
    tags: z.array(z.string()).optional().default([]),

    // OG 이미지 (Cloudinary URL 권장)
    ogImage: z.string().optional(),

    // 영어원서 관련 메타데이터 (관련 포스트 자동 추천에 사용)
    en_title: z.string().optional(),      // 영문 원제 (예: "Bear Feels Sick")
    author: z.string().optional(),       // 저자 (예: "Karma Wilson")
    ar_level: z.number().optional(),     // AR 레벨 (예: 1.8)
    series: z.string().optional(),       // 시리즈명 (예: "Bear Series")
    isbn: z.string().optional(),         // ISBN-13 (예: "9780689859731") — 책 표지 이미지 경로에 사용

    // 지도 임베드 (locations 배열이 있으면 글 내에 지도 자동 표시)
    locations: z.array(z.object({
      lat: z.number(),                   // 위도 (예: 37.5665)
      lng: z.number(),                   // 경도 (예: 126.9780)
      label: z.string().optional(),      // 핀 라벨 (클릭 시 팝업으로 표시)
    })).optional(),

    // 관련 포스트 고정 (slug 배열 — 추천 영역에 항상 노출)
    pinnedRelated: z.array(z.string()).optional().default([]),

    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
