'use client';

import { use, useRef, useState } from 'react';

import { ThreeBarsIcon, XIcon } from '@primer/octicons-react';
import { Dialog, IconButton } from '@primer/react';
import type { DialogHeaderProps } from '@primer/react';
import { Heading } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import type { RepositoryTreeNode } from '@/features/repository-tree/api';
import { TreeNavList } from '@/features/repository-tree/ui';

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
          <TreeNavList
            ariaLabel={t('nav.ariaLabel', { owner, repo })}
            treeNodes={treeNodes}
            onNavigate={handleClose}
          />
        </Dialog>
      )}
    </div>
  );
};
