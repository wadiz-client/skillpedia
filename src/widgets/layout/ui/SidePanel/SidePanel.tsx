'use client';

import { use, useEffect, useRef, useState } from 'react';

import { ThreeBarsIcon, XIcon } from '@primer/octicons-react';
import { Dialog, IconButton, UnderlineNav } from '@primer/react';
import type { DialogHeaderProps } from '@primer/react';
import { Heading } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import { Toc, useTocHeadings } from '@/features/repository-markdown/ui';
import type { RepositoryTreeNode } from '@/features/repository-tree/api';
import { TreeNavList } from '@/features/repository-tree/ui';
import { scrollToActiveLink, useMediaQuery } from '@/shared/lib';

import { ThemeToggle } from '../ThemeToggle';

import styles from './SidePanel.module.scss';

type PanelTab = 'toc' | 'documents';

// Sidebar를 노출하는 최소 너비입니다. $breakpoint-large와 같습니다.
const SIDEBAR_VISIBLE_QUERY = '(min-width: 63.25rem)';

interface SidePanelProps {
  owner: string;
  repo: string;
  treeNodesPromise: Promise<RepositoryTreeNode[]>;
}

export const SidePanel = ({ owner, repo, treeNodesPromise }: SidePanelProps) => {
  const t = useTranslations('Layout.SidePanel');
  const treeNodes = use(treeNodesPromise);
  const headings = useTocHeadings();

  // Sidebar를 노출하면 문서 목록은 그쪽에 있으므로 SidePanel은 목차만, 노출하지 않으면 탭으로 둘 다 담습니다.
  const isSidebarVisible = useMediaQuery(SIDEBAR_VISIBLE_QUERY);

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PanelTab>('toc');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const isDocumentVisible = !isSidebarVisible && activeTab === 'documents';

  const handleTriggerClick = () => {
    // 탭을 노출할 때만 열 때마다 목차·문서 목록 기본 탭을 정합니다.
    if (!isOpen && !isSidebarVisible) {
      setActiveTab(headings.length > 0 ? 'toc' : 'documents');
    }

    setIsOpen((prevIsOpen) => {
      return !prevIsOpen;
    });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const renderHeader = ({ dialogLabelId }: DialogHeaderProps) => {
    return (
      <Dialog.Header>
        <Heading
          as="h2"
          id={dialogLabelId}
          size="subhead-large"
        >
          {owner}/{repo}
        </Heading>

        <div className={styles.actions}>
          <ThemeToggle />

          <button
            aria-label={t('close.ariaLabel')}
            className={styles.close}
            type="button"
            onClick={handleClose}
          >
            <XIcon size={20} />
          </button>
        </div>
      </Dialog.Header>
    );
  };

  const renderFooter = () => {
    return (
      <Dialog.Footer>
        <UnderlineNav
          aria-label={t('tabs.ariaLabel')}
          className={styles.tabs}
        >
          <UnderlineNav.Item
            aria-current={activeTab === 'toc' ? 'page' : undefined}
            onSelect={(event) => {
              event.preventDefault();
              setActiveTab('toc');
            }}
          >
            {t('tabs.toc')}
          </UnderlineNav.Item>

          <UnderlineNav.Item
            aria-current={activeTab === 'documents' ? 'page' : undefined}
            onSelect={(event) => {
              event.preventDefault();
              setActiveTab('documents');
            }}
          >
            {t('tabs.documents')}
          </UnderlineNav.Item>
        </UnderlineNav>
      </Dialog.Footer>
    );
  };

  useEffect(() => {
    const navElement = navRef.current;

    if (navElement === null) {
      return;
    }

    // Dialog가 스크롤 영역 높이를 확정한 다음 프레임에 위치를 옮깁니다.
    const animationFrameId = requestAnimationFrame(() => {
      scrollToActiveLink(navElement);
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, isDocumentVisible]);

  // 문서 목록이 없거나, Sidebar를 노출하는데 목차도 없으면 SidePanel에 담을 내용이 없습니다.
  if (treeNodes.length === 0 || (isSidebarVisible && headings.length === 0)) {
    return null;
  }

  return (
    <div className={styles.container}>
      <IconButton
        aria-expanded={isOpen}
        aria-label={t('trigger.ariaLabel', { owner, repo, state: isOpen ? 'open' : 'closed' })}
        icon={isOpen ? XIcon : ThreeBarsIcon}
        ref={triggerRef}
        variant="invisible"
        onClick={handleTriggerClick}
      />

      {isOpen && (
        <Dialog
          className={styles.dialog}
          position={{ narrow: 'fullscreen', regular: 'right' }}
          renderFooter={isSidebarVisible ? undefined : renderFooter}
          renderHeader={renderHeader}
          returnFocusRef={triggerRef}
          width="medium"
          onClose={handleClose}
        >
          {isDocumentVisible ? (
            <div ref={navRef}>
              <TreeNavList
                ariaLabel={t('nav.ariaLabel', { owner, repo })}
                owner={owner}
                repo={repo}
                treeNodes={treeNodes}
                onNavigate={handleClose}
              />
            </div>
          ) : (
            <Toc
              headings={headings}
              onNavigate={handleClose}
            />
          )}
        </Dialog>
      )}
    </div>
  );
};
