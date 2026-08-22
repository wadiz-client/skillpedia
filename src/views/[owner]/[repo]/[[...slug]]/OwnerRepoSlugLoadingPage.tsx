import { useTranslations } from 'next-intl';

import { ProgressPanel, ScrollRestoration } from './_ui';

import styles from './OwnerRepoSlugLoadingPage.module.scss';

export const OwnerRepoSlugLoadingPage = () => {
  const t = useTranslations('OwnerRepoSlugLoadingPage');

  return (
    <div
      aria-busy="true"
      aria-label={t('ariaLabel')}
      className={styles.container}
      role="status"
    >
      <ScrollRestoration />
      <ProgressPanel />
    </div>
  );
};
