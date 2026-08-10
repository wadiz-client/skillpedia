'use client';

import { Suspense } from 'react';

import { MarkGithubIcon } from '@primer/octicons-react';
import { Select } from '@primer/react';
import { useLocale, useTranslations } from 'next-intl';

import type { RepositoryTreeNode } from '@/features/repository-tree/api';
import { Link, usePathname, useRouter } from '@/shared/i18n/navigation';
import { routing } from '@/shared/i18n/routing';
import type { Locale } from '@/shared/i18n/routing';
import { ClaudeCodeSymbolMark } from '@/shared/ui';

import { SidePanel } from './SidePanel';
import { SymbolMark } from './SymbolMark';
import { ThemeToggle } from './ThemeToggle';

import styles from './Header.module.scss';

interface HeaderProps {
  owner?: string;
  repo?: string;
  treeNodesPromise?: Promise<RepositoryTreeNode[]>;
}

// 로케일별 표시 이름입니다.
const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
};

const FALLBACK_REPOSITORY_PATH = 'aroundus/skillpedia';

export const Header = ({ owner, repo, treeNodesPromise }: HeaderProps) => {
  const t = useTranslations('Layout.Header');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const repositoryPath = owner && repo ? `${owner}/${repo}` : FALLBACK_REPOSITORY_PATH;

  const handleChangeLocale: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    router.replace(pathname, { locale: event.target.value as Locale });
  };

  const handleLogoMouseEnter: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    const svg = event.currentTarget.querySelector('svg');

    if (svg === null || svg.getAnimations().length > 0) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // 심벌마크 회전 애니메이션
    svg.animate(
      [
        { transform: 'rotate(0deg) scale(1)' },
        { offset: 0.6, transform: 'rotate(180deg) scale(1.18)' },
        { transform: 'rotate(360deg) scale(1)' },
      ],
      { duration: 750, easing: 'cubic-bezier(0.34, 1.2, 0.64, 1)' },
    );
  };

  return (
    <header className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link
            className={styles.logo}
            href="/"
            onMouseEnter={handleLogoMouseEnter}
          >
            <SymbolMark />
            <span className={styles.title}>Skillpedia</span>
          </Link>

          <span className={styles.tagline}>
            for
            <ClaudeCodeSymbolMark />
            Claude Code
          </span>
        </div>

        <div className={styles.actions}>
          <Select
            aria-label={t('language.ariaLabel')}
            value={locale}
            onChange={handleChangeLocale}
          >
            {routing.locales.map((item) => {
              return (
                <Select.Option
                  key={item}
                  value={item}
                >
                  {LOCALE_LABELS[item]}
                </Select.Option>
              );
            })}
          </Select>

          <ThemeToggle />

          <a
            aria-label={t('repository.ariaLabel', { repository: repositoryPath })}
            className={styles.link}
            href={`https://github.com/${repositoryPath}`}
            rel="noreferrer"
            target="_blank"
          >
            <MarkGithubIcon size={20} />
          </a>

          {/* 트리 조회가 헤더 렌더링을 막지 않도록 SidePanel만 지연해서 노출합니다. */}
          {owner && repo && treeNodesPromise && (
            <Suspense>
              <SidePanel
                owner={owner}
                repo={repo}
                treeNodesPromise={treeNodesPromise}
              />
            </Suspense>
          )}
        </div>
      </div>
    </header>
  );
};
