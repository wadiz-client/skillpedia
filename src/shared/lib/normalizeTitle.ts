// 표시용 제목에서 대문자로 표기할 축약어 목록입니다.
const ACRONYMS = new Set([
  '3d',
  'ab',
  'ai',
  'api',
  'cc',
  'cd',
  'ci',
  'cli',
  'cqrs',
  'css',
  'db',
  'ddd',
  'doc',
  'docx',
  'e2e',
  'ecc',
  'fe',
  'gc',
  'geo',
  'gif',
  'gwt',
  'html',
  'http',
  'https',
  'id',
  'io',
  'js',
  'json',
  'llm',
  'mcp',
  'md',
  'os',
  'pci',
  'pdf',
  'ppt',
  'pptx',
  'pr',
  'prd',
  'qa',
  'rag',
  'sdk',
  'seo',
  'sql',
  'tdd',
  'ts',
  'ui',
  'url',
  'ux',
  'wds',
  'xss',
]);

/**
 * 프론트매터 제목을 우선 사용하고, 없으면 폴더명을 표시용 제목으로 변환합니다.
 * 구분자는 공백으로 바꾸고 단어는 Title Case로, 축약어는 대문자로 표기합니다.
 *
 * @example
 * normalizeTitle('시작하기', 'regular-release'); // '시작하기'
 * normalizeTitle(undefined, 'e2e-verifier'); // 'E2E Verifier'
 * normalizeTitle(undefined, 'prd_diagnose'); // 'PRD Diagnose'
 */
export const normalizeTitle = (title: string | undefined, folderName: string): string => {
  if (title) {
    return title;
  }

  return folderName
    .split(/[-_\s]+/)
    .filter((word) => {
      return word.length > 0;
    })
    .map((word) => {
      if (ACRONYMS.has(word.toLowerCase())) {
        return word.toUpperCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};
