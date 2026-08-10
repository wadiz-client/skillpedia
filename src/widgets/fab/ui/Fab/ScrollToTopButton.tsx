'use client';

import { useEffect, useRef, useState } from 'react';

import { ArrowUpIcon } from '@primer/octicons-react';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import styles from './ScrollToTopButton.module.scss';

const VISIBLE_SCROLL_Y = 400;

// 방향을 판정하는 최소 이동량
const MIN_SCROLL_DELTA = 4;

export const ScrollToTopButton = () => {
  const t = useTranslations('Layout.Fab.ScrollToTopButton');
  const [isVisible, setIsVisible] = useState(false);
  const previousScrollYRef = useRef(0);

  const handleClick = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({ behavior: prefersReducedMotion ? 'auto' : 'smooth', top: 0 });
  };

  useEffect(() => {
    previousScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - previousScrollYRef.current;

      if (Math.abs(delta) < MIN_SCROLL_DELTA) {
        return;
      }

      previousScrollYRef.current = scrollY;
      setIsVisible(delta > 0 && scrollY > VISIBLE_SCROLL_Y);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      aria-label={t('ariaLabel')}
      className={classNames(styles.container, isVisible ? styles.isVisible : undefined)}
      type="button"
      onClick={handleClick}
    >
      <ArrowUpIcon size={24} />
    </button>
  );
};
