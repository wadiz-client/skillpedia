'use client';

import { useEffect, useRef } from 'react';

import { SparkleFillIcon } from '@primer/octicons-react';
import { ProgressBar } from '@primer/react';
import { Text } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import { usePathname } from '@/shared/i18n/navigation';

import { PROGRESS_STEP_NAMES } from './ProgressStepStore';
import { useCurrentProgressStepName } from './useCurrentProgressStepName';

import styles from './ProgressPanel.module.scss';

const PROGRESS_CAP = 0.99;

// Next.js가 loading.tsx 폴백을 페이지 폴백으로 교체하며 ProgressPanel을 다시 마운트하는 경우 진행값이 되돌아가지 않도록 경로별로 기억합니다.
const lastProgressMap = new Map<string, number>();

const getRenderedProgress = (element: HTMLElement): number => {
  const { transform } = getComputedStyle(element);

  if (transform === 'none') {
    return 0;
  }

  return new DOMMatrixReadOnly(transform).a;
};

export const ProgressPanel = () => {
  const t = useTranslations('OwnerRepoSlugLoadingPage.ProgressPanel');
  const pathname = usePathname();

  const [owner, repo, ...slug] = pathname.split('/').filter(Boolean);
  const path = slug.map(decodeURIComponent).join('/');
  const currentStepName = useCurrentProgressStepName({ owner, path, repo });
  const currentStepIndex = PROGRESS_STEP_NAMES.indexOf(currentStepName);
  const ceiling = Math.min((currentStepIndex + 1) / PROGRESS_STEP_NAMES.length, PROGRESS_CAP);

  const progressBarItemRef = useRef<HTMLSpanElement>(null);

  // 진행 바를 CSS 전환으로 움직여, 메인 스레드가 렌더링으로 바쁜 동안에도 끊기지 않도록 합니다.
  useEffect(() => {
    const progressBarItem = progressBarItemRef.current;

    if (!progressBarItem) {
      return;
    }

    const renderedProgress = Math.max(getRenderedProgress(progressBarItem), lastProgressMap.get(pathname) ?? 0);

    // 현재 위치에서 전환 없이 시작한 뒤 상한으로 전환합니다.
    progressBarItem.style.transition = 'none';
    progressBarItem.style.transform = `scaleX(${renderedProgress})`;
    progressBarItem.getBoundingClientRect();
    progressBarItem.style.transition = '';
    progressBarItem.style.transform = `scaleX(${ceiling})`;

    return () => {
      lastProgressMap.set(pathname, getRenderedProgress(progressBarItem));
    };
  }, [ceiling, pathname]);

  return (
    <main className={styles.container}>
      <div className={styles.top}>
        <p className={styles.caption}>
          <SparkleFillIcon />

          <span>
            {owner}/<strong>{repo}</strong>
          </span>
        </p>
      </div>

      <div className={styles.bottom}>
        <ProgressBar
          aria-hidden
          barSize="large"
          className={styles.progressBar}
        >
          <ProgressBar.Item
            className={styles.progressBarItem}
            data-animated
            progress={100}
            ref={progressBarItemRef}
          />
        </ProgressBar>

        <Text
          as="p"
          className={styles.step}
          size="200"
          variant="muted"
        >
          {t(`steps.${currentStepName}`)}
        </Text>
      </div>
    </main>
  );
};
