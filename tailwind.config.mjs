// tailwind.config.mjs
// Tailwind CSS 설정 파일

/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind가 클래스를 스캔할 파일 경로
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // 블로그 브랜드 색상 (원하는 색으로 변경)
      colors: {
        brand: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
      },
      // 본문 폰트 설정 (Google Fonts와 연동 가능)
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      // 마크다운 본문 최대 너비
      maxWidth: {
        prose: '70ch',
      },
      // 타이포그래피 플러그인 사용 시 커스텀 색상
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: { color: theme('colors.brand.600') },
            'h1,h2,h3,h4': { color: theme('colors.gray.900') },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
