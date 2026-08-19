import { unstable_cache } from 'next/cache';

import {
  GITHUB_REVALIDATE_SECONDS,
  getRepositoryCacheTag,
  getRepositoryOctokit,
} from '@/shared/api/github';

export interface RepositoryFileContributor {
  avatarUrl: string;
  name: string;
}

export interface RepositoryFileMetadata {
  committedAt: string;
  contributors: RepositoryFileContributor[];
  htmlUrl: string;
  message: string;
}

export interface GetRepositoryFileMetadataRequest {
  filePath: string;
  owner: string;
  repo: string;
}

// GitHub API가 한 번에 돌려주는 커밋 상한입니다.
const COMMIT_LIMIT_COUNT = 100;

/**
 * 파일 메타데이터 조회
 *
 * @description
 * 파일의 최근 커밋 목록에서 마지막 커밋의 작업 일시·링크·메시지와 기여자 목록을 추립니다.
 * 커밋이 없거나 조회에 실패하면 null을 반환합니다. 메타데이터는 본문 노출을 막지 않는 부가 정보이므로 오류로 처리하지 않습니다.
 */
export const getRepositoryFileMetadata = ({
  filePath,
  owner,
  repo,
}: GetRepositoryFileMetadataRequest): Promise<RepositoryFileMetadata | null> => {
  return unstable_cache(
    async () => {
      const octokit = await getRepositoryOctokit(owner, repo);

      try {
        const { data } = await octokit.rest.repos.listCommits({
          owner,
          path: filePath,
          per_page: COMMIT_LIMIT_COUNT,
          repo,
        });
        const [commit] = data;

        if (!commit) {
          return null;
        }

        const contributorMap = new Map<string, RepositoryFileContributor>();

        for (const fileCommit of data) {
          const name = fileCommit.commit.author?.name ?? '';

          if (!name || contributorMap.has(name)) {
            continue;
          }

          contributorMap.set(name, { avatarUrl: fileCommit.author?.avatar_url ?? '', name });
        }

        return {
          committedAt: commit.commit.author?.date ?? commit.commit.committer?.date ?? '',
          contributors: [...contributorMap.values()],
          htmlUrl: commit.html_url,
          message: commit.commit.message.split('\n')[0],
        };
      } catch {
        return null;
      }
    },
    ['repository-file-metadata', owner, repo, filePath],
    { revalidate: GITHUB_REVALIDATE_SECONDS, tags: [getRepositoryCacheTag(owner, repo)] },
  )();
};
