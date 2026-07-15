'use client';

import { ArrowRightIcon, ClockIcon, FileIcon, StarFillIcon } from '@primer/octicons-react';
import { useFormatter, useNow, useTranslations } from 'next-intl';

import type { RepositoryMetadata } from '@/features/repository-metadata/api';
import { Link } from '@/shared/i18n/navigation';

import styles from './RepositoryCard.module.scss';

interface RepositoryCardProps {
  repositoryMetadata: RepositoryMetadata;
}

export const RepositoryCard = ({ repositoryMetadata }: RepositoryCardProps) => {
  const { description, owner, rank, repo, skillCount, starCount, updatedAt } = repositoryMetadata;
  const t = useTranslations('HomePage.RepositorySection');
  const format = useFormatter();
  const now = useNow();

  return (
    <Link className={styles.container} href={`/${owner}/${repo}`}>
      {rank ? (
        <span className={styles.badge} data-rank={rank}>
          <StarFillIcon size={15} />
          {rank}
        </span>
      ) : null}
      <div className={styles.clip}>
        <div className={styles.body}>
          <img
            alt=""
            className={styles.avatar}
            height={40}
            loading="lazy"
            src={`https://github.com/${owner}.png?size=80`}
            width={40}
          />
          <div className={styles.text}>
            <h3 className={styles.title}>
              <span className={styles.owner}>{owner}/</span>
              {repo}
            </h3>
            {description ? <p className={styles.description}>{description}</p> : null}
            <div className={styles.meta}>
              <span className={styles.skillChip}>
                <FileIcon size={12} />
                {t('skillCount', { count: skillCount })}
              </span>
              <span className={styles.chip}>
                <StarFillIcon className={styles.starIcon} size={12} />
                {format.number(starCount, { notation: 'compact' })}
              </span>
              {updatedAt ? (
                <span className={styles.chip}>
                  <ClockIcon size={12} />
                  {format.relativeTime(new Date(updatedAt), now)}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div aria-hidden className={styles.overlay}>
          <span className={styles.title}>
            <span className={styles.owner}>{owner}/</span>
            {repo}
          </span>
          <span className={styles.arrow}>
            <ArrowRightIcon size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
};
