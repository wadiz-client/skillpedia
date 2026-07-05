'use client';

import type { ReactNode } from 'react';

import { NavList } from '@primer/react';
import { Heading, Text } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import type { RepoTreeNode } from '@/features/repo-tree';
import { Link, usePathname } from '@/shared/i18n/navigation';

import { normalizeTitle } from '../../_lib';

import styles from './Sidebar.module.scss';

interface SidebarProps {
  owner: string;
  repo: string;
  treeNodes: RepoTreeNode[];
}

const NAV_LANDMARK_LABEL_ID = 'sidebar-nav-label';

// 자식이 하나뿐인 폴더를 따라 내려가며 합칩니다. 합쳐진 경로 라벨과 끝 폴더를 반환합니다.
const collapseSingleChildFolders = (
  node: RepoTreeNode,
): { folder: RepoTreeNode; label: string } => {
  const names = [node.name];
  let folder = node;

  while (
    folder.children &&
    folder.children.length === 1 &&
    (folder.children[0].children?.length ?? 0) > 0
  ) {
    folder = folder.children[0];
    names.push(folder.name);
  }

  return { folder, label: names.join('/') };
};

// 트리 노드를 유형에 따라 렌더링합니다.
//
// - 루트 폴더: NavList.Group + GroupHeading
// - 중간 폴더: NavList.Item + SubNav
// - 리프 노드: NavList.Item
const renderNavNode = (node: RepoTreeNode, pathname: string, isRoot: boolean): ReactNode => {
  const hasChildren = (node.children?.length ?? 0) > 0;

  if (hasChildren) {
    const { folder, label } = collapseSingleChildFolders(node);
    const children = folder.children?.map((child) => {
      return renderNavNode(child, pathname, false);
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
      <NavList.Item defaultOpen key={node.href}>
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
    >
      <Text>{normalizeTitle(undefined, node.name)}</Text>
    </NavList.Item>
  );
};

export const Sidebar = ({ owner, repo, treeNodes }: SidebarProps) => {
  const t = useTranslations('OwnerRepoSlugPage.Sidebar');
  const pathname = usePathname();

  return (
    <aside aria-label={t('ariaLabel', { owner, repo })} className={styles.container}>
      <div className={styles.inner}>
        <Heading as="h2" className={styles.title} id={NAV_LANDMARK_LABEL_ID} size="subhead-large">
          {owner}/{repo}
        </Heading>

        <NavList aria-labelledby={NAV_LANDMARK_LABEL_ID} className={styles.NavList}>
          {treeNodes.map((node) => {
            return renderNavNode(node, pathname, true);
          })}
        </NavList>
      </div>
    </aside>
  );
};
