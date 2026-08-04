import { unstable_cache } from 'next/cache';

import {
  GITHUB_REVALIDATE_SECONDS,
  getRepositoryCacheTag,
  getRepositoryOctokit,
} from '@/shared/api/github';

export interface GetRepositoryReadmeMarkdownRequest {
  owner: string;
  path: string;
  repo: string;
}

export interface GetRepositoryReadmeMarkdownResponse {
  content: string;
  filePath: string;
}

const README_FILE_NAMES = ['README.mdx', 'README.md'] as const;

const getCandidates = (path: string): string[] => {
  if (!path) {
    return [
      ...README_FILE_NAMES,
      ...README_FILE_NAMES.map((name) => {
        return `docs/${name}`;
      }),
    ];
  }

  return [
    `${path}.mdx`,
    `${path}.md`,
    ...README_FILE_NAMES.map((name) => {
      return `${path}/${name}`;
    }),
  ];
};

const getErrorStatus = (error: unknown): number | undefined => {
  if (error instanceof Error && 'status' in error) {
    return (error as { status: number }).status;
  }

  return undefined;
};

const fetchRepositoryReadmeMarkdown = async ({
  owner,
  path,
  repo,
}: GetRepositoryReadmeMarkdownRequest): Promise<GetRepositoryReadmeMarkdownResponse | null> => {
  const octokit = await getRepositoryOctokit(owner, repo);
  const candidates = getCandidates(path);

  // 후보를 순차로 확인하면 왕복이 최대 4번 누적되므로, 한 번에 조회하고 기존 우선순위대로 선택합니다.
  const results = await Promise.allSettled(
    candidates.map((candidate) => {
      return octokit.rest.repos.getContent({ owner, path: candidate, repo });
    }),
  );

  for (const [index, result] of results.entries()) {
    if (result.status === 'rejected') {
      // 404가 아닌 오류는 캐시에 남지 않도록 그대로 던집니다.
      if (getErrorStatus(result.reason) !== 404) {
        throw result.reason;
      }

      continue;
    }

    const { data } = result.value;

    if ('content' in data && typeof data.content === 'string') {
      return {
        content: Buffer.from(data.content, 'base64').toString('utf8'),
        filePath: candidates[index],
      };
    }
  }

  return null;
};

/**
 * 저장소 README 마크다운 조회
 *
 * @description
 * 후보 파일이 모두 없으면 null을 반환합니다.
 * 없다는 결과도 캐시해야 진입마다 후보 조회가 반복되지 않으므로 오류로 처리하지 않습니다.
 */
export const getRepositoryReadmeMarkdown = ({
  owner,
  path,
  repo,
}: GetRepositoryReadmeMarkdownRequest): Promise<GetRepositoryReadmeMarkdownResponse | null> => {
  return unstable_cache(
    () => {
      return fetchRepositoryReadmeMarkdown({ owner, path, repo });
    },
    ['repository-readme-markdown', owner, repo, path],
    { revalidate: GITHUB_REVALIDATE_SECONDS, tags: [getRepositoryCacheTag(owner, repo)] },
  )();
};
