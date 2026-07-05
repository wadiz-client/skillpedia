'use client';

import { useState } from 'react';

import { UnderlineNav } from '@primer/react';
import { Breadcrumbs, Heading, Stack, Text } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import type { ArticleContent, Breadcrumb } from '../../_lib';
import { Prose } from '../Prose';
import { Toc } from '../Toc';

import styles from './Article.module.scss';

export interface ArticleTab {
  content: ArticleContent;
  label: 'README' | 'SKILL';
}

interface ArticleProps {
  breadcrumbs: Breadcrumb[];
  tabs: ArticleTab[];
  title: string;
  description?: string;
}

export const Article = ({ breadcrumbs, tabs, title, description }: ArticleProps) => {
  const t = useTranslations('OwnerRepoSlugPage.Article');
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = tabs[activeIndex] ?? tabs[0];

  // 목차에는 h2, h3만 노출합니다.
  const tocHeadings = (activeTab?.content.headings ?? []).filter((heading) => {
    return heading.depth === 2 || heading.depth === 3;
  });

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

        <Stack gap="spacious" padding="none">
          <Stack gap="normal" padding="none">
            <Heading as="h1" size="2" weight="bold">
              {title}
            </Heading>
            {description && (
              <Text as="p" size="300" variant="muted">
                {description}
              </Text>
            )}
          </Stack>
        </Stack>

        {tabs.length > 1 && (
          <UnderlineNav aria-label={t('tabs.ariaLabel')}>
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
            <Prose markdown={activeTab?.content.markdown ?? ''} />
            <Toc headings={tocHeadings} />
          </Stack>
        </article>
      </Stack>
    </main>
  );
};
