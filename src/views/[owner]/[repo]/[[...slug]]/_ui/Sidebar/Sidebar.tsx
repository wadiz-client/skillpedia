'use client';

import { Heading } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import type { RepositoryTreeNode } from '@/features/repository-tree/api';
import { TreeNavList } from '@/features/repository-tree/ui';

import styles from './Sidebar.module.scss';

interface SidebarProps {
  owner: string;
  repo: string;
  treeNodes: RepositoryTreeNode[];
}

const NAV_LANDMARK_LABEL_ID = 'sidebar-nav-label';

export const Sidebar = ({ owner, repo, treeNodes }: SidebarProps) => {
  const t = useTranslations('OwnerRepoSlugPage.Sidebar');

  return (
    <aside
      aria-label={t('ariaLabel', { owner, repo })}
      className={styles.container}
    >
      <div className={styles.inner}>
        <Heading
          as="h2"
          className={styles.title}
          id={NAV_LANDMARK_LABEL_ID}
          size="subhead-large"
        >
          {owner}/{repo}
        </Heading>

        <TreeNavList
          ariaLabelledBy={NAV_LANDMARK_LABEL_ID}
          treeNodes={treeNodes}
        />
      </div>
    </aside>
  );
};
