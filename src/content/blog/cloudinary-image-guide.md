---
title: "블로그 이미지를 Cloudinary로 관리하는 방법"
description: "GitHub 저장소에 이미지를 올리지 않고 Cloudinary CDN을 이용해 블로그 이미지를 효율적으로 관리하는 방법을 소개합니다."
publishedAt: 2024-01-25
category: "tech"
tags: ["Cloudinary", "이미지", "CDN", "블로그 운영"]
---

# 블로그 이미지를 Cloudinary로 관리하는 방법

정적 블로그를 운영할 때 이미지를 GitHub 저장소에 올리면 두 가지 문제가 생깁니다.

1. **저장소 용량 증가** – Git은 이미지 변경 이력을 모두 저장하므로 금방 무거워집니다.
2. **느린 로딩** – GitHub raw 파일 서버는 CDN이 아닙니다.

이 두 문제를 **Cloudinary**로 해결할 수 있습니다.

## Cloudinary란?

- 이미지/동영상 최적화 & CDN 서비스
- 무료 플랜: 25GB 저장, 25GB 월 대역폭 (개인 블로그에 충분)
- URL 파라미터로 실시간 리사이징, 포맷 변환 가능

## 설정 방법

### 1. 회원가입

[cloudinary.com](https://cloudinary.com) 에서 무료 계정을 만듭니다.

### 2. 이미지 업로드

- 대시보드 → **Media Library** → 이미지 드래그 앤 드롭
- 폴더로 구분하면 관리가 편합니다 (예: `blog/2024/`)

### 3. URL로 이미지 삽입

업로드 후 제공되는 URL을 마크다운에 그대로 사용합니다.

```md
![이미지 설명](https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/blog/image.jpg)
```

## URL 변환 파라미터 활용

Cloudinary URL에 변환 파라미터를 추가해 다양한 최적화를 적용할 수 있습니다.

| 파라미터 | 설명 | 예시 |
|---------|------|------|
| `w_800` | 너비 800px | `w_800/image.jpg` |
| `h_400` | 높이 400px | `h_400/image.jpg` |
| `c_fill` | 크롭 방식 | `c_fill/image.jpg` |
| `f_auto` | 최적 포맷 자동 선택 (WebP 등) | `f_auto/image.jpg` |
| `q_auto` | 품질 자동 최적화 | `q_auto/image.jpg` |

### 최적화 URL 예시

```
https://res.cloudinary.com/your-cloud/image/upload/w_800,f_auto,q_auto/blog/post-image.jpg
```

## 실제 사용 예시

기본 이미지:

![Cloudinary 샘플](https://res.cloudinary.com/demo/image/upload/w_800,f_auto,q_auto/sample.jpg)

썸네일 (가로 400px, 세로 300px):

![썸네일](https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_fill,f_auto,q_auto/sample.jpg)

## 팁: OG 이미지도 Cloudinary로

블로그 글마다 소셜 미리보기 이미지(OG 이미지)를 Cloudinary URL로 지정할 수 있습니다.

```md
---
title: "글 제목"
ogImage: "https://res.cloudinary.com/your-cloud/image/upload/blog/og-image.jpg"
---
```

이렇게 하면 GitHub에는 코드와 마크다운만 올라가고,
모든 이미지는 Cloudinary CDN에서 빠르게 서비스됩니다.
