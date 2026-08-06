'use client';

import { MoonIcon, SunIcon } from '@primer/octicons-react';
import { useTranslations } from 'next-intl';

import { useColorMode } from '@/shared/theme';

import styles from './ThemeToggle.module.scss';

export const ThemeToggle = () => {
  const t = useTranslations('Layout.ThemeToggle');
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <button
      aria-label={t('ariaLabel', { colorMode })}
      className={styles.container}
      type="button"
      onClick={toggleColorMode}
    >
      {colorMode === 'light' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
    </button>
  );
};
