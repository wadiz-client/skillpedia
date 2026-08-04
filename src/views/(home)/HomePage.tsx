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
  const topRepositoryMetadata = repositoryMetadataList.find((repositoryMetadata) => {
    return repositoryMetadata.rank === 1;
  });
  const topRepositoryUrl = topRepositoryMetadata
    ? `https://github.com/${topRepositoryMetadata.owner}/${topRepositoryMetadata.repo}`
    : undefined;

  return (
    <div className={styles.container}>
      <HeroSection
        isMobile={isMobile}
        topRepositoryUrl={topRepositoryUrl}
      />
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
