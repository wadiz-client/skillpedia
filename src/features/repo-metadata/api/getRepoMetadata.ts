import { getRepoOctokit } from '@/shared/api/github';

export interface RepoMetadata {
  description: string;
  owner: string;
  rank: number | null;
  repo: string;
  skillCount: number;
  starCount: number;
  updatedAt: string;
}

interface GetRepoMetadataRequest {
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
export const getRepoMetadata = async ({
  owner,
  repo,
}: GetRepoMetadataRequest): Promise<RepoMetadata> => {
  const octokit = await getRepoOctokit(owner, repo);

  const [repoResponse, tree] = await Promise.all([
    octokit.rest.repos.get({ owner, repo }),
    octokit.rest.git.getTree({ owner, recursive: '1', repo, tree_sha: 'HEAD' }),
  ]);

  const skillCount = tree.data.tree.filter((node) => {
    return node.type === 'blob' && checkIsSkillFile(node.path ?? '');
  }).length;

  return {
    description: repoResponse.data.description ?? '',
    owner,
    rank: null,
    repo,
    skillCount,
    starCount: repoResponse.data.stargazers_count,
    updatedAt: repoResponse.data.pushed_at ?? repoResponse.data.updated_at ?? '',
  };
};
