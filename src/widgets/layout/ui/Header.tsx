'use client';

import { MoonIcon, SunIcon } from '@primer/octicons-react';
import { Select } from '@primer/react';
import { useLocale, useTranslations } from 'next-intl';

import { useColorMode } from '@/app/providers';
import { Link, usePathname, useRouter } from '@/shared/i18n/navigation';
import { routing } from '@/shared/i18n/routing';
import type { Locale } from '@/shared/i18n/routing';

import styles from './Header.module.scss';

// 로케일별 표시 이름입니다.
const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
};

export const Header = () => {
  const t = useTranslations('Layout.Header');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  const handleChangeLocale: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    router.replace(pathname, { locale: event.target.value as Locale });
  };

  return (
    <header className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link className={styles.logo} href="/">
            <svg aria-hidden fill="currentColor" height="24" viewBox="0 0 512 512" width="24">
              <g transform="translate(256, 256)">
                <rect height="88" width="176" x="-220" y="-176" />
                <circle cx="132" cy="-132" r="88" />
                <circle cx="-132" cy="132" r="88" />
                <rect height="88" width="176" x="44" y="88" />
              </g>
            </svg>
            <span className={styles.title}>Skillpedia</span>
          </Link>
        </div>

        <div className={styles.actions}>
          <Select aria-label={t('language.ariaLabel')} value={locale} onChange={handleChangeLocale}>
            {routing.locales.map((item) => {
              return (
                <Select.Option key={item} value={item}>
                  {LOCALE_LABELS[item]}
                </Select.Option>
              );
            })}
          </Select>

          <button
            aria-label={t('theme.ariaLabel', { colorMode })}
            className={styles.themeToggle}
            type="button"
            onClick={toggleColorMode}
          >
            {colorMode === 'light' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};
