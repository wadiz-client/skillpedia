'use client';

import { useEffect, useRef, useState } from 'react';

import { ArrowRightIcon, ClockIcon, FileIcon, StarFillIcon } from '@primer/octicons-react';
import { Label } from '@primer/react';
import { Avatar } from '@primer/react-brand';
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
  const containerRef = useRef<HTMLAnchorElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 카드가 뷰포트에 들어오는 시점에 진입 애니메이션을 재생합니다.
  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.15 },
      );

      observer.observe(container);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <Link
      className={styles.container}
      data-visible={isVisible}
      href={`/${owner}/${repo}`}
      ref={containerRef}
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
