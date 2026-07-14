'use client';

import { RepoIcon } from '@primer/octicons-react';
import { Blankslate } from '@primer/react/experimental';
import { Box, Heading, Section, Text } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import type { RepoMetadata } from '@/features/repo-metadata/api';

import { RepoCard } from './RepoCard';

import styles from './RepoSection.module.scss';

interface RepoSectionProps {
  repoMetadataList: RepoMetadata[];
}

export const RepoSection = ({ repoMetadataList }: RepoSectionProps) => {
  const t = useTranslations('HomePage.RepoSection');

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
          {repoMetadataList.length > 0 ? (
            <Text as="span" size="200" variant="muted">
              {t.rich('total', {
                count: repoMetadataList.length,
                strong: (chunks) => {
                  return <strong className={styles.totalCount}>{chunks}</strong>;
                },
              })}
            </Text>
          ) : null}
        </div>

        {repoMetadataList.length > 0 ? (
          <div className={styles.content}>
            {repoMetadataList.map((repoMetadata) => {
              return <RepoCard key={`${repoMetadata.owner}/${repoMetadata.repo}`} repoMetadata={repoMetadata} />;
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
