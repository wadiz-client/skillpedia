import { unstable_cache } from 'next/cache';

import {
  GITHUB_REVALIDATE_SECONDS,
  getRepositoryCacheTag,
  getRepositoryOctokit,
} from '@/shared/api/github';

export interface GetRepositorySkillMarkdownRequest {
  owner: string;
  path: string;
  repo: string;
}

export interface GetRepositorySkillMarkdownResponse {
  content: string;
  path: string;
}

const fetchRepositorySkillMarkdown = async ({
  owner,
  path,
  repo,
}: GetRepositorySkillMarkdownRequest): Promise<GetRepositorySkillMarkdownResponse | null> => {
  const octokit = await getRepositoryOctokit(owner, repo);
  const filePath = path ? `${path}/SKILL.md` : 'SKILL.md';

  try {
    const { data } = await octokit.rest.repos.getContent({ owner, path: filePath, repo });

    if ('content' in data && typeof data.content === 'string') {
      return {
        // GitHub API가 base64로 반환하므로 UTF-8로 디코딩합니다.
        content: Buffer.from(data.content, 'base64').toString('utf8'),
        path: filePath,
      };
    }

    return null;
  } catch {
    return null;
  }
};

// SKILL.md는 경로 단위로만 달라지므로 캐시해 진입마다 조회가 반복되지 않도록 합니다.
export const getRepositorySkillMarkdown = ({
  owner,
  path,
  repo,
}: GetRepositorySkillMarkdownRequest): Promise<GetRepositorySkillMarkdownResponse | null> => {
  return unstable_cache(
    () => {
      return fetchRepositorySkillMarkdown({ owner, path, repo });
    },
    ['repository-skill-markdown', owner, repo, path],
    { revalidate: GITHUB_REVALIDATE_SECONDS, tags: [getRepositoryCacheTag(owner, repo)] },
  )();
};
