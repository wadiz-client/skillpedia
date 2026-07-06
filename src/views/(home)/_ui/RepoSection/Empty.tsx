'use client';

import { RepoIcon } from '@primer/octicons-react';
import { Box, Heading, Text } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import styles from './Empty.module.scss';

export const Empty = () => {
  const t = useTranslations('HomePage.RepoSection.Empty');

  return (
    <Box className={styles.container}>
      <RepoIcon size={48} />
      <Heading
        as="h3"
        size="5"
        weight="bold"
      >
        {t('title')}
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
