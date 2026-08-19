'use client';

import { GitCommitIcon } from '@primer/octicons-react';
import { Avatar, AvatarStack, RelativeTime } from '@primer/react';
import { Text } from '@primer/react-brand';
import { useFormatter, useNow, useTranslations } from 'next-intl';

import type { RepositoryFileMetadata } from '@/features/repository-metadata/api';

import styles from './ArticleMetadata.module.scss';

interface ArticleMetadataProps {
  metadata: RepositoryFileMetadata;
}

const AVATAR_LIMIT_COUNT = 3;

export const ArticleMetadata = ({ metadata }: ArticleMetadataProps) => {
  const t = useTranslations('OwnerRepoSlugPage.ArticleMetadata');
  const formatter = useFormatter();
  const now = useNow();

  const committedAt = new Date(metadata.committedAt);
  const avatarContributors = metadata.contributors
    .filter((contributor) => {
      return Boolean(contributor.avatarUrl);
    })
    .slice(0, AVATAR_LIMIT_COUNT);

  return (
    <div className={styles.container}>
      {avatarContributors.length > 0 && (
        <AvatarStack
          className={styles.avatarStack}
          size={24}
        >
          {avatarContributors.map((contributor) => {
            return (
              <Avatar
                alt=""
                key={contributor.name}
                size={24}
                src={contributor.avatarUrl}
              />
            );
          })}
        </AvatarStack>
      )}

      <Text
        as="span"
        className={styles.author}
        size="100"
        variant="muted"
      >
        {t.rich('description', {
          authorName: metadata.contributors[0]?.name ?? '',
          name: (chunks) => {
            return <span className={styles.name}>{chunks}</span>;
          },
          otherCount: Math.max(metadata.contributors.length - 1, 0),
          time: () => {
            return (
              // 자식을 비우면 영어 일시를, format을 비우면 오래된 커밋을 일시로 노출합니다.
              <RelativeTime
                className={styles.committedAt}
                date={committedAt}
                format="relative"
                title={formatter.dateTime(committedAt, { dateStyle: 'full', timeStyle: 'short' })}
              >
                {formatter.relativeTime(committedAt, now)}
              </RelativeTime>
            );
          },
        })}
      </Text>

      <a
        className={styles.commit}
        href={metadata.htmlUrl}
        rel="noreferrer"
        target="_blank"
        title={metadata.message}
      >
        <GitCommitIcon size={12} />
        <span className={styles.message}>{metadata.message}</span>
      </a>
    </div>
  );
};
