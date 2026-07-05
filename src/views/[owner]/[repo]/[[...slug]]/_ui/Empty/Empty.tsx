'use client';

import { SearchIcon } from '@primer/octicons-react';
import { Box, Heading, Text } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import styles from './Empty.module.scss';

interface EmptyProps {
  owner: string;
  repo: string;
}

export const Empty = ({ owner, repo }: EmptyProps) => {
  const t = useTranslations('OwnerRepoSlugPage.Empty');

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
        {t.rich('description', {
          code: (chunks) => {
            return <code>{chunks}</code>;
          },
        })}
      </Text>
    </Box>
  );
};
