import { getRepositoryOctokit } from '@/shared/api/github';

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
 * GitHub 저장소에서 SKILL.md 파일이 위치한 폴더 경로를 추출해 중첩 트리 구조로 반환합니다.
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
export const getRepositoryTreeNodes = async ({
  owner,
  repo,
}: GetRepositoryTreeNodesRequest): GetRepositoryTreeNodesResponse => {
  try {
    const octokit = await getRepositoryOctokit(owner, repo);

    const { data } = await octokit.rest.git.getTree({
      owner,
      recursive: '1',
      repo,
      tree_sha: 'HEAD',
    });

    // SKILL.md 파일이 있는 폴더 경로만 추출합니다.
    const paths = data.tree
      // node.type (blob: 파일, commit: 서브모듈 참조, tree: 폴더)
      .filter((node) => {
        // SKILL.md 앞이 문자열 시작 또는 /인 경우
        return node.type === 'blob' && /(^|\/)SKILL\.md$/.test(node.path ?? '');
      })
      .map((node) => {
        return node.path!.replace(/\/?SKILL\.md$/, '');
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
};
