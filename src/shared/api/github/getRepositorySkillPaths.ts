import { unstable_cache } from 'next/cache';

import { GITHUB_REVALIDATE_SECONDS, getRepositoryCacheTag } from './cache';
import { getRepositoryOctokit } from './github-app';

// SKILL.md 파일 여부를 판별합니다. 파일명 앞이 문자열 시작 또는 /인 경우입니다.
const checkIsSkillFile = (path: string) => {
  return /(^|\/)SKILL\.md$/.test(path);
};

const fetchRepositorySkillPaths = async (owner: string, repo: string): Promise<string[]> => {
  const octokit = await getRepositoryOctokit(owner, repo);

  const { data } = await octokit.rest.git.getTree({
    owner,
    recursive: '1',
    repo,
    tree_sha: 'HEAD',
  });

  return data.tree
    // node.type (blob: 파일, commit: 서브모듈 참조, tree: 폴더)
    .filter((node) => {
      return node.type === 'blob' && checkIsSkillFile(node.path ?? '');
    })
    .map((node) => {
      return node.path!;
    });
};

/**
 * 저장소의 SKILL.md 경로 목록 조회
 *
 * @description
 * 재귀 트리 응답은 저장소에 따라 수 MB에 달하므로, 필요한 SKILL.md 경로만 추려 캐시합니다.
 * 저장소 메타데이터와 사이드바 트리가 같은 결과를 공유해 트리 조회를 한 번으로 줄입니다.
 */
export const getRepositorySkillPaths = (owner: string, repo: string): Promise<string[]> => {
  return unstable_cache(
    () => {
      return fetchRepositorySkillPaths(owner, repo);
    },
    ['repository-skill-paths', owner, repo],
    { revalidate: GITHUB_REVALIDATE_SECONDS, tags: [getRepositoryCacheTag(owner, repo)] },
  )();
};
