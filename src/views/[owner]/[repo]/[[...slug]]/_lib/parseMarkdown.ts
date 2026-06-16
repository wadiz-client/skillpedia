import GithubSlugger from 'github-slugger';
import matter from 'gray-matter';
import { Marked } from 'marked';

export interface TocHeading {
  depth: number;
  id: string;
  value: string;
}

export interface ArticleContent {
  headings: TocHeading[];
  markdown: string;
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
 * 목차용 heading을 추출합니다.
 *
 * @description
 * 렌더링 단계의 rehype-slug와 같은 id를 만들기 위해 github-slugger를 사용합니다.
 * rehype-slug가 h1까지 순서대로 처리하므로, 중복 접미사(-1, -2)를 맞추려고 모든 heading을 같은 순서로 입력합니다.
 */
const extractHeadings = (markdown: string): TocHeading[] => {
  const slugger = new GithubSlugger();
  const marked = new Marked({ gfm: true });
  const tokens = marked.lexer(markdown);
  const headings: TocHeading[] = [];

  for (const token of tokens) {
    if (token.type === 'heading') {
      const inlineHtml = marked.parseInline(token.text) as string;
      const value = inlineHtml.replace(/<[^>]*>/g, '');
      const id = slugger.slug(value);

      headings.push({ depth: token.depth, id, value });
    }
  }

  return headings;
};

/**
 * 마크다운 원문을 메타데이터와 본문으로 분리합니다.
 *
 * @example
 * const source = '---\ntitle: 시작하기\n---\n# 제목\n본문\n## 섹션';
 * const result = parseMarkdown(source);
 * result.frontmatter.title; // '시작하기'
 * result.content.markdown; // '# 제목\n본문\n## 섹션'
 * result.content.headings; // [{ depth: 1, ... }, { depth: 2, id: '섹션', value: '섹션' }]
 */
export const parseMarkdown = (source: string): RenderedMarkdown => {
  const matterFile = matter(source);

  return {
    content: {
      headings: extractHeadings(matterFile.content),
      markdown: matterFile.content,
    },
    frontmatter: matterFile.data as Frontmatter,
  };
};
