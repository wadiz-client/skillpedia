import { getRepoMetadata } from '@/features/repo-metadata/api';
import type { RepoMetadata } from '@/features/repo-metadata/api';

import { getRepoGroups } from './getRepoGroups';

const RANK_COUNT = 3;
const SKILL_WEIGHT = 0.6;
const RECENCY_WEIGHT = 0.4;

// 목록 안에서 값을 0~1로 정규화합니다. 최솟값과 최댓값이 같으면 0을 반환합니다.
const normalize = (value: number, min: number, max: number): number => {
  if (max <= min) {
    return 0;
  }

  return (value - min) / (max - min);
};

/**
 * 저장소 그룹을 평탄화해 저장소마다 메타데이터를 조회하고,
 * SKILL.md 개수와 최근성을 가중 합산한 점수로 정렬해 상위 3개에 순위를 부여합니다.
 */
export const getRankedRepoMetadataList = async (): Promise<RepoMetadata[]> => {
  const repoGroups = getRepoGroups();
  const repoPaths = repoGroups.flatMap((group) => {
    return group.repos;
  });

  const repoMetadataList = await Promise.all(
    repoPaths.map((repoPath) => {
      const [owner, repo] = repoPath.split('/');

      return getRepoMetadata({ owner, repo });
    }),
  );

  const skillCounts = repoMetadataList.map((repoMetadata) => {
    return repoMetadata.skillCount;
  });
  const updatedTimes = repoMetadataList.map((repoMetadata) => {
    return new Date(repoMetadata.updatedAt).getTime() || 0;
  });
  const minSkillCount = Math.min(...skillCounts);
  const maxSkillCount = Math.max(...skillCounts);
  const minUpdatedTime = Math.min(...updatedTimes);
  const maxUpdatedTime = Math.max(...updatedTimes);

  return repoMetadataList
    .map((repoMetadata) => {
      const skillScore = normalize(repoMetadata.skillCount, minSkillCount, maxSkillCount);
      const recencyScore = normalize(new Date(repoMetadata.updatedAt).getTime() || 0, minUpdatedTime, maxUpdatedTime);
      const score = skillScore * SKILL_WEIGHT + recencyScore * RECENCY_WEIGHT;

      return { repoMetadata, score };
    })
    .sort((a, b) => {
      return b.score - a.score;
    })
    .map(({ repoMetadata }, index) => {
      return { ...repoMetadata, rank: index < RANK_COUNT ? index + 1 : null };
    });
};
