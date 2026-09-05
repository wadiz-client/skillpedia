'use client';

import { use, useEffect, useRef } from 'react';

import { Heading } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import { repositoryTracker } from '@/features/event-tracker/lib';
import type { RepositoryTreeNode } from '@/features/repository-tree/api';
import { TreeNavList } from '@/features/repository-tree/ui';
import { usePathname } from '@/shared/i18n/navigation';
import { scrollToActiveLink } from '@/shared/lib';

import styles from './Sidebar.module.scss';

interface SidebarProps {
  owner: string;
  repo: string;
  treeNodesPromise: Promise<RepositoryTreeNode[]>;
}

const NAV_LANDMARK_LABEL_ID = 'sidebar-nav-label';

export const Sidebar = ({ owner, repo, treeNodesPromise }: SidebarProps) => {
  const t = useTranslations('Layout.Sidebar');
  const treeNodes = use(treeNodesPromise);
  const pathname = usePathname();
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;

    if (inner === null) {
      return;
    }

    scrollToActiveLink(inner);
  }, [pathname]);

  return (
    <aside
      aria-label={t('ariaLabel', { owner, repo })}
      className={styles.container}
    >
      <div
        className={styles.inner}
        ref={innerRef}
      >
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
          owner={owner}
          repo={repo}
          treeNodes={treeNodes}
          onNavigate={(href) => {
            repositoryTracker.trackingSidebarDocumentLinkClick(`${owner}/${repo}`, href);
          }}
        />
      </div>
    </aside>
  );
};
