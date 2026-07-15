import { getRepositoryMetadata } from '@/features/repository-metadata/api';
import type { RepositoryMetadata } from '@/features/repository-metadata/api';

import { getRepositories } from './getRepositories';

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
 * 저장소 목록의 각 저장소 메타데이터를 조회하고,
 * SKILL.md 개수와 최근성을 가중 합산한 점수로 정렬해 상위 3개에 순위를 부여합니다.
 */
export const getRankedRepositoryMetadataList = async (): Promise<RepositoryMetadata[]> => {
  const repositoryPaths = getRepositories();

  const repositoryMetadataList = await Promise.all(
    repositoryPaths.map((repositoryPath) => {
      const [owner, repo] = repositoryPath.split('/');

      return getRepositoryMetadata({ owner, repo });
    }),
  );

  const skillCounts = repositoryMetadataList.map((repositoryMetadata) => {
    return repositoryMetadata.skillCount;
  });
  const updatedTimes = repositoryMetadataList.map((repositoryMetadata) => {
    return new Date(repositoryMetadata.updatedAt).getTime() || 0;
  });
  const minSkillCount = Math.min(...skillCounts);
  const maxSkillCount = Math.max(...skillCounts);
  const minUpdatedTime = Math.min(...updatedTimes);
  const maxUpdatedTime = Math.max(...updatedTimes);

  return repositoryMetadataList
    .map((repositoryMetadata) => {
      const skillScore = normalize(repositoryMetadata.skillCount, minSkillCount, maxSkillCount);
      const recencyScore = normalize(new Date(repositoryMetadata.updatedAt).getTime() || 0, minUpdatedTime, maxUpdatedTime);
      const score = skillScore * SKILL_WEIGHT + recencyScore * RECENCY_WEIGHT;

      return { repositoryMetadata, score };
    })
    .sort((a, b) => {
      return b.score - a.score;
    })
    .map(({ repositoryMetadata }, index) => {
      return { ...repositoryMetadata, rank: index < RANK_COUNT ? index + 1 : null };
    });
};
