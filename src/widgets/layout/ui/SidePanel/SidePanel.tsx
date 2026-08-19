'use client';

import { use, useEffect, useRef, useState } from 'react';

import { ThreeBarsIcon, XIcon } from '@primer/octicons-react';
import { Dialog, IconButton } from '@primer/react';
import type { DialogHeaderProps } from '@primer/react';
import { Heading } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import type { RepositoryTreeNode } from '@/features/repository-tree/api';
import { TreeNavList } from '@/features/repository-tree/ui';
import { scrollToActiveLink } from '@/shared/lib';

import { ThemeToggle } from '../ThemeToggle';

import styles from './SidePanel.module.scss';

interface SidePanelProps {
  owner: string;
  repo: string;
  treeNodesPromise: Promise<RepositoryTreeNode[]>;
}

export const SidePanel = ({ owner, repo, treeNodesPromise }: SidePanelProps) => {
  const t = useTranslations('Layout.SidePanel');
  const treeNodes = use(treeNodesPromise);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const handleTriggerClick = () => {
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
  }, [isOpen]);

  if (treeNodes.length === 0) {
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
          position="right"
          renderHeader={renderHeader}
          returnFocusRef={triggerRef}
          width="medium"
          onClose={handleClose}
        >
          <div ref={navRef}>
            <TreeNavList
              ariaLabel={t('nav.ariaLabel', { owner, repo })}
              treeNodes={treeNodes}
              onNavigate={handleClose}
            />
          </div>
        </Dialog>
      )}
    </div>
  );
};
