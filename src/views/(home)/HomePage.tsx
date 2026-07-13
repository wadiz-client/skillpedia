import { Layout } from '@/widgets/layout/ui';

import type { RepoGroup } from './_lib';
import { HeroSection, PrivateRepoSection, RepoSection } from './_ui';

import styles from './HomePage.module.scss';

interface HomePageProps {
  isMobile: boolean;
  isPublicDomain: boolean;
  repoGroups: RepoGroup[];
}

export const HomePage = ({ isMobile, isPublicDomain, repoGroups }: HomePageProps) => {
  return (
    <div className={styles.container}>
      <HeroSection isMobile={isMobile} />
      <RepoSection repoGroups={repoGroups} />
      {(isPublicDomain || process.env.NODE_ENV === 'development') && <PrivateRepoSection />}
      <Layout.Footer />
    </div>
  );
};
