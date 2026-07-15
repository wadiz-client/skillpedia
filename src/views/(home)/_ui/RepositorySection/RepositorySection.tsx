'use client';

import { RepoIcon } from '@primer/octicons-react';
import { Blankslate } from '@primer/react/experimental';
import { Box, Heading, Section, Text } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import type { RepositoryMetadata } from '@/features/repository-metadata/api';

import { RepositoryCard } from './RepositoryCard';

import styles from './RepositorySection.module.scss';

interface RepositorySectionProps {
  repositoryMetadataList: RepositoryMetadata[];
}

export const RepositorySection = ({ repositoryMetadataList }: RepositorySectionProps) => {
  const t = useTranslations('HomePage.RepositorySection');

  return (
    <Section
      as="section"
      className={styles.container}
      paddingBlockEnd="spacious"
      paddingBlockStart="spacious"
    >
      <Box paddingInlineEnd={40} paddingInlineStart={40}>
        <div className={styles.header}>
          <Heading as="h2" size="5" weight="bold">
            {t('title')}
          </Heading>
          {repositoryMetadataList.length > 0 ? (
            <Text as="span" size="200" variant="muted">
              {t.rich('total', {
                count: repositoryMetadataList.length,
                strong: (chunks) => {
                  return <strong className={styles.totalCount}>{chunks}</strong>;
                },
              })}
            </Text>
          ) : null}
        </div>

        {repositoryMetadataList.length > 0 ? (
          <div className={styles.content}>
            {repositoryMetadataList.map((repositoryMetadata) => {
              return <RepositoryCard key={`${repositoryMetadata.owner}/${repositoryMetadata.repo}`} repositoryMetadata={repositoryMetadata} />;
            })}
          </div>
        ) : (
          <Blankslate narrow spacious>
            <Blankslate.Visual>
              <RepoIcon size={48} />
            </Blankslate.Visual>
            <Blankslate.Heading as="h3">{t('Empty.title')}</Blankslate.Heading>
            <Blankslate.Description>
              {t.rich('Empty.description', {
                code: (chunks) => {
                  return <code>{chunks}</code>;
                },
              })}
            </Blankslate.Description>
          </Blankslate>
        )}
      </Box>
    </Section>
  );
};
