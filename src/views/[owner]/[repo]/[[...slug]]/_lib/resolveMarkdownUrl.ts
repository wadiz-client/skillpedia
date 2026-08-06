import { defaultUrlTransform } from 'react-markdown';

interface ResolveMarkdownUrlRequest {
  filePath: string;
  key: string;
  owner: string;
  repo: string;
  url: string;
}

const checkIsRepositoryPath = (url: string): boolean => {
  // 변환 제외 대상
  //
  // - 프로토콜이 있는 주소
  // - //로 시작하는 주소
  // - 문서 안 앵커
  return !/^[a-z][a-z0-9+.-]*:/i.test(url) && !url.startsWith('//') && !url.startsWith('#');
};

// 마크다운 파일이 있는 폴더를 기준으로 .과 ..을 정리해 저장소 경로를 만듭니다.
const resolvePath = (filePath: string, path: string): string => {
  const baseSegments = path.startsWith('/') ? [] : filePath.split('/').slice(0, -1);
  const segments: string[] = [];

  for (const segment of [...baseSegments, ...path.split('/')]) {
    if (segment === '' || segment === '.') {
      continue;
    }

    if (segment === '..') {
      segments.pop();
      continue;
    }

    segments.push(segment);
  }

  return segments.join('/');
};

/**
 * 문서 안 이미지·링크 주소 변환
 *
 * @description
 * 저장소 파일을 가리키는 상대 경로를 이미지 중계 라우트 주소와 GitHub 문서 주소로 바꿉니다.
 * 변환 대상이 아닌 주소는 react-markdown 기본 변환에 넘겨 위험한 프로토콜을 걸러 냅니다.
 */
export const resolveMarkdownUrl = ({ filePath, key, owner, repo, url }: ResolveMarkdownUrlRequest): string => {
  if (!checkIsRepositoryPath(url)) {
    return defaultUrlTransform(url);
  }

  const suffixIndex = url.search(/[?#]/);
  const path = suffixIndex === -1 ? url : url.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? '' : url.slice(suffixIndex);
  const resolvedPath = resolvePath(filePath, path);

  if (key === 'src') {
    return `/api/proxy/repository-images/${owner}/${repo}/${resolvedPath}`;
  }

  return `https://github.com/${owner}/${repo}/blob/HEAD/${resolvedPath}${suffix}`;
};
