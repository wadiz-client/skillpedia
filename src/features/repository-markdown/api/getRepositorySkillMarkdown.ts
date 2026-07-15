import { getRepositoryOctokit } from '@/shared/api/github';

export interface GetRepositorySkillMarkdownRequest {
  owner: string;
  path: string;
  repo: string;
}

export interface GetRepositorySkillMarkdownResponse {
  content: string;
  path: string;
}

export const getRepositorySkillMarkdown = async ({
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
