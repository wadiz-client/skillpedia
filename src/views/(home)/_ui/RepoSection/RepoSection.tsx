'use client';

import { RepoIcon } from '@primer/octicons-react';
import { ActionList } from '@primer/react';
import { Blankslate } from '@primer/react/experimental';
import { Box, Grid, Heading, Section, Text } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';

import type { RepoGroup } from '../../_lib';

import styles from './RepoSection.module.scss';

interface RepoSectionProps {
  repoGroups: RepoGroup[];
}

export const RepoSection = ({ repoGroups }: RepoSectionProps) => {
  const t = useTranslations('HomePage.RepoSection');

  return (
    <Section
      as="section"
      className={styles.section}
      paddingBlockEnd="spacious"
      paddingBlockStart="spacious"
    >
      <Box
        paddingInlineEnd={40}
        paddingInlineStart={40}
      >
        <Heading
          as="h2"
          size="5"
          weight="bold"
        >
          {t('title')}
        </Heading>

        {repoGroups.length > 0 ? (
          <Grid style={{ marginTop: 40 }}>
            {repoGroups.map((group) => {
              return (
                <Grid.Column
                  key={group.name}
                  span={{ xsmall: 12, small: 6, medium: 4, large: 3 }}
                >
                  <ActionList>
                    <ActionList.Group>
                      <ActionList.GroupHeading as="h3">{group.name}</ActionList.GroupHeading>
                      {group.repos.map((repo) => {
                        return (
                          <ActionList.LinkItem
                            as={Link}
                            href={`/${repo}`}
                            key={repo}
                          >
                            <Text size="200">{repo}</Text>
                          </ActionList.LinkItem>
                        );
                      })}
                    </ActionList.Group>
                  </ActionList>
                </Grid.Column>
              );
            })}
          </Grid>
        ) : (
          <Blankslate
            narrow
            spacious
          >
            <Blankslate.Visual>
              <RepoIcon size="medium" />
            </Blankslate.Visual>
            <Blankslate.Heading as="h2">{t('Empty.title')}</Blankslate.Heading>
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
