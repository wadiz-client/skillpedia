import matter from 'gray-matter';
import { Marked } from 'marked';

import { HeadingIdResolver } from './HeadingIdResolver';

export interface TocHeading {
  depth: number;
  id: string;
  value: string;
}

export interface ArticleContent {
  headings: TocHeading[];
  html: string;
}

interface Frontmatter {
  description?: string;
  name?: string;
  title?: string;
}

export interface RenderedMarkdown {
  content: ArticleContent;
  frontmatter: Frontmatter;
}

/**
 * 마크다운 본문을 HTML로 변환하면서 heading id와 목차 데이터를 함께 산출합니다.
 */
const renderContent = (content: string): ArticleContent => {
  const headings: TocHeading[] = [];
  const headingIdResolver = new HeadingIdResolver();
  const marked = new Marked({ gfm: true });

  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        // h1 제목은 상단 Heading과 중복되므로 본문에서 제외합니다.
        if (depth === 1) {
          return '';
        }

        const inlineHtml = this.parser.parseInline(tokens);
        const value = inlineHtml.replace(/<[^>]*>/g, '');
        const id = headingIdResolver.resolve(value);

        headings.push({ depth, id, value });

        return `<h${depth} id="${id}">${inlineHtml}</h${depth}>\n`;
      },
    },
  });

  const html = marked.parse(content) as string;

  return { headings, html };
};

/**
 * 마크다운 원문을 메타데이터와 본문으로 분리합니다.
 *
 * @example
 * const source = '---\ntitle: 시작하기\n---\n# 제목\n본문\n## 섹션';
 * const result = parseMarkdown(source);
 * result.frontmatter.title; // '시작하기'
 * result.content.html; // '<p>본문</p>\n<h2 id="섹션">섹션</h2>\n' (h1 제외)
 * result.content.headings; // [{ depth: 2, id: '섹션', value: '섹션' }]
 */
export const parseMarkdown = (source: string): RenderedMarkdown => {
  const matterFile = matter(source);

  return {
    content: renderContent(matterFile.content),
    frontmatter: matterFile.data as Frontmatter,
  };
};
