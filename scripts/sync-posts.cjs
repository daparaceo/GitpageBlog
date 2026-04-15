#!/usr/bin/env node
'use strict';

/**
 * sync-posts.cjs
 *
 * Claude Code PostToolUse hook 에 의해 자동 실행됩니다.
 * src/content/blog/ 의 마크다운 파일을 스캔하여
 * .private/life-info-guide.md 의 "기존 포스트 목록" 표를 갱신합니다.
 *
 * 수동 실행: node scripts/sync-posts.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const GUIDE_MD = path.join(ROOT, '.private', 'life-info-guide.md');

/** 마크다운 파일에서 프론트매터를 파싱합니다. */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (key) fm[key] = val;
  }
  return fm;
}

/** life-info 카테고리 포스트 목록을 반환합니다. */
function getPosts() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  const posts = [];
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
      const fm = parseFrontmatter(content);
      if (fm.category === 'life-info') {
        posts.push({
          file,
          title: fm.title || '',
          publishedAt: fm.publishedAt || '',
        });
      }
    } catch (_) {
      // 읽기 실패한 파일은 건너뜁니다.
    }
  }
  return posts.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
}

/** 마크다운 표 문자열을 생성합니다. */
function buildTable(posts) {
  return [
    '| 파일명 | 제목 | 발행일 |',
    '|--------|------|--------|',
    ...posts.map(p => `| \`${p.file}\` | ${p.title} | ${p.publishedAt} |`),
  ].join('\n');
}

/** life-info-guide.md 의 포스트 목록 표를 갱신합니다. */
function updateGuideMd(table) {
  const content = fs.readFileSync(GUIDE_MD, 'utf8');
  const SECTION = '## 기존 포스트 목록';
  const idx = content.indexOf(SECTION);
  if (idx === -1) {
    console.error('[sync-posts] 오류: life-info-guide.md 에서 포스트 목록 섹션을 찾을 수 없습니다.');
    process.exit(1);
  }
  // 섹션 헤더 이후를 표로 교체
  const updated = content.slice(0, idx) + SECTION + '\n\n' + table + '\n';
  fs.writeFileSync(GUIDE_MD, updated, 'utf8');
}

/** 파일 경로가 블로그 포스트인지 확인합니다. */
function isBlogPost(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  return normalized.includes('src/content/blog/') && filePath.endsWith('.md');
}

function main(filePath) {
  // 파일 경로가 지정된 경우 블로그 포스트인지 확인
  if (filePath && !isBlogPost(filePath)) {
    process.exit(0);
  }

  const posts = getPosts();
  const table = buildTable(posts);
  updateGuideMd(table);
  console.log(`[sync-posts] life-info-guide.md 업데이트 완료 — life-info ${posts.length}개`);
}

// hook 에서 실행 시 stdin 으로 tool 정보가 전달됩니다.
if (process.stdin.isTTY) {
  // 수동 실행
  main(process.argv[2] || '');
} else {
  let raw = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => { raw += chunk; });
  process.stdin.on('end', () => {
    let filePath = '';
    try {
      const data = JSON.parse(raw);
      filePath = data.tool_input?.file_path || data.tool_input?.path || '';
    } catch (_) {
      filePath = process.argv[2] || '';
    }
    main(filePath);
  });
}
