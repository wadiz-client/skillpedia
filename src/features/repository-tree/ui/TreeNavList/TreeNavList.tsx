'use client';

import type { ReactNode } from 'react';

import { NavList } from '@primer/react';
import { Text } from '@primer/react-brand';

import { Link, usePathname } from '@/shared/i18n/navigation';
import { normalizeTitle } from '@/shared/lib';

import type { RepositoryTreeNode } from '../../api';

import styles from './TreeNavList.module.scss';

interface TreeNavListProps {
  treeNodes: RepositoryTreeNode[];
  ariaLabel?: string;
  ariaLabelledBy?: string;
  onNavigate?: () => void;
}

/**
 * 하위 폴더가 하나만 이어지는 구간을 한 항목으로 합치는 함수
 *
 * @description
 * 자식이 하나뿐이고 그 자식도 폴더인 동안 따라 내려가며, 합친 경로를 라벨로 만들고 문서 항목을 담은 끝 폴더를 반환합니다.
 * 의미 없는 중첩을 줄여 목록 깊이를 얕게 유지합니다.
 *
 * @example
 * // plugins > client > skills 아래에 문서가 있는 구조
 * collapseSingleChildFolders(pluginsNode);
 * // { folder: skillsNode, label: 'plugins/client/skills' }
 */
const collapseSingleChildFolders = (node: RepositoryTreeNode): { folder: RepositoryTreeNode; label: string } => {
  const names = [node.name];
  let folder = node;

  while (folder.children && folder.children.length === 1 && (folder.children[0].children?.length ?? 0) > 0) {
    folder = folder.children[0];
    names.push(folder.name);
  }

  return { folder, label: names.join('/') };
};

export const TreeNavList = ({ treeNodes, ariaLabel, ariaLabelledBy, onNavigate }: TreeNavListProps) => {
  const pathname = usePathname();

  // 트리 노드를 유형에 따라 렌더링합니다.
  //
  // - 루트 폴더: NavList.Group + GroupHeading
  // - 중간 폴더: NavList.Item + SubNav
  // - 리프 노드: NavList.Item
  const renderNavNode = (node: RepositoryTreeNode, isRoot: boolean): ReactNode => {
    const hasChildren = (node.children?.length ?? 0) > 0;

    if (hasChildren) {
      const { folder, label } = collapseSingleChildFolders(node);
      const children = folder.children?.map((child) => {
        return renderNavNode(child, false);
      });

      if (isRoot) {
        return (
          <NavList.Group key={node.href}>
            <NavList.GroupHeading>{label}</NavList.GroupHeading>

            {children}
          </NavList.Group>
        );
      }

      return (
        <NavList.Item
          defaultOpen
          key={node.href}
        >
          <Text variant="muted">{label}</Text>

          <NavList.SubNav>{children}</NavList.SubNav>
        </NavList.Item>
      );
    }

    return (
      <NavList.Item
        aria-current={pathname === node.href ? 'page' : undefined}
        as={Link}
        href={node.href}
        key={node.href}
        onClick={onNavigate}
      >
        <Text>{normalizeTitle(undefined, node.name)}</Text>
      </NavList.Item>
    );
  };

  return (
    <NavList
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={styles.container}
    >
      {treeNodes.map((node) => {
        return renderNavNode(node, true);
      })}
    </NavList>
  );
};
