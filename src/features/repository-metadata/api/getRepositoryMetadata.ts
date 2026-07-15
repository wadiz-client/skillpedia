import { getRepositoryOctokit } from '@/shared/api/github';

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

// SKILL.md 파일 여부를 판별합니다. 파일명 앞이 문자열 시작 또는 /인 경우입니다.
const checkIsSkillFile = (path: string) => {
  return /(^|\/)SKILL\.md$/.test(path);
};

/**
 * 저장소 메타데이터 조회
 * @description GitHub 저장소의 스타 수·설명·갱신 시각과 SKILL.md 개수를 조회합니다.
 */
export const getRepositoryMetadata = async ({
  owner,
  repo,
}: GetRepositoryMetadataRequest): Promise<RepositoryMetadata> => {
  const octokit = await getRepositoryOctokit(owner, repo);

  const [repositoryResponse, tree] = await Promise.all([
    octokit.rest.repos.get({ owner, repo }),
    octokit.rest.git.getTree({ owner, recursive: '1', repo, tree_sha: 'HEAD' }),
  ]);

  const skillCount = tree.data.tree.filter((node) => {
    return node.type === 'blob' && checkIsSkillFile(node.path ?? '');
  }).length;

  return {
    description: repositoryResponse.data.description ?? '',
    owner,
    rank: null,
    repo,
    skillCount,
    starCount: repositoryResponse.data.stargazers_count,
    updatedAt: repositoryResponse.data.pushed_at ?? repositoryResponse.data.updated_at ?? '',
  };
};
