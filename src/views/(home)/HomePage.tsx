import type { RepoMetadata } from '@/features/repo-metadata/api';
import { Layout } from '@/widgets/layout/ui';

import { HeroSection, PrivateRepoSection, RepoSection } from './_ui';

import styles from './HomePage.module.scss';

interface HomePageProps {
  isMobile: boolean;
  isPublicDomain: boolean;
  repoMetadataList: RepoMetadata[];
}

export const HomePage = ({ isMobile, isPublicDomain, repoMetadataList }: HomePageProps) => {
  return (
    <div className={styles.container}>
      <HeroSection isMobile={isMobile} />
      <RepoSection repoMetadataList={repoMetadataList} />
      {(isPublicDomain || process.env.NODE_ENV === 'development') && <PrivateRepoSection />}
      <Layout.Footer />
    </div>
  );
};
