'use client';

import Link from 'next/link';

import { ActionList } from '@primer/react';
import { Box, Grid, Heading, Section, Text } from '@primer/react-brand';

import type { RepoGroup } from '../../_lib';

import styles from './RepoSection.module.scss';

interface RepoSectionProps {
  repoGroups: RepoGroup[];
}

export const RepoSection = ({ repoGroups }: RepoSectionProps) => {
  return (
    <Section
      as="section"
      className={styles.section}
      paddingBlockEnd="spacious"
      paddingBlockStart="spacious"
    >
      <Box paddingInlineEnd={40} paddingInlineStart={40}>
        <Heading as="h2" size="5" weight="bold">
          저장소 둘러보기
        </Heading>

        <Grid style={{ marginTop: 40 }}>
          {repoGroups.map((group) => {
            return (
              <Grid.Column key={group.name} span={{ xsmall: 12, small: 6, medium: 4, large: 3 }}>
                <ActionList>
                  <ActionList.Group>
                    <ActionList.GroupHeading as="h3">{group.name}</ActionList.GroupHeading>
                    {group.repos.map((repo) => {
                      return (
                        <ActionList.LinkItem as={Link} href={`/${repo}`} key={repo}>
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
      </Box>
    </Section>
  );
};
