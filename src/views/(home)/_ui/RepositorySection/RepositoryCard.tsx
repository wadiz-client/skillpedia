'use client';

import { ArrowRightIcon, ClockIcon, FileIcon, StarFillIcon } from '@primer/octicons-react';
import { Label } from '@primer/react';
import { Avatar, useAnimation } from '@primer/react-brand';
import classNames from 'classnames';
import { useFormatter, useNow, useTranslations } from 'next-intl';

import type { RepositoryMetadata } from '@/features/repository-metadata/api';
import { Link } from '@/shared/i18n/navigation';

import styles from './RepositoryCard.module.scss';

interface RepositoryCardProps {
  index: number;
  repositoryMetadata: RepositoryMetadata;
}

export const RepositoryCard = ({ index, repositoryMetadata }: RepositoryCardProps) => {
  const { description, owner, rank, repo, skillCount, starCount, updatedAt } = repositoryMetadata;
  const t = useTranslations('HomePage.RepositorySection');
  const format = useFormatter();
  const now = useNow();

  const { classes: animationClasses, styles: animationStyles } = useAnimation({
    delay: (index % 4) * 100,
    variant: 'slide-in-up',
  });

  return (
    <Link
      className={classNames(styles.container, animationClasses)}
      href={`/${owner}/${repo}`}
      style={animationStyles}
    >
      {rank ? (
        <span
          className={styles.badge}
          data-rank={rank}
        >
          <StarFillIcon size={15} />
          {rank}
        </span>
      ) : null}
      <div className={styles.content}>
        <div className={styles.inner}>
          <div className={styles.top}>
            <h3 className={styles.title}>
              <span className={styles.owner}>{owner}/</span>
              {repo}
            </h3>
            <Avatar
              alt=""
              className={styles.avatar}
              loading="lazy"
              shape="square"
              size={40}
              src={`https://github.com/${owner}.png?size=80`}
            />
          </div>
          <div className={styles.middle}>
            {description ? <p className={styles.description}>{description}</p> : null}
          </div>
          <div className={styles.bottom}>
            <Label
              className={styles.label}
              size="large"
              variant="success"
            >
              <FileIcon size={12} />
              {t('skillCount', { count: skillCount })}
            </Label>
            <Label
              className={styles.label}
              size="large"
              variant="secondary"
            >
              <StarFillIcon
                className={styles.starIcon}
                size={12}
              />
              {format.number(starCount, { notation: 'compact' })}
            </Label>
            {updatedAt ? (
              <Label
                className={styles.label}
                size="large"
                variant="secondary"
              >
                <ClockIcon size={12} />
                {format.relativeTime(new Date(updatedAt), now)}
              </Label>
            ) : null}
          </div>
        </div>
        <div
          aria-hidden
          className={styles.overlay}
        >
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
