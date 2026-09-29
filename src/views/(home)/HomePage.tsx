import type { RepositoryMetadata } from '@/features/repository-metadata/api';
import { Layout } from '@/widgets/layout/ui';

import { FaqSection, HeroSection, PrivateRepositorySection, RepositorySection } from './_ui';

import styles from './HomePage.module.scss';

interface HomePageProps {
  repositoryMetadataList: RepositoryMetadata[];
}

export const HomePage = ({ repositoryMetadataList }: HomePageProps) => {
  const topRepositoryMetadata = repositoryMetadataList.find((repositoryMetadata) => {
    return repositoryMetadata.rank === 1;
  });
  const topRepositoryUrl = topRepositoryMetadata
    ? `https://github.com/${topRepositoryMetadata.owner}/${topRepositoryMetadata.repo}`
    : undefined;

  return (
    <div className={styles.container}>
      <HeroSection topRepositoryUrl={topRepositoryUrl} />
      <RepositorySection repositoryMetadataList={repositoryMetadataList} />
      <FaqSection />
      <PrivateRepositorySection />
      <Layout.Footer />
    </div>
  );
};
