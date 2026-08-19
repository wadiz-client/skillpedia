import { unstable_cache } from 'next/cache';

import {
  GITHUB_REVALIDATE_SECONDS,
  getRepositoryCacheTag,
  getRepositoryOctokit,
  getRepositorySkillPaths,
} from '@/shared/api/github';

export interface RepositoryMetadata {
  description: string;
  owner: string;
  rank: number | null;
  repo: string;
  skillCount: number;
  starCount: number;
  updatedAt: string;
}

interface GetRepositoryMetadataRequest {
  owner: string;
  repo: string;
}

/**
 * 저장소 메타데이터 조회
 *
 * @description
 * GitHub 저장소의 스타 수·설명·업데이트 시각과 SKILL.md 개수를 조회합니다.
 * 홈 페이지는 저장소 수만큼 이 함수를 호출하므로 저장소 단위로 캐시해 진입마다 조회가 반복되지 않도록 합니다.
 */
export const getRepositoryMetadata = ({
  owner,
  repo,
}: GetRepositoryMetadataRequest): Promise<RepositoryMetadata> => {
  return unstable_cache(
    async () => {
      const octokit = await getRepositoryOctokit(owner, repo);

      const [repositoryResponse, skillPaths] = await Promise.all([
        octokit.rest.repos.get({ owner, repo }),
        getRepositorySkillPaths(owner, repo),
      ]);

      return {
        description: repositoryResponse.data.description ?? '',
        owner,
        rank: null,
        repo,
        skillCount: skillPaths.length,
        starCount: repositoryResponse.data.stargazers_count,
        updatedAt: repositoryResponse.data.pushed_at ?? repositoryResponse.data.updated_at ?? '',
      };
    },
    ['repository-metadata', owner, repo],
    { revalidate: GITHUB_REVALIDATE_SECONDS, tags: [getRepositoryCacheTag(owner, repo)] },
  )();
};
