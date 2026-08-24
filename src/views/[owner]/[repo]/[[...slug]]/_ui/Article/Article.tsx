'use client';

import { Suspense, use, useEffect, useMemo, useState } from 'react';

import { UnderlineNav } from '@primer/react';
import { Breadcrumbs, Heading, Stack, Text } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import { Toc, TocStore } from '@/features/repository-markdown/ui';
import type { RepositoryFileMetadata } from '@/features/repository-metadata/api';

import type { ArticleContent, Breadcrumb } from '../../_lib';
import { ArticleMetadata } from '../ArticleMetadata';
import { Prose } from '../Prose';

import styles from './Article.module.scss';

export interface ArticleTab {
  content: ArticleContent;
  filePath: string;
  label: 'README' | 'SKILL';
  metadataPromise?: Promise<RepositoryFileMetadata | null> | null;
}

interface ArticleMetadataBoundaryProps {
  metadataPromise: Promise<RepositoryFileMetadata | null>;
}

const ArticleMetadataBoundary = ({ metadataPromise }: ArticleMetadataBoundaryProps) => {
  const metadata = use(metadataPromise);

  if (metadata === null) {
    return null;
  }

  return <ArticleMetadata metadata={metadata} />;
};

interface ArticleProps {
  breadcrumbs: Breadcrumb[];
  owner: string;
  repo: string;
  tabs: ArticleTab[];
  title: string;
  description?: string;
}

export const Article = ({ breadcrumbs, owner, repo, tabs, title, description }: ArticleProps) => {
  const t = useTranslations('OwnerRepoSlugPage.Article');
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = tabs[activeIndex] ?? tabs[0];

  // 목차에는 h2, h3만 노출합니다.
  const tocHeadings = useMemo(() => {
    return (activeTab?.content.headings ?? []).filter((heading) => {
      return heading.depth === 2 || heading.depth === 3;
    });
  }, [activeTab]);

  useEffect(() => {
    TocStore.setHeadings(tocHeadings);

    return () => {
      TocStore.setHeadings([]);
    };
  }, [tocHeadings]);

  return (
    <main className={styles.container}>
      <Stack gap="spacious">
        {breadcrumbs.length > 0 && (
          <Breadcrumbs variant="accent">
            {breadcrumbs.map((breadcrumb, index) => {
              return (
                <Breadcrumbs.Item
                  href={breadcrumb.href}
                  key={breadcrumb.href}
                  selected={index === breadcrumbs.length - 1}
                >
                  {breadcrumb.label}
                </Breadcrumbs.Item>
              );
            })}
          </Breadcrumbs>
        )}

        <Stack
          gap="spacious"
          padding="none"
        >
          <Stack
            gap="normal"
            padding="none"
          >
            <Heading
              as="h1"
              size="2"
              weight="bold"
            >
              {title}
            </Heading>

            {description && (
              <Text
                as="p"
                className={styles.description}
                size="300"
                variant="muted"
              >
                {description}
              </Text>
            )}

            {activeTab?.metadataPromise && (
              <Suspense fallback={<div className={styles.metadataFallback} />}>
                <ArticleMetadataBoundary metadataPromise={activeTab.metadataPromise} />
              </Suspense>
            )}
          </Stack>
        </Stack>

        {tabs.length > 1 && (
          <UnderlineNav
            aria-label={t('tabs.ariaLabel')}
            className={styles.tabs}
          >
            {tabs.map((tab, index) => {
              return (
                <UnderlineNav.Item
                  aria-current={index === activeIndex ? 'page' : undefined}
                  key={tab.label}
                  onSelect={(event) => {
                    event.preventDefault();
                    setActiveIndex(index);
                  }}
                >
                  {tab.label}
                </UnderlineNav.Item>
              );
            })}
          </UnderlineNav>
        )}

        <article>
          <Stack
            alignItems="flex-start"
            direction="horizontal"
            gap={32}
            justifyContent="space-around"
            padding="none"
          >
            <Prose
              filePath={activeTab?.filePath ?? ''}
              markdown={activeTab?.content.markdown ?? ''}
              owner={owner}
              repo={repo}
            />
            <Toc
              headings={tocHeadings}
              variant="column"
            />
          </Stack>
        </article>
      </Stack>
    </main>
  );
};
