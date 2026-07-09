'use client';

import { useEffect, useState } from 'react';

import { SparkleFillIcon } from '@primer/octicons-react';
import { ProgressBar } from '@primer/react';
import { Statistic, Text } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import { usePathname } from '@/shared/i18n/navigation';

import styles from './ProgressPanel.module.scss';

// 진행값 상한과 이징 계수입니다. 상한에 가까울수록 증가폭이 줄어듭니다.
const PROGRESS_CAP = 0.99;
const EASE_FACTOR = 0.02;
const TICK_INTERVAL = 100;

// 진행 구간에 따라 상태 문구 키를 선택합니다.
const getStageKey = (progress: number): 'fetching' | 'analyzing' | 'preparing' => {
  if (progress < 0.4) {
    return 'fetching';
  }

  if (progress < 0.75) {
    return 'analyzing';
  }

  return 'preparing';
};

export const ProgressPanel = () => {
  const t = useTranslations('OwnerRepoSlugLoadingPage.ProgressPanel');
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  const [owner, repo] = pathname.split('/').filter(Boolean);
  const percent = Math.round(progress * 100);
  const stageKey = getStageKey(progress);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setProgress(PROGRESS_CAP);

      return;
    }

    const timer = setInterval(() => {
      setProgress((previous) => {
        return previous + (PROGRESS_CAP - previous) * EASE_FACTOR;
      });
    }, TICK_INTERVAL);

    return () => {
      return clearInterval(timer);
    };
  }, []);

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

      <div className={styles.middle}>
        <Statistic>
          <Statistic.Heading className={styles.percent}>
            {percent}
            <span className={styles.percentUnit}>%</span>
          </Statistic.Heading>
        </Statistic>
      </div>

      <div className={styles.bottom}>
        <Text as="p" className={styles.stage} size="200" variant="muted">
          {t(`stages.${stageKey}`)}
        </Text>

        <ProgressBar aria-hidden className={styles.progressBar} progress={percent} />
      </div>
    </main>
  );
};
