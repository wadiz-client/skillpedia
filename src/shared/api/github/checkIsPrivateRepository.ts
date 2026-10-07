import { unstable_cache } from 'next/cache';

import { getRepositoryCacheTag } from './getRepositoryCacheTag';
import { getRepositoryOctokit } from './getRepositoryOctokit';

// 공개 여부는 거의 바뀌지 않고 늦게 반영돼도 내용이 노출되지 않으므로 하루 동안 재사용합니다.
const REVALIDATE_SECONDS = 24 * 60 * 60;

/**
 * 저장소 비공개 여부 조회
 *
 * @description
 * 공개 저장소 이미지는 GitHub에서 직접 불러오고, 비공개 저장소 이미지만 중계 라우트를 거치도록 판별합니다.
 */
export const checkIsPrivateRepository = (owner: string, repo: string): Promise<boolean> => {
  return unstable_cache(
    async () => {
      const octokit = await getRepositoryOctokit(owner, repo);
      const { data } = await octokit.rest.repos.get({ owner, repo });

      return data.private;
    },
    ['repository-is-private', owner, repo],
    { revalidate: REVALIDATE_SECONDS, tags: [getRepositoryCacheTag(owner, repo)] },
  )();
};
