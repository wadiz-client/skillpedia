'use client';

import { useEffect, useState } from 'react';

import { ArrowUpIcon } from '@primer/octicons-react';
import { useTranslations } from 'next-intl';

import styles from './ScrollToTopButton.module.scss';

const VISIBLE_SCROLL_Y = 400;

export const ScrollToTopButton = () => {
  const t = useTranslations('Layout.Fab.ScrollToTopButton');
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({ behavior: prefersReducedMotion ? 'auto' : 'smooth', top: 0 });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > VISIBLE_SCROLL_Y);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <button
      aria-label={t('ariaLabel')}
      className={styles.container}
      type="button"
      onClick={handleClick}
    >
      <ArrowUpIcon size={20} />
    </button>
  );
};
