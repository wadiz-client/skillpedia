'use client';

import { SearchIcon } from '@primer/octicons-react';
import { Box, Heading, Text } from '@primer/react-brand';

import styles from './Empty.module.scss';

interface EmptyProps {
  owner: string;
  repo: string;
}

export const Empty = ({ owner, repo }: EmptyProps) => {
  return (
    <Box className={styles.container}>
      <SearchIcon size={64} />
      <Heading
        as="h2"
        size="4"
        weight="bold"
      >
        {owner}/{repo}
      </Heading>
      <Text
        as="p"
        size="300"
        variant="muted"
      >
        <code>SKILL.md</code> 문서를 찾을 수 없습니다.
      </Text>
    </Box>
  );
};
