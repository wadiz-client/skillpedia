'use client';

import { useState } from 'react';

import { RepoIcon } from '@primer/octicons-react';
import { Blankslate } from '@primer/react/experimental';
import { AnimationProvider, Box, Button, Heading, Section, Statistic, Text } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import type { RepositoryMetadata } from '@/features/repository-metadata/api';
import { ClaudeCodeToken } from '@/shared/ui';

import { RepositoryCard } from './RepositoryCard';
import { SpotlightCanvas } from './SpotlightCanvas';

import styles from './RepositorySection.module.scss';

const MOBILE_REPOSITORY_COUNT = 10;

interface RepositorySectionProps {
  isMobile: boolean;
  repositoryMetadataList: RepositoryMetadata[];
}

export const RepositorySection = ({ isMobile, repositoryMetadataList }: RepositorySectionProps) => {
  const t = useTranslations('HomePage.RepositorySection');
  const [isExpanded, setIsExpanded] = useState(false);
  const totalSkillCount = repositoryMetadataList.reduce((sum, repositoryMetadata) => {
    return sum + repositoryMetadata.skillCount;
  }, 0);
  const isCollapsed = isMobile && !isExpanded;
  const visibleRepositoryMetadataList = isCollapsed
    ? repositoryMetadataList.slice(0, MOBILE_REPOSITORY_COUNT)
    : repositoryMetadataList;

  const handleMoreButtonClick = () => {
    setIsExpanded(true);
  };

  return (
    <Section
      as="section"
      className={styles.container}
      paddingBlockEnd="spacious"
      paddingBlockStart="spacious"
    >
      <Box
        paddingInlineEnd={40}
        paddingInlineStart={40}
      >
        <div className={styles.header}>
          <div>
            <Heading
              as="h2"
              size="3"
              weight="bold"
            >
              {t('title')}
            </Heading>
            <Text
              as="p"
              className={styles.description}
              size="200"
              variant="muted"
            >
              {t.rich('description', {
                claudeCode: (chunks) => {
                  return (
                    <ClaudeCodeToken
                      size="medium"
                      text={chunks}
                    />
                  );
                },
                code: (chunks) => {
                  return <code>{chunks}</code>;
                },
              })}
            </Text>
          </div>
          {repositoryMetadataList.length > 0 ? (
            <div className={styles.meta}>
              <Statistic size="medium">
                <Statistic.Heading
                  align="start"
                  weight="semibold"
                >
                  {repositoryMetadataList.length}
                </Statistic.Heading>
                <Statistic.Description size="100">{t('totalCount')}</Statistic.Description>
              </Statistic>
              <span
                aria-hidden
                className={styles.divider}
              />
              <Statistic size="medium">
                <Statistic.Heading
                  align="start"
                  weight="semibold"
                >
                  {totalSkillCount}
                </Statistic.Heading>
                <Statistic.Description size="100">{t('totalSkillCount')}</Statistic.Description>
              </Statistic>
            </div>
          ) : null}
        </div>

        {repositoryMetadataList.length > 0 ? (
          <div className={styles.inner}>
            {isMobile ? null : <SpotlightCanvas />}
            <AnimationProvider
              animationTrigger="on-visible"
              autoStaggerChildren={false}
              runOnce
              visibilityOptions={15}
            >
              <div className={styles.content}>
                {visibleRepositoryMetadataList.map((repositoryMetadata, index) => {
                  return (
                    <RepositoryCard
                      index={index}
                      isAnimationEnabled={!isMobile || index < MOBILE_REPOSITORY_COUNT}
                      key={`${repositoryMetadata.owner}/${repositoryMetadata.repo}`}
                      repositoryMetadata={repositoryMetadata}
                    />
                  );
                })}
              </div>
            </AnimationProvider>
            {isCollapsed && repositoryMetadataList.length > MOBILE_REPOSITORY_COUNT ? (
              <div className={styles.footer}>
                <Button
                  block
                  variant="secondary"
                  onClick={handleMoreButtonClick}
                >
                  {t('more')}
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <Blankslate
            narrow
            spacious
          >
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
