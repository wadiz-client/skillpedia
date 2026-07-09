import { useTranslations } from 'next-intl';

import { ProgressPanel } from './_ui/ProgressPanel';
import { SidebarSkeleton } from './_ui/SidebarSkeleton';

import styles from './OwnerRepoSlugLoadingPage.module.scss';

export const OwnerRepoSlugLoadingPage = () => {
  const t = useTranslations('OwnerRepoSlugLoadingPage');

  return (
    <div aria-busy="true" aria-label={t('ariaLabel')} className={styles.container} role="status">
      <SidebarSkeleton />
      <ProgressPanel />
    </div>
  );
};
