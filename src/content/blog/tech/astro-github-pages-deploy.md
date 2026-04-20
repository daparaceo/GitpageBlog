---
title: "Astro 블로그를 GitHub Pages에 자동 배포하는 방법"
description: "GitHub Actions를 이용해 Astro 프로젝트를 GitHub Pages에 무료로 자동 배포하는 과정을 단계별로 설명합니다."
publishedAt: 2026-04-01
category: "tech"
tags: ["Astro", "GitHub Pages", "GitHub Actions", "배포"]
---

# Astro 블로그를 GitHub Pages에 자동 배포하는 방법

이 글에서는 **GitHub Actions**를 사용해 `main` 브랜치에 코드를 푸시하면
자동으로 Astro 블로그가 GitHub Pages에 배포되는 환경을 구성하는 방법을 설명합니다.

## 사전 준비

- GitHub 계정
- GitHub 저장소 생성 완료
- Node.js 18+ 설치

## 1단계: GitHub 저장소 설정

GitHub 저장소의 **Settings → Pages** 메뉴로 이동합니다.

- **Source**: `GitHub Actions` 선택

> 이 설정을 하지 않으면 Actions 배포가 동작하지 않습니다.

## 2단계: astro.config.mjs 설정

```js
// astro.config.mjs
export default defineConfig({
  // 본인의 사이트 URL로 변경
  site: 'https://username.github.io',

  // 저장소 이름이 username.github.io가 아닌 경우 base 설정 필요
  // base: '/repo-name',
});
```

## 3단계: GitHub Actions 워크플로우 파일 생성

`.github/workflows/deploy.yml` 파일을 생성합니다.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

## 4단계: 배포 확인

`main` 브랜치에 커밋 & 푸시하면 **Actions 탭**에서 배포 진행 상황을 확인할 수 있습니다.

![GitHub Actions 배포 화면](https://res.cloudinary.com/demo/image/upload/w_800,h_400,c_fill/github_actions_sample.jpg)
<!-- ↑ 실제 스크린샷으로 교체하세요 -->

## 커스텀 도메인 연결 방법

자신의 도메인을 연결하려면:

1. `public/CNAME` 파일에 도메인 입력 (`yourdomain.com`)
2. 도메인 DNS에 GitHub Pages IP 또는 CNAME 설정
3. GitHub Settings → Pages에서 커스텀 도메인 입력 및 HTTPS 활성화

Cloudflare를 CDN으로 사용하는 경우 프록시 설정에 주의하세요.

## 마무리

이제 `git push`만 하면 자동으로 블로그가 배포됩니다! 🎉
