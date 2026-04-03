---
title: "블로그를 시작합니다"
description: "Astro와 GitHub Pages로 만든 개인 블로그의 첫 번째 글입니다."
publishedAt: 2026-04-01
category: "tech"
tags: ["블로그", "Astro", "시작"]
---

# 블로그를 시작합니다

드디어 개인 블로그를 만들었습니다! **Astro** 프레임워크를 사용해 빠르고 가벼운 정적 블로그를 구축했습니다.

## 왜 Astro를 선택했나요?

Astro는 콘텐츠 중심 웹사이트에 최적화된 프레임워크입니다. 주요 특징:

- **Zero JS by default** – 자바스크립트를 최소화해 빠른 로딩 속도
- **마크다운 지원** – `.md` 파일로 글을 편리하게 작성
- **정적 생성** – GitHub Pages 같은 정적 호스팅에 완벽하게 배포 가능
- **컴포넌트 유연성** – React, Vue, Svelte 등 UI 컴포넌트와 혼용 가능

## 블로그 기술 스택

| 항목 | 선택 |
|------|------|
| 프레임워크 | Astro |
| 스타일링 | Tailwind CSS |
| 호스팅 | GitHub Pages |
| 이미지 | Cloudinary |
| 배포 | GitHub Actions |

## 이미지 삽입 예시 (Cloudinary)

아래는 Cloudinary에 업로드된 외부 이미지를 마크다운에 삽입하는 방법입니다.

```md
![이미지 설명](https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/your-image.jpg)
```

실제 예시:

![샘플 이미지](https://res.cloudinary.com/demo/image/upload/w_800,h_400,c_fill/sample.jpg)
<!-- ↑ 위 URL은 Cloudinary 데모 이미지입니다. 실제 이미지로 교체하세요 -->

## 동영상 삽입 예시 (YouTube iframe)

유튜브 영상은 아래와 같이 iframe으로 삽입합니다.

<div class="relative pb-[56.25%] h-0 overflow-hidden rounded-xl my-4">
  <iframe
    class="absolute top-0 left-0 w-full h-full"
    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    title="YouTube video"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>

## 앞으로의 계획

앞으로 다양한 주제의 글을 작성할 예정입니다. 많은 관심 부탁드립니다!
