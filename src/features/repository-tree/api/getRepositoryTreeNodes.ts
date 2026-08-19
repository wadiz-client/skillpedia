import { unstable_cache } from 'next/cache';

import {
  GITHUB_REVALIDATE_SECONDS,
  getRepositoryCacheTag,
  getRepositorySkillPaths,
} from '@/shared/api/github';

export interface RepositoryTreeNode {
  children?: RepositoryTreeNode[];
  href: string;
  name: string;
}

interface GetRepositoryTreeNodesRequest {
  owner: string;
  repo: string;
}

type GetRepositoryTreeNodesResponse = Promise<RepositoryTreeNode[]>;

/**
 * 저장소 SKILL.md 폴더 트리 조회
 *
 * @description
 * GitHub 저장소에서 SKILL.md 파일이 위치한 폴더 경로를 추출해 중첩 트리 구조로 반환합니다.
 * 사이드바 트리는 저장소 단위로만 달라지므로 캐시해 진입마다 트리 조회가 반복되지 않도록 합니다.
 *
 * @example
 * const treeNodes = await getRepositoryTreeNodes({ owner: 'wadiz-client', repo: 'wadiz-claude-plugins' });
 * // [
 * //   {
 * //     href: '/wadiz-client/wadiz-claude-plugins/plugins',
 * //     name: 'plugins',
 * //     children: [
 * //       {
 * //         href: '/wadiz-client/wadiz-claude-plugins/plugins/client',
 * //         name: 'client',
 * //         children: [
 * //           {
 * //             href: '/wadiz-client/wadiz-claude-plugins/plugins/client/skills',
 * //             name: 'skills',
 * //             children: [
 * //               {
 * //                 href: '/wadiz-client/wadiz-claude-plugins/plugins/client/skills/regular-release',
 * //                 name: 'regular-release',
 * //               },
 * //             ],
 * //           },
 * //         ],
 * //       },
 * //     ],
 * //   },
 * // ]
 */
export const getRepositoryTreeNodes = ({
  owner,
  repo,
}: GetRepositoryTreeNodesRequest): GetRepositoryTreeNodesResponse => {
  return unstable_cache(
    async () => {
      try {
        const skillPaths = await getRepositorySkillPaths(owner, repo);

        // SKILL.md 파일이 있는 폴더 경로만 추출합니다.
        const paths = skillPaths
          .map((skillPath) => {
            return skillPath.replace(/\/?SKILL\.md$/, '');
          })
          .sort((a, b) => {
            return a.split('/').length - b.split('/').length || a.localeCompare(b);
          });

        const treeNodes: RepositoryTreeNode[] = [];
        const treeNodeMap = new Map<string, RepositoryTreeNode>();

        for (const path of paths) {
          // SKILL.md 파일이 루트 경로에 있는 경우
          if (path === '') {
            continue;
          }

          const segments = path.split('/');
          const href = `/${owner}/${repo}/${path}`;

          let currentTreeNodes = treeNodes;
          let currentPath = '';

          for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            currentPath = currentPath ? `${currentPath}/${segment}` : segment;
            const isLeaf = i === segments.length - 1;

            const existingTreeNode = treeNodeMap.get(currentPath);

            if (existingTreeNode) {
              if (isLeaf) {
                continue;
              }

              existingTreeNode.children ??= [];
              currentTreeNodes = existingTreeNode.children;
              continue;
            }

            const treeNode: RepositoryTreeNode = {
              href: isLeaf ? href : `/${owner}/${repo}/${currentPath}`,
              name: segment,
            };

            treeNodeMap.set(currentPath, treeNode);
            currentTreeNodes.push(treeNode);

            if (isLeaf) {
              continue;
            }

            treeNode.children = [];
            currentTreeNodes = treeNode.children;
          }
        }

        return treeNodes;
      } catch {
        return [];
      }
    },
    ['repository-tree-nodes', owner, repo],
    { revalidate: GITHUB_REVALIDATE_SECONDS, tags: [getRepositoryCacheTag(owner, repo)] },
  )();
};
