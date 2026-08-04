import type { RepositoryMetadata } from '@/features/repository-metadata/api';
import { Layout } from '@/widgets/layout/ui';

import { FaqSection, HeroSection, PrivateRepositorySection, RepositorySection } from './_ui';

import styles from './HomePage.module.scss';

interface HomePageProps {
  isMobile: boolean;
  isPublicDomain: boolean;
  repositoryMetadataList: RepositoryMetadata[];
}

export const HomePage = ({ isMobile, isPublicDomain, repositoryMetadataList }: HomePageProps) => {
  return (
    <div className={styles.container}>
      <HeroSection isMobile={isMobile} />
      <RepositorySection
        isMobile={isMobile}
        repositoryMetadataList={repositoryMetadataList}
      />
      <FaqSection />
      {(isPublicDomain || process.env.NODE_ENV === 'development') && <PrivateRepositorySection />}
      <Layout.Footer />
    </div>
  );
};
